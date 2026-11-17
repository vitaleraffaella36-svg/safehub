/* ============================================================
   SafeHub — Azienda (info, sedi, utenti, billing)
   ============================================================ */

const Azienda = () => {
  const { COMPANIES, EMPLOYEES, ROLES } = window.SafeHubData;
  const ui = useUI();
  const company = COMPANIES[0];

  const users = [
    { name: "Anna Ferri",         email: "a.ferri@tretorri.it",       role: "rspp",  lastSeen: "online" },
    { name: "Chiara Lombardi",    email: "c.lombardi@tretorri.it",    role: "admin", lastSeen: "5 min fa" },
    { name: "Marco Bianchi",      email: "m.bianchi@tretorri.it",     role: "hr",    lastSeen: "1h fa" },
    { name: "Elena Rizzo",        email: "e.rizzo@tretorri.it",       role: "hr",    lastSeen: "ieri" },
    { name: "Vincenzo Russo",     email: "v.russo@tretorri.it",       role: "worker",lastSeen: "2 giorni fa" },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Azienda</h1>
          <p className="subtitle">Anagrafica, sedi, utenti con accesso a SafeHub e abbonamento.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 14, background: "var(--bg-tinted)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="building" size={26} color="var(--text)"/>
          </div>
          <div className="grow col" style={{ gap: 4 }}>
            <h2 style={{ fontSize: 22 }}>{company.name}</h2>
            <div className="row" style={{ gap: 16, color: "var(--text-soft)", fontSize: 13 }}>
              <span><strong>Settore:</strong> {company.sector}</span>
              <span><strong>P.IVA:</strong> <span className="mono">{company.vatin}</span></span>
              <span><strong>Dipendenti:</strong> {company.employees}</span>
              <span><strong>Sedi:</strong> {company.sites}</span>
            </div>
          </div>
          <button className="btn" onClick={() => ui.showForm({
            title: "Modifica dati azienda",
            fields: [
              { label: "Ragione sociale", default: company.name },
              { label: "P.IVA", default: company.vatin },
              { label: "Settore", type: "select", options: ["Edilizia", "Manifattura", "Logistica", "Servizi", "Altro"], default: company.sector },
              { label: "Email amministrativa", type: "email", placeholder: "amministrazione@..." },
              { label: "PEC", type: "email", placeholder: "pec@..." },
            ],
            submitLabel: "Salva modifiche",
            onSubmit: () => ui.toast("Dati aziendali aggiornati", { kind: "ok" }),
          })}><Icon name="pencil" size={13}/><span>Modifica dati</span></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>Sedi e cantieri</h3>
          <div className="col" style={{ gap: 8 }}>
            {[
              { name: "Sede legale — Milano",     address: "Via Manzoni 24, 20121 Milano",    type: "Direzione",   employees: 8,  compliance: 96 },
              { name: "Cantiere A14",             address: "Casello A14 km 132, Cesena",      type: "Cantiere",    employees: 18, compliance: 64 },
              { name: "Cantiere Brescia",         address: "Via dei Mille 18, Brescia",       type: "Cantiere",    employees: 12, compliance: 78 },
              { name: "Magazzino — Bergamo",      address: "SP671, Treviglio (BG)",            type: "Magazzino",   employees: 5,  compliance: 88 },
            ].map((s, i) => (
              <button key={i} onClick={() => ui.toast(`Apertura dettagli sede "${s.name}"…`)} className="row" style={{ padding: 10, gap: 12, background: "var(--bg-sunk)", borderRadius: 8, width: "100%", textAlign: "left", border: "1px solid transparent" }}
                onMouseEnter={(el) => el.currentTarget.style.borderColor = "var(--border-strong)"}
                onMouseLeave={(el) => el.currentTarget.style.borderColor = "transparent"}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-elev)", color: "var(--primary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="mapPin" size={14}/>
                </div>
                <div className="grow col" style={{ gap: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{s.name}</div>
                  <div className="faint" style={{ fontSize: 11.5 }}>{s.address}</div>
                </div>
                <span className="chip">{s.type}</span>
                <span className="faint mono" style={{ fontSize: 12 }}>{s.employees} pers.</span>
                <Icon name="chevronRight" size={13} color="var(--text-faint)"/>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="row between" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 15 }}>Abbonamento</h3>
            <span className="chip chip-primary">Piano Business</span>
          </div>
          <div className="col" style={{ gap: 14 }}>
            <div>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>Dipendenti monitorati</span>
                <span className="mono" style={{ fontSize: 12.5 }}>47 / 100</span>
              </div>
              <div className="progress"><span style={{ width: "47%" }}/></div>
            </div>
            <div>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>Storage documenti</span>
                <span className="mono" style={{ fontSize: 12.5 }}>0.6 GB / 5 GB</span>
              </div>
              <div className="progress"><span style={{ width: "12%" }}/></div>
            </div>
            <div>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>Utenti dashboard</span>
                <span className="mono" style={{ fontSize: 12.5 }}>5 / 10</span>
              </div>
              <div className="progress"><span style={{ width: "50%" }}/></div>
            </div>
            <hr className="divider"/>
            <div className="row between">
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>€189<span className="faint" style={{ fontSize: 13, fontWeight: 400 }}>/mese</span></div>
                <div className="faint" style={{ fontSize: 11.5 }}>Prossimo rinnovo: 1 luglio 2026</div>
              </div>
              <button className="btn" onClick={() => ui.showForm({
                title: "Gestisci piano di abbonamento",
                intro: "Piano attuale: Business · €189/mese · rinnovo 1 luglio 2026.",
                fields: [
                  { label: "Piano",        type: "select", options: ["Starter — €49/mese (fino a 25 dip.)", "Business — €189/mese (fino a 100 dip.) ✓", "Enterprise — €490/mese (illimitato)"] },
                  { label: "Periodo",      type: "select", options: ["Mensile", "Annuale (-15%)"] },
                  { label: "Metodo di pagamento", type: "select", options: ["Carta •••• 4242 (in uso)", "Bonifico SDD", "Aggiungi nuovo metodo…"] },
                ],
                submitLabel: "Aggiorna piano",
                onSubmit: () => ui.toast("Piano aggiornato. Riceverai un riepilogo via email.", { kind: "ok" }),
              })}>Gestisci piano</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-flush">
        <div className="row between" style={{ padding: "16px 20px" }}>
          <div>
            <h3 style={{ fontSize: 15 }}>Utenti con accesso a SafeHub</h3>
            <div className="faint" style={{ fontSize: 12 }}>Persone che possono accedere alla dashboard web. I lavoratori usano solo l'app mobile.</div>
          </div>
          <button className="btn btn-primary" onClick={() => ui.showForm({
            title: "Invita utente al workspace",
            intro: "L'utente riceverà un'email per attivare il proprio accesso a SafeHub. Può accedere solo a questa azienda.",
            fields: [
              { label: "Email", type: "email", placeholder: "nome@azienda.it" },
              { label: "Ruolo", type: "select", options: ["RSPP", "HR", "Admin azienda", "Direzione", "Lavoratore (solo app mobile)"] },
              { label: "Permessi aggiuntivi", type: "select", options: ["Standard del ruolo", "Solo lettura", "Personalizzati…"] },
              { label: "Messaggio (opzionale)", type: "textarea", placeholder: "Ciao, ti invito a usare SafeHub…" },
            ],
            submitLabel: "Invia invito",
            onSubmit: () => ui.toast("Invito inviato", { kind: "ok" }),
          })}><Icon name="plus" size={13}/><span>Invita utente</span></button>
        </div>
        <hr className="divider"/>
        <table className="table">
          <thead><tr><th>Persona</th><th>Ruolo</th><th>Permessi</th><th>Ultimo accesso</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email}>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="avatar">{initials(u.name)}</div>
                    <div className="col" style={{ gap: 1 }}>
                      <div style={{ fontWeight: 500 }}>{u.name}</div>
                      <div className="faint mono" style={{ fontSize: 11.5 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="chip chip-primary">{ROLES[u.role].label}</span>
                </td>
                <td className="muted" style={{ fontSize: 12.5, maxWidth: 280 }}>{ROLES[u.role].desc}</td>
                <td>
                  <span className="row" style={{ gap: 6, fontSize: 12.5 }}>
                    {u.lastSeen === "online" && <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--ok)" }}/>}
                    <span className={u.lastSeen === "online" ? "" : "faint"}>{u.lastSeen}</span>
                  </span>
                </td>
                <td><button onClick={(ev) => ui.showMenu(ev.currentTarget, [
                  { label: "Cambia ruolo",        icon: "user",      onClick: () => ui.toast("Apertura modifica ruolo…") },
                  { label: "Invia reset password",icon: "mail",      onClick: () => ui.toast("Email di reset inviata", { kind: "ok" }) },
                  { label: "Trasferisci proprietà",icon: "arrowUpRight", onClick: () => ui.toast("Apertura trasferimento…") },
                  { divider: true },
                  { label: "Revoca accesso",      icon: "logout", danger: true, onClick: () => ui.confirm({
                      title: `Revocare l'accesso a ${u.name}?`,
                      body: "L'utente non potrà più accedere alla piattaforma. Il suo profilo di dipendente resterà visibile.",
                      confirmLabel: "Revoca accesso", danger: true,
                      action: () => ui.toast(`Accesso revocato a ${u.name}`)
                    }) },
                ], { align: "right" })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}><Icon name="more" size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============== Expiring detail drawer ==============
const ExpiringDrawer = ({ item, onClose }) => {
  const ui = useUI();
  if (!item) return null;
  const { fmtDate, daysUntil } = window.SafeHubData;
  const days = daysUntil(item.expires);
  const accent = days < 0 ? "danger" : days <= 7 ? "danger" : days <= 30 ? "warn" : "info";

  const actions = [
    { name: "Genera promemoria email", icon: "mail",        action: () => ui.toast("Promemoria inviato via email", { kind: "ok" }) },
    { name: "Assegna a un responsabile", icon: "user",      action: () => ui.toast("Apertura selezione responsabile…") },
    { name: "Pianifica un'azione di rinnovo", icon: "calendar", action: () => ui.toast("Apertura pianificazione rinnovo…") },
    { name: "Allega documento di conferma", icon: "upload", action: () => ui.toast("Apertura caricamento documento…") },
  ];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}/>
      <div className="drawer" style={{ width: 560 }}>
        <div className="row between" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div className="row" style={{ gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `var(--${accent}-soft)`, color: `var(--${accent})`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={item.type === "Formazione" ? "graduation" : item.type === "Documento" ? "fileText" : "shield"} size={20}/>
            </div>
            <div className="col" style={{ gap: 2 }}>
              <span className="chip">{item.type}</span>
              <h2 style={{ fontSize: 18 }}>{item.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>

        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          <div className="card" style={{ background: `var(--${accent}-soft)`, border: `1px solid var(--${accent}-soft)`, marginBottom: 18 }}>
            <div className="row" style={{ gap: 12 }}>
              <Icon name="clock" size={18} color={`var(--${accent})`}/>
              <div className="grow">
                <div style={{ fontWeight: 600, fontSize: 14, color: `var(--${accent})` }}>
                  {days < 0 ? `Scaduto da ${-days} giorni` : days === 0 ? "Scade oggi" : `Scade fra ${days} giorni`}
                </div>
                <div style={{ fontSize: 12.5, color: `var(--${accent})`, opacity: 0.85 }}>Data scadenza: {fmtDate(item.expires)}</div>
              </div>
            </div>
          </div>

          {item.employee && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>Riferito a</div>
              <div className="row" style={{ gap: 10 }}>
                <div className="avatar">{initials(item.employee)}</div>
                <div className="grow">
                  <div style={{ fontWeight: 500 }}>{item.employee}</div>
                  <div className="faint" style={{ fontSize: 12 }}>Cantiere A14 · Operaia specializzata</div>
                </div>
                <button onClick={() => { ui.toast(`Apertura profilo di ${item.employee}`); onClose(); }} className="btn btn-sm">Vai al profilo</button>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 10 }}>Azioni rapide</h4>
            <div className="col" style={{ gap: 6 }}>
              {actions.map((a, i) => (
                <button key={i} onClick={a.action} className="row" style={{
                  padding: 12, gap: 12, background: "var(--bg-sunk)", borderRadius: 8, width: "100%", textAlign: "left"
                }}
                  onMouseEnter={(el) => el.currentTarget.style.background = "var(--bg-tinted)"}
                  onMouseLeave={(el) => el.currentTarget.style.background = "var(--bg-sunk)"}>
                  <Icon name={a.icon} size={15} color="var(--primary)"/>
                  <span style={{ fontSize: 13, fontWeight: 500 }} className="grow">{a.name}</span>
                  <Icon name="arrowRight" size={13} color="var(--text-faint)"/>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: 10 }}>Storia di questa scadenza</h4>
            <div className="card">
              <div className="col" style={{ gap: 14 }}>
                {[
                  { d: "ieri",       e: "Promemoria automatico inviato (7 giorni prima)",   icon: "mail" },
                  { d: "5 mag 2026", e: "Promemoria automatico inviato (15 giorni prima)",   icon: "mail" },
                  { d: "20 mag 2021", e: "Ultimo rinnovo registrato (validità 5 anni)",     icon: "shieldCheck" },
                  { d: "12 mag 2021", e: "Documento caricato da Anna Ferri",                 icon: "upload" },
                ].map((h, i) => (
                  <div key={i} className="row" style={{ gap: 12 }}>
                    <Icon name={h.icon} size={13} color="var(--text-soft)"/>
                    <span className="grow" style={{ fontSize: 12.5 }}>{h.e}</span>
                    <span className="faint mono" style={{ fontSize: 11 }}>{h.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: 8, padding: 16, borderTop: "1px solid var(--border)", background: "var(--bg-sunk)" }}>
          <button onClick={onClose} className="btn" style={{ flex: 1 }}>Posticipa</button>
          <button onClick={() => { ui.toast(`"${item.title}" segnata come rinnovata`, { kind: "ok" }); onClose(); }} className="btn btn-primary" style={{ flex: 1 }}>
            <Icon name="check" size={13}/>
            <span>Segna come rinnovata</span>
          </button>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { Azienda, ExpiringDrawer });
