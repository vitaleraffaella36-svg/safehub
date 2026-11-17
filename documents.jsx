/* ============================================================
   SafeHub — Archivio documenti (DVR, DUVRI, certificati...)
   ============================================================ */

const Documents = () => {
  const { DOCUMENTS, FOLDERS, fmtDate, fmtDateShort, daysUntil } = window.SafeHubData;
  const ui = useUI();
  const [folder, setFolder] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [uploadOpen, setUploadOpen] = React.useState(false);

  const filtered = DOCUMENTS
    .filter(d => folder === "all" || d.folder === folder)
    .filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()));

  const totalSize = "37.4 MB";

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Documenti</h1>
          <p className="subtitle">Archivio digitale di DVR, DUVRI, POS, certificati e verbali — sempre pronto per un'ispezione.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => ui.showForm({
            title: "Nuova cartella",
            intro: "Le cartelle aiutano a organizzare i documenti per tipologia o cantiere.",
            fields: [
              { label: "Nome cartella", placeholder: "es. POS Cantiere Padova" },
              { label: "Descrizione (opzionale)", type: "textarea", placeholder: "Cosa contiene questa cartella?" },
            ],
            submitLabel: "Crea cartella",
            onSubmit: () => ui.toast("Cartella creata", { kind: "ok" }),
          })}><Icon name="folder" size={14}/><span>Nuova cartella</span></button>
          <button className="btn btn-primary" onClick={() => setUploadOpen(true)}><Icon name="upload" size={14}/><span>Carica documenti</span></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 18 }}>
        {/* Sidebar folders */}
        <aside className="card" style={{ padding: 8, alignSelf: "flex-start" }}>
          <button
            onClick={() => setFolder("all")}
            className="row"
            style={{
              width: "100%", padding: "9px 10px", gap: 10, borderRadius: 6,
              background: folder === "all" ? "var(--bg-sunk)" : "transparent",
              textAlign: "left", fontWeight: folder === "all" ? 600 : 500, fontSize: 13
            }}>
            <Icon name="archive" size={14} color="var(--text-soft)"/>
            <span>Tutti i documenti</span>
            <span className="faint mono" style={{ marginLeft: "auto", fontSize: 11.5 }}>{DOCUMENTS.length}</span>
          </button>
          <hr className="divider" style={{ margin: "6px 0" }}/>
          <div className="faint" style={{ padding: "8px 10px 4px", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Categorie</div>
          {FOLDERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFolder(f.id)}
              className="row"
              style={{
                width: "100%", padding: "8px 10px", gap: 10, borderRadius: 6,
                background: folder === f.id ? "var(--bg-sunk)" : "transparent",
                textAlign: "left", fontSize: 13, fontWeight: folder === f.id ? 600 : 400,
              }}>
              <Icon name="folder" size={14} color={folder === f.id ? "var(--primary)" : "var(--text-soft)"}/>
              <span>{f.name}</span>
              <span className="faint mono" style={{ marginLeft: "auto", fontSize: 11.5 }}>{f.count}</span>
            </button>
          ))}
          <hr className="divider" style={{ margin: "6px 0" }}/>
          <div style={{ padding: 10 }}>
            <div className="faint" style={{ fontSize: 11.5, marginBottom: 6 }}>Spazio utilizzato</div>
            <div className="progress" style={{ marginBottom: 4 }}>
              <span style={{ width: "12%" }}/>
            </div>
            <div className="row between">
              <span className="mono" style={{ fontSize: 11.5 }}>{totalSize}</span>
              <span className="faint" style={{ fontSize: 11.5 }}>di 5 GB</span>
            </div>
          </div>
        </aside>

        {/* Files area */}
        <div>
          <div className="row" style={{ gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <div className="search grow">
              <Icon name="search" size={14} color="var(--text-faint)"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome, tag, autore…"/>
            </div>
            <button className="btn" onClick={(e) => ui.showMenu(e.currentTarget, [
              { header: "Tipo file" },
              { label: "Tutti", icon: "check", onClick: () => {} },
              { label: "Solo PDF", icon: "fileText", onClick: () => ui.toast("Filtro: solo PDF") },
              { label: "Solo Excel", icon: "fileText", onClick: () => ui.toast("Filtro: solo Excel") },
              { divider: true },
              { header: "Stato" },
              { label: "Con scadenza ravvicinata", icon: "clock", onClick: () => ui.toast("Filtro applicato") },
              { label: "Senza scadenza",          icon: "shield", onClick: () => ui.toast("Filtro applicato") },
            ])}><Icon name="filter" size={14}/><span>Filtri</span></button>
            <button className="btn" onClick={() => ui.toast("Pacchetto ZIP in preparazione…", { kind: "ok" })}><Icon name="download" size={14}/><span>Esporta selez.</span></button>
          </div>

          {folder !== "all" && (
            <div className="row between" style={{ marginBottom: 14, padding: "10px 14px", background: "var(--primary-soft)", borderRadius: 8, border: "1px solid var(--primary-soft)" }}>
              <div className="row" style={{ gap: 10 }}>
                <Icon name="folder" size={16} color="var(--primary-strong)"/>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--primary-strong)" }}>{FOLDERS.find(f => f.id === folder)?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--primary-strong)", opacity: 0.8 }}>{FOLDERS.find(f => f.id === folder)?.desc}</div>
                </div>
              </div>
              <button className="btn btn-sm" onClick={() => setFolder("all")} style={{ background: "transparent", border: "none", color: "var(--primary-strong)" }}>
                <Icon name="x" size={12}/>
              </button>
            </div>
          )}

          <div className="card card-flush">
            <div className="row" style={{ padding: "10px 14px", gap: 14, background: "var(--bg-sunk)", borderBottom: "1px solid var(--border)", fontSize: 11.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
              <div style={{ width: 32 }}/>
              <div className="grow">Documento</div>
              <div style={{ width: 100 }}>Categoria</div>
              <div style={{ width: 110 }}>Caricato</div>
              <div style={{ width: 110 }}>Scadenza</div>
              <div style={{ width: 60 }}></div>
            </div>
            {filtered.map(d => {
              const days = d.expires ? daysUntil(d.expires) : null;
              const extColors = {
                pdf:  ["var(--danger-soft)", "var(--danger)"],
                xlsx: ["var(--ok-soft)", "var(--ok)"],
                zip:  ["var(--warn-soft)", "var(--warn)"],
                docx: ["var(--info-soft)", "var(--info)"],
              };
              const [bg, fg] = extColors[d.ext] || ["var(--bg-tinted)", "var(--text-soft)"];
              return (
                <div key={d.id} onClick={() => ui.openDocument(d)} className="file-row" style={{
                  display: "flex", gap: 14, padding: "12px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer"
                }}>
                  <div className="file-icon" style={{ background: bg, color: fg }}>{d.ext.toUpperCase()}</div>
                  <div className="grow col" style={{ gap: 2, minWidth: 0 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 13.5 }}>{d.name}</span>
                      {d.tags.map(t => <span key={t} className="chip" style={{ height: 18, fontSize: 10.5 }}>{t}</span>)}
                    </div>
                    <div className="faint mono" style={{ fontSize: 11.5 }}>{d.size} · {d.uploader}</div>
                  </div>
                  <div style={{ width: 100, fontSize: 12.5 }}>{d.folder}</div>
                  <div style={{ width: 110 }} className="mono faint">{fmtDateShort(d.uploaded)}</div>
                  <div style={{ width: 110 }}>
                    {d.expires ? (
                      <div className="col" style={{ gap: 2 }}>
                        <span className="mono" style={{ fontSize: 12 }}>{fmtDateShort(d.expires)}</span>
                        <span className={`chip ${days <= 30 ? "chip-warn" : ""}`} style={{ height: 17, fontSize: 10.5 }}>
                          {days < 0 ? `scad. ${-days}g fa` : `fra ${days}g`}
                        </span>
                      </div>
                    ) : <span className="faint">—</span>}
                  </div>
                  <div style={{ width: 60 }} className="row" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => ui.openDocument(d)} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }} title="Anteprima"><Icon name="eye" size={13} color="var(--text-soft)"/></button>
                    <button onClick={() => ui.toast(`Download di "${d.name}" avviato`, { kind: "ok" })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }} title="Scarica"><Icon name="download" size={13} color="var(--text-soft)"/></button>
                    <button onClick={(e) => ui.showMenu(e.currentTarget, [
                      { label: "Apri anteprima", icon: "eye",     onClick: () => ui.openDocument(d) },
                      { label: "Scarica",         icon: "download", onClick: () => ui.toast("Download avviato", { kind: "ok" }) },
                      { label: "Condividi",       icon: "mail",     onClick: () => ui.toast("Apertura condivisione…") },
                      { label: "Rinomina",        icon: "pencil",   onClick: () => ui.toast("Apri rinomina…") },
                      { label: "Sposta cartella", icon: "folder",   onClick: () => ui.toast("Apertura selezione cartella…") },
                      { divider: true },
                      { label: "Elimina", icon: "trash", danger: true, onClick: () => ui.confirm({
                          title: "Eliminare il documento?",
                          body: `"${d.name}" sarà spostato nel cestino. Puoi ripristinarlo entro 30 giorni.`,
                          confirmLabel: "Elimina", danger: true,
                          action: () => ui.toast("Documento eliminato")
                        }) },
                    ], { align: "right" })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}>
                      <Icon name="more" size={13} color="var(--text-soft)"/>
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="empty">
                <div className="icon-frame"><Icon name="folder" size={20}/></div>
                <div style={{ fontWeight: 500 }}>Nessun documento</div>
                <div style={{ fontSize: 13 }}>Prova a cambiare cartella o cerca con un altro termine.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)}/>}
    </div>
  );
};

