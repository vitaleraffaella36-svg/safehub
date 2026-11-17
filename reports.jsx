/* ============================================================
   SafeHub — Report ed export
   ============================================================ */

const Reports = () => {
  const { REPORTS, fmtDate } = window.SafeHubData;
  const ui = useUI();
  const [selected, setSelected] = React.useState(REPORTS[1]);
  const [building, setBuilding] = React.useState(false);

  const run = () => {
    setBuilding(true);
    setTimeout(() => { setBuilding(false); ui.toast("Report generato — controlla i download", { kind: "ok" }); }, 1400);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Report</h1>
          <p className="subtitle">Esporta tutto ciò che serve per audit ASL, ITL, organi di controllo o board interno.</p>
        </div>
        <button className="btn" onClick={() => ui.showForm({
          title: "Report personalizzato",
          intro: "Costruisci un report partendo da zero scegliendo i campi e i filtri desiderati.",
          fields: [
            { label: "Nome del report", placeholder: "es. Compliance trimestrale board" },
            { label: "Sorgenti dati",   type: "select", options: ["Dipendenti", "Formazione", "Documenti", "Audit", "Near-miss", "Tutte"] },
            { label: "Filtri",          type: "textarea", placeholder: "Es. Solo Cantiere A14, ultimi 90 giorni…" },
            { label: "Formato",         type: "select", options: ["PDF", "Excel", "Entrambi"] },
            { label: "Frequenza",       type: "select", options: ["Una tantum", "Settimanale", "Mensile", "Trimestrale"] },
          ],
          submitLabel: "Crea report",
          onSubmit: () => ui.toast("Report personalizzato creato", { kind: "ok" }),
        })}><Icon name="plus" size={14}/><span>Report personalizzato</span></button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="col" style={{ gap: 10 }}>
          {REPORTS.map(r => (
            <div
              key={r.id}
              onClick={() => setSelected(r)}
              className="card"
              style={{
                cursor: "pointer",
                border: `1px solid ${selected.id === r.id ? "var(--primary)" : "var(--border)"}`,
                background: selected.id === r.id ? "var(--primary-soft)" : "var(--bg-elev)",
                padding: 16,
              }}
            >
              <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: "var(--bg-elev)", color: "var(--primary)",
                  border: "1px solid var(--border)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon name={r.category === "KPI" ? "barChart" : r.category === "Infortuni" ? "alertTriangle" : r.category === "Audit" ? "clipboardCheck" : r.category === "Compliance" ? "shieldCheck" : "fileText"} size={16}/>
                </div>
                <div className="grow col" style={{ gap: 4 }}>
                  <div className="row between">
                    <h4 style={{ fontSize: 14 }}>{r.name}</h4>
                    <Icon name="chevronRight" size={14} color="var(--text-faint)"/>
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--text-soft)", margin: 0 }}>{r.desc}</p>
                  <div className="row" style={{ gap: 8, marginTop: 4 }}>
                    <span className="chip">{r.category}</span>
                    {r.format.map(f => <span key={f} className="chip mono" style={{ textTransform: "uppercase" }}>{f}</span>)}
                    <span className="faint" style={{ fontSize: 11, marginLeft: "auto" }}>ultimo: {fmtDate(r.last_run)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ alignSelf: "flex-start", position: "sticky", top: 0 }}>
          <div className="row between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 17 }}>{selected.name}</h3>
            <span className="chip">{selected.category}</span>
          </div>
          <p className="muted" style={{ fontSize: 13, marginBottom: 18 }}>{selected.desc}</p>

          <div className="field"><label>Periodo</label>
            <div className="row" style={{ gap: 8 }}>
              <input className="input" type="date" defaultValue="2026-01-01"/>
              <span className="faint">→</span>
              <input className="input" type="date" defaultValue="2026-05-25"/>
            </div>
          </div>

          <div className="row" style={{ gap: 12 }}>
            <div className="field grow"><label>Sede</label>
              <select className="select"><option>Tutte le sedi</option><option>Cantiere A14</option><option>Cantiere Brescia</option></select>
            </div>
            <div className="field grow"><label>Reparto</label>
              <select className="select"><option>Tutti i reparti</option><option>Cantieri</option><option>Direzione</option></select>
            </div>
          </div>

          <div className="field">
            <label>Formato di esportazione</label>
            <div className="row" style={{ gap: 6 }}>
              {selected.format.map(f => (
                <button key={f} onClick={() => { setBuilding(true); setTimeout(() => { setBuilding(false); ui.toast(`${selected.name} — ${f.toUpperCase()} scaricato`, { kind: "ok" }); }, 900); }} className="btn btn-sm" style={{ textTransform: "uppercase", flex: 1 }}>
                  <Icon name="download" size={12}/><span className="mono">{f}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="row" style={{ gap: 8, color: "var(--text-soft)", fontSize: 13, marginBottom: 12 }}>
            <input type="checkbox" defaultChecked/><span>Includi grafici e copertina</span>
          </label>
          <label className="row" style={{ gap: 8, color: "var(--text-soft)", fontSize: 13, marginBottom: 18 }}>
            <input type="checkbox"/><span>Pianifica generazione mensile automatica</span>
          </label>

          {!building ? (
            <button onClick={run} className="btn btn-primary" style={{ width: "100%", height: 42 }}>
              <Icon name="zap" size={14}/><span>Genera report adesso</span>
            </button>
          ) : (
            <div className="col" style={{ gap: 6 }}>
              <div className="row" style={{ gap: 8 }}>
                <div style={{ width: 16, height: 16, borderRadius: 999, border: "2px solid var(--primary-soft)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite" }}/>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Generazione in corso…</span>
              </div>
              <div className="progress"><span style={{ width: "60%" }}/></div>
              <div className="faint" style={{ fontSize: 11.5 }}>Stiamo raccogliendo i dati di 142 record</div>
            </div>
          )}

          <hr className="divider" style={{ margin: "18px 0" }}/>
          <div>
            <div className="faint" style={{ fontSize: 12, marginBottom: 8 }}>Esportazioni recenti</div>
            <div className="col" style={{ gap: 6 }}>
              {[
                { name: "Scadenziario_2026-05-24.xlsx", date: "ieri", size: "112 KB" },
                { name: "Stato_formazione_q1.pdf", date: "12 mag", size: "880 KB" },
                { name: "Audit_aprile_2026.pdf", date: "30 apr", size: "1.4 MB" },
              ].map((f, i) => (
                <button key={i} onClick={() => ui.toast(`Download "${f.name}"…`, { kind: "ok" })} className="row" style={{ padding: 8, gap: 8, background: "var(--bg-sunk)", borderRadius: 6, width: "100%", textAlign: "left", border: "none" }}>
                  <Icon name="fileText" size={13} color="var(--text-soft)"/>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }} className="grow">{f.name}</span>
                  <span className="faint mono" style={{ fontSize: 11 }}>{f.size}</span>
                  <span className="faint" style={{ fontSize: 11 }}>{f.date}</span>
                  <Icon name="download" size={13} color="var(--text-soft)"/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

Object.assign(window, { Reports });
