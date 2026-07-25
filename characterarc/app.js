const STORAGE_KEY = 'characterarc-v1';

const defaultState = {
  commitments: [],
  history: [],
  reflections: [],
};

const state = loadState();
const root = document.getElementById('appRoot');
const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', renderDashboard);

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {...structuredClone(defaultState), ...parsed};
  }catch{return structuredClone(defaultState)}
}
function saveState(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}
function id(){return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random());}
function today(){return new Date().toISOString().slice(0,10);}
function fmtDate(value){return new Date(value+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}
function escapeHtml(value=''){return value.replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}

function commitmentStatus(c){
  if(c.status==='closed') return 'closed';
  if(c.status==='repaired') return 'repaired';
  if(c.dueDate < today() && !c.completedAt) return 'overdue';
  if(c.completedAt && !c.reportedAt) return 'did';
  if(c.completedAt && c.reportedAt) return 'closed';
  return 'active';
}
function statusLabel(s){return ({active:'Open',overdue:'Needs repair',did:'Action done',closed:'Loop closed',repaired:'Repaired'})[s]||s;}
function statusClass(s){return ({active:'blue',overdue:'rose',did:'gold',closed:'green',repaired:'green'})[s]||'';}
function completionRate(){
  const closed = state.commitments.filter(c=>['closed','repaired'].includes(commitmentStatus(c))).length;
  return state.commitments.length ? Math.round(closed/state.commitments.length*100) : 0;
}
function integrityRate(){
  const due = state.commitments.filter(c=>c.dueDate<=today());
  if(!due.length) return 0;
  return Math.round(due.filter(c=>c.completedAt && c.completedAt<=c.dueDate).length/due.length*100);
}
function accountabilityRate(){
  const done = state.commitments.filter(c=>c.completedAt);
  if(!done.length) return 0;
  return Math.round(done.filter(c=>c.reportedAt).length/done.length*100);
}
function openRepairs(){return state.commitments.filter(c=>commitmentStatus(c)==='overdue').length;}

function renderDashboard(){
  root.innerHTML = `
    <div class="stack">
      <section class="hero">
        <div>
          <span class="eyebrow">Character Formation</span>
          <h1>Let your <span>Say become Do.</span></h1>
          <p>CharacterArc turns commitments into visible practice. Make a clear promise, act on it, report what happened, and repair the loop when reality and intention diverge.</p>
          <div class="hero-actions">
            <button class="btn primary" id="newCommitment">Make a commitment</button>
            <button class="btn secondary" id="reviewToday">Run today’s review</button>
          </div>
        </div>
        <div class="hero-side">
          <div class="principle"><small>Integrity</small><strong>Say → Do</strong></div>
          <div class="principle"><small>Accountability</small><strong>Did → Said</strong></div>
          <div class="principle"><small>Trust</small><strong>Integrity × Accountability</strong></div>
        </div>
      </section>

      <section class="grid-4">
        <div class="metric"><small>Trust loops closed</small><strong>${completionRate()}%</strong><em>Promises fully completed and reported</em></div>
        <div class="metric"><small>Integrity indicator</small><strong>${integrityRate()}%</strong><em>Due commitments completed on time</em></div>
        <div class="metric"><small>Accountability indicator</small><strong>${accountabilityRate()}%</strong><em>Completed actions truthfully reported</em></div>
        <div class="metric"><small>Open repairs</small><strong>${openRepairs()}</strong><em>Commitments needing acknowledgment or repair</em></div>
      </section>

      <section class="panel stack">
        <div class="section-head"><div><span class="eyebrow">The Trust Loop</span><h2>Four movements, one accountable practice</h2></div><p>No moral score. Only visible commitments, truthful review, and repair.</p></div>
        <div class="loop">
          <div class="loop-step"><span>1</span><strong>Say</strong><p>Name what you intend to do, for whom, and by when.</p></div>
          <div class="loop-step"><span>2</span><strong>Do</strong><p>Act with integrity under the conditions that actually arise.</p></div>
          <div class="loop-step"><span>3</span><strong>Did</strong><p>Examine what occurred without hiding, inflating, or excusing.</p></div>
          <div class="loop-step"><span>4</span><strong>Said</strong><p>Report the truth, close the loop, or begin an honest repair.</p></div>
        </div>
      </section>

      <section class="panel stack">
        <div class="section-head"><div><span class="eyebrow">Active practice</span><h2>Your commitments</h2></div><div class="toolbar"><select class="filter" id="filter"><option value="open">Open</option><option value="all">All</option><option value="repair">Needs repair</option><option value="closed">Closed</option></select></div></div>
        <div id="commitmentList" class="commitment-list"></div>
      </section>

      <section class="panel stack">
        <div class="section-head"><div><span class="eyebrow">Recent truth</span><h2>Activity history</h2></div></div>
        <div class="timeline">${renderTimeline()}</div>
      </section>
    </div>`;

  document.getElementById('newCommitment').onclick = openCommitmentModal;
  document.getElementById('reviewToday').onclick = runDailyReview;
  document.getElementById('filter').onchange = e=>renderCommitments(e.target.value);
  renderCommitments('open');
}

function renderCommitments(filter){
  const list = document.getElementById('commitmentList');
  let commitments=[...state.commitments].sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
  if(filter==='open') commitments=commitments.filter(c=>!['closed','repaired'].includes(commitmentStatus(c)));
  if(filter==='repair') commitments=commitments.filter(c=>commitmentStatus(c)==='overdue');
  if(filter==='closed') commitments=commitments.filter(c=>['closed','repaired'].includes(commitmentStatus(c)));
  if(!commitments.length){list.innerHTML='<div class="empty">No commitments in this view.</div>';return;}
  list.innerHTML=commitments.map(c=>{
    const s=commitmentStatus(c);
    const progress = s==='active'||s==='overdue'?25:s==='did'?70:100;
    return `<article class="commitment-card">
      <div class="commitment-top"><div><h3 class="commitment-title">${escapeHtml(c.title)}</h3><div class="commitment-meta"><span class="chip ${statusClass(s)}">${statusLabel(s)}</span><span class="chip">Due ${fmtDate(c.dueDate)}</span><span class="chip">${escapeHtml(c.domain)}</span></div></div></div>
      <div class="commitment-body">${escapeHtml(c.promise)}${c.forWhom?`<br><small>For: ${escapeHtml(c.forWhom)}</small>`:''}</div>
      <div class="progress-line"><span style="width:${progress}%"></span></div>
      <div class="commitment-actions">
        ${s==='active'?`<button class="btn primary" data-action="done" data-id="${c.id}">Mark action done</button>`:''}
        ${s==='did'?`<button class="btn primary" data-action="report" data-id="${c.id}">Report and close</button>`:''}
        ${s==='overdue'?`<button class="btn danger" data-action="repair" data-id="${c.id}">Begin repair</button>`:''}
        <button class="btn secondary" data-action="view" data-id="${c.id}">View history</button>
        ${!['closed','repaired'].includes(s)?`<button class="btn ghost" data-action="edit" data-id="${c.id}">Edit</button>`:''}
      </div>
    </article>`;
  }).join('');
  list.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=()=>handleCommitmentAction(btn.dataset.action,btn.dataset.id));
}

function openCommitmentModal(existing=null){
  const c=existing||{title:'',promise:'',forWhom:'',dueDate:today(),domain:'Personal',evidence:'',accountabilityTo:''};
  showModal(`
    <h2>${existing?'Edit':'Make'} a commitment</h2>
    <p>Make the Say specific enough to become visible in action.</p>
    <form id="commitmentForm">
      <div class="form-grid">
        <div class="field full"><label>Commitment title</label><input name="title" required maxlength="80" value="${escapeHtml(c.title)}" placeholder="What will you do?" /></div>
        <div class="field full"><label>Exact promise</label><textarea name="promise" required placeholder="I will...">${escapeHtml(c.promise)}</textarea></div>
        <div class="field"><label>For whom or what?</label><input name="forWhom" value="${escapeHtml(c.forWhom)}" placeholder="Person, team, purpose" /></div>
        <div class="field"><label>Due date</label><input name="dueDate" type="date" required value="${c.dueDate}" /></div>
        <div class="field"><label>Domain</label><select name="domain"><option ${c.domain==='Personal'?'selected':''}>Personal</option><option ${c.domain==='Relational'?'selected':''}>Relational</option><option ${c.domain==='Work'?'selected':''}>Work</option><option ${c.domain==='Service'?'selected':''}>Service</option><option ${c.domain==='Health'?'selected':''}>Health</option><option ${c.domain==='Faith'?'selected':''}>Faith</option></select></div>
        <div class="field"><label>Accountability person</label><input name="accountabilityTo" value="${escapeHtml(c.accountabilityTo)}" placeholder="Optional" /></div>
        <div class="field full"><label>Evidence of completion</label><input name="evidence" value="${escapeHtml(c.evidence)}" placeholder="What observable sign will show it was done?" /></div>
      </div>
      <div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn primary" type="submit">Save commitment</button></div>
    </form>`);
  document.getElementById('commitmentForm').onsubmit=e=>{
    e.preventDefault(); const data=Object.fromEntries(new FormData(e.target));
    if(existing){Object.assign(existing,data); addHistory(existing.id,'Commitment updated',`Promise clarified: ${data.promise}`)}
    else{const item={id:id(),...data,createdAt:new Date().toISOString(),completedAt:null,reportedAt:null,status:'active',events:[]};state.commitments.push(item);addHistory(item.id,'Commitment made',item.promise)}
    saveState(); closeModal(); renderDashboard();
  };
}

