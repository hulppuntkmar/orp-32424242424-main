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
  
  const [issuedLicenses, setIssuedLicenses] = React.useState<IssuedLicense[]>([]);
  const [inventory, setInventory] = React.useState<AircraftInventory[]>([]);
  const [aircraftList, setAircraftList] = React.useState<Aircraft[]>([]);
  const [transactionSuccess, setTransactionSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const storedLogbook = localStorage.getItem(STORAGE_KEY);
      if (storedLogbook) setLogbook(JSON.parse(storedLogbook));

      const storedCourses = localStorage.getItem(ENROLL_KEY);
      if (storedCourses) setEnrolledCourses(JSON.parse(storedCourses));
      
      const storedLicenses = localStorage.getItem(LICENSES_KEY);
      if (storedLicenses) {
        setIssuedLicenses(JSON.parse(storedLicenses));
      } else {
        setIssuedLicenses(DEFAULT_ISSUED_LICENSES);
        localStorage.setItem(LICENSES_KEY, JSON.stringify(DEFAULT_ISSUED_LICENSES));
      }

      const storedInventory = localStorage.getItem(INVENTORY_KEY);
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      } else {
        setInventory(DEFAULT_INVENTORY);
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(DEFAULT_INVENTORY));
      }

      const storedAircraft = localStorage.getItem(AIRCRAFT_LIST_KEY);
      if (storedAircraft) {
        setAircraftList(JSON.parse(storedAircraft));
      } else {
        setAircraftList(AIRCRAFT_LIST);
        localStorage.setItem(AIRCRAFT_LIST_KEY, JSON.stringify(AIRCRAFT_LIST));
      }
    } catch (e) {
      console.error("Local storage fail:", e);
    }
  }, []);

  const saveLogbook = (updated: PilotLogbook) => {
    setLogbook(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (e) {}
  };

  const handleUpdateInventory = (updatedInv: AircraftInventory[]) => {
    setInventory(updatedInv);
    try { localStorage.setItem(INVENTORY_KEY, JSON.stringify(updatedInv)); } catch (e) {}
  };

  const handleUpdateAircraftList = (updatedList: Aircraft[]) => {
    setAircraftList(updatedList);
    try { localStorage.setItem(AIRCRAFT_LIST_KEY, JSON.stringify(updatedList)); } catch (e) {}
  };

  const handleAddLicense = (newLic: IssuedLicense) => {
    const updatedLics = [newLic, ...issuedLicenses];
    setIssuedLicenses(updatedLics);
    try { localStorage.setItem(LICENSES_KEY, JSON.stringify(updatedLics)); } catch (e) {}
  };

  const handleRemoveLicense = (licId: string) => {
    const updatedLics = issuedLicenses.filter(l => l.id !== licId);
    setIssuedLicenses(updatedLics);
    try { localStorage.setItem(LICENSES_KEY, JSON.stringify(updatedLics)); } catch (e) {}
  };

  const handleUpdateLicense = (updatedLic: any) => {
    const updatedLics = issuedLicenses.map(l => l.id === updatedLic.id ? { ...l, ...updatedLic } : l);
    setIssuedLicenses(updatedLics);
    try { localStorage.setItem(LICENSES_KEY, JSON.stringify(updatedLics)); } catch (e) {}
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
      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-grow">
        {transactionSuccess && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-5 rounded-2xl flex items-center space-x-4 text-emerald-400">
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
            <header className="relative bg-slate-950/70 border-b border-slate-900 overflow-hidden py-24 sm:py-32">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-[#ea580c]/10 border border-[#ea580c]/15 px-3.5 py-1.5 rounded-full text-[#ea580c] text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Luchtvaartschool & Vliegtuigverkoop</span>
                  </div>
                  <h1 className="font-display font-black text-4xl sm:text-6xl tracking-tight leading-none text-white uppercase">
                    Jouw reis <span className="text-[#ea580c] block mt-2">Begint in de lucht.</span>
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-2xl font-light">
                    Behaal uw vliegbrevet voor Helikopter of Vliegtuig door simpelweg een ticket te maken in onze Discord.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setCurrentTab("brevetten")}
                      className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono text-center tracking-wider uppercase text-xs sm:text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#ea580c]/15"
                    >
                      Behaal Vliegbrevet
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <LSIAFuturisticMap />
                </div>
              </div>
            </header>
          </div>
        )}

        {currentTab === "brevetten" && <BrevettenHub />}

        {currentTab === "marketplace" && (
          <AircraftMarketplace 
            logbook={logbook}
            onOrderAircraft={handleOrderAircraft}
            inventory={inventory}
            aircraftList={aircraftList}
          />
        )}

        {currentTab === "staff" && (
          <StaffPortal 
            licenses={issuedLicenses}
            issuedLicenses={issuedLicenses}
            onAddLicense={handleAddLicense}
            onRemoveLicense={handleRemoveLicense}
            onDeleteLicense={handleRemoveLicense}
            onUpdateLicense={handleUpdateLicense}
            inventory={inventory}
            onUpdateInventory={handleUpdateInventory}
            aircraftList={aircraftList}
            onUpdateAircraftList={handleUpdateAircraftList}
          />
        )}
      </main>

      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}