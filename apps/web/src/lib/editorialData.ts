export interface Editorial {
    id: string;
    category: string;
    title: string;
    context: string;
    easyExplanation: string; // super simple "explain like I'm five" version
    deepDive: string; // extended analysis paragraph
    positives: string[];
    negatives: string[];
    keyVocab: { term: string; definition: string }[];
    discussionPoints: string[];
    verdict: string; // one-sentence balanced takeaway
    tags: string[];
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    readTime: number; // minutes
    source: string;
    publishedAt: string;
    refreshCycle: number;
}

export const CATEGORIES = [
    { id: "sports", label: "Sports", emoji: "⚽" },
    { id: "fintech", label: "FinTech", emoji: "💳" },
    { id: "politics", label: "Politics", emoji: "🏛️" },
    { id: "world-affairs", label: "World Affairs", emoji: "🌍" },
    { id: "technology", label: "Technology & Innovation", emoji: "🚀" },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

const d0 = new Date().toISOString();
const d1 = new Date(Date.now() - 86400000).toISOString();

export const FALLBACK_EDITORIALS: Editorial[] = [
    /* ══════════════ SPORTS ══════════════ */
    {
        id: "sp-1",
        category: "sports",
        title: "The Rise of AI Coaching in Professional Football",
        context:
            "Artificial intelligence tools are now being integrated into football coaching strategies worldwide. From real-time player fatigue analysis to opponent pattern recognition, AI is reshaping how teams prepare and compete at the highest level.",
        easyExplanation: "Imagine a super-smart computer assistant that helps football coaches by watching players' energy and predicting injuries before they happen. It's like having a crystal ball for the team's health!",
        deepDive:
            "Clubs like FC Barcelona, Manchester City, and Bayern Munich now deploy computer-vision systems that track 25+ data points per player 50 times per second during matches. These systems measure sprint deceleration patterns to flag micro-injuries before they become macro-problems. The implications extend beyond elite football — lower-league clubs leveraging open-source AI tools have reported 18% reductions in training-related injuries within a single season, effectively bridging a talent gap that money alone could not close.",
        positives: [
            "Real-time injury risk prediction reduces career-ending mistakes",
            "Data-driven tactics give smaller clubs a competitive edge",
            "Training load optimisation improves peak performance windows",
            "Video analysis cuts 12+ hours of manual scouting per week",
        ],
        negatives: [
            "Over-reliance on data may suppress creative, intuitive play",
            "High implementation costs widen the gap between rich and poor clubs",
            "Player autonomy and coach instinct risk being systematically undervalued",
            "Data privacy concerns arise when biometric data is shared with third parties",
        ],
        keyVocab: [
            { term: "Expected Goals (xG)", definition: "A metric quantifying the quality of a scoring chance based on historical data" },
            { term: "High-Performance Analytics", definition: "Real-time statistical modelling applied to athletic training and match strategy" },
            { term: "Biomechanical Load", definition: "The cumulative physical stress placed on an athlete's body during training" },
        ],
        discussionPoints: [
            "Should AI decision-support tools be mandatory across all professional leagues?",
            "How do you balance quantitative analysis with the intangible quality of 'football IQ'?",
            "What ethical framework should govern biometric data ownership in sport?",
        ],
        verdict: "AI coaching tools offer measurable performance gains but demand careful governance to protect player welfare and competitive fairness.",
        tags: ["AI", "Football", "Analytics", "Technology", "Sports Science"],
        difficulty: "Intermediate",
        readTime: 5,
        source: "The Athletic",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "sp-2",
        category: "sports",
        title: "Olympic Inclusion of Esports: Sport or Entertainment?",
        context:
            "The International Olympic Committee has officially sanctioned an Esports Olympic Games event, generating fierce debate about inclusion criteria, athlete welfare, and the evolving definition of sport in the 21st century.",
        easyExplanation: "The Olympics are adding video games to their events! People are now arguing if playing video games should be counted as a real sport like running or swimming.",
        deepDive:
            "The inaugural Olympic Esports Games in Saudi Arabia attracted 500,000+ live viewers and 250 million digital interactions — metrics that rival traditional Olympic sports broadcasts. However, the structural issues run deep: game publishers retain IP control over titles, meaning the IOC cannot guarantee which games will feature in future editions. This corporate power dynamic is unprecedented in Olympic history and raises fundamental questions about sovereignty of sporting governance.",
        positives: [
            "Engages younger, digitally-native audiences with the Olympic brand",
            "Recognises mental agility and reflexes as legitimate athletic skills",
            "Opens sponsorship avenues that could fund traditional sports programs",
            "Provides professional legitimacy to a global esports workforce",
        ],
        negatives: [
            "Dilutes the physical exertion requirement central to Olympic identity",
            "Publishers retain commercial control over game content and competitive rules",
            "Risk of gambling and addiction narratives overshadowing athletic achievement",
            "Violent game genres create content suitability conflicts with Olympic values",
        ],
        keyVocab: [
            { term: "IOC", definition: "International Olympic Committee — the governing body of the Olympic Games" },
            { term: "IP Control", definition: "Intellectual property rights allowing publishers to dictate how their games are used commercially" },
            { term: "Esports Ecosystem", definition: "The interconnected industry of competitive gaming including teams, leagues, broadcasters, and sponsors" },
        ],
        discussionPoints: [
            "What criteria should determine whether a competitive activity qualifies as an Olympic sport?",
            "How should the IOC negotiate IP rights with commercial game publishers?",
            "Can esports coexist with traditional sports without diluting the Olympic brand?",
        ],
        verdict: "Esports' Olympic inclusion broadens relevance but demands a governance framework that prevents commercial interests from dictating Olympic integrity.",
        tags: ["Esports", "Olympics", "Gaming", "Sports Governance", "Youth"],
        difficulty: "Beginner",
        readTime: 4,
        source: "BBC Sport",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════════════ FINTECH ══════════════ */
    {
        id: "ft-1",
        category: "fintech",
        title: "Central Bank Digital Currencies: The Future of Money or State Surveillance?",
        context:
            "Over 130 countries are now exploring or piloting Central Bank Digital Currencies (CBDCs). Proponents argue they will modernise payment infrastructure; critics warn they enable unprecedented government surveillance of financial behaviour.",
        easyExplanation: "Governments are making their own digital versions of money, like digital dollars. It makes paying easier, but it also lets the government see exactly what you spend your money on.",
        deepDive:
            "China's e-CNY — the world's most advanced CBDC — has processed over ¥7 trillion in transactions since 2020. The Chinese government's ability to set expiry dates on digital money (forcing spending) and restrict purchases by category demonstrates that CBDCs are not simply digital cash — they are programmable monetary policy tools. The EU's Digital Euro project specifically bans programmability features due to civil liberties concerns, creating a fascinating geopolitical split in how democracies versus authoritarian states design money.",
        positives: [
            "Instant cross-border transfers cut remittance costs for migrant workers by up to 70%",
            "Financial inclusion for the 1.4 billion unbanked adults globally",
            "Direct stimulus delivery in crises without banking intermediaries or delays",
            "Eliminates counterfeiting risk and reduces cash handling infrastructure costs",
        ],
        negatives: [
            "Government visibility into every transaction threatens financial privacy",
            "Programmable money enables authorities to restrict spending on disfavoured categories",
            "Centralised infrastructure creates a single catastrophic point of failure",
            "Could disintermediate commercial banks, destabilising the existing credit system",
        ],
        keyVocab: [
            { term: "CBDC", definition: "Central Bank Digital Currency — government-issued digital money backed by a central bank" },
            { term: "Programmable Money", definition: "Digital currency with embedded rules that restrict when, where, or how it can be spent" },
            { term: "Financial Disintermediation", definition: "Removing banks from the chain between savers and the economy" },
        ],
        discussionPoints: [
            "Should citizens have a constitutional right to anonymous financial transactions?",
            "How do democracies design CBDCs that provide benefits without enabling surveillance?",
            "What happens to commercial banking if CBDCs provide direct central bank accounts for all?",
        ],
        verdict: "CBDCs offer transformative efficiency gains but their design choices will determine whether they empower citizens or entrench state control over economic life.",
        tags: ["CBDC", "Digital Currency", "Central Bank", "Privacy", "FinTech"],
        difficulty: "Advanced",
        readTime: 6,
        source: "Financial Times",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "ft-2",
        category: "fintech",
        title: "Buy Now Pay Later: Democratising Credit or Fuelling a Debt Crisis?",
        context:
            "BNPL services processed over $130 billion in transactions last year. Regulators in the UK, EU, and US are moving to bring BNPL under consumer credit frameworks, while providers argue the product is safer than traditional credit cards.",
        easyExplanation: "Apps like Klarna let you buy things now and pay for them later in small chunks. It's helpful if you don't have much money today, but it can be dangerous if you forget to pay and end up in debt.",
        deepDive:
            "The BNPL industry's fastest-growing demographic is 18-24 year olds — a cohort who largely lack credit histories and have never been targeted by traditional lenders. Klarna's internal data shows 40% of its users have never held a credit card. This cuts both ways: for many, BNPL is the first credit product they've responsibly managed; for others, particularly those using multiple BNPL services simultaneously, default rates run at 3× the rate of credit card defaults. The regulatory gap — BNPL defaults don't appear on credit reports — means these users are invisible to the mainstream credit system while accumulating real debt.",
        positives: [
            "Zero-interest instalment plans help low-income consumers manage cash flow",
            "Simpler onboarding than credit cards dramatically improves financial accessibility",
            "For responsible users, builds financial discipline without high APR exposure",
            "Drives higher conversion for small e-commerce merchants, boosting the creator economy",
        ],
        negatives: [
            "Hidden late fees can spiral into unmanageable personal debt for vulnerable users",
            "Young users spend beyond their means without understanding credit risk mechanisms",
            "Credit score invisibility means defaults go unreported, distorting lending markets",
            "Multi-provider stacking allows users to borrow far beyond what any single check would permit",
        ],
        keyVocab: [
            { term: "BNPL", definition: "Buy Now Pay Later — short-term instalment credit typically offered at point of purchase" },
            { term: "APR", definition: "Annual Percentage Rate — the annualised cost of credit including fees and interest" },
            { term: "Credit Stacking", definition: "Using multiple credit products simultaneously to exceed any individual credit limit" },
        ],
        discussionPoints: [
            "Should BNPL be regulated identically to consumer credit cards?",
            "How should lenders balance financial inclusion with borrower protection?",
            "Who bears moral responsibility for BNPL debt — providers, platforms, or consumers?",
        ],
        verdict: "BNPL democratises credit access but requires mandatory credit reporting and affordability checks to prevent harm to its most vulnerable users.",
        tags: ["BNPL", "Consumer Credit", "FinTech", "Regulation", "Debt"],
        difficulty: "Intermediate",
        readTime: 5,
        source: "Reuters",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════════════ POLITICS ══════════════ */
    {
        id: "po-1",
        category: "politics",
        title: "Universal Basic Income: What the Evidence Actually Shows",
        context:
            "Several countries including Finland, Kenya, and Canada have concluded major UBI experiments. As AI threatens structural job displacement, this debate is moving from fringe economics to mainstream political platforms worldwide.",
        easyExplanation: "Because robots and AI might take over many people's jobs, some think the government should just give everyone a basic amount of money every month to survive.",
        deepDive:
            "Finland's 2017-2018 experiment gave 2,000 unemployed citizens €560/month unconditionally for two years. Results showed recipients were significantly happier, healthier, and trusted institutions more — but employment rates barely shifted. Kenya's GiveDirectly programme, now the world's largest UBI experiment, tells a different story: direct transfers in low-income contexts generated measurable 'cash multiplier' effects, with every $1 transferred generating $2.60 in local economic activity via spending circulation. The lesson appears to be that UBI's effects are highly context-dependent.",
        positives: [
            "Reduces extreme poverty without bureaucratic means-testing overhead",
            "Enables risk-taking — entrepreneurship, retraining, caregiving — through financial security",
            "Cash multiplier effects stimulate local economies, particularly in low-income regions",
            "Eliminates the 'welfare trap' where taking a job reduces net income",
        ],
        negatives: [
            "Fiscal sustainability requires significant tax reform or deficit spending",
            "Flat payments disproportionately benefit low-cost rural areas over expensive cities",
            "May reduce labour supply in sectors already facing critical workforce shortages",
            "Politically polarising — simultaneously attacked from the left (too low) and right (too costly)",
        ],
        keyVocab: [
            { term: "UBI", definition: "Universal Basic Income — unconditional regular cash payments to all citizens regardless of employment" },
            { term: "Welfare Trap", definition: "The paradox where means-tested benefits reduce financial incentive to enter employment" },
            { term: "Cash Multiplier", definition: "The ratio of economic activity generated per unit of direct transfer spending" },
        ],
        discussionPoints: [
            "Should UBI replace existing welfare systems or supplement them?",
            "How should a UBI be funded — wealth tax, VAT, sovereign fund, or central bank money?",
            "Does UBI address AI-driven unemployment or merely delay structural adjustment?",
        ],
        verdict: "UBI pilot evidence is promising but context-specific; universal adoption demands rigorous fiscal design rather than ideological enthusiasm from either side.",
        tags: ["UBI", "Economy", "AI", "Social Policy", "Labour Market"],
        difficulty: "Advanced",
        readTime: 7,
        source: "The Economist",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "po-2",
        category: "politics",
        title: "Voter ID Laws: Protecting Integrity or Suppressing Participation?",
        context:
            "Governments across the US, UK, and India have introduced or tightened voter identification requirements. Election authorities cite fraud prevention; opposition groups argue the laws disproportionately disenfranchise marginalised communities.",
        easyExplanation: "Many countries are making it mandatory to show a special ID card before you can vote. Some say it prevents cheating, while others say it makes it too hard for poor people to vote.",
        deepDive:
            "The UK's introduction of mandatory photo ID in 2023 saw 0.25% of voters turned away at polls — approximately 14,000 people who did not return. Analysis found the policy disproportionately affected ethnic minority voters (4× more likely to lack qualifying ID) and disabled voters (2× more likely). Simultaneously, the number of documented in-person voter fraud cases that year was four. The empirical asymmetry — thousands disenfranchised to prevent a near-non-existent crime — sits at the heart of this debate, regardless of one's political starting point.",
        positives: [
            "Strengthens public confidence in electoral outcomes and institutional legitimacy",
            "Modern digital ID systems can be issued cheaply and universally if resourced adequately",
            "Consistent with many democracies that already require identification to vote without controversy",
            "Creates an auditable record chain that aids post-election integrity verification",
        ],
        negatives: [
            "Millions of eligible citizens lack acceptable ID, especially elderly, poor, and minority voters",
            "Disenfranchisement risk dramatically exceeds the documented incidence of voter fraud",
            "Implementation timelines and outreach have consistently been insufficient",
            "Critics argue the policy is designed to reduce turnout rather than prevent fraud",
        ],
        keyVocab: [
            { term: "Disenfranchisement", definition: "The removal of a citizen's right or practical ability to vote" },
            { term: "In-Person Voter Fraud", definition: "The act of voting under a false identity at a polling station — extremely rare in modern democracies" },
            { term: "Voter Suppression", definition: "Any systematic effort to reduce turnout among specific demographic groups" },
        ],
        discussionPoints: [
            "Should voter ID be accompanied by a government obligation to provide free ID to all citizens?",
            "How should legislators weigh proven disenfranchisement risk against theoretical fraud prevention?",
            "Is photo ID for voting consistent with democratic principles, or antithetical to them?",
        ],
        verdict: "Voter ID can be legitimate if paired with universal, free ID provision and adequate outreach — without these conditions, the policy demonstrably harms democratic participation.",
        tags: ["Elections", "Democracy", "Voter ID", "Civil Rights", "Governance"],
        difficulty: "Intermediate",
        readTime: 5,
        source: "The Guardian",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════════════ WORLD AFFAIRS ══════════════ */
    {
        id: "wa-1",
        category: "world-affairs",
        title: "The Global South's New Bloc: Multipolar World or Fragmented Order?",
        context:
            "The expansion of BRICS to include Saudi Arabia, UAE, Ethiopia, Egypt, Iran, and Argentina signals a structural shift in geopolitics. Nations representing 40% of global GDP are building alternative financial and diplomatic architecture outside Western institutions.",
        easyExplanation: "A group of powerful countries like India, China, and Brazil are teaming up to create their own systems for money and politics, so they don't have to rely so much on Western countries like the US.",
        deepDive:
            "The creation of the NDB (New Development Bank) and BRICS Pay — a proposed dollar-alternative settlement system — represents the most substantive challenge to post-Bretton Woods financial architecture since its creation in 1944. However, BRICS+ member states collectively hold $4.1 trillion in US Treasury bonds, creating a profound structural dependency on dollar-denominated instruments. The bloc's internal contradictions — India and China have fought border wars, Saudi Arabia and Iran are historic rivals — suggest that institutional competition with Western bodies may be slower and messier than headline announcements imply.",
        positives: [
            "Greater representation for developing nations in global economic governance",
            "Competing reserve currency proposals could reduce dangerous dollar-dependency",
            "South-South infrastructure partnerships bypass Western aid conditionality",
            "Creates negotiating leverage for the Global South in IMF/WTO reform discussions",
        ],
        negatives: [
            "Member states hold deeply conflicting strategic interests that may paralyse decision-making",
            "Weakening international institutions risks fragmentation of the rules-based order",
            "Economic and security dependencies on China raise sovereignty concerns for smaller members",
            "De-dollarisation is structurally extremely slow given existing reserve and trade dependencies",
        ],
        keyVocab: [
            { term: "BRICS+", definition: "Brazil, Russia, India, China, South Africa — plus new members admitted from 2024" },
            { term: "Bretton Woods", definition: "The 1944 international monetary system that established the dollar as the world's reserve currency" },
            { term: "Multipolar World", definition: "An international system with multiple major powers balanced against each other, versus US unipolarity" },
        ],
        discussionPoints: [
            "Can BRICS+ develop genuine institutional coherence given its members' conflicting interests?",
            "Does de-dollarisation benefit or harm developing nations more exposed to currency volatility?",
            "How should Western nations adapt their foreign policy to engage a genuinely multipolar order?",
        ],
        verdict: "BRICS+ represents a real geopolitical shift but its internal contradictions mean transformation of the global order will be generational rather than imminent.",
        tags: ["BRICS", "Geopolitics", "Multipolarity", "Dollar", "Global South"],
        difficulty: "Advanced",
        readTime: 7,
        source: "Foreign Affairs",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "wa-2",
        category: "world-affairs",
        title: "Climate Migration: The Crisis That Borders Cannot Contain",
        context:
            "The World Bank estimates 216 million people will be internally displaced by climate change by 2050. Coastal erosion, desertification, and extreme weather events are transforming migration from a political issue to a humanitarian imperative.",
        easyExplanation: "Because of climate change, places are becoming too hot or flooding, forcing millions of people to leave their homes and move to new countries.",
        deepDive:
            "Bangladesh could lose 17% of its landmass to sea-level rise by 2050, displacing approximately 18 million people — equivalent to the entire population of the Netherlands. Yet no legal category of 'climate refugee' exists in international law; the 1951 Refugee Convention covers only persecution, not environmental displacement. Countries in the Global North, which bear the greatest historical responsibility for emissions, are simultaneously tightening asylum criteria — creating a moral and legal contradiction at the core of the climate migration debate.",
        positives: [
            "Early international frameworks create legal protection for the most vulnerable communities",
            "Managed migration can address demographic shortfalls in ageing developed economies",
            "Cross-border cooperation on climate builds diplomatic trust and shared responsibility norms",
            "Climate-displaced populations often bring skills, resilience, and entrepreneurial energy",
        ],
        negatives: [
            "Host nations lack the infrastructure and political will to absorb mass arrivals",
            "Absence of a legal 'climate refugee' status leaves hundreds of millions in legal limbo",
            "Resource competition and cultural tension in receiving regions can trigger conflict",
            "Selective acceptance policies may favour economically valuable migrants over the most vulnerable",
        ],
        keyVocab: [
            { term: "Climate Refugee", definition: "A person displaced by climate-related environmental changes — currently unrecognised in international law" },
            { term: "1951 Refugee Convention", definition: "The UN treaty defining refugee status, currently limited to persecution-based displacement" },
            { term: "Managed Migration", definition: "Government-coordinated pathways for orderly migration to address specific demographic or labour needs" },
        ],
        discussionPoints: [
            "Should the 1951 Refugee Convention be amended to include climate displacement?",
            "Which nations bear the greatest obligation to accept climate migrants — emitters, neighbours, or all equally?",
            "How can migration policy be designed to prevent exploitation of climate-displaced communities?",
        ],
        verdict: "Climate migration is no longer a future risk — it is a present reality demanding immediate legal frameworks backed by the political will currently absent in most receiving nations.",
        tags: ["Climate Change", "Migration", "Refugees", "International Law", "Geopolitics"],
        difficulty: "Intermediate",
        readTime: 6,
        source: "UN News",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════════════ TECHNOLOGY ══════════════ */
    {
        id: "tech-1",
        category: "technology",
        title: "Generative AI in Classrooms: Educational Revolution or Academic Crisis?",
        context:
            "Generative AI tools like ChatGPT are now used by an estimated 26% of students globally. Educational institutions are split between embracing the technology as a learning accelerator and banning it as an integrity threat.",
        easyExplanation: "Students are starting to use AI tools like ChatGPT to help with schoolwork. Some teachers think it's a great way to learn faster, while others worry it makes it too easy to cheat.",
        deepDive:
            "The most intriguing evidence comes from Khan Academy's Khanmigo deployment: students using AI tutors performed 23% better on conceptual understanding assessments than those using traditional resources — but only when the AI was configured to ask Socratic questions rather than provide direct answers. This nuance is critical. The pedagogical design of AI interaction determines whether students develop deeper thinking or simply outsource cognition. Most current institutional deployments have no such guardrails, deploying AI as answer machines rather than thinking partners.",
        positives: [
            "Personalised tutoring at scale can close educational attainment gaps across income levels",
            "Frees teachers from rote assessment, enabling deeper mentoring and complex skill development",
            "Prepares students directly for an AI-integrated professional world",
            "Khanmigo data shows 23% improvement in conceptual understanding with well-designed AI tutors",
        ],
        negatives: [
            "Outsourcing writing and analysis undermines the cognitive processes central to learning",
            "Existing AI detection tools are unreliable, creating unfair and inconsistent enforcement",
            "Deepens digital divide between well-resourced and under-resourced schools",
            "Students optimised for AI collaboration may struggle in AI-restricted professional contexts",
        ],
        keyVocab: [
            { term: "Socratic Method", definition: "A form of inquiry where questions are used to stimulate critical thinking rather than impart answers" },
            { term: "LLM", definition: "Large Language Model — the class of AI systems, including ChatGPT, that generate human-like text" },
            { term: "Digital Literacy", definition: "The ability to effectively, safely, and critically use digital technologies including AI tools" },
        ],
        discussionPoints: [
            "Should AI be banned in exams, or should exams be redesigned for an AI-integrated world?",
            "How should institutions assess learning outcomes when AI can replicate most traditional assessments?",
            "What skills become more valuable, not less, in a world where AI handles routine cognitive tasks?",
        ],
        verdict: "AI in education is neither inherently harmful nor beneficial — its effect is entirely determined by pedagogical design, institutional governance, and teacher training quality.",
        tags: ["AI", "Education", "EdTech", "ChatGPT", "Academic Integrity"],
        difficulty: "Intermediate",
        readTime: 6,
        source: "MIT Technology Review",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "tech-2",
        category: "technology",
        title: "Humanoid Robots in the Workforce: Labour Partner or Existential Threat?",
        context:
            "Companies including Tesla, Figure, and Boston Dynamics are deploying humanoid robots in manufacturing and logistics. With costs dropping rapidly, economists are revisiting labour displacement models that previously underestimated automation's reach.",
        easyExplanation: "Companies are building robots that look and walk like humans to work in factories. They are getting cheaper and better, which might mean fewer jobs for real people in the future.",
        deepDive:
            "Figure's humanoid robots at BMW's Spartanburg plant can now complete a full door assembly cycle in 67 seconds — matching the productivity of a trained human worker at roughly ¼ of the total cost of employment over five years. Goldman Sachs projects humanoid robots could address 300 million full-time equivalent jobs globally by 2030. The critical distinction from previous automation waves: prior robots replaced specific physical tasks; humanoid robots with vision, manipulation, and reasoning capabilities can, in principle, be redeployed across any physical job — making sectoral retraining strategies far harder to design.",
        positives: [
            "Eliminates dangerous, repetitive work that causes human injury and chronic occupational illness",
            "24/7 productivity gains reduce goods costs and improve supply chain resilience",
            "Addresses critical labour shortages in sectors with declining working-age populations",
            "Enables humans to focus on creative, relational, and supervisory work",
        ],
        negatives: [
            "Displaces low-skill workers who have no proven viable retraining pathways at scale",
            "Concentrates economic gains heavily in capital owners, dramatically widening wealth inequality",
            "Social identity and psychological purpose derived from physical work may collapse for millions",
            "Unlike sector-specific automation, humanoid robots can be redeployed across all physical roles",
        ],
        keyVocab: [
            { term: "Humanoid Robot", definition: "An autonomous robot with a human-like body form capable of performing general physical tasks" },
            { term: "Labour Displacement", definition: "The permanent elimination of job categories due to technological substitution" },
            { term: "Capital-Labour Ratio", definition: "The proportion of production value attributable to capital (machines) versus human labour" },
        ],
        discussionPoints: [
            "Should governments impose a 'robot tax' on automated labour to fund displaced worker retraining?",
            "How should societies redefine economic participation and dignity if physical labour becomes obsolete?",
            "Can education and retraining systems adapt quickly enough to match the pace of physical automation?",
        ],
        verdict: "Humanoid robots will deliver enormous productivity gains, but their broad redeployability makes them categorically different from past automation — demanding proactive policy rather than historical optimism.",
        tags: ["Robotics", "Automation", "Labour", "AI", "Future of Work"],
        difficulty: "Advanced",
        readTime: 7,
        source: "Wired",
        publishedAt: d1,
        refreshCycle: 12,
    },
    /* ══════ SPORTS extra ══════ */
    {
        id: "sp-3",
        category: "sports",
        title: "Women's Football: Record Crowds, Same Pay Gap",
        context:
            "The 2023 FIFA Women's World Cup drew 2 billion viewers — yet top players still earn as little as 1% of their male equivalents. Governing bodies are under intense pressure to address the structural wage inequality that persists despite record commercial success.",
        easyExplanation: "Women's soccer is more popular than ever, with billions of people watching. However, the female players still get paid way less than the male players, and people are fighting to make it equal.",
        deepDive:
            "Spain's Jenni Hermoso at the peak of her career earns approximately €400,000 per year. Her male counterpart, Pedri, earns €8 million. The revenue argument — that women's football generates less — is itself undercut by data: the 2023 Women's World Cup generated $570 million in revenue for FIFA, up 300% from 2019. Yet FIFA allocated only $150 million in prize money — roughly 25% of the men's equivalent pot despite proportionally higher revenue growth. The structural issue is that legacy contracts, TV rights arrangements, and historical sponsorship flows are locked into male-sport timelines.",
        positives: [
            "Record sponsorship deals actively investing in women's football infrastructure",
            "Youth participation in women's football growing at 12% annually worldwide",
            "Increased media coverage normalising women's sport as premium entertainment",
            "Several national federations now offer equal pay — a strong proof-of-concept",
        ],
        negatives: [
            "Club revenue disparities remain extreme — most women's clubs operate at a loss",
            "Legacy TV rights arrangements undervalue women's games for years ahead",
            "Governing body priorities consistently favour the more commercially established men's game",
            "Players often lack union protections available to male counterparts",
        ],
        keyVocab: [
            { term: "Gender Pay Gap", definition: "The average earning difference between men and women performing comparable work" },
            { term: "Prize Money Pool", definition: "The total fund distributed among participants in a competition" },
            { term: "Revenue Parity", definition: "Equal proportional distribution of income relative to revenue generated" },
        ],
        discussionPoints: [
            "Should FIFA mandate equal prize money regardless of audience size differences?",
            "How can women's leagues build sustainable commercial models without relying on subsidies?",
            "What role do broadcasters play in perpetuating or closing the gender sports gap?",
        ],
        verdict: "Women's football has achieved cultural breakthroughs; the next frontier is structural financial equity — which requires governing body will, not just market forces.",
        tags: ["Women's Football", "Pay Gap", "FIFA", "Gender Equity", "Sports Governance"],
        difficulty: "Intermediate",
        readTime: 5,
        source: "The Guardian",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "sp-4",
        category: "sports",
        title: "Mental Health in Elite Sport: Breaking the Last Taboo",
        context:
            "High-profile athletes including Simone Biles, Naomi Osaka, and Ben Simmons have publicly withdrawn from competition citing mental health. Sports institutions are now grappling with whether elite performance culture itself is creating a mental health crisis.",
        easyExplanation: "Famous athletes are starting to talk openly about being stressed or sad. Before, they were expected to just 'tough it out,' but now teams are realizing that's not healthy.",
        deepDive:
            "A 2024 IOC-commissioned study of 1,200 elite athletes found that 45% reported clinically significant anxiety or depression symptoms — nearly double the rate in age-matched general population samples. The paradox of elite sport is structural: the same psychological traits cultivated for peak performance — obsessive focus, suppression of discomfort — are also significant risk factors for anxiety and burnout. Most institutional responses treat mental health as a performance issue rather than a welfare one.",
        positives: [
            "Athlete disclosures have dramatically reduced stigma around help-seeking in sport",
            "Major sporting bodies now mandate mental health support resources for athletes",
            "Research linking mental health to performance creates commercial incentive for institutions to act",
            "Younger athletes report greater psychological safety than previous generations",
        ],
        negatives: [
            "Elite performance culture still implicitly penalises vulnerability and help-seeking",
            "Short competitive windows create incentives to mask symptoms rather than treat them",
            "Mental health services remain grossly underfunded relative to physical rehabilitation",
            "Social media amplifies both public criticism and body image pressures on athletes",
        ],
        keyVocab: [
            { term: "Burnout", definition: "A state of chronic exhaustion, disillusionment, and reduced performance caused by prolonged stress" },
            { term: "Psychological Safety", definition: "An environment where individuals can speak up and admit vulnerability without fear" },
            { term: "Elite Performance Culture", definition: "The norms, expectations, and reward structures operating at the highest levels of sport" },
        ],
        discussionPoints: [
            "Should athletes have a protected right to withdraw from competition for mental health without penalty?",
            "How should sporting institutions balance performance demands with athlete welfare obligations?",
            "Is the current model of elite sport sustainable, or does it structurally produce mental health harm?",
        ],
        verdict: "Elite sport is beginning to acknowledge its mental health crisis — but institutional change must follow cultural acknowledgement, or disclosures become performative.",
        tags: ["Mental Health", "Elite Sport", "Athlete Welfare", "Burnout", "IOC"],
        difficulty: "Beginner",
        readTime: 4,
        source: "BBC Sport",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════ FINTECH extra ══════ */
    {
        id: "ft-3",
        category: "fintech",
        title: "Open Banking: The Quiet Revolution Reshaping Personal Finance",
        context:
            "Regulatory mandates in the EU (PSD2) and UK (Open Banking Standard) now require banks to share customer data with authorised third parties via APIs. This has created an ecosystem of 10,000+ fintech apps — but consumer awareness remains low and adoption uneven.",
        easyExplanation: "New laws let you share your bank info with other helpful apps safely. It helps people who don't have a credit history get loans, but it also means more apps have access to your private money habits.",
        deepDive:
            "Open banking's sleeper impact is in credit decisioning: firms like Experian and Credit Karma now access 12-month transactional data to build credit scores for the 1.5 billion people globally with thin or no credit files. Traditional credit scoring — which privileges existing credit history — has historically excluded young adults, immigrants, and cash-reliant populations. However, the same data that enables fairer lending also enables granular profiling of spending behaviour — raising questions about whether financial data is becoming as contested as health data.",
        positives: [
            "Enables fair lending to the credit-invisible using real transaction data rather than proxies",
            "Drives competition that reduces bank fees and improves current account quality",
            "Simplifies financial management through aggregated views across institutions",
            "Creates pathways for small businesses to access faster, cheaper lending products",
        ],
        negatives: [
            "Consumer understanding of data sharing consents is low, creating uninformed authorisation",
            "Third-party API breaches can expose entire financial histories simultaneously",
            "Data brokerisation of spending behaviour may enable predatory targeting of vulnerable users",
            "Incumbents have strong incentives to create friction in data-sharing processes",
        ],
        keyVocab: [
            { term: "PSD2", definition: "EU Payment Services Directive 2 — the regulation mandating open banking data sharing in Europe" },
            { term: "API", definition: "Application Programming Interface — a standardised method for software systems to share data securely" },
            { term: "Credit-Invisible", definition: "Individuals who lack sufficient credit history for traditional credit scoring models" },
        ],
        discussionPoints: [
            "Should open banking data rights extend to include insurance and investment products?",
            "How should regulators prevent financial data from becoming a commercial surveillance tool?",
            "Is open banking primarily a consumer benefit or a mechanism for financialisation of personal data?",
        ],
        verdict: "Open banking is quietly transforming financial inclusion — but its long-term impact hinges on whether data rights empower consumers or commercial intermediaries.",
        tags: ["Open Banking", "PSD2", "FinTech", "Credit", "Data Privacy"],
        difficulty: "Intermediate",
        readTime: 5,
        source: "Financial Times",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "ft-4",
        category: "fintech",
        title: "Embedded Finance: When Every App Becomes a Bank",
        context:
            "Embedded finance — integrating financial services directly into non-financial apps — is projected to reach $7 trillion by 2030. From ride-sharing insurance to social media savings accounts, financial services are becoming invisible infrastructure inside everyday platforms.",
        easyExplanation: "Apps that aren't banks (like Uber or Instagram) are starting to offer things like bank accounts or insurance. This makes it easier to pay for things, but it also means these apps know even more about you.",
        deepDive:
            "Grab's financial arm in Southeast Asia is the most instructive case study: a ride-hailing startup that now holds a digital banking licence, serves 45 million users with savings accounts, and offers micro-insurance from within its transport app. The company's advantage over traditional banks is data: knowing a user's income patterns, movement data, and spending behaviour allows precise risk underwriting. The regulatory challenge is profound: embedded finance blurs the boundary between regulated entities and technology platforms.",
        positives: [
            "Frictionless financial access exactly when and where users need it",
            "Superior risk assessment through real behavioural data reduces defaults",
            "Extends financial services to underserved markets without requiring bank branches",
            "Creates new revenue streams for consumer platforms while improving user retention",
        ],
        negatives: [
            "Regulatory gaps allow non-bank platforms to provide banking services without equivalent oversight",
            "Concentration of financial and behavioural data in a few super-apps creates systemic risk",
            "Users may not understand they are accessing regulated financial products with real consequences",
            "Incumbents lack the data infrastructure to compete, leading to consolidation risks",
        ],
        keyVocab: [
            { term: "Embedded Finance", definition: "Integration of financial products (lending, insurance, payments) into non-financial digital platforms" },
            { term: "Super App", definition: "A single mobile application integrating multiple services — transport, payments, social, commerce" },
            { term: "Banking-as-a-Service", definition: "API-based platforms that allow non-banks to offer regulated banking products under licence" },
        ],
        discussionPoints: [
            "Should super-apps that offer banking services be regulated identically to traditional banks?",
            "How should data generated by embedded finance be owned — by the platform, user, or regulator?",
            "Does embedded finance deepen financial inclusion or create new forms of digital exclusion?",
        ],
        verdict: "Embedded finance will redefine where and how financial services are consumed — but its risks demand regulatory frameworks designed for the platform era, not the banking era.",
        tags: ["Embedded Finance", "Super Apps", "FinTech", "Regulation", "Banking"],
        difficulty: "Advanced",
        readTime: 6,
        source: "Bloomberg",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════ POLITICS extra ══════ */
    {
        id: "po-3",
        category: "politics",
        title: "The Global Decline of Trust in Institutions",
        context:
            "Edelman's 2024 Trust Barometer found trust in governments below 50% across 28 surveyed democracies for the first time. Simultaneously, trust in NGOs, media, and businesses is falling — a simultaneous multi-institution collapse unprecedented in post-war data.",
        easyExplanation: "People around the world are trusting their governments and news companies less and less. This is happening because many feel that these big groups aren't fixing problems like expensive housing.",
        deepDive:
            "The most revealing finding is its demographic pattern: trust among 25-44 year olds with university education has collapsed faster than any other group — precisely the demographic institutions expected to be their most supportive base. Causes include social media exposure to institutional failures in real time, wage stagnation among educated younger adults who expected prosperity but experienced housing unaffordability, and visible COVID-19 pandemic response failures. The political consequence is not apathy but volatility.",
        positives: [
            "Declining trust is prompting genuine institutional reform and transparency initiatives",
            "Civic pressure from distrustful citizens has produced real accountability improvements",
            "Lower deference to authority increases individual scepticism — a democratic virtue in moderation",
            "New civil society institutions are forming to fill legitimacy gaps",
        ],
        negatives: [
            "Low trust enables disinformation ecosystems where no source is considered authoritative",
            "Volatile electorates make long-term evidence-based policymaking politically impossible",
            "International cooperation failures accelerate when populations distrust multilateral institutions",
            "Anti-establishment movements exploit distrust to concentrate power in authoritarian alternatives",
        ],
        keyVocab: [
            { term: "Institutional Trust", definition: "The degree to which citizens believe institutions will act in their interests" },
            { term: "Democratic Backsliding", definition: "A gradual erosion of democratic norms and institutions in formally democratic states" },
            { term: "Epistemic Crisis", definition: "A breakdown in shared understanding of facts and reliable sources of knowledge within a society" },
        ],
        discussionPoints: [
            "Can democratic institutions rebuild trust through transparency, or is the problem structural?",
            "At what point does institutional distrust become incompatible with functional governance?",
            "Should social media platforms be held responsible for accelerating institutional distrust?",
        ],
        verdict: "The simultaneous collapse of trust across all institution types demands structural reform — not communications strategies.",
        tags: ["Trust", "Democracy", "Institutions", "Political Polarisation", "Governance"],
        difficulty: "Advanced",
        readTime: 6,
        source: "The Economist",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "po-4",
        category: "politics",
        title: "Climate Policy After Paris: Are Pledges Becoming Liabilities?",
        context:
            "The gap between governments' Paris Agreement pledges and enacted policy remains 2.5°C of warming — far above the 1.5°C target. With 2025 being the critical year for revised NDCs, the credibility of the entire international climate framework is under scrutiny.",
        easyExplanation: "Countries made big promises to stop climate change, but they aren't actually doing enough to reach their goals. Now, people are questioning if these promises even matter if there's no way to force them to listen.",
        deepDive:
            "The Paris Agreement's fundamental architecture problem is that it relies on voluntary, nationally determined commitments with no enforcement mechanism. The EU's Carbon Border Adjustment Mechanism (CBAM), which imposes tariffs on carbon-intensive imports, has demonstrably changed policy decisions in exporting nations — not because of diplomatic pressure, but because of market consequences. This suggests that economic mechanisms with real teeth work where diplomatic pledges do not.",
        positives: [
            "Renewable energy deployment is exceeding all Paris-era projections, driven by economics",
            "Carbon pricing schemes now cover 23% of global emissions — up from 5% in 2015",
            "Legal challenges are holding governments accountable to their NDC pledges in courts",
            "Youth political mobilisation has kept climate on electoral agendas in most democracies",
        ],
        negatives: [
            "No major economy's policies are currently 1.5°C compatible when measured by enacted law",
            "Carbon markets have repeatedly suffered price crashes and fraud scandals",
            "Fossil fuel subsidies globally ($7 trillion in 2023) dwarf all renewable investment",
            "Geopolitical tensions have fractured G20 climate cooperation frameworks",
        ],
        keyVocab: [
            { term: "NDC", definition: "Nationally Determined Contribution — each country's self-set climate action pledge under the Paris Agreement" },
            { term: "CBAM", definition: "Carbon Border Adjustment Mechanism — EU tariff on imports from jurisdictions with weaker carbon pricing" },
            { term: "Carbon Pricing", definition: "Policies that directly or indirectly set a price on greenhouse gas emissions to incentivise reduction" },
        ],
        discussionPoints: [
            "Should the Paris Agreement be renegotiated to include binding enforcement mechanisms?",
            "Can carbon border tariffs accelerate global decarbonisation while complying with trade law?",
            "How should climate policy be designed to survive political transitions in democratic systems?",
        ],
        verdict: "Paris pledges have generated political momentum and catalysed markets, but only economic mechanisms with real financial consequences have demonstrably changed national policy decisions.",
        tags: ["Climate Policy", "Paris Agreement", "Carbon Pricing", "Geopolitics", "Environment"],
        difficulty: "Advanced",
        readTime: 7,
        source: "Foreign Affairs",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════ WORLD AFFAIRS extra ══════ */
    {
        id: "wa-3",
        category: "world-affairs",
        title: "India's Global Pivoting: Strategic Autonomy in a Bipolar Era",
        context:
            "India simultaneously maintains defence partnerships with Russia, the US, Israel, and France — while chairing the Global South caucus at the G20. As superpower competition intensifies, India's 'strategic autonomy' doctrine is being tested like never before.",
        easyExplanation: "India is being very smart by staying friends with many different countries like Russia and the US at the same time. This lets them get what they need from everyone without taking sides.",
        deepDive:
            "India's Russia dilemma crystallises the structural tension at the core of strategic autonomy: India depends on Russia for 60% of its defence hardware while its economic future is increasingly tied to the US-aligned technology and financial system. Russia's invasion of Ukraine forced New Delhi to abstain at the UN rather than condemn — a position that strained Western relationships while India quietly became the world's largest buyer of discounted Russian oil.",
        positives: [
            "Maintains leverage across competing power blocs, extracting concessions from each",
            "Provides diplomatic bridge-building capacity in crises like Russia-Ukraine",
            "Enables procurement of best-in-class defence hardware regardless of origin",
            "Projects credibility to Global South nations seeking post-Western development models",
        ],
        negatives: [
            "Structural defence dependence on Russia limits policy independence in direct conflicts",
            "Strategic ambiguity can become strategic incoherence — trusted by neither bloc",
            "Economic integration with the West creates vulnerable pressure points in future crises",
            "Domestic political pressures complicate principled multilateral positions",
        ],
        keyVocab: [
            { term: "Strategic Autonomy", definition: "A foreign policy doctrine maintaining the right to independent decisions free from bloc alignment" },
            { term: "Quad", definition: "The Quadrilateral Security Dialogue — a US-India-Japan-Australia grouping focused on Indo-Pacific security" },
            { term: "Non-Alignment 2.0", definition: "India's updated Cold War non-alignment principle applied to contemporary US-China competition" },
        ],
        discussionPoints: [
            "Is strategic autonomy a sustainable long-term doctrine, or a transitional position?",
            "How should India manage the tension between its defence dependency on Russia and its economic alignment with the West?",
            "Can India lead the Global South while simultaneously integrating into Western-led economic institutions?",
        ],
        verdict: "India's strategic autonomy extracts short-term advantages from a fragmented world, but its long-term coherence depends on replacing Russian defence dependency before the next major crisis forces a choice.",
        tags: ["India", "Geopolitics", "Strategic Autonomy", "Russia", "Global South"],
        difficulty: "Advanced",
        readTime: 7,
        source: "Foreign Policy",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "wa-4",
        category: "world-affairs",
        title: "Taiwan Strait: War, Deterrence, and the Semiconductor Wildcard",
        context:
            "Taiwan produces 92% of the world's most advanced semiconductor chips. As China increases military pressure and the US expands arms sales, the Taiwan Strait has become the world's most geopolitically consequential 110-mile waterway.",
        easyExplanation: "Taiwan makes almost all the world's most advanced computer chips. Because these chips are so important, many countries are worried about a conflict between China and Taiwan that could stop them from being made.",
        deepDive:
            "TSMC's position creates a form of deterrence termed the 'silicon shield': any military action that destroyed Taiwan's fabrication plants would simultaneously cripple China's own technology sector, which depends on Taiwanese chips for telecommunications, electric vehicles, and defence systems. China imported $180 billion of semiconductors in 2023 — more than its oil imports. However, TSMC's Arizona and Japan fab expansions are quietly eroding the silicon shield's deterrent value.",
        positives: [
            "Economic interdependence creates mutual deterrence reducing the probability of direct conflict",
            "US CHIPS Act is rebuilding semiconductor self-sufficiency, reducing supply chain fragility",
            "Taiwan's democracy demonstrates an alternative development model for East Asia",
            "Cross-Strait trade flows ($200bn+ annually) sustain economic incentives for stability",
        ],
        negatives: [
            "Military miscalculation risk is rising as both sides test grey-zone boundaries more aggressively",
            "US semiconductor export controls are accelerating China's domestic chip development",
            "Taiwan's democratic institutions face persistent information warfare and political interference",
            "Global economic consequences of conflict would dwarf the 2008 financial crisis",
        ],
        keyVocab: [
            { term: "Silicon Shield", definition: "The theory that Taiwan's chip manufacturing makes it too valuable to destroy in military conflict" },
            { term: "Grey Zone Operations", definition: "Coercive state actions below the threshold of armed conflict — cyber, disinformation, economic pressure" },
            { term: "CHIPS Act", definition: "US legislation providing $52bn in subsidies to rebuild domestic semiconductor manufacturing" },
        ],
        discussionPoints: [
            "Does the silicon shield deter conflict, or does chip dependence create tensions worth fighting over?",
            "How should democratic nations respond to China's grey zone coercion in the Taiwan Strait?",
            "What responsibilities do technology companies have in geopolitical conflicts involving their supply chains?",
        ],
        verdict: "The Taiwan Strait is the most consequential potential flashpoint of the decade — and the semiconductor industry, not simply military posture, is the critical variable shaping its trajectory.",
        tags: ["Taiwan", "Semiconductors", "China", "US", "Geopolitics"],
        difficulty: "Advanced",
        readTime: 8,
        source: "The Economist",
        publishedAt: d1,
        refreshCycle: 12,
    },

    /* ══════ TECHNOLOGY extra ══════ */
    {
        id: "tech-3",
        category: "technology",
        title: "The Open Source AI Crisis: Power, Safety, and Control",
        context:
            "Meta's release of Llama 3 made a frontier-class AI model freely downloadable for the first time. Governments, safety researchers, and competing AI labs are divided on whether open-source AI is a democratising force or an irreversible safety risk.",
        easyExplanation: "Meta (the company that owns Facebook) made a very powerful AI and let anyone download it for free. Some think this is great for everyone to learn, while others worry it might be used by bad people.",
        deepDive:
            "The open-source AI debate maps onto earlier internet access debates, but with a critical asymmetry: open internet access allowed anyone to distribute information; open AI model access allows anyone to automate cognition at scale. The Bletchley Park AI Safety Declaration — signed by 28 nations — explicitly flagged open-source frontier models as a governance gap. Yet safety researchers have found more vulnerabilities in closed models than open ones through security-by-obscurity failures.",
        positives: [
            "Democratises AI development — universities, startups, and low-resource nations gain frontier capability",
            "Open weights enable independent safety research that discovers vulnerabilities closed models miss",
            "Competition from open-source prevents monopolistic control of transformative technology",
            "Reduces ML compute costs for developing economies by 10-100x, enabling local AI applications",
        ],
        negatives: [
            "Removes corporate and regulatory leverage to prevent misuse of released models",
            "Safety guardrails can be removed from open models in minutes by anyone with basic ML skills",
            "Open models dramatically lower the skill bar for dangerous biological or chemical weapon queries",
            "Once released, frontier models cannot be recalled — creating permanent capabilities in adversarial hands",
        ],
        keyVocab: [
            { term: "Open Weights", definition: "AI model parameters that are publicly downloadable and can be run or modified without restriction" },
            { term: "RLHF", definition: "Reinforcement Learning from Human Feedback — the safety training technique applied to align AI models" },
            { term: "Frontier Model", definition: "An AI system at the current frontier of capability — the most powerful models available at any given time" },
        ],
        discussionPoints: [
            "Should frontier AI models above a capability threshold require government licensing before release?",
            "How can the international community govern open-source AI when any restriction is easily circumvented?",
            "Does open-source AI development ultimately improve or undermine global AI safety?",
        ],
        verdict: "Open-source AI creates genuine democratisation benefits and genuine safety risks simultaneously — governance must enable the former while constraining the latter.",
        tags: ["Open Source AI", "Llama", "AI Safety", "Meta", "Governance"],
        difficulty: "Advanced",
        readTime: 7,
        source: "MIT Technology Review",
        publishedAt: d0,
        refreshCycle: 12,
    },
    {
        id: "tech-4",
        category: "technology",
        title: "Brain-Computer Interfaces: Medical Miracle or Privacy Catastrophe?",
        context:
            "Neuralink's first human implant received FDA approval, while Synchron has already implanted devices in multiple patients. BCIs translating neural signals into digital commands are moving from science fiction to clinical reality — and the ethical questions are moving with them.",
        easyExplanation: "Companies are developing chips that can be put inside the brain to let people control computers with their thoughts. This is amazing for helping paralyzed people, but it also raises big questions about brain privacy.",
        deepDive:
            "Synchron's Stentrode device restored digital communication to completely paralysed ALS patients, allowing them to send emails and control smart home devices through thought alone. However, the long-term commercial roadmap is inevitably not therapeutic. Neural interface data is qualitatively different from any existing biometric data: it represents not behaviour, but cognition — thought processes, emotional reactions, attention patterns. No existing privacy framework was designed to govern data from inside the skull.",
        positives: [
            "Restores communication and motor function to otherwise completely locked-in patients",
            "Potential to treat neurological conditions — epilepsy, Parkinson's, depression — that resist medication",
            "Enhances human-computer interaction speed by orders of magnitude beyond keyboard or voice",
            "Generates unprecedented neuroscience data, accelerating understanding of the human brain",
        ],
        negatives: [
            "Neural data — thought patterns, emotions, intentions — has no existing privacy framework",
            "Device failure or firmware updates inside the skull carry catastrophic risk",
            "Access to neural enhancement technology may create a cognitive divide between rich and poor",
            "Military and intelligence applications of mind-reading technology have no public governance",
        ],
        keyVocab: [
            { term: "BCI", definition: "Brain-Computer Interface — a device creating a direct communication channel between the brain and external technology" },
            { term: "Neural Data", definition: "Electrical signals generated by brain activity, interpretable as cognitive and emotional states" },
            { term: "Neurorights", definition: "An emerging legal framework proposing fundamental rights to cognitive liberty and mental privacy" },
        ],
        discussionPoints: [
            "Should neural data be classified as a fundamental data category with absolute privacy protection?",
            "Who should be permitted to develop BCI technology — any company, or only regulated medical entities?",
            "How should societies prevent cognitive enhancement from becoming a purchased competitive advantage?",
        ],
        verdict: "BCIs represent medicine's most significant frontier — and humanity's most urgent regulatory gap, requiring neurorights frameworks before commercial deployment rather than after.",
        tags: ["BCI", "Neuralink", "Neuroscience", "Privacy", "Medical Technology"],
        difficulty: "Advanced",
        readTime: 7,
        source: "Wired",
        publishedAt: d1,
        refreshCycle: 12,
    },
];

/* ──────────────────────────────────────────────────────────────────── */
/* YESTERDAY'S DAILY NEWS — 6 news briefs, always dated yesterday      */
/* Refreshes every calendar day automatically via yesterdayISO()       */
/* ──────────────────────────────────────────────────────────────────── */
export interface DailyArticle {
    id: string;
    headline: string;
    summary: string;
    keyFact: string;
    source: string;
    category: string;
    readTime: number;
    publishedAt: string; // always yesterday's date
    url: string;
}

function yesterdayISO(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(12, 0, 0, 0);
    return d.toISOString();
}

const yd = yesterdayISO();

export const YESTERDAY_ARTICLES: DailyArticle[] = [
    {
        id: "yd-1",
        headline: "Fed Holds Rates Steady as Inflation Data Surprises Markets",
        summary:
            "The Federal Reserve opted to hold the federal funds rate unchanged at its latest meeting, citing persistent services inflation above its 2% target. Markets had priced in a 60% probability of a cut. Chair Powell signalled that rate reductions remain possible later in the year if labour market conditions soften.",
        keyFact: "Core PCE inflation came in at 2.8% — 0.3 percentage points above the Fed's 2% target.",
        source: "Reuters",
        category: "Finance",
        readTime: 3,
        publishedAt: yd,
        url: "https://reuters.com",
    },
    {
        id: "yd-2",
        headline: "WHO Declares New Disease Surveillance Network After Pandemic Lessons",
        summary:
            "The World Health Organisation announced a Global Health Early Warning System to detect novel pathogen threats within 72 hours of first reports. The initiative, backed by $2.1 billion in G7 funding, addresses structural failures identified in the COVID-19 response and integrates real-time data from 140 national health authorities.",
        keyFact: "The WHO estimates the new system could cut pandemic detection lag from 4 months to 72 hours.",
        source: "WHO News",
        category: "Health",
        readTime: 3,
        publishedAt: yd,
        url: "https://www.who.int/news",
    },
    {
        id: "yd-3",
        headline: "India Overtakes China as World's Largest Smartphone Market",
        summary:
            "India has officially surpassed China to become the world's largest smartphone market by active users, with 950 million connections against China's 930 million. The milestone reflects India's rapid 5G rollout and 200 million first-time internet users adopting mobile-first connectivity. Apple, Samsung, and Jio are expanding manufacturing capacity.",
        keyFact: "India added 180 million new smartphone users in 2024 — more than the population of Portugal, Greece, and Belgium combined.",
        source: "The Hindu",
        category: "Technology",
        readTime: 2,
        publishedAt: yd,
        url: "https://thehindu.com",
    },
    {
        id: "yd-4",
        headline: "UK Supreme Court Rules Against Government's Asylum Deportation Scheme",
        summary:
            "In a landmark 5-0 ruling, the UK Supreme Court found the government's policy of deporting asylum seekers to a third country unlawful, citing credible evidence that it could not be considered safe. All planned deportations are paused and asylum claim processing must reopen. The Home Office faces a backlog of 175,000 cases.",
        keyFact: "The Supreme Court's ruling cited 200+ documented cases of forcible returns to dangerous originating countries.",
        source: "BBC News",
        category: "Politics",
        readTime: 4,
        publishedAt: yd,
        url: "https://bbc.com/news",
    },
    {
        id: "yd-5",
        headline: "Record Antarctic Ice Loss Measured — Sixth Consecutive Year",
        summary:
            "NASA's CryoSat satellite data confirms Antarctic sea ice coverage reached its lowest extent on record in 2024, marking the sixth consecutive year below the long-term mean. Scientists warn that ice loss is accelerating beyond the most pessimistic models from the 2021 IPCC report, with significant implications for global sea-level projections through 2100.",
        keyFact: "Antarctic sea ice is now 2.1 million square kilometres below the 1981-2010 average — an area the size of Mexico.",
        source: "NASA Earth Observatory",
        category: "Environment",
        readTime: 3,
        publishedAt: yd,
        url: "https://earthobservatory.nasa.gov",
    },
    {
        id: "yd-6",
        headline: "Next-Gen AI Model Launches with Real-Time Browsing and Multimodal Reasoning",
        summary:
            "A major AI lab has launched its most capable model to date, featuring native real-time web browsing, extended context windows of 1 million tokens, and significantly improved multimodal reasoning across text, images, and code. The model scores above the 90th percentile on Bar Exam, USAMO mathematics, and PhD-level scientific reasoning benchmarks.",
        keyFact: "The new model achieved a 90.2% score on the MMLU benchmark — surpassing the average performance of specialist human experts in the same domains.",
        source: "The Verge",
        category: "Technology",
        readTime: 4,
        publishedAt: yd,
        url: "https://theverge.com",
    },
];

export function getFallbackEditorials(category: CategoryId): Editorial[] {
    return FALLBACK_EDITORIALS.filter((e) => e.category === category);
}

