/**
 * Master Filter Constants and Normalizers across In-Progress & Previously Accepted Tenders
 */

import { getPortalBoundState } from './portalSources';

export const ALL_CANONICAL_CATEGORIES: string[] = [
  "Agriculture, Water Resources & Food Storage",
  "Atomic Energy, Power & Grid Infra",
  "Central Government Procurement",
  "Defence, Border Security & Paramilitary",
  "Healthcare, Medical & Hospital Infra",
  "Higher Education & Institutional Infra",
  "Highways, Metros & Rail Transport",
  "IT, Telecom & Semiconductor Works",
  "Petrochem, Fertilizers & Minerals",
  "Ports, Shipping & Maritime Works",
];

export const ALL_CANONICAL_STATES: string[] = [
  "Andaman & Nicobar",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Pan-India / Central",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const ALL_MASTER_ORGANIZATIONS: string[] = [
  "AP Transmission Corporation (AP Transco)",
  "Ahmedabad Municipal Corporation (AMC)",
  "Aligarh Muslim University",
  "All India Institute of Medical Science-Nagpur",
  "All India Institute of Medical Science-New Delhi",
  "All India Institute of Medical Sciences - Rajkot",
  "All India Institute of Medical Sciences Bathinda",
  "All India Institute of Medical Sciences-Bhopal",
  "All India Institute of Medical Sciences-Bhubaneswar",
  "All India Institute of Medical Sciences-Jodhpur",
  "All India Institute of Medical Sciences-Mangalagiri-Andhra Pradesh",
  "All India Institute of Medical Sciences-Patna",
  "All India Institute of Medical Sciences-Raebareli",
  "All India Institute of Medical Sciences-Raipur",
  "All India Institute of Medical Sciences-Rewari",
  "All India Institute of Medical Sciences-Rishikesh",
  "All India Institute of Physical Medicine and Rehabilitation",
  "All india Institute of Medical Sciences Bibinagar",
  "All india Institute of Medical Sciences Bilaspur",
  "Andaman Lakshadweep Harbour Works",
  "Andhra Pradesh Capital Region Dev Authority (AP CRDA)",
  "Andhra Pradesh MSME Developement Corporation",
  "Archaeological Survey of India",
  "Archaeological Survey of India (ASI)",
  "Artificial Limbs Manufacturing Corporation of India",
  "Aryabhatta Research Institute of Observational Sciences",
  "Assam Rifles - MHA",
  "Assam University Silchar",
  "Assam Urban Water Supply & Sewerage Board",
  "Atomic Minerals Directorate for Exploration and Research",
  "Automotive Research Association of India",
  "Ayodhya Development Authority (ADA)",
  "Babasaheb Bhimrao Ambedkar University - Lucknow",
  "Banaras Hindu University",
  "Bangalore Metro Rail Corporation Ltd (BMRCL Namma Metro)",
  "Bangalore Water Supply & Sewerage Board (BWSSB)",
  "Bhabha Atomic Research Centre",
  "Bharat Heavy Electricals Limited (BHEL)",
  "Bharat Petroleum Corporation Limited (BPCL Kochi/Mumbai)",
  "Bharat Sanchar Nigam Limited",
  "Bihar Rajya Pul Nirman Nigam Ltd (BRPNNL)",
  "Bihar Urban Infrastructure Dev Corp (BUIDCO)",
  "Board of Radiation and Isotope Technology",
  "Border Roads Organisation (BRO / Project Beacon, Dantak)",
  "Border Security Force (BSF, Ministry of Home Affairs)",
  "Bridge and Roof Company (India) Limited",
  "Bruhat Bengaluru Mahanagara Palike (BBMP Infrastructure)",
  "Bureau of Pharma PSUs of India (BPPI)",
  "Central Board of Secondary Education",
  "Central Cottage Industries Corporation of India Ltd.",
  "Central Council for Research in Yoga and Naturopathy",
  "Central Medical Services Society",
  "Central Pollution Control Board",
  "Central Public Works Department (CPWD Central Vista Project Division)",
  "Central Public Works Department (CPWD Central Vista Project)",
  "Central Public Works Department (CPWD Eastern Zone)",
  "Central Public Works Department (CPWD North Zone)",
  "Central Public Works Department (CPWD Northern Zone)",
  "Central Public Works Department (CPWD Southern Zone)",
  "Central Public Works Department (CPWD Western Zone)",
  "Central Public Works Department (CPWD)",
  "Central Public Works Department (CPWD), MoHUA",
  "Central Railway (Civil Infrastructure)",
  "Central University of Haryana",
  "Central University of Jammu",
  "Central University of Jharkhand",
  "Central University of Rajasthan",
  "Central University of Tamil Nadu",
  "Central Water Commission- DoWR RD and GR",
  "Central Wool Development Board",
  "Chennai Metro Rail Limited",
  "Chennai Metro Rail Limited (CMRL Phase-2)",
  "Chennai Port Trust",
  "City and Industrial Development Corporation (CIDCO)",
  "Coal India Limited (CIL / CMPDI)",
  "Cochin Special Economic Zone Authority",
  "Coffee Board",
  "DG Sashastra Seema Bal,MHA",
  "DG of Central Industrial Security Force,MHA",
  "DG, Indo-Tibetan Border Police Force",
  "DG,BSF,MHA",
  "DG,CRPF,MHA",
  "DG,National Security Guard,MHA",
  "Dattopant Thengadi National Board For Workers Education and Development",
  "Dedicated Freight Corridor Corp of India (DFCCIL)",
  "Dedicated Freight Corridor Corporation of India (DFCCIL) / Railway Board",
  "Defence Research and Development Organisation",
  "Delhi Development Authority",
  "Delhi Development Authority (DDA)",
  "Delhi Jal Board (Govt of NCT of Delhi)",
  "Delhi Metro Rail Corporation (DMRC)",
  "Delhi Metro Rail Corporation Limited",
  "Delhi Metro Rail Corporation Ltd (DMRC)",
  "Delhi Transport Corporation (DTC)",
  "Delhi University",
  "Department of Agricultural Research and Education",
  "Department of Atomic Energy",
  "Department of Drinking Water and Sanitation, Ministry of Jal Shakti",
  "Department of Electronics and Information Technology(DeitY)",
  "Department of Fertilisers",
  "Department of Financial Services",
  "Department of Heavy Industry",
  "Department of Industrial Policy and Promotion",
  "Department of Industrial Training and Employment",
  "Department of Investment and Public Asset Management",
  "Department of Posts",
  "Department of Revenue",
  "Development Commissioner for Handlooms",
  "Dir. Gen. Defence Estates,HQ",
  "Director-Indian Institute of Technology(IIT Delhi)",
  "Directorate General of Hydrocarbons",
  "Directorate General of Lighthouses and Lightships",
  "Directorate General of Married Accommodation Project (DG MAP)",
  "Directorate General of Shipping",
  "Directorate General of Training",
  "Directorate of Construction Services and Estate Management",
  "Directorate of Purchase and Stores",
  "Dr. Harisingh Gour Vishwavidyalaya",
  "Dr. Ram Manohar Lohia Hospital",
  "Dr. Syama Prasad Mookerjee - National Institute of Water and Sanitation (SPM-NIWAS)",
  "Dr.B.R.Ambedkar National Institute of Technology-Jalandhar",
  "Employees Provident Fund Organisation",
  "Employees State Insurance Corporation",
  "Engineers India Limited (EIL)",
  "Engineers India Limited,MoPNG",
  "Food Corporation of India",
  "GAIL (India) Limited",
  "GAIL (India) Limited (National Gas Grid)",
  "GIFT City Company Limited (Fintech Infrastructure)",
  "General Services Organisation (GSO)",
  "Geological Survey of India",
  "Government of Gujarat",
  "Greater Chennai Corporation (GCC Infrastructure)",
  "Greater Hyderabad Municipal Corporation (GHMC)",
  "Greater Mohali Area Development Authority (GMADA)",
  "Grid Controller of India Limited",
  "Gujarat Industrial Development Corporation (GIDC)",
  "Gujarat Maritime Board (GMB Coastal Infra)",
  "Guru Ghasidas Vishwavidyalaya",
  "Gurugram Metropolitan Development Authority (GMDA)",
  "Guwahati Metropolitan Development Authority (GMDA)",
  "H.P. Power Corporation Limited (HPPCL Hydro)",
  "Haryana Shahari Vikas Pradhikaran (HSVP Urban)",
  "Haryana State Industrial & Infra Dev Corp (HSIIDC)",
  "Heavy Water Board",
  "Himachal Pradesh Public Works Department (HP PWD)",
  "Hindustan Organic Chemicals Limited",
  "Hindustan Petroleum Corporation Limited (HPCL Visakh/Mumbai)",
  "Hindustan Salts Limited",
  "Hindustan Urvarak and Rasayan Limited",
  "Hyderabad Metropolitan Development Authority (HMDA)",
  "IISER Berhampur",
  "INDIAN INSTITUTE OF MANAGEMENT CALCUTTA",
  "IRCON International Limited",
  "India Semiconductor Mission",
  "India Trade Promotion Organisation",
  "Indian Institute Of Information Technology Design and Manufacturing Kurnool",
  "Indian Institute of Astrophysics",
  "Indian Institute of Engineering Science and Technology - Shibpur",
  "Indian Institute of Information Technology Allahabad",
  "Indian Institute of Information Technology Design and Manufacturing Kancheepuram",
  "Indian Institute of Management Ahmedabad",
  "Indian Institute of Management Bodh Gaya",
  "Indian Institute of Management Jammu",
  "Indian Institute of Management Lucknow",
  "Indian Institute of Management Mumbai",
  "Indian Institute of Management Ranchi",
  "Indian Institute of Management Sirmaur",
  "Indian Institute of Management Tiruchirappalli",
  "Indian Institute of Management Udaipur",
  "Indian Institute of Management Visakhapatnam",
  "Indian Institute of Science - Bangalore",
  "Indian Institute of Science Education and Research - Kolkata",
  "Indian Institute of Science Education and Research - Mohali",
  "Indian Institute of Science Education and Research - Pune",
  "Indian Institute of Science Education and Research - Thiruvananthapuram",
  "Indian Institute of Science Education and Research - Tirupati",
  "Indian Institute of Science Education and Research Bhopal",
  "Indian Institute of Technology (IIT) Goa",
  "Indian Institute of Technology - Hyderabad",
  "Indian Institute of Technology Bhilai",
  "Indian Institute of Technology Gandhinagar",
  "Indian Institute of Technology Guwahati",
  "Indian Institute of Technology Indore",
  "Indian Institute of Technology Jammu",
  "Indian Institute of Technology Jodhpur",
  "Indian Institute of Technology Kanpur",
  "Indian Institute of Technology Kharagpur",
  "Indian Institute of Technology Mandi",
  "Indian Institute of Technology Patna",
  "Indian Institute of Technology Roorkee",
  "Indian Institute of Technology Ropar",
  "Indian Institute of Technology Tirupati",
  "Indian Institute of Technology(BHU) Varanasi",
  "Indian Institute of Technology(ISM) Dhanbad",
  "Indian Navy Naval Dockyard Engineering",
  "Indian Oil Corporation Limited (IOCL)",
  "Indian Oil Corporation Limited (Pipelines & Refineries)",
  "Indian Statistical Institute - Kolkata",
  "Indian institute of Technology - Dharwad",
  "Indira Gandhi Centre for Atomic Research",
  "Indira Gandhi Rashtriya Uran Akademi (IGRUA)",
  "Indo-Tibetan Border Police (ITBP, MHA)",
  "Industrial Infrastructure Dev Corp (IDCO Odisha)",
  "Inland Waterways Authority of India,MoS",
  "Institute for Plasma Research",
  "Institute for Studies in Industrial Development- ISID",
  "Inter University Accelerator Centre",
  "Inter-University Centre for Astronomy and Astrophysics",
  "International Centre For Automotive Technology",
  "Irrigation & CAD Department, Govt of Telangana",
  "J&K Economic Reconstruction Agency (ERA J&K)",
  "J&K Projects Construction Corporation (JKPCC)",
  "Jaipur Development Authority (JDA)",
  "Jamia Millia Islamia",
  "Jawaharlal Nehru Port Trust",
  "Jawaharlal Nehru University",
  "Karnataka Urban Infrastructure Dev Corp (KUIDFC)",
  "Kerala State Electricity Board (KSEB Power)",
  "Kerala Water Authority (KWA Drinking Water)",
  "Kochi Metro Rail Limited (KMRL Water Metro & Rail)",
  "Kolkata Metropolitan Development Authority (KMDA)",
  "Kolkata Municipal Corporation (KMC Projects)",
  "Kolkata Port Trust",
  "LGB Regional Institute of Mental Health",
  "LNJN National Institute of Criminology and Forensic Science",
  "Ladakh Autonomous Hill Development Council (LAHDC)",
  "Land Ports Authority of India",
  "M.P. Road Development Corporation (MPRDC)",
  "M.P. Urban Development Company (MPUDC)",
  "Madhya Pradesh Metro Rail Corporation Ltd (MPMRCL)",
  "MahaMetro Rail Corporation (Pune & Nagpur Metro)",
  "Mahanagar Telephone Nigam Limited",
  "Maharashtra Jeevan Pradhikaran (MJP)",
  "Maharashtra Metro Rail Corporation Limited (MahaMetro Pune)",
  "Maharashtra State Road Development Corporation (MSRDC)",
  "Maharashtra State Road Development Corporation (MSRDC) / PWD Pune Circle",
  "Mahatma Gandhi Institute of Medical Sciences",
  "Malaviya National Institute of Technology Jaipur",
  "Maulana Azad National Institute of Technology",
  "Military Engineer Services (MES Air Force & Army Bases)",
  "Ministry of Development of North Eastern Region - World Bank Tenders",
  "Ministry of Mines",
  "Ministry of Railways - World Bank Tenders",
  "Ministry of Road Transport and Highways",
  "Ministry of Road Transport and Highways (MoRTH)",
  "Ministry of Shipping",
  "Mormugao Port Authority",
  "Motilal Nehru National Institute of Technology Allahabad",
  "Mumbai Metropolitan Region Development Authority (MMRDA)",
  "Mumbai Metropolitan Region Development Authority (MMRDA) / DMRC",
  "Mumbai Metropolitan Region Development Authority (MMRDA) / MSRDC",
  "Mumbai Port Trust",
  "Musi Riverfront Development Corporation Limited - ADB",
  "NBCC (India) Limited",
  "NHDC Ltd.",
  "NHPC Limited",
  "NITTTR Chennai",
  "NTPC Limited (Renewable Energy & Thermal)",
  "Narcotics Control Bureau (HQ)",
  "Narmada Control Authority",
  "National Agri-Food Biotechnology Institute",
  "National Aluminium Company Limited,NALCO",
  "National Bal Bhavan - NBB",
  "National Bank for Agriculture and Rural Development (NABARD)",
  "National Book Trust-India-Dept of Higher Education",
  "National Buildings Construction Corp (NBCC India Ltd)",
  "National Centre for Earth Science Studies",
  "National Cooperative Development Corporation",
  "National Council of Science Museums",
  "National Forensic Sciences University",
  "National Highways & Infra Development Corp (NHIDCL)",
  "National Highways & Infrastructure Development Corp (NHIDCL) / NHAI",
  "National Highways Authority of India (NHAI)",
  "National Highways Authority of India (NHAI), MoRTH",
  "National Highways and Infrastructure Development Corporation",
  "National Horticulture Board-ADB Tender",
  "National Institute for Empowerment of Persons with Multiple Disablities",
  "National Institute for the Mentally Handicapped",
  "National Institute of Ayurveda",
  "National Institute of Biomedical Genomics",
  "National Institute of Fashion Technology",
  "National Institute of Food Technology Entrepreneurship and Management",
  "National Institute of Homeopathy",
  "National Institute of Ocean Technology",
  "National Institute of Rural Development-MoRD",
  "National Institute of Science Education and Research - Odisha",
  "National Institute of Technology Agartala",
  "National Institute of Technology Calicut",
  "National Institute of Technology Delhi",
  "National Institute of Technology Goa",
  "National Institute of Technology Hamirpur",
  "National Institute of Technology Karnataka",
  "National Institute of Technology Kurukshetra",
  "National Institute of Technology Meghalaya",
  "National Institute of Technology Rourkela",
  "National Institute of Technology Silchar",
  "National Institute of Technology Srinagar",
  "National Institute of Technology Tiruchirappalli",
  "National Institute of Technology Warangal",
  "National Institute of Unani Medicine",
  "National Mission for Clean Ganga",
  "National Project Implementation Unit - World Bank Tenders",
  "Navodaya Vidyalaya Samiti",
  "New Mangalore Port Trust",
  "New Okhla Industrial Development Authority (Noida Authority)",
  "North East Centre for Technology Application and Reach(NECTAR)",
  "North Eastern Electric Power Corporation (NEEPCO)",
  "North Eastern Regional Institute of Water and Land Management",
  "North-Eastern Hill University (NEHU)",
  "Northern Railway (Engineering & S&T Dept)",
  "Nuclear Fuel Complex",
  "Nuclear Recycle Board",
  "Numaligarh Refinery Limited",
  "ONGC Videsh Ltd.",
  "Odisha Mining Corporation Ltd (OMC Civil Infra)",
  "Office of the CAG of India",
  "Oil and Natural Gas Corporation (ONGC)",
  "Oil and Natural Gas Corporation (Offshore Civil Assets)",
  "Petroleum Planning and Analysis Cell",
  "Pimpri-Chinchwad Municipal Corporation (PCMC)",
  "Pondicherry University",
  "Postgraduate Institute of Medical and Education and Research Chandigarh",
  "Power Grid Corporation of India (PowerGrid)",
  "Power Grid Corporation of India Limited (POWERGRID), MoP",
  "Projects and Development India Limited, Fert",
  "Public Health Engineering Department (PHED Bihar)",
  "Public Health Engineering Department (PHED Rajasthan)",
  "Public Works (R&B) Department, Govt of J&K",
  "Public Works Department, Govt of Haryana (Haryana B&R)",
  "Public Works Department, Govt of Karnataka (KPWD)",
  "Public Works Department, Govt of Kerala (Kerala PWD)",
  "Public Works Department, Govt of Madhya Pradesh (MP PWD)",
  "Public Works Department, Govt of Maharashtra (Baramati Division, Pune Circle)",
  "Public Works Department, Govt of Maharashtra (MahaPWD)",
  "Public Works Department, Govt of Maharashtra (PWD Pune Circle, North Division)",
  "Public Works Department, Govt of Maharashtra (PWD Pune Division)",
  "Public Works Department, Govt of Maharashtra (Pune Circle)",
  "Public Works Department, Govt of NCT of Delhi (PWD Delhi)",
  "Public Works Department, Govt of Punjab (Punjab PWD B&R)",
  "Public Works Department, Govt of Rajasthan (Rajasthan PWD)",
  "Public Works Department, Govt of Uttarakhand (UK PWD)",
  "Public Works Department, Govt of West Bengal (WB PWD)",
  "Public Works Roads Department, Govt of Assam (PWRD Assam)",
  "Pune Metropolitan Region Development Authority (PMRDA / PWD Region Pune)",
  "Pune Metropolitan Region Development Authority (PMRDA)",
  "Pune Municipal Corporation (PMC Projects & Special Road Infrastructure)",
  "Pune Municipal Corporation (PMC Projects)",
  "Pune Municipal Corporation (PMC Water Supply Dept)",
  "Pune Municipal Corporation (PMC)",
  "Pune Municipal Corporation (PMC) & NHAI Pune PIU",
  "Punjab Infrastructure Development Board (PIDB)",
  "Punjab Water Supply & Sewerage Board (PWSSB)",
  "Rail Vikas Nigam Limited (RVNL)",
  "RailTel Corporation of India",
  "RailTel Corporation of India Ltd",
  "Raja Ramanna Centre for Advanced Technology Indore",
  "Rajasthan Electronics and Instruments Limited",
  "Rajasthan State Industrial Dev Corp (RIICO)",
  "Rajiv Gandhi Institute of Petroleum Technology",
  "Rashtriya Chemicals and Fertilizers Ltd.",
  "Regional Centre for Urban and Environmental Studies-Lucknow",
  "Registrar General - India",
  "ReserveBank Information technology Pvt Ltd.",
  "Road Construction Department, Govt of Bihar (RCD Bihar)",
  "Roads & Buildings Department, Govt of AP (AP R&B)",
  "Roads & Buildings Department, Govt of Gujarat (Gujarat R&B)",
  "S. V. National Institute of Technology-Surat",
  "SINDHU RESETTLEMENT CORPORATION LIMITED",
  "Sahitya Akademi",
  "Santacruz Electronics Export Processing Zone Special Economic Zone Mumbai",
  "School of Planning and Architecture - Vijayawada",
  "Semi-Conductor Laboratory (SCL)",
  "Smart Cities Mission / MoHUA",
  "Spices Board",
  "Sports Authority of India",
  "Steel Authority of India Limited (SAIL)",
  "Supreme Court of India",
  "TANGEDCO (Tamil Nadu Power Generation & Distribution)",
  "THDC India Limited",
  "Tamil Nadu Highways Department (TN Highways)",
  "Tamil Nadu Water Supply & Drainage Board (TWAD)",
  "Tamilnadu Trade Promotion Organisation",
  "Tata Institute of Social Sciences",
  "Tata Memorial Centre",
  "Telangana State Road Development Corp (TSRDC)",
  "The Fertilisers And Chemicals Travancore Ltd.",
  "The Indian Law Institute",
  "Tripura University",
  "UP Expressways Industrial Development Authority (UPEIDA)",
  "University of Allahabad",
  "University of Hyderabad",
  "Uttar Pradesh Jal Nigam (Rural & Urban)",
  "Uttar Pradesh Public Works Department (UP PWD)",
  "Uttarakhand Jal Sansthan (Drinking Water)",
  "Variable Energy Cyclotron Centre",
  "Visakhapatnam Metropolitan Region Dev Authority (VMRDA)",
  "Visakhapatnam Special Economic Zone Authority",
  "Visva-Bharati",
  "Water Corporation of Odisha (WATCO)",
  "Water Resource Department",
  "West Bengal Housing Infrastructure Dev Corp (WBHIDCO)",
  "West Bengal State Electricity Distribution Co (WBSEDCL)",
  "Western Railway (Civil & Electrical Works)",
  "Works Department, Govt of Odisha (Odisha Works)",
];