function handleCommitmentAction(action,commitmentId){
  const c=state.commitments.find(x=>x.id===commitmentId); if(!c)return;
  if(action==='done') return markDone(c);
  if(action==='report') return reportCommitment(c);
  if(action==='repair') return repairCommitment(c);
  if(action==='view') return viewCommitment(c);
  if(action==='edit') return openCommitmentModal(c);
}

function markDone(c){
  showModal(`<h2>Record what you did</h2><p>Describe the action as it actually occurred.</p><form id="doneForm"><div class="field"><label>What happened?</label><textarea name="note" required placeholder="I completed..."></textarea></div><div class="field"><label>Completion date</label><input type="date" name="date" value="${today()}" required></div><div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn primary">Record action</button></div></form>`);
  document.getElementById('doneForm').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));c.completedAt=d.date;c.didNote=d.note;addHistory(c.id,'Action recorded',d.note);saveState();closeModal();renderDashboard();};
}
function reportCommitment(c){
  showModal(`<h2>Close the accountability loop</h2><p>Did your report match what actually happened?</p><form id="reportForm"><div class="field"><label>Truthful report</label><textarea name="report" required placeholder="What I said happened was..."></textarea></div><div class="field"><label>Who received the report?</label><input name="reportedTo" value="${escapeHtml(c.accountabilityTo)}" placeholder="Self, person, team, journal" /></div><div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn primary">Close loop</button></div></form>`);
  document.getElementById('reportForm').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));c.reportedAt=today();c.report=d.report;c.reportedTo=d.reportedTo;c.status='closed';addHistory(c.id,'Trust loop closed',d.report);saveState();closeModal();renderDashboard();};
}
function repairCommitment(c){
  showModal(`<h2>Begin an honest repair</h2><p>Repair does not erase the miss. It restores truth, responsibility, and a credible next action.</p><form id="repairForm"><div class="field"><label>Acknowledge the gap</label><textarea name="ack" required placeholder="I said... but what happened was..."></textarea></div><div class="field"><label>Impact or need affected</label><textarea name="impact" required placeholder="This affected..."></textarea></div><div class="field"><label>Repair action</label><textarea name="repair" required placeholder="To repair this, I will..."></textarea></div><div class="field"><label>New repair date</label><input type="date" name="repairDate" required value="${today()}"></div><div class="modal-actions"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn primary">Record repair plan</button></div></form>`);
  document.getElementById('repairForm').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));c.repair=d;c.status='repaired';c.reportedAt=today();addHistory(c.id,'Repair initiated',`${d.ack} Repair: ${d.repair}`);saveState();closeModal();renderDashboard();};
}
function viewCommitment(c){
  const items=state.history.filter(h=>h.commitmentId===c.id).sort((a,b)=>b.at.localeCompare(a.at));
  showModal(`<h2>${escapeHtml(c.title)}</h2><p>${escapeHtml(c.promise)}</p><div class="timeline">${items.length?items.map(h=>`<div class="event"><span class="event-dot"></span><div><small>${new Date(h.at).toLocaleString()}</small><p><strong>${escapeHtml(h.title)}</strong><br>${escapeHtml(h.detail)}</p></div></div>`).join(''):'<div class="empty">No history yet.</div>'}</div><div class="modal-actions"><button class="btn primary" data-close>Close</button></div>`);
}

