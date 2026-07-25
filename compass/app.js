const storeKey="trueNorthConstitutionV1";
let state=JSON.parse(localStorage.getItem(storeKey)||"null")||{completed:[],points:0,virtues:Object.fromEntries(virtues.map(v=>[v,0])),reflections:{},lastDay:null,streak:0};
let current=null,selected=null;
const $=s=>document.querySelector(s);
function save(){localStorage.setItem(storeKey,JSON.stringify(state));renderStats()}
function today(){return new Date().toISOString().slice(0,10)}
function dayDiff(a,b){return Math.round((new Date(b)-new Date(a))/86400000)}
function renderStats(){
 $("#completed").textContent=state.completed.length;
 const max=state.completed.length*3; $("#alignment").textContent=max?Math.round(state.points/max*100)+"%":"0%";
 $("#streak").textContent=state.streak; $("#libraryProgress").textContent=`${state.completed.length} of ${scenarios.length} practiced`;
 const ranks=[[0,"Apprentice"],[4,"Wayfinder"],[8,"Steward"],[12,"Constitutional Guide"]]; $("#rank").textContent=[...ranks].reverse().find(r=>state.completed.length>=r[0])[1];
 $("#virtueBars").innerHTML=virtues.map(v=>{const pct=Math.min(100,(state.virtues[v]||0)*22);return `<div class="virtue-row"><span>${v}</span><div class="bar"><i style="width:${pct}%"></i></div><strong>${state.virtues[v]||0}</strong></div>`}).join("");
 renderGrid();
}
function renderGrid(){
 $("#scenarioGrid").innerHTML=scenarios.map((s,i)=>`<button class="scenario-card" data-i="${i}"><span class="num">${String(i+1).padStart(2,"0")} ${state.completed.includes(i)?"✓ PRACTICED":"SCENARIO"}</span><h4>${s.title}</h4><p>${s.context}</p><span class="tag">${s.virtue} · ${s.skills}</span></button>`).join("");
 document.querySelectorAll(".scenario-card").forEach(b=>b.onclick=()=>openScenario(+b.dataset.i));
}
function openScenario(i){current=i;selected=null;const s=scenarios[i];$("#scenarioMeta").textContent=`${s.virtue} · ${s.skills}`;$("#scenarioTitle").textContent=s.title;$("#scenarioContext").textContent=s.context;$("#scenarioPressure").textContent=s.pressure;$("#choices").innerHTML=s.choices.map((c,j)=>`<button class="choice" data-j="${j}"><b>${String.fromCharCode(65+j)}.</b>${c.t}</button>`).join("");document.querySelectorAll(".choice").forEach(b=>b.onclick=()=>choose(+b.dataset.j));$("#feedback").classList.remove("show");$("#reflection").value=state.reflections[i]||"";$("#scenarioModal").classList.add("open");document.body.style.overflow="hidden"}
function choose(j){if(selected!==null)return;selected=j;const s=scenarios[current],c=s.choices[j];document.querySelectorAll(".choice").forEach((b,k)=>{b.disabled=true;b.style.opacity=k===j?"1":".48"});const v=$("#verdict");v.className=`verdict ${c.level}`;$("#verdictTitle").textContent=c.level==="good"?"Constitutionally aligned":c.level==="mixed"?"Partially aligned":"Drift detected";$("#verdictText").textContent=c.text;$("#principles").innerHTML=c.p.map(x=>`<span>${x}</span>`).join("");$("#feedback").classList.add("show");if(!state.completed.includes(current)){state.completed.push(current);state.points+=c.score;state.virtues[s.virtue]=(state.virtues[s.virtue]||0)+c.score;const t=today();if(state.lastDay!==t){state.streak=state.lastDay&&dayDiff(state.lastDay,t)===1?state.streak+1:1;state.lastDay=t}save()}setTimeout(()=>$("#feedback").scrollIntoView({behavior:"smooth",block:"nearest"}),100)}
function closeModal(){$("#scenarioModal").classList.remove("open");document.body.style.overflow=""}
function randomScenario(){const remaining=scenarios.map((_,i)=>i).filter(i=>!state.completed.includes(i));openScenario((remaining.length?remaining:scenarios.map((_,i)=>i))[Math.floor(Math.random()*(remaining.length||scenarios.length))])}
function showToast(msg="Saved on this device"){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
$("#dailyBtn").onclick=()=>openScenario(new Date().getDate()%scenarios.length);$("#randomBtn").onclick=randomScenario;$("#closeModal").onclick=closeModal;$("#scenarioModal").onclick=e=>{if(e.target.id==="scenarioModal")closeModal()};$("#saveReflection").onclick=()=>{if(current!==null){state.reflections[current]=$("#reflection").value.trim();save();showToast()}};$("#nextScenario").onclick=()=>{closeModal();setTimeout(randomScenario,120)};
$("#constitutionBtn").onclick=()=>$("#drawer").classList.add("open");$("#closeDrawer").onclick=()=>$("#drawer").classList.remove("open");
$("#articles").innerHTML=articles.map(a=>`<div class="article"><b>Article ${a[0]}</b><p>${a[1]}</p></div>`).join("");
renderStats();