export const ALL_MASTER_CITIES: string[] = [
  "Agartala",
  "Agra",
  "Ahmedabad",
  "Ahmedabad (HQ)",
  "Aizawl",
  "Ajmer",
  "Aligarh",
  "Alwar",
  "Amaravati",
  "Ambala",
  "Amritsar",
  "Anantnag",
  "Asansol",
  "Ayodhya",
  "Balasore",
  "Ballari",
  "Baramati",
  "Baramulla",
  "Bathinda",
  "Belagavi",
  "Bengaluru",
  "Berhampur",
  "Bhagalpur",
  "Bhavnagar",
  "Bhilai",
  "Bhopal",
  "Bhubaneswar",
  "Bhubaneswar (HQ)",
  "Bikaner",
  "Bilaspur",
  "Border Sectors",
  "Central Delhi",
  "Chakan",
  "Chandigarh",
  "Chennai",
  "Chennai (HQ)",
  "Coimbatore",
  "Cuttack",
  "Darbhanga",
  "Dehradun",
  "Dhanbad",
  "Dharamshala",
  "Dharwad",
  "Dibrugarh",
  "Durgapur",
  "Dwarka",
  "Faridabad",
  "GIFT City",
  "Gandhinagar",
  "Gaya",
  "Ghaziabad",
  "Guntur",
  "Gurugram",
  "Guwahati",
  "Gwalior",
  "Haldia",
  "Hamirpur",
  "Haridwar",
  "Hassan",
  "Hill Regions",
  "Hisar",
  "Howrah",
  "Hubli-Dharwad",
  "Hyderabad",
  "Hyderabad (HQ)",
  "Imphal",
  "Indore",
  "Jabalpur",
  "Jaipur",
  "Jaipur (HQ)",
  "Jalandhar",
  "Jammu",
  "Jasola",
  "Jodhpur",
  "Jorhat",
  "Kakinada",
  "Kalaburagi",
  "Kannur",
  "Kanpur",
  "Karimnagar",
  "Karnal",
  "Khammam",
  "Kharagpur",
  "Kochi",
  "Kohima",
  "Kolkata",
  "Kolkata Metropolitan",
  "Kollam",
  "Kota",
  "Kozhikode",
  "Kullu",
  "Kupwara",
  "Kurukshetra",
  "Leh-Ladakh",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Mandi",
  "Mangalore",
  "Mohali (SAS Nagar)",
  "Mumbai",
  "Mumbai Metropolitan",
  "Muzaffarpur",
  "Mysuru",
  "Nagpur",
  "Narela",
  "Nashik",
  "Navi Mumbai",
  "Nellore",
  "New Delhi",
  "New Delhi (HQ)",
  "Nizamabad",
  "Noida / NCR",
  "Palakkad",
  "Pan-India",
  "Panaji",
  "Panchkula",
  "Panipat",
  "Patiala",
  "Patna",
  "Pimpri-Chinchwad",
  "Pitampura",
  "Port Blair",
  "Prayagraj",
  "Puducherry",
  "Pune",
  "Puri",
  "Purnia",
  "Raebareli",
  "Raipur",
  "Rajkot",
  "Ranchi",
  "Regional / Border",
  "Rewa",
  "Rewari",
  "Rishikesh",
  "Rohini",
  "Rohtak",
  "Roorkee",
  "Ropar",
  "Rourkela",
  "Sagar",
  "Salem",
  "Sambalpur",
  "Secunderabad",
  "Shillong",
  "Shimla",
  "Silchar",
  "Siliguri",
  "Siri Fort",
  "South Delhi",
  "Srinagar",
  "Statewide / Other",
  "Surat",
  "Tezpur",
  "Thane",
  "Thiruvananthapuram",
  "Thrissur",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupati",
  "Udaipur",
  "Udhampur",
  "Ujjain",
  "Vadodara",
  "Varanasi",
  "Vasco da Gama",
  "Vellore",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
];

