import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, Edit3, Image as ImageIcon, Save, X } from 'lucide-react';
import { SavedCard } from '../types';

interface SavedCardsProps {
  cards: SavedCard[];
  onUpdateCard: (id: string, updates: Partial<SavedCard>) => void;
  onDeleteCard: (id: string) => void;
}

export function SavedCards({ cards, onUpdateCard, onDeleteCard }: SavedCardsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SavedCard>>({});

  if (cards.length === 0) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 relative flex items-center justify-center min-h-[600px]">
        <div className="neu-flat p-12 shadow-lg text-center text-secondary max-w-md w-full">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-primary text-lg font-bold mb-2">Belum ada Kartu Tersimpan</h3>
          <p className="text-sm">Buka menu Data Statistik, pilih siswa, lalu klik "Simpan Kartu" untuk menyimpan snapshot kartu siswa.</p>
        </div>
      </div>
    );
  }

  const handleEdit = (card: SavedCard) => {
    setEditingId(card.id);
    setEditForm(card);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdateCard(editingId, editForm);
      setEditingId(null);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-primary uppercase tracking-wider">Kartu Tersimpan</h2>
          <span className="text-xs font-bold text-blue-500 neu-button-accent/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
            {cards.length} KARTU
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.id} className="neu-flat p-5 shadow-lg overflow-hidden relative group">
              {editingId === card.id ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4 border-b border-theme pb-2">
                    <span className="text-xs font-bold text-primary uppercase">Edit Kartu</span>
                    <button onClick={() => setEditingId(null)} className="text-secondary hover:text-primary">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-secondary font-bold uppercase block mb-1">Nama</label>
                      <input 
                        type="text" 
                        value={editForm.name || ''} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full neu-pressed border border-theme rounded-xl px-3 py-2 text-sm text-primary focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-secondary font-bold uppercase block mb-1">Tinggi (cm)</label>
                        <input 
                          type="number" 
                          value={editForm.height || ''} 
                          onChange={(e) => setEditForm({...editForm, height: parseInt(e.target.value) || 0})}
                          className="w-full neu-pressed border border-theme rounded-xl px-3 py-2 text-sm text-primary focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-secondary font-bold uppercase block mb-1">Berat (kg)</label>
                        <input 
                          type="number" 
                          value={editForm.weight || ''} 
                          onChange={(e) => setEditForm({...editForm, weight: parseInt(e.target.value) || 0})}
                          className="w-full neu-pressed border border-theme rounded-xl px-3 py-2 text-sm text-primary focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-secondary font-bold uppercase block mb-1">Kehadiran (%)</label>
                      <input 
                        type="number" 
                        value={editForm.attendanceRate || ''} 
                        onChange={(e) => setEditForm({...editForm, attendanceRate: parseInt(e.target.value) || 0})}
                        className="w-full neu-pressed border border-theme rounded-xl px-3 py-2 text-sm text-primary focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-theme mt-4 flex gap-2">
                    <button 
                      onClick={handleSave}
                      className="flex-1 neu-button-accent text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Simpan
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button 
                      onClick={() => handleEdit(card)}
                      className="w-8 h-8 rounded-full neu-pressed border border-theme text-slate-300 flex items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/30 transition-all shadow-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Hapus kartu ini dari tersimpan?')) {
                          onDeleteCard(card.id);
                        }
                      }}
                      className="w-8 h-8 rounded-full neu-pressed border border-theme text-slate-300 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative aspect-[1086/1081] bg-primary rounded-2xl overflow-hidden border-2 border-slate-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-orange-900/30 z-0" />
                    
                    {card.fullBodyPhoto && (
                      <div className="absolute left-0 bottom-0 w-1/2 h-full flex items-end justify-center z-10">
                        <img src={card.fullBodyPhoto} alt={card.name} className="max-h-[120%] object-contain origin-bottom scale-[1.15]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] via-transparent to-transparent z-10" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3 z-20">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-primary font-black px-3 py-1 rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm text-[8px] uppercase tracking-widest shadow-lg">
                        {card.position}
                      </div>
                    </div>

                    <div className="absolute right-0 bottom-0 w-1/2 h-full p-4 flex flex-col justify-end z-20 text-right">
                      <h3 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none mb-4 font-display">
                        {card.name.split(' ').map((n, i) => (
                          <span key={i} className={i > 0 ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-orange-400 block" : "block"}>
                            {n}
                          </span>
                        ))}
                      </h3>
                      
                      <div className="space-y-2 mb-4 bg-black/40 p-2 rounded-xl backdrop-blur-sm border border-white/5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-secondary font-bold uppercase">Tinggi</span>
                          <span className="text-primary font-medium">{card.height} cm</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-secondary font-bold uppercase">Berat</span>
                          <span className="text-primary font-medium">{card.weight} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-secondary font-bold uppercase">Kehadiran</span>
                          <span className="text-primary font-medium">{card.attendanceRate}%</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className={`w-12 h-12 rounded-xl border-2 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md ${card.letterGrade.grade === 'A' ? 'text-emerald-500 border-emerald-500' : card.letterGrade.grade === 'B' ? 'text-blue-500 border-blue-500' : card.letterGrade.grade === 'C' ? 'text-yellow-500 border-yellow-500' : 'text-rose-500 border-rose-500'}`}>
                          <span className="text-xl font-black leading-none">{card.letterGrade.grade}</span>
                          <span className="text-[7px] font-bold uppercase tracking-widest mt-0.5">{card.letterGrade.text}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
