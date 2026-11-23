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
const albumTypes=window.BEC_TS_ALBUM_TYPES||{};const albumTypeUrls=window.BEC_TS_ALBUM_TYPE_URLS||{};
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

const DESIGN_KEYS={
 pageBg:'--v-page-bg',stageBg:'--v-stage-bg',sectionBg:'--v-section-bg',tileBg:'--v-tile-bg',
 text:'--v-text',muted:'--v-muted',secondary:'--v-secondary',border:'--v-border',
 buttonBg:'--v-button-bg',buttonText:'--v-button-text',tileHover:'--v-tile-hover',
 font:'--v-font',headingFont:'--v-heading-font',
 heroSize:'--v-hero-size',titleSize:'--v-title-size',typeSize:'--v-type-size',
 cardWidth:'--v-card-width',cardRadius:'--v-card-radius',lift:'--v-lift',
 hoverScale:'--v-hover-scale',shadow:'--v-shadow',stageRadius:'--v-stage-radius',sectionRadius:'--v-section-radius'
};
const DESIGN_NUM={heroSize:[40,110,'px'],titleSize:[18,54,'px'],typeSize:[12,26,'px'],cardWidth:[180,380,'px'],
 cardRadius:[0,34,'px'],lift:[0,35,'px'],hoverScale:[1,1.12,''],shadow:[0,40,''],stageRadius:[0,50,'px'],sectionRadius:[0,50,'px']};
const DESIGN_FONT=['Helvetica,Arial,sans-serif','Arial,Helvetica,sans-serif','Outfit,Arial,sans-serif','Inter,Helvetica,Arial,sans-serif','Georgia,serif','-apple-system,BlinkMacSystemFont,Helvetica,sans-serif'];
function applyDesign(v){
 const root=document.getElementById('bec-ts-landing');if(!root||!v||typeof v!=='object')return;
 for(const [key,css] of Object.entries(DESIGN_KEYS)){
  const value=v[key];if(value==null)continue;
  if(DESIGN_NUM[key]){const [min,max,unit]=DESIGN_NUM[key],n=Number(value);if(Number.isFinite(n))root.style.setProperty(css,Math.max(min,Math.min(max,n))+unit)}
  else if(key==='font'||key==='headingFont'){if(DESIGN_FONT.includes(value))root.style.setProperty(css,value)}
  else if(typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value))root.style.setProperty(css,value);
 }
 root.dataset.motion=v.motion===false?'off':'on';
 const set=(selector,value)=>{const el=root.querySelector(selector);if(el&&typeof value==='string')el.textContent=value.slice(0,120)};
 set('.bc-intro span',v.intro);set('.bc-intro h1',v.heroLine1);
 if(typeof v.heroLine1==='string'||typeof v.heroLine2==='string'){
  const h=root.querySelector('.bc-intro h1');
  if(h){h.replaceChildren(document.createTextNode(typeof v.heroLine1==='string'?v.heroLine1:'Find your'),document.createElement('br'));
   const em=document.createElement('em');em.textContent=typeof v.heroLine2==='string'?v.heroLine2:'favorite era.';h.append(em);}
 }
 set('.bc-types>div>span',v.categoryLabel);
 set('#bc-enter',v.buttonLabel);
}
addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.kind!=='bec-visual-design')return;applyDesign(e.data.design)});

