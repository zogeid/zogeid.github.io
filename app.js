const content=document.getElementById("content");
let recipes=[];
const pantry=JSON.parse(localStorage.getItem('pantry')||'{}');
const history=JSON.parse(localStorage.getItem('history')||'{}');
fetch('recipes.json').then(r=>r.json()).then(d=>{recipes=d.recipes;render('today');});
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>render(b.dataset.view));
function days(id){if(!history[id])return 'Nunca'; const d=Math.floor((Date.now()-new Date(history[id]))/86400000); return d+' días';}
function save(){localStorage.setItem('pantry',JSON.stringify(pantry));localStorage.setItem('history',JSON.stringify(history));}
function render(v){if(v==='today'||v==='recipes'){content.innerHTML=recipes.map(r=>`<div class=card><div class=big>${r.emoji} ${r.name}</div><p>Hace: ${days(r.id)}</p><p>${r.ingredients.map(i=>pantry[i]?'<span class=ok>✅ '+i+'</span> ':'<span class=no>❌ '+i+'</span>').join('<br>')}</p><button onclick="mark('${r.id}')">Hoy cenamos esto</button></div>`).join('');}
if(v==='pantry'){const items=[...new Set(recipes.flatMap(r=>r.ingredients))];content.innerHTML='<div class=card>'+items.map(i=>`<label><input type=checkbox ${pantry[i]?'checked':''} onchange="toggleIng('${i}')"> ${i}</label>`).join('')+'</div>';}
if(v==='stats'){content.innerHTML='<div class=card>'+recipes.map(r=>`<p>${r.emoji} ${r.name}: ${days(r.id)}</p>`).join('')+'</div>';}}
window.toggleIng=i=>{pantry[i]=!pantry[i];save();render('pantry');};
window.mark=id=>{history[id]=new Date().toISOString();save();render('today');};