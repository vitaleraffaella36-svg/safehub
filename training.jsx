/* ============================================================
   SafeHub — Formazione e corsi
   ============================================================ */

const Training = () => {
  const { COURSES, TRAININGS, EMPLOYEES, fmtDate, daysUntil } = window.SafeHubData;
  const ui = useUI();
  const [tab, setTab] = React.useState("corsi");
  const [planOpen, setPlanOpen] = React.useState(false);

  const totalParticipants = COURSES.reduce((acc, c) => acc + c.participants, 0);
  const totalCompleted = COURSES.reduce((acc, c) => acc + c.completed, 0);
  const overallPct = totalParticipants ? Math.round(100 * totalCompleted / totalParticipants) : 0;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Formazione</h1>
          <p className="subtitle">Corsi obbligatori, scadenze e attestati di tutti i dipendenti.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => ui.toast("Registro corsi (PDF) in preparazione…", { kind: "ok" })}><Icon name="download" size={14}/><span>Registro corsi</span></button>
          <button className="btn btn-primary" onClick={() => setPlanOpen(true)}><Icon name="plus" size={14}/><span>Nuovo corso</span></button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Corsi attivi" value={COURSES.filter(c => c.completed < c.participants).length} delta={`${COURSES.length} totali nel piano`} accent="info" icon="graduation"/>
        <StatCard label="Avanzamento medio" value={`${overallPct}%`} delta={`${totalCompleted} di ${totalParticipants} completamenti`} accent="ok" icon="check" progress={overallPct/100}/>
        <StatCard label="Scadenze ravvicinate" value="6" delta="formazioni nei prossimi 60g" accent="warn" icon="clock"/>
        <StatCard label="Ore svolte 2026" value="342" delta="su 580 pianificate" accent="primary" icon="play" progress={342/580}/>
      </div>

      <div className="tabs">
        <div className={`tab ${tab === "corsi" ? "active" : ""}`} onClick={() => setTab("corsi")}>
          Corsi <span className="count">{COURSES.length}</span>
        </div>
        <div className={`tab ${tab === "catalogo" ? "active" : ""}`} onClick={() => setTab("catalogo")}>
          Catalogo <span className="count">{TRAININGS.length}</span>
        </div>
        <div className={`tab ${tab === "matrice" ? "active" : ""}`} onClick={() => setTab("matrice")}>
          Matrice formazione
        </div>
      </div>

      {tab === "corsi" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {COURSES.map(c => <CourseCard key={c.id} course={c}/>)}
        </div>
      )}

      {tab === "catalogo" && (
        <div className="card card-flush">
          <table className="table">
            <thead><tr><th>Corso</th><th>Ore</th><th>Ciclo</th><th>Riferimento normativo</th><th></th></tr></thead>
            <tbody>
              {TRAININGS.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500 }}>{t.name}</td>
                  <td className="mono muted">{t.hours}h</td>
                  <td className="mono muted">{t.cycle} anni</td>
                  <td className="muted" style={{ fontSize: 12.5 }}>{t.art}</td>
                  <td><button className="btn btn-sm" onClick={() => setPlanOpen(true)}>Pianifica corso</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "matrice" && <TrainingMatrix/>}

      {planOpen && <PlanCourseModal onClose={() => setPlanOpen(false)}/>}
    </div>
  );
};

