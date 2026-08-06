export interface IssuedLicense {
  id: string;
  pilotName: string;
  bsn: string;
  type: string;
  issueDate: string;
  instructorName?: string;
  docent?: string;
  klant?: string;
  categorie?: string;
  commissieStatus?: string;
  belastingStatus?: string;
}

export interface AircraftInventory {
  id: string;
  name: string;
  type: string;
  stock: number;
  price: number;
}

export interface Aircraft {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  speed: string;
  passengers: number;
}

export interface PilotLogbook {
  totalHours: number;
  helicopterHours: number;
  smallPlaneHours: number;
  largePlaneHours: number;
  completedQuizzes: string[];
  completedSimulators: string[];
  unlockedLicenses: string[];
  ownedAircraft: any[];
}