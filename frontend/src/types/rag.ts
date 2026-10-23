export interface TenderClauseRiskAnalysis {
  id: string;
  clauseName: string;
  standardSbdReference: string;
  volumeSection: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  extractedFormulaOrRule: string;
  riskAssessmentSummary: string;
  contractorMitigationAdvice: string;
  authorityStrictness: 'STRICT ENFORCEMENT' | 'STANDARD GFR BENCHMARK' | 'DISCRETIONARY';
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
  volatilityRisk: 'HIGH SENSITIVITY' | 'MEDIUM SENSITIVITY' | 'LOW SENSITIVITY';
  hedgingStrategy: string;
}

export interface DeepDocumentRAGReport {
  tenderId: string;
  nitNumber: string;
  title: string;
  organization: string;
  estimatedCostInr: number;
  overallRiskScore: number;
  riskVerdict: 'HIGHLY BANKABLE (LOW RISK)' | 'MODERATE COMMERCIAL RISK' | 'HIGH LEGAL EXPOSURE';
  pvcProtectionAvailable: boolean;
  mobilizationAdvanceAvailable: boolean;
  ldCapPct: number;
  dlpMonths: number;
  pbgPct: number;
  clauses: TenderClauseRiskAnalysis[];
  paretoCostDrivers: BOQParetoCostDriver[];
  statutoryChecklist: Array<{
    title: string;
    status: 'COMPLIANT' | 'CRITICAL ATTENTION' | 'VERIFIED GFR';
    detail: string;
  }>;
}
