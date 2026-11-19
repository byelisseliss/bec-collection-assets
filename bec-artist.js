/* BEC Artist Collection v1.0 | Two-level navigation only */
(()=>{
'use strict';
const original=document.querySelector('[data-bec-collection].bec-artist');
if(!original||original.dataset.becArtistInit)return;
original.dataset.becArtistInit='1';
const activeGroupFromLink=link=>link?.closest('.bec-artist-panel')?.dataset.group;
let selected='all',manualUntil=0;
function navs(){return [original,document.querySelector('.bec-collection-float.bec-artist')].filter(Boolean)}
function switchGroup(id,manual=false){
 selected=id;
 if(manual)manualUntil=Date.now()+5500;
 for(const nav of navs()){
   for(const button of nav.querySelectorAll('.bec-artist-main button[data-group]')){
     const on=button.dataset.group===id;
     button.setAttribute('aria-selected',on?'true':'false');
     button.tabIndex=on?0:-1;
     if(on){const bar=button.parentElement;if(bar.scrollWidth>bar.clientWidth)button.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})}
   }
   for(const panel of nav.querySelectorAll('.bec-artist-panel')){
     panel.classList.toggle('is-current',panel.dataset.group===id);
   }
 }
}
document.addEventListener('click',e=>{
 const button=e.target.closest('.bec-artist-main button[data-group]');
 if(button&&button.closest('.bec-artist')){e.preventDefault();switchGroup(button.dataset.group,true);return}
 const link=e.target.closest('.bec-artist-panel a[href^="#"]');
 if(link){const id=activeGroupFromLink(link);if(id)switchGroup(id,false)}
});
let frame=0;
function sync(){
 frame=0;
 if(Date.now()<manualUntil)return;
 const active=original.querySelector('.bec-artist-panel a.is-active')||
              document.querySelector('.bec-collection-float.bec-artist .bec-artist-panel a.is-active');
 const id=activeGroupFromLink(active);
 if(id&&id!==selected)switchGroup(id,false);
}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync)},{passive:true});
addEventListener('load',()=>{switchGroup(selected);sync()},{once:true});
if(document.readyState==='complete'){switchGroup(selected);sync()}
else document.addEventListener('DOMContentLoaded',()=>switchGroup(selected),{once:true});
})();
