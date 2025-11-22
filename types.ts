
export type Language = 'en' | 'bn';

export enum PlantHealthStatus {
  HEALTHY = "Healthy",
  DISEASED = "Diseased",
  PEST_INFESTED = "Pest Infested",
  NUTRIENT_DEFICIENT = "Nutrient Deficient",
  UNKNOWN = "Unknown"
}

export interface Taxonomy {
  genus: string;
  family: string;
  order: string;
}

export interface Morphology {
  leaves: string;
  flowers: string;
  fruits: string;
  stems: string;
  roots: string; 
  nectar?: string;
}

export interface CareRequirements {
  light: string;
  water: string;
  soil: string;
  humidity: string;
  temperature: string;
  fertilizer: string;
  propagation: string; 
  pruning: string; 
}

export interface EcologicalInfo {
  nativeRegion: string;
  habitat: string;
  role: string;
  companions: string[]; 
}

export interface SafetyProfile {
  isPoisonous: boolean;
  poisonDetails: string; 
  isInvasive: boolean;
  isEndangered: boolean;
  isMedicinal: boolean;
  medicinalUses: string; 
  notes: string;
}

export interface SimilarSpecies {
  name: string;
  difference: string;
}

export interface DiagnosticResult {
  status: PlantHealthStatus;
  details: string;
  treatment: string;
  prevention: string; 
}

export interface Folklore {
  origin: string;
  stories: string;
}

export interface PlantIdentification {
  id: string;
  scientificName: string;
  commonNames: string[];
  confidence: number;
  description: string;
  benefits: string;
  reasoning: string;
  taxonomy: Taxonomy;
  morphology: Morphology;
  care: CareRequirements;
  ecology: EcologicalInfo;
  safety: SafetyProfile;
  diagnostics: DiagnosticResult;
  similarSpecies: SimilarSpecies[];
  folklore: Folklore; 
  timestamp: number;
  imageUrl: string; 
  language: Language; 
}

export interface AppState {
  history: PlantIdentification[];
  currentScan: PlantIdentification | null;
  isAnalyzing: boolean;
  error: string | null;
  language: Language;
}