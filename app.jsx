/* ============================================================
   SafeHub — Main app: routing, state, tweaks
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#d68f4a", "#fbf7f2", "#2a221b"],
  "theme": "light",
  "density": "default",
  "role": "rspp",
  "loggedIn": true
}/*EDITMODE-END*/;

const PALETTE_NAME = (p) => {
  const k = JSON.stringify(p).toLowerCase();
  if (k.includes("d68f4a")) return "warm";
  if (k.includes("3f6fcf")) return "navy";
  if (k.includes("3d8c5f")) return "forest";
  if (k.includes("c25a3d")) return "terracotta";
  return "warm";
};

const App = () => {
  const [tw, setTw] = useTweaks(TWEAK_DEFAULTS);

  // Apply palette / theme / density to root
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.palette = PALETTE_NAME(tw.palette);
    root.dataset.theme = tw.theme;
    root.dataset.density = tw.density;
  }, [tw.palette, tw.theme, tw.density]);

  const [loggedIn, setLoggedIn] = React.useState(tw.loggedIn);
  React.useEffect(() => setLoggedIn(tw.loggedIn), [tw.loggedIn]);

  const [page, setPage] = React.useState("dashboard");
  const [openEmp, setOpenEmp] = React.useState(null);
  const [openExp, setOpenExp] = React.useState(null);

  const { EXPIRING, daysUntil } = window.SafeHubData;
  const expiringCount =
    EXPIRING.filter(e => daysUntil(e.expires) >= 0 && daysUntil(e.expires) <= 30).length
    + EXPIRING.filter(e => daysUntil(e.expires) < 0).length;

  if (!loggedIn) {
    return (
      <UIProvider goto={setPage}>
        <Login onLogin={() => { setLoggedIn(true); setTw("loggedIn", true); }}/>
        <TwkPanel tw={tw} setTw={setTw}/>
      </UIProvider>
    );
  }

  const titles = {
    dashboard:  "Panoramica",
    scadenze:   "Scadenze",
    dipendenti: "Dipendenti",
    documenti:  "Documenti",
    formazione: "Formazione",
    audit:      "Audit & checklist",
    report:     "Report",
    alert:      "Alert e notifiche",
    azienda:    "Azienda",
  };

  return (
    <UIProvider goto={setPage}>
      <div className="app-shell">
        <Sidebar page={page} setPage={setPage} expiringCount={expiringCount} onLogout={() => { setLoggedIn(false); setTw("loggedIn", false); }}/>
        <main className="main">
          <Topbar breadcrumb={["SafeHub", "Tre Torri Costruzioni", titles[page]]}/>
          <div className="page" key={page}>
            {page === "dashboard"  && <Dashboard goto={setPage} openExpiring={setOpenExp} openEmployee={setOpenEmp}/>}
            {page === "scadenze"   && <Scadenze openExpiring={setOpenExp}/>}
            {page === "dipendenti" && <Employees openEmployee={setOpenEmp}/>}
            {page === "documenti"  && <Documents/>}
            {page === "formazione" && <Training/>}
            {page === "audit"      && <Audit/>}
            {page === "report"     && <Reports/>}
            {page === "alert"      && <Alerts/>}
            {page === "azienda"    && <Azienda/>}
          </div>
        </main>
      </div>

      {openEmp && <EmployeeDrawer employee={openEmp} onClose={() => setOpenEmp(null)}/>}
      {openExp && <ExpiringDrawer item={openExp} onClose={() => setOpenExp(null)}/>}

      <TwkPanel tw={tw} setTw={setTw} onLogout={() => { setLoggedIn(false); setTw("loggedIn", false); }}/>
    </UIProvider>
  );
};

const TwkPanel = ({ tw, setTw, onLogout }) => (
  <TweaksPanel title="Tweaks · SafeHub">
    <TweakSection label="Aspetto">
      <TweakColor
        label="Palette"
        value={tw.palette}
        onChange={(v) => setTw("palette", v)}
        options={[
          ["#d68f4a", "#fbf7f2", "#2a221b"],
          ["#3f6fcf", "#f5f7fb", "#1a2236"],
          ["#3d8c5f", "#f4f8f5", "#1a2a20"],
          ["#c25a3d", "#fbf3ee", "#2a1f1a"],
        ]}
      />
      <TweakRadio
        label="Tema"
        value={tw.theme}
        options={[{ value: "light", label: "Chiaro" }, { value: "dark", label: "Scuro" }]}
        onChange={(v) => setTw("theme", v)}
      />
      <TweakSelect
        label="Densità"
        value={tw.density}
        options={[
          { value: "compact", label: "Compatta" },
          { value: "default", label: "Standard" },
          { value: "comfy",   label: "Comoda" },
        ]}
        onChange={(v) => setTw("density", v)}
      />
    </TweakSection>

    <TweakSection label="Sessione">
      <TweakSelect
        label="Ruolo attivo"
        value={tw.role}
        options={[
          { value: "rspp",   label: "RSPP — Anna Ferri" },
          { value: "admin",  label: "Admin — Chiara Lombardi" },
          { value: "hr",     label: "HR — Marco Bianchi" },
          { value: "worker", label: "Lavoratore (mobile)" },
        ]}
        onChange={(v) => setTw("role", v)}
      />
      {onLogout && (
        <TweakButton label="Mostra schermata di login" onClick={onLogout} secondary/>
      )}
    </TweakSection>
  </TweaksPanel>
);

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
