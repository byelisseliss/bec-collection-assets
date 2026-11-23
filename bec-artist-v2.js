/* BEC Artist Navigation v2 | independent of existing brand pages */
(()=>{
'use strict';
const original=document.querySelector('[data-bec-collection].bec-artist[data-bec-artist-v2]');
if(!original||original.dataset.becArtistV2Initialized)return;
original.dataset.becArtistV2Initialized='1';
const hash=location.hash;
let selectedView='',selectedGroup='',lockedUntil=0;
function navs(){return [original,document.querySelector('.bec-collection-float.bec-artist')].filter(Boolean)}
function setChoices(view,group='',manual=false){
 selectedView=view;selectedGroup=group;
 if(manual)lockedUntil=Date.now()+2600;
 for(const nav of navs()){
  for(const b of nav.querySelectorAll('.bec-artist-switch button[data-view]')){
   b.setAttribute('aria-pressed',String(b.dataset.view===view));
  }
  for(const section of nav.querySelectorAll('.bec-artist-view')){
   const on=section.dataset.view===view;
   section.classList.toggle('is-current',on);
   for(const button of section.querySelectorAll('.bec-artist-main button[data-group]')){
    button.setAttribute('aria-pressed',String(on&&button.dataset.group===group));
   }
   for(const panel of section.querySelectorAll('.bec-artist-panel')){
    panel.classList.toggle('is-current',on&&panel.dataset.group===group);
   }
  }
 }
}
function fromLink(link){
 const view=link?.closest('.bec-artist-view');
 const panel=link?.closest('.bec-artist-panel');
 return view&&panel?{view:view.dataset.view,group:panel.dataset.group}:null;
}
function findHash(value){
 const link=[...original.querySelectorAll('.bec-artist-panel a[href^="#"]')]
   .find(a=>a.getAttribute('href')===value);
 return fromLink(link);
}
document.addEventListener('click',event=>{
 const button=event.target.closest('.bec-artist-switch button[data-view]');
 if(button&&button.closest('[data-bec-artist-v2]')){event.preventDefault();setChoices(button.dataset.view,'',true);return}
 const group=event.target.closest('.bec-artist-main button[data-group]');
 if(group&&group.closest('[data-bec-artist-v2]')){
  event.preventDefault();
  const view=group.closest('.bec-artist-view')?.dataset.view;
  if(view)setChoices(view,group.dataset.group,true);
  return;
 }
 const link=event.target.closest('.bec-artist-panel a[href^="#"]');
 if(link&&link.closest('[data-bec-artist-v2]')){
  const parent=fromLink(link);
  if(parent)setChoices(parent.view,parent.group,true);
 }
});
/* When opening a direct category URL, expand the appropriate branch. */
if(hash){const item=findHash(hash);if(item)setChoices(item.view,item.group)}
/* Preserve deliberate navigation; sync only when a visible subcategory is active. */
let frame=0;
function sync(){
 frame=0;
 if(Date.now()<lockedUntil)return;
 // Do not unexpectedly open a group before the shopper chooses one.
 if(!selectedView)return;
 const visible=original.querySelector('.bec-artist-view.is-current .bec-artist-panel.is-current a.is-active');
 if(visible)return;
 const active=[...original.querySelectorAll('.bec-artist-panel a.is-active')].find(a=>a.getAttribute('href')!=='#');
 const match=fromLink(active);
 if(match&&match.view===selectedView&&match.group!==selectedGroup)setChoices(match.view,match.group);
}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync)},{passive:true});
})();
