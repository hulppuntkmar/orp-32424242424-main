import React from "react";
import { SlidersHorizontal, Check, Compass, ShoppingBag, Sparkles, CheckCircle2, ArrowLeft, Eye, Search, Filter, Gauge, Users, Shield } from "lucide-react";
import { AIRCRAFT_LIST } from "../data";
import { Aircraft, PilotLogbook, AircraftInventory } from "../types";

interface AircraftMarketplaceProps {
  logbook: PilotLogbook;
  onOrderAircraft: (aircraft: any) => void;
  inventory: AircraftInventory[];
  aircraftList: Aircraft[];
}

export default function AircraftMarketplace({ logbook, onOrderAircraft, inventory, aircraftList }: AircraftMarketplaceProps) {
  const [activeView, setActiveView] = React.useState<"grid" | "detail">("grid");
  const [selectedAircraftState, setSelectedAircraftState] = React.useState<Aircraft | null>(null);
  
  // Category filter & Search
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Custom paint options
  const [selectedColor, setSelectedColor] = React.useState({ name: "Arctic Silver", hex: "#e2e8f0" });
  const [orderCompletePopup, setOrderCompletePopup] = React.useState<any | null>(null);

  const colors = [
    { name: "Arctic Silver", hex: "#e2e8f0" },
    { name: "Aruba Orange", hex: "#ea580c" },
    { name: "Cobalt Blue", hex: "#2563eb" },
    { name: "Emerald Green", hex: "#059669" },
    { name: "Midnight Black", hex: "#0f172a" },
  ];

  const rawList = aircraftList && aircraftList.length > 0 ? aircraftList : AIRCRAFT_LIST;
  
  // Filtered aircraft list
  const currentList = rawList.filter((air) => {
    const matchesCategory = categoryFilter === "all" || air.type === categoryFilter;
    const matchesSearch = air.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          air.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          air.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentSelected = selectedAircraftState || rawList[0];

  // Selected aircraft inventory stats
  const specInventory = inventory?.find(i => i.aircraftId === currentSelected.id) || {
    aircraftId: currentSelected.id,
    stockCount: 1,
    status: "Op voorraad" as const,
    priceOverride: undefined as number | undefined
  };

  const currentBasePrice = specInventory.priceOverride || currentSelected.basePrice;
  const colorSurcharge = selectedColor.name !== "Arctic Silver" ? 15000 : 0;
  const totalPrice = currentBasePrice + colorSurcharge;

  const handleOrderSubmit = () => {
    if (specInventory.stockCount <= 0) {
      console.warn("Fout: Dit model is momenteel uitverkocht in de hangar.");
      return;
    }

    const orderData = {
      id: "ord-" + Date.now(),
      name: currentSelected.name,
      configuredColor: selectedColor.name,
      configuredAvionics: "Standaard Fabrieksuitvoering",
      totalPrice: totalPrice,
      orderDate: new Date().toLocaleDateString("nl-NL")
    };

    onOrderAircraft(orderData);
    setOrderCompletePopup(orderData);
  };

  return (
    <div className="bg-[#090d16] text-white py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#ea580c]/10 border border-[#ea580c]/20 px-3.5 py-1.5 rounded-full text-[#ea580c] text-xs font-mono font-bold uppercase tracking-wider">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Showroom & Dealership Oranjestad</span>
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight uppercase leading-none">
            Exclusieve <span className="text-[#ea580c]">Luchtvaart Catalogus</span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
            Ontdek onze hoogwaardige vloot van helikopters, sportvliegtuigen en luxe jets. Direct leverbaar in onze Hangar op Koningin Beatrix Luchthaven.
          </p>
        </div>

        {/* 1. GRID CATALOG VIEW */}
        {activeView === "grid" && (
          <div className="space-y-8">
            
            {/* Filter and Search Bar */}
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Category Filter Pills */}
              <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    categoryFilter === "all"
                      ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  Alle ({rawList.length})
                </button>
                
                <button
                  onClick={() => setCategoryFilter("helicopter")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    categoryFilter === "helicopter"
                      ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  Helikopters
                </button>
                
                <button
                  onClick={() => setCategoryFilter("small-plane")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    categoryFilter === "small-plane"
                      ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  Sportvliegtuigen
                </button>
                
                <button
                  onClick={() => setCategoryFilter("large-plane")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    categoryFilter === "large-plane"
                      ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  Passagiersjets
                </button>
              </div>

              {/* Search Field */}
              <div className="relative w-full md:w-72">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Zoek model of merk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-[#ea580c] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-sans"
                />
              </div>
            </div>

            {/* Aircraft Cards Grid */}
            {currentList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentList.map((air) => {
                  const airInv: AircraftInventory = inventory?.find(i => i.aircraftId === air.id) || {
                    aircraftId: air.id,
                    stockCount: 1,
                    status: "Op voorraad" as const,
                    priceOverride: undefined
                  };
                  const hasStock = airInv.stockCount > 0;
                  const priceToShow = airInv.priceOverride || air.basePrice;
                  const speedKmh = Math.round(air.topSpeedKnots * 1.852);

                  return (
                    <div
                      key={air.id}
                      onClick={() => {
                        setSelectedAircraftState(air);
                        setSelectedColor(colors[0]);
                        setActiveView("detail");
                      }}
                      className="group bg-slate-950/80 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-[#ea580c]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 backdrop-blur-xl"
                    >
                      {/* Aircraft Showcase Container */}
                      <div className="h-56 w-full relative flex flex-col justify-center items-center p-6 text-center select-none overflow-hidden" 
                           style={!air.imageUrl ? { background: air.imageTheme } : undefined}>
                        
                        {air.imageUrl ? (
                          <img 
                            src={air.imageUrl} 
                            alt={air.name} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer" 
                          />
                        ) : (
                          <div className="absolute inset-0 bg-radial-gradient from-slate-950/20 via-transparent pointer-events-none opacity-80" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        <div className="relative z-10 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-[#ea580c] uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-full border border-white/10 inline-block">
                            {air.manufacturer || "Oranjestad Aviation"}
                          </span>
                          <h3 className="font-display font-black text-2xl tracking-tight text-white drop-shadow-md">
                            {air.name}
                          </h3>
                        </div>

                        {/* Stock badge */}
                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9.5px] font-mono font-bold tracking-wider uppercase border z-20 ${
                          hasStock 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        }`}>
                          {hasStock ? `${airInv.stockCount} Op Voorraad` : "Uitverkocht"}
                        </span>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                          <span className="bg-[#ea580c] text-slate-950 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ea580c]/20">
                            <Eye className="h-4 w-4" />
                            <span>Configureer Toestel</span>
                          </span>
                        </div>
                      </div>

                      {/* Specs and Pricing */}
                      <div className="p-6 space-y-5">
                        <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-2">
                          {air.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono text-slate-400">
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                            <span className="block text-slate-500 text-[9px] uppercase font-bold tracking-wider">MAX SNELHEID</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{speedKmh} km/h</span>
                          </div>
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                            <span className="block text-slate-500 text-[9px] uppercase font-bold tracking-wider">ZITPLAATSEN</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{air.capacity} Personen</span>
                          </div>
                        </div>

                        {/* Price footer */}
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-[9.5px] text-slate-500 font-mono uppercase tracking-wider">SHOWROOM PRIJS</p>
                            <p className="text-xl font-bold font-mono text-white mt-0.5">€{priceToShow.toLocaleString("nl-NL")}</p>
                          </div>
                          
                          <span className="text-xs text-[#ea580c] font-mono font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            <span>Bekijk</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-12 text-center text-slate-500 font-mono text-xs">
                Geen toestellen gevonden die voldoen aan de zoekcriteria.
              </div>
            )}
          </div>
        )}

        {/* 2. SPECIFIC DETAIL & CUSTOMIZER VIEW */}
        {activeView === "detail" && (
          <div className="space-y-8 animate-fade-in">
            {/* Back button */}
            <div>
              <button
                onClick={() => setActiveView("grid")}
                className="inline-flex items-center gap-2 bg-slate-950 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <ArrowLeft className="h-4 w-4 text-[#ea580c]" />
                <span>Terug naar Toestellen Overzicht</span>
              </button>
            </div>

            {/* Customizer stage layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT: Showcase Display (7 cols) */}
              <div className="lg:col-span-7 bg-slate-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shadow-2xl">
                
                <div className="h-72 sm:h-96 w-full rounded-2xl relative border border-white/10 overflow-hidden flex flex-col justify-center items-center" 
                     style={!currentSelected.imageUrl ? { background: currentSelected.imageTheme } : undefined}>
                  
                  {currentSelected.imageUrl ? (
                    <img 
                      src={currentSelected.imageUrl} 
                      alt={currentSelected.name} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="absolute top-4 left-4 font-mono text-[9px] bg-slate-950/80 px-3 py-1 rounded-full text-slate-300 flex items-center gap-2 border border-white/10 z-10">
                      <Compass className="h-3.5 w-3.5 text-[#ea580c] animate-spin" />
                      <span>Luchtvaart Centrum Oranjestad</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Central Text Badge */}
                  <div className="text-center z-20 text-white p-6 max-w-md relative">
                    <span className="text-[10px] font-mono font-bold text-[#ea580c] uppercase tracking-widest bg-slate-950/80 px-3 py-1 rounded-full border border-white/10 inline-block mb-2">
                      {currentSelected.manufacturer || "Premium Model"}
                    </span>
                    <h3 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white drop-shadow-lg">
                      {currentSelected.name}
                    </h3>
                    
                    {/* Active Paint indicator */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono">
                      <span className="text-slate-400">Lak:</span>
                      <span className="h-3.5 w-3.5 rounded-full border border-white/40 shadow" style={{ backgroundColor: selectedColor.hex }}></span>
                      <span className="font-bold text-white">{selectedColor.name}</span>
                    </div>
                  </div>

                  {/* Bottom bar specs */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 p-3.5 rounded-xl border border-white/10 text-[10.5px] font-mono grid grid-cols-2 gap-4 text-center text-slate-400 z-20">
                    <div>
                      <span className="block text-slate-500 text-[8.5px] uppercase font-bold">MAX SNELHEID</span>
                      <span className="text-white font-bold text-xs">{Math.round(currentSelected.topSpeedKnots * 1.852)} km/h</span>
                    </div>
                    <div className="border-l border-white/10">
                      <span className="block text-slate-500 text-[8.5px] uppercase font-bold">CAPACITEIT</span>
                      <span className="text-white font-bold text-xs">{currentSelected.capacity} personen</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-display font-bold text-lg text-white">Specificaties & Beschrijving</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">{currentSelected.description}</p>
                </div>
              </div>

              {/* RIGHT: Configurator panel (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl shadow-2xl">
                <div>
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2 uppercase font-mono tracking-wider mb-6 pb-4 border-b border-white/10">
                    <SlidersHorizontal className="h-4.5 w-4.5 text-[#ea580c]" />
                    <span>Opties & Bestellen</span>
                  </h3>

                  {/* Paint selection */}
                  <div className="space-y-5">
                    <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-4">
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                          Exterieur Lakkleur
                        </label>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 leading-relaxed">
                          Arctic Silver is de standaard kleur. Een aangepaste lakkleur kost eenmalig €15.000 extra.
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {colors.map((c) => {
                          const isSelected = selectedColor.name === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => setSelectedColor(c)}
                              className={`h-10 w-10 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center ${
                                isSelected ? "border-[#ea580c] scale-110 shadow-lg shadow-[#ea580c]/20" : "border-white/20 hover:border-white/50"
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={`${c.name} ${c.name === "Arctic Silver" ? "(Standaard)" : "(+ €15.000)"}`}
                            >
                              {isSelected && (
                                <Check className="h-4 w-4 text-slate-950 font-extrabold" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-white/5 text-xs font-mono text-slate-400 flex justify-between">
                        <span>Gekozen kleur:</span>
                        <span className="text-white font-bold">{selectedColor.name} {selectedColor.name !== "Arctic Silver" && "(+ €15.000)"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price breakdown and order button */}
                <div className="border-t border-white/10 pt-6 space-y-4 mt-6">
                  <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 font-mono text-xs text-slate-400 space-y-2.5">
                    <div className="flex justify-between">
                      <span>Status Hangar:</span>
                      <span className={`font-bold ${specInventory.stockCount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {specInventory.stockCount > 0 ? `${specInventory.stockCount} stuks op voorraad` : "UITVERKOCHT"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Basisprijs:</span>
                      <span className="text-white">€{currentBasePrice.toLocaleString("nl-NL")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custom Lak Surcharge:</span>
                      <span className={colorSurcharge > 0 ? "text-[#ea580c] font-bold" : "text-slate-500"}>
                        {colorSurcharge > 0 ? `+ €${colorSurcharge.toLocaleString("nl-NL")}` : "Inbegrepen"}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-bold text-white">
                      <span>Totaalbedrag:</span>
                      <span className="text-[#ea580c] text-lg font-black">€{totalPrice.toLocaleString("nl-NL")}</span>
                    </div>
                  </div>

                  {specInventory.stockCount > 0 ? (
                    <button
                      onClick={handleOrderSubmit}
                      className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono text-xs sm:text-sm py-4 rounded-2xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ea580c]/20 cursor-pointer"
                    >
                      <ShoppingBag className="h-4.5 w-4.5" />
                      <span>Bestelling Plaatsen</span>
                    </button>
                  ) : (
                    <div className="w-full bg-slate-900 border border-white/10 text-slate-500 font-mono text-center text-xs py-4 rounded-2xl uppercase tracking-wider font-semibold">
                      Tijdelijk niet leverbaar in hangar
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registered Fleet/Garage */}
        {logbook.ownedAircraft && logbook.ownedAircraft.length > 0 && (
          <div className="mt-16 bg-slate-950/80 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl">
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[#ea580c]" />
              <span>Uw Gestaalde Vloot</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-light">Geregistreerde privé-vliegtuigen en helikopters in uw bezit:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logbook.ownedAircraft.map((own) => (
                <div key={own.id} className="bg-slate-900/80 border border-white/5 p-5 rounded-2xl flex flex-col justify-between font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>ID: {own.id.substring(4, 10).toUpperCase()}</span>
                      <span>{own.orderDate}</span>
                    </div>
                    <h4 className="font-display font-bold text-base text-white mt-2">{own.name}</h4>
                    <p className="text-[11px] text-slate-400 font-light mt-1.5 leading-relaxed">
                      Lakkleur: <strong className="text-slate-200">{own.configuredColor}</strong><br />
                      Uitvoering: <strong className="text-slate-200">{own.configuredAvionics ? "Standaard Fabrieksuitvoering" : "Standaard"}</strong>
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Waarde:</span>
                    <strong className="text-[#ea580c] font-bold">€{own.totalPrice.toLocaleString("nl-NL")}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success order popover modal overlay */}
      {orderCompletePopup && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 max-w-sm w-full rounded-3xl p-6 text-center shadow-2xl relative font-sans animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <h3 className="font-display font-bold text-xl text-white uppercase">Bestelling Ontvangen!</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed font-light">
              Uw bestelling voor de <strong className="text-white">{orderCompletePopup.name}</strong> ({orderCompletePopup.configuredColor}) is succesvol geregistreerd onder uw naam.
            </p>

            <div className="bg-slate-950/80 rounded-2xl p-4 my-4 font-mono text-[11px] text-left text-slate-400 space-y-1.5 border border-white/5">
              <div>Model: <strong className="text-slate-200">{orderCompletePopup.name}</strong></div>
              <div>Exterieur: <strong className="text-slate-200">{orderCompletePopup.configuredColor}</strong></div>
              <div>Aflevering: <strong className="text-slate-200">Koningin Beatrix Luchthaven</strong></div>
              <div className="border-t border-white/10 pt-2 text-xs text-[#ea580c] font-bold font-mono">
                Totaalbedrag: €{orderCompletePopup.totalPrice.toLocaleString("nl-NL")}
              </div>
            </div>

            <button
              onClick={() => {
                setOrderCompletePopup(null);
                setActiveView("grid");
              }}
              className="w-full bg-[#ea580c] text-slate-950 font-bold font-mono text-xs py-3 rounded-xl transition-all cursor-pointer hover:bg-[#ea580c]/90 uppercase tracking-wider"
            >
              Terug naar Showroom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

