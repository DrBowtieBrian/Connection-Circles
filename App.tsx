import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Calendar, Users, MessageSquare, BarChart4, ClipboardCopy, Download, CheckCircle2, Sparkles, LayoutDashboard, Menu, Target, BookOpen, Mail, FileText } from 'lucide-react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { starterKit, initialPeople, initialContentStats, runOfShow, dmPreLive, dmPostLive, dmReferral, type Person } from './data'
import { nextThursday1215PT, copy } from './utils'

function Stat({ label, value, icon: Icon }: {label:string, value:React.ReactNode, icon:any}) {
  return (
    <div className="card">
      <div className="card-body flex items-center gap-3">
        <div className="p-2 rounded-2xl bg-slate-50 border"><Icon className="w-5 h-5" /></div>
        <div>
          <div className="text-2xl font-semibold leading-tight">{value}</div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  )
}

function CopyBlock({ label, text }: {label:string, text:string}){
  return (
    <div className="card">
      <div className="card-header"><div className="card-title">{label}</div></div>
      <div className="card-body space-y-2">
        <textarea className="textarea h-36" readOnly value={text} />
        <button className="btn btn-primary" onClick={()=>copy(text)}><ClipboardCopy className="w-4 h-4 mr-2 inline" /> Copy</button>
      </div>
    </div>
  )
}

