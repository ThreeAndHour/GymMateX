/* ThB.Ho YouTube playlist player for the vertical phone frame.
   Markup: <div class="ytpl" data-list="PLAYLIST_ID" data-title="..."></div>
   Uses the YouTube IFrame API so a video YouTube refuses to play for this viewer
   (region, music rights, age check, embedding off) is skipped automatically
   instead of showing "Video unavailable". If nothing plays, a link to YouTube is shown. */
(function(){
 var boxes=[].slice.call(document.querySelectorAll('.ytpl[data-list]')); if(!boxes.length)return;
 function fallback(box){
  var l=box.getAttribute('data-list');
  box.innerHTML='<a class="ytpl-fb" href="https://www.youtube.com/playlist?list='+l+'" target="_blank" rel="noopener"><b>▶</b><span>YouTube ↗</span></a>';
 }
 function build(box,i){
  var id='ytpl'+i, list=box.getAttribute('data-list'), errs=0, total=0;
  var holder=document.createElement('div'); holder.id=id; box.appendChild(holder);
  var p=new YT.Player(id,{
   host:'https://www.youtube-nocookie.com', width:'100%', height:'100%',
   playerVars:{listType:'playlist',list:list,rel:0,playsinline:1,modestbranding:1},
   events:{
    onReady:function(){try{total=(p.getPlaylist()||[]).length||12}catch(e){total=12}
     var f=box.querySelector('iframe'); if(f){f.title=box.getAttribute('data-title')||'YouTube playlist';f.setAttribute('referrerpolicy','strict-origin-when-cross-origin')}},
    onStateChange:function(e){if(e.data===1)errs=0},
    onError:function(){errs++; if(errs>=Math.max(total,1)){fallback(box);return} try{p.nextVideo()}catch(e){fallback(box)}}
   }
  });
 }
 function start(){boxes.forEach(build)}
 if(window.YT&&YT.Player){start();return}
 var prev=window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady=function(){if(prev)prev();start()};
 var s=document.createElement('script'); s.src='https://www.youtube.com/iframe_api'; s.async=true;
 s.onerror=function(){boxes.forEach(fallback)}; document.head.appendChild(s);
})();