const CourseCard = ({ course: c }) => {
  const { fmtDate, daysUntil } = window.SafeHubData;
  const ui = useUI();
  const pct = c.completed / c.participants;
  const days = daysUntil(c.deadline);
  const status = c.completed === c.participants ? "completato" : days < 0 ? "scaduto" : days < 7 ? "urgente" : "in corso";
  const statusColor = { completato: "ok", scaduto: "danger", urgente: "warn", "in corso": "info" }[status];

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14, cursor: "pointer" }}
         onClick={() => ui.openCourse(c)}>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div className="col" style={{ gap: 6, flex: 1 }}>
          <div className="row" style={{ gap: 8 }}>
            <span className={`chip chip-${statusColor}`}>{status}</span>
            <span className="chip">{c.modality}</span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{c.title}</h3>
        </div>
        <button onClick={(e) => { e.stopPropagation(); ui.showMenu(e.currentTarget, [
          { label: "Vedi dettaglio",       icon: "eye",      onClick: () => ui.openCourse(c) },
          { label: "Invia promemoria",     icon: "mail",     onClick: () => ui.toast("Promemoria inviati a tutti gli iscritti", { kind: "ok" }) },
          { label: "Aggiungi partecipanti",icon: "users",    onClick: () => ui.toast("Apertura selezione…") },
          { label: "Esporta foglio firme", icon: "download", onClick: () => ui.toast("PDF in preparazione…", { kind: "ok" }) },
          { divider: true },
          { label: "Annulla corso", icon: "trash", danger: true, onClick: () => ui.confirm({
              title: "Annullare il corso?",
              body: `"${c.title}" sarà annullato per tutti i partecipanti. Verranno avvisati via email.`,
              confirmLabel: "Annulla corso", danger: true,
              action: () => ui.toast("Corso annullato")
            }) },
        ], { align: "right" }); }} className="btn btn-ghost btn-icon"><Icon name="more" size={14} color="var(--text-faint)"/></button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        <div className="col" style={{ padding: 10, background: "var(--bg-sunk)", borderRadius: 7 }}>
          <span className="faint" style={{ fontSize: 11 }}>Completati</span>
          <span className="mono" style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--ok)" }}>{c.completed}</span>
        </div>
        <div className="col" style={{ padding: 10, background: "var(--bg-sunk)", borderRadius: 7 }}>
          <span className="faint" style={{ fontSize: 11 }}>In corso</span>
          <span className="mono" style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--info)" }}>{c.in_progress}</span>
        </div>
        <div className="col" style={{ padding: 10, background: "var(--bg-sunk)", borderRadius: 7 }}>
          <span className="faint" style={{ fontSize: 11 }}>Da iniziare</span>
          <span className="mono" style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text-soft)" }}>{c.todo}</span>
        </div>
      </div>

      <div>
        <div className="row between" style={{ marginBottom: 4 }}>
          <span className="faint" style={{ fontSize: 12 }}>Avanzamento</span>
          <span className="mono" style={{ fontSize: 12, fontWeight: 500 }}>{Math.round(pct * 100)}%</span>
        </div>
        <div className="progress"><span style={{ width: `${pct * 100}%` }}/></div>
      </div>

      <div className="row between" style={{ paddingTop: 6, borderTop: "1px solid var(--border)" }}>
        <div className="row" style={{ gap: 6, color: "var(--text-soft)", fontSize: 12 }}>
          <Icon name="users" size={13}/>
          <span>{c.participants} iscritti</span>
        </div>
        <div className="row" style={{ gap: 6, color: days < 7 ? "var(--warn)" : "var(--text-soft)", fontSize: 12 }}>
          <Icon name="clock" size={13}/>
          <span>{days < 0 ? `scaduto ${-days}g fa` : days === 0 ? "scade oggi" : `entro ${fmtDate(c.deadline)}`}</span>
        </div>
      </div>
    </div>
  );
};

