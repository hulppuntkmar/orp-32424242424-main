export interface License {
  id: string;
  name: string;
  type: "helicopter" | "small-plane" | "large-plane";
  price: number;
  description: string;
  category: string;
  difficulty: "Gemiddeld" | "Beginner" | "Gevorderd";
  requirements: string[];
  specs: {
    duration: string;
    hoursRequired: number;
    maxAltitude: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Aircraft {
  id: string;
  name: string;
  type: "helicopter" | "small-plane" | "large-plane";
  manufacturer: string;
  basePrice: number;
  topSpeedKnots: number;
  rangeKm: number;
  engineType: string;
  capacity: number;
  description: string;
  imageTheme: string;
  imageUrl?: string;
}

export interface StaffUser {
  id: string;
  username: string;
  passwordHash: string; // clear text password for simple storage
  role: "owner" | "manager" | "medewerker";
  fullname: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  instructor: string;
  description: string;
  durationWeeks: number;
  price: number;
  topics: string[];
  rating: number;
}

export interface Message {
  id: string;
  sender: "user" | "atc";
  content: string;
  timestamp: string;
}

export interface Telemetry {
  altitude: number;
  speed: number;
  fuel: number;
  heading: number;
  wind: string;
  status: string;
}

export interface PilotLogbook {
  totalHours: number;
  helicopterHours: number;
  smallPlaneHours: number;
  largePlaneHours: number;
  completedQuizzes: string[]; // ids of licensed types
  completedSimulators: string[]; // ids of licensed types
  unlockedLicenses: string[]; //ids of licensed types
  ownedAircraft: Array<{
    id: string;
    name: string;
    configuredColor: string;
    configuredAvionics: string;
    totalPrice: number;
    orderDate: string;
  }>;
}

export interface IssuedLicense {
  id: string;
  citizenName: string;
  citizenId: string; // CID / BSN
  licenseType: "helicopter" | "small-plane" | "large-plane";
  issuedBy: string; // Staff member who signed it off
  issuedByDiscordId?: string;
  issueDate: string;
  remarks?: string;
  employeeCommissionPaid?: boolean;
  taxPaid?: boolean;
  managementFeePaid?: boolean;
  bonusAmount?: number;
  bonusPaid?: boolean;
  bonusNote?: string;
  updatedAt?: number;
  strikes?: number;
  strikeReasons?: string[];
  revoked?: boolean;
  revokedBy?: string;
  revokeDate?: string;
  revokeReason?: string;
  kluApproved?: boolean;
  isPreExisting?: boolean;
}

export interface AircraftInventory {
  aircraftId: string;
  stockCount: number;
  status: "Op voorraad" | "Gereserveerd" | "Uitverkocht";
  priceOverride?: number;
}

export interface KluHandbookChapter {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface LicenseLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  performedByRole?: string;
  citizenName?: string;
  citizenId?: string;
  targetId?: string;
  details?: string;
}


