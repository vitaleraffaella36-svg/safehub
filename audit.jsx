/* ============================================================
   SafeHub — Audit & checklist personalizzabili
   ============================================================ */

const Audit = () => {
  const { AUDIT_TEMPLATES, AUDIT_HISTORY, fmtDate } = window.SafeHubData;
  const ui = useUI();
  const [tab, setTab] = React.useState("storico");
  const [runOpen, setRunOpen] = React.useState(false);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Audit & checklist</h1>
          <p className="subtitle">Audit interni programmati e checklist personalizzabili per sopralluoghi.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => ui.toast("Storico audit in download (XLSX)", { kind: "ok" })}><Icon name="download" size={14}/><span>Esporta storico</span></button>
          <button className="btn btn-primary" onClick={() => setRunOpen(true)}><Icon name="plus" size={14}/><span>Avvia audit</span></button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Audit completati 2026" value="14" delta="+3 vs trim. precedente" accent="ok" icon="clipboardCheck"/>
        <StatCard label="In corso" value="2" delta="da chiudere entro 7g" accent="warn" icon="clock"/>
        <StatCard label="Score medio" value="86/100" delta="+4 vs ultimo trim." accent="info" icon="spark"/>
        <StatCard label="Findings aperti" value="7" delta="3 in lavorazione" accent="warn" icon="alertCircle"/>
      </div>

      <div className="tabs">
        <div className={`tab ${tab === "storico" ? "active" : ""}`} onClick={() => setTab("storico")}>Storico audit <span className="count">{AUDIT_HISTORY.length}</span></div>
        <div className={`tab ${tab === "modelli" ? "active" : ""}`} onClick={() => setTab("modelli")}>Modelli di checklist <span className="count">{AUDIT_TEMPLATES.length}</span></div>
        <div className={`tab ${tab === "editor" ? "active" : ""}`} onClick={() => setTab("editor")}>Editor checklist</div>
      </div>

      {tab === "storico" && (
        <div className="card card-flush">
          <table className="table">
            <thead><tr><th>Audit</th><th>Sede</th><th>Eseguito da</th><th>Data</th><th>Stato</th><th>Findings</th><th>Score</th><th></th></tr></thead>
            <tbody>
              {AUDIT_HISTORY.map(a => (
                <tr key={a.id} onClick={() => ui.openAudit(a)}>
                  <td style={{ fontWeight: 500 }}>{a.template}</td>
                  <td className="muted">{a.site}</td>
                  <td>
                    <div className="row" style={{ gap: 8 }}>
                      <div className="avatar avatar-sm">{initials(a.by)}</div>
                      <span>{a.by}</span>
                    </div>
                  </td>
                  <td className="mono muted">{fmtDate(a.date)}</td>
                  <td>{a.status === "completato"
                    ? <span className="chip chip-ok"><Icon name="check" size={10}/>Completato</span>
                    : <span className="chip chip-warn"><Icon name="clock" size={10}/>In corso</span>}</td>
                  <td>
                    {a.findings === null ? <span className="faint">—</span>
                      : a.findings === 0 ? <span className="chip chip-ok">0</span>
                      : <span className="chip chip-warn">{a.findings} aperti</span>}
                  </td>
                  <td>
                    {a.score !== null
                      ? <span className="mono" style={{ fontWeight: 600, color: a.score >= 90 ? "var(--ok)" : a.score >= 75 ? "var(--warn)" : "var(--danger)" }}>{a.score}</span>
                      : <span className="faint">—</span>}
                  </td>
                  <td><button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); ui.openAudit(a); }}><Icon name="arrowRight" size={12}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "modelli" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {AUDIT_TEMPLATES.map(t => (
            <div key={t.id} className="card">
              <div className="row between" style={{ marginBottom: 10 }}>
                <h3 style={{ fontSize: 16 }}>{t.name}</h3>
                <button onClick={(e) => ui.showMenu(e.currentTarget, [
                  { label: "Avvia audit",     icon: "play",   onClick: () => setRunOpen(true) },
                  { label: "Modifica modello",icon: "pencil", onClick: () => setTab("editor") },
                  { label: "Duplica",         icon: "fileText", onClick: () => ui.toast("Modello duplicato", { kind: "ok" }) },
                  { divider: true },
                  { label: "Elimina", icon: "trash", danger: true, onClick: () => ui.confirm({
                      title: "Eliminare il modello?",
                      body: `"${t.name}" non sarà più disponibile per nuovi audit. Gli audit già eseguiti restano nello storico.`,
                      confirmLabel: "Elimina", danger: true,
                      action: () => ui.toast("Modello eliminato")
                    }) },
                ], { align: "right" })} className="btn btn-ghost btn-icon"><Icon name="more" size={14} color="var(--text-faint)"/></button>
              </div>
              <div className="row" style={{ gap: 8, marginBottom: 14 }}>
                <span className="chip">{t.sections.length} sezioni</span>
                <span className="chip">{t.sections.reduce((acc, s) => acc + s.items.length, 0)} controlli</span>
              </div>
              <div className="col" style={{ gap: 6, marginBottom: 14 }}>
                {t.sections.map((s, i) => (
                  <div key={i} className="row" style={{ gap: 8, fontSize: 12.5 }}>
                    <span style={{ width: 18, height: 18, borderRadius: 4, background: "var(--bg-sunk)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-soft)", fontSize: 11, fontFamily: "var(--font-mono)" }}>{s.items.length}</span>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button onClick={() => setRunOpen(true)} className="btn btn-sm grow"><Icon name="play" size={12}/><span>Avvia audit</span></button>
                <button onClick={() => setTab("editor")} className="btn btn-sm btn-ghost"><Icon name="pencil" size={12}/></button>
              </div>
            </div>
          ))}
          <div className="card" onClick={() => ui.showForm({
            title: "Nuovo modello di checklist",
            intro: "Definisci il nome e la struttura. Aggiungerai sezioni e voci nel passo successivo.",
            fields: [
              { label: "Nome del modello",   placeholder: "es. Audit magazzino — mensile" },
              { label: "Tipo di ambiente",   type: "select", options: ["Cantiere", "Officina", "Uffici", "Magazzino", "Misto"] },
              { label: "Frequenza consigliata", type: "select", options: ["Settimanale", "Mensile", "Trimestrale", "Semestrale", "Annuale"] },
              { label: "Parti da template",  type: "select", options: ["Vuoto", "Audit cantiere — settimanale", "Audit officina — mensile", "Audit uffici — semestrale"] },
            ],
            submitLabel: "Crea modello",
            onSubmit: () => { ui.toast("Modello creato — passa all'editor", { kind: "ok" }); setTab("editor"); },
          })} style={{ background: "var(--bg-sunk)", border: "1px dashed var(--border-strong)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 220, cursor: "pointer" }}>
            <div className="icon-frame" style={{ background: "var(--bg-elev)" }}><Icon name="plus" size={20} color="var(--text-soft)"/></div>
            <div style={{ fontWeight: 500, marginTop: 8 }}>Nuovo modello</div>
            <div className="faint" style={{ fontSize: 12, textAlign: "center", maxWidth: 200, marginTop: 4 }}>Crea una checklist personalizzata partendo da zero o da un template</div>
          </div>
        </div>
      )}

      {tab === "editor" && <ChecklistEditor/>}

      {runOpen && <RunAuditModal onClose={() => setRunOpen(false)} onStart={() => { setRunOpen(false); setTab("editor"); ui.toast("Audit avviato — compila la checklist", { kind: "ok" }); }}/>}
    </div>
  );
};

const ChecklistEditor = () => {
  const { AUDIT_TEMPLATES, EMPLOYEES } = window.SafeHubData;
  const ui = useUI();
  const tpl = AUDIT_TEMPLATES[0];
  const [items, setItems] = React.useState(() => {
    const out = {};
    tpl.sections.forEach((s, si) => s.items.forEach((_, ii) => out[`${si}-${ii}`] = "todo"));
    out["0-0"] = "ok";
    out["0-1"] = "ok";
    out["0-2"] = "na";
    out["1-1"] = "ok";
    out["1-2"] = "issue";
    return out;
  });

  const cycle = (key) => {
    const order = ["todo", "ok", "issue", "na"];
    const cur = items[key];
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setItems({ ...items, [key]: next });
  };

  const counts = Object.values(items).reduce((acc, v) => ({ ...acc, [v]: (acc[v] || 0) + 1 }), {});
  const total = tpl.sections.reduce((acc, s) => acc + s.items.length, 0);
  const done = counts.ok + counts.issue + counts.na || 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
      <div className="card">
        <div className="row between" style={{ marginBottom: 6 }}>
          <div>
            <h3 style={{ fontSize: 17 }}>{tpl.name}</h3>
            <div className="faint" style={{ fontSize: 12 }}>Cantiere A14 · 25 maggio 2026 · Anna Ferri</div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-sm" onClick={() => ui.toast("Apertura modello in modalità modifica…")}><Icon name="pencil" size={12}/><span>Modifica modello</span></button>
            <button onClick={(e) => ui.showMenu(e.currentTarget, [
              { label: "Salva come bozza",       icon: "fileText", onClick: () => ui.toast("Bozza salvata", { kind: "ok" }) },
              { label: "Duplica audit",          icon: "fileText", onClick: () => ui.toast("Audit duplicato come bozza", { kind: "ok" }) },
              { label: "Stampa anteprima",       icon: "download", onClick: () => ui.toast("Anteprima stampa pronta") },
              { divider: true },
              { label: "Annulla audit", icon: "trash", danger: true, onClick: () => ui.confirm({
                  title: "Annullare l'audit?",
                  body: "Perderai tutti gli stati impostati. Sei sicura?",
                  confirmLabel: "Annulla audit", danger: true,
                  action: () => ui.toast("Audit annullato")
                }) },
            ], { align: "right" })} className="btn btn-sm btn-ghost"><Icon name="more" size={14}/></button>
          </div>
        </div>
        <div className="progress" style={{ marginBottom: 16 }}>
          <span style={{ width: `${total ? (done/total)*100 : 0}%` }}/>
        </div>

        {tpl.sections.map((s, si) => (
          <div key={si} style={{ marginBottom: 22 }}>
            <div className="row between" style={{ marginBottom: 8 }}>
              <h4 style={{ fontSize: 14 }}>{s.name}</h4>
              <span className="faint" style={{ fontSize: 12 }}>{s.items.length} controlli</span>
            </div>
            {s.items.map((it, ii) => {
              const key = `${si}-${ii}`;
              const status = items[key];
              return (
                <div key={ii} className="checklist-item">
                  <button onClick={() => cycle(key)} className={`check ${status === "ok" ? "checked" : ""}`} style={{
                    background: status === "ok" ? "var(--ok)" : status === "issue" ? "var(--danger)" : status === "na" ? "var(--bg-sunk)" : "var(--bg-elev)",
                    borderColor: status === "ok" ? "var(--ok)" : status === "issue" ? "var(--danger)" : status === "na" ? "var(--border-strong)" : "var(--border-strong)",
                  }}>
                    {status === "ok" && <Icon name="check" size={12} color="white" strokeWidth={3}/>}
                    {status === "issue" && <Icon name="x" size={12} color="white" strokeWidth={3}/>}
                    {status === "na" && <span style={{ fontSize: 10, color: "var(--text-soft)", fontWeight: 600 }}>n/a</span>}
                  </button>
                  <div className="grow col" style={{ gap: status === "issue" ? 8 : 0 }}>
                    <div style={{ fontSize: 13.5, color: status === "issue" ? "var(--text)" : status === "ok" ? "var(--text-soft)" : "var(--text)" }}>{it}</div>
                    {status === "issue" && (
                      <div className="card card-tight slide-up" style={{ background: "var(--danger-soft)", border: "1px solid var(--danger-soft)" }}>
                        <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                          <Icon name="alertTriangle" size={13} color="var(--danger)"/>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)" }}>Non conformità</span>
                        </div>
                        <textarea
                          placeholder="Descrivi il problema riscontrato…"
                          className="input"
                          style={{ height: 60, padding: 10, background: "var(--bg-elev)", marginBottom: 6 }}
                          defaultValue={ii === 1 && si === 1 ? "Parapetto lato sud livello 3 mancante. Bloccare accesso area." : ""}
                        />
                        <div className="row" style={{ gap: 6 }}>
                          <button onClick={() => ui.toast("Apri fotocamera o seleziona file…")} className="btn btn-sm"><Icon name="camera" size={12}/><span>Allega foto</span></button>
                          <button onClick={(e) => ui.showMenu(e.currentTarget, EMPLOYEES.slice(0, 8).map(emp => ({
                            label: emp.name, icon: "user",
                            onClick: () => ui.toast(`Non conformità assegnata a ${emp.name}`, { kind: "ok" }),
                          })), { align: "left" })} className="btn btn-sm"><Icon name="user" size={12}/><span>Assegna a…</span></button>
                          <div className="grow"/>
                          <select className="select" style={{ width: 130, height: 30 }}>
                            <option>Gravità: media</option><option>Gravità: alta</option><option>Gravità: bassa</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <aside className="col" style={{ gap: 16 }}>
        <div className="card">
          <h4 style={{ marginBottom: 14 }}>Riepilogo audit</h4>
          <div className="col" style={{ gap: 10 }}>
            <SummaryRow label="Conformi" value={counts.ok || 0} accent="ok" total={total}/>
            <SummaryRow label="Non conformità" value={counts.issue || 0} accent="danger" total={total}/>
            <SummaryRow label="Non applicabili" value={counts.na || 0} accent="info" total={total}/>
            <SummaryRow label="Da verificare" value={counts.todo || 0} accent="warn" total={total}/>
          </div>
          <hr className="divider" style={{ margin: "16px 0" }}/>
          <div className="row between">
            <span className="faint" style={{ fontSize: 12 }}>Score parziale</span>
            <span className="mono" style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display)" }}>
              {total ? Math.round(100 * (counts.ok || 0) / (total - (counts.na || 0))) : 0}/100
            </span>
          </div>
        </div>
        <div className="card">
          <h4 style={{ marginBottom: 10 }}>Firma e chiusura</h4>
          <p className="faint" style={{ fontSize: 12.5, marginBottom: 12 }}>La firma chiude l'audit. Le non conformità verranno trasformate in azioni con scadenza.</p>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => ui.confirm({
            title: "Firmare e chiudere l'audit?",
            body: `${counts.issue || 0} non conformità saranno trasformate in azioni con scadenza. La firma sarà certificata digitalmente.`,
            confirmLabel: "Firma e chiudi",
            action: () => ui.toast("Audit firmato e archiviato. Azioni create.", { kind: "ok" }),
          })}>
            <Icon name="check" size={14}/><span>Firma e chiudi audit</span>
          </button>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 6, justifyContent: "center" }} onClick={() => ui.toast("Bozza salvata", { kind: "ok" })}>
            <span>Salva bozza</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

const SummaryRow = ({ label, value, accent, total }) => (
  <div className="row" style={{ gap: 10 }}>
    <span style={{ width: 10, height: 10, borderRadius: 3, background: `var(--${accent})` }}/>
    <span className="grow" style={{ fontSize: 13 }}>{label}</span>
    <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
    <span className="faint mono" style={{ fontSize: 11.5, minWidth: 28, textAlign: "right" }}>{total ? Math.round(100 * value / total) : 0}%</span>
  </div>
);

const RunAuditModal = ({ onClose, onStart }) => {
  const { AUDIT_TEMPLATES } = window.SafeHubData;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Avvia un nuovo audit</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-body">
          <div className="field"><label>Modello di checklist</label>
            <select className="select">{AUDIT_TEMPLATES.map(t => <option key={t.id}>{t.name}</option>)}</select>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field grow"><label>Sede / Cantiere</label>
              <select className="select"><option>Cantiere A14</option><option>Cantiere Brescia</option><option>Sede legale</option></select>
            </div>
            <div className="field grow"><label>Data</label>
              <input className="input" type="date" defaultValue="2026-05-25"/>
            </div>
          </div>
          <div className="field"><label>Note iniziali</label>
            <textarea className="input" style={{ height: 70, padding: 10 }} placeholder="Es. sopralluogo straordinario per controllo ponteggi…"/>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn">Annulla</button>
          <button onClick={onStart || onClose} className="btn btn-primary"><Icon name="play" size={13}/><span>Inizia audit</span></button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Audit });
