/* BEC Collection Template v1.2 | Shared script: no brand-specific names */
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

/*
 * v1.1 section repair:
 * - Existing native heading is always preferred.
 * - Existing explicit anchors are trusted section locations.
 * - Only the first 'all' category can be inferred from the nav position.
 * - Never guess the position of another category's products.
 */
const pageContainer=()=>document.querySelector('.page-single .customize');
const linksByIndex=()=>originalLinks;
function topLevel(el,box){
  while(el&&el.parentElement!==box)el=el.parentElement;
  return el&&el.parentElement===box?el:null;
}
function headingName(a){
  return (a.dataset.heading||a.textContent||'').split('|')[0].trim();
}
function generatedHeading(id,label,before){
  if(!before||!before.parentNode)return null;
  const el=document.createElement('section');
  el.className='editor bec-col-generated-heading';
  el.dataset.becGenerated=id;
  el.id=id+'-heading';
  const p=document.createElement('p');
  const strong=document.createElement('strong');
  strong.textContent=label;
  p.appendChild(strong);
  el.appendChild(p);
  before.parentNode.insertBefore(el,before);
  return el;
}
function autoHeading(a,index){
  const box=pageContainer();
  if(!box)return null;
  const id=a.getAttribute('href')?.slice(1);
  if(!id)return null;
  const existing=box.querySelectorAll(':scope > section.editor');
  const names=(a.dataset.heading||'').split('|').map(norm).filter(Boolean);
  for(const s of existing)if(names.includes(norm(s.textContent)))return s;
  const prior=box.querySelector('[data-bec-generated="'+CSS.escape(id)+'"]');
  if(prior)return prior;
  // An explicit anchor marks a safe category boundary.
  const anchor=document.getElementById(id);
  if(anchor&&anchor!==root&&!root.contains(anchor)){
    const host=topLevel(anchor,box);
    if(host&&host!==topLevel(root,box)){
      // Keep the heading immediately after the anchor's own builder block.
      const next=host.nextElementSibling;
      if(next){
        if(next.matches('section.editor')){
          const raw=norm(next.textContent);
          if(raw===norm(headingName(a)))return next;
          // A mismatching editor could be a genuine category heading: don't overwrite it.
          if(raw.length<90)return anchor;
        }
        return generatedHeading(id,headingName(a),next);
      }
      return anchor;
    }
  }
  // Safe fallback: the first "All" tab starts immediately after the navigation.
  if(index===0){
    const navHost=topLevel(root,box);
    const after=navHost?.nextElementSibling;
    if(after){
      // Don't label a different explicit category as All.
      if(after.matches('section.editor')&&norm(after.textContent).length<90)return null;
      return generatedHeading(id,headingName(a),after);
    }
  }
  return null;
}

/*
 * v1.2: the first ALL category has a guaranteed real anchor.
 * Insert the marker at the content boundary, never into the nav.
 * Existing matching native headings are kept and reused.
 */
function ensureFirstCategory(){
  const box=pageContainer(),a=originalLinks[0];
  if(!box||!a)return null;
  const id=a.getAttribute('href')?.slice(1);
  if(!id)return null;
  const names=(a.dataset.heading||'').split('|').map(norm).filter(Boolean);
  const existing=pages().find(s=>names.includes(norm(s.textContent)));
  if(existing){
    if(!document.getElementById(id))existing.id=id;
    return existing;
  }
  const previous=box.querySelector('[data-bec-generated="'+CSS.escape(id)+'"]');
  if(previous){
    if(!document.getElementById(id))previous.id=id;
    return previous;
  }
  let marker=document.getElementById(id);
  // Respect a pre-existing standalone anchor when there is one.
  let insertion=null;
  if(marker&&!root.contains(marker)){
    const wrapper=topLevel(marker,box);
    insertion=wrapper?.nextElementSibling||null;
  }
  if(!insertion){
    const wrapper=topLevel(root,box);
    insertion=wrapper?.nextElementSibling||null;
    // The navigation may itself be nested inside a custom code wrapper.
    if(!wrapper&&root.parentElement){
      insertion=root.nextElementSibling;
    }
  }
  if(!insertion){
    const wrapper=topLevel(root,box);
    if(wrapper?.parentElement===box){
      // At the end of the page builder: append after the nav block.
      insertion=document.createElement('span');
      insertion.hidden=true;
      box.appendChild(insertion);
    }
  }
  if(!insertion)return marker||null;
  // If another category's native heading immediately follows, this
  // is still the ALL boundary: do not suppress the missing ALL title.
  const created=generatedHeading(id,headingName(a),insertion);
  if(created){
    if(!marker)created.id=id; // exact hash, not id+"-heading"
    return created;
  }
  return marker||null;
}
function tabCount(){
  const count=originalLinks.length;
  [root,clone].forEach(el=>el.style.setProperty('--bec-tabs',Math.max(1,count)));
}
function validate(){
  ensureFirstCategory();
  originalLinks.forEach((a,i)=>{
    // Repair heading before resolving each target. Never hide links on temporary failures.
    const found=target(a)||(i===0?ensureFirstCategory():autoHeading(a,i));
    a.classList.remove('bec-col-missing');
    floatLinks[i]?.classList.remove('bec-col-missing');
    if(!found)console.warn('[BEC Collection v1.2] 尚無安全的分類位置：',a.textContent.trim(),a.getAttribute('href'));
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
  let t=target(a);if(!t){validate();t=target(a);}if(!t)return;
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
  validate();
  reveal();
  sticky();active();
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
