if(new URLSearchParams(location.search).get('embed')==='1'){
 const style=document.createElement('style');
 style.textContent='header,.skip-link,.proof,.adslot,footer,main>section:not(#scanner):not(#scan),body>.modal{display:none!important}body .hero{display:block;padding:18px 0}#scanner>div:first-child{display:none}.scan{margin:18px auto!important}.wrap{width:calc(100% - 24px)}';
 document.head.appendChild(style);
 // The results live outside main in this build; keep them visible when selected.
 const scan=document.getElementById('scan');
 const send=()=>parent.postMessage({type:'metwipe:height',height:document.documentElement.scrollHeight},location.origin);
 new ResizeObserver(send).observe(document.body);send();
}
