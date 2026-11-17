/* ============================================================
   SafeHub — Sistema UI condiviso
   Toasts, menu contestuali, drawers, command palette, notifiche
   ============================================================ */

const UIContext = React.createContext(null);
const useUI = () => React.useContext(UIContext);

const UIProvider = ({ children, goto }) => {
  const [toasts, setToasts] = React.useState([]);
  const [menu, setMenu] = React.useState(null);              // { anchor: Rect, items, align }
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifAnchor, setNotifAnchor] = React.useState(null);
  const [cmdOpen, setCmdOpen] = React.useState(false);

  const [nearMiss, setNearMiss] = React.useState(null);
  const [audit, setAudit] = React.useState(null);
  const [course, setCourse] = React.useState(null);
  const [docPreview, setDocPreview] = React.useState(null);

  const [confirmModal, setConfirmModal] = React.useState(null); // { title, body, action }
  const [genericModal, setGenericModal] = React.useState(null); // { title, fields, submitLabel, onSubmit }

  const toast = (message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { id, message, ...opts }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), opts.duration || 3200);
  };

  // Cmd+K global shortcut
  React.useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
        setMenu(null);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const api = {
    toast,
    showMenu: (anchorEl, items, opts = {}) => {
      const r = anchorEl.getBoundingClientRect();
      setMenu({ rect: { top: r.bottom + 4, left: r.left, right: r.right, width: r.width }, items, align: opts.align || "left", minWidth: opts.minWidth });
    },
    closeMenu: () => setMenu(null),
    showNotifications: (anchorEl) => {
      const r = anchorEl.getBoundingClientRect();
      setNotifAnchor({ top: r.bottom + 8, right: window.innerWidth - r.right });
      setNotifOpen(true);
    },
    openCommandPalette: () => setCmdOpen(true),
    openNearMiss: setNearMiss,
    openAudit: setAudit,
    openCourse: setCourse,
    openDocument: setDocPreview,
    confirm: (cfg) => setConfirmModal(cfg),
    showForm: (cfg) => setGenericModal(cfg),
    goto,
  };

  return (
    <UIContext.Provider value={api}>
      {children}

      {/* ============== Toast stack ============== */}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{
            background: t.kind === "danger" ? "oklch(0.4 0.16 25)" : t.kind === "ok" ? "oklch(0.4 0.1 155)" : "var(--text)",
          }}>
            {t.kind === "ok" && <Icon name="check" size={14} color="white" strokeWidth={3}/>}
            {t.kind === "danger" && <Icon name="alertTriangle" size={14} color="white"/>}
            {!t.kind && <Icon name="spark" size={14} color="white"/>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ============== Anchored menu (kebab/dropdown) ============== */}
      {menu && <AnchoredMenu menu={menu} onClose={() => setMenu(null)}/>}

      {/* ============== Notifications popover ============== */}
      {notifOpen && <NotificationsPanel anchor={notifAnchor} onClose={() => setNotifOpen(false)} ui={api}/>}

      {/* ============== Command palette ============== */}
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} ui={api}/>}

      {/* ============== Drawers ============== */}
      {nearMiss && <NearMissDrawer item={nearMiss} onClose={() => setNearMiss(null)} ui={api}/>}
      {audit    && <AuditDetailDrawer item={audit} onClose={() => setAudit(null)} ui={api}/>}
      {course   && <CourseDrawer course={course} onClose={() => setCourse(null)} ui={api}/>}

      {/* ============== Document preview ============== */}
      {docPreview && <DocumentPreviewModal doc={docPreview} onClose={() => setDocPreview(null)} ui={api}/>}

      {/* ============== Confirm / generic form ============== */}
      {confirmModal && <ConfirmModal cfg={confirmModal} onClose={() => setConfirmModal(null)}/>}
      {genericModal && <FormModal cfg={genericModal} onClose={() => setGenericModal(null)}/>}
    </UIContext.Provider>
  );
};

/* ============================================================
   Anchored menu
   ============================================================ */
