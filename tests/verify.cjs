const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {JSDOM}=require(process.env.MW_JSDOM_PATH||'jsdom');
let source=fs.readFileSync('index.html','utf8');const old=cp.execFileSync('git',['show','811d67d64b1ce74889f92d6013450ef5ff98b833:index.html'],{encoding:'utf8'});
const engine=s=>s.slice(s.indexOf('function text('),s.indexOf('/* Lightweight uploader'));
assert.equal(engine(source),engine(old),'Existing engine changed');
source=source.replace(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,(a,p)=>p==='metadata-details.js'?'<script>'+fs.readFileSync(p,'utf8')+'</script>':'').replace(/<script>if\(new URLSearchParams[\s\S]*?<\/script>/,'');
const dom=new JSDOM(source,{url:'https://metwipe.com',runScripts:'dangerously',beforeParse(w){for(const k of ['Blob','Response','TextEncoder','TextDecoder','CompressionStream','DecompressionStream'])w[k]=global[k];w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.alert=()=>{};w.URL.createObjectURL=()=>'';w.URL.revokeObjectURL=()=>{};}});
const w=dom.window;async function run(){
for(const ext of ['jpg','png','webp','mp3','wav','docx','xlsx','pptx']){
 const b=fs.readFileSync('/workspace/scratch/mw-fixtures/sample.'+ext),buf=b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),kind=ext==='jpg'?'jpeg':ext;
 const before=(kind==='jpeg'?w.parse(buf):await w.inspectMetadata(buf,kind));assert(before.blocks.length,'fixture must contain metadata '+ext);
 const f={name:'sample.'+ext,type:ext==='jpg'?'image/jpeg':'',arrayBuffer:async()=>buf};const out=await w.cleanAny(f),ab=await out.blob.arrayBuffer();
 const after=(kind==='jpeg'?w.parse(ab):await w.inspectMetadata(ab,kind));assert.equal(after.blocks.length,0,ext+' metadata remains');
 if(['docx','xlsx','pptx'].includes(ext)){const a=await w.readZipEntries(buf),c=await w.readZipEntries(ab);for(const e of a.filter(e=>!e.name.startsWith('docProps/')))assert.deepEqual(c.find(x=>x.name===e.name).data,e.data);}
 if(ext==='png'){assert(Buffer.from(ab).includes(Buffer.from('IDAT')))}
 fs.writeFileSync('/workspace/scratch/mw-fixtures/clean.'+ext,Buffer.from(ab));console.log('PASS remove supported metadata and reopen:',ext);
}
assert.throws(()=>w.parsePNG(new Uint8Array([1,2,3]).buffer));assert.throws(()=>w.parseWAV(new Uint8Array([1,2,3]).buffer));
console.log('PASS invalid PNG/WAV rejected; original engine unchanged');dom.window.close();}
run().catch(e=>{console.error(e);dom.window.close();process.exitCode=1});
