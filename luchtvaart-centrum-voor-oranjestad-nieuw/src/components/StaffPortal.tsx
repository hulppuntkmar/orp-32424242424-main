import React from "react";
import { 
  Lock, User, ShieldCheck, FileSpreadsheet, PlusCircle, Trash2, 
  Settings, UserCheck, HelpCircle, AlertCircle, FileText, CheckCircle, Plus, Image, Users, HelpCircle as HelpIcon, Key, Eye, EyeOff,
  Coins, TrendingUp, Percent, Award, Calendar, Edit2, Check, X
} from "lucide-react";
import { IssuedLicense, AircraftInventory, Aircraft, StaffUser } from "../types";

interface StaffPortalProps {
  issuedLicenses: IssuedLicense[];
  onAddLicense: (lic: IssuedLicense) => void;
  onRemoveLicense: (id: string) => void;
  onUpdateLicense: (lic: IssuedLicense) => void;
  inventory: AircraftInventory[];
  onUpdateInventory: (updated: AircraftInventory[]) => void;
  aircraftList: Aircraft[];
  onUpdateAircraftList: (updated: Aircraft[]) => void;
}

// Default staff accounts
const DEFAULT_STAFF_ACCOUNTS: StaffUser[] = [
  { id: "u-1", username: "MikeL", passwordHash: "MikeLapose_eigenaar99!", role: "owner", fullname: "Mike Lapose" }
];

const STAFF_ACCOUNTS_KEY = "@luchtvaart_oranjestad_staff_accounts";