export const canonicalizeCategory = (cat?: string, title?: string, scope?: string): string => {
  const c = (cat || '').toLowerCase();
  const full = `${c} ${(title || '').toLowerCase()} ${(scope || '').toLowerCase()}`;

  if (['metro', 'railway', 'highway', 'road', 'expressway', 'flyover', 'bridge', 'viaduct', 'tunnel', 'kavach', 'track', 'ropeway'].some(k => full.includes(k))) {
    return 'Highways, Metros & Rail Transport';
  }
  if (['water', 'irrigation', 'canal', 'dam', 'drainage', 'flood', 'sewer', 'nal ka jal', 'barrage', 'river', 'stp', 'watco'].some(k => full.includes(k))) {
    return 'Agriculture, Water Resources & Food Storage';
  }
  if (['power', 'grid', 'solar', 'substation', 'electrification', 'atomic', 'hydro', 'transmission', 'energy'].some(k => full.includes(k))) {
    return 'Atomic Energy, Power & Grid Infra';
  }
  if (['defence', 'defense', 'border', 'naval', 'airfield', 'military', 'shelter', 'fencing', 'paramilitary'].some(k => full.includes(k))) {
    return 'Defence, Border Security & Paramilitary';
  }
  if (['hospital', 'medical', 'health', 'aiims', 'clinic'].some(k => full.includes(k))) {
    return 'Healthcare, Medical & Hospital Infra';
  }
  if (['university', 'college', 'iit', 'iim', 'nit', 'education', 'school', 'institute', 'campus', 'research', 'lab'].some(k => full.includes(k))) {
    return 'Higher Education & Institutional Infra';
  }
  if (['telecom', 'semiconductor', 'it park', 'software', 'fintech', 'data center', 'smart city'].some(k => full.includes(k))) {
    return 'IT, Telecom & Semiconductor Works';
  }
  if (['pipeline', 'refinery', 'petrochem', 'oil', 'gas', 'hydrocarbon', 'fertilizer', 'lng', 'cryogenic', 'mining'].some(k => full.includes(k))) {
    return 'Petrochem, Fertilizers & Minerals';
  }
  if (['port', 'maritime', 'dock', 'shipping', 'coastal', 'harbour'].some(k => full.includes(k))) {
    return 'Ports, Shipping & Maritime Works';
  }
  return 'Central Government Procurement';
};