const AnchoredMenu = ({ menu, onClose }) => {
  const { rect, items, align, minWidth = 200 } = menu;
  const style = align === "right"
    ? { position: "fixed", top: rect.top, right: window.innerWidth - rect.right, zIndex: 80, minWidth }
    : { position: "fixed", top: rect.top, left: rect.left, zIndex: 80, minWidth };
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 79 }}/>
      <div className="card slide-up" style={{ ...style, padding: 6, boxShadow: "var(--shadow-lg)" }}>
        {items.map((it, i) => {
          if (it.divider) return <hr key={i} className="divider" style={{ margin: "4px 6px" }}/>;
          if (it.header) return (
            <div key={i} style={{ padding: "6px 10px 4px", fontSize: 10.5, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {it.header}
            </div>
          );
          return (
            <button
              key={i}
              disabled={it.disabled}
              onClick={() => { onClose(); it.onClick && it.onClick(); }}
              className="row"
              style={{
                width: "100%", padding: "8px 10px", gap: 10, borderRadius: 6,
                color: it.danger ? "var(--danger)" : it.disabled ? "var(--text-faint)" : "var(--text)",
                background: "transparent", textAlign: "left", fontSize: 13,
                opacity: it.disabled ? 0.5 : 1,
              }}
              onMouseEnter={(e) => !it.disabled && (e.currentTarget.style.background = "var(--bg-sunk)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {it.icon && <Icon name={it.icon} size={14} color={it.danger ? "var(--danger)" : "var(--text-soft)"}/>}
              <span className="grow">{it.label}</span>
              {it.shortcut && <span className="kbd">{it.shortcut}</span>}
              {it.chip && <span className="chip">{it.chip}</span>}
            </button>
          );
        })}
      </div>
    </>
  );
};

/* ============================================================
   Notifications panel (bell)
   ============================================================ */
const NotificationsPanel = ({ anchor, onClose, ui }) => {
  const items = [
    { id: 1, when: "10 min fa", priority: "danger", icon: "alertTriangle",
      title: "Verifica gru cantiere Brescia scaduta",
      body: "Da 2 giorni · serve un intervento immediato",
      action: { label: "Vai", onClick: () => ui.toast("Apertura scheda verifica…") } },
    { id: 2, when: "1h fa", priority: "warn", icon: "graduation",
      title: "Giulia Romano ha completato il modulo \"Antincendio\"",
      body: "Attestato disponibile · pronto per la firma" },
    { id: 3, when: "1h fa", priority: "warn", icon: "alertTriangle",
      title: "Nuovo near-miss da Cantiere A14",
      body: "Caduta materiale da ponteggio — segnalato da Giulia Romano" },
    { id: 4, when: "3h fa", priority: "info", icon: "upload",
      title: "DVR_TreTorri_2025_v3.2.pdf caricato",
      body: "Da Anna Ferri · 4.8 MB" },
    { id: 5, when: "Ieri", priority: "info", icon: "mail",
      title: "Alert email inviato",
      body: "4 scadenze comunicate ai destinatari della regola \"Scadenze formazione\"" },
    { id: 6, when: "Ieri", priority: "ok", icon: "check",
      title: "Audit cantiere completato",
      body: "Score 87/100 · 2 findings da gestire" },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 79 }}/>
      <div className="card slide-up" style={{
        position: "fixed", top: anchor.top, right: anchor.right, zIndex: 80,
        width: 380, padding: 0, boxShadow: "var(--shadow-lg)", overflow: "hidden"
      }}>
        <div className="row between" style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h4 style={{ fontSize: 14 }}>Notifiche</h4>
            <div className="faint" style={{ fontSize: 11.5 }}>3 non lette · ultimi 7 giorni</div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => ui.toast("Tutte le notifiche segnate come lette", { kind: "ok" })}>
            <Icon name="check" size={12}/><span>Segna tutto</span>
          </button>
        </div>
        <div style={{ maxHeight: 440, overflowY: "auto" }}>
          {items.map(n => (
            <div key={n.id} onClick={() => { onClose(); n.action ? n.action.onClick() : ui.toast(`Apertura: ${n.title}`); }}
                 className="row" style={{ padding: "12px 16px", gap: 10, borderBottom: "1px solid var(--border)", cursor: "pointer", alignItems: "flex-start" }}
                 onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-sunk)")}
                 onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <div style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: `var(--${n.priority}-soft)`, color: `var(--${n.priority})`,
                display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 2,
              }}>
                <Icon name={n.icon} size={13}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{n.title}</div>
                <div className="faint" style={{ fontSize: 11.5, marginTop: 2 }}>{n.body}</div>
                <div className="faint mono" style={{ fontSize: 10.5, marginTop: 4 }}>{n.when}</div>
              </div>
              {n.priority === "danger" && <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--danger)", marginTop: 6 }}/>}
            </div>
          ))}
        </div>
        <div className="row between" style={{ padding: "10px 16px", background: "var(--bg-sunk)", borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-sm btn-ghost" onClick={() => { onClose(); ui.goto("alert"); }}>
            <Icon name="settings" size={12}/><span>Preferenze</span>
          </button>
          <button className="btn btn-sm btn-ghost" onClick={() => { onClose(); ui.toast("Apertura registro notifiche completo…"); }}>
            <span>Vedi tutte</span><Icon name="arrowRight" size={12}/>
          </button>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   Command palette (Cmd+K / search)
   ============================================================ */
const CommandPalette = ({ onClose, ui }) => {
  const { EMPLOYEES, DOCUMENTS, COURSES, EXPIRING, AUDIT_HISTORY } = window.SafeHubData;
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  const allResults = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const sections = [];

    const navItems = [
      { kind: "Vai a", label: "Panoramica", icon: "home", onClick: () => ui.goto("dashboard") },
      { kind: "Vai a", label: "Scadenze", icon: "calendar", onClick: () => ui.goto("scadenze") },
      { kind: "Vai a", label: "Dipendenti", icon: "users", onClick: () => ui.goto("dipendenti") },
      { kind: "Vai a", label: "Documenti", icon: "folder", onClick: () => ui.goto("documenti") },
      { kind: "Vai a", label: "Formazione", icon: "graduation", onClick: () => ui.goto("formazione") },
      { kind: "Vai a", label: "Audit & checklist", icon: "clipboardCheck", onClick: () => ui.goto("audit") },
      { kind: "Vai a", label: "Report", icon: "barChart", onClick: () => ui.goto("report") },
      { kind: "Vai a", label: "Alert e notifiche", icon: "bell", onClick: () => ui.goto("alert") },
    ];
    const actions = [
      { kind: "Azioni", label: "Nuovo dipendente", icon: "plus", shortcut: "N", onClick: () => ui.toast("Apertura: nuovo dipendente") },
      { kind: "Azioni", label: "Carica documento", icon: "upload", onClick: () => { ui.goto("documenti"); ui.toast("Apri il pulsante \"Carica documenti\" in alto a destra"); } },
      { kind: "Azioni", label: "Pianifica corso di formazione", icon: "graduation", onClick: () => ui.goto("formazione") },
      { kind: "Azioni", label: "Avvia un audit", icon: "clipboardCheck", onClick: () => ui.goto("audit") },
      { kind: "Azioni", label: "Esporta scadenziario PDF", icon: "download", onClick: () => ui.toast("Scadenziario in preparazione…", { kind: "ok" }) },
    ];

    const empMatches = EMPLOYEES.filter(e => !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
      .slice(0, 5).map(e => ({ kind: "Dipendenti", label: e.name, sub: `${e.role} · ${e.dept}`, icon: "user", onClick: () => { ui.goto("dipendenti"); ui.toast(`Apri il profilo di ${e.name}`); } }));

    const docMatches = DOCUMENTS.filter(d => !q || d.name.toLowerCase().includes(q))
      .slice(0, 5).map(d => ({ kind: "Documenti", label: d.name, sub: `${d.folder} · ${d.size}`, icon: "fileText", onClick: () => ui.openDocument(d) }));

    const expMatches = EXPIRING.filter(e => !q || e.title.toLowerCase().includes(q) || (e.employee || "").toLowerCase().includes(q))
      .slice(0, 5).map(e => ({ kind: "Scadenze", label: e.title, sub: e.employee || "Documento aziendale", icon: "clock", onClick: () => ui.goto("scadenze") }));

    if (q.length < 2) {
      sections.push({ title: "Vai a…", items: navItems });
      sections.push({ title: "Azioni rapide", items: actions });
    } else {
      const fNav = navItems.filter(i => i.label.toLowerCase().includes(q));
      const fAct = actions.filter(i => i.label.toLowerCase().includes(q));
      if (empMatches.length)  sections.push({ title: "Dipendenti", items: empMatches });
      if (docMatches.length)  sections.push({ title: "Documenti", items: docMatches });
      if (expMatches.length)  sections.push({ title: "Scadenze", items: expMatches });
      if (fAct.length)        sections.push({ title: "Azioni",    items: fAct });
      if (fNav.length)        sections.push({ title: "Vai a…",     items: fNav });
    }
    return sections;
  }, [query]);

  const flat = allResults.flatMap(s => s.items);

  React.useEffect(() => { setActive(0); }, [query]);

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(flat.length - 1, a + 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    if (e.key === "Enter")     { e.preventDefault(); flat[active]?.onClick(); onClose(); }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: "flex-start", paddingTop: "10vh" }}>
      <div onClick={e => e.stopPropagation()} className="card slide-up" style={{ width: 600, padding: 0, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
        <div className="row" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", gap: 12 }}>
          <Icon name="search" size={16} color="var(--text-soft)"/>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Cerca dipendenti, documenti, scadenze… oppure scrivi un comando"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, fontFamily: "var(--font-body)", color: "var(--text)" }}
          />
          <span className="kbd">ESC</span>
        </div>
        <div style={{ maxHeight: 460, overflowY: "auto", padding: 6 }}>
          {allResults.length === 0 && (
            <div className="empty" style={{ padding: 36 }}>
              <div className="icon-frame"><Icon name="search" size={18}/></div>
              <div style={{ fontSize: 13 }}>Nessun risultato per "<strong>{query}</strong>"</div>
            </div>
          )}
          {allResults.map((s, si) => (
            <div key={si}>
              <div style={{ padding: "8px 12px 4px", fontSize: 10.5, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.title}</div>
              {s.items.map((it, ii) => {
                const idx = allResults.slice(0, si).reduce((acc, x) => acc + x.items.length, 0) + ii;
                const isActive = idx === active;
                return (
                  <button
                    key={ii}
                    onClick={() => { it.onClick(); onClose(); }}
                    onMouseEnter={() => setActive(idx)}
                    className="row"
                    style={{
                      width: "100%", padding: "9px 12px", gap: 10, borderRadius: 6,
                      background: isActive ? "var(--bg-sunk)" : "transparent",
                      textAlign: "left",
                    }}>
                    <Icon name={it.icon} size={14} color="var(--text-soft)"/>
                    <div className="grow col" style={{ gap: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{it.label}</span>
                      {it.sub && <span className="faint" style={{ fontSize: 11.5 }}>{it.sub}</span>}
                    </div>
                    {it.shortcut && <span className="kbd">{it.shortcut}</span>}
                    {isActive && <Icon name="arrowRight" size={12} color="var(--text-faint)"/>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="row between" style={{ padding: "10px 16px", background: "var(--bg-sunk)", borderTop: "1px solid var(--border)", color: "var(--text-faint)", fontSize: 11.5 }}>
          <div className="row" style={{ gap: 12 }}>
            <span className="row" style={{ gap: 4 }}><span className="kbd">↑↓</span> per navigare</span>
            <span className="row" style={{ gap: 4 }}><span className="kbd">↵</span> per aprire</span>
          </div>
          <span>SafeHub Quick Find</span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Near-miss drawer
   ============================================================ */
const NearMissDrawer = ({ item, onClose, ui }) => {
  const { fmtDate } = window.SafeHubData;
  const [status, setStatus] = React.useState("nuovo");
  const statuses = [
    { id: "nuovo",        label: "Nuovo",         icon: "alertCircle", color: "warn" },
    { id: "in_carico",    label: "Preso in carico", icon: "user",       color: "info" },
    { id: "risolto",      label: "Risolto",       icon: "check",       color: "ok" },
  ];
  const severityColor = item.severity === "alta" ? "danger" : item.severity === "media" ? "warn" : "info";

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}/>
      <div className="drawer" style={{ width: 560 }}>
        <div className="row between" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div className="row" style={{ gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `var(--${severityColor}-soft)`, color: `var(--${severityColor})`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="alertTriangle" size={20}/>
            </div>
            <div>
              <div className="row" style={{ gap: 6 }}>
                <span className="chip">{item.type}</span>
                <span className={`chip chip-${severityColor}`}>gravità {item.severity}</span>
              </div>
              <h2 style={{ fontSize: 17, marginTop: 4 }}>Segnalazione #{item.id.toUpperCase()}</h2>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: 24 }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, fontWeight: 600 }}>Descrizione</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
          </div>

          {/* Photo placeholder */}
          <div style={{ marginBottom: 16 }}>
            <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>Foto allegate</div>
            <div className="row" style={{ gap: 10 }}>
              {[1, 2].map(i => (
                <div key={i} style={{
                  flex: 1, aspectRatio: "4/3", borderRadius: 10,
                  background: "var(--bg-tinted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid var(--border)", position: "relative"
                }}>
                  <Icon name="camera" size={28} color="var(--text-faint)"/>
                  <span className="mono" style={{ position: "absolute", bottom: 6, right: 8, fontSize: 10, color: "var(--text-faint)" }}>IMG_{i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, fontWeight: 600 }}>Dettagli</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Detail icon="user" label="Segnalato da" value={item.who}/>
              <Detail icon="mapPin" label="Sede" value={item.site}/>
              <Detail icon="calendar" label="Data" value={fmtDate(item.when)}/>
              <Detail icon="clock" label="Ora" value="14:32"/>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>Stato di gestione</div>
            <div className="row" style={{ gap: 8 }}>
              {statuses.map(s => (
                <button key={s.id} onClick={() => setStatus(s.id)} className="row" style={{
                  padding: "10px 14px", gap: 8, flex: 1,
                  background: status === s.id ? `var(--${s.color}-soft)` : "var(--bg-elev)",
                  border: `1px solid ${status === s.id ? `var(--${s.color})` : "var(--border)"}`,
                  borderRadius: 8, cursor: "pointer",
                  color: status === s.id ? `var(--${s.color})` : "var(--text-soft)",
                  fontWeight: status === s.id ? 600 : 500, fontSize: 12.5
                }}>
                  <Icon name={s.icon} size={13}/>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, fontWeight: 600 }}>Commenti interni</div>
            <textarea className="input" style={{ height: 70, padding: 10 }} placeholder="Aggiungi una nota per il team…"/>
          </div>
        </div>

        <div className="row" style={{ gap: 8, padding: 16, borderTop: "1px solid var(--border)", background: "var(--bg-sunk)" }}>
          <button onClick={(e) => ui.showMenu(e.currentTarget, window.SafeHubData.EMPLOYEES.slice(0, 6).map(emp => ({
            label: emp.name, icon: "user",
            onClick: () => ui.toast(`Segnalazione assegnata a ${emp.name}`, { kind: "ok" }),
          })))} className="btn"><Icon name="user" size={13}/><span>Assegna…</span></button>
          <button onClick={() => ui.confirm({
            title: "Promuovere a incidente?",
            body: "L'evento verrà registrato come infortunio nel registro INAIL e dovrà essere notificato entro 48 ore.",
            confirmLabel: "Promuovi a incidente", danger: true,
            action: () => ui.toast("Promosso a incidente — apri il registro infortuni", { kind: "danger" }),
          })} className="btn"><Icon name="alertTriangle" size={13}/><span>Promuovi a incidente</span></button>
          <div style={{ flex: 1 }}/>
          <button onClick={() => { ui.toast("Segnalazione segnata come risolta", { kind: "ok" }); onClose(); }} className="btn btn-primary">
            <Icon name="check" size={13}/><span>Risolvi</span>
          </button>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   Audit detail drawer
   ============================================================ */
const AuditDetailDrawer = ({ item, onClose, ui }) => {
  const { fmtDate } = window.SafeHubData;
  const sections = [
    { name: "Segnaletica e accessi",      score: 100, items: 4, issues: 0 },
    { name: "DPI e protezioni collettive", score: 75,  items: 4, issues: 1 },
    { name: "Impianti e macchinari",      score: 100, items: 4, issues: 0 },
    { name: "Sostanze pericolose",        score: 67,  items: 3, issues: 1 },
  ];
  const findings = [
    { id: 1, section: "DPI", title: "Parapetto lato sud livello 3 mancante", severity: "alta", assignee: "Marco Bianchi", deadline: "30 mag", status: "in lavorazione" },
    { id: 2, section: "Sostanze", title: "Scheda dati sicurezza non aggiornata per solvente X", severity: "media", assignee: "Anna Ferri", deadline: "5 giu", status: "aperto" },
  ];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}/>
      <div className="drawer" style={{ width: 640 }}>
        <div className="row between" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div className="row" style={{ gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--primary-soft)", color: "var(--primary-strong)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="clipboardCheck" size={20}/>
            </div>
            <div>
              <div className="row" style={{ gap: 6 }}>
                {item.status === "completato"
                  ? <span className="chip chip-ok"><Icon name="check" size={10}/>Completato</span>
                  : <span className="chip chip-warn"><Icon name="clock" size={10}/>In corso</span>}
                {item.score !== null && (
                  <span className="chip" style={{ background: item.score >= 90 ? "var(--ok-soft)" : item.score >= 75 ? "var(--warn-soft)" : "var(--danger-soft)", color: item.score >= 90 ? "var(--ok)" : item.score >= 75 ? "var(--warn)" : "var(--danger)" }}>
                    Score {item.score}/100
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: 17, marginTop: 4 }}>{item.template}</h2>
              <div className="faint" style={{ fontSize: 12, marginTop: 2 }}>{item.site} · {fmtDate(item.date)} · {item.by}</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: 24 }}>
          {item.score !== null && (
            <>
              <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontWeight: 600 }}>Score per sezione</div>
              <div className="card" style={{ marginBottom: 18 }}>
                {sections.map((s, i) => (
                  <div key={i} style={{ paddingBottom: i < sections.length - 1 ? 12 : 0, marginBottom: i < sections.length - 1 ? 12 : 0, borderBottom: i < sections.length - 1 ? "1px dashed var(--border)" : "none" }}>
                    <div className="row between" style={{ marginBottom: 4 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                        <span className="faint" style={{ fontSize: 11.5 }}>{s.items} controlli</span>
                      </div>
                      <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: s.score >= 90 ? "var(--ok)" : s.score >= 75 ? "var(--warn)" : "var(--danger)" }}>{s.score}%</span>
                    </div>
                    <div className="progress"><span style={{ width: `${s.score}%`, background: s.score >= 90 ? "var(--ok)" : s.score >= 75 ? "var(--warn)" : "var(--danger)" }}/></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {item.findings > 0 && (
            <>
              <div className="row between" style={{ marginBottom: 10 }}>
                <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Findings · {item.findings} totali</div>
                <button className="btn btn-sm btn-ghost" onClick={() => ui.toast("CSV findings in download", { kind: "ok" })}>Esporta CSV</button>
              </div>
              <div className="col" style={{ gap: 8, marginBottom: 18 }}>
                {findings.slice(0, item.findings).map(f => (
                  <div key={f.id} className="card" style={{ padding: 14 }}>
                    <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: f.severity === "alta" ? "var(--danger-soft)" : "var(--warn-soft)", color: f.severity === "alta" ? "var(--danger)" : "var(--warn)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name="alertTriangle" size={14}/>
                      </div>
                      <div className="grow">
                        <div className="row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                          <span className="chip">{f.section}</span>
                          <span className={`chip chip-${f.severity === "alta" ? "danger" : "warn"}`}>gravità {f.severity}</span>
                          <span className={`chip ${f.status === "in lavorazione" ? "chip-info" : "chip-warn"}`}>{f.status}</span>
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>{f.title}</div>
                        <div className="faint" style={{ fontSize: 12 }}>Assegnato a {f.assignee} · scade il {f.deadline}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontWeight: 600 }}>Firma e tracciabilità</div>
          <div className="card">
            <div className="row" style={{ gap: 14 }}>
              <div className="avatar avatar-lg">{item.by.split(" ").map(s => s[0]).join("")}</div>
              <div className="grow">
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.by}</div>
                <div className="faint" style={{ fontSize: 12 }}>Eseguito e firmato digitalmente</div>
                <div className="faint mono" style={{ fontSize: 11, marginTop: 4 }}>SHA-256 · 8f3a…b29c · {fmtDate(item.date)} 17:42</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: 8, padding: 16, borderTop: "1px solid var(--border)", background: "var(--bg-sunk)" }}>
          <button className="btn" onClick={() => ui.toast("PDF dell'audit in download…", { kind: "ok" })}>
            <Icon name="download" size={13}/><span>Scarica PDF</span>
          </button>
          <button className="btn" onClick={() => ui.showForm({
            title: "Condividi audit",
            intro: "Invia il PDF di questo audit per email. Il destinatario non deve avere accesso a SafeHub.",
            fields: [
              { label: "Email destinatario", type: "email", placeholder: "nome@cliente.it" },
              { label: "Messaggio (opzionale)", type: "textarea", placeholder: "In allegato il verbale di audit del…" },
            ],
            submitLabel: "Invia",
            onSubmit: () => ui.toast("Audit inviato via email", { kind: "ok" }),
          })}><Icon name="mail" size={13}/><span>Condividi</span></button>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-primary" onClick={() => { onClose(); ui.goto("audit"); }}>
            Apri nell'editor
          </button>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   Course drawer
   ============================================================ */
const CourseDrawer = ({ course, onClose, ui }) => {
  const { EMPLOYEES, fmtDate, daysUntil } = window.SafeHubData;
  const sample = EMPLOYEES.slice(0, course.participants);
  const pct = course.participants ? course.completed / course.participants : 0;
  const days = daysUntil(course.deadline);
  return (
    <>
      <div className="drawer-overlay" onClick={onClose}/>
      <div className="drawer" style={{ width: 600 }}>
        <div className="row between" style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div className="row" style={{ gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--primary-soft)", color: "var(--primary-strong)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="graduation" size={20}/>
            </div>
            <div>
              <span className="chip">{course.modality}</span>
              <h2 style={{ fontSize: 17, marginTop: 4 }}>{course.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: 24 }}>
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="row" style={{ gap: 18 }}>
              <div>
                <div className="faint" style={{ fontSize: 11 }}>Avanzamento</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600 }}>{Math.round(pct * 100)}%</div>
              </div>
              <div className="vdivider"/>
              <div>
                <div className="faint" style={{ fontSize: 11 }}>Partecipanti</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{course.completed}/{course.participants}</div>
              </div>
              <div className="vdivider"/>
              <div>
                <div className="faint" style={{ fontSize: 11 }}>Scadenza</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: days < 0 ? "var(--danger)" : days < 14 ? "var(--warn)" : "var(--text)" }}>
                  {days < 0 ? `scaduto ${-days}g fa` : `fra ${days}g · ${fmtDate(course.deadline)}`}
                </div>
              </div>
              <div className="grow"/>
              <button className="btn" onClick={() => ui.toast("Promemoria pianificato (24h prima della scadenza)", { kind: "ok" })}><Icon name="bellRing" size={13}/><span>Promemoria</span></button>
            </div>
            <div className="progress" style={{ marginTop: 14 }}><span style={{ width: `${pct * 100}%` }}/></div>
          </div>

          <div className="faint" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontWeight: 600 }}>Iscritti</div>
          <div className="card card-flush">
            {sample.map((e, i) => {
              const state = i < course.completed ? "completato" : i < course.completed + course.in_progress ? "in corso" : "non iniziato";
              return (
                <div key={e.id} className="row" style={{ padding: "12px 16px", gap: 12, borderBottom: i < sample.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div className="avatar">{e.name.split(" ").map(s => s[0]).slice(0, 2).join("")}</div>
                  <div className="grow">
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{e.name}</div>
                    <div className="faint" style={{ fontSize: 12 }}>{e.role}</div>
                  </div>
                  {state === "completato" && <span className="chip chip-ok"><Icon name="check" size={10}/>Completato</span>}
                  {state === "in corso" && <span className="chip chip-info"><Icon name="clock" size={10}/>In corso</span>}
                  {state === "non iniziato" && <span className="chip chip-warn">Non iniziato</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="row" style={{ gap: 8, padding: 16, borderTop: "1px solid var(--border)", background: "var(--bg-sunk)" }}>
          <button className="btn" onClick={() => ui.toast(`Promemoria inviato a ${course.participants} iscritti`, { kind: "ok" })}><Icon name="mail" size={13}/><span>Invia promemoria a tutti</span></button>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-primary" onClick={() => { onClose(); ui.goto("formazione"); }}>
            Vedi corso completo
          </button>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   Document preview modal
   ============================================================ */
const DocumentPreviewModal = ({ doc, onClose, ui }) => {
  const { fmtDate } = window.SafeHubData;
  const extColors = {
    pdf:  ["var(--danger-soft)", "var(--danger)"],
    xlsx: ["var(--ok-soft)", "var(--ok)"],
    zip:  ["var(--warn-soft)", "var(--warn)"],
    docx: ["var(--info-soft)", "var(--info)"],
  };
  const [bg, fg] = extColors[doc.ext] || ["var(--bg-tinted)", "var(--text-soft)"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 760, maxHeight: "92vh" }}>
        <div className="modal-header">
          <div className="row" style={{ gap: 12, minWidth: 0 }}>
            <div className="file-icon" style={{ background: bg, color: fg }}>{doc.ext.toUpperCase()}</div>
            <div className="col" style={{ gap: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</h3>
              <div className="faint" style={{ fontSize: 11.5 }}>{doc.folder} · {doc.size} · caricato il {fmtDate(doc.uploaded)} da {doc.uploader}</div>
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-sm" onClick={() => ui.toast("Download avviato", { kind: "ok" })}><Icon name="download" size={12}/><span>Scarica</span></button>
            <button className="btn btn-sm" onClick={() => ui.toast("Apertura condivisione…")}><Icon name="mail" size={12}/><span>Condividi</span></button>
            <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
          </div>
        </div>
        <div style={{ background: "var(--bg-sunk)", padding: 24, overflowY: "auto", flex: 1 }}>
          {/* Fake document preview */}
          <div style={{
            background: "white", color: "#222",
            margin: "0 auto", maxWidth: 600, aspectRatio: "1/1.41",
            boxShadow: "var(--shadow-lg)", borderRadius: 4,
            padding: "60px 64px",
            fontFamily: "Georgia, serif", fontSize: 11.5, lineHeight: 1.6,
          }}>
            <div style={{ borderBottom: "2px solid #b85a2c", paddingBottom: 18, marginBottom: 24 }}>
              <div style={{ fontSize: 9, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{doc.folder}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#222", fontFamily: "Georgia, serif" }}>{doc.name.replace(/\.[a-z]+$/, "").replace(/_/g, " ")}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 8 }}>Tre Torri Costruzioni S.r.l. · Documento riservato</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#444" }}>1. Premessa</div>
            <p style={{ margin: "0 0 12px" }}>Il presente documento è redatto ai sensi del D.Lgs. 9 aprile 2008, n. 81 e successive modifiche e integrazioni, con particolare riferimento agli articoli 17, 28 e 29.</p>
            <p style={{ margin: "0 0 12px" }}>L'attività di valutazione dei rischi è stata svolta in collaborazione con il Responsabile del Servizio di Prevenzione e Protezione, il medico competente e i Rappresentanti dei Lavoratori per la Sicurezza, conformemente a quanto previsto dalla normativa vigente.</p>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, marginTop: 18, color: "#444" }}>2. Descrizione dei luoghi</div>
            <p style={{ margin: "0 0 12px" }}>La sede operativa si compone di tre macro-aree: zona uffici (piano terra e primo piano), area di lavorazione esterna, magazzino logistico. L'organico complessivo conta 47 lavoratori, di cui 31 operativi sui cantieri attivi.</p>
            <p style={{ margin: "0 0 12px", color: "#aaa" }}>[ Il documento prosegue per altre 23 pagine. Anteprima fedele non disponibile in questa demo. ]</p>
          </div>
        </div>
        <div className="row between" style={{ padding: "12px 18px", borderTop: "1px solid var(--border)", background: "var(--bg-elev)" }}>
          <div className="row" style={{ gap: 8 }}>
            {doc.tags && doc.tags.map(t => <span key={t} className="chip">{t}</span>)}
          </div>
          <div className="row" style={{ gap: 10, fontSize: 12, color: "var(--text-soft)" }}>
            <span className="row" style={{ gap: 4 }}><Icon name="eye" size={12}/><span>14 visualizzazioni</span></span>
            <span className="row" style={{ gap: 4 }}><Icon name="download" size={12}/><span>3 download</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   Generic confirm modal
   ============================================================ */
const ConfirmModal = ({ cfg, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 440 }}>
      <div className="modal-header">
        <h3>{cfg.title}</h3>
        <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
      </div>
      <div className="modal-body">
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-soft)", lineHeight: 1.55 }}>{cfg.body}</p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="btn">Annulla</button>
        <button onClick={() => { cfg.action && cfg.action(); onClose(); }} className={`btn ${cfg.danger ? "btn-primary" : "btn-primary"}`} style={cfg.danger ? { background: "var(--danger)", borderColor: "var(--danger)" } : {}}>
          {cfg.confirmLabel || "Conferma"}
        </button>
      </div>
    </div>
  </div>
);

/* ============================================================
   Generic form modal
   ============================================================ */
const FormModal = ({ cfg, onClose }) => {
  const submit = (e) => { e.preventDefault(); cfg.onSubmit && cfg.onSubmit(); onClose(); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form onSubmit={submit} className="modal" onClick={e => e.stopPropagation()} style={{ width: cfg.width || 540 }}>
        <div className="modal-header">
          <h3>{cfg.title}</h3>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-body">
          {cfg.intro && <p className="muted" style={{ marginTop: 0, fontSize: 13.5, lineHeight: 1.5 }}>{cfg.intro}</p>}
          {(cfg.fields || []).map((f, i) => (
            <div key={i} className="field">
              <label>{f.label}</label>
              {f.type === "textarea"
                ? <textarea className="input" style={{ height: 80, padding: 10 }} defaultValue={f.default} placeholder={f.placeholder}/>
                : f.type === "select"
                  ? <select className="select" defaultValue={f.default}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
                  : <input className="input" type={f.type || "text"} defaultValue={f.default} placeholder={f.placeholder}/>}
              {f.hint && <span className="faint" style={{ fontSize: 11.5 }}>{f.hint}</span>}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn">Annulla</button>
          <button type="submit" className="btn btn-primary">{cfg.submitLabel || "Conferma"}</button>
        </div>
      </form>
    </div>
  );
};

/* ============================================================
   Helper: Detail row
   ============================================================ */
const Detail = ({ icon, label, value }) => (
  <div className="col" style={{ gap: 4 }}>
    <div className="faint" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
    <div className="row" style={{ gap: 8 }}>
      <Icon name={icon} size={13} color="var(--text-soft)"/>
      <span style={{ fontSize: 13 }}>{value}</span>
    </div>
  </div>
);

Object.assign(window, { UIProvider, useUI });