function create(){
 const root=document.querySelector('#bec-ts-landing');if(!root)return;
 root.classList.add('bec-deck-v4');root.classList.remove('bec-world');
 const escTitle=s=>esc(s);
 const productTypes=(a)=>{const configured=albumTypes[a.id];const selected=Array.isArray(configured)?configured:kind.map(k=>k[0]);return kind.filter(k=>selected.includes(k[0]));};
 const typeHtml=(a)=>productTypes(a).map(([id,zh],i)=>{const link=safe(albumTypeUrls[a.id+':'+id])||safe(albumLinks[a.id])||typeHref(id);return '<a href="'+esc(link)+'"><small>'+String(i+1).padStart(2,'0')+'</small><strong>'+escTitle(zh)+'</strong><span>↗</span></a>'}).join('');
 root.innerHTML='<main class="bc-shell">'+
 '<div class="bc-top"><span>BY ELISS COLLECTION <i></i> TAYLOR SWIFT</span><span>THE COLLECTION / 12 ERAS</span></div>'+
 '<section class="bc-stage" id="bc-stage"><div class="bc-intro"><span>YOUR COLLECTION STARTS HERE</span><h1>Find your<br><em>favorite era.</em></h1></div>'+
 '<div class="bc-deck" id="bc-deck" tabindex="0" aria-label="左右滑動切換 Taylor Swift 專輯"><div class="bc-deck-cards" id="bc-cards"></div>'+
 '<div class="bc-drag-hint">SWIPE TO EXPLORE <b>↔</b></div></div>'+
 '<div class="bc-bottom"><button type="button" id="bc-prev" aria-label="上一張">←</button>'+
 '<div class="bc-selected"><span id="bc-count">01 / 12</span><strong id="bc-title"></strong><p id="bc-story"></p><a id="bc-enter" href="#">EXPLORE THIS ERA ↗</a></div>'+
 '<button type="button" id="bc-next" aria-label="下一張">→</button></div></section>'+
 '<section class="bc-types" id="bc-types"><div><span>EXPLORE THE SELECTED ALBUM</span><h2 id="bc-types-title"></h2><p id="bc-types-description">探索這張專輯的商品類別，點選後開啟對應頁面。</p></div>'+
 '<nav class="bc-type-links" id="bc-type-links" aria-live="polite"></nav></section>'+
 '<footer class="bc-footer"><span>CURATED BY BEC</span><a href="#bc-stage">BACK TO TOP ↑</a></footer></main>';
 const deck=root.querySelector('#bc-deck'),host=root.querySelector('#bc-cards');
 const cards=albums.map((a,i)=>{
  const el=document.createElement('button');el.type='button';el.className='bc-card';el.dataset.i=i;
  el.setAttribute('aria-label','探索 '+a.title);el.style.setProperty('--card-tone',a.tone);
  el.innerHTML='<span class="bc-card-face"></span><span class="bc-card-title">'+escTitle(a.title)+'</span>';
  host.append(el);art(el.querySelector('.bc-card-face'),a);return el;
 });
 let index=0;let down=null;let wasDragged=false;let wheelTime=0;
 function delta(i){let d=i-index;if(d>albums.length/2)d-=albums.length;if(d< -albums.length/2)d+=albums.length;return d}
 function render(){
  const a=albums[index];root.style.setProperty('--bc-theme',a.tone);
  root.querySelector('#bc-count').textContent=String(index+1).padStart(2,'0')+' / '+albums.length;
  root.querySelector('#bc-title').textContent=a.title;root.querySelector('#bc-story').textContent=a.story;
  root.querySelector('#bc-enter').href=href(a);
  root.querySelector('#bc-types-title').textContent=a.title;
  root.querySelector('#bc-type-links').innerHTML=typeHtml(a);
  root.querySelector('#bc-types-description').textContent=productTypes(a).length?'SELECT A CATEGORY / 選擇此專輯的商品類別':'此專輯尚未設定商品類別。';
  const typesPanel=root.querySelector('#bc-types');typesPanel.classList.remove('is-changing');void typesPanel.offsetWidth;typesPanel.classList.add('is-changing');
  cards.forEach((el,i)=>{const d=delta(i),visible=Math.abs(d)<=3;el.style.setProperty('--d',d);el.style.setProperty('--absd',Math.abs(d));el.style.setProperty('--sgn',Math.sign(d));el.style.opacity=visible?'1':'0';el.style.pointerEvents=visible?'auto':'none';el.classList.toggle('is-current',d===0);el.tabIndex=visible?0:-1;el.setAttribute('aria-hidden',String(!visible))});
 }
 function change(n){index=(n+albums.length)%albums.length;render()}
 root.querySelector('#bc-prev').onclick=()=>change(index-1);
 root.querySelector('#bc-next').onclick=()=>change(index+1);
 host.addEventListener('click',e=>{const el=e.target.closest('.bc-card');if(!el||wasDragged)return;const i=Number(el.dataset.i);if(i===index){window.location.href=href(albums[i])}else change(i)});
 deck.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;down={x:e.clientX,y:e.clientY,id:e.pointerId};wasDragged=false});
 deck.addEventListener('pointerup',e=>{if(!down||e.pointerId!==down.id)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){wasDragged=true;change(index+(dx<0?1:-1));setTimeout(()=>wasDragged=false,180)}down=null});
 deck.addEventListener('pointercancel',()=>down=null);
 deck.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();change(index+(e.key==='ArrowRight'?1:-1))}});
 deck.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)<8||Math.abs(e.deltaX)<Math.abs(e.deltaY))return;e.preventDefault();if(Date.now()-wheelTime<420)return;wheelTime=Date.now();change(index+(e.deltaX>0?1:-1))},{passive:false});
 render();applyDesign(window.BEC_TS_DESIGN||{});
 if(location.hash==='#shop-by-type')root.querySelector('#bc-types').scrollIntoView();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',create,{once:true});else create();
})();