function Hero({ onOpenKit }:{onOpenKit:()=>void}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 p-6 md:p-10 border">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Symba Center • Dr. Bowtie Brian</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
          Turn <span className="underline decoration-dotted">Connections</span> → <span className="underline">Circles</span>
        </h1>
        <p className="mt-3 md:text-lg text-slate-600 max-w-2xl">
          A trust-first system for purpose-driven leaders using short video, a LinkedIn newsletter, and weekly CircleUp! practices.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={()=>alert('Use the Events section to copy/share your next Live link.')}>
            <Play className="w-4 h-4 mr-2 inline" /> Join the next CircleUp!
          </button>
          <button className="btn" onClick={onOpenKit}>
            <Download className="w-4 h-4 mr-2 inline" /> Starter Kit (Preview)
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function StarterKitModal({ open, setOpen }:{open:boolean,setOpen:(b:boolean)=>void}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
      <div className="card max-w-3xl w-full" onClick={(e)=>e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">CircleUp! Starter Kit</div>
        </div>
        <div className="card-body space-y-3">
          <div className="flex gap-2">
            <button className="btn" onClick={()=>copy(Object.values(starterKit).join('\n\n'))}><Download className="w-4 h-4 mr-2 inline" />Copy All</button>
            <button className="btn" onClick={()=>copy('Comment CIRCLE and I’ll DM the Starter Kit.')}>Copy CTA</button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <textarea className="textarea h-72" readOnly value={starterKit.page1} />
            <textarea className="textarea h-72" readOnly value={starterKit.page2} />
            <textarea className="textarea h-72" readOnly value={starterKit.page3} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ people, stats }:{people:Person[], stats:any[]}){
  const sayDo = useMemo(()=>{
    const made = people.filter(p => p.commitment && p.commitment.length>0).length
    const kept = people.filter(p => p.kept).length
    return { made, kept, pct: made ? Math.round((kept/made)*100) : 0 }
  }, [people])

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="md:col-span-4 grid gap-4 md:grid-cols-4">
        <Stat label="Lives (month)" value={stats.reduce((a,b)=>a+b.lives,0)} icon={Play}/>
        <Stat label="Shorts (month)" value={stats.reduce((a,b)=>a+b.shorts,0)} icon={MessageSquare}/>
        <Stat label="RSVPs" value={stats.reduce((a,b)=>a+b.rsvps,0)} icon={Calendar}/>
        <Stat label="Circle Seats" value={stats.reduce((a,b)=>a+b.seats,0)} icon={Users}/>
      </div>

      <div className="card md:col-span-2">
        <div className="card-header"><div className="card-title">Signals Over Time</div></div>
        <div className="card-body" style={{height:260}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rsvps" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="circleComments" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card md:col-span-2">
        <div className="card-header"><div className="card-title">Say = Do Tracker</div></div>
        <div className="card-body">
          <div className="flex items-end gap-6">
            <div>
              <div className="text-4xl font-semibold">{sayDo.pct}%</div>
              <div className="text-xs text-slate-500">{sayDo.kept}/{sayDo.made} kept</div>
            </div>
            <div className="flex-1" style={{height:160}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ label: 'Say', v: sayDo.made }, { label: 'Do', v: sayDo.kept }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="v" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaybookAccordion(){
  return (
    <div className="space-y-2">
      <details className="card">
        <summary className="card-header cursor-pointer"><div className="card-title">Positioning & Narrative</div></summary>
        <div className="card-body text-sm space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>Category: Community-led leadership (wisdom as a martial art).</li>
            <li>One-liner: Turn LinkedIn connections into Circles that practice service, build trust, and ship impact.</li>
            <li>Pillars: Practice &gt; Post • Service &gt; Sell • Circles &gt; Funnels • Say=Do &gt; Hype.</li>
          </ul>
        </div>
      </details>
      <details className="card">
        <summary className="card-header cursor-pointer"><div className="card-title">Core Engine & Cadence</div></summary>
        <div className="card-body text-sm">
          <ol className="list-decimal pl-6 space-y-1">
            <li>Short video (30–60s) with CTA: comment <b>CIRCLE</b>.</li>
            <li>Weekly LinkedIn newsletter: lesson + prompt + Live link.</li>
            <li>CircleUp! 20 (Live): 5 teach • 10 practice • 5 invite.</li>
            <li>DM follow-up with Starter Kit + small-circle invite.</li>
            <li>Small-group Circles (60m); log commitments; share wins.</li>
          </ol>
        </div>
      </details>
      <details className="card">
        <summary className="card-header cursor-pointer"><div className="card-title">Scripts Library</div></summary>
        <div className="card-body grid gap-3 md:grid-cols-2">
          <CopyBlock label="DM: Pre-Live" text={dmPreLive}/>
          <CopyBlock label="DM: Post-Live" text={dmPostLive}/>
          <CopyBlock label="DM: Referral Ask" text={dmReferral}/>
          <CopyBlock label="Run-of-Show" text={runOfShow}/>
        </div>
      </details>
      <details className="card">
        <summary className="card-header cursor-pointer"><div className="card-title">Operations & SOPs</div></summary>
        <div className="card-body text-sm">
          <ul className="list-disc pl-6 space-y-1">
            <li>Weekly: Mon draft NL; Tue film shorts; Wed DM 10; Thu Live; Fri schedule Circles.</li>
            <li>Small-group SOP: cap 8, assign Scribe, time-box, log commitments, book next date.</li>
            <li>Ethics: Privacy by default; consent for stories; no medical advice.</li>
          </ul>
        </div>
      </details>
    </div>
  )
}

function PeopleTable({ people, setPeople }:{people:Person[], setPeople: (p:Person[])=>void}){
  const [newPerson, setNewPerson] = useState<Person>({ name:'', url:'', role:'', city:'' })

  function addPerson(){
    if (!newPerson.name) return
    setPeople([...people, { ...newPerson, kept:false }])
    setNewPerson({ name:'', url:'', role:'', city:'' })
  }

  function toggleKept(i:number){
    const copyArr = [...people]
    copyArr[i].kept = !copyArr[i].kept
    setPeople(copyArr)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <input className="input" placeholder="Name" value={newPerson.name} onChange={e=>setNewPerson({...newPerson, name:e.target.value})}/>
        <input className="input" placeholder="LinkedIn URL" value={newPerson.url||''} onChange={e=>setNewPerson({...newPerson, url:e.target.value})}/>
        <input className="input" placeholder="Role" value={newPerson.role||''} onChange={e=>setNewPerson({...newPerson, role:e.target.value})}/>
        <input className="input" placeholder="City" value={newPerson.city||''} onChange={e=>setNewPerson({...newPerson, city:e.target.value})}/>
        <button className="btn md:col-span-1 col-span-2" onClick={addPerson}><Users className="w-4 h-4 mr-2 inline"/>Add</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Role</th><th>City</th><th>Commitment</th><th>Due</th><th>Kept</th>
          </tr>
        </thead>
        <tbody>
          {people.map((p, i) => (
            <tr key={i}>
              <td><a href={p.url} target="_blank" className="link">{p.name}</a></td>
              <td>{p.role}</td>
              <td>{p.city}</td>
              <td><input className="input" value={p.commitment||''} onChange={e=>{ const arr=[...people]; arr[i].commitment=e.target.value; setPeople(arr) }}/></td>
              <td><input className="input" value={p.due||''} onChange={e=>{ const arr=[...people]; arr[i].due=e.target.value; setPeople(arr) }}/></td>
              <td><button className={`btn ${p.kept?'btn-primary':''}`} onClick={()=>toggleKept(i)}><CheckCircle2 className="w-4 h-4 mr-1 inline"/>{p.kept?'Yes':'No'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EventsPanel(){
  const [events, setEvents] = useState([
    { title: 'CircleUp! 20 — Trust Has a Run-of-Show', when: nextThursday1215PT(), where: 'LinkedIn Live', link: 'https://linkedin.com/events/next-circleup' },
    { title: 'Small Circle (8 seats)', when: 'Tue 7:00–8:00 am PT', where: 'Zoom', link: 'https://example.com/zoom' },
  ])
  const [draft, setDraft] = useState({ title:'', when:'', where:'', link:'' })

  function addEvent(){
    if (!draft.title) return
    setEvents([...events, draft])
    setDraft({ title:'', when:'', where:'', link:'' })
  }

  function copyInvite(e:any){
    copy(`Join me for ${e.title} — ${e.when} (${e.where})
${e.link}

Comment CIRCLE for the Starter Kit.`)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-4">
        <input className="input" placeholder="Title" value={draft.title} onChange={ev=>setDraft({...draft, title: ev.target.value})}/>
        <input className="input" placeholder="When" value={draft.when} onChange={ev=>setDraft({...draft, when: ev.target.value})}/>
        <input className="input" placeholder="Where" value={draft.where} onChange={ev=>setDraft({...draft, where: ev.target.value})}/>
        <div className="flex gap-2">
          <input className="input" placeholder="Link" value={draft.link} onChange={ev=>setDraft({...draft, link: ev.target.value})}/>
          <button className="btn" onClick={addEvent}><Calendar className="w-4 h-4 mr-2 inline"/>Add</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {events.map((e, idx) => (
          <div key={idx} className="card">
            <div className="card-header"><div className="card-title">{e.title}</div></div>
            <div className="card-body text-sm space-y-1">
              <div>When: <b>{e.when}</b></div>
              <div>Where: {e.where}</div>
              <div className="truncate">Link: <a className="link" href={e.link} target="_blank">{e.link}</a></div>
              <div className="pt-2 flex gap-2">
                <button className="btn btn-primary" onClick={()=>copyInvite(e)}>Copy Invite</button>
                <button className="btn" onClick={()=>copy(e.link)}><ClipboardCopy className="w-4 h-4 mr-2 inline"/>Copy Link</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsletterComposer(){
  const [issue, setIssue] = useState('Trust Has a Run-of-Show')
  const body = useMemo(()=>{
    switch(issue){
      case 'Say-Do Alignment':
        return `Leaders don’t need more promises; they need reps. Here’s how to shrink the Say=Do gap with micro-commitments and a visible log. Prompt: Which commitment do you owe your future self by Friday?`
      case 'Respect = Boundaries Balanced':
        return `Roles, rights, responsibilities. Complete: My role is ___. My rights include ___. My responsibility today is ___. Join this week’s practice.`
      case 'From Feedback to Formation':
        return `Turn notes into next steps. Convert one piece of feedback into a 10-minute rep this week. We’ll practice it live.`
      default:
        return `Why 20 minutes works for public practice: attention, safety, and cadence. Run-of-show inside, plus one prompt to log a commitment.`
    }
  }, [issue])

  const template = `Title: ${issue}
Hook: [1-2 sentences]
Lesson: ${body}
Prompt: [copy prompt above]
Invite: Comment CIRCLE for the kit; join Thursday’s CircleUp! 12:15–12:35 PT.`

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <label className="mr-2 text-sm">Issue</label>
        <select className="select" value={issue} onChange={e=>setIssue(e.target.value)}>
          <option>Trust Has a Run-of-Show</option>
          <option>Say-Do Alignment</option>
          <option>Respect = Boundaries Balanced</option>
          <option>From Feedback to Formation</option>
        </select>
        <button className="btn" onClick={()=>copy('Subscribe to Circle Signals on LinkedIn')}><Mail className="w-4 h-4 mr-2 inline"/>Copy Subscribe CTA</button>
      </div>
      <textarea className="textarea h-56" readOnly value={template} />
      <button className="btn btn-primary" onClick={()=>copy(template)}><ClipboardCopy className="w-4 h-4 mr-2 inline"/>Copy Newsletter Draft</button>
    </div>
  )
}

function Header({ onOpenKit }:{onOpenKit:()=>void}){
  const [open, setOpen] = useState(false)
  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">
      <div className="container py-3 flex items-center gap-3">
        <button className="btn md:hidden" onClick={()=>setOpen(true)}><Menu className="w-5 h-5"/></button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border" />
          <span className="font-semibold">Dr. Bowtie Brian</span>
          <span className="badge">CircleUp!</span>
        </div>
        <div className="hidden md:flex ml-auto items-center gap-3">
          <a href="#playbook" className="text-sm hover:underline">Playbook</a>
          <a href="#run" className="text-sm hover:underline">Run‑of‑Show</a>
          <a href="#metrics" className="text-sm hover:underline">Metrics</a>
          <a href="#events" className="text-sm hover:underline">Events</a>
          <button className="btn btn-primary" onClick={onOpenKit}><Download className="w-4 h-4 mr-2 inline"/> Starter Kit</button>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 bg-black/40" onClick={()=>setOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-4" onClick={(e)=>e.stopPropagation()}>
              <div className="text-sm font-semibold mb-2">Navigate</div>
              {([
                ['Playbook', '#playbook'],
                ['Run-of-Show', '#run'],
                ['Scripts', '#scripts'],
                ['Metrics', '#metrics'],
                ['Events', '#events'],
                ['Newsletter', '#newsletter'],
                ['Circles', '#circles'],
              ] as const).map(([label, href]) => (
                <a key={href} href={href} className="block py-2 border-b text-sm" onClick={()=>setOpen(false)}>{label}</a>
              ))}
              <button className="btn btn-primary mt-3" onClick={()=>{onOpenKit(); setOpen(false)}}><Download className="w-4 h-4 mr-2 inline"/> Starter Kit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App(){
  const [openKit, setOpenKit] = useState(false)
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [stats, setStats] = useState(initialContentStats)
  const [cta, setCta] = useState('Comment CIRCLE and I’ll DM the Starter Kit + small-circle invite.')

  function addWeeklyRow(){
    const nextIndex = stats.length + 1
    setStats([...stats, { week: `W${nextIndex}`, lives: 1, shorts: 2, rsvps: 20, circleComments: 30, seats: 8 }])
  }

  return (
    <div className="min-h-screen">
      <Header onOpenKit={()=>setOpenKit(true)} />
      <main className="container py-8 space-y-8">
        <Hero onOpenKit={()=>setOpenKit(true)} />
        <StarterKitModal open={openKit} setOpen={setOpenKit} />

        <section id="metrics" className="space-y-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
          </div>
          <Dashboard people={people} stats={stats} />
          <div className="flex gap-2">
            <button className="btn" onClick={addWeeklyRow}><BarChart4 className="w-4 h-4 mr-2 inline"/>Add Week</button>
            <button className="btn btn-primary" onClick={()=>copy(JSON.stringify({ stats, people }, null, 2))}><Download className="w-4 h-4 mr-2 inline"/>Export JSON</button>
          </div>
        </section>

        <div className="separator"></div>

        <section id="playbook" className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Playbook</h2>
          </div>
          <PlaybookAccordion />
        </section>

        <section id="run" className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Run‑of‑Show</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <CopyBlock label="CircleUp! 20" text={runOfShow} />
            <CopyBlock label="Short Video Script (30–60s)" text={`Hook: Your content gets thanks but no traction? Try this.
Reframe: Trust isn’t a funnel—it’s a Circle.
Step: Run a 20-minute practice this week (I’ll give you the agenda).
CTA: Comment CIRCLE for the kit; join Friday’s CircleUp!`} />
          </div>
        </section>

        <section id="scripts" className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Scripts & CTAs</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <CopyBlock label="DM: Pre‑Live" text={dmPreLive} />
            <CopyBlock label="DM: Post‑Live" text={dmPostLive} />
            <CopyBlock label="DM: Referral" text={dmReferral} />
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Comment CTA</div></div>
            <div className="card-body flex flex-col gap-2 md:flex-row md:items-center">
              <input className="input" value={cta} onChange={e=>setCta(e.target.value)} />
              <button className="btn btn-primary" onClick={()=>copy(cta)}><ClipboardCopy className="w-4 h-4 mr-2 inline"/>Copy CTA</button>
            </div>
          </div>
        </section>

        <div className="separator"></div>

        <section id="events" className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Events</h2>
          </div>
          <EventsPanel />
        </section>

        <section id="newsletter" className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Newsletter Composer</h2>
          </div>
          <NewsletterComposer />
        </section>

        <div className="separator"></div>

        <section id="circles" className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Circle Roster & Commitments</h2>
          </div>
          <PeopleTable people={people} setPeople={setPeople} />
        </section>

        <div className="separator"></div>

        <section id="resources" className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5"/>
            <h2 className="text-2xl font-semibold">Resources</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="card">
              <div className="card-header"><div className="card-title">LinkedIn Banner Brief</div></div>
              <div className="card-body text-sm space-y-2">
                <p>1584×396 px (safe 1350×220). Copy: “Turn Connections → Circles” + “Weekly CircleUp! (20‑min)”. Badges: Center of Success • Compass of Character • #BetterTogether.</p>
                <button className="btn" onClick={()=>copy('LinkedIn Banner: 1584x396; Copy: Turn Connections → Circles | Weekly CircleUp! (20‑min) | Badges: Center of Success • Compass of Character • #BetterTogether')}>Copy Brief</button>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Circle Agenda One‑Pager</div></div>
              <div className="card-body text-sm space-y-2">
                <p>CircleUp! 20: Hook (1) • Lesson (5) • Practice (10) • Invite (4). Small Circle 60: Wins (10) • Warm‑up (10) • Deep Practice (25) • Commit (10) • Close (5).</p>
                <button className="btn" onClick={()=>copy('CircleUp! 20: Hook (1) • Lesson (5) • Practice (10) • Invite (4) | Small Circle 60: Wins (10) • Warm‑up (10) • Deep Practice (25) • Commit (10) • Close (5)')}>Copy One‑Pager</button>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Respect Map Worksheet</div></div>
              <div className="card-body text-sm space-y-2">
                <p>Role • Rights (2) • Responsibility (today) • Boundary I’ll honor • One commitment (by Fri).</p>
                <button className="btn" onClick={()=>copy('Role: __ | Rights: __ / __ | Responsibility (today): __ | Boundary to honor: __ | One commitment (by Fri): __')}>Copy Worksheet</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Symba Center • Dr. Bowtie Brian • Built with love for #BetterTogether
      </footer>
    </div>
  )
}
