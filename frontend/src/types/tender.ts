export interface TenderDocumentMeta {
  doc_id: string;
  doc_type: string;
  title: string;
  file_name: string;
  file_size: string;
  pages: number;
  badge: string;
  download_endpoint: string;
  portal_sourcing_section: string;
  portal_direct_url: string;
  description: string;
}

export interface CurrentTender {
  id: string;
  nit_number: string;
  title: string;
  organization: string;
  ministry?: string;
  source_portal: string;
  portal_url: string;
  portal_search_url?: string;
  category: string;
  tender_type: string;
  estimated_cost_inr: number;
  emd_amount_inr: number;
  tender_fee_inr: number;
  pbg_pct: number;
  published_date: string;
  closing_date: string;
  submission_deadline_time: string;
  days_left: number;
  state: string;
  city: string;
  scope_summary: string;
  turnover_criteria: string;
  solvency_criteria: string;
  experience_criteria?: string;
  status: string;
  bidding_status?: string;
  is_filled?: boolean;
  is_awarded?: boolean;
  scraping_source?: string;
  database_required?: boolean;
  is_ogd_open_data?: boolean;
  ogd_resource_id?: string;
  godl_license?: string;
  departmental_channel?: string;
  open_data_url?: string;
  emd_exemption_eligible?: boolean;
  tender_documents?: TenderDocumentMeta[];
}

export interface EnrichedCurrentTender extends CurrentTender {
  _sourceLabel: string;
  _searchBlob: string;
}

export interface AcceptedTender {
  id: string;
  year: number;
  title: string;
  category: string;
  status?: string;
  award_date: string;
  winning_company: {
    name: string;
    cin: string;
    gstin: string;
    pan: string;
    registered_office: string;
    business_type: string;
    msme_status: string;
    local_content_pct: number;
    local_content_class: string;
    audited_turnover_inr: number;
    ca_udin: string;
    solvency_certificate_inr: number;
    solvency_bank: string;
    project_lead: string;
  };
  og_tender: {
    nit_number: string;
    authority: string;
    ministry?: string;
    portal: string;
    scope_summary: string;
    estimated_cost_inr: number;
    emd_amount_inr?: number;
    pbg_required_pct?: number;
    completion_months?: number;
    min_turnover_inr?: number;
    min_solvency_inr?: number;
    similar_work_criteria?: string;
    published_date?: string;
    closing_date?: string;
  };
  bid_submission: {
    quoted_amount_inr: number;
    quoted_discount_pct: number;
    ranking: string;
    emd_mode?: string;
    emd_reference?: string;
    emd_status?: string;
    pbg_submitted: string;
    cover_1: {
      name: string;
      items: string[];
    };
    cover_2: {
      name: string;
      items: string[];
    };
    cover_3: {
      name: string;
      items: string[];
    };
  };
  acceptance_and_loa: {
    loa_number: string;
    loa_date: string;
    awarding_authority: string;
    contract_agreement_date: string;
    committee_verdict: string;
  };
}

export interface BidderWonContract {
  tender_id: string;
  title: string;
  category: string;
  year: number;
  award_date: string;
  contract_value_inr: number;
  estimated_cost_inr: number;
  discount_pct: number;
  ranking: string;
  authority: string;
  ministry: string;
  portal: string;
  nit_number: string;
  loa_number: string;
  scope_summary?: string;
}

export interface RegisteredBidder {
  id: string;
  slug: string;
  name: string;
  cin: string;
  gstin: string;
  pan: string;
  registered_office: string;
  business_type: string;
  msme_status: string;
  local_content_pct: number;
  local_content_class: string;
  audited_turnover_inr: number;
  ca_udin: string;
  solvency_certificate_inr: number;
  solvency_bank: string;
  project_lead: string;
  credit_rating?: string;
  credit_rating_agency?: string;
  win_rate_pct?: number;
  avg_discount_pct?: number;
  unexecuted_order_book_inr?: number;
  equipment_fleet_val_inr?: number;
  solvency_ratio?: number;
  pqc_clearance_rating?: string;
  total_contracts_won: number;
  total_awarded_value_inr: number;
  contracts_won: BidderWonContract[];
  categories: string[];
  authorities: string[];
  portals: string[];
  states: string[];
}

export interface ScrapedPortalStatus {
  portal: string;
  status: string;
  notices_in_progress: number;
  bidding_status: string;
}

export interface ScrapeReport {
  status: string;
  message?: string;
  database_used?: boolean;
  database_note?: string;
  total_in_progress_tenders: number;
  execution_time_ms: number;
  portals_scraped: ScrapedPortalStatus[];
  timestamp: string;
  next_cron_run?: string;
  trigger_type?: string;
}

export interface PlatformStats {
  active_tenders_count: number;
  accepted_tenders_count: number;
  registered_bidders_count: number;
  database_required?: boolean;
  architecture: string;
  total_portals_monitored: number;
  portals_list: string[];
  total_active_procurement_value_inr: number;
  states_covered: number;
  cron_sync?: {
    schedule: string;
    cron_expression?: string;
    timezone?: string;
    next_run?: string;
    scheduler_running?: boolean;
  };
}
