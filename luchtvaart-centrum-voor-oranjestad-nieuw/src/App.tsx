import React from "react";
import { 
  Plane, Compass, Wind, Award, Clock, ArrowRight, Gauge, 
  MapPin, CheckCircle2, ShieldAlert, BookOpen, AlertCircle, Plus, Sparkles 
} from "lucide-react";

import { PilotLogbook, IssuedLicense, AircraftInventory, Aircraft } from "./types";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import BrevettenHub from "./components/BrevettenHub";
import AircraftMarketplace from "./components/AircraftMarketplace";
import StaffPortal from "./components/StaffPortal";
import { DEFAULT_ISSUED_LICENSES, DEFAULT_INVENTORY, AIRCRAFT_LIST } from "./data";
import LSIAFuturisticMap from "./components/LSIAFuturisticMap";
import { ensureUniqueLicenseId } from "./lib/licenseId";

const STORAGE_KEY = "@luchtvaart_oranjestad_logbook";
const ENROLL_KEY = "@luchtvaart_oranjestad_enrolled";
const LICENSES_KEY = "@luchtvaart_oranjestad_issued_licenses";
const INVENTORY_KEY = "@luchtvaart_oranjestad_inventory";
const AIRCRAFT_LIST_KEY = "@luchtvaart_oranjestad_aircraft_list";

