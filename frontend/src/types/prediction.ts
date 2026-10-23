export interface ClearingProbabilityBand {
  bandLabel: string;
  discountRange: string;
  priceRangeInr: string;
  clearanceProbabilityPct: number;
  riskEbitdaImpact: string;
  colorClass: string;
  isRecommended: boolean;
  isCurseZone: boolean;
}

export interface PredictedCompetitorBid {
  rank: 'L1 (Predicted Winner)' | 'L2' | 'L3' | 'L4' | 'L5';
  bidderName: string;
  headquarters: string;
  contractorClass: string;
  annualTurnoverCr: number;
  quotedAmountInr: number;
  variancePct: number;
  deltaL1Inr: number;
  deltaL1Pct: number;
  technicalScore: number;
  logisticsAdvantage: string;
  biddingStrategy: string;
  sectorWinRatePct: number;
  solvencyRatio: number;
  orderBookCr: number;
  headToHeadRecord: string;
  pricingPosture: 'Aggressive DSR Discounter' | 'Balanced EPC Contractor' | 'Conservative Margin-First';
  fleetMobilityIndex: string;
  coverStatus: 'COVER 1 & 2 PASSED' | 'EVALUATED RESPONSIVE';
}

export interface PreBidSimulationReport {
  tenderId: string;
  nitNumber: string;
  title: string;
  organization: string;
  estimatedCostInr: number;
  predictedL1QuoteInr: number;
  predictedL1VariancePct: number;
  winningSweetSpotMinInr: number;
  winningSweetSpotMaxInr: number;
  winningSweetSpotMinPct: number;
  winningSweetSpotMaxPct: number;
  winnersCurseThresholdInr: number;
  winnersCurseThresholdPct: number;
  estimatedTurnoutCount: number;
  confidenceScorePct: number;
  matchingConfidenceLevel: 'HIGH (Level-1/2 Authority Benchmark)' | 'MEDIUM (Regional DSR Curve)' | 'ESTIMATE (GFR PQC Capacity Model)';
  authorityHistoricalClearancePattern: string;
  bids: PredictedCompetitorBid[];
  probabilityBands: ClearingProbabilityBand[];
  strategicAdvice: {
    recommendedPriceWindow: string;
    targetAction: string;
    riskAlert: string;
    complianceKey: string;
  };
}
