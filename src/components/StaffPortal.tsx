import React from "react";
import { 
  ShieldCheck, FileSpreadsheet, PlusCircle, Trash2, 
  Settings, UserCheck, HelpCircle, AlertCircle, FileText, CheckCircle, Plus, Image, Users, HelpCircle as HelpIcon,
  Coins, TrendingUp, Percent, Award, Calendar
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

  // Active view in portal (6 Dedicated Organized Pages)
  const [activeTab, setActiveTab] = React.useState<"issue" | "registry" | "finance" | "taxes" | "leaderboard" | "settings">("issue");

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

  // Bonus modal states
  const [bonusModalLic, setBonusModalLic] = React.useState<IssuedLicense | null>(null);
  const [bonusInputValue, setBonusInputValue] = React.useState<number>(5000);
  const [bonusNoteInput, setBonusNoteInput] = React.useState<string>("Prestatie bonus voor uitstekend examen");

  // Managers+ (€15k per brevet) states: pre-filled with Mike, John, Yahro
  const [managementMembers, setManagementMembers] = React.useState<string[]>(() => {
    const saved = localStorage.getItem("@luchtvaart_oranjestad_management_members");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return ["Mike", "John", "Yahro"];
  });
  const [newManagerNameInput, setNewManagerNameInput] = React.useState("");

  const saveManagementMembers = (newMembers: string[]) => {
    setManagementMembers(newMembers);
    localStorage.setItem("@luchtvaart_oranjestad_management_members", JSON.stringify(newMembers));
    fetch("/api/shared-data/management-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ managementMembers: newMembers })
    }).catch(() => {});
  };

  const handleAddManagementMember = () => {
    const clean = newManagerNameInput.trim();
    if (!clean) return;
    if (managementMembers.includes(clean)) {
      setPortalAlertMessage("Deze manager staat al in de lijst!");
      return;
    }
    const updated = [...managementMembers, clean];
    saveManagementMembers(updated);
    setNewManagerNameInput("");
    setPortalAlertMessage(`Manager '${clean}' succesvol toegevoegd aan de €15k/brevet vergoedingenlijst!`);
  };

  const handleRemoveManagementMember = (name: string) => {
    if (managementMembers.length <= 1) {
      setPortalAlertMessage("Er moet minimaal 1 management-lid geregistreerd blijven!");
      return;
    }
    const updated = managementMembers.filter(m => m !== name);
    saveManagementMembers(updated);
  };

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

  // Live multi-user synchronization for staff accounts & taxes
  const syncSharedDataInPortal = async () => {
    try {
      const res = await fetch("/api/shared-data");
      if (res.ok) {
        const data = await res.json();
        if (data.staffAccounts && Array.isArray(data.staffAccounts)) {
          setStaffAccounts(data.staffAccounts);
          localStorage.setItem(STAFF_ACCOUNTS_KEY, JSON.stringify(data.staffAccounts));
        }
        if (data.managementMembers && Array.isArray(data.managementMembers) && data.managementMembers.length > 0) {
          setManagementMembers(data.managementMembers);
          localStorage.setItem("@luchtvaart_oranjestad_management_members", JSON.stringify(data.managementMembers));
        }
        if (data.taxDueDate) {
          setTaxDueDate(data.taxDueDate);
          localStorage.setItem("@luchtvaart_oranjestad_tax_due_date", data.taxDueDate.toString());
        }
      }
    } catch (e) {}
  };

  React.useEffect(() => {
    syncSharedDataInPortal();
    const interval = setInterval(syncSharedDataInPortal, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check for Discord code inside URL or custom session on mount
  React.useEffect(() => {
    // 1. First check if we have a saved Discord session
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
        return; // Session restored, skip URL check
      } catch (e) {
        localStorage.removeItem("@luchtvaart_oranjestad_discord_session");
      }
    }

    // 2. Otherwise check for a fresh login callback code in URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // Clear code from URL to keep URI pristine and prevent reload looping
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
        
        // Push user details into Staff accounts database so we keep them persistent
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
    } finally {
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
      setIssuedByTeacher(matchedUser.fullname); // Pre-set in forms
      setLoginError(null);
      // Auto tabs based on role
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

  // Issue License/Diploma handler with financial defaults
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
    
    // Reset form fields
    setNewCitName("");
    setNewCitId("BSN-");
    setNewRemarks("");

    setTimeout(() => {
      setFormSuccess(false);
    }, 4500);
  };

  // Add User handler (Owner feature)
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
    fetch("/api/shared-data/staff-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    }).catch(() => {});

    setUserCreatedMessage(`Account voor '${cleanName}' met rol '${newUserRole}' is succesvol aangemaakt!`);
    setNewUsername("");
    setNewPassword("");
    setNewFullname("");

    setTimeout(() => {
      setUserCreatedMessage(null);
    }, 5000);
  };

  // Delete User (Owner feature)
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
    const delId = deleteConfirmationUser.id;
    const nextAccounts = staffAccounts.filter(u => u.id !== delId);
    saveAccounts(nextAccounts);
    fetch(`/api/shared-data/staff-account/${delId}`, {
      method: "DELETE"
    }).catch(() => {});
    setDeleteConfirmationUser(null);
  };

  // Filtering license list
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
      <div className="bg-[#090d16] text-white py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in">
          {/* Logo and Greeting */}
          <div className="text-center space-y-3">
            <span className="text-[#ea580c] font-mono text-[10px] tracking-widest uppercase font-bold px-3 py-1 bg-[#ea580c]/10 rounded-full border border-[#ea580c]/20 inline-block">
              Uitsluitend voor Geautoriseerd Personeel
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase">Medewerkers Login</h1>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Log in op het personeelsportaal van Luchtvaart Centrum Oranjestad om brevetten uit te geven, cijfers te beheren en de vloot in te zien.
            </p>
          </div>

          {/* Login box */}
          <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#5865F2]" />
            
            {loginError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs flex items-center gap-2 font-light">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            {discordLoginError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs space-y-1.5 font-light">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-500" />
                  <span className="font-semibold text-rose-300">Discord Authenticatie Mislukt</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">{discordLoginError}</p>
              </div>
            )}

            <p className="text-xs text-slate-300 font-light text-center leading-relaxed">
              Klik op de onderstaande knop om veilig in te loggen met uw geautoriseerde Discord account.
            </p>

            <button
              type="button"
              disabled={isDiscordLoggingIn}
              onClick={handleStartDiscordLogin}
              className="w-full bg-[#5865F2] hover:bg-[#5865F2]/90 disabled:bg-[#5865F2]/40 text-white font-bold font-mono py-4 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer shadow-xl shadow-[#5865F2]/20 flex items-center justify-center gap-3 hover:scale-[1.02]"
            >
              {isDiscordLoggingIn ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="h-5 w-5 fill-current" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.93,54.47,1,77.06a107.4,107.4,0,0,0,32.24,16.3,80.7,80.7,0,0,0,6.84-11.15,68.7,68.7,0,0,1-10.85-5.18c.92-.67,1.8-1.37,2.65-2.1a77,77,0,0,0,70.9,0c.85.73,1.73,1.43,2.65,2.1a68.73,68.73,0,0,1-10.85,5.18,80.7,80.7,0,0,0,6.84,11.15,107.4,107.4,0,0,0,32.24-16.3C129.38,50.92,123.35,28.27,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                </svg>
              )}
              <span>{isDiscordLoggingIn ? "Verbinden..." : "Inloggen met Discord"}</span>
            </button>

          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-[#090d16] text-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-950/80 border border-white/10 p-5 sm:p-6 rounded-3xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 bg-[#ea580c]/10 border border-[#ea580c]/30 rounded-2xl flex items-center justify-center text-[#ea580c] shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">Intranet Staff Portaal</h2>
              <p className="text-xs text-slate-400 font-light font-mono mt-0.5">
                Ingelogd als: <strong className="text-[#ea580c] capitalize">{role}</strong> | {fullname}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-300 hover:text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider"
            >
              Uitloggen
            </button>
          </div>
        </div>

        {/* Tab Navigation inside staff pane */}
        {/* Navigation Tabs (6 Dedicated Organized Pages) */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          
          <button
            onClick={() => setActiveTab("issue")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "issue"
                ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                : "bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>📜 Brevet Uitgeven</span>
          </button>

          <button
            onClick={() => setActiveTab("registry")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "registry"
                ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                : "bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>📋 Diploma Register</span>
          </button>

          <button
            onClick={() => setActiveTab("finance")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "finance"
                ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                : "bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>💰 Financiën & Winst</span>
          </button>

          <button
            onClick={() => setActiveTab("taxes")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "taxes"
                ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                : "bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>🏛️ Belastingen</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "leaderboard"
                ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                : "bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>🏆 Prestaties & Bonussen</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "settings"
                ? "bg-[#ea580c] text-slate-950 shadow-md shadow-[#ea580c]/15"
                : "bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>⚙️ Instellingen & Personeel ({staffAccounts.length})</span>
          </button>

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
                        <th className="py-3 px-4 animate-fade-in">Diploma ID</th>
                        <th className="py-3 px-4">Klant (Piloot)</th>
                        <th className="py-3 px-4">Burger ID / BSN</th>
                        <th className="py-3 px-4">Categorie</th>
                        <th className="py-3 px-4">Docent (Staff)</th>
                        <th className="py-3 px-4">Datum</th>
                        <th className="py-3 px-4">Commissie status</th>
                        <th className="py-3 px-4">Belasting afgedregen</th>
                        {(role === "manager" || role === "owner") && <th className="py-3 px-4 text-right">Intrekken</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/60 text-slate-300">
                      {filteredLicenses.map((lic) => (
                        <tr key={lic.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 text-[#ea580c] font-bold">{lic.id}</td>
                          <td className="py-3 px-4 font-sans font-medium text-white">{lic.citizenName}</td>
                          <td className="py-3 px-4 font-bold text-amber-500">{lic.citizenId}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-bold text-slate-950 ${
                              lic.licenseType === "helicopter" 
                                ? "bg-cyan-400" 
                                : lic.licenseType === "small-plane" 
                                ? "bg-orange-400" 
                                : "bg-purple-400"
                            }`}>
                              {getLicenseTypeLabel(lic.licenseType)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{lic.issuedBy}</td>
                          <td className="py-3 px-4 text-slate-400">{lic.issueDate}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[8.5px] uppercase font-bold ${
                              lic.employeeCommissionPaid 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/25" 
                                : "bg-amber-500/15 text-amber-500 border border-amber-500/20 animate-pulse"
                            }`}>
                              {lic.employeeCommissionPaid ? "Voldaan" : "Openstaand"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[8.5px] uppercase font-bold ${
                              lic.taxPaid 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/25" 
                                : "bg-rose-500/20 text-rose-450 border border-rose-500/30"
                            }`}>
                              {lic.taxPaid ? "Afgedragen" : "Openstaand"}
                            </span>
                          </td>
                          {(role === "manager" || role === "owner") && (
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => onRemoveLicense(lic.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-slate-800 rounded transition-all cursor-pointer"
                                title="Brevet intrekken"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "issue" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-950 border border-slate-800/80 p-6 sm:p-8 rounded-3xl relative">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
                <UserCheck className="h-5 w-5 text-[#ea580c]" />
                <h3 className="font-display font-semibold text-lg text-white">Zojuist Geslaagde Diploma Registreren</h3>
              </div>
              <p className="text-xs text-slate-400 font-light mb-6">
                Schrijf direct een vliegdiploma uit voor de geslaagde leerling. De bijbehorende medewerkercommissies en belastingen worden automatisch geboekt in ons administratie panel.
              </p>

              {formSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex gap-2 items-center animate-bounce font-mono">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span>Vliegbewijs is succesvol geactiveerd en opgenomen in de computer!</span>
                </div>
              )}

              <form onSubmit={handleIssueLicenseSubmit} className="space-y-4 font-mono text-xs text-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Volledige Naam Klant</label>
                    <input
                      type="text"
                      required
                      value={newCitName}
                      onChange={(e) => setNewCitName(e.target.value)}
                      placeholder="bijv: Trevor Philips"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#ea580c] font-sans text-xs text-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold text-amber-500">Burger ID / CID / BSN (Vereist BSN-)</label>
                    <input
                      type="text"
                      required
                      value={newCitId}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (val.startsWith("BSN-")) {
                          setNewCitId(val);
                        } else if (val.length < 4) {
                          setNewCitId("BSN-");
                        } else {
                          setNewCitId("BSN-" + val.replace(/^BSN-?/i, ""));
                        }
                      }}
                      placeholder="BSN-1234"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:border-[#ea580c] outline-none text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Soort Diploma</label>
                    <select
                      value={newLicType}
                      onChange={(e) => setNewLicType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:border-[#ea580c] outline-none text-xs text-slate-300 font-sans"
                    >
                      <option value="helicopter">Helikopter brevet</option>
                      <option value="small-plane">Vliegtuig Klein brevet</option>
                      <option value="large-plane">Vliegtuig Groot brevet</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Uitschrijvende Medewerker</label>
                    <select
                      value={issuedByTeacher}
                      onChange={(e) => setIssuedByTeacher(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:border-[#ea580c] outline-none text-xs text-slate-350 font-sans font-bold"
                    >
                      {staffAccounts.map((acc) => (
                        <option key={acc.id} value={acc.fullname}>
                          {acc.fullname} ({acc.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Beoordeling / Examenverslag</label>
                  <textarea
                    rows={3}
                    value={newRemarks}
                    onChange={(e) => setNewRemarks(e.target.value)}
                    placeholder="bijv: Uitstekende vaardigheden met theorie en testvluchten. Geslaagd."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 focus:border-[#ea580c] outline-none text-xs font-sans text-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono py-3.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer shadow-lg shadow-[#ea580c]/10 flex items-center justify-center gap-1.5"
                >
                  <FileText className="h-4.5 w-4.5" />
                  <span>Registreer Diploma in Database</span>
                </button>
              </form>
            </div>
          </div>
        )}
        {/* CORE CALCULATIONS PREPARATION */}
        {(() => {
          const getFinancialDetails = (licenseType: "helicopter" | "small-plane" | "large-plane") => {
            const perMemberFee = 15000;
            const totalManagementFee = managementMembers.length * perMemberFee;

            switch (licenseType) {
              case "helicopter":
                return {
                  price: 250000,
                  commission: 35000,
                  standardTax: 15000,
                  grossTax: 250000 * 0.07, // €17,500
                  managementFee: totalManagementFee
                };
              case "small-plane":
                return {
                  price: 500000,
                  commission: 60000,
                  standardTax: 15000,
                  grossTax: 500000 * 0.07, // €35,000
                  managementFee: totalManagementFee
                };
              case "large-plane":
                return {
                  price: 750000,
                  commission: 80000,
                  standardTax: 15000,
                  grossTax: 750000 * 0.07, // €52,500
                  managementFee: totalManagementFee
                };
              default:
                return { price: 0, commission: 0, standardTax: 0, grossTax: 0, managementFee: 0 };
            }
          };

          const totals = issuedLicenses.reduce((acc, lic) => {
            const details = getFinancialDetails(lic.licenseType);
            const bonus = lic.bonusAmount || 0;
            
            acc.grossRevenue += details.price;
            
            if (lic.employeeCommissionPaid) {
              acc.paidCommission += details.commission;
            } else {
              acc.unpaidCommission += details.commission;
            }
            acc.totalCommission += details.commission;

            acc.totalBonuses += bonus;
            if (lic.bonusPaid) {
              acc.paidBonuses += bonus;
            } else {
              acc.unpaidBonuses += bonus;
            }

            const fullTaxForLic = details.standardTax + details.grossTax;
            if (lic.taxPaid) {
              acc.paidTaxes += fullTaxForLic;
            } else {
              acc.unpaidTaxes += fullTaxForLic;
              acc.unpaidStandardTax += details.standardTax;
              acc.unpaidGrossTax += details.grossTax;
            }
            acc.totalTaxes += fullTaxForLic;

            acc.managementFees += details.managementFee;

            return acc;
          }, {
            grossRevenue: 0,
            paidCommission: 0,
            unpaidCommission: 0,
            totalCommission: 0,
            totalBonuses: 0,
            paidBonuses: 0,
            unpaidBonuses: 0,
            paidTaxes: 0,
            unpaidTaxes: 0,
            unpaidStandardTax: 0,
            unpaidGrossTax: 0,
            totalTaxes: 0,
            managementFees: 0
          });

          const totalBusinessExpenses = totals.totalCommission + totals.totalBonuses + totals.totalTaxes + totals.managementFees;
          const winstPotjeBalance = totals.grossRevenue - totalBusinessExpenses;

          const uniqueTeachersList = Array.from(new Set([
            ...staffAccounts.map(u => u.fullname),
            ...issuedLicenses.map(l => l.issuedBy)
          ]));

          const employeeStats = uniqueTeachersList.map(teacherName => {
            const matchesOfTeacher = issuedLicenses.filter(lic => lic.issuedBy === teacherName);
            
            const typeCounts = matchesOfTeacher.reduce((acc, lic) => {
              if (lic.licenseType === "helicopter") acc.helicopter += 1;
              else if (lic.licenseType === "small-plane") acc.smallPlane += 1;
              else if (lic.licenseType === "large-plane") acc.largePlane += 1;
              return acc;
            }, { helicopter: 0, smallPlane: 0, largePlane: 0 });

            let teacherRevenue = 0;
            let teacherBonuses = 0;

            const commissionFinances = matchesOfTeacher.reduce((acc, lic) => {
              const details = getFinancialDetails(lic.licenseType);
              teacherRevenue += details.price;
              teacherBonuses += (lic.bonusAmount || 0);

              if (lic.employeeCommissionPaid) {
                acc.paid += details.commission;
              } else {
                acc.unpaid += details.commission;
              }
              acc.total += details.commission;
              return acc;
            }, { paid: 0, unpaid: 0, total: 0 });

            const staffAccountObject = staffAccounts.find(s => s.fullname === teacherName);

            return {
              fullname: teacherName,
              role: staffAccountObject?.role || "Instructeur",
              totalLicensesCount: matchesOfTeacher.length,
              generatedRevenue: teacherRevenue,
              totalBonuses: teacherBonuses,
              counts: typeCounts,
              commissions: commissionFinances,
              licenses: matchesOfTeacher
            };
          }).filter(e => e.totalLicensesCount > 0 || staffAccounts.some(s => s.fullname === e.fullname))
            .sort((a, b) => b.totalLicensesCount - a.totalLicensesCount);

          const handleToggleEmployeePaid = (lic: IssuedLicense) => {
            if (role !== "owner" && role !== "manager") {
              setPortalAlertMessage("Alleen de directie (Eigenaar / Manager) mag medewerkers uitbetalingen fiatteren!");
              return;
            }
            onUpdateLicense({
              ...lic,
              employeeCommissionPaid: !lic.employeeCommissionPaid
            });
          };

          const handlePayTaxesSubmit = () => {
            if (role !== "owner" && role !== "manager") {
              setPortalAlertMessage("Alleen de directie mag de twee-wekelijkse belastingen afdragen!");
              return;
            }
            if (totals.unpaidTaxes <= 0) {
              setPortalAlertMessage("Er is geen openstaande belasting om af te dragen!");
              return;
            }

            const executeTaxPayment = () => {
              issuedLicenses.forEach(lic => {
                if (!lic.taxPaid) {
                  onUpdateLicense({
                    ...lic,
                    taxPaid: true
                  });
                }
              });

              const nextDueDate = Date.now() + 14 * 24 * 60 * 60 * 1000;
              setTaxDueDate(nextDueDate);
              localStorage.setItem("@luchtvaart_oranjestad_tax_due_date", nextDueDate.toString());

              setPortalAlertMessage("De twee-wekelijkse belastingverplichting is met succes afgedragen aan de overheid!");
            };

            setTaxConfirmationData({
              unpaidTaxes: totals.unpaidTaxes,
              unpaidGrossTax: totals.unpaidGrossTax,
              unpaidStandardTax: totals.unpaidStandardTax,
              callback: executeTaxPayment
            });
          };

          return (
            <React.Fragment>
              {/* TAB 3: FINANCIËN & WINST */}
              {activeTab === "finance" && (
                <div className="space-y-8 animate-fade-in font-mono text-xs text-slate-300">
                  <div className="bg-slate-950/80 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-[#ea580c]/10 text-[#ea580c] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-[#ea580c]/20 mb-2">
                        <Coins className="h-3.5 w-3.5" />
                        <span>Financiën & Winst Vault</span>
                      </div>
                      <h2 className="font-display font-black text-2xl text-white uppercase">
                        Financieel Overzicht & Winstbeheer
                      </h2>
                      <p className="text-xs text-slate-400 font-light font-sans mt-1">
                        Inzicht in het zakelijk winstpotje, totale omzet, uitgaven en accordering van commissie-uitbetalingen.
                      </p>
                    </div>

                    <div className="bg-slate-900 border border-white/10 px-4 py-2.5 rounded-2xl text-right">
                      <span className="text-[9px] text-slate-500 block uppercase">Totale Omzet School</span>
                      <strong className="text-emerald-400 font-bold text-base font-mono">€{totals.grossRevenue.toLocaleString("nl-NL")}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Winstpotje */}
                    <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[170px]">
                      <div>
                        <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold font-sans bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15">
                          ★ Netto Winstpotje
                        </span>
                        <h3 className="text-3xl font-black font-display text-white mt-4 tracking-tight">
                          €{winstPotjeBalance.toLocaleString("nl-NL")}
                        </h3>
                      </div>
                      <div className="pt-3 border-t border-slate-900">
                        <p className="text-[9.5px] font-sans text-slate-400 font-light block">
                          Netto winst na aftrek van alle commissies, bonussen en belastingen.
                        </p>
                      </div>
                    </div>

                    {/* Bonussen */}
                    <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[170px]">
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold font-sans bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/15">
                          🎁 Uitgekeerde Bonussen
                        </span>
                        <h3 className="text-2xl font-bold text-white mt-4 font-display">
                          €{totals.totalBonuses.toLocaleString("nl-NL")}
                        </h3>
                      </div>
                      <div className="pt-3 border-t border-white/5 text-[10px] font-sans text-slate-400">
                        <span>Extra beloningen per brevet toegekend.</span>
                      </div>
                    </div>

                    {/* Uitgaven */}
                    <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[170px]">
                      <div>
                        <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold font-sans bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/10">
                          Totale Gelaste Kosten
                        </span>
                        <h3 className="text-2xl font-bold text-white mt-3 font-display">
                          €{totalBusinessExpenses.toLocaleString("nl-NL")}
                        </h3>
                      </div>
                      <div className="pt-2 divide-y divide-white/5 font-sans text-[10px] text-slate-400">
                        <div className="flex justify-between py-1">
                          <span>Management Pool:</span>
                          <strong className="text-amber-400">€{(totals.managementFees).toLocaleString("nl-NL")}</strong>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Commissies:</span>
                          <strong className="text-slate-200">€{totals.totalCommission.toLocaleString("nl-NL")}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MANAGERS+ VERGOEDINGEN MODULE (€15k per brevet per manager) */}
                  <div className="bg-slate-950/90 border border-amber-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-amber-500/20 mb-2">
                          <Users className="h-3.5 w-3.5" />
                          <span>Managers+ (€15k per brevet) Regeling</span>
                        </div>
                        <h3 className="font-display font-black text-2xl text-white uppercase">
                          Directie & Management Vergoedingen
                        </h3>
                        <p className="text-xs text-slate-400 font-light font-sans mt-1">
                          Elk geregistreerd management-lid ontvangt een vaste vergoeding van €15.000 per uitgeschreven vliegdiploma.
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl text-right font-mono">
                        <span className="text-[9.5px] text-slate-400 block uppercase">Management Pool / Brevet</span>
                        <strong className="text-amber-400 text-sm font-bold block">
                          €{(managementMembers.length * 15000).toLocaleString("nl-NL")} <span className="text-[9px] text-slate-500 font-normal">({managementMembers.length} managers)</span>
                        </strong>
                      </div>
                    </div>

                    {/* Manager Names Management Bar */}
                    {(role === "owner" || role === "manager") && (
                      <div className="bg-slate-900/90 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-3">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                          ➕ Management Leden Toevoegen / Beheren:
                        </span>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Naam manager (bijv: Mike, John, Yahro...)"
                            value={newManagerNameInput}
                            onChange={(e) => setNewManagerNameInput(e.target.value)}
                            className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-amber-400 text-white flex-1"
                          />
                          <button
                            type="button"
                            onClick={handleAddManagementMember}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer transition-all shrink-0 shadow-lg shadow-amber-500/20"
                          >
                            + Voeg Manager Toe
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {managementMembers.map((name) => (
                            <span key={name} className="inline-flex items-center gap-2 bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-xs px-3.5 py-1.5 rounded-full font-bold">
                              💼 {name} (€15k/brevet)
                              <button
                                type="button"
                                onClick={() => handleRemoveManagementMember(name)}
                                className="hover:text-rose-400 cursor-pointer ml-1 font-sans text-xs"
                                title="Verwijder uit management"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Table breakdown per manager */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-sm text-white uppercase">Management Vergoedingen Overzicht</h4>
                        <span className="text-[10px] text-slate-500 font-mono">Totaal diploma's: {issuedLicenses.length}</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                              <th className="py-3 px-4">Manager / Directielid</th>
                              <th className="py-3 px-4">Vergoeding per Brevet</th>
                              <th className="py-3 px-4">Totaal Brevetten School</th>
                              <th className="py-3 px-4">Totaal Opgebouwde Vergoeding</th>
                              <th className="py-3 px-4 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300">
                            {managementMembers.map((managerName) => {
                              const totalEarned = issuedLicenses.length * 15000;
                              return (
                                <tr key={managerName} className="hover:bg-white/5 transition-colors">
                                  <td className="py-3.5 px-4 font-bold text-white font-sans flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                                    <span>{managerName}</span>
                                  </td>
                                  <td className="py-3.5 px-4 text-amber-400 font-bold">€15.000</td>
                                  <td className="py-3.5 px-4 text-slate-300 font-bold">{issuedLicenses.length} diploma's</td>
                                  <td className="py-3.5 px-4 text-emerald-400 font-bold text-sm">€{totalEarned.toLocaleString("nl-NL")}</td>
                                  <td className="py-3.5 px-4 text-center">
                                    <span className="px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      ✓ Gereserveerd in Potje
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Transacties & Commissies Table */}
                  <div className="bg-slate-950/80 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-5 w-5 text-[#ea580c]" />
                          <h3 className="font-display font-bold text-xl text-white uppercase">
                            Commissie Accordering & Transacties
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 font-light font-sans mt-1">
                          Vink aan wanneer een medewerker zijn verdiende commissie is uitbetaald.
                        </p>
                      </div>

                      <span className="text-xs font-mono text-slate-400">
                        Openstaand: <strong className="text-amber-500">€{totals.unpaidCommission.toLocaleString("nl-NL")}</strong>
                      </span>
                    </div>

                    {issuedLicenses.length === 0 ? (
                      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-white/10 text-xs text-slate-500 font-mono">
                        Er zijn nog geen vliegbrevetten uitgeschreven.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                              <th className="py-3.5 px-4">Diplomacode</th>
                              <th className="py-3.5 px-4">Instructeur</th>
                              <th className="py-3.5 px-4">Klant (Piloot)</th>
                              <th className="py-3.5 px-4">Diploma type</th>
                              <th className="py-3.5 px-4">Commissie</th>
                              <th className="py-3.5 px-4">Bonus</th>
                              <th className="py-3.5 px-4 text-center">Status Uitbetaald</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300">
                            {issuedLicenses.map((lic) => {
                              const details = getFinancialDetails(lic.licenseType);
                              const isDirectie = role === "owner" || role === "manager";
                              return (
                                <tr key={lic.id} className="hover:bg-white/5 transition-all">
                                  <td className="py-4 px-4 font-bold text-[#ea580c]">{lic.id}</td>
                                  <td className="py-4 px-4 font-bold text-white font-sans">{lic.issuedBy}</td>
                                  <td className="py-4 px-4 font-sans text-slate-400">{lic.citizenName}</td>
                                  <td className="py-4 px-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase text-slate-950 ${
                                      lic.licenseType === "helicopter" 
                                        ? "bg-cyan-400" 
                                        : lic.licenseType === "small-plane" 
                                        ? "bg-orange-400" 
                                        : "bg-purple-400"
                                    }`}>
                                      {getLicenseTypeLabel(lic.licenseType)}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 font-bold text-white font-mono">€{details.commission.toLocaleString("nl-NL")}</td>
                                  <td className="py-4 px-4 font-mono text-emerald-400 font-bold">
                                    {lic.bonusAmount ? `+ €${lic.bonusAmount.toLocaleString("nl-NL")}` : "-"}
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={lic.employeeCommissionPaid === true}
                                        disabled={!isDirectie}
                                        onChange={() => handleToggleEmployeePaid(lic)}
                                        className="w-4.5 h-4.5 rounded text-[#ea580c] focus:ring-[#ea580c] border-white/20 bg-slate-950 cursor-pointer"
                                      />
                                      <span className={`text-[10px] font-bold uppercase font-sans ${
                                        lic.employeeCommissionPaid ? "text-emerald-400" : "text-amber-500 animate-pulse"
                                      }`}>
                                        {lic.employeeCommissionPaid ? "Betaald" : "Openstaand"}
                                      </span>
                                    </div>
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

              {/* TAB 4: CORPORATE BELASTINGEN */}
              {activeTab === "taxes" && (
                <div className="space-y-8 animate-fade-in font-mono text-xs text-slate-300">
                  <div className="bg-slate-950/90 border border-amber-500/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 bg-[#ea580c]/10 text-[#ea580c] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-[#ea580c]/20 mb-2">
                          <Coins className="h-3.5 w-3.5" />
                          <span>Belasting & Overheidsafdrachten Module</span>
                        </div>
                        <h3 className="font-display font-black text-2xl text-white uppercase">
                          Corporate Belasting Overzicht & Afdracht
                        </h3>
                        <p className="text-xs text-slate-400 font-light font-sans mt-1">
                          Heldere uitsplitsing van de 2-wekelijkse belastingverplichting. Belasting opgebouwd uit 7% brutowinst + €15.000 vast tarief per uitgeschreven brevet.
                        </p>
                      </div>

                      <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl text-right font-mono">
                        <span className="text-[9.5px] text-slate-400 block uppercase">Resterende Termijn</span>
                        <strong className="text-rose-400 text-sm font-bold block">{timeLeftStr}</strong>
                      </div>
                    </div>

                    {/* 3 Step Formula Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
                      <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-2">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">1. 7% Brutowinst Heffing</span>
                        <div className="text-xl font-bold text-white">€{totals.unpaidGrossTax.toLocaleString("nl-NL")} <span className="text-xs text-slate-500 font-normal">openstaand</span></div>
                        <p className="text-[10.5px] text-slate-400 font-sans font-light leading-relaxed">
                          7% belasting over het totale verkoopbedrag van elk geregistreerd diploma.
                        </p>
                      </div>

                      <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-2">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">2. Vaste Brevet-Toeslag (€15k)</span>
                        <div className="text-xl font-bold text-white">€{totals.unpaidStandardTax.toLocaleString("nl-NL")} <span className="text-xs text-slate-500 font-normal">openstaand</span></div>
                        <p className="text-[10.5px] text-slate-400 font-sans font-light leading-relaxed">
                          Vast overheidstarief van €15.000 per goedgekeurd en geregistreerd vliegdiploma.
                        </p>
                      </div>

                      <div className="bg-slate-900/90 border border-[#ea580c]/40 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-[#ea580c] font-bold uppercase tracking-widest block">3. Totaal Te Voldoen Afdracht</span>
                          <div className="text-2xl font-black text-[#ea580c]">€{totals.unpaidTaxes.toLocaleString("nl-NL")}</div>
                        </div>

                        {(role === "owner" || role === "manager") && totals.unpaidTaxes > 0 ? (
                          <button
                            onClick={handlePayTaxesSubmit}
                            className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono py-2.5 rounded-xl uppercase tracking-wider text-xs transition-all cursor-pointer shadow-lg shadow-[#ea580c]/20"
                          >
                            🏛️ Voldoe Belastingen Nu
                          </button>
                        ) : (
                          <div className="text-center text-[10px] text-emerald-400 font-bold uppercase border border-emerald-500/20 bg-emerald-500/10 p-2 rounded-xl">
                            ✓ Alle Belastingen Voldaan
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transparante Rekenvoorbeelden */}
                    <div className="bg-slate-900/60 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-3">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                        💡 Transparante Belastingvoorbeelden per Brevet Type:
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-cyan-400 font-bold block uppercase text-[10px]">🚁 Helikopter Brevet (€250.000)</span>
                          <div className="text-slate-300 text-[11px]">7% (€17.500) + €15.000 vast = <strong className="text-white">€32.500 belasting</strong></div>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-orange-400 font-bold block uppercase text-[10px]">🛩️ Vliegtuig Klein (€500.000)</span>
                          <div className="text-slate-300 text-[11px]">7% (€35.000) + €15.000 vast = <strong className="text-white">€50.000 belasting</strong></div>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1">
                          <span className="text-purple-400 font-bold block uppercase text-[10px]">✈️ Vliegtuig Groot (€750.000)</span>
                          <div className="text-slate-300 text-[11px]">7% (€52.500) + €15.000 vast = <strong className="text-white">€67.500 belasting</strong></div>
                        </div>
                      </div>
                    </div>

                    {/* Table per diploma */}
                    <div className="space-y-3">
                      <h4 className="font-display font-bold text-sm text-white uppercase">Belastingspecificatie per Diploma</h4>
                      {issuedLicenses.length === 0 ? (
                        <div className="p-6 text-center bg-slate-900/40 rounded-2xl border border-dashed border-white/10 text-xs text-slate-500 font-mono">
                          Er zijn momenteel geen geregistreerde diploma's om belasting over te berekenen.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs font-mono">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-bold">
                                <th className="py-3 px-4">Diplomacode</th>
                                <th className="py-3 px-4">Datum</th>
                                <th className="py-3 px-4">Piloot / Burger</th>
                                <th className="py-3 px-4">Diploma Type</th>
                                <th className="py-3 px-4">7% Brutowinst</th>
                                <th className="py-3 px-4">€15k Vaste Toeslag</th>
                                <th className="py-3 px-4">Totaal Belasting</th>
                                <th className="py-3 px-4 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-300">
                              {issuedLicenses.map((lic) => {
                                const details = getFinancialDetails(lic.licenseType);
                                const totalTax = details.standardTax + details.grossTax;

                                return (
                                  <tr key={lic.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-[#ea580c]">{lic.id}</td>
                                    <td className="py-3.5 px-4 text-slate-400">{lic.issueDate}</td>
                                    <td className="py-3.5 px-4 font-sans font-medium text-white">{lic.citizenName}</td>
                                    <td className="py-3.5 px-4">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase text-slate-950 ${
                                        lic.licenseType === "helicopter" 
                                          ? "bg-cyan-400" 
                                          : lic.licenseType === "small-plane" 
                                          ? "bg-orange-400" 
                                          : "bg-purple-400"
                                      }`}>
                                        {getLicenseTypeLabel(lic.licenseType)}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-300">€{details.grossTax.toLocaleString("nl-NL")}</td>
                                    <td className="py-3.5 px-4 text-slate-300">€{details.standardTax.toLocaleString("nl-NL")}</td>
                                    <td className="py-3.5 px-4 font-bold text-orange-400">€{totalTax.toLocaleString("nl-NL")}</td>
                                    <td className="py-3.5 px-4 text-center">
                                      <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase ${
                                        lic.taxPaid 
                                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                                      }`}>
                                        {lic.taxPaid ? "✓ Afgedragen" : "⚠️ Openstaand"}
                                      </span>
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
                </div>
              )}

              {/* TAB 5: PRESTATIES & BONUSSEN */}
              {activeTab === "leaderboard" && (
                <div className="space-y-8 animate-fade-in font-mono text-xs text-slate-300">
                  <div className="bg-slate-950/80 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-[#ea580c]" />
                          <h3 className="font-display font-black text-xl text-white uppercase">
                            Instructeurs Prestaties & Ranglijst
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 font-light font-sans mt-1">
                          Ranglijst gesorteerd op wie de meeste brevetten uitschrijft. Beloon top-presteerders met extra bonussen per brevet.
                        </p>
                      </div>

                      <span className="text-xs font-mono bg-[#ea580c]/10 text-[#ea580c] px-3.5 py-1.5 rounded-full border border-[#ea580c]/20 font-bold">
                        🏆 Top Performers
                      </span>
                    </div>

                    {employeeStats.length === 0 ? (
                      <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-white/10 text-xs text-slate-500">
                        Nog geen actieve instructeurs-gegevens bekend.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employeeStats.map((emp, index) => {
                          const rankBadge = index === 0 ? "🥇 1e Plaats (Top Performer)" : index === 1 ? "🥈 2e Plaats" : index === 2 ? "🥉 3e Plaats" : `#${index + 1} Instructeur`;
                          const isTop1 = index === 0;

                          return (
                            <div key={emp.fullname} className={`bg-slate-900/80 border rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                              isTop1 ? "border-amber-500/50 shadow-xl shadow-amber-500/10" : "border-white/10 hover:border-white/20"
                            }`}>
                              {isTop1 && (
                                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[9px] font-mono font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                                  MEESTE BREVETTEN
                                </div>
                              )}

                              <div className="space-y-4">
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                                    {rankBadge}
                                  </span>
                                  <h4 className="font-display font-bold text-white text-lg">{emp.fullname}</h4>
                                  <span className="text-[10px] font-mono text-slate-400 uppercase capitalize">{emp.role}</span>
                                </div>

                                <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-2 font-mono">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-sans">Totaal Brevetten:</span>
                                    <strong className="text-2xl font-black text-[#ea580c]">{emp.totalLicensesCount}</strong>
                                  </div>

                                  <div className="grid grid-cols-3 gap-1.5 text-center text-[9.5px] pt-2 border-t border-white/5 text-slate-400">
                                    <div className="bg-slate-900 p-1.5 rounded-lg border border-white/5">
                                      <span className="text-slate-500 block text-[8px]">HELI</span>
                                      <strong className="text-white font-bold">{emp.counts.helicopter}</strong>
                                    </div>
                                    <div className="bg-slate-900 p-1.5 rounded-lg border border-white/5">
                                      <span className="text-slate-500 block text-[8px]">KLEIN</span>
                                      <strong className="text-white font-bold">{emp.counts.smallPlane}</strong>
                                    </div>
                                    <div className="bg-slate-900 p-1.5 rounded-lg border border-white/5">
                                      <span className="text-slate-500 block text-[8px]">GROOT</span>
                                      <strong className="text-white font-bold">{emp.counts.largePlane}</strong>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5 text-xs font-mono pt-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Omzet Gegenereerd:</span>
                                    <strong className="text-emerald-400">€{emp.generatedRevenue.toLocaleString("nl-NL")}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Commissie Verdiend:</span>
                                    <strong className="text-white">€{emp.commissions.total.toLocaleString("nl-NL")}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Bonussen Ontvangen:</span>
                                    <strong className="text-amber-400">€{emp.totalBonuses.toLocaleString("nl-NL")}</strong>
                                  </div>
                                </div>
                              </div>

                              {(role === "owner" || role === "manager") && (
                                <div className="mt-5 pt-4 border-t border-white/10">
                                  {emp.licenses.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const lastLic = emp.licenses[0];
                                        setBonusModalLic(lastLic);
                                        setBonusInputValue(5000);
                                        setBonusNoteInput(`Bonus voor top prestatie (${emp.totalLicensesCount} brevetten)`);
                                      }}
                                      className="w-full bg-[#ea580c]/20 hover:bg-[#ea580c]/30 border border-[#ea580c]/40 text-[#ea580c] font-bold font-mono py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                                    >
                                      <span>🎁 Ken Bonus Toe</span>
                                    </button>
                                  ) : (
                                    <div className="text-[10px] text-slate-500 text-center font-mono py-1">Geen actieve brevetten om te belonen</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: DEDICATED INSTELLINGEN & PERSONEEL PAGE */}
              {activeTab === "settings" && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* System Settings Header Card */}
                  <div className="bg-slate-950/80 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="h-10 w-10 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded-2xl flex items-center justify-center text-[#ea580c]">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-xl text-white uppercase">
                          Systeem- & Organisatie Instellingen
                        </h3>
                        <p className="text-xs text-slate-400 font-light">
                          Beheer organisatiedetails, rollen en personeel van Luchtvaart Centrum Oranjestad.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs pt-2">
                      <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 space-y-1">
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Standplaats</span>
                        <strong className="text-white font-bold text-sm block">Oranjestad</strong>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 space-y-1">
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Valuta</span>
                        <strong className="text-white font-bold text-sm block">Euro (€)</strong>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 space-y-1">
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Belasting Cyclus</span>
                        <strong className="text-white font-bold text-sm block">14 Dagen</strong>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 space-y-1">
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold">Security</span>
                        <strong className="text-emerald-400 font-bold text-sm block">OAuth2 Actief</strong>
                      </div>
                    </div>
                  </div>

                  {/* Staff Management Section (Form + Accounts Table) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Form to CREATE new user account */}
                    <div className="md:col-span-5 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                        <UserCheck className="h-5 w-5 text-[#ea580c]" />
                        <h3 className="font-display font-semibold text-base text-white">Nieuw Account Registreren</h3>
                      </div>

                      {userCreatedMessage && (
                        <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 text-xs rounded-xl flex gap-2 items-center">
                          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                          <span>{userCreatedMessage}</span>
                        </div>
                      )}

                      <form onSubmit={handleCreateUser} className="space-y-4 font-mono text-xs text-slate-300">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Volledige Naam Medewerker</label>
                          <input
                            type="text"
                            required
                            placeholder="bijv: Maria Sanchez"
                            value={newFullname}
                            onChange={(e) => setNewFullname(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ea580c] outline-none text-xs font-sans text-slate-200"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Gebruikersnaam / Login ID</label>
                          <input
                            type="text"
                            required
                            placeholder="bijv: marias"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ea580c] outline-none text-xs text-slate-200"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold text-amber-500 font-mono">Wachtwoord</label>
                          <input
                            type="text"
                            required
                            placeholder="Wachtwoord"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ea580c] outline-none text-xs font-mono text-slate-200"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-500 uppercase tracking-widest block">Rol / Bevoegdheden</label>
                          <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as any)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:border-[#ea580c] outline-none text-xs text-slate-300 font-sans"
                          >
                            <option value="medewerker">Medewerker (Mag diploma's uitschrijven)</option>
                            <option value="manager">Manager (Mag diploma's + beheer)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold font-mono py-3 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#ea580c]/15"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Maak Account Aan</span>
                        </button>
                      </form>
                    </div>

                    {/* LIST of active registered users accounts */}
                    <div className="md:col-span-7 bg-slate-950 border border-white/10 p-6 rounded-3xl">
                      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                        <Users className="h-5 w-5 text-[#ea580c]" />
                        <h3 className="font-display font-semibold text-base text-white">Geregistreerde Medewerkers & Wachtwoorden</h3>
                      </div>

                      <p className="text-xs text-slate-400 font-light mb-6">
                        Lijst van alle bevoegde medewerkers. U kunt wachtwoorden inzien of medewerkers ontslaan (wissen).
                      </p>

                      <div className="space-y-3">
                        {staffAccounts.map((user) => (
                          <div key={user.id} className="group/credential bg-slate-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 font-mono text-xs hover:border-[#ea580c]/40 transition-all duration-300">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm text-white font-sans">{user.fullname}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                  user.role === "owner" 
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" 
                                    : user.role === "manager" 
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" 
                                    : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                                }`}>
                                  {user.role}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-2 space-y-1.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span>Gebruikersnaam:</span>
                                  <strong className="text-slate-200">{user.username}</strong>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span>Wachtwoord:</span>
                                  <strong className="text-amber-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-white/5">{user.passwordHash}</strong>
                                </div>
                              </div>
                            </div>

                            {user.role !== "owner" && (role === "owner" || role === "manager") && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                                title="Account wissen / medewerker ontslaan"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })()}

        {/* Custom Alert Modal */}
        {portalAlertMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl max-w-md w-full mx-4 shadow-2xl relative">
              <div className="flex items-center gap-3 text-[#ea580c] mb-4">
                <AlertCircle className="h-6 w-6 shrink-0" />
                <h3 className="font-display font-semibold text-lg text-white">Systeembericht</h3>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-mono">
                {portalAlertMessage}
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setPortalAlertMessage(null)}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold font-mono py-2 px-5 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {deleteConfirmationUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl max-w-md w-full mx-4 shadow-2xl relative">
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <Trash2 className="h-6 w-6 shrink-0" />
                <h3 className="font-display font-semibold text-lg text-white">Medewerker Ontslaan?</h3>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-mono">
                Weet u zeker dat u de medewerker <strong className="text-white">'{deleteConfirmationUser.fullname}'</strong> wilt ontslaan en zijn account wilt wissen? Dit kan niet ongedaan worden gemaakt.
              </p>
              <div className="mt-6 flex justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => setDeleteConfirmationUser(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl cursor-pointer border border-slate-800/80 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="bg-red-500 hover:bg-red-700 text-slate-950 font-bold py-2.5 px-5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Ontslaan & Wissen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Tax Confirmation Modal */}
        {taxConfirmationData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl max-w-lg w-full mx-4 shadow-2xl relative">
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <Coins className="h-6 w-6 shrink-0" />
                <h3 className="font-display font-semibold text-lg text-white">Belastingen Afdragen</h3>
              </div>
              <div className="space-y-3 text-slate-300 text-xs font-mono leading-relaxed">
                <p>Weet u zeker dat u de openstaande belastingen wilt afdragen aan de overheid?</p>
                <div className="bg-slate-900 border border-slate-850 p-3.5 rounded-2xl space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span>Totaal openstaand:</span>
                    <strong className="text-amber-500">€{taxConfirmationData.unpaidTaxes.toLocaleString("nl-NL")}</strong>
                  </div>
                  <div className="border-t border-slate-850 my-1 pt-1 opacity-60" />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>- 7% Brutowinst belasting:</span>
                    <span>€{taxConfirmationData.unpaidGrossTax.toLocaleString("nl-NL")}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>- Vast brevet-tarief (15k p.p.):</span>
                    <span>€{taxConfirmationData.unpaidStandardTax.toLocaleString("nl-NL")}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 font-mono text-xs">
                <button
                  onClick={() => setTaxConfirmationData(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800/80 font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={() => {
                    taxConfirmationData.callback();
                    setTaxConfirmationData(null);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-slate-950 font-bold py-2.5 px-5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Voldoen & Afdragen
                </button>
              </div>
            </div>
          </div>
        )}
        {bonusModalLic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-950 border border-white/10 p-6 sm:p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl relative space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 text-[#ea580c]">
                <Coins className="h-6 w-6 shrink-0 text-[#ea580c]" />
                <div>
                  <h3 className="font-display font-bold text-lg text-white uppercase">Bonus Toekennen</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Instructeur: <strong className="text-white">{bonusModalLic.issuedBy}</strong> | Brevet: <span className="text-[#ea580c]">{bonusModalLic.id}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs text-slate-300">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1.5 font-bold">
                    Bonus Bedrag (€)
                  </label>
                  <input
                    type="number"
                    value={bonusInputValue}
                    onChange={(e) => setBonusInputValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 focus:border-[#ea580c] rounded-xl px-4 py-3 text-sm text-emerald-400 font-bold outline-none"
                  />

                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {[2500, 5000, 10000, 25000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBonusInputValue(preset)}
                        className="bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        +€{preset.toLocaleString("nl-NL")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1.5 font-bold">
                    Reden / Toelichting Bonus
                  </label>
                  <input
                    type="text"
                    value={bonusNoteInput}
                    onChange={(e) => setBonusNoteInput(e.target.value)}
                    placeholder="bijv: Beloning voor uitstekende prestaties"
                    className="w-full bg-slate-900 border border-white/10 focus:border-[#ea580c] rounded-xl px-4 py-2.5 text-xs text-white outline-none font-sans"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setBonusModalLic(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl cursor-pointer border border-white/10"
                >
                  Annuleren
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!bonusModalLic) return;
                    if (role !== "owner" && role !== "manager") {
                      setPortalAlertMessage("Alleen de directie mag bonussen toekennen!");
                      return;
                    }
                    const updatedLic: IssuedLicense = {
                      ...bonusModalLic,
                      bonusAmount: bonusInputValue,
                      bonusNote: bonusNoteInput,
                      bonusPaid: true
                    };
                    onUpdateLicense(updatedLic);
                    setBonusModalLic(null);
                    setPortalAlertMessage(`Bonus van €${bonusInputValue.toLocaleString("nl-NL")} succesvol toegekend aan ${updatedLic.issuedBy}!`);
                  }}
                  className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-slate-950 font-bold py-2.5 px-5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#ea580c]/20"
                >
                  Bonus Fiatteren & Uitkeren
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
