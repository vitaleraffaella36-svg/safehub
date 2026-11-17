/* ============================================================
   SafeHub — Impostazioni alert / notifiche
   ============================================================ */

const Alerts = () => {
  const { ALERT_RULES } = window.SafeHubData;
  const ui = useUI();
  const [rules, setRules] = React.useState(ALERT_RULES);
  const [editingId, setEditingId] = React.useState(null);

  const toggle = (id) => setRules(rs => rs.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Alert e notifiche</h1>
          <p className="subtitle">Imposta quando e a chi inviare promemoria automatici sulle scadenze.</p>
        </div>
        <button className="btn btn-primary" onClick={() => ui.showForm({
          title: "Nuova regola di alert",
          intro: "Definisci una regola personalizzata per inviare promemoria automatici.",
          fields: [
            { label: "Nome della regola", placeholder: "es. Scadenze patentini" },
            { label: "Si applica a",      type: "select", options: ["Tutte le scadenze", "Solo formazione", "Solo documenti", "Solo visite mediche", "Solo certificati"] },
            { label: "Avvisa (giorni prima)", placeholder: "es. 30, 15, 7" },
            { label: "Destinatari ruolo",  type: "select", options: ["RSPP", "RSPP + HR", "RSPP + Direzione", "Tutti gli admin"] },
            { label: "Canali",              type: "select", options: ["Email", "Email + in-app", "Email + SMS (a pagamento)"] },
          ],
          submitLabel: "Crea regola",
          onSubmit: () => ui.toast("Regola creata e attiva", { kind: "ok" }),
        })}><Icon name="plus" size={14}/><span>Nuova regola</span></button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
        <div className="col" style={{ gap: 12 }}>
          {rules.map(r => (
            <div key={r.id} className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="row" style={{ gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: r.enabled ? "var(--primary-soft)" : "var(--bg-sunk)",
                    color: r.enabled ? "var(--primary)" : "var(--text-faint)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon name="bell" size={16}/>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 600 }}>{r.name}</h4>
                    <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>
                      {r.enabled ? "Attiva" : "Disattiva"} · {r.channels.includes("email") && "Email"} ai ruoli: {r.recipients.join(", ")}
                    </div>
                  </div>
                </div>
                <Toggle on={r.enabled} onChange={() => toggle(r.id)}/>
              </div>

              <div className="row" style={{ gap: 6, alignItems: "center" }}>
                <span className="faint" style={{ fontSize: 12 }}>Avvisi:</span>
                {r.windows.map(w => (
                  <span key={w} className="chip" style={{ background: r.enabled ? "var(--primary-soft)" : "var(--bg-sunk)", color: r.enabled ? "var(--primary-strong)" : "var(--text-soft)", border: "none" }}>
                    {w} giorni prima
                  </span>
                ))}
                <div className="grow"/>
                <button onClick={() => setEditingId(r.id)} className="btn btn-sm btn-ghost"><Icon name="pencil" size={12}/><span>Modifica</span></button>
              </div>
            </div>
          ))}
        </div>

        <div className="col" style={{ gap: 14, position: "sticky", top: 0, alignSelf: "flex-start" }}>
          <div className="card">
            <div className="row" style={{ gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--info-soft)", color: "var(--info)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="mail" size={14}/>
              </div>
              <div>
                <h4 style={{ fontSize: 14 }}>Anteprima email</h4>
                <div className="faint" style={{ fontSize: 11.5 }}>Come arriverà il prossimo alert</div>
              </div>
            </div>
            <div style={{ background: "var(--bg-sunk)", padding: 14, borderRadius: 8, fontSize: 12.5 }}>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--text-faint)", fontSize: 11, marginBottom: 8 }}>
                Da: noreply@safehub.it<br/>
                A: a.ferri@tretorri.it
              </div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                📅 4 scadenze nei prossimi 7 giorni
              </div>
              <div style={{ marginBottom: 10, color: "var(--text-soft)" }}>
                Ciao Anna,<br/>
                hai <strong>4 scadenze critiche</strong> entro il 1° giugno:
              </div>
              <div className="col" style={{ gap: 4, marginBottom: 10 }}>
                {[
                  "Formazione base — Davide Moretti (3g)",
                  "Patentino carrelli — Giulia Romano (6g)",
                  "DVR Cantiere A14 (11g)",
                  "Idoneità medica — Pietro Conti (14g)",
                ].map((t, i) => (
                  <div key={i} className="row" style={{ gap: 6 }}>
                    <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--text-faint)" }}/>
                    <span style={{ color: "var(--text-soft)" }}>{t}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => ui.goto("scadenze")}>Vai a SafeHub</button>
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: 12 }}>Canali abilitati</h4>
            <div className="col" style={{ gap: 10 }}>
              <ChannelRow icon="mail" label="Email" sub="Configurato" on={true} editable/>
              <ChannelRow icon="phone" label="SMS" sub="Add-on a pagamento" on={false}/>
              <ChannelRow icon="bellRing" label="Notifiche in-app" sub="Sempre attive" on={true} editable/>
              <ChannelRow icon="link" label="Webhook / Slack" sub="Non configurato" on={false}/>
            </div>
          </div>
        </div>
      </div>

      {editingId && <EditRuleModal rule={rules.find(r => r.id === editingId)} onClose={() => setEditingId(null)}/>}
    </div>
  );
};

const Toggle = ({ on, onChange }) => (
  <button onClick={onChange} style={{
    width: 36, height: 22, borderRadius: 999, position: "relative",
    background: on ? "var(--primary)" : "var(--border-strong)",
    transition: "background 0.18s"
  }}>
    <span style={{
      position: "absolute", top: 2, left: on ? 16 : 2,
      width: 18, height: 18, borderRadius: 999, background: "white",
      transition: "left 0.18s", boxShadow: "var(--shadow-sm)"
    }}/>
  </button>
);

const ChannelRow = ({ icon, label, sub, on, editable }) => {
  const ui = useUI();
  return (
    <div className="row" style={{ gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: on ? "var(--bg-tinted)" : "var(--bg-sunk)", color: on ? "var(--text)" : "var(--text-faint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={13}/>
      </div>
      <div className="grow col" style={{ gap: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div className="faint" style={{ fontSize: 11.5 }}>{sub}</div>
      </div>
      {on
        ? <span className="chip chip-ok">attivo</span>
        : <button className="btn btn-sm" onClick={() => ui.showForm({
            title: `Configura canale ${label}`,
            intro: editable === undefined
              ? `Attiva il canale ${label} per ricevere gli alert anche su questo medium.`
              : `Modifica le impostazioni del canale ${label}.`,
            fields: label === "SMS"
              ? [
                  { label: "Numero di telefono", placeholder: "+39 ..." },
                  { label: "Piano consumo", type: "select", options: ["20 SMS/mese (gratis)", "100 SMS/mese (€15)", "500 SMS/mese (€55)"] },
                ]
              : [
                  { label: "Webhook URL", placeholder: "https://hooks.slack.com/..." },
                  { label: "Eventi inviati", type: "select", options: ["Tutti", "Solo critici (urgenza alta)", "Solo audit"] },
                ],
            submitLabel: editable === undefined ? "Attiva" : "Salva",
            onSubmit: () => ui.toast(`Canale ${label} configurato`, { kind: "ok" }),
          })}>{editable === undefined ? "Attiva" : "Configura"}</button>}
    </div>
  );
};

const EditRuleModal = ({ rule, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Modifica regola alert</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-body">
          <div className="field"><label>Nome della regola</label>
            <input className="input" defaultValue={rule.name}/>
          </div>
          <div className="field">
            <label>Quando inviare l'avviso</label>
            <div className="col" style={{ gap: 8, padding: 10, background: "var(--bg-sunk)", borderRadius: 8 }}>
              {[60, 30, 15, 7, 3, 1].map(w => (
                <label key={w} className="row" style={{ gap: 8, fontSize: 13 }}>
                  <input type="checkbox" defaultChecked={rule.windows.includes(w)}/>
                  <span>{w} giorni prima della scadenza</span>
                </label>
              ))}
              <label className="row" style={{ gap: 8, fontSize: 13, borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 4 }}>
                <input type="checkbox"/>
                <span>Anche il giorno stesso della scadenza</span>
              </label>
            </div>
          </div>
          <div className="field"><label>Destinatari (ruoli)</label>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {["RSPP", "HR", "Direzione", "Admin azienda", "Capocantiere"].map(r => (
                <label key={r} className="row" style={{ gap: 6, padding: "5px 10px", border: `1px solid ${rule.recipients.includes(r) ? "var(--primary)" : "var(--border-strong)"}`, borderRadius: 999, fontSize: 12.5, background: rule.recipients.includes(r) ? "var(--primary-soft)" : "transparent", color: rule.recipients.includes(r) ? "var(--primary-strong)" : "var(--text-soft)" }}>
                  <input type="checkbox" defaultChecked={rule.recipients.includes(r)} style={{ display: "none" }}/>
                  {rule.recipients.includes(r) && <Icon name="check" size={11}/>}
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="field"><label>Email aggiuntive (opzionale)</label>
            <input className="input" placeholder="es. direzione@azienda.it, segreteria@…"/>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn">Annulla</button>
          <button onClick={onClose} className="btn btn-primary">Salva regola</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Alerts });
