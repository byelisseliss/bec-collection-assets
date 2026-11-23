(()=>{'use strict';
if(window.__BEC_LIVING_COLLECTION)return;window.__BEC_LIVING_COLLECTION=true;
const BASE='https://byelisseliss.github.io/bec-collection-assets/';
const rows=[
['showgirl','The Life of a Showgirl','2025','#609986','舞台的光芒之外，還有值得被收藏的片段。'],
['ttpd','The Tortured Poets Department','2024','#99988e','故事在紙張和字句之間，慢慢留下痕跡。'],
['midnights','Midnights','2022','#415477','那些清醒的深夜，也值得好好珍藏。'],
['evermore','evermore','2020','#997b5e','冬日的故事，不在這裡結束。'],
['folklore','folklore','2020','#7e8581','走進樹林，收藏那些安靜的想像。'],
['lover','Lover','2019','#d5b5cc','讓每一種喜歡，都有自己的顏色。'],
['reputation','reputation','2017','#414345','留下自己的聲音，不必向世界解釋。'],
['1989-tv',"1989 (Taylor's Version)",'2023','#81acc5','海風、城市與重新開始的自由。'],
['red-tv',"Red (Taylor's Version)",'2021','#97675d','把熱烈、秋天與告別重新收進收藏。'],
['speak-now-tv',"Speak Now (Taylor's Version)",'2023','#806797','現在，讓沒說完的話完整說出口。'],
['fearless-tv',"Fearless (Taylor's Version)",'2021','#b6a071','金色的勇氣，還在繼續。'],
['debut','Taylor Swift','2006','#779b87','收藏開始的第一頁。']];
const albums=rows.map(([id,title,year,tone,story])=>({id,title,year,tone,story}));
const kind=[['vinyl','黑膠','◉'],['cd','CD','◎'],['cassette','卡帶','▣'],['clothing','服飾','▤'],['accessories','配件','✳'],['collectibles','收藏品','◇'],['home','居家生活','⌂'],['tour','巡演／活動','✦']];
const albumLinks={showgirl:'https://byelisscollection.my1shop.com/TheLifeofaShowgirl',...(window.BEC_TS_ALBUM_URLS||{})};
const typeLinks={...(window.BEC_TS_TYPE_URLS||{})};const coverLinks=window.BEC_TS_IMAGES||{};
const safe=x=>typeof x==='string'&&/^https:\/\//i.test(x)?x:null;
const href=a=>safe(albumLinks[a.id])||BASE+'taylor-discover.html?era='+encodeURIComponent(a.id);
const typeHref=id=>safe(typeLinks[id])||BASE+'taylor-discover.html?type='+encodeURIComponent(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function artUrl(a){
 const own=safe(coverLinks[a.id]);if(own)return Promise.resolve(own);
 const key='bec-ts-art-'+a.id;try{const v=localStorage.getItem(key);if(v)return Promise.resolve(v)}catch(e){}
 return fetch('https://itunes.apple.com/search?term='+encodeURIComponent('Taylor Swift '+a.title)+'&entity=album&country=us&limit=50')
 .then(r=>r.ok?r.json():Promise.reject()).then(d=>{
  const normal=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const list=(d.results||[]).filter(x=>normal(x.artistName).includes('taylorswift')&&x.artworkUrl100);
  const found=list.find(x=>normal(x.collectionName)===normal(a.title))||list.find(x=>normal(x.collectionName).startsWith(normal(a.title)));
  if(!found)return '';
  const url=found.artworkUrl100.replace(/100x100(?:bb)?/,'600x600bb');
  try{localStorage.setItem(key,url)}catch(e){}return url;
 }).catch(()=>'');
}
function art(node,a){artUrl(a).then(url=>{if(!url||!node.isConnected)return;const img=document.createElement('img');img.src=url;img.alt=a.title+' 專輯封面';img.loading='lazy';img.decoding='async';img.onerror=()=>img.remove();node.prepend(img)})}
function create(){
 const root=document.querySelector('#bec-ts-landing');if(!root)return;root.classList.add('bec-world');
 root.innerHTML='<main class="bw-main">'+
 '<div class="bw-top"><span><i class="bw-light"></i> BEC / THE LIVING COLLECTION</span><span>TAYLOR SWIFT &nbsp;·&nbsp; 12 ERAS</span></div>'+
 '<section class="bw-room" id="bw-room"><div class="bw-room-copy"><span>THE COLLECTION / 001</span><h1>Not just<br>to look at.<br><em>To collect.</em></h1><p>不只瀏覽。移動作品、選擇篇章，親手探索想收藏的東西。</p></div>'+
 '<div class="bw-surface" id="bw-surface"><div class="bw-gridline"></div><div class="bw-pieces" id="bw-pieces"></div><span class="bw-help">DRAG THE COVERS &nbsp;·&nbsp; TAP TO EXPLORE</span></div>'+
 '<div class="bw-tools"><button type="button" id="bw-mix">↺ &nbsp; REARRANGE</button><button type="button" id="bw-all">☷ &nbsp; ALL 12 ERAS</button><a href="#bw-objects">EXPLORE OBJECTS ↓</a></div>'+
 '<div class="bw-detail" id="bw-detail" hidden><div class="bw-detail-pane"><div class="bw-detail-top"><span id="bw-count"></span><button id="bw-close" aria-label="關閉" type="button">×</button></div><div class="bw-detail-cover" id="bw-detail-cover"></div><div class="bw-detail-info"><small id="bw-year"></small><h2 id="bw-name"></h2><p id="bw-story"></p><a id="bw-enter">ENTER COLLECTION ↗</a></div></div></div>'+
 '</section>'+
 '<section class="bw-objects" id="bw-objects"><div class="bw-objects-copy"><small>ANOTHER WAY IN / 002</small><h2>Find your<br>kind of Taylor.</h2><p>已經知道想收藏什麼？直接從物件開始。</p></div><div class="bw-object-field" id="bw-object-field"></div></section>'+
 '<footer class="bw-end"><span>CURATED BY BEC / BY ELISS COLLECTION</span><a href="#bw-room">BACK TO THE COLLECTION ↑</a></footer></main>';
 const surface=root.querySelector('#bw-surface'),pieces=root.querySelector('#bw-pieces'),detail=root.querySelector('#bw-detail');
 const spots=[[49,37,-9,1.13],[74,19,14,.78],[25,22,-13,.75],[13,54,11,.82],[84,56,15,.81],[48,78,-5,.72],[65,81,11,.64],[10,18,-12,.6],[91,29,8,.66],[28,79,7,.64],[70,48,-14,.7],[43,12,5,.66]];
 let current=0,drag=null,moved=0,mix=0,layer=70;
 albums.forEach((a,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='bw-piece';btn.dataset.i=i;btn.style.setProperty('--tone',a.tone);btn.setAttribute('aria-label','探索 '+a.title);btn.innerHTML='<span class="bw-sleeve"></span><span class="bw-piece-title">'+esc(a.title)+'</span>';pieces.append(btn);art(btn.querySelector('.bw-sleeve'),a)});
 function scatter(seed){
  pieces.querySelectorAll('.bw-piece').forEach((p,i)=>{
   const [x,y,r,scale]=spots[(i+seed*3)%spots.length];p.dataset.x=x;p.dataset.y=y;p.dataset.r=r;p.dataset.s=scale;p.style.left=x+'%';p.style.top=y+'%';p.style.transform='translate(-50%,-50%) rotate('+r+'deg) scale('+scale+')';p.style.zIndex=i+2;
  });
 }
 function open(i){
  current=i;const a=albums[i];detail.hidden=false;
  root.style.setProperty('--bw-selected',a.tone);
  root.querySelector('#bw-count').textContent='SELECTED / '+String(i+1).padStart(2,'0')+' OF 12';
  root.querySelector('#bw-name').textContent=a.title;root.querySelector('#bw-year').textContent=a.year+' / TAYLOR SWIFT';
  root.querySelector('#bw-story').textContent=a.story;root.querySelector('#bw-enter').href=href(a);
  const view=root.querySelector('#bw-detail-cover');view.replaceChildren();view.style.background='linear-gradient(135deg,'+a.tone+',#1b2420)';art(view,a);
  pieces.querySelectorAll('.bw-piece').forEach((p,j)=>p.classList.toggle('is-active',i===j));
 }
 function close(){detail.hidden=true;pieces.querySelectorAll('.bw-piece').forEach(p=>p.classList.remove('is-active'))}
 root.querySelector('#bw-close').onclick=close;root.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 surface.addEventListener('pointerdown',e=>{
  const p=e.target.closest('.bw-piece');if(!p)return;
  drag={p,id:e.pointerId,x:e.clientX,y:e.clientY,l:parseFloat(p.style.left),t:parseFloat(p.style.top)};moved=0;p.style.zIndex=++layer;p.classList.add('dragging');
  if(e.pointerType!=='touch')p.setPointerCapture(e.pointerId);
 });
 surface.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.hypot(dx,dy));if(moved<6)return;
  drag.p.style.left=Math.max(9,Math.min(91,drag.l+dx/surface.clientWidth*100))+'%';
  drag.p.style.top=Math.max(12,Math.min(88,drag.t+dy/surface.clientHeight*100))+'%';
 });
 function stop(e){if(!drag||e.pointerId!==drag.id)return;const p=drag.p;p.classList.remove('dragging');const i=+p.dataset.i;if(moved<8||(+parseFloat(p.style.left)>35&&+parseFloat(p.style.left)<65&&+parseFloat(p.style.top)>25&&+parseFloat(p.style.top)<70))open(i);drag=null}
 surface.addEventListener('pointerup',stop);surface.addEventListener('pointercancel',stop);
 pieces.addEventListener('click',e=>{if(e.detail===0){const p=e.target.closest('.bw-piece');if(p)open(+p.dataset.i)}});
 root.querySelector('#bw-mix').onclick=()=>{close();scatter(++mix%spots.length)};
 root.querySelector('#bw-all').onclick=()=>{
  const existing=root.querySelector('.bw-index');if(existing){existing.remove();return}
  const panel=document.createElement('div');panel.className='bw-index';
  panel.innerHTML='<div class="bw-index-head">ALL TWELVE ERAS <button type="button" aria-label="關閉目錄">×</button></div>'+
   albums.map((a,i)=>'<button class="bw-index-item" type="button" data-album="'+i+'"><small>'+String(i+1).padStart(2,'0')+'</small><span>'+esc(a.title)+'</span><b>↗</b></button>').join('');
  root.querySelector('.bw-room').append(panel);panel.querySelector('.bw-index-head button').onclick=()=>panel.remove();
  panel.querySelectorAll('[data-album]').forEach(x=>x.onclick=()=>{open(+x.dataset.album);panel.remove()});
 };
 const field=root.querySelector('#bw-object-field');
 kind.forEach(([id,zh,symbol],i)=>{const a=document.createElement('a');a.className='bw-object';a.href=typeHref(id);a.style.setProperty('--index',i);a.innerHTML='<span class="bw-object-symbol">'+esc(symbol)+'</span><strong>'+esc(zh)+'</strong><small>OBJECT '+String(i+1).padStart(2,'0')+'</small><b>↗</b>';field.append(a)});
 scatter(0);
 // A light source follows the pointer in a restrained manner. The paper grain
 // remains fixed, so movement feels like real objects under studio lighting.
 const canHover=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches;
 const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(canHover&&!reducedMotion){
  let queued=false,mx=0,my=0,gx=64,gy=45;
  surface.addEventListener('pointermove',e=>{
   if(drag)return;
   const bounds=surface.getBoundingClientRect();
   mx=Math.max(-1,Math.min(1,((e.clientX-bounds.left)/bounds.width-.5)*2));
   my=Math.max(-1,Math.min(1,((e.clientY-bounds.top)/bounds.height-.5)*2));
   gx=64+mx*17;gy=45+my*12;
   if(queued)return;queued=true;
   requestAnimationFrame(()=>{
    queued=false;
    root.style.setProperty('--bw-mx',mx.toFixed(3));
    root.style.setProperty('--bw-my',my.toFixed(3));
    root.style.setProperty('--bw-glow-x',gx.toFixed(1)+'%');
    root.style.setProperty('--bw-glow-y',gy.toFixed(1)+'%');
   });
  },{passive:true});
  surface.addEventListener('pointerleave',()=>{
   root.style.setProperty('--bw-mx','0');root.style.setProperty('--bw-my','0');
   root.style.setProperty('--bw-glow-x','64%');root.style.setProperty('--bw-glow-y','45%');
  });
 }
 if(location.hash==='#shop-by-type')root.querySelector('#bw-objects').scrollIntoView();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',create,{once:true});else create();
})();