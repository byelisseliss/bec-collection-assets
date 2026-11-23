/* BEC Taylor Swift Collection / editorial discover system 1.0
 * All images: Apple Music cover art lookup for PREVIEW. Replace with shop-owned
 * authorized URLs in BEC_TS_IMAGES for production whenever available.
 * Page URLs: BEC_TS_ALBUM_URLS and BEC_TS_TYPE_URLS may override each target.
 */
(()=>{
'use strict';
if(window.__BEC_TAYLOR_LANDING_INIT)return;
window.__BEC_TAYLOR_LANDING_INIT=true;
const base='https://byelisseliss.github.io/bec-collection-assets/';
const store='https://byelisscollection.my1shop.com/';
const albums=[
 {id:'showgirl',title:'The Life of a Showgirl',year:'2025',tone:'#4b8d79',story:'燈光亮起後，還有未被看見的生活。這個篇章以閃耀的舞台色彩，記錄聚光燈內外的故事。',search:'The Life of a Showgirl'},
 {id:'ttpd',title:'The Tortured Poets Department',year:'2024',tone:'#9c9c93',story:'黑白色調、手稿與難以說出口的情緒。一個把文字、回憶和細節留在紙上的篇章。',search:'The Tortured Poets Department'},
 {id:'midnights',title:'Midnights',year:'2022',tone:'#344969',story:'深夜的思緒、褪色的燈光與還沒說完的故事。為每一個清醒的午夜留下位置。',search:'Midnights'},
 {id:'evermore',title:'evermore',year:'2020',tone:'#826b57',story:'沿著冬日森林走向故事深處。延續想像世界裡那些尚未結束的人物與心事。',search:'evermore'},
 {id:'folklore',title:'folklore',year:'2020',tone:'#777d7c',story:'遠離喧囂後，故事在樹林和記憶之間生長。柔和、安靜，又帶著許多未完待續。',search:'folklore'},
 {id:'lover',title:'Lover',year:'2019',tone:'#caa9be',story:'粉彩天空下的告白、日常與勇氣。屬於色彩、擁抱和浪漫想像的篇章。',search:'Lover'},
 {id:'reputation',title:'reputation',year:'2017',tone:'#343536',story:'當外界的聲音愈來愈大，作品反而留下自己的答案。黑白、銳利，也同樣私密。',search:'reputation'},
 {id:'1989-tv',title:"1989 (Taylor's Version)",year:'2023',tone:'#7dabc4',story:'海風、城市與重新取回的聲音。讓熟悉的流行旋律，以新的視角再次出發。',search:"1989 (Taylor's Version)"},
 {id:'red-tv',title:"Red (Taylor's Version)",year:'2021',tone:'#86564e',story:'秋天的色調裡，有熱烈也有告別。那些早已熟悉的感受，再一次被完整講述。',search:"Red (Taylor's Version)"},
 {id:'speak-now-tv',title:"Speak Now (Taylor's Version)",year:'2023',tone:'#71527e',story:'從紫色的篇章重新出發。把青春時未曾猶豫的話，用現在的聲音說完。',search:"Speak Now (Taylor's Version)"},
 {id:'fearless-tv',title:"Fearless (Taylor's Version)",year:'2021',tone:'#af9167',story:'金色光線與青春的勇敢。熟悉的心跳，在重新錄製的聲音裡再次被聽見。',search:"Fearless (Taylor's Version)"},
 {id:'debut',title:'Taylor Swift',year:'2006',tone:'#628f83',story:'一切開始的地方：鄉村旋律、手寫的故事，以及一個仍在持續展開的音樂世界。',search:'Taylor Swift 2006 album'}
];
const types=[
 {id:'vinyl',zh:'黑膠',en:'VINYL RECORDS',detail:'黑膠唱片、收藏版本'},
 {id:'cd',zh:'CD',en:'COMPACT DISCS',detail:'實體專輯與限定版本'},
 {id:'cassette',zh:'卡帶',en:'CASSETTES',detail:'磁帶與特別版本'},
 {id:'clothing',zh:'服飾',en:'APPAREL',detail:'T-shirt、外套與針織品'},
 {id:'accessories',zh:'配件',en:'ACCESSORIES',detail:'包袋、飾品與鑰匙圈'},
 {id:'collectibles',zh:'收藏品',en:'COLLECTIBLES',detail:'水晶球、紀念品與收藏盒'},
 {id:'home',zh:'居家生活',en:'HOME & LIFESTYLE',detail:'毯子、杯具與居家擺設'},
 {id:'tour',zh:'巡演／活動',en:'TOUR & EVENTS',detail:'巡演周邊與限定企劃'}
];
const albumUrls={showgirl:store+'TheLifeofaShowgirl',...(window.BEC_TS_ALBUM_URLS||{})};
const typeUrls={cd:store+'categories/index-TS-cd',...(window.BEC_TS_TYPE_URLS||{})};
const imageOverrides=window.BEC_TS_IMAGES||{};
const safeUrl=u=>typeof u==='string'&&/^https:\/\//i.test(u)?u:null;
const albumHref=a=>safeUrl(albumUrls[a.id])||base+'taylor-discover.html?era='+encodeURIComponent(a.id);
const typeHref=t=>safeUrl(typeUrls[t.id])||base+'taylor-discover.html?type='+encodeURIComponent(t.id);
const escapeHtml=str=>String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chooseArt=(a,element)=>{
 const override=safeUrl(imageOverrides[a.id]);
 if(override){imageElement(element,override,a.title);return}
 const cacheKey='bec-ts-art-'+a.id;
 try{const v=localStorage.getItem(cacheKey);if(v){imageElement(element,v,a.title);return}}catch{}
 // iTunes artwork is used for temporary preview; site operators should
 // supply their authorized / hosted product images before public launch.
 const query='Taylor Swift '+a.search;
 fetch('https://itunes.apple.com/search?term='+encodeURIComponent(query)+'&entity=album&country=us&limit=50')
 .then(r=>r.ok?r.json():Promise.reject(new Error('artwork unavailable')))
 .then(data=>{
  const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const found=(data.results||[]).filter(x=>normalize(x.artistName).includes('taylorswift')&&x.artworkUrl100);
  const exact=found.find(x=>normalize(x.collectionName)===normalize(a.title));
  const suitable=exact||found.find(x=>normalize(x.collectionName).startsWith(normalize(a.title)));
  if(!suitable)return;
  const url=suitable.artworkUrl100.replace(/100x100(?:bb)?/,'600x600bb');
  imageElement(element,url,a.title);
  try{localStorage.setItem(cacheKey,url)}catch{}
 }).catch(()=>{});
};
function imageElement(node,url,alt){
 if(!node||node.querySelector('img'))return;
 const img=document.createElement('img');img.src=url;img.alt=alt+' 專輯視覺';img.loading='lazy';img.decoding='async';
 img.onerror=()=>img.remove();node.insertBefore(img,node.firstChild);
}
function albumCard(a,i){
 return '<a class="ts-card" href="'+escapeHtml(albumHref(a))+'" aria-label="探索 '+escapeHtml(a.title)+' 專輯商品">'+
 '<div class="ts-card-art" style="--color:'+a.tone+'" data-art="'+escapeHtml(a.id)+'"><span class="ts-graphic" aria-hidden="true"></span>'+
 '<div class="ts-card-text"><span class="ts-card-no">ERA '+String(i+1).padStart(2,'0')+' · '+a.year+'</span>'+
 '<strong class="ts-card-title">'+escapeHtml(a.title)+'</strong><span class="ts-card-sub">EXPLORE THIS ERA ↗</span></div></div>'+
 '<div class="ts-card-footer"><span class="ts-card-story">'+escapeHtml(a.story)+'</span><span class="ts-card-arrow" aria-hidden="true">↗</span></div></a>';
}
function typeCard(t,i){
 return '<a class="ts-type-card" href="'+escapeHtml(typeHref(t))+'"><small class="ts-type-index">'+String(i+1).padStart(2,'0')+' / 08</small>'+
 '<div><small>'+escapeHtml(t.en)+'</small><h3>'+escapeHtml(t.zh)+'</h3><p>'+escapeHtml(t.detail)+'</p></div><span class="ts-type-arrow" aria-hidden="true">↗</span></a>';
}
function artwork(){
 document.querySelectorAll('#bec-ts-landing [data-art],#bec-ts-detail [data-art]').forEach(node=>{
  const album=albums.find(x=>x.id===node.dataset.art);if(album)chooseArt(album,node);
 });
}
function initLanding(){
 const root=document.querySelector('#bec-ts-landing');if(!root)return;
 root.innerHTML='<div class="ts-shell ts-hero"><div class="ts-kicker">BEC / BY ELISS COLLECTION · THE TAYLOR SWIFT EDIT</div>'+
 '<div class="ts-hero-main"><h1>Every era.<br><span class="ts-highlight">All here.</span></h1>'+
 '<div class="ts-hero-aside"><p>從第一張專輯到最新篇章。依作品、依商品，找到你想收藏的每一個 Taylor Swift 瞬間。</p>'+
 '<div class="ts-small-marker"><span>YOUR ERA STARTS HERE</span><span class="ts-tiny-diamond" aria-hidden="true"></span></div></div></div></div>'+
 '<div class="ts-shell ts-pathbar" aria-label="選擇瀏覽方式">'+
 '<button class="ts-path" data-path="album" aria-pressed="true" type="button"><span><span class="ts-path-title">依專輯／系列探索</span><span class="ts-path-sub">BROWSE BY ALBUM · 12 ERAS</span></span><span class="ts-path-icon">↗</span></button>'+
 '<button class="ts-path" data-path="type" aria-pressed="false" type="button"><span><span class="ts-path-title">依商品類型探索</span><span class="ts-path-sub">BROWSE BY CATEGORY · 08 TYPES</span></span><span class="ts-path-icon">↗</span></button></div>'+
 '<div class="ts-shell ts-feature-wrap"><a class="ts-feature" href="'+escapeHtml(albumHref(albums[0]))+'"><div class="ts-feature-image" data-art="showgirl"></div><div class="ts-feature-copy"><span class="ts-kicker">FEATURED ERA / 2025 · 12TH CHAPTER</span><strong>Step into<br>the show.</strong><span>THE LIFE OF A SHOWGIRL &nbsp; ↗</span></div><span class="ts-feature-index">01 / 12</span></a></div>'+
 '<section class="ts-shell ts-section" id="bec-ts-albums"><div class="ts-section-head"><div><div class="ts-kicker">01 / THE DISCOGRAPHY</div><h2>Choose your era.</h2></div><div class="ts-count">12 STORIES / 12 CHAPTERS</div></div>'+
 '<div class="ts-filters"><div class="ts-search"><label for="bec-ts-search">⌕</label><input id="bec-ts-search" type="search" placeholder="搜尋專輯名稱／年份" autocomplete="off"></div><button type="button" class="ts-reset" id="bec-ts-reset">CLEAR SEARCH ×</button></div>'+
 '<div class="ts-grid" id="bec-ts-album-grid">'+albums.map(albumCard).join('')+'</div></section>'+
 '<section class="ts-shell ts-section" id="bec-ts-categories" hidden><div class="ts-section-head"><div><div class="ts-kicker">02 / THE COLLECTION</div><h2>Find your kind of Taylor.</h2></div><div class="ts-count">08 CURATED CATEGORIES</div></div>'+
 '<div class="ts-type-grid">'+types.map(typeCard).join('')+'</div></section>'+
 '<aside class="ts-strip"><div class="ts-shell ts-strip-inner"><div><div class="ts-kicker">BEC / THE COMPLETE SWIFT EDIT</div><strong>One artist. A whole universe.</strong><p>專輯、限量版本、服飾與生活選物，集中探索。</p></div><a href="'+store+'categories/artist">瀏覽 BEC 所有藝人商品 ↗</a></div></aside>'+
 '<footer class="ts-shell ts-bottom"><span>CURATED BY BEC · BY ELISS COLLECTION</span><span>13 IS OUR FAVORITE NUMBER ✳</span></footer>';
 const albumSection=root.querySelector('#bec-ts-albums'),typeSection=root.querySelector('#bec-ts-categories'),search=root.querySelector('#bec-ts-search'),grid=root.querySelector('#bec-ts-album-grid');
 root.querySelectorAll('[data-path]').forEach(button=>button.addEventListener('click',()=>{
  const byType=button.dataset.path==='type';albumSection.hidden=byType;typeSection.hidden=!byType;
  root.querySelectorAll('[data-path]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
  (byType?typeSection:albumSection).scrollIntoView({block:'start',behavior:'smooth'});
 }));
 function filter(){
  const value=search.value.toLocaleLowerCase().trim();
  const active=albums.filter(x=>(x.title+' '+x.year).toLocaleLowerCase().includes(value));
  grid.innerHTML=active.length?active.map(x=>albumCard(x,albums.indexOf(x))).join(''):'<div class="ts-empty">沒有符合的專輯；試著搜尋另一個作品或年份。</div>';
  artwork();
 }
 search.addEventListener('input',filter);
 root.querySelector('#bec-ts-reset').addEventListener('click',()=>{search.value='';filter();search.focus()});
 artwork();
 if(location.hash==='#shop-by-type')root.querySelector('[data-path="type"]').click();
}
function initDetail(){
 const root=document.querySelector('#bec-ts-detail');if(!root)return;
 const p=new URLSearchParams(location.search);
 const type=types.find(x=>x.id===p.get('type')),album=albums.find(x=>x.id===p.get('era'));
 if(!album&&!type){location.replace(base+'taylor-landing.html');return}
 const title=album?album.title:type.zh;
 const desc=album?album.story:type.detail;
 const back=base+'taylor-landing.html';
 document.title=title+' ／ BEC Taylor Swift Collection';
 root.innerHTML='<div class="ts-shell ts-hero" style="min-height:340px"><div class="ts-kicker"><a href="'+back+'">BEC / TAYLOR SWIFT ↖ 返回完整目錄</a></div>'+
 '<div class="ts-hero-main"><h1 style="font-size:clamp(42px,7vw,95px)">'+escapeHtml(title)+'</h1><div class="ts-hero-aside"><p>'+escapeHtml(desc)+'</p><div class="ts-small-marker"><span>'+(album?album.year+' · ALBUM ARCHIVE':'PRODUCT TYPE')+'</span><span class="ts-tiny-diamond"></span></div></div></div></div>'+
 (album?'<section class="ts-shell ts-section"><div class="ts-section-head"><div><div class="ts-kicker">EXPLORE / '+escapeHtml(title)+'</div><h2>Discover this chapter.</h2></div></div><div class="ts-grid"><div class="ts-card"><div class="ts-card-art" style="--color:'+album.tone+'" data-art="'+album.id+'"><span class="ts-graphic"></span><div class="ts-card-text"><span class="ts-card-no">'+album.year+' · TAYLOR SWIFT</span><strong class="ts-card-title">'+escapeHtml(title)+'</strong></div></div></div></div></section>':'')+
 '<section class="ts-shell ts-section" style="padding-top:16px"><div class="ts-section-head"><div><div class="ts-kicker">YOUR NEXT STOP</div><h2>Shop the collection.</h2></div></div>'+
 '<div class="ts-type-grid">'+(album?types:albums.slice(0,6).map(x=>({id:x.id,zh:x.title,en:x.year,detail:'探索專輯系列'}))).map((x,i)=>album?typeCard(x,i):'<a class="ts-type-card" href="'+albumHref(x)+'"><small class="ts-type-index">ERA '+String(i+1).padStart(2,'0')+'</small><div><small>'+x.en+'</small><h3>'+escapeHtml(x.zh)+'</h3></div><span class="ts-type-arrow">↗</span></a>').join('')+'</div>'+
 '<p style="font-size:12px;color:#718078;line-height:1.8;margin-top:22px">此系列的完整 1shop 商品分類頁將隨商品上架陸續連結。現階段可以透過下方入口瀏覽 BEC 已上架商品。</p></section>'+
 '<div class="ts-strip"><div class="ts-shell ts-strip-inner"><div><strong>Continue shopping BEC.</strong><p>查看目前已上架的 Taylor Swift 作品與周邊。</p></div><a href="'+store+'categories/artist">前往 BEC 藝人商品目錄 ↗</a></div></div>'+
 '<footer class="ts-shell ts-bottom"><a href="'+back+'">← 返回 Taylor Swift Explore</a><span>CURATED BY BEC</span></footer>';
 artwork();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{initLanding();initDetail()});
else{initLanding();initDetail()}
})();