/* Read-only metadata details. Output is escaped by the application renderer. */
function decodeTag(bytes) {
 if (!bytes.length) return '';
 const encoding=bytes[0];let data=bytes.slice(1),name=encoding===3?'utf-8':encoding===2?'utf-16be':encoding===1?'utf-16le':'windows-1252';
 if(encoding===1&&data[0]===254&&data[1]===255)name='utf-16be';
 try{return new TextDecoder(name).decode(data).replace(/\0/g,' ').trim()}catch{return ''}
}
function parseMP3(buf) {
 const result=parseMP3Blocks(buf),a=new Uint8Array(buf),fields=[];
 const labels={TIT2:'Title',TPE1:'Artist',TALB:'Album',TDRC:'Date',TYER:'Year',TRCK:'Track',TCON:'Genre',TCOP:'Copyright',TENC:'Encoded by'};
 // Only decode uncompressed, non-unsynchronised ID3v2.3/2.4 text frames.
 // Other ID3 blocks are still detected and removed by the existing cleaner.
 if(result.v2size && [3,4].includes(a[3]) && !(a[5]&0xc0)){
  let o=10,end=Math.min(result.v2size,a.length);
  while(o+10<=end){const id=ascii(a,o,4);if(!/^[A-Z0-9]{4}$/.test(id))break;
   const size=a[3]===4?syncsafe(a,o+4):be32(a,o+4);if(size<=0||o+10+size>end)break;
   if(labels[id]&&a[o+9]===0){const value=decodeTag(a.slice(o+10,o+10+size));if(value)fields.push([labels[id],value])}o+=10+size;
  }
 }
 if(result.blocks.includes('ID3v1')){
  const o=a.length-128;
  for(const [label,start,len] of [['Title',3,30],['Artist',33,30],['Album',63,30],['Year',93,4]]){
   const value=new TextDecoder('windows-1252').decode(a.slice(o+start,o+start+len)).replace(/\0/g,'').trim();
   if(value&&!fields.some(x=>x[0]===label))fields.push([label,value]);
  }
 }
 return {...result,fields};
}
function officeFields(entries){
 const fields=[];
 const names={creator:'Author',lastModifiedBy:'Last modified by',title:'Title',subject:'Subject',description:'Description',keywords:'Keywords',category:'Category',contentStatus:'Content status',revision:'Revision',created:'Created',modified:'Modified',Company:'Company',Manager:'Manager'};
 for(const entry of entries){
  if(!['docProps/core.xml','docProps/app.xml'].includes(entry.name))continue;
  const xml=new DOMParser().parseFromString(new TextDecoder().decode(entry.data),'application/xml');
  if(xml.querySelector('parsererror'))throw Error('Invalid document properties XML');
  for(const node of xml.getElementsByTagName('*')){
   if(names[node.localName]&&node.textContent.trim())fields.push([names[node.localName],node.textContent.trim()]);
  }
 }
 return fields;
}
function scopeNote(kind){
 const detail=['docx','xlsx','pptx'].includes(kind)?'Checks cover selected core properties plus Company and Manager. Comments, tracked changes, custom properties, embedded files and visible document content are not removed.':kind==='mp3'?'Checks cover supported ID3v1 and ID3v2 tags. Other tag formats and the audio content are not inspected. Removing a tag does not change copyright ownership.':'Checks cover supported metadata only. Visible content and unsupported metadata may still reveal personal information.';
 return '<p style="color:#aab3c2;font-size:12px;line-height:1.6">'+detail+'</p>';
}
function metadataTable(meta){
 const fields=meta.fields||[];
 if(!fields.length)return '<p style="color:#aab3c2;font-size:12px">No supported field values available to display. Detected blocks are listed above.</p>';
 return '<h3>Detected field values</h3>'+fields.map(([name,value])=>'<div class="row" style="opacity:1;transform:none"><div class="key">'+esc(name)+'</div><div class="val">'+esc(value)+'</div></div>').join('');
}
function comparisonTable(before,after){
 const rows=(before.fields||[]).map(([name,value])=>[name,value,(after.fields||[]).find(x=>x[0]===name)?.[1]||'Removed']);
 for(const block of before.blocks||[])rows.push([block,'Detected',(after.blocks||[]).includes(block)?'Still detected':'Removed']);
 if(!rows.length)return '<p>No supported metadata was detected before or after processing.</p>';
 return '<h3>Before / after</h3><div style="overflow-x:auto"><table style="width:100%;text-align:left;font-size:12px;border-spacing:0 12px"><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(v=>'<td style="padding:6px;overflow-wrap:anywhere">'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
}
async function inspectMetadata(buf,kind){
 if(kind==='mp3')return parseMP3(buf);
 if(kind==='wav')return parseWAV(buf);
 if(kind==='png')return parsePNG(buf);
 if(kind==='webp')return parseWebP(buf);
 return parseOOXML(buf);
}
