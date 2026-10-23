"""
Catalog Builder for All India Tenders Platform
Builds balanced, comprehensive, realistic repositories for:
1. Previously Accepted Tenders (~1,420 awarded dossiers across all 7 sources, 2017-2026)
2. Current Active Tenders (~260 in-progress unfilled notices across all 7 sources, 2026)
"""

import os
import json
import random
import hashlib
from datetime import date, datetime, timedelta

# Seed for reproducible realistic generation
random.seed(42)

# Source Portals and their real-world configurations
PORTALS_CONFIG = {
    'MahaTenders (mahatenders.gov.in)': {
        'portal_url_base': 'https://mahatenders.gov.in/nicgep/app?page=FrontEndTendersByOrganisation&org=',
        'state': 'Maharashtra',
        'cities': ['Pune', 'Mumbai', 'Thane', 'Navi Mumbai', 'Chakan', 'Baramati', 'Nagpur', 'Nashik', 'Pimpri-Chinchwad'],
        'orgs': [
            ('Public Works Department, Govt of Maharashtra (MahaPWD)', 'PWD', 'State Highway & District Roads'),
            ('Pune Municipal Corporation (PMC Projects)', 'PMC', 'Urban Flyovers, Water Distribution & Bridges'),
            ('Pimpri-Chinchwad Municipal Corporation (PCMC)', 'PCMC', 'Grade Separators, Sewage & Smart City'),
            ('Pune Metropolitan Region Development Authority (PMRDA)', 'PMRDA', 'Metro Line 3, Ring Road & Town Planning'),
            ('Maharashtra State Road Development Corporation (MSRDC)', 'MSRDC', 'Expressways, Sea Links & Western Ring Road'),
            ('Mumbai Metropolitan Region Development Authority (MMRDA)', 'MMRDA', 'Metro Lines 2B/4/6/7 & Elevated Freeways'),
            ('City and Industrial Development Corporation (CIDCO)', 'CIDCO', 'Navi Mumbai Airport Link & Coastal Arterial'),
            ('Maharashtra Jeevan Pradhikaran (MJP)', 'MJP', 'Jal Jeevan Mission Rural Bulk Water Supply'),
            ('MahaMetro Rail Corporation (Pune & Nagpur Metro)', 'MAHAMETRO', 'Metro Viaducts, Elevated Stations & Depots')
        ],
        'winning_companies': [
            ("B.G. Shirke Construction Technology Pvt. Ltd.", "U45201PN1994PTC078192", "72-76 Mundhwa, Industrial Estate, Pune - 411036", "27AAACB4810K1Z5", "AAACB4810K", "Bank of Maharashtra, Pune Camp"),
            ("T&T Infra Limited", "U45200PN2012PLC144789", "T&T House, Navale Bridge, Vadgaon Bk, Pune - 411041", "27AABCT8910J1ZX", "AABCT8910J", "HDFC Bank, FC Road Pune"),
            ("J. Kumar Infraprojects Ltd.", "L74210MH1999PLC122886", "16-A, Andheri Industrial Estate, Veera Desai Road, Mumbai - 400053", "27AAACJ4892L1Z3", "AAACJ4892L", "State Bank of India, Mumbai"),
            ("Shapoorji Pallonji & Co. Pvt. Ltd.", "U45200MH1943PTC003883", "SP Centre, 41/44 Minoo Desai Marg, Colaba, Mumbai - 400005", "27AAACS1894P1Z2", "AAACS1894P", "Standard Chartered Bank, Fort"),
            ("Afcons Infrastructure Limited", "U45200MH1976PLC019335", "Afcons House, 16 Shah Industrial Estate, Veera Desai, Mumbai - 400053", "27AAACA1984Q1Z8", "AAACA1984Q", "Bank of Baroda, Corporate Branch"),
            ("Eagle Infra India Ltd.", "U45200MH1997PLC105672", "Eagle House, Station Road, Ulhasnagar, Thane - 421003", "27AAACE8892P1ZF", "AAACE8892P", "Canara Bank, Thane"),
            ("Rohan Builders (India) Pvt. Ltd.", "U45201PN1993PTC074219", "Modibaug, Commercial Bldg, Ganeshkhind Road, Pune - 411016", "27AAACR1982K1Z9", "AAACR1982K", "Axis Bank, Shivaji Nagar Pune"),
            ("Ashoka Buildcon Limited", "L45200MH1993PLC071970", "Ashoka House, Ashoka Marg, Vadala, Nashik - 422011", "27AAACA4982N1Z4", "AAACA4982N", "State Bank of India, Nashik"),
            ("Welspun Enterprises Ltd.", "L45201GJ1994PLC023920", "Welspun House, Kamala City, Senapati Bapat Marg, Lower Parel, Mumbai", "27AAACW1982L1Z5", "AAACW1982L", "Union Bank of India, Mumbai")
        ]
    },
    'GeM (gem.gov.in)': {
        'portal_url_base': 'https://bidplus.gem.gov.in/showbidDocument/',
        'state': 'Pan-India / Central',
        'cities': ['New Delhi', 'Bhopal', 'Ahmedabad', 'Ranchi', 'Bhubaneswar', 'Visakhapatnam', 'Vadodara'],
        'orgs': [
            ('NTPC Limited (Renewable Energy & Thermal)', 'NTPC', 'Ground-Mounted Solar PV, Substation & EPC'),
            ('Power Grid Corporation of India (PowerGrid)', 'POWERGRID', '765kV/400kV GIS Substations & Transmission Foundations'),
            ('Bharat Heavy Electricals Limited (BHEL)', 'BHEL', 'Boiler Structures, Turbine Halls & BOP Civil Packages'),
            ('Oil and Natural Gas Corporation (ONGC)', 'ONGC', 'Offshore Terminal Platforms & Onshore Pipelines'),
            ('Indian Oil Corporation Limited (IOCL)', 'IOCL', 'POL Storage Terminals, Firewater & LPG Bottling Civil'),
            ('Steel Authority of India Limited (SAIL)', 'SAIL', 'Blast Furnace Heavy Civil, Sinter Plant & Rail Yard'),
            ('GAIL (India) Limited', 'GAIL', 'Urja Ganga Cross-Country Natural Gas Pipeline Civil Trenching'),
            ('Coal India Limited (CIL / CMPDI)', 'COALINDIA', 'Coal Washery Infrastructure, Heavy Haul Roads & Silos')
        ],
        'winning_companies': [
            ("Tata Power Solar Systems Limited", "U40106MH1989PLC054360", "C-Block, 34 Sant Tukaram Road, Carnac Bunder, Mumbai - 400009", "27AAACT8921J1ZX", "AAACT8921J", "State Bank of India, CAG"),
            ("Sterling & Wilson Renewable Energy Ltd.", "L51909MH2017PLC292281", "9th Floor, Universal Majestic, P.L. Lokhande Marg, Chembur, Mumbai - 400043", "27AAACS8912K1Z7", "AAACS8912K", "HDFC Bank, Fort Mumbai"),
            ("Kalpataru Projects International Limited", "L28920GJ1981PLC004652", "101, Kalpataru Synergy, Opp. Grand Hyatt, Santacruz (E), Mumbai - 400055", "27AAACK1982H1Z1", "AAACK1982H", "Axis Bank, Bandra"),
            ("KEC International Limited", "L74140MH1945PLC004634", "RPG House, 463 Dr. Annie Besant Road, Worli, Mumbai - 400030", "27AAACK4892P1Z0", "AAACK4892P", "ICICI Bank, Backbay Reclamation"),
            ("Siemens Limited (Energy & Infra Division)", "L28920MH1957PLC010839", "Birla Aurora, Level 21, Dr. Annie Besant Road, Worli, Mumbai - 400030", "27AAACS1982L1Z9", "AAACS1982L", "Deutsche Bank, Mumbai"),
            ("ABB India Limited", "L32202KA1949PLC032923", "Plot No. 5 & 6, 2nd Phase, Peenya Industrial Area, Bengaluru - 560058", "29AAACA1982M1Z2", "AAACA1982M", "Citibank N.A., Bengaluru"),
            ("L&T Power Transmission & Distribution", "L99999MH1946PLC004768", "L&T House, Ballard Estate, Mumbai - 400001", "27AAACL1892K1Z4", "AAACL1892K", "State Bank of India, Corporate Branch")
        ]
    },
    'IREPS (ireps.gov.in)': {
        'portal_url_base': 'https://www.ireps.gov.in/eps/viewItemPublic.do?nitId=',
        'state': 'Pan-India / Central',
        'cities': ['Delhi NCR', 'Mumbai', 'Secunderabad', 'Kolkata', 'Chennai', 'Pune', 'Lucknow', 'Amritsar'],
        'orgs': [
            ('Northern Railway (Engineering & S&T Dept)', 'NR', 'KAVACH Automatic Train Protection, Doubling & Bridges'),
            ('Central Railway (Civil Infrastructure)', 'CR', '3rd/4th Line Quadrupling, Viaducts & Station Modernization'),
            ('Western Railway (Civil & Electrical Works)', 'WR', 'Speed Upgradation to 160 kmph, ROBs & PEB Sheds'),
            ('Dedicated Freight Corridor Corp of India (DFCCIL)', 'DFCCIL', 'Heavy Haul Track Laying, Automated Signaling & Bridges'),
            ('Rail Vikas Nigam Limited (RVNL)', 'RVNL', 'New B.G. Rail Lines, Tunnels & Elevated Metro Viaducts'),
            ('RailTel Corporation of India', 'RAILTEL', 'OFC Telecom Backbone, IP-CCTV Surveillance & Signalling'),
            ('IRCON International Limited', 'IRCON', 'High-Speed Railway Formation, Deep Rock Tunnels & Bridges')
        ],
        'winning_companies': [
            ("Larsen & Toubro Limited (Railway SBU)", "L99999MH1946PLC004768", "Mount Poonamallee Road, Manapakkam, Chennai - 600089", "33AAACL1892K1Z2", "AAACL1892K", "State Bank of India, CAG Chennai"),
            ("Medha Servo Drives Pvt. Ltd.", "U31103TG1984PTC004990", "P-4/5B, IDA Nacharam, Hyderabad - 500076, Telangana", "36AAACM8912P1ZX", "AAACM8912P", "State Bank of India, Hyderabad"),
            ("Kernex Microsystems (India) Ltd.", "L30007TG1991PLC013211", "TSIIC IT Park, Hardware Park, Shamshabad, Hyderabad - 501218", "36AAACK1982J1Z8", "AAACK1982J", "Canara Bank, Hyderabad"),
            ("HBL Power Systems Ltd.", "L31300TG1986PLC006762", "8-2-601, Road No. 10, Banjara Hills, Hyderabad - 500034", "36AAACH1982K1Z6", "AAACH1982K", "Andhra Bank / Union Bank, Hyderabad"),
            ("Texmaco Rail & Engineering Ltd.", "L29261WB1998PLC087404", "Belgharia, Kolkata - 700056, West Bengal", "19AAACT1982M1Z5", "AAACT1982M", "State Bank of India, Kolkata"),
            ("GPT Infraprojects Limited", "L20103WB1980PLC032872", "GPT Centre, JC-25, Sector-III, Salt Lake, Kolkata - 700106", "19AAACG1982L1Z4", "AAACG1982L", "Bank of Baroda, Salt Lake")
        ]
    },
    'CPWD TenderWizard / CPPP': {
        'portal_url_base': 'https://tenderwizard.com/CPWD/',
        'state': 'Pan-India / Central',
        'cities': ['New Delhi', 'Bengaluru', 'Chennai', 'Kanpur', 'Kharagpur', 'Guwahati', 'Mumbai', 'Roorkee'],
        'orgs': [
            ('Central Public Works Department (CPWD Northern Zone)', 'CPWD-NZ', 'AIIMS Hospitals, Central Vista & Central University Campuses'),
            ('Central Public Works Department (CPWD Western Zone)', 'CPWD-WZ', 'IIT Bombay, Custom House & Administrative High-Rises'),
            ('Central Public Works Department (CPWD Southern Zone)', 'CPWD-SZ', 'IIT Madras Research Complex & IIM Bangalore Facilities'),
            ('Central Public Works Department (CPWD Eastern Zone)', 'CPWD-EZ', 'IIT Kharagpur Nanotech & Central Laboratory Towers'),
            ('National Buildings Construction Corp (NBCC India Ltd)', 'NBCC', 'Comprehensive Smart Redevelopment & Hospital Towers')
        ],
        'winning_companies': [
            ("Ahluwalia Contracts (India) Ltd.", "L45101DL1979PLC009652", "A-177, Okhla Industrial Area, Phase-I, New Delhi - 110020", "07AAACA1982N1Z3", "AAACA1982N", "Standard Chartered Bank, Barakhamba Road"),
            ("Capacit'e Infraprojects Limited", "L45400MH2012PLC234318", "605-607, Shrikant Chambers, Chembur, Mumbai - 400071", "27AAACC1982P1Z1", "AAACC1982P", "Kotak Mahindra Bank, Mumbai"),
            ("PSP Projects Limited", "L45201GJ2008PLC054868", "PSP House, Opp. Celesta Courtyard, Iscon-Ambli Road, Ahmedabad - 380058", "24AAACP1982Q1Z9", "AAACP1982Q", "State Bank of India, Ahmedabad"),
            ("NCC Limited (Building Division)", "L72200TG1990PLC011146", "NCC House, Madhapur, Hyderabad - 500081, Telangana", "36AAACN1982R1Z7", "AAACN1982R", "State Bank of India, CAG Hyderabad")
        ]
    },
    'Delhi e-Procure (DMRC)': {
        'portal_url_base': 'https://govtprocurement.delhi.gov.in/nicgep/app?org=',
        'state': 'Delhi NCR',
        'cities': ['Dwarka', 'Rohini', 'Narela', 'Jasola', 'Central Delhi', 'South Delhi', 'Pitampura', 'Siri Fort'],
        'orgs': [
            ('Delhi Metro Rail Corporation Ltd (DMRC)', 'DMRC', 'Phase-IV Underground Tunnels, Elevated Viaducts & Stations'),
            ('Delhi Jal Board (Govt of NCT of Delhi)', 'DJB', 'Water Treatment Plants, Interceptor Sewers & Reservoirs'),
            ('Public Works Department, Govt of NCT of Delhi (PWD Delhi)', 'DELHIPWD', 'Integrated Elevated Flyover Corridors & Road Arterials'),
            ('Delhi Transport Corporation (DTC)', 'DTC', 'Multi-Modal Electric Bus Depots & EV Charging Infrastructure')
        ],
        'winning_companies': [
            ("ITD Cementation India Limited", "L61000MH1978PLC020471", "National Plastic Building, Subhash Road, Vile Parle (E), Mumbai - 400057", "27AAACI1982K1Z2", "AAACI1982K", "Standard Chartered Bank, Mumbai"),
            ("Tata Projects Limited (Heavy Civil Infra)", "U45201MH1979PLC021280", "One Boulevard, Lake Boulevard Road, Powai, Mumbai - 400076", "27AAACT1982L1Z0", "AAACT1982L", "State Bank of India, Corporate Branch"),
            ("VA Tech WABAG Limited", "L45205TN1995PLC030231", "WABAG House, Sunnambu Kolathur, Kovilambakkam, Chennai - 600117", "33AAACV1982M1Z8", "AAACV1982M", "BNP Paribas, Chennai"),
            ("Dilip Buildcon Limited", "L45201MP2006PLC018689", "Plot No. 5, Inside Govind Narayan Singh Gate, Chuna Bhatti, Kolar Road, Bhopal", "23AAACD1982N1Z6", "AAACD1982N", "Punjab National Bank, Bhopal")
        ]
    },
    'UP e-Procure (etender.up.nic.in)': {
        'portal_url_base': 'https://etender.up.nic.in/nicgep/app?org=',
        'state': 'Uttar Pradesh',
        'cities': ['Noida / NCR', 'Lucknow', 'Varanasi', 'Kanpur', 'Prayagraj', 'Ayodhya', 'Agra', 'Ghaziabad'],
        'orgs': [
            ('Uttar Pradesh Public Works Department (UP PWD)', 'UPPWD', 'State Expressways, Ring Roads & Multi-Lane Bypasses'),
            ('UP Expressways Industrial Development Authority (UPEIDA)', 'UPEIDA', 'Ganga Expressway, Bundelkhand & Gorakhpur Link Expressways'),
            ('Uttar Pradesh Jal Nigam (Rural & Urban)', 'UPJALNIGAM', 'Har Ghar Jal Bulk Water Supply & DI Pipe Distribution'),
            ('New Okhla Industrial Development Authority (Noida Authority)', 'NOIDA', 'Underpasses, Multi-Level Flyovers & Sector Services'),
            ('Ayodhya Development Authority (ADA)', 'ADA', 'Maryada Purushottam Sriram Airport Access & Heritage Corridors')
        ],
        'winning_companies': [
            ("PNC Infratech Limited", "L45201DL1999PLC195937", "PNC Tower, 3/22-D, Civil Lines, Bypass Road, Agra - 282002, UP", "09AAACP1982K1Z4", "AAACP1982K", "State Bank of India, Agra"),
            ("GR Infraprojects Limited", "L45201RJ1995PLC009862", "GR House, Hiran Magri, Sector-11, Udaipur - 313002, Rajasthan", "08AAACG1982L1Z2", "AAACG1982L", "HDFC Bank, Udaipur"),
            ("IRB Infrastructure Developers Ltd.", "L65991MH1998PLC113070", "IRB Complex, Chandivli Farm, Chandivli, Andheri (E), Mumbai - 400072", "27AAACI1982M1Z0", "AAACI1982M", "IDBI Bank, Mumbai"),
            ("Adani Road Transport Limited", "U45203GJ2018PLC101453", "Adani Corporate House, Shantigram, S.G. Highway, Ahmedabad - 382421", "24AAACA1982N1Z8", "AAACA1982N", "State Bank of India, Ahmedabad")
        ]
    },
    'Central CPPP (eprocure.gov.in)': {
        'portal_url_base': 'https://eprocure.gov.in/eprocure/app?page=FrontEndTendersByOrganisation&service=page&org=',
        'state': 'Pan-India / Central',
        'cities': ['Karnataka', 'Assam & North East', 'Jammu & Kashmir / Ladakh', 'Uttarakhand & Himachal', 'Rajasthan & Gujarat', 'Punjab & Haryana'],
        'orgs': [
            ('National Highways Authority of India (NHAI)', 'NHAI', 'Access-Controlled Expressways & Economic Corridors'),
            ('Ministry of Road Transport and Highways (MoRTH)', 'MORTH', 'National Highway Widening, Pavements & Major Bridges'),
            ('National Highways & Infra Development Corp (NHIDCL)', 'NHIDCL', 'Strategic Himalayan Tunnels & Border High-Altitude Highways'),
            ('Delhi Development Authority (DDA)', 'DDA', 'Urban Extension Road UER-II, Dwarka Sports Hub & Prefab Housing'),
            ('Engineers India Limited (EIL)', 'EIL', 'Refinery EPC, Petrochemical Plants & Strategic Storage'),
            ('Border Security Force (BSF, Ministry of Home Affairs)', 'BSF', 'Border Composite Outposts, Smart Fencing & High-Mast Lighting'),
            ('Indo-Tibetan Border Police (ITBP, MHA)', 'ITBP', 'High-Altitude Border Staging Bases & Strategic Pass Roads'),
            ('Archaeological Survey of India (ASI)', 'ASI', 'Monument Structural Retrofitting, Protective Buffer Works & Museum')
        ],
        'winning_companies': [
            ("Larsen & Toubro Construction (Transportation Infra)", "L99999MH1946PLC004768", "L&T House, Ballard Estate, Mumbai - 400001", "27AAACL1892K1Z4", "AAACL1892K", "State Bank of India, CAG Mumbai"),
            ("Tata Projects Limited", "U45201MH1979PLC021280", "One Boulevard, Lake Boulevard Road, Powai, Mumbai - 400076", "27AAACT1982L1Z0", "AAACT1982L", "State Bank of India, Corporate Branch"),
            ("Navayuga Engineering Company Limited", "U45200AP1986PLC006900", "Plot No. 37-38, Nagarjuna Hills, Panjagutta, Hyderabad - 500082", "36AAACN3091J1ZT", "AAACN3091J", "State Bank of India, CAG Branch"),
            ("Megha Engineering & Infrastructures Ltd (MEIL)", "U45202TG2006PLC050271", "S-2, Technocrat Industrial Estate, Balanagar, Hyderabad - 500037", "36AAACM1982K1Z1", "AAACM1982K", "Canara Bank, Large Corporate Branch"),
            ("Hindustan Construction Company (HCC)", "L45200MH1926PLC001228", "Hincon House, 247Park, LBS Marg, Vikhroli (W), Mumbai - 400083", "27AAACH1982L1Z9", "AAACH1982L", "ICICI Bank, Mumbai")
        ]
    }
}

print("Loaded portals configuration with all 7 real sources.")
