'use strict';
const sections=['about','research','projects','journey','awards'];
const filterLabels={zh:{all:'全部瞬间',research:'研究交流',build:'动手与协作',stage:'舞台与分享',life:'成长记录'},en:{all:'All moments',research:'Research',build:'Building together',stage:'On stage',life:'Growing up'}};
let lang='zh',category='all',openedPhoto=null;
try{lang=localStorage.getItem('songyang-profile-language')==='en'?'en':'zh';}catch{}
const $=s=>document.querySelector(s);
function make(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function render(){
 const c=CONTENT[lang];document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.body.classList.toggle('en',lang==='en');document.title=lang==='zh'?'庞淞阳 · 从好奇到有据可依的探索':'Songyang Pang · Curiosity, Creation & Evidence';
 document.querySelectorAll('[data-text]').forEach(el=>el.textContent=c[el.dataset.text]);document.querySelectorAll('[data-html]').forEach(el=>el.innerHTML=c[el.dataset.html]);document.querySelectorAll('[data-local]').forEach(el=>el.textContent=el.dataset.local.split('|')[lang==='zh'?0:1]);document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
 $('#nav').replaceChildren(...c.nav.map((text,i)=>{const a=make('a',text);a.href='#'+sections[i];return a;}));
 $('#about-prose').replaceChildren(...c.about.map(t=>make('p',t)));$('#paper-numbers').replaceChildren(...c.paperNumbers.map(t=>make('span',t)));$('#principles').replaceChildren(...c.principles.map(t=>make('li',t)));
 $('#project-list').replaceChildren(...c.projects.map((p,i)=>{const el=make('article',undefined,'project');const line=make('div');line.append(make('span',String(i+1).padStart(2,'0'),'project-count'),make('span',p[0],'project-tag'));el.append(line,make('h3',p[1]),make('p',p[2]));if(i===0){const b=make('button',lang==='zh'?'查看比赛记录 ↗':'See the competition moment ↗','text-button project-photo');b.dataset.photo='competition';b.style.color='var(--green)';el.append(b);}return el;}));
 $('#timeline').replaceChildren(...c.timeline.map(t=>{const li=make('li');li.append(make('time',t[0]),make('h3',t[1]),make('p',t[2]));return li;}));
 $('#awards-list').replaceChildren(...c.awards.map(t=>{const el=make('article',undefined,'awards-item');const detail=make('div');detail.append(make('h3',t[1]),make('p',t[2]));el.append(make('time',t[0]),detail);return el;}));
 $('#intro-text').textContent=c.short;$('#copy-message').textContent='';renderFilters();renderGallery();if(openedPhoto)updateModal(openedPhoto);document.body.dataset.ready='true';
}
function renderFilters(){
 $('#photo-filters').replaceChildren(...Object.entries(filterLabels[lang]).map(([key,label])=>{const b=make('button',label);b.type='button';b.dataset.category=key;b.setAttribute('aria-pressed',String(key===category));b.addEventListener('click',()=>{category=key;renderFilters();renderGallery();});return b;}));
}
function renderGallery(){
 $('#gallery').replaceChildren(...PHOTOS.filter(p=>p.id!=='portrait'&&(category==='all'||p.category===category)).map(p=>{const figure=make('figure');const b=make('button',undefined,'image-button');b.type='button';b.dataset.photo=p.id;b.setAttribute('aria-label',p.caption[lang]);const img=make('img');img.src=p.thumb;img.alt=p.caption[lang];img.loading='lazy';img.width=p.width;img.height=p.height;b.append(img);figure.append(b,make('figcaption',p.caption[lang]));return figure;}));
}
function updateModal(photo){$('#photo-large').src=photo.src;$('#photo-large').alt=photo.caption[lang];$('#photo-caption').textContent=photo.caption[lang];}
function openPhoto(id){const p=PHOTOS.find(p=>p.id===id);if(!p)return;openedPhoto=p;updateModal(p);$('#photo-dialog').showModal();document.body.classList.add('modal-open');}
document.addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(b)openPhoto(b.dataset.photo);});
$('#close-photo').addEventListener('click',()=>$('#photo-dialog').close());$('#photo-dialog').addEventListener('close',()=>{document.body.classList.remove('modal-open');openedPhoto=null;});$('#photo-dialog').addEventListener('click',e=>{if(e.target===$('#photo-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;try{localStorage.setItem('songyang-profile-language',lang);}catch{}render();}));
$('#copy-intro').addEventListener('click',async()=>{try{if(!navigator.clipboard)throw Error('unavailable');await navigator.clipboard.writeText(CONTENT[lang].short);$('#copy-message').textContent=CONTENT[lang].copied;}catch{$('#short-intro').open=true;const range=document.createRange();range.selectNodeContents($('#intro-text'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);$('#copy-message').textContent=CONTENT[lang].copyFallback;}});
render();
