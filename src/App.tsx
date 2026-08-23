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
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col justify-between">
      {/* Dynamic Navigation */}
      <Navigation 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      {/* Main Dynamic Workspace Area */}
      <main className="flex-grow">
        {transactionSuccess && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl flex items-center space-x-4 animate-fade-in text-emerald-400 backdrop-blur-xl">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
              <div>
                <h4 className="font-bold text-sm font-display uppercase tracking-wider">Betaling Geaccepteerd</h4>
                <p className="text-xs text-slate-300 mt-0.5 font-light">{transactionSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {currentTab === "home" && (
          <div className="animate-fade-in">
            {/* Elegant Clean Hero Section */}
            <header className="relative bg-[#090d16] border-b border-white/5 overflow-hidden py-16 sm:py-24">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ea580c]/15 via-transparent to-transparent pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-[#ea580c]/10 border border-[#ea580c]/20 px-3.5 py-1.5 rounded-full text-[#ea580c] text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Luchtvaart Centrum Oranjestad</span>
                  </div>
                  
                  <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-none text-white uppercase">
                    Jouw reis <span className="text-[#ea580c] block mt-2">Begint in de lucht.</span>
                  </h1>
                  
                  <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
                    Het centrale beheer- en personeelsportaal van Luchtvaart Centrum Oranjestad. Geef vliegbrevetten uit, beheer werknemerprestaties en bekijk de financiële resultaten.
                  </p>
                  
                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={() => setCurrentTab("staff")}
                      className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono text-center tracking-wider uppercase text-xs sm:text-sm px-8 py-4 rounded-2xl transition-all cursor-pointer shadow-lg shadow-[#ea580c]/20 hover:scale-[1.02]"
                    >
                      Naar Personeelsportaal (🔐)
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Aviation Academy Pillars section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* Pillar 1: Brevetten Beheer */}
                <div className="bg-slate-950/70 p-8 rounded-3xl border border-white/10 hover:border-[#ea580c]/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl shadow-xl space-y-4">
                  <div className="p-3.5 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-2xl h-12 w-12 flex items-center justify-center text-[#ea580c] font-bold">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white">Brevetten Registratie</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Schrijf direct bevoegdheden en vliegdiploma's uit voor geslaagde leerlingen in Oranjestad en beheer het registratieregister.
                  </p>
                  <button onClick={() => setCurrentTab("staff")} className="pt-2 text-xs font-mono font-bold text-[#ea580c] flex items-center gap-2 hover:underline cursor-pointer uppercase tracking-wider">
                    <span>Brevet Registreren</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Pillar 2: Financiën & Prestaties */}
                <div className="bg-slate-950/70 p-8 rounded-3xl border border-white/10 hover:border-[#ea580c]/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl shadow-xl space-y-4">
                  <div className="p-3.5 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-2xl h-12 w-12 flex items-center justify-center text-[#ea580c] font-bold">
                    <Plane className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white">Financiën & Bonussen</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    Bekijk wie de meeste brevetten uitschrijft, bekijk het netto winstpotje en ken per brevet bonussen toe aan uw top instructeurs.
                  </p>
                  <button onClick={() => setCurrentTab("staff")} className="pt-2 text-xs font-mono font-bold text-[#ea580c] flex items-center gap-2 hover:underline cursor-pointer uppercase tracking-wider">
                    <span>Financiën Openen</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* Personeelsportaal & Administratiemodule */}
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
