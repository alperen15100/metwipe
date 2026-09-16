if(new URLSearchParams(location.search).get('embed')==='1'){
 const style=document.createElement('style');
 style.textContent='header,.skip-link,.proof,.adslot,footer,main>section:not(#scanner):not(#scan),body>.modal{display:none!important}body .hero{display:block;padding:18px 0}#scanner>div:first-child{display:none}.scan{margin:18px auto!important}.wrap{width:calc(100% - 24px)}';
 document.head.appendChild(style);
 const scan=document.getElementById('scan');
 const send=()=>parent.postMessage({type:'metwipe:height',height:document.documentElement.scrollHeight},location.origin);
 new ResizeObserver(send).observe(document.body);send();
}

/* MetWipe extended metadata support.
   Loaded after the core scanner and extends the existing Scan -> Detect -> Clean -> Verify pipeline. */
(()=>{
 const readLE32=(a,o)=>(a[o]|(a[o+1]<<8)|(a[o+2]<<16)|(a[o+3]<<24))>>>0;
 const txt=(a,o,n)=>{let s='';for(let i=0;i<n&&o+i<a.length;i++)s+=String.fromCharCode(a[o+i]);return s};
 const isDigits=s=>/^\d+$/.test(s);

 function mp3Layout(buf){
  const a=new Uint8Array(buf);let start=0,end=a.length,blocks=[];
  if(a.length>=10&&txt(a,0,3)==='ID3'){
   const size=10+syncsafe(a,6)+(a[3]===4&&(a[5]&16)?10:0);
   if(size>a.length)throw Error('Malformed ID3 tag size');start=size;blocks.push('ID3v2');
  }
  if(end>=128&&txt(a,end-128,3)==='TAG'){end-=128;blocks.push('ID3v1')}

  if(end>=32&&txt(a,end-32,8)==='APETAGEX'){
   const footer=end-32,size=readLE32(a,footer+12),flags=readLE32(a,footer+20);
   if(size<32||size>end-start)throw Error('Malformed APEv2 tag size');
   let apeStart=end-size;
   const headerFlag=(flags&0x80000000)!==0;
   if(headerFlag&&apeStart>=32&&txt(a,apeStart-32,8)==='APETAGEX')apeStart-=32;
   end=apeStart;blocks.push('APEv2');
  }

  if(end>=15&&txt(a,end-9,9)==='LYRICS200'){
   const sizeText=txt(a,end-15,6);
   if(isDigits(sizeText)){
    const bodySize=Number(sizeText),lyrStart=end-(bodySize+15);
    if(bodySize>=11&&lyrStart>=start&&txt(a,lyrStart,11)==='LYRICSBEGIN'){
     end=lyrStart;blocks.push('Lyrics3v2');
    }
   }
  } else if(end>=9&&txt(a,end-9,9)==='LYRICSEND'){
   const floor=Math.max(start,end-5110);let found=-1;
   for(let i=end-20;i>=floor;i--)if(txt(a,i,11)==='LYRICSBEGIN'){found=i;break}
   if(found>=0){end=found;blocks.push('Lyrics3v1')}
  }
  if(start>end)throw Error('Malformed MP3 metadata layout');
  return{start,end,blocks};
 }

 /* The UI calls parseMP3(), while older cleaning code also calls parseMP3Blocks().
    Extend both so scan, clean and verification all inspect the same metadata types. */
 const baseParseMP3=parseMP3;
 parseMP3=function(buf){
  const parsed=baseParseMP3(buf),m=mp3Layout(buf);
  parsed.blocks=m.blocks;
  parsed.v2size=m.start;
  parsed.audioEnd=m.end;
  return parsed;
 };
 parseMP3Blocks=function(buf){
  const m=mp3Layout(buf);
  return{format:'MP3',blocks:m.blocks,v2size:m.start,audioEnd:m.end};
 };
 stripMP3=function(buf){
  const a=new Uint8Array(buf),m=mp3Layout(buf);
  return new Blob([a.slice(m.start,m.end)],{type:'audio/mpeg'});
 };

 const baseParseOOXML=parseOOXML;
 parseOOXML=async function(buf){
  const parsed=await baseParseOOXML(buf),entries=parsed.entries;
  const custom=entries.find(e=>e.name==='docProps/custom.xml');
  if(custom){
   const xml=new DOMParser().parseFromString(new TextDecoder().decode(custom.data),'application/xml');
   if(!xml.querySelector('parsererror')){
    const props=[...xml.getElementsByTagName('*')].filter(n=>n.localName==='property');
    if(props.length){
     parsed.blocks.push('Custom document properties');
     for(const p of props){
      const name=p.getAttribute('name')||'Custom property';
      const value=(p.textContent||'').trim();
      parsed.fields.push([name,value||'Present']);
     }
    }
   }
  }
  return parsed;
 };

 stripOOXML=async function(buf){
  const parsed=await parseOOXML(buf),entries=parsed.entries;
  const coreNames=new Set(['creator','lastModifiedBy','title','subject','description','keywords','category','contentStatus','revision','created','modified']);
  const appNames=new Set(['Company','Manager','Template','Application','AppVersion','TotalTime']);
  for(const e of entries){
   if(e.name==='docProps/core.xml'){
    const xml=new DOMParser().parseFromString(new TextDecoder().decode(e.data),'application/xml');
    if(xml.querySelector('parsererror'))throw Error('Invalid document properties XML');
    for(const node of [...xml.getElementsByTagName('*')])if(coreNames.has(node.localName))node.remove();
    e.data=new TextEncoder().encode(new XMLSerializer().serializeToString(xml));
   }
   if(e.name==='docProps/app.xml'){
    const xml=new DOMParser().parseFromString(new TextDecoder().decode(e.data),'application/xml');
    if(xml.querySelector('parsererror'))throw Error('Invalid application properties XML');
    for(const node of [...xml.getElementsByTagName('*')])if(appNames.has(node.localName))node.textContent='';
    e.data=new TextEncoder().encode(new XMLSerializer().serializeToString(xml));
   }
   if(e.name==='docProps/custom.xml'){
    const xml=new DOMParser().parseFromString(new TextDecoder().decode(e.data),'application/xml');
    if(xml.querySelector('parsererror'))throw Error('Invalid custom properties XML');
    for(const node of [...xml.getElementsByTagName('*')].filter(n=>n.localName==='property'))node.remove();
    e.data=new TextEncoder().encode(new XMLSerializer().serializeToString(xml));
   }
  }
  return await makeZipFromRaw(entries);
 };
})();
