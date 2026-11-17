/* ============================================================
   SafeHub — Scadenze (lista completa con filtri e azioni)
   ============================================================ */

const Scadenze = ({ openExpiring }) => {
  const { EXPIRING, fmtDate, daysUntil } = window.SafeHubData;
  const ui = useUI();
  const [filter, setFilter] = React.useState("all");
  const [view, setView] = React.useState("list"); // list | timeline

  const filtered = EXPIRING.filter(e => {
    if (filter === "all") return true;
    if (filter === "overdue") return daysUntil(e.expires) < 0;
    if (filter === "week") return daysUntil(e.expires) >= 0 && daysUntil(e.expires) <= 7;
    if (filter === "month") return daysUntil(e.expires) >= 0 && daysUntil(e.expires) <= 30;
    return e.type.toLowerCase().includes(filter);
  }).sort((a, b) => new Date(a.expires) - new Date(b.expires));

  const counts = {
    all: EXPIRING.length,
    overdue: EXPIRING.filter(e => daysUntil(e.expires) < 0).length,
    week: EXPIRING.filter(e => daysUntil(e.expires) >= 0 && daysUntil(e.expires) <= 7).length,
    month: EXPIRING.filter(e => daysUntil(e.expires) >= 0 && daysUntil(e.expires) <= 30).length,
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Scadenze</h1>
          <p className="subtitle">Tutto ciò che richiede un'azione per restare in conformità.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => ui.showForm({
            title: "Invia promemoria scadenze",
            intro: "Invia un riepilogo manuale ai destinatari selezionati. Non sostituisce le regole automatiche.",
            fields: [
              { label: "Destinatari", type: "select", options: ["RSPP", "HR + RSPP", "Direzione", "Tutti i ruoli admin"] },
              { label: "Filtra scadenze entro", type: "select", options: ["7 giorni", "15 giorni", "30 giorni", "60 giorni"] },
              { label: "Messaggio aggiuntivo (opzionale)", type: "textarea", placeholder: "Es. controllo periodico mensile" },
            ],
            submitLabel: "Invia ora",
            onSubmit: () => ui.toast("Promemoria inviato a 3 destinatari", { kind: "ok" }),
          })}><Icon name="mail" size={14}/><span>Invia promemoria</span></button>
          <button className="btn btn-primary" onClick={() => ui.showForm({
            title: "Aggiungi scadenza manuale",
            intro: "Per elementi non gestiti automaticamente da formazione/documenti (es. revisioni macchinari).",
            fields: [
              { label: "Titolo",  placeholder: "es. Revisione gru LR1100" },
              { label: "Tipo",    type: "select", options: ["Documento", "Certificato", "Formazione", "Visita medica", "Altro"] },
              { label: "Riferito a (opzionale)", placeholder: "Nome dipendente o reparto" },
              { label: "Data di scadenza", type: "date" },
              { label: "Note",    type: "textarea" },
            ],
            submitLabel: "Aggiungi scadenza",
            onSubmit: () => ui.toast("Scadenza aggiunta al scadenziario", { kind: "ok" }),
          })}><Icon name="plus" size={14}/><span>Aggiungi scadenza</span></button>
        </div>
      </div>

      <div className="row" style={{ gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>Tutte<span className="count">{counts.all}</span></FilterPill>
        <FilterPill active={filter === "overdue"} onClick={() => setFilter("overdue")} accent="danger">Scadute<span className="count">{counts.overdue}</span></FilterPill>
        <FilterPill active={filter === "week"} onClick={() => setFilter("week")} accent="danger">Entro 7 giorni<span className="count">{counts.week}</span></FilterPill>
        <FilterPill active={filter === "month"} onClick={() => setFilter("month")} accent="warn">Entro 30 giorni<span className="count">{counts.month}</span></FilterPill>
        <div className="grow"/>
        <div className="row" style={{ gap: 0, background: "var(--bg-sunk)", borderRadius: "var(--radius-sm)", padding: 3, border: "1px solid var(--border)" }}>
          <button onClick={() => setView("list")} className="btn btn-sm"
                  style={{ background: view === "list" ? "var(--bg-elev)" : "transparent", border: "none", boxShadow: view === "list" ? "var(--shadow-sm)" : "none" }}>
            <Icon name="hash" size={12}/><span>Lista</span>
          </button>
          <button onClick={() => setView("timeline")} className="btn btn-sm"
                  style={{ background: view === "timeline" ? "var(--bg-elev)" : "transparent", border: "none", boxShadow: view === "timeline" ? "var(--shadow-sm)" : "none" }}>
            <Icon name="history" size={12}/><span>Timeline</span>
          </button>
        </div>
      </div>

      {view === "list" && (
        <div className="card card-flush">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 32 }}><input type="checkbox"/></th>
                <th>Elemento</th>
                <th>Tipo</th>
                <th>Riferimento</th>
                <th>Data scadenza</th>
                <th>Stato</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const d = daysUntil(e.expires);
                const chipClass = d < 0 ? "chip-danger" : d <= 7 ? "chip-danger" : d <= 30 ? "chip-warn" : "chip-info";
                return (
                  <tr key={e.id} onClick={() => openExpiring(e)}>
                    <td onClick={ev => ev.stopPropagation()}><input type="checkbox"/></td>
                    <td style={{ fontWeight: 500 }}>{e.title}</td>
                    <td><span className="chip">{e.type}</span></td>
                    <td className="muted">{e.employee || <span className="faint">Documento aziendale</span>}</td>
                    <td className="mono muted">{fmtDate(e.expires)}</td>
                    <td>
                      <span className={`chip ${chipClass}`}>
                        {d < 0 ? `scaduta da ${-d}g` : d === 0 ? "oggi" : `fra ${d}g`}
                      </span>
                    </td>
                    <td onClick={ev => ev.stopPropagation()}>
                      <button onClick={(ev) => ui.showMenu(ev.currentTarget, [
                        { label: "Apri dettaglio",       icon: "eye",   onClick: () => openExpiring(e) },
                        { label: "Segna come rinnovata", icon: "check", onClick: () => ui.toast("Segnata come rinnovata", { kind: "ok" }) },
                        { label: "Invia promemoria",     icon: "mail",  onClick: () => ui.toast("Promemoria inviato", { kind: "ok" }) },
                        { label: "Posticipa di 7g",      icon: "clock", onClick: () => ui.toast("Posticipata di 7 giorni") },
                      ], { align: "right" })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}>
                        <Icon name="more" size={14} color="var(--text-faint)"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {view === "timeline" && (
        <div className="card">
          <div className="col" style={{ gap: 0 }}>
            {filtered.map((e, i, arr) => {
              const d = daysUntil(e.expires);
              const accent = d < 0 ? "danger" : d <= 7 ? "danger" : d <= 30 ? "warn" : "info";
              return (
                <div key={e.id} className="row" style={{ gap: 16, padding: "14px 0", alignItems: "flex-start", cursor: "pointer" }} onClick={() => openExpiring(e)}>
                  <div className="col" style={{ minWidth: 100, alignItems: "flex-end", paddingTop: 2 }}>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{fmtDate(e.expires)}</div>
                    <div className="faint" style={{ fontSize: 11.5 }}>{d < 0 ? `${-d}g fa` : `fra ${d}g`}</div>
                  </div>
                  <div style={{ position: "relative", flexShrink: 0, paddingTop: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 999, background: `var(--${accent})`, border: "3px solid var(--bg-elev)", boxShadow: `0 0 0 2px var(--${accent}-soft)` }}/>
                    {i < arr.length - 1 && <div style={{ position: "absolute", left: 5, top: 22, bottom: -14, width: 2, background: "var(--border)" }}/>}
                  </div>
                  <div className="grow col" style={{ gap: 4, paddingBottom: 10, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", paddingBottom: 14 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <strong>{e.title}</strong>
                      <span className="chip">{e.type}</span>
                    </div>
                    <div className="faint" style={{ fontSize: 12 }}>
                      {e.employee || "Documento aziendale"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { Scadenze });
