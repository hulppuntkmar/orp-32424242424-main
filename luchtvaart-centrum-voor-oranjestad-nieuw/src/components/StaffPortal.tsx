import React, { useState, useEffect } from 'react';
import { 
  Award, Plus, Edit2, Check, X, Trash2, DollarSign, 
  Building2, TrendingUp, Settings 
} from 'lucide-react';

interface StaffPortalProps {
  licenses?: any[];
  issuedLicenses?: any[];
  onUpdateLicense?: (updatedLicense: any) => void;
  onDeleteLicense?: (id: string) => void;
  onRemoveLicense?: (id: string) => void;
  onAddLicense?: (newLicense: any) => void;
  staffMembers?: any[];
  inventory?: any[];
  onUpdateInventory?: (inv: any[]) => void;
  aircraftList?: any[];
  onUpdateAircraftList?: (list: any[]) => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({
  licenses = [],
  issuedLicenses = [],
  onUpdateLicense,
  onDeleteLicense,
  onRemoveLicense,
  staffMembers = []
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'issue' | 'finances' | 'taxes' | 'bonuses' | 'settings'>('register');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const allLicenses = licenses.length > 0 ? licenses : issuedLicenses;
  const [localLicenses, setLocalLicenses] = useState<any[]>(allLicenses);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ pilotName: '', bsn: '' });

  useEffect(() => {
    const activeList = licenses.length > 0 ? licenses : issuedLicenses;
    setLocalLicenses(activeList);
  }, [licenses, issuedLicenses]);

  const handleStartEdit = (lic: any) => {
    setEditingId(lic.id);
    setEditForm({
      pilotName: lic.pilotName || lic.klant || '',
      bsn: lic.bsn || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ pilotName: '', bsn: '' });
  };

  const handleSaveEdit = (id: string) => {
    const updated = localLicenses.map(lic => {
      if (lic.id === id) {
        return {
          ...lic,
          pilotName: editForm.pilotName,
          klant: editForm.pilotName,
          bsn: editForm.bsn
        };
      }
      return lic;
    });

    setLocalLicenses(updated);

    if (onUpdateLicense) {
      const target = updated.find(l => l.id === id);
      onUpdateLicense(target);
    }

    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Weet je zeker dat je dit brevet wilt verwijderen?')) {
      const filtered = localLicenses.filter(l => l.id !== id);
      setLocalLicenses(filtered);
      
      if (onDeleteLicense) {
        onDeleteLicense(id);
      } else if (onRemoveLicense) {
        onRemoveLicense(id);
      }
    }
  };

  const filteredLicenses = localLicenses.filter(lic => {
    const name = (lic.pilotName || lic.klant || '').toLowerCase();
    const bsn = (lic.bsn || '').toLowerCase();
    const id = (lic.id || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || bsn.includes(search) || id.includes(search);
    const matchesCategory = categoryFilter === 'ALL' || lic.type === categoryFilter || lic.categorie === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-slate-100 font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('issue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition ${
            activeTab === 'issue'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Plus size={14} /> 📜 BREVET UITGEVEN
        </button>

<div className="bg-red-600 text-white font-bold text-center py-4 text-xl">
  🚨 TEST: JE ZIET NU DE NIEUWE MAP! 🚨
</div>

        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition ${
            activeTab === 'register'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Award size={14} /> 📑 DIPLOMA REGISTER
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition ${
            activeTab === 'finances'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <DollarSign size={14} /> 💰 FINANCIËN & WINST
        </button>

        <button
          onClick={() => setActiveTab('taxes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition ${
            activeTab === 'taxes'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Building2 size={14} /> 🏛 BELASTINGEN
        </button>

        <button
          onClick={() => setActiveTab('bonuses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition ${
            activeTab === 'bonuses'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <TrendingUp size={14} /> 🏆 PRESTATIES & BONUSSEN
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Settings size={14} /> ⚙ INSTELLINGEN
        </button>
      </div>

      {/* DIPLOMA REGISTER TAB */}
      {activeTab === 'register' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Uitgegeven Vliegbrevetten</h2>
              <p className="text-slate-400 text-xs mt-0.5">Overzicht van alle geslaagde burgers.</p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Zoek burger, ID of status..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-amber-500 md:w-64"
              />

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">Alle Diploma's</option>
                <option value="HELIKOPTER BREVET">Helikopter Brevet</option>
                <option value="VLIEGTUIG GROOT BREVET">Vliegtuig Groot Brevet</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800/80">
                  <th className="py-3 px-3 uppercase">DIPLOMA ID</th>
                  <th className="py-3 px-3 uppercase">KLANT (PILOOT)</th>
                  <th className="py-3 px-3 uppercase">BURGER ID / BSN</th>
                  <th className="py-3 px-3 uppercase">CATEGORIE</th>
                  <th className="py-3 px-3 uppercase">DOCENT (STAFF)</th>
                  <th className="py-3 px-3 uppercase">DATUM</th>
                  <th className="py-3 px-3 uppercase">COMMISSIE STATUS</th>
                  <th className="py-3 px-3 uppercase text-right">ACTIES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredLicenses.map(lic => {
                  const isEditing = editingId === lic.id;

                  return (
                    <tr key={lic.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-3 text-rose-500 font-bold">{lic.id}</td>

                      <td className="py-3.5 px-3 text-white font-semibold">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.pilotName}
                            onChange={e => setEditForm({ ...editForm, pilotName: e.target.value })}
                            className="bg-slate-950 border border-amber-500 rounded px-2 py-1 text-xs text-white focus:outline-none w-full"
                          />
                        ) : (
                          lic.pilotName || lic.klant || 'Onbekend'
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-amber-500 font-bold">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.bsn}
                            onChange={e => setEditForm({ ...editForm, bsn: e.target.value })}
                            className="bg-slate-950 border border-amber-500 rounded px-2 py-1 text-xs text-amber-400 focus:outline-none w-full"
                          />
                        ) : (
                          lic.bsn?.toString().startsWith('BSN-') ? lic.bsn : `BSN-${lic.bsn || 'NIL'}`
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-purple-900/40 text-purple-300 border border-purple-500/30">
                          {lic.type || lic.categorie || 'HELIKOPTER BREVET'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-300">{lic.docent || lic.staff || 'Military_Touch'}</td>

                      <td className="py-3.5 px-3 text-slate-400">{lic.datum || lic.issueDate || '1-6-2026'}</td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 text-[10px] rounded font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                          {lic.commissieStatus || 'VOLDAAN'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(lic.id)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition"
                              title="Opslaan"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 bg-slate-800 text-slate-300 rounded border border-slate-700 transition"
                              title="Annuleren"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(lic)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-slate-700 transition"
                              title="Bewerken"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(lic.id)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-900/50 text-rose-400 rounded border border-slate-700 transition"
                              title="Verwijderen"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPortal;