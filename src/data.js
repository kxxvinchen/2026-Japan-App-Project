
/* ============================ DATA ============================ */
const TRIP = {
  title: "2026 Japan Performance & Cultural Exchange Tour",
  org: "Saratoga High School",
  dates: "June 9 – 23, 2026",
  blurb: "13 nights in Japan · Including the Mt. Fuji Music Festival · Arranged by BMC Tours",
  route: ["San Francisco", "Tokyo", "Fuji Lake Kawaguchi", "Kyoto", "Kobe", "Hiroshima", "Tokyo"]
};

/* ===== Emergency info & procedures (from the official itinerary, v5.31.26) ===== */
const EMERGENCY = {
  numbers: [
    { label: "Ambulance / Fire", num: "119" },
    { label: "Police", num: "110" }
  ],
  procedures: [
    {
      h: "Earthquake", pts: [
        "Stay calm. Indoors: Drop, Cover, and Hold On until shaking stops — away from windows, glass, shelves and lighting.",
        "Do not use elevators during or right after an earthquake.",
        "Outdoors: move to an open area away from buildings, trees, signs and power lines.",
        "After shaking stops, wait for instructions before moving."]
    },
    {
      h: "Evacuation & assembly", pts: [
        "Go to the nearest designated evacuation area (park, school ground, open plaza) as directed by staff or authorities.",
        "Stay with your group under your assigned staff/chaperone at all times.",
        "Roll call is taken on arrival at the evacuation point.",
        "Don't leave the group or re-enter buildings unless told it's safe."]
    },
    {
      h: "Tsunami / coastal areas", pts: [
        "If a tsunami warning is issued near the coast or waterfront, move immediately to higher ground or a marked tsunami evacuation area and follow authorities without delay."]
    },
    {
      h: "Transportation disruptions", pts: [
        "If trains, airports or roads are disrupted, your group may shelter in place at a station, hotel, school or concert hall.",
        "Tour management arranges revised transport and accommodation and keeps schools and families updated."]
    },
    {
      h: "Medical emergencies", pts: [
        "Tell a teacher, chaperone, tour manager or hotel staff right away.",
        "Emergency services: Ambulance / Fire 119 · Police 110.",
        "English-speaking hospitals are listed below."]
    },
    {
      h: "Communication", pts: [
        "Tour managers coordinate with directors and local suppliers; school reps relay updates to families.",
        "Always carry your hotel info card and emergency contacts with you."]
    },
    {
      h: "Common evacuation areas", pts: [
        "Public parks and open spaces · school campuses and athletic fields · community evacuation centers · hotel-designated evacuation sites · large public plazas and government disaster shelters."]
    }
  ],
  hotels: {
    performer: [
      { city: "Tokyo", name: "Grand Nikko Tokyo Daiba", addr: "2-6-1 Daiba, Minato-ku, Tokyo 135-8701", tel: "+81-3-5500-6711" },
      { city: "Mt. Fuji (Band & Choir)", name: "Hotel Mount Fuji", addr: "1360-83 Yamanaka, Yamanakako-mura, Yamanashi 401-0501", tel: "+81-555-62-2111" },
      { city: "Mt. Fuji (Orchestra)", name: "Highland Resort Hotel & Spa", addr: "5-6-1 Shin-Nishihara, Fujiyoshida-shi, Yamanashi 403-0017", tel: "+81-555-22-1000" },
      { city: "Kyoto", name: "Miyako Hotel Kyoto Hachijo", addr: "17 Nishikujo-Inmachi, Minami-ku, Kyoto 601-8412", tel: "+81-75-661-7111" },
      { city: "Kobe (Band & Orch)", name: "Kobe Bay Sheraton Hotel & Towers", addr: "2-13 Koyocho-naka, Higashinada-ku, Kobe 658-0032", tel: "+81-78-857-7000" },
      { city: "Kobe (Choir)", name: "Kobe Plaza Hotel", addr: "1-13-12 Motomachi-dori, Chuo-ku, Kobe 650-0022", tel: "+81-78-332-1141" },
      { city: "Hiroshima", name: "Grand Prince Hotel Hiroshima", addr: "1-3 Ujina-Kaigan, Minami-ku, Hiroshima 734-8543", tel: "+81-82-256-1111" }
    ],
    shadow: [
      { city: "Tokyo (Day 2–6)", name: "Hotel Metropolitan Tokyo Ikebukuro", addr: "1-6-1 Nishiikebukuro, Toshima-ku, Tokyo 171-8505", tel: "+81-3-3980-1111" },
      { city: "Tokyo (Day 14–15)", name: "Grand Nikko Tokyo Daiba", addr: "2-6-1 Daiba, Minato-ku, Tokyo 135-8701", tel: "+81-3-5500-6711" },
      { city: "Lake Ashinoko", name: "The Prince Hakone Lake Ashinoko", addr: "144 Motohakone, Hakone-machi, Kanagawa 250-0592", tel: "+81-460-83-1111" },
      { city: "Kyoto", name: "Hotel Nikko Princess Kyoto", addr: "630 Takahashicho, Shimogyo-ku, Kyoto 600-8096", tel: "+81-75-342-2111" },
      { city: "Kobe (Awaji)", name: "Grand Nikko Awaji", addr: "2 Yumebutai, Awaji, Hyogo 656-2306", tel: "+81-799-74-1111" },
      { city: "Hiroshima (Day 11–13)", name: "Rihga Royal Hotel Hiroshima", addr: "6-78 Motomachi, Naka-ku, Hiroshima 730-0011", tel: "+81-82-502-1121" },
      { city: "Hiroshima (Day 13–14)", name: "Grand Prince Hotel Hiroshima", addr: "23-1 Motoujinamachi, Minami-ku, Hiroshima 734-8543", tel: "+81-82-256-1111" }
    ]
  },
  hospitals: {
    performer: [
      { city: "Tokyo", name: "St. Luke's International Hospital", addr: "10-1 Akashicho, Chuo-ku, Tokyo 104-0044", tel: "+81-3-3543-6391", pharmacy: true },
      { city: "Mt. Fuji", name: "Yamanashi Red Cross Hospital", addr: "6663-1 Funatsu, Fuji Kawaguchikomachi, Yamanashi 401-0301", tel: "+81-555-72-2222", pharmacy: true },
      { city: "Kyoto", name: "Koseikai Takeda Hospital", addr: "841-5 Higashi Shiokoji-cho, Shimogyo-ku, Kyoto 600-8558", tel: "+81-75-361-1351", pharmacy: true },
      { city: "Kobe", name: "Kobe City Medical Center General Hospital", addr: "2-1-1 Minatojima Minamimachi, Chuo-ku, Kobe 650-0047", tel: "+81-78-302-4321", pharmacy: true },
      { city: "Hiroshima", name: "Hiroshima City Funairi Citizens Hospital", addr: "14-1 Funairi Miyuki Machi, Naka-ku, Hiroshima 730-0844", tel: "+81-82-232-6195", pharmacy: true }
    ],
    shadow: [
      { city: "Tokyo", name: "National Center for Global Health and Medicine", addr: "1-21-1 Toyama, Shinjuku-ku, Tokyo 162-8655", tel: "+81-3-3202-7181", pharmacy: true },
      { city: "Lake Ashino", name: "Gotemba Emergency Medical Center", addr: "237-7 Nishitanaka, Gotemba, Shizuoka 412-0027", tel: "+81-550-83-1111", pharmacy: false },
      { city: "Kyoto", name: "Koseikai Takeda Hospital", addr: "841-5 Higashi Shiokoji-cho, Shimogyo-ku, Kyoto 600-8558", tel: "+81-75-361-1351", pharmacy: true },
      { city: "Kobe (Awaji)", name: "Seirei Awaji Hospital", addr: "1-1 Yumebutai, Awaji, Hyogo 656-2306", tel: "+81-799-72-3636", pharmacy: false },
      { city: "Hiroshima", name: "Hiroshima City Funairi Citizens Hospital", addr: "14-1 Funairi Miyuki Machi, Naka-ku, Hiroshima 730-0844", tel: "+81-82-232-6195", pharmacy: true }
    ]
  }
};

const GROUPS = [
  {
    id: "band", cat: "Performer", name: "Symphonic Wind Ensemble", short: "Band (SWE)",
    desc: "Wind / band players — performs with SSO at most concerts."
  },
  {
    id: "orch", cat: "Performer", name: "Symphony Orchestra", short: "Orchestra (SSO)",
    desc: "Orchestra players — performs with SWE at most concerts."
  },
  {
    id: "perc", cat: "Performer", name: "Percussion", short: "Percussion",
    desc: "Percussion section — travels and performs with the Symphonic Wind Ensemble (SWE)."
  },
  {
    id: "choir", cat: "Performer", name: "SHS & LHS Combined Choir", short: "Choir",
    desc: "Combined choir — separate concert schedule from the bands."
  },
  {
    id: "schoir", cat: "Shadow Tour", name: "Choir Shadow", short: "Choir Shadow",
    desc: "Non-performing travelers following the Choir's schedule."
  },
  {
    id: "sband", cat: "Shadow Tour", name: "Band / Orchestra Shadow", short: "Band/Orch Shadow",
    desc: "Non-performing travelers following the SWE / SSO schedule."
  }
];
const ALL = ["band", "orch", "choir", "schoir", "sband"];
const PERF = ["band", "orch", "choir"];
const SWESSO = ["band", "orch"];
const SHADOW = ["schoir", "sband"];

/* Daily attire (from the official itinerary). Keyed by day number; entries are
   group-specific where the itinerary splits Band/Orch vs Choir. */
const BO = ["band", "orch", "sband"], CH = ["choir", "schoir"];
const ATTIRE = {
  1: [{ g: ALL, t: "Tour shirt, comfortable layers" }],
  2: [{ g: ALL, t: "Tour shirt, comfortable layers" }],
  3: [{ g: BO, t: "Casual attire for sightseeing & school visit (percussion only)" },
  { g: CH, t: "Casual attire for sightseeing" }],
  4: [{ g: BO, t: "Music dept. polo & khakis, plus optional casual attire for sightseeing" },
  { g: CH, t: "Casual attire for sightseeing; bring performance attire" }],
  5: [{ g: BO, t: "Performance attire" },
  { g: CH, t: "Casual attire for sightseeing; bring performance attire" }],
  6: [{ g: BO, t: "Performance attire" },
  { g: CH, t: "Casual attire for sightseeing & travel; bring performance attire" }],
  7: [{ g: ALL, t: "Casual attire for sightseeing & travel" }],
  8: [{ g: ALL, t: "Casual attire for sightseeing" }],
  9: [{ g: BO, t: "Casual attire for travel; bring performance attire" },
  { g: CH, t: "Casual attire for sightseeing; semi-formal concert attire for the evening" }],
  10: [{ g: CH, t: "Casual attire for sightseeing & school visit; bring performance attire" },
  { g: BO, t: "Casual attire for sightseeing" }],
  11: [{ g: BO, t: "Casual attire for travel & sightseeing" },
  { g: CH, t: "Tour shirt or department polo" }],
  12: [{ g: CH, t: "Casual attire for school visit; bring performance attire" },
  { g: BO, t: "Performance attire" }],
  13: [{ g: ALL, t: "Casual attire for school visit & sightseeing; dress to impress for the Farewell Dinner & Dance Party" }],
  14: [{ g: ALL, t: "Casual attire for travel" }],
  15: [{ g: ALL, t: "Tour shirt, comfortable layers" }]
};

function mapsUrl(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }

/* loc helper: {n:name, q:maps query, kind:hotel|venue|sight} */
const DAYS = [
  {
    d: 1, dow: "Tue", dd: "9", dm: "JUN", date: "Tuesday, June 9, 2026",
    city: "San Francisco", headline: "Departure day — fly from California to Tokyo.",
    meals: ["In-flight meals"],
    hotels: [{ n: "Overnight en route (in-flight)", groups: ALL }],
    items: [
      {
        t: "Pre-departure", hr: "30 min prior", type: "travel", groups: ALL,
        title: "Gather at Saratoga High School",
        desc: "Arrive at Saratoga HS at least 30 minutes before your group's scheduled bus departure. Board coaches and transfer to your departure airport. All flights include in-flight meals and entertainment.",
        loc: { n: "Saratoga High School", q: "Saratoga High School, Saratoga, CA", kind: "sight" }
      },
      {
        t: "Departure", hr: "see logistics", type: "travel", groups: ALL,
        title: "Check in & fly to Tokyo",
        desc: "Meet your air-vendor reps, check luggage and instruments, and clear security to the gate. Departure time and routing depend on your flight group — tap Full logistics below for your exact flights.",
        loc: { n: "San Francisco International Airport (SFO)", q: "San Francisco International Airport", kind: "sight" }
      },
      {
        t: "Overnight", hr: "en route", type: "travel", groups: ALL,
        title: "Overnight trans-Pacific flight",
        desc: "Fly to Tokyo (Haneda or Narita). Overnight en route — in-flight meals served. Some groups connect via Los Angeles or Seattle."
      }
    ],
    logistics: [
      {
        label: "Group A & B — SHS arrival 22:30 (Jun 8), depart 23:00 (Jun 8)", groups: ALL,
        lines: ["Group A: NH107 — SFO → Tokyo Haneda (HND) · dep 01:45 Jun 9 / arr 05:00 Jun 10",
          "Group B: UA7914 (operated by ANA) — SFO → HND · dep 01:45 Jun 9 / arr 05:00 Jun 10 (SFO check-in with ANA)",
          "42 travelers · 1 bus"]
      },
      {
        label: "Group G, H & I — SHS arrival 02:45, depart 03:15 (Jun 9)", groups: ALL,
        lines: ["Group G (SHS Shadow): UA2127 SFO → LAX dep 06:00 / arr 07:40, then UA39 LAX → HND dep 11:55 / arr 15:15 Jun 10",
          "Group H (All Lynbrook & SHS Choir, Lynbrook & SHS Shadow): UA2127 SFO → LAX dep 06:00 / arr 07:40, then UA32 LAX → Tokyo Narita (NRT) dep 11:05 / arr 14:15 Jun 10",
          "Group I (SHS Shadow, 28 travelers; 2 join in Seattle): DL2721 SFO → SEA dep 06:05 / arr 08:25, then DL167 SEA → HND dep 11:50 / arr 14:15 Jun 10",
          "172 travelers · 4 buses (one entirely for Shadow)"]
      },
      {
        label: "Group C — SHS arrival 06:30, depart 07:00", groups: ALL,
        lines: ["UA875 — SFO → HND · dep 10:55 / arr 13:55 Jun 10", "104 travelers · 2 buses"]
      },
      {
        label: "Group D, E & F — SHS arrival 07:30, depart 08:00", groups: ALL,
        lines: ["Group D: NH7 — SFO → NRT · dep 12:20 / arr 15:25 Jun 10",
          "Group E: UA7949 (operated by ANA) — SFO → NRT · dep 12:20 / arr 15:25 Jun 10 (SFO check-in with ANA)",
          "Group F: UA837 — SFO → NRT · dep 12:20 / arr 14:55 Jun 10",
          "173 travelers · 4 buses"]
      }
    ]
  },
  {
    d: 2, dow: "Wed", dd: "10", dm: "JUN", date: "Wednesday, June 10, 2026",
    city: "Tokyo", headline: "Arrive in Tokyo, hotel check-in, dinner on your own.",
    meals: [],
    hotels: [{ n: "Grand Nikko Tokyo Daiba", q: "Grand Nikko Tokyo Daiba", groups: ALL }],
    items: [
      {
        t: "Arrival", hr: "on landing", type: "travel", groups: ALL,
        title: "Arrive in Tokyo (Haneda / Narita)",
        desc: "Land at Haneda (T3) or Narita (T1). Retrieve your luggage and instruments, pass through Immigration & Customs, and proceed to the arrival lobby. Open and inspect instruments at baggage claim.",
        loc: { n: "Tokyo — Haneda / Narita Airport", q: "Haneda Airport Tokyo", kind: "sight" }
      },
      {
        t: "Arrival", hr: "after customs", type: "other", groups: ALL,
        title: "Meet your bus escort & transfer",
        desc: "Meet your local bus escort, load luggage and larger instruments onto the trucks, and depart for the hotel."
      },
      {
        t: "Afternoon", hr: "on arrival", type: "hotel", groups: ALL,
        title: "Hotel check-in — Grand Nikko Tokyo Daiba",
        desc: "Check in and settle into your rooms at the Grand Nikko Tokyo Daiba."
      },
      {
        t: "Evening", hr: "evening", type: "meal", groups: ALL,
        title: "Dinner on own — Odaiba waterfront",
        desc: "Walk to Aqua City Odaiba, DiverCity Tokyo Plaza, Decks Tokyo Beach or a similar nearby waterfront complex for dinner on your own in small groups, with shopping, entertainment and Tokyo Bay views. Curfew announced by the directors.",
        loc: { n: "Aqua City Odaiba", q: "Aqua City Odaiba Tokyo", kind: "sight" }
      }
    ],
    logistics: [
      {
        label: "Group A & B — Haneda (T3)", groups: ALL,
        lines: ["NH107 arr 05:00 · UA7914 arr 05:00", "42 travelers · 1 bus (Aki Murakami)", "Luggage & larger instruments loaded onto the truck"]
      },
      {
        label: "Group C — Haneda (T3)", groups: ALL,
        lines: ["UA875 arr 13:55", "104 travelers · 3 buses (Bus 1 Shota Tanaka, Bus 2 Ai Ogawa, Bus 3 Morio Onda — Shadow only)", "Luggage onto trucks; Bus 3 (Shadow) luggage onto the bus"]
      },
      {
        label: "Group F & H — Narita (T1)", groups: ALL,
        lines: ["UA32 (Group H) arr 14:15 · UA837 (Group F) arr 14:55", "172 travelers · 4 buses (Makiko Saeki, Keiko Kurimura, Fujiko Suzuki, Yumiko Komatsu — Shadow only)", "Two trucks; jump seats on Buses 1–3 used; Bus 4 (Shadow) luggage onto the bus"]
      },
      {
        label: "Group I — Haneda (T3)", groups: ALL,
        lines: ["DL167 arr 14:15", "28 travelers · 1 bus (Hisako Suzuki)", "Luggage loaded onto the bus"]
      },
      {
        label: "Group G — Haneda (T3)", groups: ALL,
        lines: ["UA39 arr 15:15", "72 travelers · 2 buses (Bus 1 Mieko Segawa, Bus 2 Yasushi Komatsu)", "Luggage loaded onto the truck"]
      },
      {
        label: "Group D & E — Narita (T1)", groups: ALL,
        lines: ["NH7 arr 15:25 · UA7949 arr 15:25", "73 travelers · 2 buses (Bus 1 Yuta Kobayashi, Bus 2 Michiko Kikkawa)", "Luggage & larger instruments onto the truck"]
      },
      {
        label: "Hotel — Grand Nikko Tokyo Daiba", groups: ALL,
        lines: ["2-6-1 Daiba, Minato-ku, Tokyo 135-8701 · Tel +81-3-5500-6711", "Laundry service available"]
      }
    ]
  },
  {
    d: 3, dow: "Thu", dd: "11", dm: "JUN", date: "Thursday, June 11, 2026",
    city: "Tokyo", headline: "Tokyo Skytree & Asakusa; first rehearsals.",
    meals: ["Breakfast"],
    hotels: [{ n: "Grand Nikko Tokyo Daiba", q: "Grand Nikko Tokyo Daiba", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "6:30 AM", type: "meal", groups: ALL, title: "Breakfast at hotel",
        desc: "Breakfast served from 6:30am at the hotel restaurant; multiple choices — check your room key packet for details."
      },
      {
        t: "Morning", hr: "9:10 AM", type: "sightseeing", groups: ["band", "orch", "sband"],
        title: "Tokyo Skytree & Asakusa",
        desc: "Visit Tokyo Skytree, Japan's tallest structure (634 m) with sweeping observation decks, and historic Asakusa with Sensō-ji Temple and Nakamise shopping street. Lunch on your own. Band and Orchestra visit in opposite order — see Full logistics for exact times.",
        loc: { n: "Tokyo Skytree", q: "Tokyo Skytree", kind: "sight" }
      },
      {
        t: "Morning", hr: "10:15 AM", type: "sightseeing", groups: ["choir", "schoir"],
        title: "Asakusa & Tokyo Skytree",
        desc: "Choir visits Asakusa and Sensō-ji Temple (11:00–13:00), then Tokyo Skytree (13:20–15:20).",
        loc: { n: "Asakusa & Sensō-ji Temple", q: "Senso-ji Temple Asakusa Tokyo", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:00 PM", type: "rehearsal", groups: ["band", "orch"],
        title: "Rehearsal — Nishi-Arai Cultural Hall",
        desc: "Band & Orchestra rehearse 15:00–18:00 at Nishi-Arai Cultural Hall (Band 15:30–16:30, Orchestra 16:45–17:45). Return to the hotel around 19:10; dinner on your own.",
        loc: { n: "Nishi-Arai Cultural Hall (GalaxCity)", q: "Nishiarai Bunka Hall Adachi Tokyo", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "4:00 PM", type: "rehearsal", groups: ["band"], gnote: "Percussion section only",
        title: "Percussion — Iwakura High School",
        desc: "The Saratoga Percussion Section rehearses and performs at Iwakura High School, 16:00–18:00.",
        loc: { n: "Iwakura High School", q: "Iwakura High School Taito Tokyo", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "3:40 PM", type: "rehearsal", groups: ["choir"],
        title: "Rehearsal — Katsushika Symphony Hills",
        desc: "Choir rehearses 15:40–18:40 at Katsushika Symphony Hills. Return to the hotel around 18:30; dinner on your own in small groups.",
        loc: { n: "Katsushika Symphony Hills", q: "Katsushika Symphony Hills Tokyo", kind: "venue" }
      },
      {
        t: "Evening", hr: "after rehearsal", type: "free", groups: ["schoir", "sband"],
        title: "Free time & dinner on own",
        desc: "While your ensemble rehearses, free time in Tokyo. Dinner on your own near the hotel until curfew."
      }
    ],
    logistics: [
      {
        label: "Band (Bus 4–7)", groups: ["band", "sband"],
        lines: ["08:55 — Board coach on 1F", "09:10 — Depart hotel", "10:00–12:00 — Tokyo Skytree (Bus 4–5: 10:00 entry · Bus 6–7: 10:15 entry)", "12:30–14:30 — Asakusa, shopping & lunch on own"]
      },
      {
        label: "Orchestra (Bus 1–3)", groups: ["orch", "sband"],
        lines: ["09:10 — Board coach on 1F", "09:20 — Depart hotel", "10:00–12:00 — Asakusa, shopping & lunch on own", "12:30–14:30 — Tokyo Skytree"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["10:00 — Board coach on 1F", "10:15 — Depart hotel", "11:00–13:00 — Asakusa", "13:20–15:20 — Tokyo Skytree"]
      },
      {
        label: "Band & Orchestra — afternoon / evening", groups: ["band", "orch"],
        lines: ["15:00–18:00 — Rehearsal at Nishi-Arai Cultural Hall", "15:30–16:30 — Band rehearsal (cellos & basses warm up in rehearsal room and Green Room 1)", "16:45–17:45 — Orchestra rehearsal", "16:00–18:00 — Saratoga Percussion rehearsal & performance at Iwakura HS", "18:30 — Depart venue (Band equipment loads first, then Orchestra)", "19:10 — Return to hotel, dinner on own"]
      },
      {
        label: "Choir — afternoon / evening", groups: ["choir", "schoir"],
        lines: ["15:40–18:40 — Rehearsal at Katsushika Symphony Hills", "18:30 — Return to hotel, dinner on own in small groups"]
      },
      {
        label: "Hotel — Grand Nikko Tokyo Daiba", groups: ALL,
        lines: ["2-6-1 Daiba, Minato-ku, Tokyo 135-8701 · Tel +81-3-5500-6711 · Laundry available"]
      }
    ]
  },
  {
    d: 4, dow: "Fri", dd: "12", dm: "JUN", date: "Friday, June 12, 2026",
    city: "Tokyo", headline: "Meiji Shrine & Harajuku; school exchanges and the first Choir concert.",
    meals: ["Breakfast", "Dinner"],
    hotels: [{ n: "Grand Nikko Tokyo Daiba", q: "Grand Nikko Tokyo Daiba", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "6:30 AM", type: "meal", groups: ALL, title: "Breakfast at hotel",
        desc: "Breakfast served from 6:30am at the hotel restaurant; multiple choices — check your room key packet for details."
      },
      {
        t: "Morning", hr: "8:45 AM", type: "sightseeing", groups: ["band", "orch", "sband"],
        title: "Meiji Shrine & Harajuku",
        desc: "Visit the forested calm of Meiji Shrine and the youthful buzz of Harajuku's Takeshita Street. Lunch on your own. Band and Orchestra visit in opposite order — see Full logistics.",
        loc: { n: "Meiji Jingu Shrine", q: "Meiji Jingu Shrine Tokyo", kind: "sight" }
      },
      {
        t: "Morning", hr: "9:30 AM", type: "sightseeing", groups: ["choir", "schoir"],
        title: "Meiji Shrine & Harajuku",
        desc: "Choir visits Meiji Shrine (10:00–11:00) then Harajuku's Takeshita Street (11:30–13:30) for shopping and lunch on your own.",
        loc: { n: "Takeshita Street, Harajuku", q: "Takeshita Street Harajuku Tokyo", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:30 PM", type: "exchange", groups: ["band", "orch"], gnote: "Students only",
        title: "Musical Exchange — Ichikawa Gakuen High School",
        desc: "Band & Orchestra are hosted by the Ichikawa Gakuen Band and Orchestra for a musical exchange (15:30–17:30), followed by social time and a group photo.",
        loc: { n: "Ichikawa Gakuen High School", q: "Ichikawa Gakuen High School Chiba", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "afternoon", type: "free", groups: ["sband"],
        title: "Free time — Band/Orch Shadow",
        desc: "Free afternoon in Tokyo while Band & Orchestra are at the Ichikawa Gakuen exchange (students only)."
      },
      {
        t: "Afternoon", hr: "4:00 PM", type: "performance", groups: ["choir"],
        title: "PERFORMANCE — Friendship Concert at Toko Hall",
        desc: "Choir performs a Friendship Concert at Toko Hall, Toko Gakuen High School (16:00–17:15), opening with the combined piece 'Ruri Iro No Chikyu (Blue Mother Earth)'. Post-concert social and group photo.",
        loc: { n: "Toko Hall, Toko Gakuen High School", q: "Toko Gakuen Tokyo", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "4:00 PM", type: "performance", groups: ["schoir"], gnote: "Attending — Student & Shadow only",
        title: "Attend the Choir's Friendship Concert",
        desc: "Choir Shadow travelers attend the Choir's Friendship Concert at Toko Hall (Student and Shadow only).",
        loc: { n: "Toko Hall, Toko Gakuen High School", q: "Toko Gakuen Tokyo", kind: "venue" }
      },
      {
        t: "Evening", hr: "7:30 PM", type: "meal", groups: ALL,
        title: "Group dinner — Mo-Mo-Paradise",
        desc: "Group dinner 19:30–20:30: Band at Mo-Mo-Paradise Kabukicho Main Store · Orchestra at Mo-Mo-Paradise Shibuya Center-Gai · Choir at Mo-Mo-Paradise Shinjuku Sanchome. Return to the hotel; curfew announced by the directors.",
        loc: { n: "Shinjuku / Shibuya", q: "Shinjuku Tokyo", kind: "sight" }
      }
    ],
    logistics: [
      {
        label: "Orchestra (Bus 1–3)", groups: ["orch", "sband"],
        lines: ["08:30 — Board coach on 1F", "08:45 — Depart hotel", "10:00–11:00 — Meiji Shrine", "11:30–13:30 — Harajuku, shopping & lunch on own", "14:30 — Arrive Ichikawa Gakuen HS, unload & warm up", "15:30–17:30 — Musical Exchange (Students Only)", "18:00 — Depart school", "19:30–20:30 — Dinner: Mo-Mo-Paradise Shibuya Center-Gai", "21:00 — Return to hotel"]
      },
      {
        label: "Band (Bus 4–7)", groups: ["band", "sband"],
        lines: ["08:45 — Board coach on 1F", "09:00 — Depart hotel", "10:00–12:00 — Harajuku, shopping & lunch on own", "12:30–13:30 — Meiji Shrine", "14:30 — Arrive Ichikawa Gakuen HS, unload & warm up", "15:30–17:30 — Musical Exchange (Students Only)", "18:00 — Depart school", "19:30–20:30 — Dinner: Mo-Mo-Paradise Kabukicho Main Store", "21:00 — Return to hotel"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["09:15 — Board coach on 1F", "09:30 — Depart hotel", "10:00–11:00 — Meiji Shrine", "11:30–13:30 — Harajuku, shopping & lunch on own", "14:30 — Arrive Toko Gakuen HS, change & warm up", "15:30 — Combined rehearsal: 'Ruri Iro No Chikyu (Blue Mother Earth)'", "16:00–17:15 — Friendship Concert at Toko Hall (Student & Shadow only)", "17:15–18:00 — Post-concert social & group photo", "18:00 — Depart school", "19:30–20:30 — Dinner: Mo-Mo-Paradise Shinjuku Sanchome", "21:30 — Return to hotel"]
      },
      {
        label: "Hotel — Grand Nikko Tokyo Daiba", groups: ALL,
        lines: ["2-6-1 Daiba, Minato-ku, Tokyo 135-8701 · Tel +81-3-5500-6711 · Laundry available"]
      }
    ]
  },
  {
    d: 5, dow: "Sat", dd: "13", dm: "JUN", date: "Saturday, June 13, 2026",
    city: "Tokyo", headline: "Band & Orchestra concert at Beethoven Hall; Choir at Ikebukuro Global Ring.",
    meals: ["Breakfast", "Lunch (Band & Orchestra)"],
    hotels: [{ n: "Grand Nikko Tokyo Daiba", q: "Grand Nikko Tokyo Daiba", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "6:30 AM", type: "meal", groups: ALL, title: "Breakfast at hotel",
        desc: "Breakfast served from 6:30am at the hotel restaurant; multiple choices — check your room key packet for details."
      },
      {
        t: "Afternoon", hr: "2:00 PM", type: "performance", groups: ["band", "orch"],
        title: "PERFORMANCE — Friendship Concert, Beethoven Hall",
        desc: "Band & Orchestra perform a Friendship Concert with Iwakura High School at Beethoven Hall, Musashino Academia Musicae (14:00–16:00, open to the public). Includes a combined 'Galaxy Express 999' with Iwakura and a pre-concert Saratoga Percussion Studio set, 'Shared Space'. Bento box lunches provided.",
        loc: { n: "Beethoven Hall, Musashino Academia Musicae", q: "Musashino Academia Musicae Tokyo", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "2:00 PM", type: "performance", groups: ["sband"], gnote: "Attending",
        title: "Attend the Beethoven Hall concert",
        desc: "Band/Orch Shadow travelers attend the Friendship Concert at Beethoven Hall (open to the public).",
        loc: { n: "Beethoven Hall, Musashino Academia Musicae", q: "Musashino Academia Musicae Tokyo", kind: "venue" }
      },
      {
        t: "Morning", hr: "10:00 AM", type: "sightseeing", groups: ["choir", "schoir"],
        title: "Kawagoe ('Little Edo')",
        desc: "Choir spends the late morning in Kawagoe (11:30–13:30) — Edo-era clay-walled streets, the Toki no Kane bell tower and snack shops — with sightseeing, shopping and lunch on your own.",
        loc: { n: "Kawagoe ('Little Edo')", q: "Kawagoe Saitama", kind: "sight" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "performance", groups: ["choir"],
        title: "PERFORMANCE — Ikebukuro Global Ring Theatre",
        desc: "Choir performs an open-air concert at the Ikebukuro Global Ring Theatre (18:00–18:45, open to the public). Free time and early dinner on your own in Ikebukuro beforehand, then a 17:00–18:00 stage rehearsal.",
        loc: { n: "Ikebukuro Global Ring Theatre", q: "Global Ring Theatre Ikebukuro Tokyo", kind: "venue" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "performance", groups: ["schoir"], gnote: "Attending",
        title: "Attend the Choir concert",
        desc: "Choir Shadow travelers attend the Choir's concert at the Ikebukuro Global Ring Theatre.",
        loc: { n: "Ikebukuro Global Ring Theatre", q: "Global Ring Theatre Ikebukuro Tokyo", kind: "venue" }
      },
      {
        t: "Evening", hr: "7:30 PM", type: "meal", groups: ALL,
        title: "Dinner on own & pack overnight bag",
        desc: "Return to the hotel; dinner on your own in small groups. Prepare a small overnight bag and concert clothes for tomorrow's one-night stay at Fuji Lake Kawaguchi. Curfew announced by the directors."
      }
    ],
    logistics: [
      {
        label: "Band (Bus 4–7)", groups: ["band", "sband"],
        lines: ["09:15 — Board coach on 1F", "09:30 — Depart hotel in concert attire"]
      },
      {
        label: "Orchestra (Bus 1–3)", groups: ["orch", "sband"],
        lines: ["09:30 — Board coach on 1F", "09:45 — Depart hotel in concert attire", "10:15 — Arrive Beethoven Hall (Saratoga Green Room: Brahms Hall)"]
      },
      {
        label: "Band & Orchestra — concert", groups: ["band", "orch", "sband"],
        lines: ["11:30–12:10 — Band rehearsal (Orchestra bento lunch)", "12:20–13:00 — Orchestra rehearsal (Band bento lunch)", "13:00 — Combined rehearsal (Orchestra & Iwakura HS): 'Galaxy Express 999'", "13:30 — Doors open", "13:40–13:50 — Pre-concert: Saratoga Percussion Studio 'Shared Space'", "14:00–16:00 — Friendship Concert with Iwakura HS (open to public)", "16:30–17:30 — Pack-up (Band first, then Orchestra) & social", "19:00 — Return to hotel, dinner on own"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["09:45 — Board coach on 1F (bring concert clothes)", "10:00 — Depart hotel", "11:30–13:30 — Kawagoe ('Little Edo'), sightseeing, shopping & lunch on own", "14:00 — Depart for Ikebukuro", "15:00–17:00 — Free time & early dinner on own in Ikebukuro", "17:00–18:00 — Stage rehearsal", "18:00–18:45 — Performance at Ikebukuro Global Ring Theatre (open to public)", "19:30 — Return to hotel"]
      },
      {
        label: "Hotel — Grand Nikko Tokyo Daiba", groups: ALL,
        lines: ["2-6-1 Daiba, Minato-ku, Tokyo 135-8701 · Tel +81-3-5500-6711 · Laundry available"]
      }
    ]
  },
  {
    d: 6, dow: "Sun", dd: "14", dm: "JUN", date: "Sunday, June 14, 2026",
    city: "Fuji Lake Kawaguchi", headline: "Mt. Fuji Music Festival; Choir at the Music Forest Museum.",
    meals: ["Breakfast", "Lunch", "Dinner"],
    hotels: [
      { n: "Hotel Mount Fuji (Band & Choir)", q: "Hotel Mount Fuji Yamanakako", groups: ["band", "choir", "schoir", "sband"] },
      { n: "Highland Resort Hotel & Spa (Orchestra)", q: "Highland Resort Hotel and Spa Fujiyoshida", groups: ["orch"] }
    ],
    note: "One-night stay — laundry service not available. Main luggage is transferred ahead to Kyoto; pack a small overnight bag. Shadow Tour: overnight at The Prince Hakone Lake Ashinoko.",
    items: [
      {
        t: "Morning", hr: "early", type: "travel", groups: ALL,
        title: "Early breakfast, check out & drive to Mt. Fuji",
        desc: "Band & Orchestra: breakfast 05:45–07:00 in the Palais Royal banquet room (BF1), load suitcases at 05:30, depart ~07:15–07:30 in concert attire (~2-hr drive). Choir: breakfast 07:00, depart 09:00 (~2.5-hr drive). Main luggage goes ahead to Kyoto."
      },
      {
        t: "Afternoon", hr: "12:00 PM", type: "performance", groups: ["band", "orch"],
        title: "PERFORMANCE — Mt. Fuji Music Festival",
        desc: "Band & Orchestra perform at the Kawaguchiko Stellar Theater as part of the Mt. Fuji Music Festival (festival 12:00–16:30, open to the public). Orchestra performs 13:30–13:55, Band 15:40–16:05, with a combined finale of 'Takarajima' & 'The Stars and Stripes Forever' with local groups.",
        loc: { n: "Kawaguchiko Stellar Theater", q: "Kawaguchiko Stellar Theater", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "12:00 PM", type: "performance", groups: ["sband"], gnote: "Attending",
        title: "Attend the Mt. Fuji Music Festival",
        desc: "Band/Orch Shadow travelers attend the Mt. Fuji Music Festival at the Kawaguchiko Stellar Theater (open to the public).",
        loc: { n: "Kawaguchiko Stellar Theater", q: "Kawaguchiko Stellar Theater", kind: "venue" }
      },
      {
        t: "Morning", hr: "11:30 AM", type: "sightseeing", groups: ["choir", "schoir"],
        title: "Oshino Hakkai",
        desc: "Choir visits Oshino Hakkai (11:30–13:30), a village of crystal-clear spring ponds fed by Mt. Fuji's snowmelt, for sightseeing and an early lunch. A prepaid card or cash packet is provided for included meals.",
        loc: { n: "Oshino Hakkai", q: "Oshino Hakkai", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "4:10 PM", type: "performance", groups: ["choir"],
        title: "PERFORMANCE — Kawaguchiko Music Forest Museum",
        desc: "Choir performs in the Organ Hall of the Kawaguchiko Music Forest Museum (16:10–16:40, open to the public) — a European-style park of antique music boxes with Mt. Fuji views. Free time in the museum beforehand, then a 15:30–16:00 rehearsal.",
        loc: { n: "Kawaguchiko Music Forest Museum", q: "Kawaguchiko Music Forest Museum", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "2:00 PM", type: "performance", groups: ["schoir"], gnote: "Attending",
        title: "Music Forest Museum & Choir performance",
        desc: "Choir Shadow travelers enjoy the Kawaguchiko Music Forest Museum and attend the Choir's performance in the Organ Hall.",
        loc: { n: "Kawaguchiko Music Forest Museum", q: "Kawaguchiko Music Forest Museum", kind: "sight" }
      },
      {
        t: "Evening", hr: "6:30 PM", type: "meal", groups: ALL,
        title: "Hotel check-in & group dinner",
        desc: "Check in and have a group dinner at your hotel. Band 18:30 in Concerto · Choir 18:30 in Garden Café · Orchestra at Fujiyama Terrace (seatings 18:30 / 19:45). Curfew announced by the directors."
      }
    ],
    logistics: [
      {
        label: "Band & Orchestra — morning", groups: ["band", "orch", "sband"],
        lines: ["05:30 — Load suitcases onto truck", "05:45–07:00 — Breakfast in Palais Royal banquet room (BF1)", "Orchestra (Bus 1–3): 07:00 board / 07:15 depart", "Band (Bus 4–7): 07:15 board / 07:30 depart (concert attire, ~2-hr non-stop drive)", "09:30 — Arrive Kawaguchiko Stellar Theater"]
      },
      {
        label: "Mt. Fuji Music Festival — timing", groups: ["band", "orch", "sband"],
        lines: ["10:05–10:30 — Orchestra rehearsal", "10:35–11:00 — Band rehearsal", "11:00–11:10 — Combined (Band & local groups): 'Takarajima' & 'The Stars and Stripes Forever'", "11:30 — Doors open", "13:30–13:55 — Orchestra performance", "15:40–16:05 — Band performance", "16:10–16:20 — Combined finale", "16:30–17:30 — Pack up, social & group photo"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["07:00 — Breakfast at hotel restaurant", "07:45 — Load luggage onto truck", "08:45 — Board coach (bring concert clothes)", "09:00 — Depart hotel (~2.5-hr non-stop drive)", "11:30–13:30 — Oshino Hakkai, sightseeing & early lunch", "14:00 — Arrive Kawaguchiko Music Forest Museum, free time", "15:30–16:00 — Rehearsal", "16:10–16:40 — Performance in Organ Hall (open to public)", "17:30 — Check in at Hotel Mount Fuji"]
      },
      {
        label: "Hotels & dinner", groups: ALL,
        lines: ["Band & Choir: Hotel Mount Fuji — 1360-83 Yamanaka, Yamanakako-mura, Yamanashi 401-0501 · +81-555-62-2111 (~20 min from venue)", "Orchestra: Highland Resort Hotel & Spa — 5-6-1 Shin-Nishihara, Fujiyoshida, Yamanashi 403-0017 · +81-555-22-1000 (~10 min from venue)", "Dinner: Band 18:30 Concerto · Choir 18:30 Garden Café · Orchestra Fujiyama Terrace 18:30 / 19:45"]
      }
    ]
  },
  {
    d: 7, dow: "Mon", dd: "15", dm: "JUN", date: "Monday, June 15, 2026",
    city: "Kyoto", headline: "Mt. Fuji 5th Station, then Shinkansen to Kyoto.",
    meals: ["Breakfast", "Lunch"],
    hotels: [{ n: "Miyako Hotel Kyoto Hachijo", q: "Miyako Hotel Kyoto Hachijo", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "7:00 AM", type: "meal", groups: ALL, title: "Breakfast in groups & check out",
        desc: "Breakfast in timed groups (Band & Choir: Garden Café · Orchestra: Fujiyama Terrace; seatings 07:00 / 07:45 / 08:30), then check out. Depart around 10:30."
      },
      {
        t: "Morning", hr: "11:30 AM", type: "sightseeing", groups: ALL,
        title: "Mt. Fuji 5th Station",
        desc: "Visit the Mt. Fuji Fifth Station (11:30–12:15), about halfway up the mountain at ~2,300 m, with panoramic views and shrines. Group lunch at the Gogoen Rest House (12:15–13:30).",
        loc: { n: "Mt. Fuji Fifth Station", q: "Mount Fuji Subaru Line 5th Station", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "2:30 PM", type: "sightseeing", groups: ["band", "orch", "sband"],
        title: "Oshino Hakkai",
        desc: "Band & Orchestra visit Oshino Hakkai (14:30–15:30) — crystal-clear spring ponds with Mt. Fuji views — before heading to the Shinkansen.",
        loc: { n: "Oshino Hakkai", q: "Oshino Hakkai", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "afternoon", type: "travel", groups: ALL,
        title: "Shinkansen to Kyoto",
        desc: "Transfer from Mishima Station to Kyoto by Shinkansen bullet train (~2 hrs). Choir: Hikari 717, 15:46→17:37. Band & Orchestra: Hikari 521, 17:46→19:37.",
        loc: { n: "Kyoto Station", q: "Kyoto Station", kind: "sight" }
      },
      {
        t: "Evening", hr: "evening", type: "hotel", groups: ALL,
        title: "Arrive Kyoto & hotel check-in",
        desc: "Walk to the Miyako Hotel Kyoto Hachijo and check in. Evening free on your own in small groups. Curfew announced by the directors."
      }
    ],
    logistics: [
      {
        label: "Breakfast & departure", groups: ALL,
        lines: ["Band & Choir: Garden Café · Orchestra: Fujiyama Terrace", "Seatings: 07:00 / 07:45 / 08:30", "Orchestra (Bus 1–3) from Highland Resort: 10:15 board / 10:30 depart", "Band (Bus 4–7) & Choir (Bus 8–9) from Hotel Mount Fuji: 10:15 board / 10:30 depart", "11:30–12:15 — Mt. Fuji 5th Station", "12:15–13:30 — Group lunch at Gogoen Rest House"]
      },
      {
        label: "Choir — afternoon", groups: ["choir", "schoir"],
        lines: ["13:45 — Depart for Mishima Station", "14:45 — Arrive Mishima Station", "15:46 — Depart by Shinkansen Hikari 717 (~2-hr ride)", "17:37 — Arrive Kyoto Station", "18:00 — Walk to hotel & check in, evening free"]
      },
      {
        label: "Band & Orchestra — afternoon", groups: ["band", "orch", "sband"],
        lines: ["13:30 — Depart for Oshino Hakkai", "14:30–15:30 — Oshino Hakkai", "15:30 — Transfer to Mishima Station", "17:46 — Depart by Shinkansen Hikari 521 (~2-hr ride)", "19:37 — Arrive Kyoto Station", "20:00 — Walk to hotel & check in, evening free"]
      },
      {
        label: "Hotel — Miyako Hotel Kyoto Hachijo", groups: ALL,
        lines: ["17 Nishikujo-Inmachi, Minami-ku, Kyoto 601-8412 · Tel +81-75-661-7111 · Laundry available"]
      }
    ]
  },
  {
    d: 8, dow: "Tue", dd: "16", dm: "JUN", date: "Tuesday, June 16, 2026",
    city: "Kyoto", headline: "Free half-day in Kyoto; Arashiyama Bamboo Grove.",
    meals: ["Breakfast", "Dinner"],
    hotels: [{ n: "Miyako Hotel Kyoto Hachijo", q: "Miyako Hotel Kyoto Hachijo", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "7:00 AM", type: "meal", groups: ALL, title: "Breakfast at hotel",
        desc: "Breakfast at the hotel restaurant. Multiple choices available."
      },
      {
        t: "Morning", hr: "morning", type: "sightseeing", groups: ALL,
        title: "Free half-day in Kyoto",
        desc: "A relaxed free half-day in Kyoto in small groups. First-time visitors may prioritize Kinkaku-ji (Golden Pavilion), Kiyomizu-dera, Nijō Castle, Sanjūsangen-dō and the Gion district — you might even spot a geisha or maiko.",
        loc: { n: "Kinkaku-ji (Golden Pavilion)", q: "Kinkaku-ji Kyoto", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:00 PM", type: "sightseeing", groups: ALL,
        title: "Arashiyama Bamboo Grove",
        desc: "Depart in the early afternoon for Arashiyama (15:00–17:00) — its famous Bamboo Grove, scenic river views and local cafés. Departures by group: Choir 14:00 · Band 14:15 · Orchestra 14:30.",
        loc: { n: "Arashiyama Bamboo Grove", q: "Arashiyama Bamboo Grove Kyoto", kind: "sight" }
      },
      {
        t: "Evening", hr: "5:30 PM", type: "meal", groups: ALL,
        title: "Group dinner",
        desc: "Group dinner at a restaurant (17:30–19:00), then return to the hotel around 19:30. Curfew announced by the directors."
      }
    ],
    logistics: [
      {
        label: "Morning", groups: ALL,
        lines: ["07:00 — Breakfast at hotel restaurant", "Free half-day in Kyoto in small groups", "Suggested: Kinkaku-ji, Kiyomizu-dera, Nijō Castle, Sanjūsangen-dō, Gion district"]
      },
      {
        label: "Afternoon / evening", groups: ALL,
        lines: ["Departures to Arashiyama: Choir (Bus 8–9) 14:00 · Band (Bus 4–7) 14:15 · Orchestra (Bus 1–3) 14:30", "15:00–17:00 — Arashiyama (Bamboo Forest), lunch on own", "17:30–19:00 — Group dinner", "19:30 — Return to hotel"]
      },
      {
        label: "Hotel — Miyako Hotel Kyoto Hachijo", groups: ALL,
        lines: ["17 Nishikujo-Inmachi, Minami-ku, Kyoto 601-8412 · Tel +81-75-661-7111 · Laundry available"]
      }
    ]
  },
  {
    d: 9, dow: "Wed", dd: "17", dm: "JUN", date: "Wednesday, June 17, 2026",
    city: "Kobe", headline: "Transfer to Kobe; Band & Orchestra concert at Akashi Civic Hall.",
    meals: ["Breakfast", "Dinner"],
    hotels: [
      { n: "Kobe Bay Sheraton Hotel & Towers (Band & Orchestra)", q: "Kobe Bay Sheraton Hotel and Towers", groups: ["band", "orch", "sband"] },
      { n: "Kobe Plaza Hotel (Choir)", q: "Kobe Plaza Hotel", groups: ["choir", "schoir"] }
    ],
    items: [
      {
        t: "Morning", hr: "7:00 AM", type: "travel", groups: ALL,
        title: "Breakfast, check out & transfer to Kobe",
        desc: "Breakfast at 07:00, load the truck and check out at 10:30. Transfer toward Kobe with a service-area lunch stop en route (Band: Takarazuka Kita SA · Orchestra: Suita SA · Choir: Tsuchiyama SA)."
      },
      {
        t: "Afternoon", hr: "6:00 PM", type: "performance", groups: ["band", "orch"],
        title: "PERFORMANCE — Friendship Concert, Akashi Civic Hall",
        desc: "Band & Orchestra perform a Friendship Concert with Takigawa Daini High School at Akashi Civic Hall (18:00–20:30), including a combined 'Takarajima' with Takigawa Daini. Bento box dinners and rehearsals beforehand.",
        loc: { n: "Akashi Civic Hall", q: "Akashi Civic Hall Hyogo", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "2:00 PM", type: "sightseeing", groups: ["choir", "schoir"],
        title: "Kobe Chinatown (Nankinmachi)",
        desc: "Choir visits Kobe's Nankinmachi Chinatown (14:00–16:00) for sightseeing and an early dinner on your own in small groups — steamed buns, dumplings, ramen and desserts.",
        loc: { n: "Nankinmachi (Kobe Chinatown)", q: "Nankinmachi Kobe", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "5:00 PM", type: "performance", groups: ["choir", "schoir"], gnote: "Observing",
        title: "Observe the Akashi Civic Hall concert",
        desc: "Choir and Choir Shadow arrive at Akashi Civic Hall (17:00) to observe the Band & Orchestra Friendship Concert.",
        loc: { n: "Akashi Civic Hall", q: "Akashi Civic Hall Hyogo", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "4:00 PM", type: "performance", groups: ["sband"], gnote: "Attending",
        title: "Attend the Akashi Civic Hall concert",
        desc: "Band/Orch Shadow travelers attend the Friendship Concert at Akashi Civic Hall.",
        loc: { n: "Akashi Civic Hall", q: "Akashi Civic Hall Hyogo", kind: "venue" }
      },
      {
        t: "Evening", hr: "10:00 PM", type: "hotel", groups: ALL,
        title: "Hotel check-in",
        desc: "Band & Orchestra: depart Akashi ~21:30 for the Kobe Bay Sheraton (evening snack provided), check in ~22:00 and retrieve luggage from 3F storage. Choir: depart ~21:00 and check in at the Kobe Plaza Hotel (evening snack provided)."
      }
    ],
    logistics: [
      {
        label: "Band (Bus 4–7)", groups: ["band", "sband"],
        lines: ["11:00 — Board coach", "11:15 — Depart hotel", "12:00–13:30 — Lunch at Takarazuka Kita Service Area", "14:45 — Arrive Akashi Civic Hall, change to concert attire", "15:30–16:10 — Band rehearsal", "~17:10 — Box dinner & change"]
      },
      {
        label: "Orchestra (Bus 1–3)", groups: ["orch", "sband"],
        lines: ["11:15 — Board coach", "11:30 — Depart hotel", "12:30–14:00 — Lunch at Suita Service Area", "15:00 — Arrive Akashi Civic Hall, change to concert attire", "16:20–17:05 — Orchestra rehearsal", "17:05–17:30 — Combined rehearsal (Orchestra & Takigawa Daini) 'Takarajima'", "17:30 — Doors open"]
      },
      {
        label: "Band & Orchestra — concert & transfer", groups: ["band", "orch", "sband"],
        lines: ["18:00–20:30 — Friendship Concert with Takigawa Daini HS", "21:30 — Depart venue for Kobe Bay Sheraton (evening snack)", "22:00 — Hotel check-in, retrieve luggage from 3F storage"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["11:30 — Board coach", "11:45 — Depart hotel", "12:00–13:30 — Lunch at Tsuchiyama Service Area", "14:00–16:00 — Kobe Chinatown (Nankinmachi), early dinner on own", "17:00 — Arrive Akashi Civic Hall to observe the concert", "21:00 — Depart venue, check in at Kobe Plaza Hotel (evening snack)"]
      },
      {
        label: "Hotels", groups: ALL,
        lines: ["Band & Orchestra: Kobe Bay Sheraton Hotel & Towers — 2-13 Koyocho-naka, Higashinada-ku, Kobe 658-0032 · +81-78-857-7000", "Choir: Kobe Plaza Hotel — 1-13-12 Motomachi-dori, Chuo-ku, Kobe 650-0022 · +81-78-332-1141", "Both hotels: laundry available"]
      }
    ]
  },
  {
    d: 10, dow: "Thu", dd: "18", dm: "JUN", date: "Thursday, June 18, 2026",
    city: "Kobe", headline: "Kobe Harborland & Chinatown; Choir concert at Kobe High School.",
    meals: ["Breakfast"],
    hotels: [
      { n: "Kobe Bay Sheraton Hotel & Towers (Band & Orchestra)", q: "Kobe Bay Sheraton Hotel and Towers", groups: ["band", "orch", "sband"] },
      { n: "Kobe Plaza Hotel (Choir)", q: "Kobe Plaza Hotel", groups: ["choir", "schoir"] }
    ],
    items: [
      {
        t: "Morning", hr: "7:00 AM", type: "meal", groups: ALL, title: "Breakfast at hotel",
        desc: "Choir: breakfast from 07:00 at the hotel restaurant. Band & Orchestra: breakfast 08:00–09:30 in the Rokko Banquet Room (3F)."
      },
      {
        t: "Afternoon", hr: "12:00 PM", type: "sightseeing", groups: ["band", "orch", "sband"],
        title: "Kobe Chinatown & Harborland",
        desc: "Visit Nankinmachi Chinatown (12:00–14:00, lunch on your own), then free time and afternoon activities (14:30–18:30) in Harborland, Meriken Park and the New Port area — Kobe Port Tower, Kawasaki Good Times World, AQUARIUM × ART átoa, TOTTEI PARK and umie. Return ~19:00.",
        loc: { n: "Kobe Harborland", q: "Kobe Harborland", kind: "sight" }
      },
      {
        t: "Morning", hr: "9:30 AM", type: "sightseeing", groups: ["choir", "schoir"],
        title: "Harborland & Meriken Park (free time)",
        desc: "Choir has free time (10:00–13:00) in Harborland, Meriken Park and the New Port area before the afternoon school visit.",
        loc: { n: "Meriken Park", q: "Meriken Park Kobe", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "4:30 PM", type: "performance", groups: ["choir"],
        title: "PERFORMANCE — Friendship Concert at Kobe High School",
        desc: "Choir arrives at Kobe High School (13:30) for a campus tour and visit, then performs a Friendship Concert at 16:30 (Student and Shadow only). Depart 19:00.",
        loc: { n: "Kobe High School", q: "Hyogo Prefectural Kobe High School", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "4:30 PM", type: "performance", groups: ["schoir"], gnote: "Attending — Student & Shadow only",
        title: "Attend the Kobe High School concert",
        desc: "Choir Shadow travelers attend the Choir's Friendship Concert at Kobe High School (Student and Shadow only).",
        loc: { n: "Kobe High School", q: "Hyogo Prefectural Kobe High School", kind: "venue" }
      },
      {
        t: "Evening", hr: "6:30 PM", type: "meal", groups: ALL,
        title: "Dinner on own",
        desc: "Dinner on your own in small groups (Choir near the hotel after returning ~19:30). Free evening until curfew."
      }
    ],
    logistics: [
      {
        label: "Band & Orchestra", groups: ["band", "orch", "sband"],
        lines: ["08:00–09:30 — Breakfast in Rokko Banquet Room (3F)", "Orchestra (Bus 1–3): 11:15 board / 11:30 depart", "Band (Bus 4–7): 11:30 board / 11:45 depart", "12:00–14:00 — Kobe Chinatown (Nankinmachi), lunch on own", "14:30–18:30 — Free time in Harborland, Meriken Park & New Port (Port Tower, Kawasaki Good Times World, átoa, TOTTEI PARK, umie)", "19:00 — Return to hotel"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["07:00 — Breakfast at hotel restaurant", "09:15 — Board coach", "09:30 — Depart hotel", "10:00–13:00 — Free time in Harborland / Meriken Park / New Port", "13:30 — Arrive Kobe High School, campus tour & visit", "16:30 — Friendship Concert with Kobe HS (Student & Shadow only)", "19:00 — Depart school", "19:30 — Return to hotel, dinner near hotel on own"]
      },
      {
        label: "Hotels", groups: ALL,
        lines: ["Band & Orchestra: Kobe Bay Sheraton Hotel & Towers — 2-13 Koyocho-naka, Higashinada-ku, Kobe 658-0032 · +81-78-857-7000", "Choir: Kobe Plaza Hotel — 1-13-12 Motomachi-dori, Chuo-ku, Kobe 650-0022 · +81-78-332-1141", "Both hotels: laundry available"]
      }
    ]
  },
  {
    d: 11, dow: "Fri", dd: "19", dm: "JUN", date: "Friday, June 19, 2026",
    city: "Hiroshima", headline: "Shinkansen to Hiroshima; Peace Memorial Park.",
    meals: ["Breakfast", "Dinner"],
    hotels: [{ n: "Grand Prince Hotel Hiroshima", q: "Grand Prince Hotel Hiroshima", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "breakfast", type: "travel", groups: ALL,
        title: "Breakfast, check out & Shinkansen to Hiroshima",
        desc: "Breakfast and check-out, then board the Shinkansen from Shin-Kobe to Hiroshima (~1 hr 10 min). Orchestra: Nozomi 9, 09:54→11:02 · Band: Nozomi 13, 10:30→11:38 · Choir: Nozomi 11, 10:15→11:28.",
        loc: { n: "Hiroshima Station", q: "Hiroshima Station", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "1:30 PM", type: "sightseeing", groups: ALL,
        title: "Hiroshima Peace Memorial Park",
        desc: "Lunch on your own near Hiroshima Station (11:30–13:00), then visit the Peace Memorial Park (13:30–16:00) — the Atomic Bomb Dome, memorials and museums dedicated to the victims of August 6, 1945 and to peace.",
        loc: { n: "Hiroshima Peace Memorial Park", q: "Hiroshima Peace Memorial Park", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "afternoon", type: "performance", groups: ["choir"],
        title: "PERFORMANCE — Peace Memorial Park",
        desc: "Choir gives a short performance in the Peace Memorial Park in front of the Children's Peace Monument (Sadako Statue).",
        loc: { n: "Children's Peace Monument", q: "Children's Peace Monument Hiroshima", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "afternoon", type: "performance", groups: ["schoir"], gnote: "Attending",
        title: "Attend the Choir's Peace Park performance",
        desc: "Choir Shadow travelers attend the Choir's short performance at the Children's Peace Monument.",
        loc: { n: "Children's Peace Monument", q: "Children's Peace Monument Hiroshima", kind: "venue" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "hotel", groups: ALL,
        title: "Hotel check-in & group dinner",
        desc: "Hotel check-in at 16:30, then a group dinner at 18:00 in the Setouchi Banquet Room. Curfew announced by the directors."
      }
    ],
    logistics: [
      {
        label: "Band & Orchestra", groups: ["band", "orch", "sband"],
        lines: ["06:30–08:00 — Breakfast in Rokko Banquet Room (3F)", "08:00 — Load truck & check out", "Orchestra (Bus 1–3): 08:30 board / 08:45 depart → Nozomi 9, Shin-Kobe→Hiroshima 09:54–11:02", "Band (Bus 4–7): 09:00 board / 09:15 depart → Nozomi 13, 10:30–11:38"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["07:00 — Breakfast at hotel restaurant", "08:45 — Board coach", "09:00 — Depart hotel → Nozomi 11, Shin-Kobe→Hiroshima 10:15–11:28"]
      },
      {
        label: "All groups — afternoon", groups: ALL,
        lines: ["11:30–13:00 — Lunch on own near Hiroshima Station", "13:30–16:00 — Hiroshima Peace Memorial Park (Choir short performance at the Sadako Statue)", "16:30 — Hotel check-in", "18:00 — Group dinner in Banquet Room Setouchi"]
      },
      {
        label: "Hotel — Grand Prince Hotel Hiroshima", groups: ALL,
        lines: ["1-3 Ujina-Kaigan, Minami-ku, Hiroshima 734-8543 · Tel +81-82-256-1111 · Laundry available"]
      }
    ]
  },
  {
    d: 12, dow: "Sat", dd: "20", dm: "JUN", date: "Saturday, June 20, 2026",
    city: "Hiroshima", headline: "Peace Friendship Concert; Choir at Jogakuin.",
    meals: ["Breakfast", "Lunch (Band & Orchestra)"],
    hotels: [{ n: "Grand Prince Hotel Hiroshima", q: "Grand Prince Hotel Hiroshima", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "7:30 AM", type: "meal", groups: ALL, title: "Breakfast at hotel",
        desc: "Breakfast 07:30–09:00 in the Setouchi Banquet Room (2F)."
      },
      {
        t: "Afternoon", hr: "1:30 PM", type: "performance", groups: ["band", "orch"],
        title: "PERFORMANCE — Peace Friendship Concert, Hiroshima Phoenix Hall",
        desc: "Band & Orchestra perform the Peace Friendship Concert with Hijiyama High School at Hiroshima Phoenix Hall (13:30–15:45), with a combined 'Takarajima' & 'Let's Go Carp!' and a pre-concert Saratoga Percussion Studio set, 'José / beFORe John 5'. Checked instruments are packed for the flights home afterward.",
        loc: { n: "Hiroshima Phoenix Hall", q: "JMS Aster Plaza Hiroshima", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "1:30 PM", type: "performance", groups: ["sband"], gnote: "Attending",
        title: "Attend the Peace Friendship Concert",
        desc: "Band/Orch Shadow travelers attend the Peace Friendship Concert at Hiroshima Phoenix Hall (open to the public).",
        loc: { n: "Hiroshima Phoenix Hall", q: "JMS Aster Plaza Hiroshima", kind: "venue" }
      },
      {
        t: "Morning", hr: "10:00 AM", type: "exchange", groups: ["choir"], gnote: "Peace study & exchange",
        title: "Hiroshima Jogakuin — Peace Study & exchange",
        desc: "Choir visits Hiroshima Jogakuin High School (arrive 10:00), joins a Peace Study Class (10:30–11:15), then walks to the historic Shukkeien Garden before returning for rehearsal.",
        loc: { n: "Hiroshima Jogakuin High School", q: "Hiroshima Jogakuin Hiroshima", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "3:00 PM", type: "performance", groups: ["choir"],
        title: "PERFORMANCE — Friendship Concert at Jogakuin",
        desc: "Choir performs a Friendship Concert with Hiroshima Jogakuin High School in the school chapel (15:00–16:30, open to the public).",
        loc: { n: "Hiroshima Jogakuin High School (Chapel)", q: "Hiroshima Jogakuin Hiroshima", kind: "venue" }
      },
      {
        t: "Afternoon", hr: "3:00 PM", type: "performance", groups: ["schoir"], gnote: "Attending",
        title: "Attend the Jogakuin concert",
        desc: "Choir Shadow travelers attend the Choir's Friendship Concert at Hiroshima Jogakuin High School (open to the public).",
        loc: { n: "Hiroshima Jogakuin High School (Chapel)", q: "Hiroshima Jogakuin Hiroshima", kind: "venue" }
      },
      {
        t: "Evening", hr: "5:30 PM", type: "meal", groups: ALL,
        title: "Dinner on own around Hondori",
        desc: "Dinner on your own in small groups around Hondori, Hiroshima's downtown shopping arcade — try local okonomiyaki. Free evening until curfew.",
        loc: { n: "Hondori shopping arcade", q: "Hondori Hiroshima", kind: "sight" }
      }
    ],
    logistics: [
      {
        label: "Band & Orchestra", groups: ["band", "orch", "sband"],
        lines: ["07:30–09:00 — Breakfast in Setouchi Banquet Room (2F)", "Orchestra (Bus 1–3): 09:15 board / 09:30 depart (concert attire)", "Band (Bus 4–7): 09:30 board / 09:45 depart", "10:00 — Arrive concert venue", "11:00–11:40 — Orchestra rehearsal (Band bento lunch)", "11:50–12:30 — Band rehearsal (Orchestra bento lunch)", "12:30–13:00 — Combined (Band & Hijiyama) 'Takarajima' & 'Let's Go Carp!'", "13:00 — Doors open", "13:10–13:20 — Pre-concert Saratoga Percussion 'José / beFORe John 5'", "13:30–15:45 — Friendship Concert with Hijiyama HS at Hiroshima Phoenix Hall", "16:45–17:30 — Social", "17:30–19:00 — Dinner on own around Hondori", "19:30 — Return to hotel"]
      },
      {
        label: "Choir (Bus 8–9)", groups: ["choir", "schoir"],
        lines: ["09:00 — Board coach (bring concert clothes)", "09:15 — Depart hotel", "10:00 — Arrive Hiroshima Jogakuin HS (green room 'Chapel')", "10:30–11:15 — Peace Study Class (6 classes)", "~12:30 — Walk to Shukkeien Garden", "~14:00 — Lunch, change & rehearsal in chapel", "14:00–14:15 — Sound check", "14:15–14:30 — Combined rehearsal", "14:30 — Doors open", "15:00–16:30 — Friendship Concert (open to public)", "~17:30 — Social", "18:50 — Depart school", "19:00–20:30 — Dinner on own around Hondori", "21:00 — Return to hotel"]
      },
      {
        label: "Hotel — Grand Prince Hotel Hiroshima", groups: ALL,
        lines: ["1-3 Ujina-Kaigan, Minami-ku, Hiroshima 734-8543 · Tel +81-82-256-1111 · Laundry available"]
      }
    ]
  },
  {
    d: 13, dow: "Sun", dd: "21", dm: "JUN", date: "Sunday, June 21, 2026",
    city: "Hiroshima", headline: "Miyajima Island and the Farewell Dinner Dance Party.",
    meals: ["Breakfast", "Dinner"],
    hotels: [{ n: "Grand Prince Hotel Hiroshima", q: "Grand Prince Hotel Hiroshima", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "6:30 AM", type: "meal", groups: ALL, title: "Breakfast at hotel",
        desc: "Breakfast 06:30–08:00 in the Setouchi Banquet Room (2F)."
      },
      {
        t: "Morning", hr: "9:00 AM", type: "exchange", groups: PERF, gnote: "Students only",
        title: "Cultural exchange — Hijiyama High School",
        desc: "Students visit Hijiyama High School for a cultural exchange (09:00–10:45) — performances, paper-crane making and friendship-building with Japanese students.",
        loc: { n: "Hijiyama High School", q: "Hijiyama Girls Junior and Senior High School Hiroshima", kind: "venue" }
      },
      {
        t: "Morning", hr: "morning", type: "free", groups: SHADOW,
        title: "Free morning — Shadow Tour",
        desc: "Free morning while students are at the Hijiyama exchange (students only). Meet the group for the charter ferry to Miyajima."
      },
      {
        t: "Late morning", hr: "11:35 AM", type: "sightseeing", groups: ALL,
        title: "Miyajima Island",
        desc: "Transfer by charter ferry (~30 min) to Miyajima (Itsukushima) — the 'floating' torii gate of Itsukushima Shrine (a UNESCO World Heritage Site), friendly deer, traditional streets and treats like grilled oysters and momiji manju. Ferries: Orchestra & Choir 11:35 · Band 12:35. Return: Orchestra & Choir 15:30 · Band 16:35.",
        loc: { n: "Itsukushima Shrine, Miyajima", q: "Itsukushima Shrine Miyajima", kind: "sight" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "party", groups: ALL,
        title: "Farewell Dinner Dance Party",
        desc: "The Farewell Dinner Dance Party at the Grand Prince Hotel Hiroshima (18:00–20:30, Students and Shadow only) — a celebration of the tour and a chance to thank the Tour Escorts, Chaperones, Directors and Staff.",
        loc: { n: "Grand Prince Hotel Hiroshima", q: "Grand Prince Hotel Hiroshima", kind: "venue" }
      },
      {
        t: "Evening", hr: "10:00 PM", type: "travel", groups: ALL,
        title: "Load luggage for Tokyo",
        desc: "Load suitcases at 22:00 for the transfer to Tokyo the next day. Prepare a small overnight bag."
      }
    ],
    logistics: [
      {
        label: "Morning", groups: ALL,
        lines: ["06:30–08:00 — Breakfast in Setouchi Banquet Room (2F)", "Orchestra (Bus 1–3) & Choir (Bus 8–9): 08:00 board / 08:15 depart", "Band (Bus 4–7): 08:15 board / 08:30 depart", "09:00–10:45 — Hijiyama HS cultural exchange (Students Only)"]
      },
      {
        label: "Miyajima ferries (charter, ~30 min)", groups: ALL,
        lines: ["To Miyajima: Orchestra & Choir 11:35 · Band 12:35", "Return to hotel port: Orchestra & Choir 15:30 · Band 16:35"]
      },
      {
        label: "Evening", groups: ALL,
        lines: ["18:00–20:30 — Farewell Dinner Dance Party at Grand Prince Hotel Hiroshima (Students & Shadow only)", "22:00 — Load suitcases for transfer to Tokyo"]
      },
      {
        label: "Hotel — Grand Prince Hotel Hiroshima", groups: ALL,
        lines: ["1-3 Ujina-Kaigan, Minami-ku, Hiroshima 734-8543 · Tel +81-82-256-1111"]
      }
    ]
  },
  {
    d: 14, dow: "Mon", dd: "22", dm: "JUN", date: "Monday, June 22, 2026",
    city: "Tokyo", headline: "Shinkansen back to Tokyo.",
    meals: ["Breakfast"],
    hotels: [{ n: "Grand Nikko Tokyo Daiba", q: "Grand Nikko Tokyo Daiba", groups: ALL }],
    items: [
      {
        t: "Morning", hr: "breakfast", type: "travel", groups: ALL,
        title: "Breakfast & depart for Hiroshima Station",
        desc: "Breakfast 07:00–09:00 in the Setouchi Banquet Room (2F). Meet on the bus at 09:00, depart 09:20, arrive Hiroshima Station 10:00. Purchase or eat lunch at the station in small groups (~11:30).",
        loc: { n: "Hiroshima Station", q: "Hiroshima Station", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "12:03 PM", type: "travel", groups: ALL,
        title: "Shinkansen to Tokyo",
        desc: "Board the Shinkansen Nozomi 94 from Hiroshima to Tokyo (12:03→15:57, ~4-hr ride). Lunch on board / on your own.",
        loc: { n: "Tokyo Station", q: "Tokyo Station", kind: "sight" }
      },
      {
        t: "Evening", hr: "evening", type: "hotel", groups: ALL,
        title: "Arrive Tokyo & hotel check-in — last night in Japan",
        desc: "Arrive Tokyo Station 15:57 and transfer to the Grand Nikko Tokyo Daiba. Unload instruments from the truck (1F) at 20:00. Enjoy the last evening in Japan until curfew."
      }
    ],
    logistics: [
      {
        label: "Morning", groups: ALL,
        lines: ["07:00–09:00 — Breakfast in Setouchi Banquet Room (2F)", "09:00 — Meet on bus", "09:20 — Depart hotel", "10:00 — Arrive Hiroshima Station", "~11:30 — Purchase / eat lunch at the station in small groups"]
      },
      {
        label: "Afternoon / evening", groups: ALL,
        lines: ["12:03 — Shinkansen Nozomi 94, Hiroshima → Tokyo (~4-hr ride)", "15:57 — Arrive Tokyo Station, transfer to hotel", "20:00 — Unload instruments from truck (1F)"]
      },
      {
        label: "Hotel — Grand Nikko Tokyo Daiba", groups: ALL,
        lines: ["2-6-1 Daiba, Minato-ku, Tokyo 135-8701 · Tel +81-3-5500-6711 · Laundry available"]
      }
    ]
  },
  {
    d: 15, dow: "Tue", dd: "23", dm: "JUN", date: "Tuesday, June 23, 2026",
    city: "Tokyo → San Francisco", headline: "Fly home to San Francisco.",
    meals: ["Breakfast"],
    hotels: [],
    items: [
      {
        t: "Morning", hr: "7:00 AM", type: "meal", groups: ALL, title: "Breakfast & free morning",
        desc: "Breakfast served 7:00–10:00am at the hotel; multiple choices available. Free morning on your own in small groups. Check out before 13:00, load luggage onto the truck, and depart for the airport on your flight group's schedule. If your departure is after 13:00, bring luggage to the 1F lobby to load or store until departure."
      },
      {
        t: "Afternoon", hr: "see logistics", type: "travel", groups: ALL,
        title: "Depart Haneda / Narita for home",
        desc: "Transfer to Haneda (T3) or Narita (T1) and fly home — most groups to San Francisco, some connecting via Los Angeles. Tap Full logistics below for your flight group's exact departure and flights.",
        loc: { n: "Tokyo — Haneda / Narita Airport", q: "Haneda Airport Tokyo", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "same day", type: "travel", groups: ALL,
        title: "Arrive home at SFO",
        desc: "Arrive back at San Francisco (same calendar day). Collect luggage and instruments and inspect all instrument cases at baggage claim. All travelers arrange their own transportation home. Welcome Home!",
        loc: { n: "San Francisco International Airport (SFO)", q: "San Francisco International Airport", kind: "sight" }
      }
    ],
    logistics: [
      {
        label: "Group C (Shadow Only)", groups: ALL,
        lines: ["10:45 — Board coach (Hotel Lobby 2F)", "11:00 — Departure", "UA876 — Haneda → San Francisco · 15:50→09:45", "1 bus (Morio Onda); luggage onto the bus"]
      },
      {
        label: "Group C (Students & Chaperones)", groups: ALL,
        lines: ["11:00 — Board coach / truck loading (Hotel Lobby 2F)", "11:30 — Departure for Haneda T3", "UA876 — Haneda → San Francisco · 15:50→09:45", "2 buses (Shota Tanaka, Ai Ogawa)"]
      },
      {
        label: "Group H", groups: ALL,
        lines: ["11:30 — Board coach (Hotel Lobby 2F)", "11:45 — Departure for Narita T1", "UA33 — Narita → Los Angeles · 16:45→10:55", "UA469 — Los Angeles → San Francisco · 13:25→14:53", "2 buses (Makiko Saeki, Yumiko Komatsu)"]
      },
      {
        label: "Group D & E", groups: ALL,
        lines: ["12:00 — Board coach / truck loading (Hotel Lobby 2F)", "12:30 — Departure for Narita T1", "Group D: NH8 — Narita → San Francisco · 17:00→10:35", "Group E: UA7950 — Narita → San Francisco · 17:00→10:35", "2 buses (Yuta Kobayashi, Michiko Kikkawa)"]
      },
      {
        label: "Group F", groups: ALL,
        lines: ["12:30 — Board coach / truck loading (Hotel Lobby 2F)", "13:00 — Departure for Narita T1", "UA838 — Narita → San Francisco · 17:05→10:40", "2 buses (Keiko Kurimura, Fujiko Suzuki)"]
      },
      {
        label: "Group I", groups: ALL,
        lines: ["13:00 — Board coach / truck loading (Group Departure Lobby 1F)", "13:30 — Departure for Haneda T3", "DL8 — Haneda → Los Angeles · 16:35→10:44", "DL1559 — Los Angeles → San Francisco · 17:33→18:58", "1 bus (Keiko Takeda); luggage onto the bus"]
      },
      {
        label: "Group A & B", groups: ALL,
        lines: ["13:30 — Board coach / truck loading (Group Departure Lobby 1F)", "14:00 — Departure for Haneda T3", "Group A: NH108 — Haneda → San Francisco · 22:55→16:35", "Group B: UA7939 — Haneda → San Francisco · 22:55→16:35", "1 bus (Aki Murakami)"]
      },
      {
        label: "Group G", groups: ALL,
        lines: ["14:00 — Board coach / truck loading (Group Departure Lobby 1F)", "14:30 — Departure for Haneda T3", "UA38 — Haneda → Los Angeles · 18:10→12:30", "UA233 — Los Angeles → San Francisco · 17:10→18:38", "2 buses (Mieko Segawa, Hisako Suzuki)"]
      },
      {
        label: "Arrival", groups: ALL,
        lines: ["All travelers arrange their own transportation from SFO. Welcome Home!"]
      }
    ]
  }
];

/* ---- Shadow Tour hotels (different from the performer tour) ----
   The performer day-by-day is the backbone of the app. The Shadow Tour follows the same legs of
   the trip but stays at its OWN hotels. We scope each performer hotel entry to the performers and
   inject the correct Shadow Tour hotel per day, so shadow travelers (Band/Orch Shadow, Choir
   Shadow) see THEIR hotel, address and phone — in the day plan, full logistics and check-in.
   Days 1 & 15 are flights; Day 14 the Shadow Tour is also at the Grand Nikko Daiba (no split). */
(function () {
  var SH = ["sband", "schoir"];
  function dropShadow(arr) { return (arr || ALL).filter(function (g) { return g !== "sband" && g !== "schoir"; }); }
  var IKEBUKURO = { n: "Hotel Metropolitan Tokyo Ikebukuro", q: "Hotel Metropolitan Tokyo Ikebukuro", addr: "1-6-1 Nishiikebukuro, Toshima-ku, Tokyo 171-8505", tel: "+81-3-3980-1111" };
  var KYOTO = { n: "Hotel Nikko Princess Kyoto", q: "Hotel Nikko Princess Kyoto", addr: "630 Takahashicho, Shimogyo-ku, Kyoto 600-8096", tel: "+81-75-342-2111" };
  var AWAJI = { n: "Grand Nikko Awaji", q: "Grand Nikko Awaji", addr: "2 Yumebutai, Awaji, Hyogo 656-2306", tel: "+81-799-74-1111" };
  var RIHGA = { n: "Rihga Royal Hotel Hiroshima", q: "Rihga Royal Hotel Hiroshima", addr: "6-78 Motomachi, Naka-ku, Hiroshima 730-0011", tel: "+81-82-502-1121" };
  var SHADOW_DAY_HOTEL = {
    2: IKEBUKURO, 3: IKEBUKURO, 4: IKEBUKURO, 5: IKEBUKURO,
    6: { n: "The Prince Hakone Lake Ashinoko", q: "The Prince Hakone Lake Ashinoko", addr: "144 Motohakone, Hakone-machi, Kanagawa 250-0592", tel: "+81-460-83-1111" },
    7: KYOTO, 8: KYOTO,
    9: AWAJI, 10: AWAJI,
    11: RIHGA, 12: RIHGA,
    13: { n: "Grand Prince Hotel Hiroshima", q: "Grand Prince Hotel Hiroshima", addr: "23-1 Motoujinamachi, Minami-ku, Hiroshima 734-8543", tel: "+81-82-256-1111" }
  };
  DAYS.forEach(function (d) {
    var sh = SHADOW_DAY_HOTEL[d.d]; if (!sh) return;
    /* 1) map row: scope the performer hotels to performers, add the shadow hotel */
    (d.hotels || []).forEach(function (h) { h.groups = dropShadow(h.groups); });
    d.hotels.push({ n: sh.n + " (Shadow Tour)", q: sh.q, groups: SH });
    /* 2) full-logistics hotel blocks → performers only, then add a shadow hotel block */
    (d.logistics || []).forEach(function (b) { if (/hotel/i.test(b.label || "")) b.groups = dropShadow(b.groups); });
    d.logistics.push({
      label: "Hotel — " + sh.n + " (Shadow Tour)", groups: SH,
      lines: [sh.n + " — " + sh.addr + " · " + sh.tel]
    });
    /* 3) check-in items → performers only, then add a shadow check-in */
    (d.items || []).forEach(function (it) { if (it.type === "hotel" || /check[\s-]?in/i.test(it.title || "")) it.groups = dropShadow(it.groups); });
    d.items.push({
      t: "Evening", hr: "check-in", type: "hotel", groups: SH,
      title: "Hotel check-in (Shadow Tour)",
      desc: "Check in for the night at " + sh.n + " — " + sh.addr + " · " + sh.tel + "."
    });
  });
})();

/* ===========================================================================
   SHADOW TOUR — its own day-by-day itinerary (Shadow Tour Itinerary v6.x).
   Shown to Shadow Tour travelers (Band/Orch Shadow = "sband", Choir Shadow =
   "schoir") instead of the performer schedule. Performers are unaffected.
   =========================================================================== */
const SHG = ["sband", "schoir"], SBO = ["sband"], SCH = ["schoir"];
const H_IKE = { n: "Hotel Metropolitan Tokyo Ikebukuro", q: "Hotel Metropolitan Tokyo Ikebukuro", groups: SHG };
const H_HAKONE = { n: "The Prince Hakone Lake Ashinoko", q: "The Prince Hakone Lake Ashinoko", groups: SHG };
const H_KYOTO = { n: "Hotel Nikko Princess Kyoto", q: "Hotel Nikko Princess Kyoto", groups: SHG };
const H_AWAJI = { n: "Grand Nikko Awaji", q: "Grand Nikko Awaji", groups: SHG };
const H_RIHGA = { n: "RIHGA Royal Hotel Hiroshima", q: "RIHGA Royal Hotel Hiroshima", groups: SHG };
const H_GPH = { n: "Grand Prince Hotel Hiroshima", q: "Grand Prince Hotel Hiroshima", groups: SHG };
const H_DAIBA = { n: "Grand Nikko Tokyo Daiba", q: "Grand Nikko Tokyo Daiba", groups: SHG };

const SHADOW_DAYS = [
  {
    d: 1, dow: "Tue", dd: "9", dm: "JUN", date: "Tuesday, June 9, 2026",
    city: "San Francisco", headline: "Departure day — fly from California to Tokyo.",
    meals: [], hotels: [{ n: "Overnight en route (in-flight)", q: "", groups: SHG }],
    items: [
      {
        t: "Departure", hr: "see logistics", type: "travel", groups: SHG,
        title: "Depart for Japan",
        desc: "Report to SHS or your airport per your flight group, check in, and fly to Tokyo (Haneda or Narita). In-flight meals and entertainment included. Most groups depart June 9; Groups A & B depart late on June 8."
      }
    ],
    logistics: [{ label: "Attire", groups: SHG, lines: ["Tour shirt, comfortable layers (all flight groups)"] },
    { label: "Flights", groups: SHG, lines: ["Your exact flight times are on the Group tab → Flights, and on the home screen flight banner."] }]
  },
  {
    d: 2, dow: "Wed", dd: "10", dm: "JUN", date: "Wednesday, June 10, 2026",
    city: "Tokyo", headline: "Arrive in Tokyo and check in at the Hotel Metropolitan Ikebukuro.",
    meals: [], hotels: [H_IKE],
    items: [
      {
        t: "Arrival", hr: "afternoon", type: "travel", groups: SHG,
        title: "Arrive in Tokyo & meet your tour escort",
        desc: "Land at Haneda or Narita (per your flight group), clear customs, collect and inspect luggage, and meet your tour escort in the arrival lobby."
      },
      {
        t: "Evening", hr: "5:00 PM", type: "hotel", groups: SHG,
        title: "Check in — Hotel Metropolitan Tokyo Ikebukuro",
        desc: "Arrive at the hotel (roughly 5:00–6:30pm depending on your flight group), unload, check in, and settle into your rooms.",
        loc: { n: "Hotel Metropolitan Tokyo Ikebukuro", q: "Hotel Metropolitan Tokyo Ikebukuro", kind: "hotel" }
      },
      {
        t: "Evening", hr: "dinner", type: "meal", groups: SHG,
        title: "Dinner on your own in Ikebukuro",
        desc: "Walk to nearby shopping, dining and entertainment — Sunshine City, Sunshine 60 Street, and the Ikebukuro West Exit district — for dinner on your own."
      }
    ],
    logistics: [{ label: "Arrival hotel", groups: SHG, lines: ["Hotel Metropolitan Tokyo Ikebukuro — 1-6-1 Nishiikebukuro, Toshima-ku, Tokyo 171-8505 · +81-3-3980-1111"] }]
  },
  {
    d: 3, dow: "Thu", dd: "11", dm: "JUN", date: "Thursday, June 11, 2026",
    city: "Tokyo", headline: "Tokyo highlights — Imperial Palace, Ginza, Meiji Shrine & Harajuku.",
    meals: ["Breakfast"], hotels: [H_IKE],
    items: [
      {
        t: "Morning", hr: "9:00 AM", type: "sightseeing", groups: SHG,
        title: "Imperial Palace & Marunouchi",
        desc: "Board coaches (around 9:00–9:30am) and photo-stop at Nijubashi Bridge overlooking the Imperial Palace, then drive through the Marunouchi district past Tokyo Station, Hibiya Park, Kabukiza Theatre and the Tsukiji Outer Market.",
        loc: { n: "Nijubashi Bridge, Imperial Palace", q: "Nijubashi Bridge Tokyo", kind: "sight" }
      },
      {
        t: "Late morning", hr: "11:00 AM", type: "sightseeing", groups: SHG,
        title: "Ginza — shopping & lunch on your own",
        desc: "Time in Ginza, Tokyo's upscale shopping and dining district, with lunch on your own. Drive past the National Diet Building afterward.",
        loc: { n: "Ginza", q: "Ginza Tokyo", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "1:30 PM", type: "sightseeing", groups: SHG,
        title: "Meiji Shrine",
        desc: "Visit Meiji Shrine, a serene Shinto shrine set in a forest of over 100,000 trees in the heart of Tokyo.",
        loc: { n: "Meiji Shrine", q: "Meiji Shrine Tokyo", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:00 PM", type: "sightseeing", groups: SHG,
        title: "Harajuku — Takeshita Street",
        desc: "Explore Harajuku's Takeshita Street, known for youth culture, fashion boutiques, vintage shops and crepe stands.",
        loc: { n: "Takeshita Street, Harajuku", q: "Takeshita Street Harajuku", kind: "sight" }
      },
      {
        t: "Evening", hr: "5:00 PM", type: "meal", groups: SHG,
        title: "Back to hotel — dinner on your own",
        desc: "Return to the hotel and enjoy dinner on your own in the lively Ikebukuro area."
      }
    ],
    note: "Day 10 (June 18) Awaji optional activities: review the info sheet and book + pay via QR code by Sunday, June 14 at 6pm (first-come, first-served; non-refundable).",
    logistics: [
      { label: "Band & Orchestra Shadow (Bus 1–3)", groups: SBO, lines: ["09:00 — Depart hotel for Tokyo sightseeing (Bus 1–2; Bus 3 by 09:30)", "Breakfast from 6:30am at Restaurant Cross Dine (1F)"] },
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["09:30 — Depart hotel for Tokyo sightseeing (Bus 4)", "Breakfast from 6:30am at Restaurant Cross Dine (1F)"] }]
  },
  {
    d: 4, dow: "Fri", dd: "12", dm: "JUN", date: "Friday, June 12, 2026",
    city: "Tokyo", headline: "Asakusa, Tokyo Skytree & Kappabashi; Choir Shadow concert at Toko Hall.",
    meals: ["Breakfast", "Dinner"], hotels: [H_IKE],
    items: [
      {
        t: "Morning", hr: "10:40 AM", type: "sightseeing", groups: SBO,
        title: "Asakusa & Senso-ji Temple",
        desc: "Band/Orch Shadow: depart ~10:40–11:00am for Asakusa, one of Tokyo's most historic districts — the ~1,400-year-old Senso-ji Temple and Nakamise shopping street. Lunch on your own.",
        loc: { n: "Senso-ji Temple, Asakusa", q: "Senso-ji Temple Asakusa", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "2:15 PM", type: "sightseeing", groups: SBO,
        title: "Tokyo Skytree",
        desc: "Band/Orch Shadow: visit the Tokyo Skytree (634m), with observation decks and panoramic views — Mt. Fuji on clear days.",
        loc: { n: "Tokyo Skytree", q: "Tokyo Skytree", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "4:00 PM", type: "sightseeing", groups: SBO,
        title: "Kappabashi Street",
        desc: "Band/Orch Shadow: explore Kappabashi, Tokyo's kitchenware district known for knives, restaurant supplies and realistic food samples.",
        loc: { n: "Kappabashi Street", q: "Kappabashi Street Tokyo", kind: "sight" }
      },
      {
        t: "Morning", hr: "10:00 AM", type: "sightseeing", groups: SCH,
        title: "Asakusa, Kappabashi & Tokyo Skytree",
        desc: "Choir Shadow: depart 10:00am for Asakusa (Senso-ji & Nakamise, early lunch on own), then Kappabashi Street, then the Tokyo Skytree.",
        loc: { n: "Senso-ji Temple, Asakusa", q: "Senso-ji Temple Asakusa", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "4:00 PM", type: "performance", groups: SCH, gnote: "Attending",
        title: "Friendship Concert — Toko Hall",
        desc: "Choir Shadow: attend the Friendship Concert at Toko Hall with the Toko Gakuen High School Choir (around 4:00pm).",
        loc: { n: "Toko Gakuen — Toko Hall", q: "Toko Gakuen Tokyo", kind: "venue" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "meal", groups: SBO,
        title: "Group dinner — Ocean Club Buffet",
        desc: "Band & Orchestra Shadow: group dinner at the Ocean Club Buffet (6:00pm), then return to the hotel (~8:15pm)."
      },
      {
        t: "Evening", hr: "6:30 PM", type: "meal", groups: SCH,
        title: "Group dinner — Ocean Club Buffet",
        desc: "Choir Shadow: join the group for dinner at the Ocean Club Buffet (6:30pm), then return to the hotel (~8:15pm)."
      }
    ],
    logistics: [
      { label: "Band & Orchestra Shadow (Bus 1–3)", groups: SBO, lines: ["10:50 — Depart hotel for Asakusa (Bus 1–2; Bus 3 by 11:00)", "Breakfast from 6:30am at Restaurant Cross Dine (1F)"] },
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["10:00 — Depart hotel for Asakusa (Bus 4)", "Breakfast from 6:30am at Restaurant Cross Dine (1F)"] },
      { label: "Attire", groups: SHG, lines: ["Casual sightseeing attire", "Choir Shadow: semi-formal concert-attendee attire for the afternoon"] }]
  },
  {
    d: 5, dow: "Sat", dd: "13", dm: "JUN", date: "Saturday, June 13, 2026",
    city: "Tokyo", headline: "Kawagoe “Little Edo”; Band/Orch Shadow concert at Beethoven Hall.",
    meals: ["Breakfast"], hotels: [H_IKE],
    items: [
      {
        t: "Morning", hr: "9:00 AM", type: "sightseeing", groups: SBO,
        title: "Kawagoe — “Little Edo”",
        desc: "Band/Orch Shadow: depart ~9:00–9:20am for Kawagoe, known as “Little Edo” for its preserved historic streets and kura warehouses. Early lunch on your own.",
        loc: { n: "Kawagoe (Little Edo)", q: "Kawagoe Little Edo", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "2:00 PM", type: "performance", groups: SBO, gnote: "Attending",
        title: "Friendship Concert — Beethoven Hall (Musashino)",
        desc: "Band/Orch Shadow: attend the Friendship Concert at Musashino Academia Musicae's Beethoven Hall with the Iwakura High School Wind Orchestra (2:00pm).",
        loc: { n: "Musashino Academia Musicae", q: "Musashino Academia Musicae", kind: "venue" }
      },
      {
        t: "Evening", hr: "5:30 PM", type: "performance", groups: SBO, gnote: "Optional",
        title: "Optional: Choir at Ikebukuro Global Ring",
        desc: "Band/Orch Shadow: after returning to the hotel you may walk to the Ikebukuro Global Ring for the Choir's open-air performance, or enjoy your evening. Dinner on your own.",
        loc: { n: "Ikebukuro Global Ring", q: "Ikebukuro Global Ring Theater", kind: "venue" }
      },
      {
        t: "Morning", hr: "10:30 AM", type: "sightseeing", groups: SCH,
        title: "Kawagoe — “Little Edo”",
        desc: "Choir Shadow: depart 10:30am for Kawagoe (“Little Edo”). Lunch on your own.",
        loc: { n: "Kawagoe (Little Edo)", q: "Kawagoe Little Edo", kind: "sight" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "performance", groups: SCH, gnote: "Attending",
        title: "Open-air concert — Ikebukuro Global Ring",
        desc: "Choir Shadow: walk as a group to the Ikebukuro Global Ring Theater for the open-air concert (6:00pm). Dinner on your own afterward.",
        loc: { n: "Ikebukuro Global Ring", q: "Ikebukuro Global Ring Theater", kind: "venue" }
      }
    ],
    note: "Pack a small overnight bag for tomorrow's one-night stay at Lake Ashi — your large luggage is loaded in the morning and won't be accessible again until Kyoto.",
    logistics: [
      { label: "Band & Orchestra Shadow (Bus 1–3)", groups: SBO, lines: ["09:10 — Depart hotel for Kawagoe (Bus 1–2; Bus 3 by 09:20)", "Breakfast from 6:30am at Restaurant Cross Dine (1F)"] },
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["10:30 — Depart hotel for Kawagoe (Bus 4)", "Breakfast from 6:30am at Restaurant Cross Dine (1F)"] },
      { label: "Attire", groups: SHG, lines: ["Casual sightseeing attire", "Band/Orch Shadow: semi-formal concert-attendee attire"] }]
  },
  {
    d: 6, dow: "Sun", dd: "14", dm: "JUN", date: "Sunday, June 14, 2026",
    city: "Tokyo → Lake Ashi", headline: "Mt. Fuji area, then overnight at The Prince Hakone Lake Ashi.",
    meals: ["Breakfast", "Dinner"], hotels: [H_HAKONE],
    items: [
      {
        t: "Morning", hr: "7:30 AM", type: "travel", groups: SHG,
        title: "Load luggage & depart for Mt. Fuji",
        desc: "Bring large check-in luggage to load onto the truck by 7:30am (next access is in Kyoto). Return room keys, then board coaches with your overnight bag. Band/Orch depart ~8:00–8:30am; Choir departs ~9:30am (~2-hr drive)."
      },
      {
        t: "Morning", hr: "10:30 AM", type: "sightseeing", groups: SBO,
        title: "Mt. Fuji 5th Station",
        desc: "Band/Orch Shadow: visit the Mt. Fuji Fifth Station for panoramic views. Early lunch on your own.",
        loc: { n: "Mt. Fuji 5th Station", q: "Mount Fuji 5th Station", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "12:45 PM", type: "performance", groups: SBO, gnote: "Attending",
        title: "Mt. Fuji Music Festival — Stellar Theater",
        desc: "Band/Orch Shadow: attend the Mt. Fuji Music Festival at the Kawaguchiko Stellar Theater — SSO performs 1:30pm, SWE 3:40pm, with the combined finale.",
        loc: { n: "Kawaguchiko Stellar Theater", q: "Kawaguchiko Stellar Theater", kind: "venue" }
      },
      {
        t: "Morning", hr: "12:00 PM", type: "sightseeing", groups: SCH,
        title: "Mt. Fuji 5th Station",
        desc: "Choir Shadow: visit the Mt. Fuji Fifth Station for panoramic views. Lunch on your own.",
        loc: { n: "Mt. Fuji 5th Station", q: "Mount Fuji 5th Station", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "4:10 PM", type: "performance", groups: SCH, gnote: "Attending",
        title: "Concert — Kawaguchiko Music Forest Museum",
        desc: "Choir Shadow: free time at the Kawaguchiko Music Forest Museum (gardens, music-box exhibits), then the concert in the Organ Hall (4:10pm).",
        loc: { n: "Kawaguchiko Music Forest Museum", q: "Kawaguchiko Music Forest Museum", kind: "venue" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "hotel", groups: SHG,
        title: "Check in — The Prince Hakone Lake Ashi",
        desc: "Arrive at The Prince Hakone Lake Ashi (Band/Orch ~6:00pm, Choir ~6:30pm), check in, then group dinner in the Musashi banquet room (annex 3F) at 7:30pm. Evening free to enjoy the grounds.",
        loc: { n: "The Prince Hakone Lake Ashinoko", q: "The Prince Hakone Lake Ashinoko", kind: "hotel" }
      }
    ],
    note: "Today (June 14) at 6pm is the deadline to book + pay for a Day 10 Awaji optional activity.",
    logistics: [
      { label: "Band & Orchestra Shadow (Bus 1–3)", groups: SBO, lines: ["08:15 — Depart hotel for Mt. Fuji (Bus 1–2; Bus 3 by 08:30)", "Luggage to truck by 07:30 (next access in Kyoto); breakfast from 6:30am"] },
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["09:30 — Depart hotel for Mt. Fuji (Bus 4)", "Luggage to truck by 07:30 (next access in Kyoto); breakfast from 6:30am"] },
      { label: "Overnight at Lake Ashi", groups: SHG, lines: ["The Prince Hakone Lake Ashinoko — 144 Motohakone, Hakone-machi, Kanagawa 250-0592 · +81-460-83-1111", "Pack a small overnight bag; large luggage goes ahead to Kyoto"] }]
  },
  {
    d: 7, dow: "Mon", dd: "15", dm: "JUN", date: "Monday, June 15, 2026",
    city: "Lake Ashi → Kyoto", headline: "Free morning at Hakone-En, then Shinkansen to Kyoto.",
    meals: ["Breakfast", "Dinner"], hotels: [H_KYOTO],
    items: [
      {
        t: "Morning", hr: "breakfast", type: "free", groups: SHG,
        title: "Free time at Hakone-En",
        desc: "Breakfast at the hotel, then check out by 11:00am (you may leave overnight bags in the lobby). Enjoy Hakone-En on the hotel property — Mt. Fuji views, cruises, gardens, shops, cafes and hot springs. Return room keys at checkout.",
        loc: { n: "Hakone-En", q: "Hakone-En", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:00 PM", type: "travel", groups: SHG,
        title: "Depart for Atami Station — Shinkansen to Kyoto",
        desc: "Meet at 2:30pm to retrieve bags, depart 3:00pm for Atami Station, and board the Shinkansen (Hikari 719) at 4:40pm for the ~2-hour ride to Kyoto, arriving ~6:37pm.",
        loc: { n: "Atami Station", q: "Atami Station", kind: "sight" }
      },
      {
        t: "Evening", hr: "7:30 PM", type: "meal", groups: SHG,
        title: "Group dinner — Oyashiki Takasegawa Nijo-en",
        desc: "Group dinner at Oyashiki Takasegawa Nijo-en, a historic Kyoto estate and garden along the Kamo River.",
        loc: { n: "Oyashiki Takasegawa Nijo-en", q: "Takasegawa Nijoen Kyoto", kind: "sight" }
      },
      {
        t: "Evening", hr: "9:00 PM", type: "hotel", groups: SHG,
        title: "Check in — Hotel Nikko Princess Kyoto",
        desc: "Check in at the Hotel Nikko Princess Kyoto and settle in for the night.",
        loc: { n: "Hotel Nikko Princess Kyoto", q: "Hotel Nikko Princess Kyoto", kind: "hotel" }
      }
    ],
    logistics: [
      { label: "Departure (all Shadow, Bus 1–4)", groups: SHG, lines: ["15:00 — Depart hotel for Atami Station (check out by 11:00am; meet 14:30 to retrieve bags)"] },
      { label: "Train", groups: SHG, lines: ["Shinkansen Hikari 719 — Atami → Kyoto, board 4:40pm (~2 hours), arrive ~6:37pm"] }]
  },
  {
    d: 8, dow: "Tue", dd: "16", dm: "JUN", date: "Tuesday, June 16, 2026",
    city: "Kyoto", headline: "Free day in Kyoto — temples, gardens and the Gion district.",
    meals: ["Breakfast"], hotels: [H_KYOTO],
    items: [
      {
        t: "Morning", hr: "free day", type: "free", groups: SHG,
        title: "Free day in Kyoto",
        desc: "A relaxed free day. First-timers may want Kinkaku-ji (Golden Pavilion), Kiyomizu-dera, Nijo Castle, Sanjusangen-do (hall of 1,001 statues) and the Gion district for classic streets and teahouses.",
        loc: { n: "Kinkaku-ji (Golden Pavilion)", q: "Kinkaku-ji Kyoto", kind: "sight" }
      },
      {
        t: "Morning", hr: "8:00 AM", type: "free", groups: SHG,
        title: "Concierge service in the lobby",
        desc: "Tour escorts offer concierge help in the hotel lobby (8:00–10:00am and 4:00–7:00pm) to plan your day, recommend attractions and restaurants, or answer questions."
      }
    ],
    logistics: [{ label: "Hotel", groups: SHG, lines: ["Hotel Nikko Princess Kyoto — 630 Takahashicho, Shimogyo-ku, Kyoto 600-8096 · +81-75-342-2111", "Breakfast 7:00am–10:00am"] }]
  },
  {
    d: 9, dow: "Wed", dd: "17", dm: "JUN", date: "Wednesday, June 17, 2026",
    city: "Kyoto → Kobe", headline: "Fushimi Inari & sake district, then concert at Akashi; overnight on Awaji.",
    meals: ["Breakfast"], hotels: [H_AWAJI],
    items: [
      {
        t: "Morning", hr: "8:00 AM", type: "travel", groups: SHG,
        title: "Load luggage & check out",
        desc: "Bring large luggage to load by 8:00am and check out (return room keys). Buses 1–2 depart ~9:00am; Buses 3–4 ~9:15am."
      },
      {
        t: "Morning", hr: "9:30 AM", type: "sightseeing", groups: SHG,
        title: "Fushimi Inari Taisha",
        desc: "Visit Fushimi Inari Taisha, famous for its endless pathways of vibrant red torii gates winding through the forested hillside.",
        loc: { n: "Fushimi Inari Taisha", q: "Fushimi Inari Taisha", kind: "sight" }
      },
      {
        t: "Late morning", hr: "11:30 AM", type: "sightseeing", groups: SHG,
        title: "Fushimi Sake District — lunch on your own",
        desc: "Explore Kyoto's historic Fushimi sake district with its breweries, canals and lantern-lined streets. Lunch on your own.",
        loc: { n: "Fushimi Sake District", q: "Fushimi Sake District Kyoto", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:30 PM", type: "sightseeing", groups: SHG,
        title: "Mitsui Outlet Park Marine Pia Kobe",
        desc: "Transfer to Kobe (~2 hrs) and enjoy free time for early dinner on your own and shopping at the seaside Mitsui Outlet Park Marine Pia Kobe.",
        loc: { n: "Mitsui Outlet Park Marine Pia Kobe", q: "Mitsui Outlet Park Marine Pia Kobe", kind: "sight" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "performance", groups: SHG, gnote: "Attending",
        title: "Friendship Concert — Akashi Civic Hall",
        desc: "Attend the Friendship Concert at Akashi Civic Hall with the Takigawa Daini High School Wind Orchestra (6:00pm).",
        loc: { n: "Akashi Civic Hall", q: "Akashi Civic Hall Hyogo", kind: "venue" }
      },
      {
        t: "Evening", hr: "9:00 PM", type: "hotel", groups: SHG,
        title: "Check in — Grand Nikko Awaji",
        desc: "Arrive at the Grand Nikko Awaji (~9:00pm), unload, check in and settle in for the night on Awaji Island.",
        loc: { n: "Grand Nikko Awaji", q: "Grand Nikko Awaji", kind: "hotel" }
      }
    ],
    logistics: [
      { label: "Band & Orchestra Shadow (Bus 1–3)", groups: SBO, lines: ["09:00 — Depart hotel for Fushimi Inari (Bus 1–2; Bus 3 by 09:15)", "Luggage to truck & check out by 08:00; breakfast from 7:00am"] },
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["09:15 — Depart hotel for Fushimi Inari (Bus 4)", "Luggage to truck & check out by 08:00; breakfast from 7:00am"] },
      { label: "Attire", groups: SHG, lines: ["Casual travel attire; semi-formal concert-attendee attire for the evening"] },
    { label: "Train / hotel", groups: SHG, lines: ["Grand Nikko Awaji — 2 Yumebutai, Awaji, Hyogo 656-2306 · +81-799-74-1111"] }]
  },
  {
    d: 10, dow: "Thu", dd: "18", dm: "JUN", date: "Thursday, June 18, 2026",
    city: "Awaji / Kobe", headline: "Awaji optional experiences (Band/Orch); Choir concert at Kobe HS.",
    meals: ["Breakfast"], hotels: [H_AWAJI],
    items: [
      {
        t: "Morning", hr: "optional", type: "free", groups: SBO,
        title: "Awaji Island optional experiences",
        desc: "Band/Orch Shadow: enjoy your chosen optional experience (booked & paid by June 14) — (A) NIJIGEN NO MORI anime/gaming park, (B) Zen retreat at Zenbo Seinei (18+), (C) Hello Kitty Apple Land, or (D) relax at the resort at your own pace."
      },
      {
        t: "Evening", hr: "dinner", type: "meal", groups: SBO,
        title: "Dinner on your own",
        desc: "After your activity, dinner on your own at the hotel or nearby resort-area restaurants."
      },
      {
        t: "Afternoon", hr: "12:15 PM", type: "sightseeing", groups: SCH,
        title: "Kobe Chinatown (Nankinmachi)",
        desc: "Choir Shadow (not doing an optional excursion): free morning, then depart 12:15pm for downtown Kobe and Nankinmachi Chinatown — colorful streets, snacks and shops. Lunch on your own.",
        loc: { n: "Nankinmachi (Kobe Chinatown)", q: "Nankinmachi Kobe", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "4:30 PM", type: "performance", groups: SCH, gnote: "Attending",
        title: "Friendship Concert — Kobe High School",
        desc: "Choir Shadow: attend the Friendship Concert at the Kobe High School Recital Hall with the Kobe High School Choir (4:30pm), then return to the hotel ~7:00pm.",
        loc: { n: "Kobe High School", q: "Kobe High School", kind: "venue" }
      }
    ],
    note: "Choir Shadow members who chose an Awaji optional experience will miss the afternoon Kobe High School choir concert.",
    logistics: [
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["12:15 — Depart hotel for downtown Kobe (Nankinmachi)", "Breakfast at Coccolare (2F) from 7:00am"] },
      { label: "Band & Orchestra Shadow — optional excursions", groups: SBO, lines: ["NIJIGEN NO MORI: depart 9:50am, return ~4:20pm", "Zenbo Seinei (18+): depart 11:30am, return ~3:20pm", "Hello Kitty Apple Land: depart 10:30am, return ~2:30pm", "Breakfast at Coccolare (2F) from 7:00am"] }]
  },
  {
    d: 11, dow: "Fri", dd: "19", dm: "JUN", date: "Friday, June 19, 2026",
    city: "Kobe → Hiroshima", headline: "Kobe Harborland, then Shinkansen to Hiroshima.",
    meals: ["Breakfast", "Dinner"], hotels: [H_RIHGA],
    items: [
      {
        t: "Morning", hr: "8:00 AM", type: "travel", groups: SHG,
        title: "Load luggage & check out",
        desc: "Bring luggage to load by 8:00am and check out (return room keys). Buses 1–2 depart ~9:45am; Buses 3–4 ~10:00am."
      },
      {
        t: "Late morning", hr: "11:00 AM", type: "sightseeing", groups: SHG,
        title: "Kobe Harborland & Meriken Park",
        desc: "Visit Kobe's waterfront Harborland and Meriken Park — Port Tower, atoa aquarium, shopping and harbor views. Lunch on your own.",
        loc: { n: "Kobe Harborland", q: "Kobe Harborland", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "1:15 PM", type: "travel", groups: SHG,
        title: "Shinkansen to Hiroshima",
        desc: "From Shin-Kobe Station, board the Shinkansen (Nozomi 25) at 1:15pm for the ~1h10m ride to Hiroshima, arriving 2:27pm.",
        loc: { n: "Shin-Kobe Station", q: "Shin-Kobe Station", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:30 PM", type: "hotel", groups: SHG,
        title: "Check in — RIHGA Royal Hotel Hiroshima",
        desc: "Check in at the RIHGA Royal Hotel Hiroshima, beside Peace Memorial Park and walking distance to downtown. Evening on your own.",
        loc: { n: "RIHGA Royal Hotel Hiroshima", q: "RIHGA Royal Hotel Hiroshima", kind: "hotel" }
      }
    ],
    logistics: [
      { label: "Band & Orchestra Shadow (Bus 1–3)", groups: SBO, lines: ["09:45 — Depart hotel for Kobe Harborland (Bus 1–2; Bus 3 by 10:00)", "Luggage to truck & check out by 08:00; breakfast from 7:00am"] },
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["10:00 — Depart hotel for Kobe Harborland (Bus 4)", "Luggage to truck & check out by 08:00; breakfast from 7:00am"] },
      { label: "Train / hotel", groups: SHG, lines: ["Shinkansen Nozomi 25 — Shin-Kobe → Hiroshima, board 1:15pm (~1h10m)", "RIHGA Royal Hotel Hiroshima — 6-78 Motomachi, Naka-ku, Hiroshima 730-0011 · +81-82-502-1121"] }]
  },
  {
    d: 12, dow: "Sat", dd: "20", dm: "JUN", date: "Saturday, June 20, 2026",
    city: "Hiroshima", headline: "Peace Memorial Park; Band/Orch at Phoenix Hall, Choir at Gaine's Hall.",
    meals: ["Breakfast", "Lunch"], hotels: [H_RIHGA],
    items: [
      {
        t: "Morning", hr: "10:00 AM", type: "sightseeing", groups: SBO,
        title: "Peace Memorial Park & Museum",
        desc: "Band/Orch Shadow: visit the Hiroshima Peace Memorial Park and Museum (from ~10:00am), honoring the victims of August 6, 1945 and its message of peace.",
        loc: { n: "Hiroshima Peace Memorial Park", q: "Hiroshima Peace Memorial Park", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "1:30 PM", type: "performance", groups: SBO, gnote: "Attending",
        title: "Friendship Concert — Hiroshima Phoenix Hall",
        desc: "Band/Orch Shadow: lunch on your own at Hondori Shopping Street, then attend the Friendship Concert at Hiroshima Phoenix Hall with the Hijiyama High School Wind Orchestra (1:30pm). Return ~5:00pm.",
        loc: { n: "Hiroshima Phoenix Hall", q: "Hiroshima Phoenix Hall", kind: "venue" }
      },
      {
        t: "Morning", hr: "9:30 AM", type: "sightseeing", groups: SCH,
        title: "Peace Memorial Park & Museum",
        desc: "Choir Shadow: visit the Hiroshima Peace Memorial Park and Museum (from ~9:30am). Lunch on your own at Hondori Shopping Street.",
        loc: { n: "Hiroshima Peace Memorial Park", q: "Hiroshima Peace Memorial Park", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:00 PM", type: "performance", groups: SCH, gnote: "Attending",
        title: "Friendship Concert — Gaine's Hall (Jogakuin)",
        desc: "Choir Shadow: depart ~1:45pm and attend the Friendship Concert at Gaine's Hall with the Hiroshima Jogakuin High School Choir (3:00pm). Return ~5:00pm.",
        loc: { n: "Hiroshima Jogakuin High School", q: "Hiroshima Jogakuin High School", kind: "venue" }
      }
    ],
    note: "Tomorrow (June 21) all Shadow Tour families move to the student hotel, the Grand Prince Hotel Hiroshima.",
    logistics: [
      { label: "Band & Orchestra Shadow (Bus 1–3)", groups: SBO, lines: ["09:15 — Depart hotel for Peace Memorial Park", "Breakfast at Dining Luore (1F) from 7:00am"] },
      { label: "Choir Shadow (Bus 4)", groups: SCH, lines: ["08:45 — Depart hotel for Peace Memorial Park", "13:45 — Depart hotel for the afternoon concert at Gaine's Hall", "Breakfast at Dining Luore (1F) from 7:00am"] },
      { label: "Attire", groups: SHG, lines: ["Casual sightseeing attire; semi-formal concert-attendee attire for the afternoon", "Breakfast at Dining Luore (1F) from 7:00am"] }]
  },
  {
    d: 13, dow: "Sun", dd: "21", dm: "JUN", date: "Sunday, June 21, 2026",
    city: "Hiroshima", headline: "Miyajima Island, then the Farewell Dinner & Dance Party.",
    meals: ["Breakfast", "Dinner"], hotels: [H_GPH],
    items: [
      {
        t: "Morning", hr: "8:00 AM", type: "travel", groups: SHG,
        title: "Load luggage, check out & ferry to Miyajima",
        desc: "Bring luggage to load by 8:00am and check out of the RIHGA Royal. Depart 8:30am for the ferry to Miyajima (~10:30am arrival)."
      },
      {
        t: "Morning", hr: "10:30 AM", type: "sightseeing", groups: SHG,
        title: "Itsukushima Shrine & Miyajima",
        desc: "Walk to Itsukushima Shrine, the famous “floating” torii, then free time exploring Miyajima — waterfront, shops, and the island's friendly deer.",
        loc: { n: "Itsukushima Shrine, Miyajima", q: "Itsukushima Shrine Miyajima", kind: "sight" }
      },
      {
        t: "Afternoon", hr: "3:15 PM", type: "hotel", groups: SHG,
        title: "Check in — Grand Prince Hotel Hiroshima",
        desc: "Return by ferry (~2:00pm) and transfer to the Grand Prince Hotel Hiroshima. Check in ~3:15pm and freshen up for the Farewell party.",
        loc: { n: "Grand Prince Hotel Hiroshima", q: "Grand Prince Hotel Hiroshima", kind: "hotel" }
      },
      {
        t: "Evening", hr: "6:00 PM", type: "performance", groups: SHG, gnote: "Celebration",
        title: "Farewell Dinner & Dance Party",
        desc: "Gather in the Setouchi Banquet Room (2F, doors 5:30pm) at 6:00pm to celebrate the tour with food and dancing. Final announcements at 8:10pm; load luggage to the truck by 10:00pm (next access in Tokyo)."
      }
    ],
    note: "Dress to impress for the Farewell Dinner & Dance Party.",
    logistics: [
      { label: "Departure (all Shadow, Bus 1–4)", groups: SHG, lines: ["08:30 — Depart hotel for the Miyajima ferry", "Luggage to truck & check out by 08:00; breakfast from 7:00am"] },
      { label: "Farewell party & luggage", groups: SHG, lines: ["Setouchi Banquet Room (2F) — doors 5:30pm, party 6:00pm", "Pack and load large luggage by 10:00pm; next access is in Tokyo", "Grand Prince Hotel Hiroshima — 23-1 Motoujinamachi, Minami-ku, Hiroshima 734-8543 · +81-82-256-1111"] }]
  },
  {
    d: 14, dow: "Mon", dd: "22", dm: "JUN", date: "Monday, June 22, 2026",
    city: "Hiroshima → Tokyo", headline: "Shinkansen back to Tokyo; final night at the Grand Nikko Daiba.",
    meals: ["Breakfast"], hotels: [H_DAIBA],
    items: [
      {
        t: "Morning", hr: "9:30 AM", type: "travel", groups: SHG,
        title: "Depart for Hiroshima Station",
        desc: "Breakfast in the Setouchi Banquet Room (2F). Board coaches ~9:30am for Hiroshima Station; return room keys before boarding."
      },
      {
        t: "Afternoon", hr: "12:18 PM", type: "travel", groups: SHG,
        title: "Shinkansen to Tokyo",
        desc: "Buy a bento or eat an early lunch at the station, then board the Shinkansen (Nozomi 24) at 12:18pm for the ~4-hour ride to Tokyo, arriving ~4:15pm.",
        loc: { n: "Hiroshima Station", q: "Hiroshima Station", kind: "sight" }
      },
      {
        t: "Evening", hr: "evening", type: "hotel", groups: SHG,
        title: "Check in — Grand Nikko Tokyo Daiba",
        desc: "Transfer from Tokyo Station to the Grand Nikko Tokyo Daiba, check in, and enjoy a free final evening for last-minute souvenirs.",
        loc: { n: "Grand Nikko Tokyo Daiba", q: "Grand Nikko Tokyo Daiba", kind: "hotel" }
      }
    ],
    logistics: [
      { label: "Departure (all Shadow, Bus 1–4)", groups: SHG, lines: ["09:20 — Depart hotel for Hiroshima Station", "Breakfast in Setouchi Banquet Room (2F) 7:00–9:00am; return room keys before boarding"] },
      { label: "Train / hotel", groups: SHG, lines: ["Shinkansen Nozomi 24 — Hiroshima → Tokyo, board 12:18pm (~4 hours)", "Grand Nikko Tokyo Daiba — 2-6-1 Daiba, Minato-ku, Tokyo 135-8701 · +81-3-5500-6711"] }]
  },
  {
    d: 15, dow: "Tue", dd: "23", dm: "JUN", date: "Tuesday, June 23, 2026",
    city: "Tokyo → San Francisco", headline: "Free morning, then fly home.",
    meals: ["Breakfast"], hotels: [],
    items: [
      {
        t: "Morning", hr: "breakfast", type: "free", groups: SHG,
        title: "Breakfast & free morning",
        desc: "Breakfast 7:00–10:00am. Free morning to explore the area in small groups. Return keys to your flight group chaperone; luggage loads onto the truck. Check-out is 1:00pm (store bags at 1F if your flight is later)."
      },
      {
        t: "Afternoon", hr: "see logistics", type: "travel", groups: SHG,
        title: "Depart for the airport & fly home",
        desc: "Transfer to Haneda or Narita per your flight group and fly home. Your exact flight time is on the Group tab → Flights and the home-screen banner.",
        loc: { n: "Tokyo — Haneda / Narita Airport", q: "Haneda Airport Tokyo", kind: "sight" }
      }
    ],
    logistics: [{ label: "Welcome home", groups: SHG, lines: ["Inspect all checked bags at baggage claim before leaving", "All travelers arrange their own transportation home"] }]
  }
];

/* Shadow Tour attire, by day (shown only to Shadow Tour travelers) */
const SHADOW_ATTIRE = {
  1: [{ g: SHG, t: "Tour shirt, comfortable layers" }],
  2: [{ g: SHG, t: "Tour shirt, comfortable layers" }],
  3: [{ g: SHG, t: "Casual attire for sightseeing" }],
  4: [{ g: SHG, t: "Casual attire for sightseeing" }, { g: SCH, t: "Semi-formal concert-attendee attire for the afternoon" }],
  5: [{ g: SHG, t: "Casual attire for sightseeing" }, { g: SBO, t: "Semi-formal concert-attendee attire" }],
  6: [{ g: SHG, t: "Casual attire for travel & sightseeing" }],
  7: [{ g: SHG, t: "Casual attire for travel & sightseeing" }],
  8: [{ g: SHG, t: "Casual attire for sightseeing" }],
  9: [{ g: SHG, t: "Casual travel attire; semi-formal concert-attendee attire for the evening" }],
  10: [{ g: SBO, t: "Casual attire for sightseeing / your optional activity" }, { g: SCH, t: "Casual attire; semi-formal concert-attendee attire for the afternoon" }],
  11: [{ g: SHG, t: "Casual attire for travel & sightseeing" }],
  12: [{ g: SHG, t: "Casual attire for sightseeing; semi-formal concert-attendee attire for the afternoon" }],
  13: [{ g: SHG, t: "Casual for sightseeing; dress to impress for the Farewell Dinner & Dance Party" }],
  14: [{ g: SHG, t: "Comfortable casual attire for travel" }],
  15: [{ g: SHG, t: "Tour shirt, comfortable layers" }]
};

const CITIES = [
  {
    id: "tokyo", name: "Tokyo", days: "Days 2–6 & 14–15", emoji: "T",
    intro: "Japan's vast, electric capital — ultramodern skylines woven through centuries-old temples, neighborhoods that swing from hushed shrine forests to neon street fashion.",
    attractions: [
      ["Tokyo Skytree", "Japan's tallest structure (634 m) with observation decks and, on clear days, Mt. Fuji views."],
      ["Sensō-ji Temple, Asakusa", "Tokyo's oldest Buddhist temple (founded 628 AD), reached via the souvenir-lined Nakamise Street."],
      ["Meiji Shrine", "A serene Shinto shrine set in a forest of 100,000 trees in the heart of the city."],
      ["Imperial Palace & Nijubashi Bridge", "The Emperor's residence, with the photogenic double-arched stone bridge."],
      ["Harajuku & Takeshita Street", "Youth-fashion epicenter — boutiques, vintage shops and crepe stands."],
      ["Ginza", "Tokyo's upscale shopping and dining district."]],
    food: [
      ["Sushi & conveyor-belt sushi", "From high-end counters to fun, affordable kaiten-zushi.", ["Aqua City Odaiba", "Genki Sushi Shibuya"]],
      ["Ramen", "Every neighborhood has its specialty; Ikebukuro and Shinjuku are ramen heavens.", ["Ichiran Shibuya", "Afuri Harajuku", "Ikebukuro ramen"]],
      ["Tsukiji Outer Market street food", "Grilled seafood, tamagoyaki and fresh sashimi.", ["Nakamise Street Asakusa", "Aqua City Odaiba"]],
      ["Monjayaki & okonomiyaki", "Savory griddle pancakes — a Tokyo comfort food.", ["Sometaro Asakusa", "Aqua City Odaiba"]],
      ["Depachika food halls", "Basement-level gourmet halls in department stores — great for picnic dinners.", ["Isetan Shinjuku", "Tokyu Food Show Shibuya"]]]
  },
  {
    id: "fuji", name: "Fuji Lake Kawaguchi", days: "Days 6–7", emoji: "F",
    intro: "A lakeside resort area at the foot of Mt. Fuji — one of the Fuji Five Lakes and one of the best places in Japan for unobstructed views of the iconic peak.",
    attractions: [
      ["Mt. Fuji 5th Station", "The highest point reachable by road, with sweeping views of the surrounding area."],
      ["Oshino Hakkai", "A village of eight crystal-clear spring ponds fed by Mt. Fuji's snowmelt, ringed by thatched-roof houses."],
      ["Kawaguchiko Music Forest Museum", "A European-style park of antique music boxes and mechanical instruments with Fuji views."],
      ["Stellar Theater", "A lakeside open-air venue with a retractable roof and a Mt. Fuji backdrop."],
      ["Lake Kawaguchi", "Scenic boat rides, a ropeway and lakeshore walks."]],
    food: [
      ["Hōtō", "Yamanashi's signature flat-noodle miso hotpot with pumpkin and vegetables.", ["Hoto Fudo Kawaguchiko", "Hoto Kosaku Kawaguchiko"]],
      ["Yoshida udon", "Famously chewy, firm udon noodles local to the Mt. Fuji region.", ["Menkyo-kaiden Fujiyoshida", "Fujiyoshida udon"]],
      ["Sweet-potato treats", "Roasted sweet potato and potato snacks sold around the lakes.", ["Oshino Hakkai", "Kawaguchiko Station"]],
      ["Freshwater fish", "Grilled trout and other lake fish.", ["Oshino Hakkai", "Lake Kawaguchi"]]]
  },
  {
    id: "kyoto", name: "Kyoto", days: "Days 7–9", emoji: "K",
    intro: "Japan's former imperial capital and the heart of its traditional culture — over a thousand years of temples, shrines, machiya townhouses and geisha districts.",
    attractions: [
      ["Kinkaku-ji (Golden Pavilion)", "A gold-leaf temple shimmering over a reflecting pond."],
      ["Kiyomizu-dera", "A hillside temple with a vast wooden veranda and sweeping city views."],
      ["Fushimi Inari Taisha", "Thousands of vermilion torii gates winding up a sacred mountain."],
      ["Arashiyama Bamboo Grove", "A towering bamboo path on Kyoto's scenic western edge."],
      ["Nijō Castle", "An elegant shogun's palace with 'nightingale' floors and gardens."],
      ["Gion district", "Classic Kyoto streets and teahouses — you may spot a geisha or maiko."]],
    food: [
      ["Kaiseki", "Refined multi-course seasonal cuisine — Kyoto's culinary art form.", ["Pontocho Alley Kyoto", "Gion Kyoto"]],
      ["Yudofu", "Simple, delicate hot tofu, often served near temples.", ["Nanzenji Junsei Kyoto", "Arashiyama Kyoto"]],
      ["Matcha sweets", "Green-tea parfaits, soft-serve and wagashi.", ["Gion Tsujiri Kyoto", "Nishiki Market"]],
      ["Nishiki Market", "'Kyoto's Kitchen' — a covered street of food stalls and specialty shops.", ["Nishiki Market Kyoto"]],
      ["Yatsuhashi", "Cinnamon-scented mochi sweets, Kyoto's classic souvenir.", ["Sannenzaka (Kiyomizu approach)", "Nishiki Market"]]]
  },
  {
    id: "kobe", name: "Kobe", days: "Days 9–11", emoji: "Ko",
    intro: "A cosmopolitan port city framed by the Rokko mountains and the sea — known for its harbor, international heritage and, of course, its world-famous beef.",
    attractions: [
      ["Kobe Harborland & umie", "A waterfront shopping and entertainment district with bay views."],
      ["Meriken Park & Port Tower", "Iconic red lattice tower and harborside park, great for photos."],
      ["Nankinmachi (Chinatown)", "A lively lane of Chinese street food and shops."],
      ["Kitano-cho", "Hillside neighborhood of preserved Western-style foreign residences."],
      ["AQUARIUM × ART átoa", "An art-meets-aquarium attraction on the waterfront."],
      ["Mt. Rokko", "Mountain ropeway and night views over the city."]],
    food: [
      ["Kobe beef", "Intensely marbled wagyu, often served teppanyaki-style.", ["Steakland Kobe Sannomiya", "Mouriya Kobe"]],
      ["Sobameshi", "A Kobe street food of chopped yakisoba noodles fried with rice.", ["Sannomiya Kobe", "Nankinmachi Kobe"]],
      ["Akashiyaki", "Soft, egg-rich octopus dumplings dipped in broth (from nearby Akashi).", ["Motomachi Kobe", "Sannomiya Kobe"]],
      ["Nankinmachi street food", "Steamed pork buns and dumplings in Chinatown.", ["Nankinmachi Kobe Chinatown", "Roushoki Nankinmachi"]],
      ["Kobe sweets & bakeries", "Kobe is celebrated for its pastries, cakes and bakeries.", ["Juchheim Motomachi Kobe", "Motomachi Kobe"]]]
  },
  {
    id: "hiroshima", name: "Hiroshima", days: "Days 11–14", emoji: "H",
    intro: "A city of peace and remarkable resilience, rebuilt after 1945 into a green, welcoming city — and the gateway to the sacred island of Miyajima.",
    attractions: [
      ["Peace Memorial Park", "A moving space of monuments dedicated to the victims and to lasting peace."],
      ["Atomic Bomb Dome", "The preserved skeletal ruin near the blast epicenter — a UNESCO World Heritage Site."],
      ["Peace Memorial Museum", "Powerful exhibits documenting the 1945 bombing and its aftermath."],
      ["Miyajima & Itsukushima Shrine", "An island shrine whose great torii gate appears to float at high tide."],
      ["Hiroshima Castle", "A reconstructed feudal castle set in a leafy park."],
      ["Shukkeien Garden", "A classic landscaped strolling garden."]],
    food: [
      ["Hiroshima-style okonomiyaki", "Layered savory pancake built around fried noodles — a local obsession.", ["Okonomimura Hiroshima", "Nagataya Hiroshima"]],
      ["Oysters (kaki)", "Hiroshima is Japan's top oyster producer — try them grilled on Miyajima.", ["Yakigaki no Hayashi Miyajima", "Miyajima Omotesando"]],
      ["Momiji manju", "Maple-leaf-shaped cakes filled with red bean, custard and more.", ["Miyajima Omotesando Shopping Street", "Momijido Miyajima"]],
      ["Tsukemen", "Spicy cold dipping noodles, a Hiroshima specialty.", ["Bakudanya Hiroshima", "Hondori Hiroshima"]],
      ["Anago-meshi", "Grilled conger eel over rice, popular around Miyajima.", ["Anago-meshi Ueno Miyajimaguchi", "Miyajima"]]]
  }
];

/* ============================ STATE ============================ */
/* ============================ FLIGHTS ============================ */
/* Flight groups (A–I) are assigned by the tour and are SEPARATE from the
   ensemble/travel groups. One letter covers a traveler's outbound and return. */
const FLIGHTS = [
  {
    id: "A", menu: "ANA NH107 · SFO→Haneda nonstop",
    who: "San Francisco → Tokyo Haneda, nonstop (ANA). Buses shared with Group B.",
    out: {
      meta: "SHS arrival 22:30 (Jun 8) · Depart SHS 23:00 (Jun 8) · Arrive Haneda (HND) Terminal 3", escort: "Aki Murakami (1 bus, shared with Group B)",
      legs: [{ no: "NH107", airline: "ANA", from: "San Francisco (SFO)", to: "Tokyo Haneda (HND)", dep: "01:45 · Jun 9", arr: "05:00 · Jun 10" }]
    },
    ret: {
      meta: "Board 13:30 (Group Departure Lobby 1F) · Depart 14:00 for Haneda T3", escort: "Aki Murakami (1 bus, shared with Group B)",
      legs: [{ no: "NH108", airline: "ANA", from: "Tokyo Haneda (HND)", to: "San Francisco (SFO)", dep: "22:55 · Jun 23", arr: "16:35 · Jun 23" }]
    }
  },
  {
    id: "B", menu: "United/ANA UA7914 · SFO→Haneda nonstop",
    who: "San Francisco → Tokyo Haneda, nonstop (United, operated by ANA). Buses shared with Group A.",
    out: {
      meta: "SHS arrival 22:30 (Jun 8) · Depart SHS 23:00 (Jun 8) · Arrive Haneda (HND) Terminal 3 · SFO check-in with ANA", escort: "Aki Murakami (1 bus, shared with Group A)",
      legs: [{ no: "UA7914", airline: "United (operated by ANA)", from: "San Francisco (SFO)", to: "Tokyo Haneda (HND)", dep: "01:45 · Jun 9", arr: "05:00 · Jun 10", note: "SFO check-in with ANA" }]
    },
    ret: {
      meta: "Board 13:30 (Group Departure Lobby 1F) · Depart 14:00 for Haneda T3", escort: "Aki Murakami (1 bus, shared with Group A)",
      legs: [{ no: "UA7939", airline: "United (operated by ANA)", from: "Tokyo Haneda (HND)", to: "San Francisco (SFO)", dep: "22:55 · Jun 23", arr: "16:35 · Jun 23" }]
    }
  },
  {
    id: "C", menu: "United UA875 · SFO→Haneda nonstop",
    who: "San Francisco → Tokyo Haneda, nonstop (United). 104 travelers (students, chaperones & shadow).",
    out: {
      meta: "SHS arrival 06:30 · Depart SHS 07:00 (Jun 9) · Arrive Haneda (HND) Terminal 3", escort: "Bus 1 Shota Tanaka · Bus 2 Ai Ogawa · Bus 3 Morio Onda (Shadow)",
      legs: [{ no: "UA875", airline: "United", from: "San Francisco (SFO)", to: "Tokyo Haneda (HND)", dep: "10:55 · Jun 9", arr: "13:55 · Jun 10" }]
    },
    ret: {
      meta: "Students & Chaperones: board 11:00, depart 11:30 · Shadow: board 10:45, depart 11:00 · for Haneda T3", escort: "Shota Tanaka & Ai Ogawa (Students/Chaperones) · Morio Onda (Shadow)",
      legs: [{ no: "UA876", airline: "United", from: "Tokyo Haneda (HND)", to: "San Francisco (SFO)", dep: "15:50 · Jun 23", arr: "09:45 · Jun 23" }]
    }
  },
  {
    id: "D", menu: "ANA NH7 · SFO→Narita nonstop",
    who: "San Francisco → Tokyo Narita, nonstop (ANA). Buses shared with Group E.",
    out: {
      meta: "SHS arrival 07:30 · Depart SHS 08:00 (Jun 9) · Arrive Narita (NRT) Terminal 1", escort: "Bus 1 Yuta Kobayashi · Bus 2 Michiko Kikkawa (shared with Group E)",
      legs: [{ no: "NH7", airline: "ANA", from: "San Francisco (SFO)", to: "Tokyo Narita (NRT)", dep: "12:20 · Jun 9", arr: "15:25 · Jun 10" }]
    },
    ret: {
      meta: "Board 12:00, depart 12:30 for Narita T1 (shared with Group E)", escort: "Yuta Kobayashi & Michiko Kikkawa",
      legs: [{ no: "NH8", airline: "ANA", from: "Tokyo Narita (NRT)", to: "San Francisco (SFO)", dep: "17:00 · Jun 23", arr: "10:35 · Jun 23" }]
    }
  },
  {
    id: "E", menu: "United/ANA UA7949 · SFO→Narita nonstop",
    who: "San Francisco → Tokyo Narita, nonstop (United, operated by ANA). Buses shared with Group D.",
    out: {
      meta: "SHS arrival 07:30 · Depart SHS 08:00 (Jun 9) · Arrive Narita (NRT) Terminal 1 · SFO check-in with ANA", escort: "Bus 1 Yuta Kobayashi · Bus 2 Michiko Kikkawa (shared with Group D)",
      legs: [{ no: "UA7949", airline: "United (operated by ANA)", from: "San Francisco (SFO)", to: "Tokyo Narita (NRT)", dep: "12:20 · Jun 9", arr: "15:25 · Jun 10", note: "SFO check-in with ANA" }]
    },
    ret: {
      meta: "Board 12:00, depart 12:30 for Narita T1 (shared with Group D)", escort: "Yuta Kobayashi & Michiko Kikkawa",
      legs: [{ no: "UA7950", airline: "United (operated by ANA)", from: "Tokyo Narita (NRT)", to: "San Francisco (SFO)", dep: "17:00 · Jun 23", arr: "10:35 · Jun 23" }]
    }
  },
  {
    id: "F", menu: "United UA837 · SFO→Narita nonstop",
    who: "San Francisco → Tokyo Narita, nonstop (United).",
    out: {
      meta: "SHS arrival 07:30 · Depart SHS 08:00 (Jun 9) · Arrive Narita (NRT) Terminal 1", escort: "Narita arrival buses: Makiko Saeki, Keiko Kurimura, Fujiko Suzuki, Yumiko Komatsu (Shadow)",
      legs: [{ no: "UA837", airline: "United", from: "San Francisco (SFO)", to: "Tokyo Narita (NRT)", dep: "12:20 · Jun 9", arr: "14:55 · Jun 10" }]
    },
    ret: {
      meta: "Board 12:30, depart 13:00 for Narita T1", escort: "Bus 1 Keiko Kurimura · Bus 2 Fujiko Suzuki",
      legs: [{ no: "UA838", airline: "United", from: "Tokyo Narita (NRT)", to: "San Francisco (SFO)", dep: "17:05 · Jun 23", arr: "10:40 · Jun 23" }]
    }
  },
  {
    id: "G", menu: "United via LAX · SFO→Haneda · SHS Shadow",
    who: "San Francisco → Tokyo Haneda via Los Angeles (United). SHS Shadow Tour.",
    out: {
      meta: "SHS arrival 02:45 · Depart SHS 03:15 (Jun 9) · Arrive Haneda (HND) Terminal 3", escort: "Bus 1 Mieko Segawa · Bus 2 Yasushi Komatsu",
      legs: [{ no: "UA2127", airline: "United", from: "San Francisco (SFO)", to: "Los Angeles (LAX)", dep: "06:00 · Jun 9", arr: "07:40 · Jun 9" },
      { no: "UA39", airline: "United", from: "Los Angeles (LAX)", to: "Tokyo Haneda (HND)", dep: "11:55 · Jun 9", arr: "15:15 · Jun 10" }]
    },
    ret: {
      meta: "Board 14:00, depart 14:30 for Haneda T3", escort: "Bus 1 Mieko Segawa · Bus 2 Hisako Suzuki",
      legs: [{ no: "UA38", airline: "United", from: "Tokyo Haneda (HND)", to: "Los Angeles (LAX)", dep: "18:10 · Jun 23", arr: "12:30 · Jun 23" },
      { no: "UA233", airline: "United", from: "Los Angeles (LAX)", to: "San Francisco (SFO)", dep: "17:10 · Jun 23", arr: "18:38 · Jun 23" }]
    }
  },
  {
    id: "H", menu: "United via LAX · SFO→Narita · Choir & Shadow",
    who: "San Francisco → Tokyo Narita via Los Angeles (United). All Lynbrook & SHS Choir, Lynbrook & SHS Shadow.",
    out: {
      meta: "SHS arrival 02:45 · Depart SHS 03:15 (Jun 9) · Arrive Narita (NRT) Terminal 1", escort: "Narita arrival buses: Makiko Saeki, Keiko Kurimura, Fujiko Suzuki, Yumiko Komatsu (Shadow)",
      legs: [{ no: "UA2127", airline: "United", from: "San Francisco (SFO)", to: "Los Angeles (LAX)", dep: "06:00 · Jun 9", arr: "07:40 · Jun 9" },
      { no: "UA32", airline: "United", from: "Los Angeles (LAX)", to: "Tokyo Narita (NRT)", dep: "11:05 · Jun 9", arr: "14:15 · Jun 10" }]
    },
    ret: {
      meta: "Board 11:30, depart 11:45 for Narita T1", escort: "Bus 1 Makiko Saeki · Bus 2 Yumiko Komatsu",
      legs: [{ no: "UA33", airline: "United", from: "Tokyo Narita (NRT)", to: "Los Angeles (LAX)", dep: "16:45 · Jun 23", arr: "10:55 · Jun 23" },
      { no: "UA469", airline: "United", from: "Los Angeles (LAX)", to: "San Francisco (SFO)", dep: "13:25 · Jun 23", arr: "14:53 · Jun 23" }]
    }
  },
  {
    id: "I", menu: "Delta via Seattle · SFO→Haneda · SHS Shadow",
    who: "San Francisco → Tokyo Haneda via Seattle (Delta). SHS Shadow Tour — 28 travelers (2 join in Seattle).",
    out: {
      meta: "SHS arrival 02:45 · Depart SHS 03:15 (Jun 9) · Arrive Haneda (HND) Terminal 3 · 2 travelers join in Seattle", escort: "Hisako Suzuki (1 bus)",
      legs: [{ no: "DL2721", airline: "Delta", from: "San Francisco (SFO)", to: "Seattle (SEA)", dep: "06:05 · Jun 9", arr: "08:25 · Jun 9" },
      { no: "DL167", airline: "Delta", from: "Seattle (SEA)", to: "Tokyo Haneda (HND)", dep: "11:50 · Jun 9", arr: "14:15 · Jun 10" }]
    },
    ret: {
      meta: "Board 13:00, depart 13:30 for Haneda T3", escort: "Keiko Takeda (1 bus)",
      legs: [{ no: "DL8", airline: "Delta", from: "Tokyo Haneda (HND)", to: "Los Angeles (LAX)", dep: "16:35 · Jun 23", arr: "10:44 · Jun 23" },
      { no: "DL1559", airline: "Delta", from: "Los Angeles (LAX)", to: "San Francisco (SFO)", dep: "17:33 · Jun 23", arr: "18:58 · Jun 23" }]
    }
  }
];

/* ============================ BUSES ============================ */
/* Touring coaches are numbered 1–9 and stay with an ensemble for the whole
   tour: Buses 1–3 Orchestra, 4–7 Band, 8–9 Choir. Separate from ensemble
   selection and from the airport-transfer buses on arrival/return days.
   "id" is a stable internal value; "num" is the global number shown to users. */
const BUSES = [
  {
    id: "1", num: "1", grp: "orch", ensemble: "Orchestra (Symphony Orchestra)",
    desc: "Orchestra coach. Boards with the Orchestra group (Buses 1–3) each day. At the Narita arrival, jump seats on Buses 1–3 are also used."
  },
  {
    id: "2", num: "2", grp: "orch", ensemble: "Orchestra (Symphony Orchestra)",
    desc: "Orchestra coach. Boards with the Orchestra group (Buses 1–3) each day."
  },
  {
    id: "3", num: "3", grp: "orch", ensemble: "Orchestra (Symphony Orchestra)",
    desc: "Orchestra coach. Boards with the Orchestra group (Buses 1–3) each day."
  },
  {
    id: "4", num: "4", grp: "band", ensemble: "Band (Symphonic Wind Ensemble)",
    desc: "Band coach. Boards with the Band group (Buses 4–7). On Day 3, Buses 4–5 take the 10:00 Tokyo Skytree entry."
  },
  {
    id: "5", num: "5", grp: "band", ensemble: "Band (Symphonic Wind Ensemble)",
    desc: "Band coach. Boards with the Band group (Buses 4–7). On Day 3, Buses 4–5 take the 10:00 Tokyo Skytree entry."
  },
  {
    id: "6", num: "6", grp: "band", ensemble: "Band (Symphonic Wind Ensemble)",
    desc: "Band coach. Boards with the Band group (Buses 4–7). On Day 3, Buses 6–7 take the 10:15 Tokyo Skytree entry."
  },
  {
    id: "7", num: "7", grp: "band", ensemble: "Band (Symphonic Wind Ensemble)",
    desc: "Band coach. Boards with the Band group (Buses 4–7). On Day 3, Buses 6–7 take the 10:15 Tokyo Skytree entry."
  },
  {
    id: "8", num: "8", grp: "choir", ensemble: "Choir (SHS & LHS Combined Choir)",
    desc: "Choir coach. Boards with the Choir group (Buses 8–9) each day."
  },
  {
    id: "9", num: "9", grp: "choir", ensemble: "Choir (SHS & LHS Combined Choir)",
    desc: "Choir coach. Boards with the Choir group (Buses 8–9) each day."
  }
];


/* ---- exports for the React app ---- */
export {
  TRIP, EMERGENCY, GROUPS, ALL, PERF, BO, CH,
  ATTIRE, DAYS, SHG, SBO, SCH, SHADOW_DAYS, SHADOW_ATTIRE,
  CITIES, FLIGHTS, BUSES
};
