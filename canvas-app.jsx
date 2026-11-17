/* ============================================================
   SafeHub — Mount design canvas with dashboard variants
   ============================================================ */

const CanvasApp = () => {
  // Apply default palette/theme to document root
  React.useEffect(() => {
    document.documentElement.dataset.palette = "warm";
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.density = "default";
  }, []);

  return (
    <DesignCanvas>
      <DCSection
        id="overview-options"
        title="Panoramica — esplorazione direzioni"
        subtitle="4 modi diversi di concepire la home dell'RSPP. Apri ognuno in fullscreen per valutarlo davvero."
      >
        <DCArtboard id="cockpit"  label="A · Cockpit  (attuale)"   width={1440} height={1280}>
          <MiniShell label="A · Cockpit"><CockpitDashboard/></MiniShell>
        </DCArtboard>

        <DCArtboard id="triage"   label="B · Triage Inbox"          width={1440} height={1180}>
          <MiniShell label="B · Triage"><TriageDashboard/></MiniShell>
        </DCArtboard>

        <DCArtboard id="calendar" label="C · Calendar-first"        width={1440} height={1180}>
          <MiniShell label="C · Calendar"><CalendarDashboard/></MiniShell>
        </DCArtboard>

        <DCArtboard id="sites"    label="D · Cantieri-first"        width={1440} height={1180}>
          <MiniShell label="D · Cantieri"><SitesDashboard/></MiniShell>
        </DCArtboard>
      </DCSection>

      <DCSection
        id="notes"
        title="Note di lettura"
        subtitle="Per chi è ciascuna direzione, e cosa sacrifica."
      >
        <DCArtboard id="readme" label="Readme" width={1440} height={500}>
          <div style={{
            padding: 36,
            background: "var(--bg-elev)",
            fontFamily: "var(--font-body)",
            color: "var(--text)",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}>
            <ReadmeCard
              letter="A"
              name="Cockpit"
              tag="già nel prototipo"
              forWhom="RSPP esperto che vuole vedere tutto in una schermata."
              wins="Massima densità informativa, KPI in evidenza, niente clic per capire lo stato."
              loses="Cognitivamente impegnativo, niente prioritizzazione esplicita: tutto sembra ugualmente urgente."
            />
            <ReadmeCard
              letter="B"
              name="Triage Inbox"
              tag="action-first"
              forWhom="RSPP che apre la dashboard una volta al giorno e vuole sapere 'cosa devo fare ora'."
              wins="Copy verbale ('Rinnova', 'Programma'), zero ambiguità sulla prossima azione, anello compliance come unico KPI emotivo."
              loses="Vista meno panoramica: per il quadro d'insieme servono i drill-down."
            />
            <ReadmeCard
              letter="C"
              name="Calendar-first"
              tag="time-based"
              forWhom="Aziende molto stagionali (cantieri estivi, audit programmati) o team che ragionano per agenda."
              wins="Distribuzione delle scadenze nel tempo immediata, ottimo per pianificare e bilanciare carico."
              loses="Servono più clic per vedere i dettagli; meno utile a chi gestisce singoli dipendenti."
            />
            <ReadmeCard
              letter="D"
              name="Cantieri-first"
              tag="multi-site"
              forWhom="PMI con 3+ sedi/cantieri attivi contemporaneamente (edilizia, logistica, manifattura multi-stabilimento)."
              wins="Vista per location, compliance e turni in tempo reale, ottimo per gestire dispersione geografica."
              loses="Penalizza chi ha una sola sede; richiede dati aggiornati sulla presenza."
            />
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
};

const ReadmeCard = ({ letter, name, tag, forWhom, wins, loses }) => (
  <div style={{
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: 18,
    background: "var(--bg-sunk)",
    display: "flex", flexDirection: "column", gap: 10
  }}>
    <div className="row" style={{ gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: "var(--primary)", color: "var(--primary-on)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
      }}>{letter}</div>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600 }}>{name}</div>
        <div className="faint" style={{ fontSize: 11.5 }}>{tag}</div>
      </div>
    </div>
    <div>
      <div className="faint" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 2 }}>Per chi</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{forWhom}</div>
    </div>
    <div>
      <div className="faint" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 2, color: "var(--ok)" }}>Vince</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{wins}</div>
    </div>
    <div>
      <div className="faint" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 2, color: "var(--warn)" }}>Compromessi</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{loses}</div>
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CanvasApp/>);
