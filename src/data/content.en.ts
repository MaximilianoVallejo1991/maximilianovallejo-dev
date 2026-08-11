import type { PortfolioContent } from "./content";

export const en: PortfolioContent = {
  meta: {
    title: "Maximiliano Vallejo — Full Stack Developer",
    description:
      "Professional portfolio of Maximiliano Vallejo. Site under construction, full content coming soon.",
    author: "Maximiliano Vallejo",
    siteUrl: "https://maximilianovallejo-dev.vercel.app",
  },

  construction: {
    label: "Under construction",
    message: "This portfolio is under construction. Full content will be available soon. Follow me on LinkedIn:",
  },

  hero: {
    greeting: "Hi, I'm",
    name: "Maximiliano Vallejo",
    subtitle: "Full Stack Developer",
    nodes: [
      "Coordination & Leadership",
      "Team Dynamics",
      "Real Problem Solving",
      "Software Engineering",
      "Technical Knowledge",
    ],
    mobileGreeting: "Hi, I'm",
    mobileName: "Maxi Vallejo",
    mobileSubtitle: "Full Stack Dev",
  },

  about: {
    paragraphs: [
      "I didn't arrive at software through a traditional path. For over 10 years I worked alongside my father in a metalworking shop, manufacturing and repairing machinery. In the early years of that period, I studied Engineering and completed the core curriculum. That's how I learned to work in teams, use logic to solve problems, and stay in search of new challenges.",

      "Integrating automation with Ladder diagrams and PLCs in the shop sparked a curiosity that led me into the world of 3D printing. My venture, Emme 3D, grew to have 10 printers running simultaneously — hours and hours in front of the PC, preparing me for what was next.",

      "That's when web development appeared. I took the first stage of Argentina Programa, a QA Testing course, and then kept studying on my own. Along the way, a position at Poder Judicial de Tucumán came up, and since I had solid computer skills, they placed me in IT. I currently work there in the mornings in IT Support and Security, and in the afternoons I keep taking courses, programming, and training as a developer.",

      "Today I'm capable of building complete full-stack applications with React, Node.js, Express, and PostgreSQL. My differentiator: I use AI strategically — spec-driven development, model evaluation, and context optimization. It's not the typical path, but every step, from the workshop to code, gave me tools I want to apply in my next professional challenge.",
    ],
    mobileParagraphs: [
      "For over 10 years I worked alongside my father in a metalworking shop, manufacturing and repairing machinery. During the early years I studied Engineering and completed the core curriculum. There we integrated automation with Ladder diagrams and PLCs, which sparked the curiosity that led to my venture, Emme 3D, with over 10 printers running simultaneously.",

      "Web development soon followed. I took the first stage of Argentina Programa, a QA Testing course, and then kept studying on my own. Along the way, I landed a position in the IT office at Poder Judicial de Tucumán. I currently work there in the mornings in IT Support and Security, and in the afternoons I keep taking courses, programming, and training as a developer.",

      "Today I'm capable of building complete full-stack applications with React, Node.js, Express, and PostgreSQL. My differentiator: I use AI strategically — spec-driven development, model evaluation, and context optimization. It's not the typical path, but every step, from the workshop to code, gave me tools I want to apply in my next professional challenge.",
    ],
    photoUrl: "https://picsum.photos/seed/mv-portrait/400/400",
    photoAlt: "Portrait of Maximiliano Vallejo",
  },

  skills: [
    {
      category: "Frontend",
      categoryKey: "frontend",
      items: [
        { name: "React", icon: "react" },
        { name: "TypeScript", icon: "typescript" },
        { name: "Next.js", icon: "nextjs" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
        { name: "Astro", icon: "astro" },
        { name: "HTML / CSS", icon: "html" },
        { name: "JavaScript", icon: "javascript" },
      ],
    },
    {
      category: "Backend",
      categoryKey: "backend",
      items: [
        { name: "Node.js", icon: "nodejs" },
        { name: "Express", icon: "express" },
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "Prisma ORM", icon: "prisma" },
        { name: "MySQL", icon: "mysql" },
        { name: "REST APIs", icon: "api" },
        { name: "JWT", icon: "jwt" },
        { name: "Git / GitHub", icon: "git" },
      ],
    },
    {
      category: "Tools",
      categoryKey: "tools",
      items: [
        { name: "Docker", icon: "docker" },
        { name: "Linux", icon: "linux" },
        { name: "VS Code", icon: "vscode" },
        { name: "Figma", icon: "figma" },
        { name: "Vercel", icon: "vercel" },
        { name: "Vite", icon: "vite" },
        { name: "Postman", icon: "postman" },
      ],
    },
    {
      category: "Industrial",
      categoryKey: "industrial",
      items: [
        { name: "Industrial Mechanics", icon: "wrench" },
        { name: "Maintenance", icon: "settings" },
        { name: "Fault Diagnosis", icon: "search" },
        { name: "Workplace Safety", icon: "shield" },
      ],
    },
  ],

  projects: [
    {
      slug: "stock-control",
      title: "Stock Control",
      description:
        "Full inventory management and point-of-sale (POS) system with dynamic discount engine, real-time stock control, sales tracking, current accounts, and advanced statistical reports.",
      techTags: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "JWT"],
      liveUrl: "https://stockdetienda.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/stock-controll-main",
      screenshot: "https://picsum.photos/seed/stock-control/800/450",
    },
    {
      slug: "elianapp",
      title: "ElianApp",
      description:
        "Shared expense tracking app: each person reports their own items, the system validates and balances. Supports equal, percentage, and exact splitting per participant.",
      techTags: ["React 19", "Express 5", "Prisma 7", "PostgreSQL", "JWT"],
      liveUrl: "https://elianapp.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/ElianApp",
      screenshot: "https://picsum.photos/seed/elianapp/800/450",
    },
    {
      slug: "countdown-christmas",
      title: "Countdown to Christmas",
      description:
        "Search for your country and watch the countdown to Christmas and New Year. Lightweight project deployed on Vercel.",
      techTags: ["JavaScript", "HTML5", "CSS3", "Vercel"],
      liveUrl: "https://tochristmas.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/CountdownToChristmas",
      screenshot: "https://picsum.photos/seed/christmas/800/450",
    },
  ],

  experience: {
    branches: [
      {
        branchKey: "soft",
        branchLabel: "Soft Skills",
        accentKey: "soft",
        icon: "compass",
        milestones: [
          {
            year: "2008",
            title: "Scout",
            description: "My first school in teamwork and discipline.",
          },
          {
            year: "2015",
            title: "Scout Instructor",
            description:
              "Level II Instructor, training the next generation.",
          },
          {
            year: "2017",
            title: "Rover Leader Training",
            description:
              "Leadership and roverism training, \"El Umbral\" workshop.",
          },
          {
            year: "2020",
            title: "APN Guide",
            description:
              "Certified site guide at Aconquija National Park.",
          },
          {
            year: "2024",
            title: "Mountaineering Recognition",
            description:
              "Municipal recognition for my trajectory in mountaineering.",
          },
        ],
      },
      {
        branchKey: "trade",
        branchLabel: "Trade",
        accentKey: "trade",
        icon: "anvil",
        milestones: [
          {
            year: "2008",
            title: "Metalworking Shop",
            description:
              "Ten years alongside my father, building and repairing machinery.",
          },
          {
            year: "2017",
            title: "PLC",
            description:
              "Automation with Ladder logic and PLCs — my first contact with the logic of programming.",
          },
          {
            year: "2019",
            title: "Emme 3D",
            description:
              "My 3D printing venture. Grew to 10 printers running simultaneously.",
          },
          {
            year: "2022",
            title: "PJT Systems",
            description:
              "Joined the Systems office at the Tucumán Judiciary — my first formal job in tech.",
          },
        ],
      },
      {
        branchKey: "study",
        branchLabel: "Formal Education",
        accentKey: "study",
        icon: "graduation",
        milestones: [
          {
            year: "2007",
            title: "Electronics & Appliance Repair Technician",
            description: "My first technical degree.",
          },
          {
            year: "2009",
            title: "Construction Technician",
            description: "Technical training in construction.",
          },
          {
            year: "2010",
            title: "MMO (Master Builder)",
            description:
              "An extra year of tertiary-level training on top of high school.",
          },
          {
            year: "2011",
            title: "Chemical Engineering Core Curriculum",
            description:
              "Two years of Chemical Engineering — logic and rigor from day one.",
          },
          {
            year: "2021",
            title: "Argentina Programa",
            description:
              "First stage of Argentina Programa: #SéProgramar. My formal entry into code.",
          },
          {
            year: "2021–2022",
            title: "QA T.TEC Tucumán/UTN",
            description:
              "300-hour QA course, certified by UTN Facultad Regional Tucumán.",
          },
          {
            year: "Ongoing",
            title: "Continuous training",
            description:
              "Still learning: AI, new technologies, best practices.",
          },
        ],
      },
    ],
    convergenceLabel: "Full Stack Developer",
  },

  certifications: [
    {
      category: "Lorem",
      categoryKey: "formal",
      items: [
        {
          title: "Lorem Ipsum Dolor",
          issuer: "Sit Amet Consectetur",
          year: "20XX",
        },
        {
          title: "Adipiscing Elit",
          issuer: "Sed Do Eiusmod",
          year: "20XX",
        },
      ],
    },
    {
      category: "Ipsum",
      categoryKey: "tecnica",
      items: [
        {
          title: "Tempor Incididunt",
          issuer: "Ut Labore",
          year: "20XX",
        },
        {
          title: "Dolore Magna",
          issuer: "Aliqua Ut Enim",
          year: "20XX",
        },
        {
          title: "Ad Minam Veniam",
          issuer: "Quis Nostrud",
          year: "20XX",
        },
        {
          title: "Exercitation Ullamco",
          issuer: "Laboris Nisi",
          year: "20XX",
        },
        {
          title: "Aliquip Ex Ea",
          issuer: "Commodo Consequat",
          year: "20XX",
        },
        {
          title: "Duis Aute Irure",
          issuer: "Dolor In Reprehenderit",
          year: "20XX",
        },
      ],
    },
    {
      category: "Dolor",
      categoryKey: "extracurricular",
      items: [
        {
          title: "In Voluptate Velit",
          issuer: "Esse Cillum",
          year: "20XX",
        },
        {
          title: "Dolore Eu Fugiat",
          issuer: "Nulla Pariatur",
          year: "20XX",
        },
        {
          title: "Excepteur Sint",
          issuer: "Occaecat Cupidatat",
          year: "20XX",
        },
        {
          title: "Non Proident",
          issuer: "Sunt In Culpa",
          year: "20XX",
        },
      ],
    },
  ],

  contact: {
    email: "maximilianovallejo@gmail.com",
    linkedin: "https://www.linkedin.com/in/maximiliano-vallejo/",
    github: "https://github.com/MaximilianoVallejo1991",
    cta: "Let's work together?",
    linkLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
  },

  navLinks: [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Journey" },
    { href: "#certifications", label: "Certifications" },
    { href: "#contact", label: "Contact" },
  ],

  skipLink: "Skip to content",
  footerCredits: "Built with React, TypeScript, Tailwind CSS",
  footerBackToTop: "Back to top",
  navAriaLabel: "Main navigation",
  navOpenMenu: "Open menu",
  navCloseMenu: "Close menu",
};

export default en;