const DEFAULT_LOGBOOK: PilotLogbook = {
  totalHours: 12,
  helicopterHours: 4,
  smallPlaneHours: 8,
  largePlaneHours: 0,
  completedQuizzes: [],
  completedSimulators: [],
  unlockedLicenses: [],
  ownedAircraft: []
};

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<string>("home");
  const [logbook, setLogbook] = React.useState<PilotLogbook>(DEFAULT_LOGBOOK);
  const [enrolledCourses, setEnrolledCourses] = React.useState<string[]>([]);
  
  // Direct and manager control states
  const [issuedLicenses, setIssuedLicenses] = React.useState<IssuedLicense[]>([]);
  const [inventory, setInventory] = React.useState<AircraftInventory[]>([]);
  const [aircraftList, setAircraftList] = React.useState<Aircraft[]>([]);

  // Success notifications
  const [transactionSuccess, setTransactionSuccess] = React.useState<string | null>(null);

  // Load state from local storage on mount (initial cache)
  React.useEffect(() => {
    try {
      const storedLogbook = localStorage.getItem(STORAGE_KEY);
      if (storedLogbook) {
        setLogbook(JSON.parse(storedLogbook));
      }
      const storedCourses = localStorage.getItem(ENROLL_KEY);
      if (storedCourses) {
        setEnrolledCourses(JSON.parse(storedCourses));
      }
      
      const storedLicenses = localStorage.getItem(LICENSES_KEY);
      if (storedLicenses) {
        try {
          const parsed = JSON.parse(storedLicenses);
          if (Array.isArray(parsed)) {
            setIssuedLicenses(parsed);
          }
        } catch (e) {}
      }

      const storedInventory = localStorage.getItem(INVENTORY_KEY);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      } else {
        setInventory(DEFAULT_INVENTORY);
      }

      const storedAircraft = localStorage.getItem(AIRCRAFT_LIST_KEY);
      if (storedAircraft) {
        setAircraftList(JSON.parse(storedAircraft));
      } else {
        setAircraftList(AIRCRAFT_LIST);
      }
    } catch (e) {
      console.error("Local storage fail:", e);
    }
  }, []);

  // Save logbook state Changes
  const saveLogbook = (updated: PilotLogbook) => {
    setLogbook(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving logbook:", e);
    }
  };

  const handleUpdateInventory = (updatedInv: AircraftInventory[]) => {
    setInventory(updatedInv);
    try {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(updatedInv));
      fetch("/api/shared-data/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventory: updatedInv })
      }).catch(() => {});
    } catch (e) {
      console.error("Error saving inventory:", e);
    }
  };

  const handleUpdateAircraftList = (updatedList: Aircraft[]) => {
    setAircraftList(updatedList);
    try {
      localStorage.setItem(AIRCRAFT_LIST_KEY, JSON.stringify(updatedList));
      fetch("/api/shared-data/aircraft-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aircraftList: updatedList })
      }).catch(() => {});
    } catch (e) {
      console.error("Error saving aircraft list:", e);
    }
  };

  // Live multi-user synchronization with server DB (Server is authoritative)
  const syncWithServer = async () => {
    try {
      const res = await fetch("/api/shared-data");
      if (res.ok) {
        const data = await res.json();
        if (data.issuedLicenses && Array.isArray(data.issuedLicenses)) {
          setIssuedLicenses(data.issuedLicenses);
          localStorage.setItem(LICENSES_KEY, JSON.stringify(data.issuedLicenses));
        }
        if (data.inventory && Array.isArray(data.inventory) && data.inventory.length > 0) {
          setInventory(data.inventory);
          localStorage.setItem(INVENTORY_KEY, JSON.stringify(data.inventory));
        }
        if (data.aircraftList && Array.isArray(data.aircraftList) && data.aircraftList.length > 0) {
          setAircraftList(data.aircraftList);
          localStorage.setItem(AIRCRAFT_LIST_KEY, JSON.stringify(data.aircraftList));
        }
      }
    } catch (e) {
      // Keep working from local state if the server is unavailable.
    }
  };

  React.useEffect(() => {
    syncWithServer();
    const interval = setInterval(syncWithServer, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddLicense = async (newLic: IssuedLicense) => {
    const safeLic: IssuedLicense = {
      ...newLic,
      id: ensureUniqueLicenseId(newLic.id, issuedLicenses),
      updatedAt: Date.now()
    };

    setIssuedLicenses(prev => {
      const next = [safeLic, ...prev];
      localStorage.setItem(LICENSES_KEY, JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch("/api/shared-data/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeLic)
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.db?.issuedLicenses && Array.isArray(data.db.issuedLicenses)) {
          setIssuedLicenses(data.db.issuedLicenses as IssuedLicense[]);
          localStorage.setItem(LICENSES_KEY, JSON.stringify(data.db.issuedLicenses));
        }
      } else {
        console.error("Failed to save license to server", res.statusText);
      }
    } catch (e) {
      console.error("Error saving licenses:", e);
    }
  };

  const handleRemoveLicense = async (licId: string) => {
    setIssuedLicenses((prev) => {
      const next = prev.filter(l => l.id !== licId);
      localStorage.setItem(LICENSES_KEY, JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch(`/api/shared-data/license/${licId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.db?.issuedLicenses && Array.isArray(data.db.issuedLicenses)) {
          setIssuedLicenses(data.db.issuedLicenses as IssuedLicense[]);
          localStorage.setItem(LICENSES_KEY, JSON.stringify(data.db.issuedLicenses));
        }
      } else {
        console.error("Failed to delete license on server", res.statusText);
      }
    } catch (e) {
      console.error("Error deleting license:", e);
    }
  };

  const handleUpdateLicense = async (updatedLic: IssuedLicense) => {
    const safeLic = { ...updatedLic, updatedAt: Date.now() };

    setIssuedLicenses((prev) => {
      const next = prev.map(l => l.id === safeLic.id ? safeLic : l);
      localStorage.setItem(LICENSES_KEY, JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch(`/api/shared-data/license/${safeLic.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeLic)
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.db?.issuedLicenses && Array.isArray(data.db.issuedLicenses)) {
          setIssuedLicenses(data.db.issuedLicenses as IssuedLicense[]);
          localStorage.setItem(LICENSES_KEY, JSON.stringify(data.db.issuedLicenses));
        }
      } else {
        console.error("Failed to update license on server", res.statusText);
      }
    } catch (e) {
      console.error("Error updating license:", e);
    }
  };

  const handlePayTaxes = async () => {
    setIssuedLicenses((prev) => {
      const next = prev.map(l => ({ ...l, taxPaid: true }));
      localStorage.setItem(LICENSES_KEY, JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch("/api/shared-data/pay-taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.db?.issuedLicenses && Array.isArray(data.db.issuedLicenses)) {
          setIssuedLicenses(data.db.issuedLicenses as IssuedLicense[]);
          localStorage.setItem(LICENSES_KEY, JSON.stringify(data.db.issuedLicenses));
        }
        return data;
      }
    } catch (e) {
      console.error("Error paying taxes on server:", e);
    }
  };

  const handleBatchUpdateLicenses = async (licenses: IssuedLicense[]) => {
    try {
      const res = await fetch("/api/shared-data/licenses/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenses })
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.db?.issuedLicenses && Array.isArray(data.db.issuedLicenses)) {
          setIssuedLicenses(data.db.issuedLicenses as IssuedLicense[]);
          localStorage.setItem(LICENSES_KEY, JSON.stringify(data.db.issuedLicenses));
        }
      }
    } catch (e) {
      console.error("Error batch updating licenses:", e);
    }
  };

  // State mutators
  const handleBuyLicense = (licenseId: string, price: number) => {
    if (logbook.unlockedLicenses.includes(licenseId)) return;
    
    const updated = {
      ...logbook,
      unlockedLicenses: [...logbook.unlockedLicenses, licenseId]
    };
    saveLogbook(updated);
    
    setTransactionSuccess(`Inschrijving voldaan! U bent nu officieel ingeschreven voor het ${
      licenseId === "helicopter" ? "Helikopter brevet" : licenseId === "small-plane" ? "Vliegtuig Klein brevet" : "Vliegtuig Groot brevet"
    } vliegprogramma.`);
    
    // Auto-scroll to top to see notification
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    setTimeout(() => {
      setTransactionSuccess(null);
    }, 6000);
  };

  const handleEnrollCourse = (courseId: string) => {
    if (enrolledCourses.includes(courseId)) return;
    const updated = [...enrolledCourses, courseId];
    setEnrolledCourses(updated);
    try {
      localStorage.setItem(ENROLL_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving courses:", e);
    }
  };

  const handleOrderAircraft = (aircraftOrder: any) => {
    const updated = {
      ...logbook,
      ownedAircraft: [aircraftOrder, ...(logbook.ownedAircraft || [])]
    };
    saveLogbook(updated);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between">
      {/* Dynamic Navigation */}
      <Navigation 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      {/* Main Dynamic Workspace Area */}
      <main className="flex-grow">
        {transactionSuccess && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-5 rounded-2xl flex items-center space-x-4 animate-fade-in text-emerald-400">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Betaling Geaccepteerd</h4>
                <p className="text-xs text-slate-300 mt-1">{transactionSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {currentTab === "home" && (
          <div>
            {/* Elegant Hero Section */}
            <header className="relative bg-slate-950/70 border-b border-slate-900 overflow-hidden py-24 sm:py-32">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-90"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Hero brand texts (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-[#ea580c]/10 border border-[#ea580c]/15 px-3.5 py-1.5 rounded-full text-[#ea580c] text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Luchtvaartschool & Vliegtuigverkoop</span>
                  </div>
                  
                  <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-none text-white uppercase">
                    Jouw reis <span className="text-[#ea580c] block mt-2">Begint in de lucht.</span>
                  </h1>
                  
                  <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-xl font-light">
                    Ontdek de ultieme vrijheid van het vliegen in het Caribisch gebied. Haal jouw officiële vliegbrevet, train in state-of-the-art toestellen of koop jouw droomvliegtuig bij de meest vertrouwde vliegschool van Oranjestad.
                  </p>
                  
                  <div className="pt-2 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={() => setCurrentTab("brevetten")}
                      className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono text-center tracking-wider uppercase text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#ea580c]/20 hover:scale-[1.02]"
                    >
                      Bekijk Vliegbrevetten
                    </button>
                    
                    <button
                      onClick={() => setCurrentTab("marketplace")}
                      className="bg-slate-800/80 hover:bg-slate-800 text-white font-medium font-mono text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all border border-slate-700/60 hover:border-slate-600 cursor-pointer"
                    >
                      Vliegtuigen Kopen
                    </button>
                  </div>
                </div>

                {/* Interactive Radar Status widget on the Right (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">Live Luchthaven Status</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">TNCA / AUA</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/50">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Actieve Wind</div>
                        <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5 font-mono">
                          <Wind className="h-4 w-4 text-[#ea580c]" />
                          <span>090° / 15 KTS</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-1 font-mono">Ideale Vliegcondities</div>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/50">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Zichtbaarheid</div>
                        <div className="text-lg font-bold text-white mt-1 font-mono">
                          <span>10+ KM (CAVOK)</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">Onbewolkt / Tropisch</div>
                      </div>
                    </div>

                    {/* Operational Highlights */}
                    <div className="bg-gradient-to-br from-[#ea580c]/10 to-transparent p-4 rounded-2xl border border-[#ea580c]/20 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white font-mono">Klaar om te vliegen?</div>
                        <div className="text-[11px] text-slate-400 font-light">Theorie-examens en simulatorsessies direct beschikbaar.</div>
                      </div>
                      <button 
                        onClick={() => setCurrentTab("brevetten")}
                        className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold p-2.5 rounded-xl cursor-pointer transition-transform hover:scale-105 shrink-0 ml-3"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </header>

            {/* Aviation Academy Pillars section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">Waarom Luchtvaart Centrum Oranjestad?</h2>
                <p className="text-slate-400 text-sm font-light">De hoogste kwaliteitsstandaarden voor opleidingen, examens en vlootbeheer in het Caribisch gebied.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Pillar 1 */}
                <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800/80 hover:border-[#ea580c]/40 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="p-3.5 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-2xl h-12 w-12 flex items-center justify-center text-[#ea580c] font-bold group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mt-6 mb-2">Officiële Vliegbrevetten</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Van lichte eenmotorige sportvliegtuigen tot zware commerciële jets en wendbare helikopters. Volledig erkende brevettenregistratie.
                  </p>
                  <button onClick={() => setCurrentTab("brevetten")} className="mt-5 text-xs font-mono font-bold text-[#ea580c] flex items-center gap-1 hover:underline cursor-pointer uppercase">
                    <span>Bekijk Brevetten</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Pillar 2 */}
                <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800/80 hover:border-[#ea580c]/40 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="p-3.5 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-2xl h-12 w-12 flex items-center justify-center text-[#ea580c] font-bold group-hover:scale-110 transition-transform">
                    <Gauge className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mt-6 mb-2">Interactieve Flight Simulator</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Oefen real-time radiocommunicatie met de luchtverkeersleiding van Oranjestad (ATC). Beheers noodlandingen en naderingen.
                  </p>
                  <button onClick={() => setCurrentTab("brevetten")} className="mt-5 text-xs font-mono font-bold text-[#ea580c] flex items-center gap-1 hover:underline cursor-pointer uppercase">
                    <span>Start de Simulator</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Pillar 3 */}
                <div className="bg-slate-950/40 p-8 rounded-3xl border border-slate-800/80 hover:border-[#ea580c]/40 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="p-3.5 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-2xl h-12 w-12 flex items-center justify-center text-[#ea580c] font-bold group-hover:scale-110 transition-transform">
                    <Plane className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mt-6 mb-2">Exclusieve Vliegtuigverkoop</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Ontdek uw ultieme vrijheid! Bekijk onze exclusieve catalogus met perfect onderhouden helikopters, premium propellervliegtuigen en snelle privéjets. Direct klaar om de lucht mee te veroveren.
                  </p>
                  <button onClick={() => setCurrentTab("marketplace")} className="mt-5 text-xs font-mono font-bold text-[#ea580c] flex items-center gap-1 hover:underline cursor-pointer uppercase">
                    <span>Bekijk de Catalogus</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) }

        {/* Tab 2: Vliegbrevetten portfolio & purchasing */}
        {currentTab === "brevetten" && (
          <BrevettenHub />
        )}

        {/* Tab 3: Airplanes/Helicopters Marketplace */}
        {currentTab === "marketplace" && (
          <AircraftMarketplace 
            logbook={logbook}
            onOrderAircraft={handleOrderAircraft}
            inventory={inventory}
            aircraftList={aircraftList}
          />
        )}

        {/* Tab 6: FiveM Staff & Manager portal */}
        {currentTab === "staff" && (
          <StaffPortal 
            issuedLicenses={issuedLicenses}
            onAddLicense={handleAddLicense}
            onRemoveLicense={handleRemoveLicense}
            onUpdateLicense={handleUpdateLicense}
            onPayTaxes={handlePayTaxes}
            onBatchUpdateLicenses={handleBatchUpdateLicenses}
            inventory={inventory}
            onUpdateInventory={handleUpdateInventory}
            aircraftList={aircraftList}
            onUpdateAircraftList={handleUpdateAircraftList}
          />
        )}
      </main>

      {/* Corporate Aviation Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
