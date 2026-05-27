// ============================================================
// PORTFOLIO CONFIG — Edit this file to customize everything!
// ============================================================
// Single source of truth for all portfolio content.
// Change text, links, colors — everything is here.

export const PORTFOLIO = {
  // ===== PERSONAL INFO =====
  name: 'Javier Zam',
  fullName: 'Javier Zam',
  tagline: 'Building things that (sometimes) work.',
  subtitle: 'Software Engineer · Cloud Enthusiast · Occasional Gamer',
  location: 'Jakarta, Indonesia',
  email: 'javier_zam@yahoo.co.id',
  resumeUrl: '#',

  // ===== SOCIAL LINKS =====
  socials: {
    github: 'https://github.com/JavierZam',
    linkedin: 'https://linkedin.com/in/javier-zam',
    twitter: '',
    instagram: 'http://instagram.com/pierre_zam',
  },

  // ===== HERO SECTION =====
  hero: {
    greeting: 'Hey, I\'m',
    description: 'I build backend systems, break things in production, and deploy to GCP at 3 AM. Currently into cloud infrastructure, distributed systems, and making UIs that don\'t hurt your eyes.',
    cta: 'See my work ↓',
    funFacts: [
      'Created by My Echo, My Shadow and Me',
      'Maybe try to type "Avie"',
      'Professional bug creator & fixer',
      'Living in Cloud World',
      '35+ repos on GitHub, most of them actually work',
    ],
    terminalLines: [
      '> initializing javier_brain.sh...',
      '> connecting to GCP instances...',
      '> Backend APIs built: 42',
      '> Cloud Run deployments: 156',
      '> Bugs fixed in production: 9,001',
      '> Server uptime guaranteed: 99.99%',
      '> Coffee level: Critical. Need refill.',
      '> System ready.'
    ],
  },

  // ===== ABOUT SECTION =====
  about: {
    title: 'About Me',
    bio: `I'm a software engineer from Jakarta who loves building things with code. Started with "Hello World" in college, now I'm here deploying cloud architectures and integrating payment gateways.\n\nI specialize in backend development (Golang is my go-to), cloud infrastructure on GCP, and full-stack development. Graduated from Gunadarma University with a 3.72 GPA and a Certificate of Competence in Programming. When I'm not coding, I'm probably gaming or convincing myself "I'll refactor this later."`,
    skills: [
      { category: 'Languages', items: ['Golang', 'JavaScript', 'TypeScript', 'Python', 'Kotlin'] },
      { category: 'Frontend', items: ['React', 'Vue.js', 'HTML & CSS', 'TailwindCSS'] },
      { category: 'Backend', items: ['Echo', 'Node.js', 'Express', 'FastAPI'] },
      { category: 'Cloud & DevOps', items: ['GCP', 'Firebase', 'Cloud Run', 'Cloud Build', 'Docker', 'CI/CD'] },
      { category: 'Database', items: ['PostgreSQL', 'Firestore', 'MongoDB', 'Redis'] },
      { category: 'Mobile', items: ['Kotlin', 'Android Studio'] },
    ],
    statsLabel: 'Quick Stats',
    stats: [
      { label: 'Mendoan Consumed', value: 'A lot' },
      { label: 'GitHub Repos', value: '35+' },
      { label: 'Bugs Created', value: 'Countless' },
      { label: 'Bugs Fixed', value: 'Most of them?' },
    ],
    radarStats: [
      { subject: 'Backend (Go/Node)', A: 95, fullMark: 100 },
      { subject: 'Cloud (GCP/Docker)', A: 90, fullMark: 100 },
      { subject: 'Frontend (React/Vue)', A: 80, fullMark: 100 },
      { subject: 'Debugging Speed', A: 88, fullMark: 100 },
      { subject: 'StackOverflowing', A: 100, fullMark: 100 },
    ]
  },

  // ===== EXPERIENCE SECTION =====
  experience: {
    title: 'Experience',
    subtitle: 'Where I\'ve been writing code and breaking things',
    items: [
      {
        title: 'Software Developer',
        company: 'PT Bisnis Adviz Solusi',
        period: '2025 – Present',
        description: 'Building backend APIs and full-stack web/mobile apps. Architecting deployment environments on GCP, designing databases (PostgreSQL, Firestore), establishing CI/CD pipelines (GitHub Actions, Cloud Build), and containerizing with Docker.',
        tags: ['Golang', 'Node.js', 'React', 'GCP', 'Docker', 'CI/CD'],
        type: 'work' as const,
      },
      {
        title: 'Backend, Frontend, DevOps & Cloud Engineer',
        company: 'Freelance',
        period: '2023 – Present',
        description: 'Building backend services, web apps, and Android apps for clients. Highlights include Pasargamex (game marketplace with chat, transactions, inventory) and Pos Sehat Admin (health post management). Somehow everything runs in production.',
        tags: ['Golang', 'React', 'GCP', 'Firebase', 'PostgreSQL', 'Docker'],
        type: 'work' as const,
      },
      {
        title: 'Fullstack Developer',
        company: 'PT Generasi Anak Muda Berkarya (HiColleagues)',
        period: 'Jul 2023 – Jan 2024',
        description: 'Built backend APIs with Golang + Echo, frontend with Vue.js, designed database schemas, documented APIs with Swagger, integrated payment gateways, and built a Telegram bot for buyer notifications. The CRM is still commercially used today.',
        tags: ['Golang', 'Echo', 'Vue.js', 'Swagger', 'Payment Gateway'],
        type: 'work' as const,
      },
      {
        title: 'Cloud Computing Cohort',
        company: 'Bangkit Academy (Google)',
        period: 'Feb 2023 – Jul 2023',
        description: 'Graduated with distinction. Built APIs using Node.js and FastAPI connected to ML models. Designed cloud architecture on GCP — Cloud Build, Cloud Run, Cloud Scheduler, Cloud Storage, Firestore.',
        tags: ['GCP', 'Node.js', 'FastAPI', 'Cloud Run', 'Cloud Build', 'ML'],
        type: 'work' as const,
      },
      {
        title: 'B.Sc. Informatic Engineering',
        company: 'Gunadarma University',
        period: '2020 – 2024',
        description: 'GPA 3.72. Learned data structures, algorithms, and the art of submitting assignments 5 minutes before deadline. Also earned a Certificate of Competence in Programming from BNSP.',
        tags: ['Algorithms', 'Data Structures', 'OS', 'Networking', 'GPA 3.72'],
        type: 'education' as const,
      },
    ],
  },

  // ===== PROJECTS SECTION =====
  projects: {
    title: 'Projects',
    subtitle: 'Stuff I built instead of sleeping',
    items: [
      {
        title: 'PayViz',
        description: 'Enterprise payroll management system handling Rp 100M+ monthly. Features include employee salary management with BPJS & PPh 21 tax automation, payroll period processing, payslip generation, Gross Up method support, Excel import, PDF export, and Coretax integration.',
        tags: ['Vue.js', 'Node.js', 'PostgreSQL', 'Enterprise', 'Payroll'],
        image: '/projects/payviz.png',
        github: '',
        demo: 'https://payviz.adviz.id',
        featured: true,
      },
      {
        title: 'Pasargamex',
        description: 'Online game marketplace with real-time chat, transactions, inventory, and file uploads. Full-stack from backend to frontend deployed on GCP.',
        tags: ['Golang', 'React', 'TailwindCSS', 'GCP', 'Firebase'],
        image: '/projects/pasargamex.png',
        github: 'https://github.com/JavierZam/pasargamex',
        demo: '',
        featured: true,
      },
      {
        title: 'Trackori',
        description: 'Calorie tracking app with ML-powered food recognition. Built the backend, cloud infra, and helped with Android. Retrained the ML model regularly.',
        tags: ['GCP', 'Cloud Run', 'Node.js', 'FastAPI', 'ML'],
        image: '/projects/trackori.png',
        github: 'https://github.com/JavierZam/trackori-api',
        demo: '',
        featured: true,
      },
      {
        title: 'HiColleagues CRM',
        description: 'Commercially used CRM system. Still operated by HiColleagues admins today.',
        tags: ['Golang', 'Echo', 'Vue.js', 'PostgreSQL'],
        image: '',
        github: '',
        demo: '',
        featured: false,
      },
      {
        title: 'Pos Sehat Admin',
        description: 'Android app for health posts — patient records, medical history, medicine inventory tracking.',
        tags: ['Node.js', 'PostgreSQL', 'GCP', 'Kotlin'],
        image: '',
        github: 'https://github.com/JavierZam/possehat-backend-api',
        demo: '',
        featured: false,
      },
      {
        title: 'WebSocket Chat',
        description: 'Real-time chat with WebSocket and PostgreSQL. Clean architecture because why not.',
        tags: ['Golang', 'WebSocket', 'PostgreSQL'],
        image: '',
        github: 'https://github.com/JavierZam/websocket-chat-pgx',
        demo: '',
        featured: false,
      },
      {
        title: 'This Portfolio',
        description: 'The website you\'re looking at. Yes, I spent way too much time on it.',
        tags: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
        image: '',
        github: 'https://github.com/JavierZam/portofolio',
        demo: '',
        featured: false,
      },
    ],
  },

  // ===== SECRET GAMING SECTION =====
  // Hidden behind clicking the gamepad icon 5 times
  // To add game images: put them in public/games/ folder
  // then update the 'image' field below (e.g. '/games/valorant.png')
  gaming: {
    title: 'Secret Gaming Stats',
    subtitle: 'You found it. Here\'s what I do when I\'m not deploying to prod.',
    unlockHint: 'Try clicking the gamepad icon a few times.',
    gamertags: 'IGN: Erteem / Avie',
    ranks: [
      {
        game: 'Valorant',
        rank: 'Casual (Plat)',
        image: '/games/valorant.png',   // <-- drop your image in public/games/
        peak: 'Radiant',
        hours: '1,000+',
        note: '1 Seconds as a Radiant, Never touch the game again for years',
        account: 'Tugus #001',
      },
      {
        game: 'Mobile Legends',
        rank: 'Mythic Immortal',
        image: '/games/mlbb.png',
        peak: 'Mythic Immortal',
        hours: '8,000+ matches',
        note: 'World Collector Skins, God Laner',
        account: 'ID: 180444341 (Erteem)',
      },
      {
        game: 'Apex Legends',
        rank: 'Casual (Gold)',
        image: '/games/apex.png',
        peak: 'Master',
        hours: '1,000+',
        note: 'Used to grind ranked, now I land hot and die',
        account: 'Steam: voicevier',
      },
      {
        game: 'CS2',
        rank: 'Premier 22,000',
        image: '/games/cs2.png',
        peak: 'Global Elite / Faceit Lv 9',
        hours: '1,000+',
        note: 'The game that started it all',
        account: 'Steam: vierteem',
      },
      {
        game: 'Marvel Rivals',
        rank: 'Gold (Casual)',
        image: '/games/marvel-rivals.png',
        peak: 'Grandmaster',
        hours: '500+',
        note: 'Hela god, CnD Lord, BP main',
        account: 'Steam: vierteem',
      },
      {
        game: 'Honor of Kings',
        rank: 'Uninstalled',
        image: '/games/hok.png',
        peak: 'Grandmaster Legend',
        hours: '???',
        note: 'Rage quit for good. Or did I?',
        account: 'Erteem',
      },
      {
        game: 'Deadlock',
        rank: 'Unranked (22 matches)',
        image: '/games/deadlock.png',
        peak: 'N/A — 28 matches to go',
        hours: 'New',
        note: 'Current obsession. Send help.',
        account: 'Steam: voicevier',
      },
    ],
    steamLinks: [
      { label: 'Main Steam (Deadlock, Apex)', url: 'https://steamcommunity.com/id/voicevier/' },
      { label: 'Second Steam (CS2, Marvel Rivals)', url: 'https://steamcommunity.com/id/vierteem/' },
    ],
  },

  // ===== GUESTBOOK SECTION =====
  guestbook: {
    title: 'Guestbook',
    subtitle: 'Leave a message, say hi, or roast my code. I can take it.',
    placeholder: 'Say something nice (or roast my code)...',
    namePlaceholder: 'Anonymous Hero',
  },

  // ===== FOOTER =====
  footer: {
    text: 'Built with mendoan, late-night deploys, and questionable life choices.',
    year: new Date().getFullYear(),
  },

  // ===== NBA HALL OF FAME =====
  nba: {
    title: 'NBA Holographic Archive',
    subtitle: 'My favorite players, stats, and records in a high-tech dashboard.',
    players: [
      {
        id: 'jordan',
        name: 'Michael Jordan',
        fullName: 'Michael Jeffrey Jordan',
        nickname: 'Air Jordan / The Black Cat',
        jersey: '#23',
        position: 'Shooting Guard',
        team: 'Chicago Bulls',
        careerStats: { ppg: 30.1, rpg: 6.2, apg: 5.3, spg: 2.3, bpg: 0.8, rings: 6 },
        achievements: ['6x NBA Champion', '6x Finals MVP', '5x NBA MVP', '1x DPOY (1988)', '10x Scoring Champion', '9x All-Defensive First Team'],
        skills: [
          { subject: 'Scoring', A: 99, B: 0, fullMark: 100 },
          { subject: 'Defense', A: 98, B: 0, fullMark: 100 },
          { subject: 'Playmaking', A: 88, B: 0, fullMark: 100 },
          { subject: 'Clutch', A: 99, B: 0, fullMark: 100 },
          { subject: 'Athleticism', A: 99, B: 0, fullMark: 100 },
          { subject: 'Shooting', A: 85, B: 0, fullMark: 100 }
        ],
        colorTheme: 'from-red-600 to-black',
        accentColor: '#dc2626',
        quote: "I've failed over and over and over again in my life. And that is why I succeed.",
        funFact: "Undefeated in the NBA Finals (6-0) and never let a series go to a Game 7.",
        imageUrl: '/nba/jordan.png'
      },
      {
        id: 'lebron',
        name: 'LeBron James',
        fullName: 'LeBron Raymone James Sr.',
        nickname: 'King James / The Chosen One',
        jersey: '#23 / #6',
        position: 'Small Forward / Power Forward',
        team: 'Los Angeles Lakers',
        careerStats: { ppg: 27.1, rpg: 7.5, apg: 7.4, spg: 1.5, bpg: 0.7, rings: 4 },
        achievements: ['4x NBA Champion', '4x Finals MVP', '4x NBA MVP', 'All-Time Scoring Leader', '20x All-NBA Selection', '20x NBA All-Star'],
        skills: [
          { subject: 'Scoring', A: 97, B: 0, fullMark: 100 },
          { subject: 'Defense', A: 90, B: 0, fullMark: 100 },
          { subject: 'Playmaking', A: 98, B: 0, fullMark: 100 },
          { subject: 'Clutch', A: 95, B: 0, fullMark: 100 },
          { subject: 'Athleticism', A: 98, B: 0, fullMark: 100 },
          { subject: 'Shooting', A: 88, B: 0, fullMark: 100 }
        ],
        colorTheme: 'from-purple-600 to-yellow-500',
        accentColor: '#eab308',
        quote: "I like criticism. It makes you strong.",
        funFact: "The only player in NBA history to record 40,000+ points, 10,000+ rebounds, and 10,000+ assists.",
        imageUrl: '/nba/lebron.png'
      },
      {
        id: 'kobe',
        name: 'Kobe Bryant',
        fullName: 'Kobe Bean Bryant',
        nickname: 'The Black Mamba',
        jersey: '#8 / #24',
        position: 'Shooting Guard',
        team: 'Los Angeles Lakers',
        careerStats: { ppg: 25.0, rpg: 5.2, apg: 4.7, spg: 1.4, bpg: 0.5, rings: 5 },
        achievements: ['5x NBA Champion', '2x Finals MVP', '1x NBA MVP (2008)', '18x All-Star', '12x All-Defensive Team', '2x Scoring Champion'],
        skills: [
          { subject: 'Scoring', A: 98, B: 0, fullMark: 100 },
          { subject: 'Defense', A: 95, B: 0, fullMark: 100 },
          { subject: 'Playmaking', A: 85, B: 0, fullMark: 100 },
          { subject: 'Clutch', A: 98, B: 0, fullMark: 100 },
          { subject: 'Athleticism', A: 95, B: 0, fullMark: 100 },
          { subject: 'Shooting', A: 86, B: 0, fullMark: 100 }
        ],
        colorTheme: 'from-yellow-500 via-purple-700 to-purple-900',
        accentColor: '#8b5cf6',
        quote: "Mamba Mentality is all about focusing on the process and trusting in the hard work.",
        funFact: "Scored 81 points in a single game against the Raptors in 2006, the 2nd highest in NBA history.",
        imageUrl: '/nba/kobe.png'
      },
      {
        id: 'iverson',
        name: 'Allen Iverson',
        fullName: 'Allen Ezail Iverson',
        nickname: 'The Answer / A.I.',
        jersey: '#3',
        position: 'Point Guard / Shooting Guard',
        team: 'Philadelphia 76ers',
        careerStats: { ppg: 26.7, rpg: 3.7, apg: 6.2, spg: 2.2, bpg: 0.2, rings: 0 },
        achievements: ['1x NBA MVP (2001)', '11x NBA All-Star', '4x Scoring Champion', '3x Steals Leader', 'Rookie of the Year (1997)', 'Hall of Fame (2016)'],
        skills: [
          { subject: 'Scoring', A: 94, B: 0, fullMark: 100 },
          { subject: 'Defense', A: 80, B: 0, fullMark: 100 },
          { subject: 'Playmaking', A: 88, B: 0, fullMark: 100 },
          { subject: 'Clutch', A: 92, B: 0, fullMark: 100 },
          { subject: 'Athleticism', A: 96, B: 0, fullMark: 100 },
          { subject: 'Shooting', A: 78, B: 0, fullMark: 100 }
        ],
        colorTheme: 'from-blue-600 via-white to-red-600',
        accentColor: '#2563eb',
        quote: "I don't want to be another Jordan or Magic. I want to be Allen Iverson.",
        funFact: "Famously crossed over Michael Jordan during his rookie season and led the league in steals 3 years in a row.",
        imageUrl: '/nba/iverson.png'
      },
      {
        id: 'curry',
        name: 'Stephen Curry',
        fullName: 'Wardell Stephen Curry II',
        nickname: 'The Chef / Baby-Faced Assassin',
        jersey: '#30',
        position: 'Point Guard',
        team: 'Golden State Warriors',
        careerStats: { ppg: 24.8, rpg: 4.7, apg: 6.4, spg: 1.5, bpg: 0.2, rings: 4 },
        achievements: ['4x NBA Champion', '2x NBA MVP', '1x Finals MVP', 'All-Time 3-Point Leader', 'Only Unanimous MVP (2016)', '2x Scoring Champion'],
        skills: [
          { subject: 'Scoring', A: 95, B: 0, fullMark: 100 },
          { subject: 'Defense', A: 75, B: 0, fullMark: 100 },
          { subject: 'Playmaking', A: 92, B: 0, fullMark: 100 },
          { subject: 'Clutch', A: 96, B: 0, fullMark: 100 },
          { subject: 'Athleticism', A: 80, B: 0, fullMark: 100 },
          { subject: 'Shooting', A: 99, B: 0, fullMark: 100 }
        ],
        colorTheme: 'from-blue-500 to-yellow-400',
        accentColor: '#3b82f6',
        quote: "Success is not an accident, success is a choice.",
        funFact: "Holds the record for the most 3-pointers made in a single season (402 in 2015-16).",
        imageUrl: '/nba/curry.png'
      },
      {
        id: 'wemby',
        name: 'Victor Wembanyama',
        fullName: 'Victor Wembanyama',
        nickname: 'The Alien / Wemby',
        jersey: '#1',
        position: 'Power Forward / Center',
        team: 'San Antonio Spurs',
        careerStats: { ppg: 21.4, rpg: 10.6, apg: 3.9, spg: 1.2, bpg: 3.6, rings: 0 },
        achievements: ['Rookie of the Year (2024)', 'NBA All-Defensive First Team', 'NBA Blocks Leader (2024)', '1x Olympic Silver Medalist'],
        skills: [
          { subject: 'Scoring', A: 88, B: 0, fullMark: 100 },
          { subject: 'Defense', A: 99, B: 0, fullMark: 100 },
          { subject: 'Playmaking', A: 80, B: 0, fullMark: 100 },
          { subject: 'Clutch', A: 85, B: 0, fullMark: 100 },
          { subject: 'Athleticism', A: 95, B: 0, fullMark: 100 },
          { subject: 'Shooting', A: 82, B: 0, fullMark: 100 }
        ],
        colorTheme: 'from-gray-700 to-black',
        accentColor: '#6b7280',
        quote: "I want to be myself, not what others want me to be.",
        funFact: "At 7'4\" with an 8-foot wingspan, he can touch the rim standing on his tiptoes and block 3-point shots with ease.",
        imageUrl: '/nba/wemby.png'
      }
    ]
  },

  // ===== THEME CUSTOMIZATION =====
  theme: {
    accentColor: '#7c3aed',
    accentLight: '#a78bfa',
    neonGreen: '#39ff14',
    neonPink: '#ff6ec7',
    neonCyan: '#00fff7',
  },
}

export type PortfolioConfig = typeof PORTFOLIO
