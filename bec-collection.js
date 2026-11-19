/* BEC Collection Template v1.0 | Shared script: no brand-specific names */
(()=>{
'use strict';
const root=document.querySelector('[data-bec-collection]');
if(!root||root.dataset.becInitialized)return;
root.dataset.becInitialized='1';
document.body.classList.add('bec-collection-enabled');
root.classList.add('bec-collection-nav');
const group=root.querySelector('.bec-col-links');
if(!group)return;
const originalLinks=[...group.querySelectorAll('a[href^="#"]')];
if(!originalLinks.length)return;
const clone=root.cloneNode(true);
clone.removeAttribute('data-bec-collection');
clone.removeAttribute('id');
clone.classList.remove('bec-collection-nav');
clone.classList.add('bec-collection-float');
clone.setAttribute('aria-label','浮動商品分類導覽');
clone.setAttribute('aria-hidden','true');
clone.setAttribute('inert','');
document.body.appendChild(clone);
const floatLinks=[...clone.querySelectorAll('.bec-col-links a[href^="#"]')];
const allLinks=originalLinks.concat(floatLinks);
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const norm=s=>(s||'').replace(/\s+/g,' ').trim().toLocaleUpperCase();
const headers='nav.bec18-header,nav.navbar.bec18-header';
const menuSel=headers+',.bec18-panel';
let raf=0,anim=0,token=0,activeHash='',menuTimer=0;
const pages=()=>[...document.querySelectorAll('.page-single .customize > section.editor')];
function headerBottom(){
  const h=document.querySelector(headers);
  if(!h)return 0;
  const st=getComputedStyle(h),r=h.getBoundingClientRect();
  if(!['fixed','sticky'].includes(st.position)||r.bottom<=0||r.top>=innerHeight)return 0;
  return Math.max(0,r.bottom);
}
const gap=()=>Math.max(10,headerBottom()+10);
function target(link){
  const names=(link.dataset.heading||'').split('|').map(norm).filter(Boolean);
  if(names.length){
    const found=pages().find(section=>names.includes(norm(section.textContent)));
    if(found)return found;
  }
  const id=link.getAttribute('href').slice(1);
  const anchor=document.getElementById(id);
  if(anchor){
    // Prefer the native heading after an anchor's 1shop code wrapper.
    const host=anchor.closest('section')||anchor;
    let sib=host.nextElementSibling;
    for(let i=0;i<3&&sib;i++,sib=sib.nextElementSibling){
      if(sib.matches?.('section.editor'))return sib;
    }
    return anchor;
  }
  return null;
}
function tabCount(){
  const valid=originalLinks.filter(a=>!a.classList.contains('bec-col-missing')).length;
  [root,clone].forEach(el=>el.style.setProperty('--bec-tabs',Math.max(1,valid)));
}
function validate(){
  originalLinks.forEach((a,i)=>{
    const invalid=!target(a);
    a.classList.toggle('bec-col-missing',invalid);
    floatLinks[i]?.classList.toggle('bec-col-missing',invalid);
    if(invalid)console.warn('[BEC Collection] 找不到分類標題／錨點：',a.textContent.trim(),a.getAttribute('href'));
  });
  tabCount();
}
function sticky(){
  const top=gap();
  clone.style.top=top+'px';
  clone.style.width=Math.min(1110,innerWidth-24)+'px';
  const show=root.getBoundingClientRect().bottom<=top;
  clone.classList.toggle('is-floating',show);
  clone.setAttribute('aria-hidden',show?'false':'true');
  if(show)clone.removeAttribute('inert');else clone.setAttribute('inert','');
}
function select(hash){
  if(hash===activeHash)return;
  activeHash=hash;
  allLinks.forEach(a=>{
    const chosen=!!hash&&a.getAttribute('href')===hash;
    a.classList.toggle('is-active',chosen);
    if(chosen)a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  });
  if(hash){
    const item=floatLinks.find(a=>a.getAttribute('href')===hash);
    if(item&&clone.classList.contains('is-floating')){
      const rail=clone.querySelector('.bec-col-links');
      if(rail&&rail.scrollWidth>rail.clientWidth){
        const left=item.offsetLeft-rail.offsetLeft-(rail.clientWidth-item.offsetWidth)/2;
        rail.scrollTo({left:Math.max(0,left),behavior:'smooth'});
      }
    }
  }
}
function active(){
  const line=gap()+clone.offsetHeight+32;
  let chosen='';
  for(const a of originalLinks){
    if(a.classList.contains('bec-col-missing'))continue;
    const t=target(a);
    if(t&&t.getBoundingClientRect().top<=line)chosen=a.getAttribute('href');
  }
  select(chosen);
}
function update(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;sticky();active();});}
function stop(){token++;if(anim)cancelAnimationFrame(anim);anim=0;}
function desired(el){return Math.max(0,scrollY+el.getBoundingClientRect().top-gap()-clone.offsetHeight-14);}
function glide(el){
  stop();
  const to=desired(el);
  if(reduced()){window.scrollTo(0,to);update();return;}
  if(Math.abs(to-scrollY)>1450){
    const sign=to>scrollY?1:-1;
    window.scrollTo(0,Math.max(0,to-sign*330));
    sticky();
  }
  const from=scrollY,dist=desired(el)-from,started=performance.now(),mine=token;
  function step(now){
    if(mine!==token)return;
    const p=Math.min(1,(now-started)/490);
    window.scrollTo(0,from+dist*(1-Math.pow(1-p,3)));
    if(p<1){anim=requestAnimationFrame(step);}else{
      anim=0;
      const end=desired(el);
      if(Math.abs(end-scrollY)>2)window.scrollTo(0,end);
      update();
    }
  }
  anim=requestAnimationFrame(step);
}
[root,clone].forEach(nav=>nav.addEventListener('click',event=>{
  const a=event.target.closest('a[href^="#"]');
  if(!a||!nav.contains(a))return;
  const t=target(a);if(!t)return;
  event.preventDefault();
  select(a.getAttribute('href'));
  glide(t);
  history.replaceState(null,'',a.getAttribute('href'));
}));
['wheel','touchstart','keydown'].forEach(type=>addEventListener(type,stop,{passive:true}));
addEventListener('scroll',update,{passive:true});
addEventListener('resize',update,{passive:true});
// A robust fallback for header menus rendered in a separate DOM portal.
document.addEventListener('pointerover',e=>{
  if(e.target.closest?.(menuSel)){
    clearTimeout(menuTimer);
    document.body.classList.add('bec-collection-menu-open');
  }
},true);
document.addEventListener('pointerout',e=>{
  if(!e.target.closest?.(menuSel))return;
  clearTimeout(menuTimer);
  menuTimer=setTimeout(()=>{
    const hovered=[...document.querySelectorAll(menuSel)].some(n=>n.matches(':hover')||n.contains(document.activeElement));
    if(!hovered)document.body.classList.remove('bec-collection-menu-open');
  },200);
},true);
document.addEventListener('focusin',e=>{if(e.target.closest?.(menuSel))document.body.classList.add('bec-collection-menu-open')},true);
document.addEventListener('focusout',()=>setTimeout(()=>{
  if(![...document.querySelectorAll(menuSel)].some(n=>n.contains(document.activeElement)))document.body.classList.remove('bec-collection-menu-open');
},100),true);
function reveal(){
  const box=document.querySelector('.page-single .customize');
  if(!box||reduced()||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('bec-col-visible');io.unobserve(e.target);}
  }),{threshold:.05,rootMargin:'0px 0px -25px 0px'});
  function scan(){
    box.querySelectorAll(':scope > section.editor,:scope > section.image').forEach(el=>{
      if(el.dataset.becReveal)return;
      el.dataset.becReveal='1';
      const r=el.getBoundingClientRect();
      if(r.bottom<=0||r.top<innerHeight*.85)return;
      el.classList.add('bec-col-reveal');io.observe(el);
    });
  }
  scan();
  new MutationObserver(()=>requestAnimationFrame(scan)).observe(box,{childList:true});
}
// Defer validation until 1shop has had time to render product sections.
function ready(){
  reveal();
  sticky();active();
  validate();
  const hash=location.hash;
  if(hash){
    const link=originalLinks.find(a=>a.getAttribute('href')===hash);
    if(link){const t=target(link);if(t)window.scrollTo(0,desired(t));}
  }
  update();
}
if(document.readyState==='complete')ready();
else addEventListener('load',ready,{once:true});
})();