const UploadModal = ({ onClose }) => {
  const ui = useUI();
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState([
    { name: "DVR_TreTorri_2026_v1.pdf", size: "5.2 MB", progress: 100 },
    { name: "POS_Cantiere_Padova.pdf", size: "2.8 MB", progress: 64 },
  ]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 600 }}>
        <div className="modal-header">
          <h3>Carica documenti</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-body">
          <div
            onClick={() => ui.toast("Apri esplora file per selezionare i documenti…")}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); ui.toast("File trascinati in caricamento", { kind: "ok" }); }}
            style={{
              border: `2px dashed ${dragging ? "var(--primary)" : "var(--border-strong)"}`,
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
              background: dragging ? "var(--primary-soft)" : "var(--bg-sunk)",
              transition: "all 0.15s",
              cursor: "pointer"
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg-elev)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <Icon name="upload" size={20} color="var(--primary)"/>
            </div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Trascina qui i file o clicca per scegliere</div>
            <div className="faint" style={{ fontSize: 12 }}>PDF, Word, Excel fino a 50 MB · max 20 file</div>
          </div>

          <div className="field" style={{ marginTop: 20 }}>
            <label>Cartella di destinazione</label>
            <select className="select"><option>DVR</option><option>DUVRI</option><option>POS</option><option>Formazione</option></select>
          </div>

          <div className="row" style={{ gap: 12 }}>
            <div className="field grow">
              <label>Data scadenza (opzionale)</label>
              <input className="input" type="date"/>
            </div>
            <div className="field grow">
              <label>Tag</label>
              <input className="input" placeholder="es. cantiere, 2026"/>
            </div>
          </div>

          <label className="row" style={{ gap: 8, color: "var(--text-soft)", fontSize: 13, marginTop: 4 }}>
            <input type="checkbox" defaultChecked/>
            <span>Invia notifica al RSPP al caricamento</span>
          </label>

          {files.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="faint" style={{ fontSize: 12, marginBottom: 8 }}>File in caricamento</div>
              {files.map((f, i) => (
                <div key={i} className="row" style={{ gap: 10, padding: "8px 12px", background: "var(--bg-sunk)", borderRadius: 7, marginBottom: 6 }}>
                  <div className="file-icon" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>PDF</div>
                  <div className="grow col" style={{ gap: 2 }}>
                    <div className="row between">
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{f.name}</span>
                      <span className="faint mono" style={{ fontSize: 11 }}>{f.size}</span>
                    </div>
                    <div className="progress" style={{ height: 4 }}><span style={{ width: `${f.progress}%` }}/></div>
                  </div>
                  {f.progress === 100 ? <Icon name="check" size={14} color="var(--ok)"/> : <span className="mono faint" style={{ fontSize: 11 }}>{f.progress}%</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn">Annulla</button>
          <button onClick={onClose} className="btn btn-primary">Conferma caricamento</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Documents });