const TrainingMatrix = () => {
  const { EMPLOYEES, TRAININGS } = window.SafeHubData;
  const display = EMPLOYEES.slice(0, 10);
  const courses = TRAININGS.slice(0, 6);

  // Pseudo-deterministic status grid
  const statusFor = (empId, courseIdx) => {
    const h = (empId * 7 + courseIdx * 3) % 10;
    if (h < 6) return "ok";
    if (h < 8) return "warn";
    if (h === 8) return "danger";
    return "none";
  };

  return (
    <div className="card card-flush">
      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 220, position: "sticky", left: 0, background: "var(--bg-sunk)", zIndex: 1 }}>Dipendente</th>
              {courses.map(c => (
                <th key={c.id} style={{ writingMode: "horizontal-tb", minWidth: 110, textAlign: "center" }}>
                  {c.name.split(" ").slice(0, 3).join(" ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {display.map(e => (
              <tr key={e.id} style={{ cursor: "default" }}>
                <td style={{ position: "sticky", left: 0, background: "var(--bg-elev)", zIndex: 1 }}>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="avatar avatar-sm">{initials(e.name)}</div>
                    <div className="col" style={{ gap: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                      <div className="faint" style={{ fontSize: 11 }}>{e.role}</div>
                    </div>
                  </div>
                </td>
                {courses.map((c, i) => {
                  const s = statusFor(e.id, i);
                  return (
                    <td key={c.id} style={{ textAlign: "center" }}>
                      <MatrixDot status={s}/>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ gap: 16, padding: "12px 14px", borderTop: "1px solid var(--border)", background: "var(--bg-sunk)", fontSize: 12 }}>
        <div className="row" style={{ gap: 6 }}><MatrixDot status="ok"/> Valida</div>
        <div className="row" style={{ gap: 6 }}><MatrixDot status="warn"/> In scadenza</div>
        <div className="row" style={{ gap: 6 }}><MatrixDot status="danger"/> Scaduta</div>
        <div className="row" style={{ gap: 6 }}><MatrixDot status="none"/> Non richiesta</div>
      </div>
    </div>
  );
};

const MatrixDot = ({ status }) => {
  if (status === "none") return <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "var(--bg-sunk)", border: "1px dashed var(--border-strong)" }}/>;
  const colors = { ok: "var(--ok)", warn: "var(--warn)", danger: "var(--danger)" };
  return <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 5, background: colors[status], display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
    {status === "ok" && <Icon name="check" size={11} color="white" strokeWidth={3}/>}
    {status === "warn" && <span style={{ width: 2, height: 8, background: "white" }}/>}
    {status === "danger" && <Icon name="x" size={10} color="white" strokeWidth={3}/>}
  </span>;
};

const PlanCourseModal = ({ onClose }) => {
  const { TRAININGS, EMPLOYEES } = window.SafeHubData;
  const [step, setStep] = React.useState(1);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 620 }}>
        <div className="modal-header">
          <div>
            <h3>Pianifica corso di formazione</h3>
            <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>Passo {step} di 3</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <>
              <div className="field">
                <label>Tipo di corso</label>
                <select className="select">{TRAININGS.map(t => <option key={t.id}>{t.name} — {t.hours}h</option>)}</select>
              </div>
              <div className="field">
                <label>Titolo della sessione</label>
                <input className="input" defaultValue="Antincendio rischio medio — sessione settembre"/>
              </div>
              <div className="row" style={{ gap: 12 }}>
                <div className="field grow"><label>Modalità</label>
                  <select className="select"><option>Aula</option><option>Aula + e-learning</option><option>E-learning</option><option>Pratica</option></select>
                </div>
                <div className="field grow"><label>Docente / Ente</label>
                  <input className="input" placeholder="es. Studio Sicurus S.r.l."/>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="field">
                <label>Data di inizio</label>
                <input className="input" type="date" defaultValue="2026-09-12"/>
              </div>
              <div className="row" style={{ gap: 12 }}>
                <div className="field grow"><label>Durata (ore)</label><input className="input" type="number" defaultValue="8"/></div>
                <div className="field grow"><label>Validità (anni)</label><input className="input" type="number" defaultValue="3"/></div>
              </div>
              <div className="field"><label>Note</label><textarea className="input" style={{ height: 80, padding: 12 }} defaultValue="Sessione mista aula + prova pratica con estintori."/></div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="field">
                <label>Partecipanti</label>
                <div className="card" style={{ padding: 8, maxHeight: 240, overflowY: "auto" }}>
                  {EMPLOYEES.slice(0, 8).map(e => (
                    <label key={e.id} className="row" style={{ padding: 6, gap: 10, fontSize: 13 }}>
                      <input type="checkbox" defaultChecked={[2,5,6,8].includes(e.id)}/>
                      <div className="avatar avatar-sm">{initials(e.name)}</div>
                      <span>{e.name}</span>
                      <span className="faint" style={{ marginLeft: "auto", fontSize: 12 }}>{e.role}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="row" style={{ gap: 8, color: "var(--text-soft)", fontSize: 13, marginTop: 6 }}>
                <input type="checkbox" defaultChecked/>
                <span>Invia invito via email ai partecipanti</span>
              </label>
            </>
          )}
        </div>
        <div className="modal-footer">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="btn">Indietro</button>}
          <div className="grow"/>
          <button onClick={onClose} className="btn">Annulla</button>
          {step < 3 ? <button onClick={() => setStep(step + 1)} className="btn btn-primary">Avanti</button> : <button onClick={onClose} className="btn btn-primary">Pianifica</button>}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Training });