function runDailyReview(){
  const due=state.commitments.filter(c=>!['closed','repaired'].includes(commitmentStatus(c))).slice(0,25);
  if(!due.length){showModal(`<h2>Nothing open today</h2><p>You have no active commitments to review.</p><div class="modal-actions"><button class="btn primary" data-close>Close</button></div>`);return;}
  let index=0;
  const render=()=>{
    const c=due[index];
    showModal(`<h2>Daily review ${index+1} of ${due.length}</h2><p><strong>${escapeHtml(c.title)}</strong><br>${escapeHtml(c.promise)}</p><div class="review-grid"><button class="review-option" data-review="done"><strong>I did it</strong><span>Record the action, then report it truthfully.</span></button><button class="review-option" data-review="progress"><strong>It is in progress</strong><span>The commitment remains credible and on track.</span></button><button class="review-option" data-review="risk"><strong>It is at risk</strong><span>Conditions changed or I need help before the due date.</span></button><button class="review-option" data-review="missed"><strong>I missed it</strong><span>Acknowledge the gap and begin repair.</span></button></div>`);
    document.querySelectorAll('[data-review]').forEach(btn=>btn.onclick=()=>{
      if(btn.dataset.review==='done'){closeModal();markDone(c);return;}
      if(btn.dataset.review==='missed'){closeModal();repairCommitment(c);return;}
      addHistory(c.id,btn.dataset.review==='risk'?'Commitment at risk':'Progress reviewed',btn.dataset.review==='risk'?'Risk acknowledged before the due date.':'Commitment remains in progress.');
      index++; saveState(); if(index<due.length)render(); else{closeModal();renderDashboard();}
    });
  };
  render();
}

function addHistory(commitmentId,title,detail){state.history.unshift({id:id(),commitmentId,title,detail,at:new Date().toISOString()});state.history=state.history.slice(0,200);}
function renderTimeline(){
  if(!state.history.length)return '<div class="empty">Your truthful activity record will appear here.</div>';
  return state.history.slice(0,8).map(h=>`<div class="event"><span class="event-dot"></span><div><small>${new Date(h.at).toLocaleString()}</small><p><strong>${escapeHtml(h.title)}</strong><br>${escapeHtml(h.detail)}</p></div></div>`).join('');
}
function showModal(content){
  const modal=document.createElement('div');modal.className='modal';modal.id='modal';modal.innerHTML=`<section class="modal-card">${content}</section>`;document.body.appendChild(modal);modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
}
function closeModal(){document.getElementById('modal')?.remove();}

renderDashboard();
