import {
  RiskLevel,
  AuthorityStrictness,
  VolatilityRisk,
  RiskVerdict,
  StatutoryChecklistStatus
} from './enums';

export interface TenderClauseRiskAnalysis {
  id: string;
  clauseName: string;
  standardSbdReference: string;
  volumeSection: string;
  riskLevel: RiskLevel;
  extractedFormulaOrRule: string;
  riskAssessmentSummary: string;
  contractorMitigationAdvice: string;
  authorityStrictness: AuthorityStrictness;
}

export interface BOQParetoCostDriver {
  itemNo: string;
  description: string;
  unit: string;
  estimatedQuantity: number;
  estimatedRateInr: number;
  totalAmountInr: number;
  costSharePct: number;
  cumulativeParetoPct: number;
  isParetoDriver80_20: boolean;
  materialSensitivity: string;
  volatilityRisk: VolatilityRisk;
  hedgingStrategy: string;
}

export interface DeepDocumentRAGReport {
  tenderId: string;
  nitNumber: string;
  title: string;
  organization: string;
  estimatedCostInr: number;
  overallRiskScore: number;
  riskVerdict: RiskVerdict;
  pvcProtectionAvailable: boolean;
  mobilizationAdvanceAvailable: boolean;
  ldCapPct: number;
  dlpMonths: number;
  pbgPct: number;
  clauses: TenderClauseRiskAnalysis[];
  paretoCostDrivers: BOQParetoCostDriver[];
  statutoryChecklist: Array<{
    title: string;
    status: StatutoryChecklistStatus;
    detail: string;
  }>;
}
