window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.data?.type!=='metwipe:height')return;
 const height=Number(event.data.height);if(!Number.isFinite(height))return;
 for(const frame of document.querySelectorAll('#local-tool iframe')){
  if(frame.contentWindow===event.source)frame.style.height=Math.max(360,Math.min(12000,height))+'px';
 }
});
