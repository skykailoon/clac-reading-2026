const app=document.getElementById('app');
const labels=['一','二','三','四','五'];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const match=location.hash.match(/^#unit-([1-5])$/);
 if(!match){document.title='CLAC 新人陪读 · 2026版';app.innerHTML=`<div class="eyebrow">CLAC · 2026</div><h1>新人陪读</h1><p class="intro">选择一个单元，开始阅读。</p><div class="toc-label"><span>单元目录</span><span>共 5 个单元</span></div><nav class="toc" aria-label="单元目录">${units.map((u,i)=>{const [title,sub]=u.title.split(' / ');return `<a class="unit-link" href="#unit-${i+1}"><span class="num">0${i+1}</span><span class="unit-copy"><div class="unit-label">单元${labels[i]}</div><div class="unit-title">${esc(title)}</div>${sub?`<div class="unit-sub">${esc(sub)}</div>`:''}</span><span class="arrow" aria-hidden="true">↗</span></a>`}).join('')}</nav>`;
 }else{const i=Number(match[1])-1,u=units[i];document.title=`单元${labels[i]} · ${u.title} | CLAC`;const [title,sub]=u.title.split(' / ');let questions=false;let body='';for(const b of u.blocks){if(b.kind==='section'&&b.text.startsWith('二、')){questions=true;body+='<section class="questions">'}const cls={section:'section-title',heading:'topic',item:'point',quote:'',end:'end'}[b.kind];const tag=b.kind==='section'?'h2':b.kind==='heading'&&!questions?'h3':b.kind==='quote'?'blockquote':'p';body+=`<${tag} class="${cls}">${esc(b.text)}</${tag}>`}if(questions)body+='</section>';app.innerHTML=`<a class="back" href="#">← 返回目录</a><article><div class="reader-head"><div class="eyebrow">单元${labels[i]} · 0${i+1}</div><h1>${esc(title)}</h1>${sub?`<div class="reader-sub">${esc(sub)}</div>`:''}</div>${body}</article><div class="reader-bottom"><a class="back" href="#">← 返回目录</a></div>`}
 window.scrollTo(0,0);
}
window.addEventListener('hashchange',render);render();
