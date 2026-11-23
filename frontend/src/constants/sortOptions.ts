import { ToolbarSortOption } from '../types';
import {
  CurrentTenderSortOption,
  AcceptedTenderSortOption,
  BidderSortOption
} from '../types';

export const CURRENT_TENDER_SORT_OPTIONS: ToolbarSortOption<CurrentTenderSortOption>[] = [
  {
    value: 'CLOSING_SOONEST',
    label: '⏰ Closing Soonest',
    shortLabel: 'Closing Soonest',
    desc: 'Notices with closest submission deadlines first'
  },
  {
    value: 'CLOSING_LATEST',
    label: '⏳ Closing Latest',
    shortLabel: 'Closing Latest',
    desc: 'Notices with longest submission windows remaining'
  },
  {
    value: 'VALUE_DESC',
    label: '💰 Value: High to Low',
    shortLabel: 'Value (High → Low)',
    desc: 'Largest estimated contract values first'
  },
  {
    value: 'VALUE_ASC',
    label: '🪙 Value: Low to High',
    shortLabel: 'Value (Low → High)',
    desc: 'Smallest / MSME-accessible estimated values first'
  },
  {
    value: 'PUBLISHED_DESC',
    label: '📅 Newest Published',
    shortLabel: 'Newest Published',
    desc: 'Most recently published procurement notices'
  },
  {
    value: 'PUBLISHED_ASC',
    label: '🗓️ Oldest Published',
    shortLabel: 'Oldest Published',
    desc: 'Oldest active notices first'
  },
  {
    value: 'EMD_DESC',
    label: '🛡️ EMD: High to Low',
    shortLabel: 'EMD (High → Low)',
    desc: 'Highest earnest money deposit first'
  },
  {
    value: 'TITLE_ASC',
    label: '🔤 Title (A → Z)',
    shortLabel: 'Title (A → Z)',
    desc: 'Alphabetical sorting by work title'
  }
];

export const ACCEPTED_TENDER_SORT_OPTIONS: ToolbarSortOption<AcceptedTenderSortOption>[] = [
  {
    value: 'AWARD_DATE_DESC',
    label: '🏆 Award Date: Newest First',
    shortLabel: 'Award (Newest)',
    desc: 'Most recently awarded government contracts'
  },
  {
    value: 'AWARD_DATE_ASC',
    label: '📜 Award Date: Oldest First',
    shortLabel: 'Award (Oldest)',
    desc: 'Earliest awarded contracts in archive'
  },
  {
    value: 'VALUE_DESC',
    label: '💎 Contract Value: High to Low',
    shortLabel: 'Value (High → Low)',
    desc: 'Highest winning contract values first'
  },
  {
    value: 'VALUE_ASC',
    label: '🪙 Contract Value: Low to High',
    shortLabel: 'Value (Low → High)',
    desc: 'Smallest winning contract values first'
  },
  {
    value: 'DISCOUNT_DESC',
    label: '📉 Winning Discount %: High to Low',
    shortLabel: 'Discount % (High → Low)',
    desc: 'Contracts won with highest rebate/discount below estimate'
  },
  {
    value: 'CONTRACTOR_ASC',
    label: '🏢 Contractor Name (A → Z)',
    shortLabel: 'Contractor (A → Z)',
    desc: 'Alphabetical order by winning contractor'
  },
  {
    value: 'TITLE_ASC',
    label: '🔤 Work Title (A → Z)',
    shortLabel: 'Title (A → Z)',
    desc: 'Alphabetical order by project title'
  }
];

export const BIDDER_SORT_OPTIONS: ToolbarSortOption<BidderSortOption>[] = [
  {
    value: 'CONTRACTS_DESC',
    label: '🏆 Total Contracts Won (High → Low)',
    shortLabel: 'Contracts (High → Low)',
    desc: 'Contractors with most government wins first'
  },
  {
    value: 'VALUE_DESC',
    label: '💎 Total Awarded Value (High → Low)',
    shortLabel: 'Awarded Value (High → Low)',
    desc: 'Contractors with largest cumulative contract sum'
  },
  {
    value: 'TURNOVER_DESC',
    label: '📊 Audited Turnover (High → Low)',
    shortLabel: 'Turnover (High → Low)',
    desc: 'Highest certified annual turnover'
  },
  {
    value: 'NAME_ASC',
    label: '🏢 Contractor Name (A → Z)',
    shortLabel: 'Name (A → Z)',
    desc: 'Alphabetical directory order'
  },
  {
    value: 'NAME_DESC',
    label: '🏢 Contractor Name (Z → A)',
    shortLabel: 'Name (Z → A)',
    desc: 'Reverse alphabetical directory order'
  }
];