export const canonicalizeState = (state?: string, title?: string, scope?: string, auth?: string, portal?: string): string => {
  // 1. Strict Statutory State Portal binding:
  // Statutory state procurement portals (e.g. MahaTenders -> Maharashtra, UP e-Procure -> Uttar Pradesh, etc.)
  // are legally restricted to their respective State. They MUST NEVER show Pan-India, Delhi, or any other state.
  const boundState = getPortalBoundState(portal);
  if (boundState) {
    return boundState;
  }

  // 2. If it's a Central / Multi-state portal, check the explicit state if valid
  const s = (state || '').toLowerCase().trim();
  if (s) {
    if (s.includes('andaman')) return 'Andaman & Nicobar';
    if (s.includes('andhra')) return 'Andhra Pradesh';
    if (s.includes('arunachal')) return 'Arunachal Pradesh';
    if (s.includes('assam')) return 'Assam';
    if (s.includes('bihar')) return 'Bihar';
    if (s.includes('chandigarh')) return 'Chandigarh';
    if (s.includes('chhattisgarh')) return 'Chhattisgarh';
    if (s.includes('delhi')) return 'Delhi';
    if (s.includes('goa')) return 'Goa';
    if (s.includes('gujarat')) return 'Gujarat';
    if (s.includes('haryana')) return 'Haryana';
    if (s.includes('himachal')) return 'Himachal Pradesh';
    if (s.includes('jammu') || s.includes('kashmir')) return 'Jammu & Kashmir';
    if (s.includes('jharkhand')) return 'Jharkhand';
    if (s.includes('karnataka')) return 'Karnataka';
    if (s.includes('kerala')) return 'Kerala';
    if (s.includes('ladakh') || s.includes('leh')) return 'Ladakh';
    if (s.includes('madhya')) return 'Madhya Pradesh';
    if (s.includes('maharashtra')) return 'Maharashtra';
    if (s.includes('manipur')) return 'Manipur';
    if (s.includes('meghalaya')) return 'Meghalaya';
    if (s.includes('mizoram')) return 'Mizoram';
    if (s.includes('nagaland')) return 'Nagaland';
    if (s.includes('odisha') || s.includes('orissa')) return 'Odisha';
    if (s.includes('puducherry') || s.includes('pondicherry')) return 'Puducherry';
    if (s.includes('punjab')) return 'Punjab';
    if (s.includes('rajasthan')) return 'Rajasthan';
    if (s.includes('sikkim')) return 'Sikkim';
    if (s.includes('tamil')) return 'Tamil Nadu';
    if (s.includes('telangana')) return 'Telangana';
    if (s.includes('tripura')) return 'Tripura';
    if (s.includes('uttar pradesh') || s === 'up') return 'Uttar Pradesh';
    if (s.includes('uttarakhand') || s.includes('uttaranchal')) return 'Uttarakhand';
    if (s.includes('bengal')) return 'West Bengal';
  }

  // 3. Keyword scan in title, scope, authority for specific state
  const full = `${s} ${(title || '').toLowerCase()} ${(scope || '').toLowerCase()} ${(auth || '').toLowerCase()}`;
  if (['andaman', 'nicobar', 'port blair'].some(k => full.includes(k))) return 'Andaman & Nicobar';
  if (['tamil nadu', 'chennai', 'coimbatore', 'madurai', 'cmrl', 'twad'].some(k => full.includes(k))) return 'Tamil Nadu';
  if (['karnataka', 'bengaluru', 'bangalore', 'bbmp', 'bmrcl', 'krride'].some(k => full.includes(k))) return 'Karnataka';
  if (['kerala', 'kochi', 'thiruvananthapuram', 'kmrl', 'krdcl'].some(k => full.includes(k))) return 'Kerala';
  if (['telangana', 'hyderabad', 'hmws&sb', 'tsspdcl', 'hmda'].some(k => full.includes(k))) return 'Telangana';
  if (['andhra', 'visakhapatnam', 'vijayawada', 'amaravati', 'apgenco'].some(k => full.includes(k))) return 'Andhra Pradesh';
  if (['maharashtra', 'mumbai', 'pune', 'nagpur', 'mmrda', 'cidco', 'midc', 'msrdc'].some(k => full.includes(k))) return 'Maharashtra';
  if (['gujarat', 'ahmedabad', 'surat', 'vadodara', 'gift city'].some(k => full.includes(k))) return 'Gujarat';
  if (['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'riico'].some(k => full.includes(k))) return 'Rajasthan';
  if (['west bengal', 'kolkata', 'howrah', 'siliguri', 'kmda'].some(k => full.includes(k))) return 'West Bengal';
  if (['odisha', 'bhubaneswar', 'cuttack', 'puri', 'watco'].some(k => full.includes(k))) return 'Odisha';
  if (['bihar', 'patna', 'gaya', 'buidco'].some(k => full.includes(k))) return 'Bihar';
  if (['madhya pradesh', 'bhopal', 'indore', 'jabalpur'].some(k => full.includes(k))) return 'Madhya Pradesh';
  if (['haryana', 'gurugram', 'faridabad', 'panipat', 'hsvp', 'gmda'].some(k => full.includes(k))) return 'Haryana';
  if (['punjab', 'amritsar', 'ludhiana', 'mohali'].some(k => full.includes(k))) return 'Punjab';
  if (['uttar pradesh', 'lucknow', 'noida', 'varanasi', 'kanpur', 'upeida'].some(k => full.includes(k))) return 'Uttar Pradesh';
  if (['delhi', 'dmrc', 'dda', 'dwarka', 'nct of delhi'].some(k => full.includes(k))) return 'Delhi';
  if (['assam', 'guwahati', 'silchar', 'brahmaputra'].some(k => full.includes(k))) return 'Assam';
  if (['ladakh', 'leh'].some(k => full.includes(k))) return 'Ladakh';
  if (['jammu', 'kashmir', 'srinagar'].some(k => full.includes(k))) return 'Jammu & Kashmir';
  if (['uttarakhand', 'dehradun', 'rishikesh'].some(k => full.includes(k))) return 'Uttarakhand';
  if (['himachal', 'shimla', 'kullu'].some(k => full.includes(k))) return 'Himachal Pradesh';
  if (['goa', 'panaji'].some(k => full.includes(k))) return 'Goa';
  if (['jharkhand', 'ranchi', 'jamshedpur'].some(k => full.includes(k))) return 'Jharkhand';
  if (['chhattisgarh', 'raipur'].some(k => full.includes(k))) return 'Chhattisgarh';

  return 'Pan-India / Central';
};

export const STATE_CANONICAL_CITIES: Record<string, { cities: string[]; defaultCity: string }> = {
  'Maharashtra': {
    cities: ['Pune', 'Mumbai', 'Thane', 'Navi Mumbai', 'Chakan', 'Baramati', 'Nagpur', 'Nashik', 'Pimpri-Chinchwad'],
    defaultCity: 'Pune'
  },
  'Uttar Pradesh': {
    cities: ['Lucknow', 'Noida / NCR', 'Kanpur', 'Varanasi', 'Prayagraj', 'Agra', 'Ghaziabad', 'Ayodhya', 'Aligarh', 'Raebareli'],
    defaultCity: 'Lucknow'
  },
  'Tamil Nadu': {
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore'],
    defaultCity: 'Chennai'
  },
  'Karnataka': {
    cities: ['Bengaluru', 'Mysuru', 'Hubli-Dharwad', 'Mangalore', 'Belagavi', 'Dharwad', 'Hassan'],
    defaultCity: 'Bengaluru'
  },
  'Delhi': {
    cities: ['New Delhi', 'Dwarka', 'Rohini', 'Narela', 'Jasola', 'Central Delhi', 'South Delhi', 'Pitampura', 'Siri Fort'],
    defaultCity: 'New Delhi'
  },
  'Gujarat': {
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Gandhinagar', 'Rajkot', 'Bhavnagar', 'GIFT City'],
    defaultCity: 'Gandhinagar'
  },
  'Kerala': {
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur'],
    defaultCity: 'Kochi'
  },
  'Telangana': {
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Secunderabad'],
    defaultCity: 'Hyderabad'
  },
  'Andhra Pradesh': {
    cities: ['Visakhapatnam', 'Vijayawada', 'Amaravati', 'Guntur', 'Tirupati', 'Nellore', 'Kakinada'],
    defaultCity: 'Amaravati'
  },
  'Madhya Pradesh': {
    cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa'],
    defaultCity: 'Bhopal'
  },
  'Rajasthan': {
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
    defaultCity: 'Jaipur'
  },
  'West Bengal': {
    cities: ['Kolkata', 'Siliguri', 'Howrah', 'Asansol', 'Durgapur', 'Haldia', 'Kharagpur'],
    defaultCity: 'Kolkata'
  },
  'Odisha': {
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 'Berhampur', 'Balasore'],
    defaultCity: 'Bhubaneswar'
  },
  'Bihar': {
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
    defaultCity: 'Patna'
  },
  'Punjab': {
    cities: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Ropar', 'Bathinda', 'Chandigarh', 'Patiala', 'Mohali (SAS Nagar)'],
    defaultCity: 'Amritsar'
  },
  'Haryana': {
    cities: ['Gurugram', 'Faridabad', 'Panipat', 'Kurukshetra', 'Rewari', 'Chandigarh', 'Panchkula', 'Rohtak', 'Ambala', 'Hisar', 'Karnal'],
    defaultCity: 'Gurugram'
  },
  'Assam': {
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
    defaultCity: 'Guwahati'
  },
  'Jammu & Kashmir': {
    cities: ['Srinagar', 'Jammu', 'Baramulla', 'Udhampur', 'Kupwara', 'Anantnag', 'Leh-Ladakh'],
    defaultCity: 'Srinagar'
  },
  'Uttarakhand': {
    cities: ['Dehradun', 'Rishikesh', 'Haridwar', 'Roorkee', 'Haldwani', 'Shimla', 'Bilaspur', 'Hamirpur', 'Mandi', 'Dharamshala'],
    defaultCity: 'Dehradun'
  },
  'Goa': {
    cities: ['Panaji', 'Margao', 'Vasco da Gama'],
    defaultCity: 'Panaji'
  },
  'Jharkhand': {
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
    defaultCity: 'Ranchi'
  },
  'Andaman & Nicobar': {
    cities: ['Port Blair'],
    defaultCity: 'Port Blair'
  },
  'Chandigarh': {
    cities: ['Chandigarh'],
    defaultCity: 'Chandigarh'
  },
  'Chhattisgarh': {
    cities: ['Raipur', 'Bhilai', 'Bilaspur'],
    defaultCity: 'Raipur'
  },
  'Himachal Pradesh': {
    cities: ['Shimla', 'Bilaspur', 'Hamirpur', 'Mandi', 'Dharamshala'],
    defaultCity: 'Shimla'
  },
  'Pan-India / Central': {
    cities: ['New Delhi', 'All India', 'National / Multi-State', 'Regional / Other'],
    defaultCity: 'All India'
  }
};

/**
 * Normalizes and validates tender City against the canonical State.
 * Ensures a state tender never exhibits a city from another state (e.g. MahaTenders -> Delhi).
 */
export const canonicalizeCity = (
  city?: string,
  state?: string,
  title?: string,
  scope?: string,
  auth?: string,
  portal?: string
): string => {
  const normState = state || canonicalizeState(undefined, title, scope, auth, portal);
  const stateConfig = STATE_CANONICAL_CITIES[normState];

  if (!stateConfig) {
    return city?.trim() || 'All India';
  }

  // Helper to test if a candidate city matches a text string
  const cityMatches = (candidate: string, text: string): boolean => {
    const parts = [candidate.toLowerCase()];
    if (candidate.includes('/')) {
      candidate.split('/').forEach(p => parts.push(p.trim().toLowerCase()));
    }
    if (candidate.includes('(')) {
      parts.push(candidate.split('(')[0].trim().toLowerCase());
    }
    if (candidate.includes('-')) {
      candidate.split('-').forEach(p => parts.push(p.trim().toLowerCase()));
    }
    return parts.some(p => p.length >= 3 && text.toLowerCase().includes(p));
  };

  // 1. If incoming city matches a known city in this state (exact or compound base)
  if (city) {
    const trimmed = city.trim().toLowerCase();
    for (const validCity of stateConfig.cities) {
      if (validCity.toLowerCase() === trimmed || cityMatches(validCity, trimmed) || cityMatches(trimmed, validCity)) {
        return validCity;
      }
    }
  }

  // 2. Scan title, scope, authority for known cities in this state
  const full = `${(title || '').toLowerCase()} ${(scope || '').toLowerCase()} ${(auth || '').toLowerCase()}`;
  for (const validCity of stateConfig.cities) {
    if (cityMatches(validCity, full)) {
      return validCity;
    }
  }

  // 3. Organization-specific known locations
  const a = `${(auth || '').toLowerCase()} ${full}`;
  if (normState === 'Maharashtra') {
    if (a.includes('automotive research') || a.includes('arai')) return 'Pune';
    if (a.includes('pune') || a.includes('pmc') || a.includes('pcmc') || a.includes('pmrda')) return 'Pune';
    if (a.includes('tata institute of social sciences') || a.includes('tiss') || a.includes('tata memorial') || a.includes('bhabha') || a.includes('barc') || a.includes('santacruz') || a.includes('mumbai port')) return 'Mumbai';
    if (a.includes('cidco') || a.includes('navi mumbai')) return 'Navi Mumbai';
    if (a.includes('nagpur') || a.includes('mahametro')) return 'Nagpur';
    if (a.includes('nashik')) return 'Nashik';
    if (a.includes('thane')) return 'Thane';
    if (a.includes('chakan')) return 'Chakan';
    if (a.includes('baramati')) return 'Baramati';
  }
  if (normState === 'Uttar Pradesh') {
    if (a.includes('noida') || a.includes('greater noida')) return 'Noida / NCR';
    if (a.includes('lucknow') || a.includes('hurl') || a.includes('urban and environmental')) return 'Lucknow';
    if (a.includes('varanasi') || a.includes('bhu') || a.includes('banaras')) return 'Varanasi';
    if (a.includes('kanpur') || a.includes('iitk')) return 'Kanpur';
    if (a.includes('prayagraj') || a.includes('allahabad') || a.includes('mnnit')) return 'Prayagraj';
    if (a.includes('ayodhya') || a.includes('ada')) return 'Ayodhya';
    if (a.includes('aligarh') || a.includes('amu')) return 'Aligarh';
    if (a.includes('raebareli')) return 'Raebareli';
    if (a.includes('agra')) return 'Agra';
    if (a.includes('ghaziabad')) return 'Ghaziabad';
  }
  if (normState === 'Punjab') {
    if (a.includes('mohali') || a.includes('sas nagar') || a.includes('gmada')) return 'Mohali (SAS Nagar)';
    if (a.includes('jalandhar') || a.includes('nitj')) return 'Jalandhar';
    if (a.includes('ropar') || a.includes('iit ropar')) return 'Ropar';
    if (a.includes('bathinda')) return 'Bathinda';
    if (a.includes('amritsar')) return 'Amritsar';
    if (a.includes('ludhiana')) return 'Ludhiana';
    if (a.includes('patiala')) return 'Patiala';
  }
  if (normState === 'Delhi') {
    if (a.includes('dwarka')) return 'Dwarka';
    if (a.includes('rohini')) return 'Rohini';
    if (a.includes('narela')) return 'Narela';
    if (a.includes('jasola')) return 'Jasola';
    if (a.includes('pitampura')) return 'Pitampura';
    if (a.includes('central delhi')) return 'Central Delhi';
    if (a.includes('south delhi')) return 'South Delhi';
    if (a.includes('siri fort')) return 'Siri Fort';
    return 'New Delhi';
  }
  if (normState === 'Karnataka') {
    if (a.includes('mangalore') || a.includes('new mangalore port')) return 'Mangalore';
    if (a.includes('dharwad')) return 'Dharwad';
    if (a.includes('mysuru')) return 'Mysuru';
    if (a.includes('coffee board') || a.includes('bbmp') || a.includes('bmrcl') || a.includes('iisc') || a.includes('bengaluru') || a.includes('bangalore')) return 'Bengaluru';
  }
  if (normState === 'Kerala') {
    if (a.includes('spices board') || a.includes('fertilisers and chemicals travancore') || a.includes('kmrl') || a.includes('fact') || a.includes('cochin') || a.includes('kochi')) return 'Kochi';
    if (a.includes('calicut') || a.includes('kozhikode')) return 'Kozhikode';
    if (a.includes('thiruvananthapuram') || a.includes('iiser')) return 'Thiruvananthapuram';
  }
  if (normState === 'Tamil Nadu') {
    if (a.includes('tiruchirappalli') || a.includes('iim trichy') || a.includes('nitt')) return 'Tiruchirappalli';
    if (a.includes('coimbatore')) return 'Coimbatore';
    if (a.includes('madurai')) return 'Madurai';
    if (a.includes('chennai') || a.includes('cmrl') || a.includes('igcar')) return 'Chennai';
  }
  if (normState === 'Andhra Pradesh') {
    if (a.includes('visakhapatnam') || a.includes('vsez') || a.includes('vizag')) return 'Visakhapatnam';
    if (a.includes('vijayawada') || a.includes('planning and architecture')) return 'Vijayawada';
    if (a.includes('tirupati')) return 'Tirupati';
    if (a.includes('kurnool')) return 'Kurnool';
  }
  if (normState === 'Gujarat') {
    if (a.includes('hindustan salts') || a.includes('sindhu') || a.includes('gandhinagar') || a.includes('iit gn')) return 'Gandhinagar';
    if (a.includes('ahmedabad') || a.includes('amc') || a.includes('iim a')) return 'Ahmedabad';
    if (a.includes('surat') || a.includes('svnit')) return 'Surat';
    if (a.includes('vadodara')) return 'Vadodara';
    if (a.includes('gift city')) return 'GIFT City';
  }
  if (normState === 'West Bengal') {
    if (a.includes('kharagpur') || a.includes('iit kgp')) return 'Kharagpur';
    if (a.includes('howrah') || a.includes('iiest') || a.includes('shibpur')) return 'Howrah';
    if (a.includes('siliguri')) return 'Siliguri';
    if (a.includes('kolkata') || a.includes('calcutta') || a.includes('vecc')) return 'Kolkata';
  }
  if (normState === 'Odisha') {
    if (a.includes('berhampur')) return 'Berhampur';
    if (a.includes('rourkela')) return 'Rourkela';
    if (a.includes('bhubaneswar') || a.includes('nalco') || a.includes('aiims')) return 'Bhubaneswar';
  }

  // 4. Fallback to state's default city
  return stateConfig.defaultCity;
};
