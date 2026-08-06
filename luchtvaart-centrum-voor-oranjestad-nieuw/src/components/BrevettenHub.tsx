import React, { useState } from 'react';
import { Award, Search, Plus, Edit2, Check, X, ShieldAlert } from 'lucide-react';

export const BrevettenHub: React.FC<any> = ({
  licenses = [],
  onUpdateLicense,
  onCreateLicense
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newForm, setNewForm] = useState({
    pilotName: '',
    bsn: '',
    type: 'PPL',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'Actief'
  });

  const filteredLicenses = licenses.filter((lic: any) =>
    lic.pilotName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lic.bsn?.includes(searchTerm) ||
    lic.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (lic: any) => {
    setEditingId(lic.id);
    setEditForm({ ...lic });
  };

  const handleSaveEdit = () => {
    if (editingId && editForm && onUpdateLicense) {
      onUpdateLicense(editForm);
      setEditingId(null);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateLicense) {
      onCreateLicense(newForm);
      setIsCreating(false);
      setNewForm({
        pilotName: '',
        bsn: '',
        type: 'PPL',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        status: 'Actief'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="text-amber-500" /> Vliegbrevetten Beheer
          </h1>
          <p className="text-slate-400 text-sm">Beheer en pas aangemaakte vliegbrevetten aan.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} /> Nieuw Brevet Aanmaken
        </button>
      </div>

      {/* Formulier voor nieuw brevet */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Nieuw Brevet Toevoegen</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Naam piloot"
              required
              value={newForm.pilotName}
              onChange={e => setNewForm({ ...newForm, pilotName: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="BSN (bijv. 123456789)"
              required
              value={newForm.bsn}
              onChange={e => setNewForm({ ...newForm, bsn: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Brevet Type (bijv. PPL, CPL)"
              required
              value={newForm.type}
              onChange={e => setNewForm({ ...newForm, type: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg"
            />
            <input
              type="date"
              required
              value={newForm.expiryDate}
              onChange={e => setNewForm({ ...newForm, expiryDate: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-white p-2 rounded-lg"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg"
            >
              Annuleren
            </button>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg">
              Opslaan
            </button>
          </div>
        </form>
      )}

      {/* Zoekbalk */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Zoek op naam, BSN of brevet..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Overzicht en Bewerken van Brevetten */}
      <div className="grid gap-4">
        {filteredLicenses.map((lic: any) => (
          <div key={lic.id} className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {editingId === lic.id ? (
              /* --- BEWERK MODUS (Aanpassen Naam, BSN, Type) --- */
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-xs text-slate-400 block">Naam Piloot</label>
                  <input
                    type="text"
                    value={editForm.pilotName || ''}
                    onChange={e => setEditForm({ ...editForm, pilotName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block">BSN</label>
                  <input
                    type="text"
                    value={editForm.bsn || ''}
                    onChange={e => setEditForm({ ...editForm, bsn: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block">Type Brevet</label>
                  <input
                    type="text"
                    value={editForm.type || ''}
                    onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded"
                  />
                </div>
                <div className="flex gap-2 md:col-span-3 justify-end mt-2">
                  <button onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded flex items-center gap-1">
                    <Check size={16} /> Opslaan
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded flex items-center gap-1">
                    <X size={16} /> Annuleren
                  </button>
                </div>
              </div>
            ) : (
              /* --- NORMALE WEERGAVE --- */
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{lic.pilotName}</h3>
                    <span className="px-2 py-0.5 text-xs rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                      {lic.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldAlert size={12} className="text-slate-500" /> BSN: <strong className="text-slate-200">{lic.bsn || 'Niet ingevuld'}</strong>
                    </span>
                    {lic.expiryDate && <span>Verloopt op: {lic.expiryDate}</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleStartEdit(lic)}
                  className="bg-slate-700 hover:bg-slate-600 text-amber-400 px-3 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Edit2 size={16} /> Bewerken
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};