export default function StaffPortal({ 
  issuedLicenses, 
  onAddLicense, 
  onRemoveLicense,
  onUpdateLicense,
  inventory, 
  onUpdateInventory,
  aircraftList,
  onUpdateAircraftList
}: StaffPortalProps) {
  
  // Accounts management
  const [staffAccounts, setStaffAccounts] = React.useState<StaffUser[]>([]);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"owner" | "manager" | "medewerker" | null>(null);
  const [fullname, setFullname] = React.useState("");
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // Active view in portal
  const [activeTab, setActiveTab] = React.useState<"registry" | "issue" | "administration" | "users">("registry");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");

  // License / Diploma form states
  const [newCitName, setNewCitName] = React.useState("");
  const [newCitId, setNewCitId] = React.useState("BSN-");
  const [newLicType, setNewLicType] = React.useState<"helicopter" | "small-plane" | "large-plane">("small-plane");
  const [newRemarks, setNewRemarks] = React.useState("");
  const [issuedByTeacher, setIssuedByTeacher] = React.useState("");
  const [formSuccess, setFormSuccess] = React.useState(false);

  // Editing state for diploma table
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ citizenName: "", citizenId: "" });

  // Dynamic plane parameters are retired to focus purely on the Administration
  const [userCreatedMessage, setUserCreatedMessage] = React.useState<string | null>(null);

  // Add user form states (owner feature)
  const [newUsername, setNewUsername] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newFullname, setNewFullname] = React.useState("");
  const [newUserRole, setNewUserRole] = React.useState<"manager" | "medewerker">("medewerker");

  // Modern states to bypass standard browser alert/confirm iframe blockers
  const [deleteConfirmationUser, setDeleteConfirmationUser] = React.useState<StaffUser | null>(null);
  const [taxConfirmationData, setTaxConfirmationData] = React.useState<{ unpaidTaxes: number; unpaidGrossTax: number; unpaidStandardTax: number; callback: () => void } | null>(null);
  const [portalAlertMessage, setPortalAlertMessage] = React.useState<string | null>(null);

  // Discord active states
  const [isDiscordLoggingIn, setIsDiscordLoggingIn] = React.useState(false);
  const [discordLoginError, setDiscordLoginError] = React.useState<string | null>(null);

  // Load and sync accounts from local storage
  React.useEffect(() => {
    const stored = localStorage.getItem(STAFF_ACCOUNTS_KEY);
    let accounts: StaffUser[] = [];
    if (stored) {
      try {
        accounts = JSON.parse(stored);
      } catch (e) {
        accounts = [...DEFAULT_STAFF_ACCOUNTS];
      }
    } else {
      accounts = [...DEFAULT_STAFF_ACCOUNTS];
    }

    // Modern operational migration: ensure Eigenaar Mike Lapose is configured as the owner
    const ownerIndex = accounts.findIndex(u => u.role === "owner");
    if (ownerIndex !== -1) {
      const owner = accounts[ownerIndex];
      if (owner.username !== "MikeL" || owner.passwordHash !== "MikeLapose_eigenaar99!" || owner.fullname !== "Mike Lapose") {
        accounts[ownerIndex] = {
          ...owner,
          username: "MikeL",
          fullname: "Mike Lapose",
          passwordHash: "MikeLapose_eigenaar99!"
        };
      }
    } else {
      accounts.push({
        id: "u-1",
        username: "MikeL",
        fullname: "Mike Lapose",
        passwordHash: "MikeLapose_eigenaar99!",
        role: "owner"
      });
    }

    // Clean up old default test users to prepare for live operation
    accounts = accounts.filter(u => {
      if (u.username === "owner" && u.passwordHash === "oranjestad_owner") return false;
      if (u.username === "manager" && u.passwordHash === "oranjestad123") return false;
      if (u.username === "medewerker" && u.passwordHash === "vliegen456") return false;
      return true;
    });

    setStaffAccounts(accounts);
    localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(accounts));
  }, []);

  // Check for Discord code inside URL or custom session on mount
  React.useEffect(() => {
    const savedSession = localStorage.getItem("@luchtvaart_oranjestad_discord_session");
    if (savedSession) {
      try {
        const u = JSON.parse(savedSession);
        setIsLoggedIn(true);
        setRole(u.role);
        setFullname(u.fullname);
        setIssuedByTeacher(u.fullname);
        if (u.role === "owner" || u.role === "manager") {
          setActiveTab("administration");
        } else {
          setActiveTab("issue");
        }
        return;
      } catch (e) {
        localStorage.removeItem("@luchtvaart_oranjestad_discord_session");
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      handleDiscordLogin(code);
    }
  }, []);

  const handleDiscordLogin = async (authorizationCode: string) => {
    setIsDiscordLoggingIn(true);
    setDiscordLoginError(null);
    setLoginError(null);
    try {
      const redirectUri = window.location.origin + window.location.pathname;
      const response = await fetch("/api/discord/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authorizationCode, redirectUri }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Mislukt om in te loggen met Discord.");
      }
      
      if (data.success && data.user) {
        setIsLoggedIn(true);
        setRole(data.user.role);
        setFullname(data.user.fullname);
        setIssuedByTeacher(data.user.fullname);
        
        localStorage.setItem("@luchtvaart_oranjestad_discord_session", JSON.stringify(data.user));
        
        const discordUser: StaffUser = {
          id: `discord-${data.user.discordId}`,
          username: data.user.username,
          passwordHash: "LOGGED_IN_VIA_DISCORD",
          role: data.user.role,
          fullname: data.user.fullname
        };
        
        setStaffAccounts(prev => {
          const exists = prev.some(u => u.id === discordUser.id);
          if (!exists) {
            const next = [...prev, discordUser];
            localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(next));
            return next;
          }
          return prev;
        });

        if (data.user.role === "owner" || data.user.role === "manager") {
          setActiveTab("administration");
        } else {
          setActiveTab("issue");
        }
      }
    } catch (err: any) {
      console.error("Discord login error:", err);
      setDiscordLoginError(err.message || "Authenticatie mislukt.");
    } font-light {
      setIsDiscordLoggingIn(false);
    }
  };

  const handleStartDiscordLogin = async () => {
    setDiscordLoginError(null);
    setIsDiscordLoggingIn(true);
    try {
      const redirectUri = window.location.origin + window.location.pathname;
      const res = await fetch(`/api/discord/auth-url?redirectUri=${encodeURIComponent(redirectUri)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kan Discord inlogprocedure niet starten.");
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Geen autorisatie-URL ontvangen van de server.");
      }
    } catch (err: any) {
      console.error("Error starting Discord login:", err);
      setDiscordLoginError(err.message || "Kon geen verbinding maken met de Discord inlogservice.");
      setIsDiscordLoggingIn(false);
    }
  };

  // Bi-weekly tax cycle countdown setup
  const [taxDueDate, setTaxDueDate] = React.useState<number>(() => {
    const saved = localStorage.getItem("@luchtvaart_oranjestad_tax_due_date");
    if (saved) return parseInt(saved, 10);
    const initial = Date.now() + 14 * 24 * 60 * 60 * 1000;
    localStorage.setItem("@luchtvaart_oranjestad_tax_due_date", initial.toString());
    return initial;
  });

  const [timeLeftStr, setTimeLeftStr] = React.useState("");

  React.useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = taxDueDate - now;
      if (diff <= 0) {
        setTimeLeftStr("Belastingafdracht is NU vereist!");
      } else {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        const secs = Math.floor((diff % (60 * 1000)) / 1000);
        setTimeLeftStr(`${days}d, ${hours}u, ${mins}m, ${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [taxDueDate]);

  const saveAccounts = (newAccounts: StaffUser[]) => {
    setStaffAccounts(newAccounts);
    localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(newAccounts));
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    const matchedUser = staffAccounts.find(
      u => u.username.toLowerCase() === cleanUser && u.passwordHash === cleanPass
    );

    if (matchedUser) {
      setIsLoggedIn(true);
      setRole(matchedUser.role);
      setFullname(matchedUser.fullname);
      setIssuedByTeacher(matchedUser.fullname);
      setLoginError(null);
      if (matchedUser.role === "owner" || matchedUser.role === "manager") {
        setActiveTab("administration");
      } else {
        setActiveTab("issue");
      }
    } else {
      setLoginError("Ongeldige inloggegevens. Vul het correcte wachtwoord in.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUsername("");
    setPassword("");
    setFullname("");
    localStorage.removeItem("@luchtvaart_oranjestad_discord_session");
  };

  const handleIssueLicenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitName.trim() || !newCitId.trim()) {
      setPortalAlertMessage("Naam en Burger ID zijn verplichte velden!");
      return;
    }

    let finalCitId = newCitId.trim().toUpperCase();
    if (!finalCitId.startsWith("BSN-")) {
      finalCitId = "BSN-" + finalCitId.replace(/^BSN-?/i, "");
    }

    const newLic: IssuedLicense = {
      id: "lic-" + Math.floor(1000 + Math.random() * 9000),
      citizenName: newCitName.trim(),
      citizenId: finalCitId,
      licenseType: newLicType,
      issuedBy: issuedByTeacher || fullname || "Instructeur Oranjestad",
      issueDate: new Date().toLocaleDateString("nl-NL"),
      remarks: newRemarks.trim() || undefined,
      employeeCommissionPaid: false,
      taxPaid: false
    };

    onAddLicense(newLic);
    setFormSuccess(true);
    
    setNewCitName("");
    setNewCitId("BSN-");
    setNewRemarks("");

    setTimeout(() => {
      setFormSuccess(false);
    }, 4500);
  };

  // Bewerk logica functies
  const handleStartEdit = (lic: IssuedLicense) => {
    setEditingId(lic.id);
    setEditForm({
      citizenName: lic.citizenName,
      citizenId: lic.citizenId
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ citizenName: "", citizenId: "" });
  };

  const handleSaveEdit = (lic: IssuedLicense) => {
    let finalCitId = editForm.citizenId.trim().toUpperCase();
    if (!finalCitId.startsWith("BSN-")) {
      finalCitId = "BSN-" + finalCitId.replace(/^BSN-?/i, "");
    }

    const updatedLic: IssuedLicense = {
      ...lic,
      citizenName: editForm.citizenName.trim(),
      citizenId: finalCitId
    };

    onUpdateLicense(updatedLic);
    setEditingId(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = newUsername.trim().toLowerCase();
    const cleanPass = newPassword.trim();
    const cleanName = newFullname.trim();

    if (!cleanUser || !cleanPass || !cleanName) {
      setPortalAlertMessage("Vul alle velden in!");
      return;
    }

    const usernameExists = staffAccounts.some(u => u.username.toLowerCase() === cleanUser);
    if (usernameExists) {
      setPortalAlertMessage("Gebruikersnaam bestaat al!");
      return;
    }

    const newUser: StaffUser = {
      id: "u-" + Date.now(),
      username: cleanUser,
      passwordHash: cleanPass,
      role: newUserRole,
      fullname: cleanName
    };

    const nextAccounts = [...staffAccounts, newUser];
    saveAccounts(nextAccounts);

    setUserCreatedMessage(`Account voor '${cleanName}' met rol '${newUserRole}' is succesvol aangemaakt!`);
    setNewUsername("");
    setNewPassword("");
    setNewFullname("");

    setTimeout(() => {
      setUserCreatedMessage(null);
    }, 5000);
  };

  const handleDeleteUser = (userId: string) => {
    const matched = staffAccounts.find(u => u.id === userId);
    if (!matched) return;
    if (matched.role === "owner") {
      setPortalAlertMessage("U kunt de eigenaar niet verwijderen!");
      return;
    }
    setDeleteConfirmationUser(matched);
  };

  const confirmDeleteUser = () => {
    if (!deleteConfirmationUser) return;
    const nextAccounts = staffAccounts.filter(u => u.id !== deleteConfirmationUser.id);
    saveAccounts(nextAccounts);
    setDeleteConfirmationUser(null);
  };

  const filteredLicenses = issuedLicenses.filter(lic => {
    const matchesSearch = 
      lic.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.citizenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || lic.licenseType === filterType;
    return matchesSearch && matchesType;
  });

  const getLicenseTypeLabel = (type: string) => {
    switch(type) {
      case "helicopter": return "Helikopter brevet";
      case "small-plane": return "Vliegtuig Klein brevet";
      case "large-plane": return "Vliegtuig Groot brevet";
      default: return type;
    }
  };

  // Render Login state
  if (!isLoggedIn) {
    return (
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <span className="text-[#ea580c] font-mono text-xs tracking-widest uppercase font-bold px-3 py-1 bg-[#ea580c]/10 rounded-full border border-[#ea580c]/10">
              Uitsluitend voor Bevoegde Medewerkers
            </span>
            <h1 className="font-display font-bold text-3xl mt-4 text-white">Medewerkers Login</h1>
            <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">
              Log in op het stadsportaal van Luchtvaart Centrum Oranjestad. Maak vliegbewijzen aan en controleer de vloot.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ea580c]"></div>
            
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex gap-2 items-start font-light">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">ID / Gebruikersnaam</label>
                <div className="relative">
                  <User className="h-4.5 w-4.5 absolute left-3 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Gebruikersnaam"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs focus:border-[#ea580c] outline-none font-mono text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Wachtwoord</label>
                <div className="relative">
                  <Lock className="h-4.5 w-4.5 absolute left-3 top-3.5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Wachtwoord"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs focus:border-[#ea580c] outline-none font-mono text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-350"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono py-3 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer shadow-lg shadow-[#ea580c]/10 flex items-center justify-center gap-1.5"
              >
                <Lock className="h-4 w-4" />
                <span>Meld Veilig Aan</span>
              </button>
            </form>

            <div className="relative my-6 text-center">
              <span className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-800"></span>
              <span className="relative bg-slate-950 px-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest z-10">Of log in via Discord</span>
            </div>

            {discordLoginError && (
              <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs space-y-1 font-light">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-500" />
                  <span className="font-semibold text-rose-300">Discord Authenticatie Mislukt</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">{discordLoginError}</p>
              </div>
            )}

            <button
              type="button"
              disabled={isDiscordLoggingIn}
              onClick={handleStartDiscordLogin}
              className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 disabled:bg-[#5865F2]/40 text-white font-bold font-mono py-3 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer shadow-lg shadow-[#5865F2]/10 flex items-center justify-center gap-2"
            >
              {isDiscordLoggingIn ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.93,54.47,1,77.06a107.4,107.4,0,0,0,32.24,16.3,80.7,80.7,0,0,0,6.84-11.15,68.7,68.7,0,0,1-10.85-5.18c.92-.67,1.8-1.37,2.65-2.1a77,77,0,0,0,70.9,0c.85.73,1.73,1.43,2.65,2.1a68.73,68.73,0,0,1-10.85,5.18,80.7,80.7,0,0,0,6.84,11.15,107.4,107.4,0,0,0,32.24-16.3C129.38,50.92,123.35,28.27,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                </svg>
              )}
              <span>{isDiscordLoggingIn ? "Bezig met verbinden..." : "Inloggen met Discord"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-950 border border-slate-800/80 p-5 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-xl flex items-center justify-center text-[#ea580c]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Intranet Portaal</h2>
              <p className="text-xs text-slate-400 font-light font-mono">
                Ingelogd als: <strong className="text-[#ea580c] capitalize">{role}</strong> | {fullname}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] rounded-lg transition-all cursor-pointer uppercase"
            >
              Uitloggen
            </button>
          </div>
        </div>

        {/* Tab Navigation inside staff pane */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-900 pb-4">
          <button
            onClick={() => setActiveTab("registry")}
            className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "registry"
                ? "bg-slate-950 text-white border border-[#ea580c]"
                : "bg-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Klanten & Piloten Register</span>
          </button>

          <button
            onClick={() => setActiveTab("issue")}
            className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "issue"
                ? "bg-slate-950 text-white border border-[#ea580c]"
                : "bg-transparent text-slate-400 hover:text-white"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Diploma Maken</span>
          </button>

          <button
            onClick={() => setActiveTab("administration")}
            className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "administration"
                ? "bg-slate-950 text-white border border-[#ea580c]"
                : "bg-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>Financiën & Administratie</span>
          </button>

          {role === "owner" && (
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "users"
                  ? "bg-slate-950 text-white border border-[#ea580c]"
                  : "bg-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Personeel & Accounts ({staffAccounts.length})</span>
            </button>
          )}
        </div>

        {/* Content Tabs Area */}
        {activeTab === "registry" && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-3xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display font-semibold text-base text-white">Uitgegeven Vliegbrevetten</h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Overzicht van alle burgers die geslaagd zijn en een bevoegdheid bezitten.</p>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Zoek burger, ID of staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-850 rounded-lg px-3.5 py-1.5 text-xs outline-none focus:border-[#ea580c] w-48 font-mono text-slate-200"
                  />
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-900 border border-slate-850 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#ea580c] font-mono text-slate-300"
                  >
                    <option value="all">Alle Diploma's</option>
                    <option value="helicopter">Helikopter</option>
                    <option value="small-plane">Vliegtuig Klein</option>
                    <option value="large-plane">Vliegtuig Groot</option>
                  </select>
                </div>
              </div>

              {/* Table / Grid */}
              {filteredLicenses.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-850 text-xs text-slate-500">
                  Geen geregistreerde diploma's gevonden voor deze selectie.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-500 text-[10px] uppercase">
                        <th className="py-3 px-4">Diploma ID</th>
                        <th className="py-3 px-4">Klant (Piloot)</th>
                        <th className="py-3 px-4">Burger ID / BSN</th>
                        <th className="py-3 px-4">Categorie</th>
                        <th className="py-3 px-4">Docent (Staff)</th>
                        <th className="py-3 px-4">Datum</th>
                        <th className="py-3 px-4">Commissie status</th>
                        <th className="py-3 px-4">Belasting afgedragen</th>
                        <th className="py-3 px-4 text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/60 text-slate-300">
                      {filteredLicenses.map((lic) => {
                        const isEditing = editingId === lic.id;

                        return (
                          <tr key={lic.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-3 px-4 text-[#ea580c] font-bold">{lic.id}</td>
                            
                            {/* KLANT (PILOOT) - BEWERKBAAR */}
                            <td className="py-3 px-4 font-sans font-medium text-white">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.citizenName}
                                  onChange={(e) => setEditForm({ ...editForm, citizenName: e.target.value })}
                                  className="bg-slate-900 border border-[#ea580c] rounded px-2 py-1 text-xs text-white focus:outline-none w-full font-mono"
                                />
                              ) : (
                                lic.citizenName
                              )}
                            </td>

                            {/* BURGER ID / BSN - BEWERKBAAR */}
                            <td className="py-3 px-4 text-amber-500 font-bold">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.citizenId}
                                  onChange={(e) => setEditForm({ ...editForm, citizenId: e.target.value })}
                                  className="bg-slate-900 border border-[#ea580c] rounded px-2 py-1 text-xs text-amber-400 focus:outline-none w-full font-mono"
                                />
                              ) : (
                                lic.citizenId
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-purple-950/60 text-purple-300 border border-purple-800/40">
                                {getLicenseTypeLabel(lic.licenseType)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400">{lic.issuedBy}</td>
                            <td className="py-3 px-4 text-slate-400">{lic.issueDate}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 text-[10px] rounded uppercase ${
                                lic.employeeCommissionPaid 
                                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/80" 
                                  : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}>
                                {lic.employeeCommissionPaid ? "Uitbetaald" : "Openstaand"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 text-[10px] rounded uppercase ${
                                lic.taxPaid 
                                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/80" 
                                  : "bg-rose-950/60 text-rose-400 border border-rose-800/60"
                              }`}>
                                {lic.taxPaid ? "Voldaan" : "Onvoldaan"}
                              </span>
                            </td>

                            {/* ACTIES (BEWERKEN & INTREKKEN/VERWIJDEREN) */}
                            <td className="py-3 px-4 text-right">
                              {isEditing ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleSaveEdit(lic)}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition cursor-pointer"
                                    title="Opslaan"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded border border-slate-700 transition cursor-pointer"
                                    title="Annuleren"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleStartEdit(lic)}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded border border-slate-800 transition cursor-pointer"
                                    title="Bewerken"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  {(role === "manager" || role === "owner") && (
                                    <button
                                      onClick={() => onRemoveLicense(lic.id)}
                                      className="p-1.5 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded border border-slate-800 transition cursor-pointer"
                                      title="Intrekken"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Issue Diploma Tab */}
        {activeTab === "issue" && (
          <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800/80 p-8 rounded-3xl">
            <h3 className="font-display font-semibold text-lg text-white mb-1">Nieuw Vliegbrevet Uitgeven</h3>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Vul de gegevens van de geslaagde kandidaat in om het brevet officieel op te slaan.
            </p>

            {formSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 rounded-2xl text-xs flex items-center gap-2 font-mono">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>Brevet is succesvol geregistreerd in het stadsregister!</span>
              </div>
            )}

            <form onSubmit={handleIssueLicenseSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#ea580c] mb-1 uppercase text-[10px]">Naam Burger (Piloot)</label>
                <input
                  type="text"
                  required
                  placeholder="bijv. Jan de Vries"
                  value={newCitName}
                  onChange={(e) => setNewCitName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl p-3 text-white focus:border-[#ea580c] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ea580c] mb-1 uppercase text-[10px]">Burger ID / BSN</label>
                <input
                  type="text"
                  required
                  placeholder="BSN-12345"
                  value={newCitId}
                  onChange={(e) => setNewCitId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl p-3 text-white focus:border-[#ea580c] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ea580c] mb-1 uppercase text-[10px]">Type Categorie</label>
                <select
                  value={newLicType}
                  onChange={(e: any) => setNewLicType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl p-3 text-white focus:border-[#ea580c] outline-none"
                >
                  <option value="small-plane">Vliegtuig Klein brevet</option>
                  <option value="helicopter">Helikopter brevet</option>
                  <option value="large-plane">Vliegtuig Groot brevet</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase text-[10px]">Docent / Instructeur</label>
                <input
                  type="text"
                  value={issuedByTeacher}
                  onChange={(e) => setIssuedByTeacher(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl p-3 text-slate-300 focus:border-[#ea580c] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase text-[10px]">Opmerkingen (Optioneel)</label>
                <textarea
                  rows={3}
                  placeholder="Bijzonderheden examentraject..."
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-xl p-3 text-slate-300 focus:border-[#ea580c] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer mt-4"
              >
                Diploma Registreren & Opslaan
              </button>
            </form>
          </div>
        )}

        {/* Administration Tab */}
        {activeTab === "administration" && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-3xl">
              <h3 className="font-display font-semibold text-base text-white mb-2">Financiën & Belasting Cyclus</h3>
              <p className="text-xs text-slate-400 font-light mb-4">
                Tijd tot de volgende 14-daagse belastingafdracht: <strong className="text-amber-500 font-mono">{timeLeftStr}</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850">
                  <span className="text-slate-500 text-[10px] block uppercase">Totaal Brevetten Uitgegeven</span>
                  <span className="text-xl font-bold text-white mt-1 block">{issuedLicenses.length}</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850">
                  <span className="text-slate-500 text-[10px] block uppercase">Openstaande Commissies</span>
                  <span className="text-xl font-bold text-amber-500 mt-1 block">
                    {issuedLicenses.filter(l => !l.employeeCommissionPaid).length}
                  </span>
                </div>
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850">
                  <span className="text-slate-500 text-[10px] block uppercase">Onvoldane Belastingen</span>
                  <span className="text-xl font-bold text-rose-500 mt-1 block">
                    {issuedLicenses.filter(l => !l.taxPaid).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users / Staff Management Tab (Owner feature) */}
        {activeTab === "users" && role === "owner" && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800/80 p-6 rounded-3xl">
              <h3 className="font-display font-semibold text-base text-white mb-4">Personeel Accounts Beheren</h3>
              
              {userCreatedMessage && (
                <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 rounded-xl text-xs font-mono">
                  {userCreatedMessage}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono mb-8">
                <input
                  type="text"
                  placeholder="Volledige Naam"
                  value={newFullname}
                  onChange={(e) => setNewFullname(e.target.value)}
                  className="bg-slate-900 border border-slate-850 rounded-xl p-3 text-white outline-none focus:border-[#ea580c]"
                />
                <input
                  type="text"
                  placeholder="Gebruikersnaam"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-slate-900 border border-slate-850 rounded-xl p-3 text-white outline-none focus:border-[#ea580c]"
                />
                <input
                  type="password"
                  placeholder="Wachtwoord"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-900 border border-slate-850 rounded-xl p-3 text-white outline-none focus:border-[#ea580c]"
                />
                <button
                  type="submit"
                  className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold rounded-xl p-3 tracking-wider uppercase transition-all cursor-pointer"
                >
                  Account Aanmaken
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 text-[10px] uppercase">
                      <th className="py-3 px-4">Naam</th>
                      <th className="py-3 px-4">Gebruikersnaam</th>
                      <th className="py-3 px-4">Rol</th>
                      <th className="py-3 px-4 text-right">Verwijderen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 text-slate-300">
                    {staffAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-white">{acc.fullname}</td>
                        <td className="py-3 px-4 text-slate-400">{acc.username}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-800 border border-slate-700 text-amber-500">
                            {acc.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {acc.role !== "owner" && (
                            <button
                              onClick={() => handleDeleteUser(acc.id)}
                              className="p-1.5 bg-slate-900 hover:bg-rose-950/60 text-rose-400 rounded border border-slate-800 transition cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modern Alert Modal */}
      {portalAlertMessage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4">
            <p className="text-xs text-slate-200 font-mono">{portalAlertMessage}</p>
            <button
              onClick={() => setPortalAlertMessage(null)}
              className="px-4 py-2 bg-[#ea580c] text-slate-950 font-bold text-xs rounded-xl font-mono uppercase cursor-pointer"
            >
              Begrepen
            </button>
          </div>
        </div>
      )}

      {/* Modern Delete User Confirmation Modal */}
      {deleteConfirmationUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4">
            <h4 className="font-bold text-white text-sm">Account Verwijderen</h4>
            <p className="text-xs text-slate-400 font-mono">
              Weet u zeker dat u het account van <strong className="text-white">{deleteConfirmationUser.fullname}</strong> wilt verwijderen?
            </p>
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                onClick={() => setDeleteConfirmationUser(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
              >
                Annuleren
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg cursor-pointer"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}