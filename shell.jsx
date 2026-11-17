/* ============================================================
   SafeHub — App shell (sidebar + topbar + role/company switcher)
   ============================================================ */

const NAV = [
  { section: "Operativo", items: [
    { id: "dashboard",  label: "Panoramica",   icon: "home" },
    { id: "scadenze",   label: "Scadenze",     icon: "calendar", badgeKey: "expiringCount" },
    { id: "dipendenti", label: "Dipendenti",   icon: "users" },
    { id: "documenti",  label: "Documenti",    icon: "folder" },
    { id: "formazione", label: "Formazione",   icon: "graduation" },
    { id: "audit",      label: "Audit & checklist", icon: "clipboardCheck" },
  ]},
  { section: "Insights", items: [
    { id: "report",     label: "Report",       icon: "barChart" },
  ]},
  { section: "Impostazioni", items: [
    { id: "alert",      label: "Alert e notifiche", icon: "bell" },
    { id: "azienda",    label: "Azienda",      icon: "building" },
  ]},
];

const Sidebar = ({ page, setPage, expiringCount, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="mark">S</div>
        <span>SafeHub</span>
      </div>

      <CompanySwitcher />

      {NAV.map(group => (
        <React.Fragment key={group.section}>
          <div className="sidebar-section">{group.section}</div>
          {group.items.map(item => (
            <div
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
              {item.badgeKey === "expiringCount" && expiringCount > 0 && (
                <span className="badge">{expiringCount}</span>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}

      <UserCard onLogout={onLogout}/>
    </aside>
  );
};

const CompanySwitcher = () => {
  const { COMPANIES } = window.SafeHubData;
  const ui = useUI();
  const [open, setOpen] = React.useState(false);
  const [companyId, setCompanyId] = React.useState(COMPANIES[0].id);
  const company = COMPANIES.find(c => c.id === companyId);

  return (
    <div style={{ position: "relative", marginBottom: 6 }}>
      <button
        onClick={() => setOpen(!open)}
        className="row"
        style={{
          width: "100%", padding: "10px 10px", gap: 10,
          background: "var(--bg-elev)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          textAlign: "left"
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: "var(--bg-tinted)", color: "var(--text)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="building" size={14}/>
        </div>
        <div className="grow col" style={{ gap: 0, overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {company.name.replace(/ S\.r\.l\.| S\.p\.A\.| S\.r\.l\./g, "")}
          </div>
          <div className="faint" style={{ fontSize: 11 }}>{company.sector} · {company.employees} dip.</div>
        </div>
        <Icon name="chevronDown" size={14} color="var(--text-faint)" />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
          <div className="card card-tight slide-up" style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 11,
            boxShadow: "var(--shadow-md)", padding: 6
          }}>
            {COMPANIES.map(c => (
              <button key={c.id} onClick={() => { setCompanyId(c.id); setOpen(false); }} className="row" style={{
                width: "100%", padding: "8px 8px", gap: 10, borderRadius: 6,
                background: c.id === companyId ? "var(--bg-sunk)" : "transparent",
                textAlign: "left"
              }}>
                <Icon name="building" size={14} color="var(--text-soft)"/>
                <div className="grow col" style={{ gap: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div className="faint" style={{ fontSize: 11 }}>{c.sector}</div>
                </div>
                {c.id === companyId && <Icon name="check" size={13} color="var(--primary)"/>}
              </button>
            ))}
            <hr className="divider" style={{ margin: "4px 0" }}/>
            <button className="row" onClick={() => { setOpen(false); ui.showForm({
              title: "Aggiungi un'azienda",
              intro: "Collega un'altra organizzazione al tuo account. Potrai passare dall'una all'altra dal menu in alto.",
              fields: [
                { label: "Ragione sociale", placeholder: "es. Acme S.r.l." },
                { label: "P.IVA", placeholder: "IT..." },
                { label: "Settore",     type: "select", options: ["Edilizia", "Manifattura", "Logistica", "Servizi", "Altro"] },
                { label: "Ruolo che ricoprirai", type: "select", options: ["Admin", "RSPP", "HR", "Direzione"] },
              ],
              submitLabel: "Aggiungi azienda",
              onSubmit: () => ui.toast("Azienda creata. Puoi accedervi dal selettore.", { kind: "ok" }),
            }); }} style={{ width: "100%", padding: "8px 8px", gap: 10, borderRadius: 6, color: "var(--text-soft)", fontSize: 13 }}>
              <Icon name="plus" size={14}/>
              <span>Aggiungi azienda</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const UserCard = ({ onLogout }) => {
  const { ROLES } = window.SafeHubData;
  const ui = useUI();
  const [role, setRole] = React.useState("rspp");
  const openMenu = (e) => ui.showMenu(e.currentTarget, [
    { header: "Anna Ferri · RSPP" },
    { label: "Apri il mio profilo",  icon: "user",     onClick: () => ui.toast("Apertura profilo…") },
    { label: "Impostazioni account",  icon: "settings", onClick: () => ui.toast("Apertura impostazioni…") },
    { label: "Cambia password",       icon: "shield",   onClick: () => ui.toast("Apertura cambio password…") },
    { divider: true },
    { label: "Esci da SafeHub",       icon: "logout",   danger: true, onClick: () => onLogout && onLogout() },
  ]);
  return (
    <button onClick={openMenu} className="sidebar-footer" style={{ width: "100%", background: "transparent", textAlign: "left" }}>
      <div className="avatar">AF</div>
      <div className="grow col" style={{ gap: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Anna Ferri</div>
        <div className="faint" style={{ fontSize: 11 }}>{ROLES[role].label}</div>
      </div>
      <Icon name="chevronUp" size={14} color="var(--text-soft)" />
    </button>
  );
};

const Topbar = ({ title, breadcrumb, actions }) => {
  const ui = useUI();
  return (
    <header className="topbar">
      {breadcrumb && (
        <div className="row" style={{ gap: 6 }}>
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chevronRight" size={13} color="var(--text-faint)" />}
              <span className={i === breadcrumb.length - 1 ? "" : "breadcrumb"}
                    style={{ fontSize: 14, fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>
                {b}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      {!breadcrumb && <h1>{title}</h1>}
      <div className="grow" />
      <button onClick={() => ui.openCommandPalette()} className="search" style={{ cursor: "pointer" }}>
        <Icon name="search" size={14} color="var(--text-faint)" />
        <span style={{ flex: 1, textAlign: "left", color: "var(--text-faint)" }}>Cerca dipendenti, documenti, corsi…</span>
        <span className="kbd">⌘K</span>
      </button>
      <button
        onClick={(e) => ui.showNotifications(e.currentTarget)}
        className="btn btn-icon"
        title="Notifiche"
        style={{ position: "relative" }}
      >
        <Icon name="bellRing" size={16} />
        <span style={{
          position: "absolute", top: 6, right: 6,
          width: 8, height: 8, borderRadius: 999,
          background: "var(--danger)", border: "1.5px solid var(--bg-elev)"
        }}/>
      </button>
      {actions}
    </header>
  );
};

Object.assign(window, { Sidebar, Topbar });
