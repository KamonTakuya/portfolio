const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('.site-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menu.classList.remove('is-open');menuButton.querySelector('span').textContent='＋';}
menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(expanded));menu.classList.toggle('is-open',expanded);menuButton.querySelector('span').textContent=expanded?'−':'＋';});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
const dialog=document.querySelector('.reservation-dialog');
const openButton=document.querySelector('[data-open-reservation]');
openButton.addEventListener('click',()=>dialog.showModal());
dialog.querySelectorAll('[data-close-reservation]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>openButton.focus());
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
