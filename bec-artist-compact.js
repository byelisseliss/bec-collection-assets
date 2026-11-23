/* BEC Artist v2.2 | compact, auto-closing menu for large artist catalogs */
(()=>{
'use strict';
const root=document.querySelector('[data-bec-collection].bec-artist[data-bec-artist-v2]');
if(!root||root.dataset.becArtistCompactInit)return;
root.dataset.becArtistCompactInit='1';
let view='',group='',expanded=false,scrollYLast=window.scrollY,scrollEndLock=0;
const navs=()=>[root,document.querySelector('.bec-collection-float.bec-artist')].filter(Boolean);
function render(){
 for(const nav of navs()){
  nav.classList.toggle('bec-artist-open',expanded);
  nav.querySelectorAll('.bec-artist-switch button[data-view]').forEach(b=>{
   const on=expanded&&b.dataset.view===view;
   b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-expanded',String(on));
  });
  nav.querySelectorAll('.bec-artist-view').forEach(section=>{
   const on=expanded&&section.dataset.view===view;
   section.classList.toggle('is-current',on);
   section.querySelectorAll('.bec-artist-main button[data-group]').forEach(b=>
    b.setAttribute('aria-pressed',String(on&&b.dataset.group===group)));
   section.querySelectorAll('.bec-artist-panel').forEach(p=>
    p.classList.toggle('is-current',on&&p.dataset.group===group));
  });
 }
}
function chooseView(v){
 if(expanded&&view===v){expanded=false}
 else{view=v;group='';expanded=true}
 render();
}
function close(){if(expanded){expanded=false;render()}}
function matchHash(hash){
 const link=[...root.querySelectorAll('.bec-artist-panel a[href^="#"]')].find(a=>a.getAttribute('href')===hash);
 if(!link)return;
 view=link.closest('.bec-artist-view')?.dataset.view||'';
 group=link.closest('.bec-artist-panel')?.dataset.group||'';
}
if(location.hash)matchHash(location.hash);
document.addEventListener('click',event=>{
 const switcher=event.target.closest('.bec-artist-switch button[data-view]');
 if(switcher&&switcher.closest('.bec-artist')){event.preventDefault();chooseView(switcher.dataset.view);return}
 const category=event.target.closest('.bec-artist-main button[data-group]');
 if(category&&category.closest('.bec-artist')){
  event.preventDefault();const newView=category.closest('.bec-artist-view')?.dataset.view;
  if(newView){view=newView;group=category.dataset.group;expanded=true;render()}
  return;
 }
 const link=event.target.closest('.bec-artist-panel a[href^="#"]');
 if(link&&link.closest('.bec-artist')){
  // Let the shared nav core complete anchor navigation. Close AFTER it
  // calculates the compact sticky bar's destination offset.
  scrollEndLock=Date.now()+700;
  close();
  return;
 }
 if(expanded&&!event.target.closest('.bec-artist'))close();
},false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();return}});
addEventListener('scroll',()=>{
 const y=window.scrollY;
 if(Math.abs(y-scrollYLast)>3&&expanded&&Date.now()>scrollEndLock)close();
 scrollYLast=y;
},{passive:true});
addEventListener('resize',close,{passive:true});
addEventListener('hashchange',()=>{matchHash(location.hash);close()});
render();
})();