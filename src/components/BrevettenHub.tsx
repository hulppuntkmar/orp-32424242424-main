import React from "react";
import { Award, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, FileCheck, Compass, Sparkles } from "lucide-react";
import { LICENSES } from "../data";
import { License } from "../types";

export default function BrevettenHub() {
  const [selectedLicense, setSelectedLicense] = React.useState<License | null>(LICENSES[0]);

  return (
    <div className="bg-[#090d16] text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Header section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#ea580c]/10 border border-[#ea580c]/20 px-3.5 py-1.5 rounded-full text-[#ea580c] text-xs font-mono font-bold uppercase tracking-wider">
            <Award className="h-3.5 w-3.5" />
            <span>Aviation Academy Oranjestad</span>
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white uppercase leading-none">
            Vliegbrevetten <span className="text-[#ea580c] block mt-1.5">& Bevoegdheden</span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
            Behaal uw officiële vliegbrevet voor Helikopters, Sportvliegtuigen of Passagiersjets via onze erkende vliegschool op Oranjestad.
          </p>
        </div>

        {/* Minimalist Discord Ticket Banner */}
        <div className="mb-14 bg-slate-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#ea580c]" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pl-2 sm:pl-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ea580c] animate-pulse" />
                <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-wider">
                  Hoe behaalt u uw vliegbrevet?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-3xl">
                U kunt uw gewenste vliegbrevetten direct behalen door een <strong className="text-[#ea580c] font-semibold">ticket aan te maken in onze Discord server</strong>. Onze vlieginstructeurs plannen vervolgens een praktijk- en theorie-examen met u in.
              </p>
            </div>
            
            <a
              href="https://discord.gg/FACgeTSrAR" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 px-6 py-4 rounded-2xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2.5 shrink-0 shadow-lg shadow-[#ea580c]/20 hover:scale-[1.02] cursor-pointer text-decoration-none"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Maak Discord Ticket</span>
            </a>
          </div>
        </div>

        {/* Dynamic Dual-Column: Category Selector vs Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Licenses selector */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-mono text-slate-400 tracking-widest font-bold uppercase block">
                Beschikbare Categorieën
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {LICENSES.length} Categorieën
              </span>
            </div>

            {LICENSES.map((lic) => {
              const isSelected = selectedLicense?.id === lic.id;

              return (
                <div
                  key={lic.id}
                  onClick={() => setSelectedLicense(lic)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-slate-950 border-[#ea580c] shadow-xl shadow-[#ea580c]/10 translate-x-1"
                      : "bg-slate-950/40 border-white/5 hover:border-white/20 hover:bg-slate-950/60"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#ea580c] tracking-widest font-mono uppercase">
                        {lic.category}
                      </span>
                      <h4 className="font-display font-bold text-lg mt-0.5 text-white">
                        {lic.name}
                      </h4>
                    </div>
                    
                    <div className="text-right shrink-0 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5">
                      <p className="text-[9px] text-slate-400 font-mono uppercase font-medium">PRIJS</p>
                      <p className="text-white font-mono font-bold text-sm">€{lic.price.toLocaleString("nl-NL")}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed font-light">
                    {lic.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-[#ea580c]" />
                      <span>Inclusief Instructie</span>
                    </span>
                    <span className="text-[#ea580c] font-bold uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Bekijk Stappen</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detail and Action Steps Area */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            {selectedLicense ? (
              <div className="space-y-8">
                {/* Header detail */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-6 gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#ea580c] uppercase tracking-widest">
                      Geselecteerd Programma
                    </span>
                    <h2 className="font-display font-bold text-2xl text-white mt-1">
                      {selectedLicense.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                      {selectedLicense.description}
                    </p>
                  </div>
                  
                  <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 text-center sm:text-right shrink-0 min-w-[130px]">
                    <p className="text-[9.5px] text-slate-400 font-mono uppercase tracking-wider">EXAMEN & BREVET PRIJS</p>
                    <p className="text-2xl font-bold text-[#ea580c] font-mono mt-0.5">€{selectedLicense.price.toLocaleString("nl-NL")}</p>
                  </div>
                </div>

                {/* Steps to Obtain */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                      Stappenplan voor Behalen
                    </h4>
                    <span className="text-[10px] font-mono text-[#ea580c]">4 Eenvoudige Stappen</span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Step 1 */}
                    <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="max-w-md">
                        <div className="flex items-center space-x-3">
                          <span className="h-7 w-7 rounded-xl bg-[#ea580c]/10 border border-[#ea580c]/30 text-[#ea580c] flex items-center justify-center font-mono text-xs font-bold shrink-0">1</span>
                          <h5 className="font-semibold text-sm text-white">Discord Ticket Openen (Afspraak maken)</h5>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 pl-10 font-light leading-relaxed">
                          Meld u aan bij onze instructeurs door een ticket te openen op Discord om uw examen in te plannen.
                        </p>
                      </div>
                      
                      <a
                        href="https://discord.gg/FACgeTSrAR"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-950 border border-white/10 hover:border-[#ea580c] text-slate-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase shrink-0 transition-all text-center w-full sm:w-auto cursor-pointer"
                      >
                        Maak Ticket
                      </a>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5">
                      <div className="flex items-center space-x-3">
                        <span className="h-7 w-7 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">2</span>
                        <h5 className="font-semibold text-sm text-white">Theorie Uitleg</h5>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 pl-10 font-light leading-relaxed">
                        Een gecertificeerde instructeur geeft u een heldere uitleg over de nodige aerodynamica, meteorologie en veiligheidsvoorschriften.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5">
                      <div className="flex items-center space-x-3">
                        <span className="h-7 w-7 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">3</span>
                        <h5 className="font-semibold text-sm text-white">Test Vliegen (Praktijktoets)</h5>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 pl-10 font-light leading-relaxed">
                        U voert samen met de exameninstructeur een testvlucht uit om uw stuurvaardigheid en landing te demonstreren.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5">
                      <div className="flex items-center space-x-3">
                        <span className="h-7 w-7 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">4</span>
                        <h5 className="font-semibold text-sm text-white">Toetsing & Brevet Registratie</h5>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 pl-10 font-light leading-relaxed">
                        Na afloop wordt uw bevoegdheid geregistreerd in de burgerdatabase en ontvangt u uw officiële vliegbrevet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call Action Button */}
                <div className="pt-4 border-t border-white/10">
                  <a
                    href="https://discord.gg/FACgeTSrAR"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono text-xs sm:text-sm py-4 rounded-2xl uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#ea580c]/15 text-decoration-none hover:scale-[1.01] cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>Direct Examen Aanvragen via Discord</span>
                  </a>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-slate-500 py-16">
                <Award className="h-12 w-12 text-slate-700 animate-pulse mb-4" />
                <p className="text-xs font-mono">Selecteer een vliegbrevet om het stappenplan te bekijken.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

