{const f=document.querySelector('#splash .fg'),b=document.getElementById('sb');if(f&&b)b.src=f.src}
draw();
setTimeout(()=>{const sp=document.getElementById('splash');if(sp){sp.classList.add('hide');setTimeout(()=>sp.remove(),600)}},1800);
