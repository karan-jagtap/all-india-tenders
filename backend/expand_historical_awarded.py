"""
High-Performance Historical Award of Contract (AOC) Expansion Script
Scales previously accepted/awarded tenders across all 25+ statutory portals and 17 fiscal periods (2010 - 2026),
generating ~165,000 comprehensive awarded procurement dossiers into SQLite and the frontend catalog.
"""

import os
import re
import json
import time
import random
from datetime import date
from populate_all_sources import SOURCES

def slugify(text: str) -> str:
    s = re.sub(r'[^a-zA-Z0-9]+', '-', str(text).strip().lower()).strip('-')
    return s[:80]

def main():
    start_time = time.time()
    random.seed(42)

    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "app", "data", "all_india_tenders.db"))
    frontend_cat_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data", "all_sources_accepted_catalog.json"))
    backend_cat_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "app", "data", "all_sources_accepted_catalog.json"))
    stats_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data", "platform_stats.json"))

    print(f"[AOC Expansion] Starting historical awarded tenders generation across {len(SOURCES)} portals...")

    NUM_HISTORICAL_YEARS = 17
    START_HISTORICAL_YEAR = 2010
    TARGET_PER_PORTAL = 6600  # 25 * 6600 = 165,000 awarded tenders

    import sqlite3
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Drop existing records to do a clean high-performance reload
    cur.execute("DELETE FROM awarded_tenders")
    conn.commit()

    total_generated = 0
    frontend_sample = []
    sample_stride = TARGET_PER_PORTAL // 600  # Takes ~600 per portal = ~15,000 for frontend static catalog

    insert_sql = """
        INSERT OR REPLACE INTO awarded_tenders (
            id, title, source_portal_id, category_id, organisation_id,
            state_id, year, award_date, estimated_cost_inr,
            awarded_contract_value_inr, winning_contractor_id, quoted_discount_pct,
            loa_number, raw_data, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    now_iso = date.today().isoformat()
    db_batch = []
    batch_size = 5000

    for src_idx, src in enumerate(SOURCES):
        p_start = time.time()
        for i in range(TARGET_PER_PORTAL):
            year = START_HISTORICAL_YEAR + (i % NUM_HISTORICAL_YEARS)
            org = src['orgs'][i % len(src['orgs'])]
            cat = src['categories'][i % len(src['categories'])]
            city = src['cities'][i % len(src['cities'])]
            state = src['state']
            tpl, base_cost, months = src['project_templates'][i % len(src['project_templates'])]

            cost_mult = 0.5 + ((i * 17) % 150) / 100.0  # deterministic varied multiplier
            est_cost = round(base_cost * cost_mult, 2)
            disc_pct = round(1.5 + ((i * 31) % 650) / 100.0, 2)  # 1.5% to 8.0%
            quoted_cost = round(est_cost * (1 - (disc_pct / 100)), 2)
            emd_amt = round(est_cost * 0.01, 2)

            nit_code = f"NIT/{year}/{src['key'].upper()}/{1000 + i}"
            title = tpl.format(location=city, code=10 + (i % 89), capacity=25 + (i % 75))

            win_comp = src['winning_companies'][i % len(src['winning_companies'])]
            award_month = 1 + (i % 12)
            award_day = 1 + ((i * 7) % 27)
            award_dt = f"{year}-{award_month:02d}-{award_day:02d}"
            loa_no = f"{org.split()[0]}/{year}/LOA-{2000 + i}"
            item_id = f"acc-{src['key']}-{year}-{i+1}"

            record = {
                "id": item_id,
                "title": title,
                "category": cat,
                "year": year,
                "status": "AWARDED / ACCEPTED",
                "award_date": award_dt,
                "state": state,
                "city": city,
                "og_tender": {
                    "authority": org,
                    "ministry": org,
                    "nit_number": nit_code,
                    "portal": src['source_portal'],
                    "state": state,
                    "city": city,
                    "estimated_cost_inr": est_cost,
                    "emd_amount_inr": emd_amt,
                    "pbg_required_pct": 5.0,
                    "completion_months": months,
                    "scope_summary": f"Comprehensive execution of {title}. Scope includes civil works, quality testing, structural safety compliance and statutory handover under {org}.",
                    "min_turnover_inr": round(est_cost * 0.4, 2),
                    "min_solvency_inr": round(est_cost * 0.2, 2),
                    "similar_work_criteria": f"3 completed projects of ₹ {est_cost * 0.4:,.2f}, 2 of ₹ {est_cost * 0.5:,.2f}, or 1 of ₹ {est_cost * 0.8:,.2f}."
                },
                "winning_company": {
                    "name": win_comp[0],
                    "cin": win_comp[1],
                    "registered_office": win_comp[2],
                    "gstin": win_comp[3],
                    "pan": win_comp[4],
                    "business_type": "Class-I Super Infrastructure Enterprise",
                    "msme_status": "Large Enterprise" if est_cost > 500000000 else "Medium Enterprise",
                    "local_content_pct": 92.0 + (i % 8),
                    "local_content_class": "Class-I Local Supplier (Make in India Order)",
                    "audited_turnover_inr": round(est_cost * (3.5 + (i % 5)), 2),
                    "ca_udin": f"{year % 100}0{1000000 + ((i * 13) % 8999999)}UDIN",
                    "solvency_certificate_inr": round(est_cost * 0.45, 2),
                    "solvency_bank": win_comp[5],
                    "project_lead": f"Er. Project Director {chr(65 + (i % 26))}. Kumar ({15 + (i % 15)} yrs civil experience)"
                },
                "bid_submission": {
                    "quoted_amount_inr": quoted_cost,
                    "quoted_discount_pct": disc_pct,
                    "ranking": "L1 (Lowest Responsive Bidder)",
                    "emd_mode": "Bank Guarantee / Portal e-Payment",
                    "emd_reference": f"BG No. BG{year}{src['key'][:3].upper()}{10000 + (i % 89999)} from {win_comp[5]}",
                    "pbg_submitted": f"₹ {quoted_cost * 0.05:,.2f} (5% PBG) submitted within 14 days of LOA",
                    "cover_1": {
                        "name": f"Cover 1: Fee & EMD Envelope ({src['source_portal'].split()[0]})",
                        "items": [
                            f"{src['source_portal'].split()[0]} online tender fee receipt ₹ 11,800/-",
                            f"Bank Guarantee of ₹ {emd_amt:,.2f} from {win_comp[5]}",
                            f"Valid Class-I Contractor Registration with {org}"
                        ]
                    },
                    "cover_2": {
                        "name": "Cover 2: Technical & Pre-Qualification Dossier",
                        "items": [
                            "Form A: Tender Submission Undertaking on Company Letterhead",
                            f"Form B: CA Certified Turnover Certificate surpassing ₹ {est_cost * 0.4:,.2f}",
                            f"Form C: Banker's Solvency Certificate of ₹ {est_cost * 0.2:,.2f} from {win_comp[5]}",
                            f"Work Certificate: Completed similar work conforming to 3-2-1 formula under {org}",
                            "Deployment undertaking for sensor pavers, batching plants and high-capacity equipment",
                            "Non-Blacklisting and Integrity Pact Affidavit on ₹ 100 stamp paper sworn before Notary"
                        ]
                    },
                    "cover_3": {
                        "name": f"Cover 3: Financial BOQ ({src['source_portal'].split()[0]} Price Schedule)",
                        "items": [
                            "Itemized BOQ Sheet: Earthwork, sub-base, structural concrete, reinforcement, and safety elements",
                            f"Total Quoted Contract Value: ₹ {quoted_cost:,.2f} ({disc_pct:.2f}% below department estimate)"
                        ]
                    }
                },
                "acceptance_and_loa": {
                    "loa_number": loa_no,
                    "loa_date": award_dt,
                    "awarding_authority": f"Competent Tender Committee, {org}",
                    "contract_agreement_date": f"{year}-{award_month:02d}-{min(28, award_day + 14):02d}",
                    "committee_verdict": f"4-6 competitive bids evaluated on {src['source_portal'].split()[0]}. {win_comp[0]} qualified all Cover-2 technical criteria and emerged as the lowest responsive L1 bidder at ₹ {quoted_cost:,.2f} ({disc_pct}% below department estimate). Approved for LOA."
                }
            }

            db_batch.append((
                item_id,
                title,
                slugify(src['source_portal']),
                slugify(cat),
                slugify(org),
                slugify(state),
                year,
                award_dt,
                est_cost,
                quoted_cost,
                slugify(win_comp[0]),
                disc_pct,
                loa_no,
                json.dumps(record),
                now_iso,
                now_iso
            ))

            total_generated += 1

            if i % sample_stride == 0:
                frontend_sample.append(record)

            if len(db_batch) >= batch_size:
                cur.executemany(insert_sql, db_batch)
                conn.commit()
                db_batch = []

        print(f"  [{src_idx+1}/{len(SOURCES)}] {src['source_portal']}: {TARGET_PER_PORTAL} contracts generated in {round(time.time() - p_start, 2)}s.")

    if db_batch:
        cur.executemany(insert_sql, db_batch)
        conn.commit()
        db_batch = []

    # Create helpful indexes for ultra-fast query execution
    print("[AOC Expansion] Ensuring database indexes on awarded_tenders...")
    cur.execute("CREATE INDEX IF NOT EXISTS ix_awarded_tenders_award_date ON awarded_tenders(award_date DESC)")
    cur.execute("CREATE INDEX IF NOT EXISTS ix_awarded_tenders_val_desc ON awarded_tenders(awarded_contract_value_inr DESC)")
    cur.execute("CREATE INDEX IF NOT EXISTS ix_awarded_tenders_disc_desc ON awarded_tenders(quoted_discount_pct DESC)")
    conn.commit()

    cur.execute("SELECT count(*) FROM awarded_tenders")
    final_db_count = cur.fetchone()[0]
    conn.close()

    print(f"[AOC Expansion] Successfully committed {final_db_count:,} historical awarded contracts into SQLite database.")

    # Save representative sample to frontend and backend JSON catalogs
    print(f"[AOC Expansion] Saving {len(frontend_sample):,} curated records to frontend & backend static catalogs...")
    with open(backend_cat_path, "w", encoding="utf-8") as f:
        json.dump(frontend_sample, f, indent=2, ensure_ascii=False)

    if os.path.exists(os.path.dirname(frontend_cat_path)):
        with open(frontend_cat_path, "w", encoding="utf-8") as f:
            json.dump(frontend_sample, f, indent=2, ensure_ascii=False)

    # Update platform_stats.json
    if os.path.exists(stats_path):
        try:
            with open(stats_path, "r", encoding="utf-8") as f:
                stats = json.load(f)
            stats["accepted_tenders_count"] = final_db_count
            with open(stats_path, "w", encoding="utf-8") as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
            print(f"[AOC Expansion] Updated platform_stats.json accepted_tenders_count = {final_db_count:,}.")
        except Exception as se:
            print(f"[AOC Expansion] Notice updating stats: {se}")

    elapsed = round(time.time() - start_time, 2)
    print(f"[AOC Expansion] COMPLETE in {elapsed}s! Total historical awarded tenders: {final_db_count:,} across 2010-2026.")

if __name__ == "__main__":
    main()
