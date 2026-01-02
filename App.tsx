import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MousePosition, PatchNote, ChangeType, PatchChange } from './types';
import BackgroundWaves from './components/BackgroundWaves';
import ParallaxWrapper from './components/ParallaxWrapper';
import { PATCH_NOTES as INITIAL_NOTES } from './constants';

const TypeBadge: React.FC<{ type: ChangeType }> = ({ type }) => {
  const styles: Record<ChangeType, string> = {
    new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    fix: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    improved: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    system: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    announcement: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-sm border ${styles[type]}`}>
      {type}
    </span>
  );
};

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [showEditor, setShowEditor] = useState(false);
  const [notes, setNotes] = useState<PatchNote[]>([]);
  const [editingVersion, setEditingVersion] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Editor State
  const [formVersion, setFormVersion] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formChanges, setFormChanges] = useState<PatchChange[]>([{ type: 'new', text: '' }]);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const saved = localStorage.getItem('vdj_notes_v3');
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
      setNotes(INITIAL_NOTES);
      localStorage.setItem('vdj_notes_v3', JSON.stringify(INITIAL_NOTES));
    }

    if (localStorage.getItem('vdj_admin_session') === 'active') setIsAdmin(true);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
  }, [notes]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'vidio') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPass('');
      localStorage.setItem('vdj_admin_session', 'active');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('vdj_admin_session');
    setShowEditor(false);
  };

  const startEdit = (note: PatchNote) => {
    setEditingVersion(note.version);
    setFormVersion(note.version);
    setFormTitle(note.title);
    setFormDesc(note.description);
    setFormChanges(note.changes.length > 0 ? note.changes : [{ type: 'new', text: '' }]);
    setShowEditor(true);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanChanges = formChanges.filter(c => c.text.trim() !== '');
    
    setNotes(prev => {
      let next;
      const newNote = {
        version: formVersion,
        date: editingVersion ? (prev.find(n => n.version === editingVersion)?.date || new Date().toLocaleDateString('fr-FR')) : new Date().toLocaleDateString('fr-FR'),
        title: formTitle,
        description: formDesc,
        changes: cleanChanges
      };

      if (editingVersion) {
        next = prev.map(n => n.version === editingVersion ? newNote : n);
      } else {
        next = [newNote, ...prev];
      }
      localStorage.setItem('vdj_notes_v3', JSON.stringify(next));
      return next;
    });

    closeEditor();
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setNotes(prev => {
      const next = prev.filter(n => n.version !== itemToDelete);
      localStorage.setItem('vdj_notes_v3', JSON.stringify(next));
      return next;
    });
    setItemToDelete(null);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingVersion(null);
    setFormVersion('');
    setFormTitle('');
    setFormDesc('');
    setFormChanges([{ type: 'new', text: '' }]);
  };

  return (
    <main className="relative w-full h-[100dvh] bg-[#08090a] overflow-hidden flex flex-col text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="opacity-[0.03]">
        <BackgroundWaves mousePosition={mousePosition} />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full px-6 py-8 md:py-12">
        
        {/* Simple Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white">
              Nouveautés
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-semibold">Vidio Di Jour • Private Cloud</p>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="text-white/40">Serveur v{sortedNotes[0]?.version || '0.0'}</span>
            </div>
            {!isAdmin ? (
              <button onClick={() => setShowAdminLogin(true)} className="text-[9px] uppercase tracking-widest text-white/10 hover:text-white/40 transition-colors">Admin Access</button>
            ) : (
              <div className="flex gap-4">
                <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold">Console Active</span>
                <button onClick={handleLogout} className="text-[9px] uppercase tracking-widest text-rose-500/50 hover:text-rose-500 font-bold">Quitter</button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pr-2 pb-20 scroll-smooth">
          
          {/* Admin Tools */}
          {isAdmin && (
            <div className="mb-12 animate-slide-up">
              {!showEditor ? (
                <button 
                  onClick={() => setShowEditor(true)}
                  className="w-full py-6 border border-dashed border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
                >
                  + Ajouter une note
                </button>
              ) : (
                <div className="bg-[#111214] border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <form onSubmit={saveNote} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Version</label>
                        <input value={formVersion} onChange={e => setFormVersion(e.target.value)} required placeholder="v3.0.0" className="w-full p-3 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Titre</label>
                        <input value={formTitle} onChange={e => setFormTitle(e.target.value)} required placeholder="Nom de l'update" className="w-full p-3 rounded-lg text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Description</label>
                      <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={2} className="w-full p-3 rounded-lg text-sm" placeholder="Résumé rapide..." />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <label className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Détails</label>
                         <button type="button" onClick={() => setFormChanges([...formChanges, { type: 'new', text: '' }])} className="text-[9px] font-bold uppercase text-cyan-400">+ Ligne</button>
                      </div>
                      {formChanges.map((c, i) => (
                        <div key={i} className="flex gap-2">
                          <select value={c.type} onChange={e => {
                            const n = [...formChanges]; n[i].type = e.target.value as any; setFormChanges(n);
                          }} className="text-[10px] uppercase font-bold rounded-lg px-2">
                            <option value="new">New</option>
                            <option value="improved">Improved</option>
                            <option value="fix">Fix</option>
                            <option value="system">System</option>
                          </select>
                          <input value={c.text} onChange={e => {
                            const n = [...formChanges]; n[i].text = e.target.value; setFormChanges(n);
                          }} placeholder="Changement..." className="flex-1 p-3 rounded-lg text-sm" />
                          <button type="button" onClick={() => setFormChanges(formChanges.filter((_, idx) => idx !== i))} className="px-3 text-white/20 hover:text-rose-500">&times;</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button type="submit" className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                        {editingVersion ? 'Mettre à jour' : 'Publier'}
                      </button>
                      <button type="button" onClick={closeEditor} className="px-8 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5">Annuler</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Feed */}
          <div className="space-y-20 relative">
            <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-white/5" />
            
            {sortedNotes.map((note) => (
              <div key={note.version} className="relative pl-10 group">
                {/* Bullet */}
                <div className="absolute left-0 top-1 w-[7px] h-[7px] rounded-full bg-white/10 border border-white/20 group-hover:bg-cyan-500 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all" />
                
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-white group-hover:text-cyan-400 transition-colors">{note.version}</h2>
                    <p className="text-[9px] uppercase font-bold tracking-widest text-white/20 mt-1">{note.date}</p>
                    
                    {isAdmin && (
                      <div className="flex gap-4 mt-6">
                        <button onClick={() => startEdit(note)} className="text-[8px] font-bold uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors">Éditer</button>
                        <button onClick={() => setItemToDelete(note.version)} className="text-[8px] font-bold uppercase tracking-widest text-rose-500/30 hover:text-rose-500 transition-colors">Supprimer</button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white/90">{note.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed max-w-xl">{note.description}</p>
                    </div>

                    <div className="grid gap-2">
                      {note.changes.map((c, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.04] transition-all">
                          <TypeBadge type={c.type} />
                          <span className="text-sm text-white/60 font-medium">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center py-20 border-t border-white/5 opacity-10">
            <p className="text-[9px] uppercase tracking-[0.6em]">End of feed</p>
          </div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-8 flex justify-between items-center opacity-20 pointer-events-none">
          <div className="text-[8px] uppercase tracking-widest font-bold">Vidio Di Jour • Station Cinema</div>
          <div className="text-[8px] uppercase tracking-widest font-bold">Ismail B.</div>
        </footer>
      </div>

      {/* Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
          <div className="w-full max-w-xs bg-[#111214] border border-white/10 p-10 rounded-2xl shadow-2xl">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40 text-center mb-8">Accès Restreint</h4>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                autoFocus
                placeholder="Mot de passe..." 
                className={`w-full p-4 rounded-xl text-center tracking-[0.5em] ${loginError ? 'border-rose-500' : ''}`}
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 py-3 text-[9px] font-bold uppercase text-white/20">Retour</button>
                <button type="submit" className="flex-1 py-3 bg-cyan-600 rounded-xl text-[9px] font-bold uppercase">Entrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-fade-in">
          <div className="w-full max-w-sm bg-[#111214] border border-white/10 p-12 rounded-3xl text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">!</div>
            <h3 className="text-xl font-bold mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-white/40 mb-10">Voulez-vous vraiment supprimer la version <span className="text-white font-bold">{itemToDelete}</span> ? Cette action est irréversible.</p>
            <div className="flex gap-4">
               <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Annuler</button>
               <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;