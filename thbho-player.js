/* ThB.Ho video player: a poster with a play button that turns into a native <video> on tap.
   THBHO_PLAYER(container, id) renders media for an @widerooms post from x-media.js; returns false if unknown. */
(function(){
 var css='.vp{position:relative;margin:0;background:#000;border-radius:8px;overflow:hidden;max-width:100%}'+
  '.vp.tall{max-height:78vh;aspect-ratio:auto}.vp.tall img,.vp.tall video{max-height:78vh;width:100%;height:auto;object-fit:contain}'+
  '.vp img,.vp video{display:block;width:100%;height:auto}'+
  '.vp button{all:unset;cursor:pointer;display:block;width:100%;position:relative}'+
  '.vp button:focus-visible{outline:2px solid #66FCF1;outline-offset:-2px}'+
  '.vp .vp-play{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(14,11,16,.72);border:1px solid rgba(255,255,255,.25);display:grid;place-items:center;transition:transform .15s,background .15s}'+
  '.vp button:hover .vp-play{transform:scale(1.06);background:rgba(102,252,241,.9)}'+
  '.vp button:hover .vp-play svg{color:#06201E}'+
  '.vp .vp-play svg{width:26px;height:26px;color:#fff;margin-left:4px}'+
  '.vp .vp-photo{display:block}';
 var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 // Start at 720p; switch to the 1080p file when the viewer goes full screen, back to 720p on exit.
 function swapTo(v,url){
  if(!url||v.currentSrc===url||v.src===url)return;
  var t=v.currentTime||0,playing=!v.paused&&!v.ended;
  v.src=url;
  var go=function(){v.removeEventListener('loadedmetadata',go);try{v.currentTime=t}catch(e){}if(playing)v.play&&v.play().catch(function(){})};
  v.addEventListener('loadedmetadata',go);v.load();
 }
 function hdSwap(v,m){
  var fs=function(){return (document.fullscreenElement||document.webkitFullscreenElement)===v||(document.fullscreenElement&&document.fullscreenElement.contains(v))};
  var on=function(){swapTo(v,fs()?m.hd:m.mp4)};
  document.addEventListener('fullscreenchange',on);document.addEventListener('webkitfullscreenchange',on);
  v.addEventListener('webkitbeginfullscreen',function(){swapTo(v,m.hd)});   // iPhone Safari
  v.addEventListener('webkitendfullscreen',function(){swapTo(v,m.mp4)});
 }
 window.THBHO_PLAYER=function(box,id,alt){
  var m=window.THBHO_X&&window.THBHO_X[id]; if(!m||!(m.mp4||m.poster))return false;
  var fig=document.createElement('figure');fig.className='vp'+(m.w&&m.h&&m.h>m.w*1.15?' tall':'');
  if(m.w&&m.h&&!(m.h>m.w*1.15))fig.style.aspectRatio=m.w+'/'+m.h;
  if(!m.mp4){var im=document.createElement('img');im.src=m.poster;im.alt=alt||'';im.loading='lazy';im.className='vp-photo';fig.appendChild(im);box.appendChild(fig);return true;}
  var btn=document.createElement('button');btn.type='button';btn.setAttribute('aria-label','Play');
  btn.innerHTML='<img src="'+m.poster+'" alt="'+(alt||'').replace(/"/g,'')+'" loading="lazy"><span class="vp-play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>';
  btn.addEventListener('click',function(){
   var v=document.createElement('video');v.setAttribute('referrerpolicy','no-referrer');v.controls=true;v.playsInline=true;v.autoplay=true;v.preload='metadata';v.poster=m.poster||'';v.src=m.mp4;
   document.querySelectorAll('.vp video').forEach(function(o){if(o!==v)o.pause()});
   fig.replaceChild(v,btn);v.play&&v.play().catch(function(){});
   if(m.hd)hdSwap(v,m);
  });
  fig.appendChild(btn);box.appendChild(fig);return true;
 };
})();
