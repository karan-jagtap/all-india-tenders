import {
  PredictedBidRank,
  PricingPosture,
  BidCoverStatus,
  MatchingConfidenceLevel
} from './enums';

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
  rank: PredictedBidRank;
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
  pricingPosture: PricingPosture;
  fleetMobilityIndex: string;
  coverStatus: BidCoverStatus;
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
  matchingConfidenceLevel: MatchingConfidenceLevel;
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
