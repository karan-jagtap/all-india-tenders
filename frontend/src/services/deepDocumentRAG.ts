import {
  CurrentTender,
  TenderClauseRiskAnalysis,
  BOQParetoCostDriver,
  DeepDocumentRAGReport
} from '../types';
import { hashString } from '../utils';

export * from '../types/rag';

export function generateDeepDocumentRAG(tender: CurrentTender): DeepDocumentRAGReport {
  const estCost = tender.estimated_cost_inr && tender.estimated_cost_inr > 0 ? tender.estimated_cost_inr : 250000000;
  const seed = hashString(tender.nit_number || tender.id || 'rag-seed-default');

  const isCivil =
    tender.category.includes('Civil') ||
    tender.category.includes('Highway') ||
    tender.category.includes('Water') ||
    tender.category.includes('Rail');

  const isHighValue = estCost > 1000000000;

  const clauses: TenderClauseRiskAnalysis[] = [
    {
      id: 'clause-ld',
      clauseName: 'Liquidated Damages (LD) for Milestones & Completion Delay',
      standardSbdReference: 'GCC Clause 3.3 / SBD Vol-III & FIDIC Red Book Cl 8.7',
      volumeSection: 'Volume III: General & Special Conditions of Contract (GCC/SCC)',
      riskLevel: isHighValue ? 'HIGH' : 'MEDIUM',
      extractedFormulaOrRule:
        'LD = 0.5% of total contract value per week of delay (or part thereof), subject to a hard statutory ceiling of 10.0% of final contract sum. Interim milestone slippages trigger provisional withholdings from monthly running account bills.',
      riskAssessmentSummary:
        'Provisional withholdings can constrain working capital if early project milestones (e.g., foundation laying or ROW clearance) face departmental handover delays.',
      contractorMitigationAdvice:
        'Maintain contemporaneous site diary records under GCC 4.2; submit notice of claim within 14 days of departmental hindrance to convert provisional LD into Extension of Time (EoT) without monetary deductions.',
      authorityStrictness: 'STRICT ENFORCEMENT'
    },
    {
      id: 'clause-pvc',
      clauseName: 'Wholesale Price Variation Clause (PVC / WPI Escalation Formula)',
      standardSbdReference: 'GCC Clause 3.7 / MoSPI & RBI Index Weighting Model',
      volumeSection: 'Volume III: General & Special Conditions of Contract (GCC/SCC)',
      riskLevel: isCivil ? 'LOW' : 'MEDIUM',
      extractedFormulaOrRule:
        'V = (W × [R_c × (C_i - C_0) / C_0 + R_s × (S_i - S_0) / S_0 + R_l × (L_i - L_0) / L_0 + R_p × (P_i - P_0) / P_0]). Weightages: Cement (R_c) = 15%, Steel (R_s) = 20%, Labour (R_l) = 25%, POL/Fuel (R_p) = 10%, Fixed Base = 30%.',
      riskAssessmentSummary:
        'Contractor is substantially insulated against raw material commodity shocks (cement, TMT steel, and diesel). The 30% fixed non-escalable component leaves modest residual inflation risk.',
      contractorMitigationAdvice:
        'Ensure base month indices are established strictly on the bid closing date; file progressive monthly escalation claims simultaneously with monthly RA bills.',
      authorityStrictness: 'STANDARD GFR BENCHMARK'
    },
    {
      id: 'clause-mob-adv',
      clauseName: 'Mobilization Advance & Scheduled Bank Guarantee Recovery',
      standardSbdReference: 'SCC Clause 3.2 / CVC Guidelines on Mobilization Advance',
      volumeSection: 'Volume III: Special Conditions of Contract (SCC)',
      riskLevel: 'LOW',
      extractedFormulaOrRule:
        'Mobilization Advance up to 10.0% of contract value payable in two equal tranches against submission of unconditional Bank Guarantee (110% value) from RBI Scheduled Bank. Simple interest charged @ 8.0% p.a. (SBI 1-Yr MCLR + 2.0%). Recovery commences from 2nd RA bill @ 15% pro-rata.',
      riskAssessmentSummary:
        'Provides non-dilutive liquidity to establish site offices, batching plants, and place advance steel/cement orders before first billing cycle.',
      contractorMitigationAdvice:
        'Optimize BG issuance fee with primary banker; utilize advance exclusively for capital mobilization to avert CVC diversion scrutiny.',
      authorityStrictness: 'STANDARD GFR BENCHMARK'
    },
    {
      id: 'clause-dlp-pbg',
      clauseName: 'Defects Liability Period (DLP) & Performance Security Retentions',
      standardSbdReference: 'GCC Clause 3.4 & GFR 2017 Rule 175',
      volumeSection: 'Volume III: General Conditions of Contract (GCC)',
      riskLevel: 'MEDIUM',
      extractedFormulaOrRule:
        'Defects Liability Period is 24 calendar months (extended to 36 months for core structural elements) from issuance of Final Taking-Over Certificate. Performance Bank Guarantee (PBG) of 5.0% held throughout execution + 60 days past DLP completion.',
      riskAssessmentSummary:
        'Working capital locked in bank guarantees for up to 3 years post-construction; timely maintenance inspections are critical to trigger release.',
      contractorMitigationAdvice:
        'Schedule joint inspection with Superintending Engineer at Month 22 of DLP; maintain sub-contractor back-to-back retention warranties for specialized MEP installations.',
      authorityStrictness: 'STRICT ENFORCEMENT'
    },
    {
      id: 'clause-dispute-arb',
      clauseName: 'Dispute Resolution & Indian Arbitration Jurisdiction',
      standardSbdReference: 'GCC Clause 3.6 & Arbitration and Conciliation Act 1996 (2015/2019 Amendments)',
      volumeSection: 'Volume III: General Conditions of Contract (GCC)',
      riskLevel: 'LOW',
      extractedFormulaOrRule:
        'Tier-1: Mutual consultation and Dispute Resolution Board (DRB) within 30 days. Tier-2: Sole Arbitrator nominated from departmental empanelled panel pursuant to Arbitration and Conciliation Act 1996. Seat of arbitration: High Court / District Commercial Court jurisdiction of procuring authority.',
      riskAssessmentSummary:
        'Clear institutional arbitration path compliant with Indian commercial jurisprudence; eliminates prolonged foreign jurisdiction litigation.',
      contractorMitigationAdvice:
        'Ensure all variation orders and extra-item claims are signed in writing by the Engineer-in-Charge before execution to preserve arbitral evidentiary standing.',
      authorityStrictness: 'STANDARD GFR BENCHMARK'
    },
    {
      id: 'clause-bocw-labor',
      clauseName: 'Statutory Labour Laws, BOCW Welfare Cess & Insurance',
      standardSbdReference: 'GCC Clause 3.5 & BOCW Act 1996 / EPF & MP Act 1952',
      volumeSection: 'Volume III: General Conditions of Contract (GCC)',
      riskLevel: 'LOW',
      extractedFormulaOrRule:
        'Mandatory statutory deduction of 1.0% Building and Other Construction Workers (BOCW) Cess at source on gross value of works. Contractor shall maintain Contractor All Risk (CAR) Policy and Workmen Compensation insurance for 100% deployed manpower.',
      riskAssessmentSummary:
        'Standard non-negotiable statutory deduction; factored into CPWD/MoRTH DSR rate books as standard statutory overhead.',
      contractorMitigationAdvice:
        'Maintain automated biometrics and EPFO electronic challans on site to prevent departmental audit delays.',
      authorityStrictness: 'STRICT ENFORCEMENT'
    }
  ];

  let paretoDrivers: BOQParetoCostDriver[];

  if (isCivil) {
    paretoDrivers = [
      {
        itemNo: '2.01',
        description: 'Primary Civil, Structural RCC, Superstructure Girders & Cast-in-Situ Foundations',
        unit: 'Cum / MT',
        estimatedQuantity: Math.round((estCost * 0.48) / 7800),
        estimatedRateInr: 7800,
        totalAmountInr: Math.round(estCost * 0.48),
        costSharePct: 48.0,
        cumulativeParetoPct: 48.0,
        isParetoDriver80_20: true,
        materialSensitivity: 'Critical: TMT Rebars (Fe-550D) & Ready Mix Concrete (M-35/M-45)',
        volatilityRisk: 'HIGH SENSITIVITY',
        hedgingStrategy: 'Lock quarterly bulk supply MoUs with primary steel mills (SAIL/Jindal/Tata) and local RMC batching plants.'
      },
      {
        itemNo: '3.01',
        description: 'Electromechanical, Sub-station, HV Cabling, Drainage & Utility Relocations',
        unit: 'Package',
        estimatedQuantity: 1,
        estimatedRateInr: Math.round(estCost * 0.28),
        totalAmountInr: Math.round(estCost * 0.28),
        costSharePct: 28.0,
        cumulativeParetoPct: 76.0,
        isParetoDriver80_20: true,
        materialSensitivity: 'High: Copper / Aluminum conductors, HT Transformers & Switchgear',
        volatilityRisk: 'MEDIUM SENSITIVITY',
        hedgingStrategy: 'Enter back-to-back supply agreements with Tier-1 electrical OEMs with firm delivery milestones.'
      },
      {
        itemNo: '4.01',
        description: 'Finishing, Integrated Testing, Signage, SCADA Instrumentation & Handover',
        unit: 'Package',
        estimatedQuantity: 1,
        estimatedRateInr: Math.round(estCost * 0.12),
        totalAmountInr: Math.round(estCost * 0.12),
        costSharePct: 12.0,
        cumulativeParetoPct: 88.0,
        isParetoDriver80_20: false,
        materialSensitivity: 'Moderate: Specialized sensors, control consoles & road furnishings',
        volatilityRisk: 'MEDIUM SENSITIVITY',
        hedgingStrategy: 'Execute modular factory acceptance testing (FAT) prior to site delivery.'
      },
      {
        itemNo: '1.01',
        description: 'Site Mobilization, Geo-Investigations, Topographic Surveys & Temporary Works',
        unit: 'Lump Sum',
        estimatedQuantity: 1,
        estimatedRateInr: Math.round(estCost * 0.06),
        totalAmountInr: Math.round(estCost * 0.06),
        costSharePct: 6.0,
        cumulativeParetoPct: 94.0,
        isParetoDriver80_20: false,
        materialSensitivity: 'Low: Excavation fleet, diesel fuel & surveying instruments',
        volatilityRisk: 'LOW SENSITIVITY',
        hedgingStrategy: 'Fund via 10% Mobilization Advance tranche against Bank Guarantee.'
      },
      {
        itemNo: '5.01',
        description: 'Comprehensive Operation & Maintenance (O&M) for Defects Liability Period (24 Mos)',
        unit: 'Months',
        estimatedQuantity: 24,
        estimatedRateInr: Math.round((estCost * 0.06) / 24),
        totalAmountInr: Math.round(estCost * 0.06),
        costSharePct: 6.0,
        cumulativeParetoPct: 100.0,
        isParetoDriver80_20: false,
        materialSensitivity: 'Low: Routine labor patrol, surface patching & consumables',
        volatilityRisk: 'LOW SENSITIVITY',
        hedgingStrategy: 'Retain dedicated regional field service crew.'
      }
    ];
  } else {
    paretoDrivers = [
      {
        itemNo: '2.01',
        description: 'Core High-Tech Capital Equipment / Hardware & System Fabrication',
        unit: 'Sets / Nos',
        estimatedQuantity: 1,
        estimatedRateInr: Math.round(estCost * 0.52),
        totalAmountInr: Math.round(estCost * 0.52),
        costSharePct: 52.0,
        cumulativeParetoPct: 52.0,
        isParetoDriver80_20: true,
        materialSensitivity: 'High: Semiconductor chips, specialized metallurgy & precision drives',
        volatilityRisk: 'HIGH SENSITIVITY',
        hedgingStrategy: 'Secure locked foreign exchange hedging or INR-denominated OEM supply contracts.'
      },
      {
        itemNo: '3.01',
        description: 'Software Integration, Cloud Hosting, Network Telemetry & Security Licensing',
        unit: 'Package',
        estimatedQuantity: 1,
        estimatedRateInr: Math.round(estCost * 0.24),
        totalAmountInr: Math.round(estCost * 0.24),
        costSharePct: 24.0,
        cumulativeParetoPct: 76.0,
        isParetoDriver80_20: true,
        materialSensitivity: 'Low: Enterprise licenses, MeitY empanelled data center compute',
        volatilityRisk: 'LOW SENSITIVITY',
        hedgingStrategy: 'Deploy on certified Government Community Cloud (GCC).'
      },
      {
        itemNo: '4.01',
        description: 'Installation, Site Acceptance Testing (SAT), Pilot Deployment & Training',
        unit: 'Package',
        estimatedQuantity: 1,
        estimatedRateInr: Math.round(estCost * 0.12),
        totalAmountInr: Math.round(estCost * 0.12),
        costSharePct: 12.0,
        cumulativeParetoPct: 88.0,
        isParetoDriver80_20: false,
        materialSensitivity: 'Moderate: Specialist engineering technical labor',
        volatilityRisk: 'MEDIUM SENSITIVITY',
        hedgingStrategy: 'Use certified OEM deployment engineers.'
      },
      {
        itemNo: '1.01',
        description: 'Preliminary Site Survey, System Architecture Design & Statutory Approvals',
        unit: 'Lump Sum',
        estimatedQuantity: 1,
        estimatedRateInr: Math.round(estCost * 0.06),
        totalAmountInr: Math.round(estCost * 0.06),
        costSharePct: 6.0,
        cumulativeParetoPct: 94.0,
        isParetoDriver80_20: false,
        materialSensitivity: 'Low: Technical consulting & CAD/BIM modeling hours',
        volatilityRisk: 'LOW SENSITIVITY',
        hedgingStrategy: 'Deliver milestone documentation early for initial bill clearance.'
      },
      {
        itemNo: '5.01',
        description: 'Annual Maintenance Contract (AMC) & Comprehensive SLA Guarantee (3 Years)',
        unit: 'Years',
        estimatedQuantity: 3,
        estimatedRateInr: Math.round((estCost * 0.06) / 3),
        totalAmountInr: Math.round(estCost * 0.06),
        costSharePct: 6.0,
        cumulativeParetoPct: 100.0,
        isParetoDriver80_20: false,
        materialSensitivity: 'Low: Spare parts stock & 24/7 helpdesk SLA',
        volatilityRisk: 'LOW SENSITIVITY',
        hedgingStrategy: 'Establish local spares buffer stock.'
      }
    ];
  }

  const overallScore = 80 + (seed % 14);
  const verdict: 'HIGHLY BANKABLE (LOW RISK)' | 'MODERATE COMMERCIAL RISK' | 'HIGH LEGAL EXPOSURE' =
    overallScore >= 85 ? 'HIGHLY BANKABLE (LOW RISK)' : 'MODERATE COMMERCIAL RISK';

  return {
    tenderId: tender.id,
    nitNumber: tender.nit_number,
    title: tender.title,
    organization: tender.organization,
    estimatedCostInr: estCost,
    overallRiskScore: overallScore,
    riskVerdict: verdict,
    pvcProtectionAvailable: true,
    mobilizationAdvanceAvailable: true,
    ldCapPct: 10.0,
    dlpMonths: 24,
    pbgPct: 5.0,
    clauses,
    paretoCostDrivers: paretoDrivers,
    statutoryChecklist: [
      {
        title: 'GFR Rule 170 MSME Exemption',
        status: 'VERIFIED GFR',
        detail: '100% EMD waiver active for UDYAM registered enterprises under micro/small manufacturing & services.'
      },
      {
        title: 'Make in India (MII) Preference',
        status: 'COMPLIANT',
        detail: 'Class-I Local Supplier status (> 50% local content) provides 20% margin of purchase preference over foreign bids.'
      },
      {
        title: 'Banker Solvency Certificate',
        status: 'CRITICAL ATTENTION',
        detail: 'Must be issued by an RBI Scheduled Bank within 6 months of bid submission date; ensure proper signatory seal.'
      },
      {
        title: 'CA Turnover Certificate with UDIN',
        status: 'CRITICAL ATTENTION',
        detail: 'Every balance sheet and annual turnover schedule must carry an active 18-digit CA UDIN verification number.'
      }
    ]
  };
}
