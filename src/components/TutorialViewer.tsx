/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TutorialVideo } from '../types';
import { TUTORIALS, TUTORIAL_CATEGORIES } from '../data/tutorials';
import { Play, Pause, Volume2, RotateCcw, Timer, Award, CheckCircle2, ChevronRight, Compass, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TutorialViewer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialVideo>(TUTORIALS[0]);
  
  // Mock Video States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'langkah' | 'latihan' | 'tips'>('langkah');

  // Drill Timer States
  const [activeDrill, setActiveDrill] = useState<string | null>(null);
  const [drillTimeLeft, setDrillTimeLeft] = useState(60);
  const [isDrillRunning, setIsDrillRunning] = useState(false);
  const drillIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync tutorial selection changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveDrill(null);
    setIsDrillRunning(false);
  }, [selectedTutorial]);

  // Video duration calculations
  const durationInSeconds = parseDurationToSeconds(selectedTutorial.duration);

  // Auto-progress mock video timeline when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationInSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationInSeconds, playbackSpeed]);

  // Handle drill countdown timer
  useEffect(() => {
    if (isDrillRunning && drillTimeLeft > 0) {
      drillIntervalRef.current = setInterval(() => {
        setDrillTimeLeft((prev) => {
          if (prev <= 1) {
            setIsDrillRunning(false);
            if (drillIntervalRef.current) clearInterval(drillIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (drillIntervalRef.current) clearInterval(drillIntervalRef.current);
    }

    return () => {
      if (drillIntervalRef.current) clearInterval(drillIntervalRef.current);
    };
  }, [isDrillRunning, drillTimeLeft]);

  // Format seconds to MM:SS
  function formatTime(secs: number) {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  }

  // Parse "04:15" string to seconds
  function parseDurationToSeconds(durationStr: string) {
    const parts = durationStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 120; // fallback
  }

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleStartDrill = (drillName: string) => {
    setActiveDrill(drillName);
    setDrillTimeLeft(60);
    setIsDrillRunning(true);
  };

  const handleToggleDrillTimer = () => {
    setIsDrillRunning(!isDrillRunning);
  };

  const handleResetDrillTimer = () => {
    setDrillTimeLeft(60);
    setIsDrillRunning(false);
  };

  // Filter tutorials based on selected category
  const filteredTutorials = TUTORIALS.filter((t) => {
    if (selectedCategory === 'Semua') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="tutorials-workspace">
      
      {/* LEFT: Tutorial List & Categories (4 columns) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Category Filter */}
        <div className="neu-flat p-5 shadow-lg">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-3">Kategori Teknik</span>
          <div className="flex flex-wrap gap-2">
            {TUTORIAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`btn-filter-category-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-bold px-4 py-2 rounded-2xl border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-700 to-blue-500 text-primary border-transparent shadow-md'
                    : 'neu-pressed text-secondary border-theme hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorial List Card */}
        <div className="neu-flat p-5 shadow-lg flex-1 min-h-[350px]">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-4">Pustaka Video Tutorial</span>
          
          <div className="flex flex-col gap-3">
            {filteredTutorials.map((tut) => {
              const isSelected = tut.id === selectedTutorial.id;
              return (
                <button
                  key={tut.id}
                  id={`btn-select-tutorial-${tut.id}`}
                  onClick={() => setSelectedTutorial(tut)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-blue-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                      : 'bg-primary border-theme hover:border-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-lg ${
                    isSelected ? 'neu-button-accent border-blue-400' : 'neu-pressed border-theme'
                  }`}>
                    <Play className={`w-5 h-5 ${isSelected ? 'text-primary fill-white' : 'text-secondary fill-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-primary line-clamp-1">{tut.title}</h5>
                    <div className="flex justify-between items-center mt-1 text-[10px] text-secondary">
                      <span className="font-medium text-secondary">{tut.category}</span>
                      <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {tut.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Mock Video Player & Playbooks (8 columns) */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="player-and-guides">
        
        {/* Modern 3D Video Simulator Player (16:9 Bezel) */}
        <div className="neu-flat p-2.5 shadow-lg relative overflow-hidden flex flex-col">
          
          {/* Bezel screen frame */}
          <div className="relative w-full aspect-video bg-primary rounded-2xl overflow-hidden border border-theme flex flex-col justify-between">
            
            {/* Live Visualizations Overlay based on tutorial playing state */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              
              {/* Tactical Court Draw Layer (Dynamic animation mockups) */}
              <div className="absolute inset-4 border border-dashed border-white/5 rounded-xl flex items-center justify-center bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:20px_20px] opacity-20">
                {/* 3D Basket Ring Circle Mockup */}
                <div className="absolute top-0 w-24 h-12 border border-white/10 rounded-b-full"></div>
                <div className="absolute top-12 w-2 h-2 neu-button-accent rounded-full shadow-[0_0_10px_#f97316]"></div>
                {/* 3 Point Arc */}
                <div className="absolute top-0 w-48 h-48 border border-white/10 rounded-full transform -translate-y-1/2"></div>
              </div>

              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute neu-pressed/90 text-primary px-6 py-4 rounded-2xl border border-theme flex flex-col items-center gap-3 shadow-2xl backdrop-blur-md pointer-events-auto cursor-pointer group hover:bg-secondary border-theme/90 transition-colors"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="w-14 h-14 rounded-full neu-button-accent flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-blue-400 group-hover:scale-105 transition-transform">
                      <Play className="w-6 h-6 text-primary fill-white translate-x-0.5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glowing Interactive Ball and Defense Dots moving while playing */}
              {isPlaying && (
                <div className="absolute inset-0 z-0">
                  {/* Basketball dribble visual */}
                  {selectedTutorial.category === 'Dribbling' && (
                    <motion.div
                      animate={{
                        x: [60, 180, 100, 240, 140, 60],
                        y: [120, 80, 140, 60, 160, 120],
                        scale: [1, 1.3, 0.9, 1.4, 0.8, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                      className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.8)] border border-orange-800 flex items-center justify-center"
                    >
                      <span className="text-xs">🏀</span>
                    </motion.div>
                  )}

                  {/* Basketball shooting visual */}
                  {selectedTutorial.category === 'Shooting' && (
                    <>
                      {/* Shooter dot */}
                      <div className="absolute left-10 bottom-10 w-4 h-4 bg-purple-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]">A</div>
                      {/* Shot path */}
                      <motion.div
                        animate={{
                          x: [40, 150, 180],
                          y: [160, 40, 90],
                          scale: [1, 1.5, 0.5],
                          opacity: [1, 1, 0.8]
                        }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
                        className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.8)] border border-slate-900 flex items-center justify-center"
                      >
                        <span className="text-[10px]">🏀</span>
                      </motion.div>
                    </>
                  )}

                  {/* Passing visual */}
                  {selectedTutorial.category === 'Passing' && (
                    <>
                      {/* Playmakers dots */}
                      <div className="absolute left-12 top-20 w-4 h-4 bg-emerald-500 rounded-full border border-white"></div>
                      <div className="absolute right-16 top-16 w-4 h-4 bg-emerald-500 rounded-full border border-white"></div>
                      {/* Passed ball */}
                      <motion.div
                        animate={{
                          x: [55, 230, 55],
                          y: [90, 75, 90]
                        }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="absolute w-6 h-6 rounded-full neu-button-accent border border-slate-900 flex items-center justify-center"
                      >
                        <span className="text-[10px]">🏀</span>
                      </motion.div>
                    </>
                  )}

                  {/* Defense Visual */}
                  {selectedTutorial.category === 'Defense' && (
                    <>
                      {/* Attacker */}
                      <motion.div
                        animate={{ x: [40, 200, 40], y: [120, 110, 120] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        className="absolute w-5 h-5 bg-rose-500 rounded-full border border-white flex items-center justify-center text-[8px] font-black"
                      >
                        ATK
                      </motion.div>
                      {/* Defender mirroring */}
                      <motion.div
                        animate={{ x: [55, 215, 55], y: [130, 120, 130] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        className="absolute w-5 h-5 bg-blue-600 rounded-full border border-white flex items-center justify-center text-[8px] font-black shadow-[0_0_8px_#2563eb]"
                      >
                        DEF
                      </motion.div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Video Header/Title overlay */}
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent relative z-20 flex justify-between items-start">
              <div>
                <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {selectedTutorial.difficulty}
                </span>
                <h3 className="text-sm font-black text-primary mt-1 drop-shadow-md">{selectedTutorial.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-400 font-mono font-bold drop-shadow-md">SIMULATOR COCH-TAKTIS</span>
              </div>
            </div>

            {/* Tactical overlay captions when playing */}
            {isPlaying && (
              <div className="p-4 text-center bg-black/60 backdrop-blur-sm mx-8 rounded-xl border border-white/5 relative z-20 mb-2">
                <span className="text-xs text-amber-300 font-medium animate-pulse">
                  {selectedTutorial.category === 'Dribbling' && '💡 Tekan bola dengan ujung jari, jaga pinggul tetap rendah.'}
                  {selectedTutorial.category === 'Shooting' && '💡 Luruskan siku (90°) & jentikkan pergelangan tangan (follow through).'}
                  {selectedTutorial.category === 'Passing' && '💡 Langkahkan satu kaki ke depan saat mendorong operan lurus.'}
                  {selectedTutorial.category === 'Defense' && '💡 Jaga jarak satu rentangan tangan, ikuti pergerakan pinggul penyerang.'}
                </span>
              </div>
            )}

            {/* Video Footer Controls Overlay */}
            <div className="p-4 bg-gradient-to-t from-black/90 to-transparent relative z-20">
              
              {/* Range/Seek Slider */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-secondary">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={durationInSeconds}
                  value={currentTime}
                  onChange={handleScrubChange}
                  className="flex-1 accent-amber-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-secondary">{selectedTutorial.duration}</span>
              </div>

              {/* Bottom control row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg border border-slate-950 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                  </button>

                  <button
                    onClick={() => setCurrentTime(0)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all cursor-pointer"
                    title="Mulai Ulang"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 ml-2">
                    <Volume2 className="w-4 h-4 text-secondary" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-16 accent-white h-0.5 bg-slate-700 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Playback speed buttons */}
                  {[1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`text-[9px] font-black px-2 py-1 rounded transition-all ${
                        playbackSpeed === speed
                          ? 'neu-button-accent font-black'
                          : 'bg-secondary border-theme text-secondary hover:bg-slate-700'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Playbook Instruction Tabs (Langkah, Latihan, Tips) */}
        <div className="neu-flat p-6 shadow-lg">
          <div className="flex border-b border-theme pb-3 mb-4 gap-4">
            <button
              onClick={() => setActiveTab('langkah')}
              className={`text-[11px] font-bold pb-2 border-b-2 transition-all cursor-pointer uppercase tracking-widest ${
                activeTab === 'langkah' ? 'border-blue-500 text-primary' : 'border-transparent text-secondary hover:text-slate-300'
              }`}
            >
              📖 Langkah Eksplorasi
            </button>
            <button
              onClick={() => setActiveTab('latihan')}
              className={`text-[11px] font-bold pb-2 border-b-2 transition-all cursor-pointer uppercase tracking-widest ${
                activeTab === 'latihan' ? 'border-blue-500 text-primary' : 'border-transparent text-secondary hover:text-slate-300'
              }`}
            >
              🏋️ Menu Drill Latihan
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`text-[11px] font-bold pb-2 border-b-2 transition-all cursor-pointer uppercase tracking-widest ${
                activeTab === 'tips' ? 'border-blue-500 text-primary' : 'border-transparent text-secondary hover:text-slate-300'
              }`}
            >
              💡 Tips & Trik Pro
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'langkah' && (
              <motion.div
                key="langkah"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <p className="text-xs text-secondary font-medium leading-relaxed mb-4">
                  {selectedTutorial.description}
                </p>
                <div className="space-y-3">
                  {selectedTutorial.steps.map((step, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-primary text-blue-500 font-bold text-[10px] rounded-lg flex items-center justify-center shrink-0 border border-blue-500/30">
                        {index + 1}
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'latihan' && (
              <motion.div
                key="latihan"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <p className="text-[11px] text-secondary font-medium mb-3">
                  Lakukan drill latihan ini di lapangan untuk mengasah refleks taktis dan memori otot Anda secara rutin:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3.5">
                    {selectedTutorial.drills.map((drill, index) => {
                      const isThisDrillActive = activeDrill === drill;
                      return (
                        <div key={index} className="p-4 bg-primary rounded-2xl border border-theme flex flex-col gap-3">
                          <div className="flex gap-2 items-start">
                            <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <h6 className="text-xs font-bold text-primary leading-snug">{drill}</h6>
                          </div>
                          <button
                            id={`btn-start-drill-${index}`}
                            onClick={() => handleStartDrill(drill)}
                            className="text-[10px] font-bold text-blue-400 neu-button-accent/10 border border-blue-500/20 hover:neu-button-accent/20 hover:text-orange-300 py-2 px-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer w-fit transition-colors"
                          >
                            <Timer className="w-3.5 h-3.5" />
                            Mulai Latihan (60s)
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Drill Countdown Overlay */}
                  <div className="bg-primary text-primary rounded-2xl p-5 border border-theme flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {activeDrill ? (
                      <div className="space-y-4 w-full">
                        <span className="text-[10px] font-bold text-blue-500 block uppercase tracking-widest">DRILL AKTIF SEDANG BERJALAN</span>
                        <h5 className="text-xs font-medium px-4 line-clamp-1 text-slate-300">{activeDrill.split(':')[0]}</h5>
                        
                        <div className="text-4xl font-black font-mono text-primary animate-pulse">
                          {formatTime(drillTimeLeft)}
                        </div>

                        {/* Progress slider bar for drill */}
                        <div className="w-full neu-pressed h-1.5 rounded-full overflow-hidden">
                          <div className="neu-button-accent h-full rounded-full transition-all" style={{ width: `${(drillTimeLeft / 60) * 100}%` }} />
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            onClick={handleToggleDrillTimer}
                            className={`text-[10px] font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                              isDrillRunning ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                          >
                            {isDrillRunning ? 'Jeda' : 'Lanjutkan'}
                          </button>
                          <button
                            onClick={handleResetDrillTimer}
                            className="text-[10px] font-bold neu-pressed text-secondary hover:text-primary px-4 py-2 rounded-xl border border-theme transition-colors cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 py-8 text-secondary flex flex-col items-center">
                        <Compass className="w-10 h-10 text-slate-600 opacity-50" />
                        <p className="text-[11px] max-w-[200px] leading-relaxed">Klik tombol "Mulai Latihan" untuk memicu penghitung waktu latihan drill harian Anda.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tips' && (
              <motion.div
                key="tips"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {selectedTutorial.tips.map((tip, index) => (
                    <div key={index} className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-2xl flex items-start gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-xl text-purple-400 shrink-0 mt-0.5">
                        <Award className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <strong className="block text-[11px] font-bold text-purple-400 mb-1 uppercase tracking-widest">Strategi Pro #{index+1}</strong>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
