import React, { useRef, useState } from 'react';
import { Download, Image as ImageIcon, User, Shield, Award } from 'lucide-react';
import html2canvas from 'html2canvas';

type CardType = 'student' | 'coach';

interface CardGeneratorProps {
  type: CardType;
  title: string;
}

export default function CardGenerator({ type, title }: CardGeneratorProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: type === 'student' ? 'NAMA SISWA' : 'NAMA PELATIH',
    role: type === 'student' ? 'Point Guard' : 'Head Coach',
    idNumber: type === 'student' ? 'BA-2026-001' : 'C-2026-101',
    team: 'DRAGONS BASKETBALL',
    slogan: 'ONE TEAM ONE DREAM',
    photoUrl: '',
    specialty: type === 'coach' ? 'Offense Strategy' : '',
    experience: type === 'coach' ? '10+ Years' : '',
  });

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-card-${formData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      a.click();
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh kartu.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, photoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-4 lg:p-6 bg-secondary">
      {/* Editor Panel */}
      <div className="w-full lg:w-1/3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4 border-b border-theme pb-2">
          Editor {title}
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">Nama Lengkap</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full neu-pressed border border-theme text-primary p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">Posisi / Jabatan</label>
            <input 
              type="text" 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full neu-pressed border border-theme text-primary p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">ID / Nomor Induk</label>
            <input 
              type="text" 
              value={formData.idNumber} 
              onChange={e => setFormData({...formData, idNumber: e.target.value})}
              className="w-full neu-pressed border border-theme text-primary p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">Nama Tim</label>
            <input 
              type="text" 
              value={formData.team} 
              onChange={e => setFormData({...formData, team: e.target.value})}
              className="w-full neu-pressed border border-theme text-primary p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
            />
          </div>
          
          {type === 'coach' && (
            <>
              <div>
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">Spesialisasi</label>
                <input 
                  type="text" 
                  value={formData.specialty} 
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                  className="w-full neu-pressed border border-theme text-primary p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">Pengalaman</label>
                <input 
                  type="text" 
                  value={formData.experience} 
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full neu-pressed border border-theme text-primary p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">Upload Foto</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full neu-pressed border border-theme text-primary p-2 rounded-xl text-xs outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:neu-button-accent file:text-primary hover:file:bg-blue-600"
            />
          </div>
        </div>

        <button 
          onClick={handleDownload}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-500 text-primary font-bold uppercase tracking-widest text-[10px] py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Unduh Kartu
        </button>
      </div>

      {/* Preview Panel */}
      <div className="w-full lg:w-2/3 flex items-center justify-center bg-black/50 rounded-2xl border border-theme overflow-hidden p-8 relative">
         <div 
           ref={cardRef} 
           className="relative w-[320px] h-[500px] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-gradient-to-br from-[#1c142c] to-[#0B0A10] border-2 border-blue-500/30"
           style={{ transform: 'scale(0.95)' }}
         >
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 neu-button-accent/20 rounded-full blur-[40px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/20 rounded-full blur-[40px] mix-blend-screen pointer-events-none" />
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600" />
            
            {/* Header */}
            <div className="p-6 flex justify-between items-start z-10">
               <div>
                  <h4 className="text-primary font-black uppercase text-xl leading-none">{formData.team}</h4>
                  <p className="text-blue-500 text-[8px] font-bold uppercase tracking-[0.2em] mt-1">{type === 'student' ? 'OFFICIAL ATHLETE ID' : 'OFFICIAL COACH ID'}</p>
               </div>
               <Shield className="w-8 h-8 text-blue-500 opacity-80" />
            </div>

            {/* Photo */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 px-6">
               <div className="w-40 h-40 rounded-full border-4 border-theme overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] neu-pressed relative group mb-4">
                 {formData.photoUrl ? (
                   <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-600">
                     <ImageIcon className="w-12 h-12" />
                   </div>
                 )}
               </div>
               
               <h2 className="text-primary text-2xl font-black uppercase text-center tracking-wide">{formData.name}</h2>
               <div className="neu-button-accent/10 border border-blue-500/30 px-4 py-1 rounded-full mt-2">
                 <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">{formData.role}</span>
               </div>
            </div>

            {/* Details */}
            <div className="p-6 bg-primary/80 backdrop-blur-md z-10 border-t border-theme">
               <div className="flex justify-between items-center mb-4">
                 <div>
                   <p className="text-secondary text-[8px] font-bold uppercase tracking-widest">ID NUMBER</p>
                   <p className="text-primary text-sm font-mono tracking-wider">{formData.idNumber}</p>
                 </div>
                 {type === 'student' ? (
                   <Award className="w-6 h-6 text-purple-500" />
                 ) : (
                   <User className="w-6 h-6 text-purple-500" />
                 )}
               </div>
               
               {type === 'coach' && (
                 <div className="flex justify-between items-center mb-4 border-t border-theme pt-3">
                   <div>
                     <p className="text-secondary text-[8px] font-bold uppercase tracking-widest">SPECIALTY</p>
                     <p className="text-primary text-xs font-bold">{formData.specialty}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-secondary text-[8px] font-bold uppercase tracking-widest">EXP</p>
                     <p className="text-primary text-xs font-bold">{formData.experience}</p>
                   </div>
                 </div>
               )}

               <div className="text-center pt-3 border-t border-theme">
                 <p className="text-secondary text-[7px] uppercase tracking-[0.3em] font-bold">
                   "{formData.slogan}"
                 </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
