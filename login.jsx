/* ============================================================
   SafeHub — Login + Onboarding multi-azienda
   ============================================================ */

const Login = ({ onLogin }) => {
  const { COMPANIES, ROLES } = window.SafeHubData;
  const ui = useUI();
  const [step, setStep] = React.useState("login"); // login | choose-company
  const [email, setEmail] = React.useState("a.ferri@tretorri.it");
  const [password, setPassword] = React.useState("••••••••");
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [chosenCompany, setChosenCompany] = React.useState(COMPANIES[0].id);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("choose-company");
    }, 600);
  };

  const enter = () => {
    onLogin({ companyId: chosenCompany, role: "rspp" });
  };

  return (
    <div className="login-page fade-in">
      <div className="login-form-side">
        <div className="login-form-card">
          <div className="row" style={{ gap: 10, marginBottom: 32 }}>
            <div className="mark" style={{
              width: 36, height: 36, borderRadius: 9,
              background: "var(--primary)", color: "var(--primary-on)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16
            }}>S</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em" }}>SafeHub</div>
          </div>

          {step === "login" && (
            <form onSubmit={submit} className="slide-up">
              <h1 style={{ fontSize: 28, marginBottom: 6 }}>Bentornata in SafeHub</h1>
              <p className="muted" style={{ marginBottom: 28 }}>
                La piattaforma di compliance sicurezza per le PMI italiane.
              </p>

              <div className="field">
                <label>Email aziendale</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              </div>

              <div className="field">
                <label className="row between" style={{ width: "100%" }}>
                  <span>Password</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); ui.showForm({
                    title: "Reset password",
                    intro: "Inserisci la tua email aziendale: ti invieremo un link per impostare una nuova password.",
                    fields: [
                      { label: "Email aziendale", type: "email", default: email },
                    ],
                    submitLabel: "Invia link di reset",
                    onSubmit: () => ui.toast("Email inviata — controlla la posta", { kind: "ok" }),
                  }); }} style={{ fontSize: 12 }}>Password dimenticata?</a>
                </label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              <label className="row" style={{ gap: 8, marginBottom: 22, color: "var(--text-soft)", fontSize: 13 }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span>Resta connesso su questo dispositivo</span>
              </label>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", height: 42 }} disabled={loading}>
                {loading ? "Verifica in corso…" : "Accedi"}
                {!loading && <Icon name="arrowRight" size={15} />}
              </button>

              <div className="row" style={{ gap: 14, margin: "22px 0", color: "var(--text-faint)", fontSize: 12 }}>
                <div className="grow" style={{ height: 1, background: "var(--border)" }} />
                <span>oppure</span>
                <div className="grow" style={{ height: 1, background: "var(--border)" }} />
              </div>

              <div className="col" style={{ gap: 8 }}>
                <button type="button" onClick={() => ui.showForm({
                  title: "Accedi con SSO aziendale",
                  intro: "Inserisci il dominio della tua azienda. Ti reindirizzeremo al tuo Identity Provider.",
                  fields: [
                    { label: "Dominio aziendale", placeholder: "es. acme.it" },
                  ],
                  submitLabel: "Continua",
                  onSubmit: () => ui.toast("Reindirizzamento all'IdP…"),
                })} className="btn" style={{ width: "100%", height: 40, justifyContent: "center" }}>
                  <Icon name="building" size={15} />
                  <span>Single Sign-On aziendale (SAML)</span>
                </button>
                <button type="button" onClick={() => ui.toast("Reindirizzamento al servizio SPID…")} className="btn" style={{ width: "100%", height: 40, justifyContent: "center" }}>
                  <Icon name="shield" size={15} />
                  <span>SPID / CIE</span>
                </button>
              </div>

              <p className="faint" style={{ fontSize: 11.5, marginTop: 28, textAlign: "center", lineHeight: 1.6 }}>
                Continuando accetti i <a href="#" onClick={(e) => { e.preventDefault(); ui.toast("Termini aperti in nuova scheda"); }}>termini di servizio</a> e l'<a href="#" onClick={(e) => { e.preventDefault(); ui.toast("Privacy aperta in nuova scheda"); }}>informativa privacy</a>.<br/>
                Dati ospitati in UE — conformità GDPR.
              </p>
            </form>
          )}

          {step === "choose-company" && (
            <div className="slide-up">
              <h1 style={{ fontSize: 26, marginBottom: 6 }}>Scegli l'organizzazione</h1>
              <p className="muted" style={{ marginBottom: 24 }}>
                Il tuo account è collegato a {COMPANIES.length} aziende. Seleziona dove vuoi entrare.
              </p>

              <div className="col" style={{ gap: 8 }}>
                {COMPANIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChosenCompany(c.id)}
                    className="row"
                    style={{
                      padding: "14px 16px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${chosenCompany === c.id ? "var(--primary)" : "var(--border-strong)"}`,
                      background: chosenCompany === c.id ? "var(--primary-soft)" : "var(--bg-elev)",
                      gap: 12, textAlign: "left", width: "100%"
                    }}
                  >
                    <div className="avatar" style={{ borderRadius: 8, background: "var(--bg-tinted)", color: "var(--text)" }}>
                      <Icon name="building" size={16} />
                    </div>
                    <div className="grow col" style={{ gap: 2 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      <div className="faint" style={{ fontSize: 12 }}>
                        {c.sector} · {c.employees} dipendenti · {c.sites} {c.sites === 1 ? "sede" : "sedi"}
                      </div>
                    </div>
                    {chosenCompany === c.id && (
                      <div style={{
                        width: 22, height: 22, borderRadius: 999,
                        background: "var(--primary)", color: "var(--primary-on)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <Icon name="check" size={13} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button onClick={enter} className="btn btn-primary" style={{ width: "100%", height: 42, marginTop: 22 }}>
                Entra in SafeHub
                <Icon name="arrowRight" size={15} />
              </button>

              <button onClick={() => setStep("login")} className="btn btn-ghost" style={{ width: "100%", marginTop: 8, justifyContent: "center", color: "var(--text-soft)" }}>
                <Icon name="arrowLeft" size={14} />
                <span>Torna al login</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <LoginIllustration />
    </div>
  );
};

const LoginIllustration = () => {
  const { EXPIRING, fmtDateShort } = window.SafeHubData;
  const upcoming = EXPIRING.slice(0, 4);
  return (
    <div className="login-illust">
      <div style={{ position: "absolute", inset: 0, background: `
        radial-gradient(800px 400px at 20% 20%, var(--primary-soft), transparent),
        radial-gradient(700px 500px at 80% 80%, var(--bg-tinted), transparent)
      `}} />

      {/* Floating preview card */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>
        <div className="col" style={{ gap: 14, marginBottom: 32 }}>
          <div className="chip chip-primary" style={{ alignSelf: "flex-start" }}>
            <Icon name="shieldCheck" size={12} />
            <span>Conformità D.Lgs. 81/08</span>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Tieni in ordine<br/>la sicurezza della tua azienda.
          </h2>
          <p style={{ color: "var(--text-soft)", fontSize: 15, lineHeight: 1.55, maxWidth: 380 }}>
            Scadenze, formazione, documenti e audit in un'unica piattaforma.
            Senza fogli Excel persi, senza sorprese in ispezione.
          </p>
        </div>

        <div className="card" style={{ boxShadow: "var(--shadow-md)" }}>
          <div className="row between" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Scadenze in arrivo</div>
            <span className="chip chip-warn"><Icon name="clock" size={11}/> 11 attive</span>
          </div>
          <div className="col" style={{ gap: 10 }}>
            {upcoming.map((e, i) => (
              <div key={e.id} className="row" style={{ gap: 10 }}>
                <div style={{
                  width: 4, alignSelf: "stretch", borderRadius: 999,
                  background: i === 0 ? "var(--danger)" : i === 1 ? "var(--warn)" : "var(--info)"
                }}/>
                <div className="grow col" style={{ gap: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</div>
                  <div className="faint" style={{ fontSize: 11.5 }}>
                    {e.employee || "Documento aziendale"} · scade il {fmtDateShort(e.expires)}
                  </div>
                </div>
                <span className={`chip ${i === 0 ? "chip-danger" : i === 1 ? "chip-warn" : "chip-info"}`}>
                  fra {window.SafeHubData.daysUntil(e.expires)}g
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="row" style={{ gap: 14, marginTop: 20, color: "var(--text-soft)", fontSize: 12 }}>
          <div className="row" style={{ gap: 6 }}><Icon name="shield" size={13}/><span>ISO 27001</span></div>
          <div className="row" style={{ gap: 6 }}><Icon name="globe" size={13}/><span>Server in Italia</span></div>
          <div className="row" style={{ gap: 6 }}><Icon name="users" size={13}/><span>+1.200 PMI</span></div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Login });
