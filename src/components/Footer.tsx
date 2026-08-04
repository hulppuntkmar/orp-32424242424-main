import React from "react";
import { ShieldAlert, Award, MessageSquare, ExternalLink } from "lucide-react";
import Logo from "./Logo";

export default function Footer({ setCurrentTab }: { setCurrentTab: (tab: string) => void }) {
  return (
    <footer className="bg-[#050811] text-slate-400 border-t border-white/5 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Info */}
          <div className="md:col-span-2 space-y-5">
            <div className="cursor-pointer inline-block" onClick={() => setCurrentTab("home")}>
              <Logo size="sm" showText={true} />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-light">
              Luchtvaart Centrum Oranjestad. Het beheercentrum voor vliegbevoegdheden en personeel in Oranjestad.
            </p>
            
            <div className="pt-1">
              <span className="font-display font-semibold italic text-slate-200 text-xs tracking-wider border-l-2 border-[#ea580c] pl-3.5 block">
                "Jouw reis begint in de lucht"
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono pt-1">
              <ShieldAlert className="h-4 w-4 text-[#ea580c]" />
              <span>Officieel Gelicenseerd Luchtvaartsysteem Oranjestad</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase">Navigatie</h4>
            <ul className="space-y-3 text-xs font-mono">
              <li>
                <button onClick={() => setCurrentTab("home")} className="hover:text-[#ea580c] transition-colors cursor-pointer text-left uppercase">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("staff")} className="text-[#ea580c] hover:underline font-bold cursor-pointer text-left uppercase">
                  Personeelsportaal (🔐)
                </button>
              </li>
            </ul>
          </div>

          {/* Discord Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase">Support & Tickets</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Heeft u vragen over lessen of vliegtoestellen? Open direct een ticket.
            </p>

            <a 
              href="https://discord.gg/FACgeTSrAR" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-[#ea580c]/10 border border-[#ea580c]/30 hover:bg-[#ea580c]/20 text-[#ea580c] text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md text-decoration-none"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Discord Support Server</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Divider & Legal */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} Luchtvaart Centrum Oranjestad. Alle rechten voorbehouden.</p>
          
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 opacity-60">
              <Award className="h-4 w-4 text-[#ea580c]" />
              <span>FAA & EASA Compliant</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>Koningin Beatrix International Airport</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

