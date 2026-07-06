import type { PortfolioContent } from "./content";

export const en: PortfolioContent = {
  meta: {
    title: "Maximiliano Vallejo — Full Stack Developer",
    description:
      "Professional portfolio of Maximiliano Vallejo. Full Stack Developer with a background in volunteering, industry, technology, and trades.",
    author: "Maximiliano Vallejo",
    siteUrl: "https://maximilianovallejo-dev.vercel.app",
  },

  hero: {
    greeting: "Hi, I'm",
    name: "Maximiliano Vallejo",
    subtitle: "Full Stack Developer",
    quadrantLabels: [
      "Volunteering",
      "Industry",
      "Technology",
      "Trades",
    ],
  },

  about: {
    paragraphs: [
      "I'm a self-taught full stack developer with a background that doesn't follow the typical path. For 3 years I've been building complete web applications — from design to deploy — applying clean architecture, best practices, and iterative development. My differentiator: I use AI tools strategically with spec-driven development, model evaluation, and context optimization.",
      "I currently work as IT Support and Security at Poder Judicial de Tucumán, where I configure networks, monitor threats, and manage incidents. In parallel, I keep building full stack projects with React, Node.js, Express, and PostgreSQL.",
      "Before software, I spent over 10 years in industrial manufacturing designing and building automated industrial machinery with Siemens LOGO!8 PLCs — potato harvesters, endless saws, brick-making machines. I also ran my own venture Emme 3D with 10 simultaneous 3D printers, and coordinated sales, rental, and logistics of construction machinery. That combination of trades, industry, and technology gives me a unique perspective to solve real problems with code.",
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
        { name: "Failure Diagnosis", icon: "search" },
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
      repoUrl: "https://github.com/MaximilianoVallejo1991/stock-controll-main",
      screenshot: "https://picsum.photos/seed/stock-control/800/450",
    },
    {
      slug: "elianapp",
      title: "ElianApp",
      description:
        "Shared expense tracking app: each person reports their own items, the system validates and balances. Supports equal, percentage, and exact splitting per participant.",
      techTags: ["React 19", "Express 5", "Prisma 7", "PostgreSQL", "JWT"],
      liveUrl: "https://elian-app-frontend.vercel.app",
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

  experience: [
    {
      trackKey: "voluntariado",
      trackLabel: "Volunteering & Leadership",
      heroImage: "https://picsum.photos/seed/voluntariado/800/400",
      milestones: [
        {
          year: "2003-2023",
          title: "Scout Leader — Grupo Scout San Cayetano",
          description:
            "20 years of leadership in the scout movement. Team coordination, camp planning, community project management, and youth leader training.",
          photoUrl: "https://picsum.photos/seed/scout1/200/200",
        },
        {
          year: "2015-2023",
          title: "Group Leader — Scouts de Argentina",
          description:
            "Led the local scout group. Responsible for administrative management, leader training, and institutional representation before the community.",
        },
        {
          year: "2018-2022",
          title: "Community Service Project Coordinator",
          description:
            "Led community service initiatives: food drives, emergency housing construction, and educational programs in rural areas.",
          photoUrl: "https://picsum.photos/seed/scout2/200/200",
        },
        {
          year: "2019-2023",
          title: "Site Guide — Aconquija National Park",
          description:
            "Certified guide for the National Parks Administration at Aconquija National Park, Tucumán province. Environmental interpretation, mountain safety, visitor assistance, and natural heritage conservation.",
          photoUrl: "https://picsum.photos/seed/aconquija/200/200",
        },
      ],
    },
    {
      trackKey: "industria",
      trackLabel: "Industry & Mechanics",
      heroImage: "https://picsum.photos/seed/industria/800/400",
      milestones: [
        {
          year: "2009 - 2020",
          title: "Mechanical Technician — Machine Shop",
          description:
            "Over 10 years repairing, designing, and fabricating industrial machinery — trucks, road machinery, potato harvesters, endless saws, brick-making machines (simple and PLC-automated). Part drafting using 3D modeling tools. PLC Siemens LOGO!8 programming for cutting automation in brick machines, integrating pneumatic systems. Project planning and execution for sugar, brick, and agricultural industries.",
          photoUrl: "https://picsum.photos/seed/mecanica1/200/200",
        },
        {
          year: "2017 - 2022",
          title: "Sales, Rental & Logistics Coordinator — Ladrillos Macizos Concepción",
          description:
            "Commercialized the machines designed and built in the workshop — brick machines, saws, potato harvesters — plus the bricks produced by them. Sales and rental management with included technical support. Responsible for collections and contract administration. Delivery logistics coordination ensuring timely supply to construction sites.",
          photoUrl: "https://picsum.photos/seed/parque1/200/200",
        },
      ],
    },
    {
      trackKey: "tech",
      trackLabel: "Technology & Development",
      heroImage: "https://picsum.photos/seed/tech/800/400",
      milestones: [
        {
          year: "2023 - Present",
          title: "Full Stack Developer — Personal Projects",
          description:
            "I build complete web applications from design to deploy, applying good architecture practices, testing, and iterative development. Main stack: React, TypeScript, Node.js, Express, Prisma, PostgreSQL. Featured projects: Stock Control (POS and inventory with dynamic discounts), ElianApp (shared expenses with equal, percentage, and exact splitting), Countdown to Christmas (country-filterable countdown).",
          photoUrl: "https://picsum.photos/seed/code1/200/200",
        },
        {
          year: "2022 - Present",
          title: "IT Support & Security — Poder Judicial de Tucumán",
          description:
            "Configuration and maintenance of internet and intranet networks, ensuring optimal operation according to organizational standards. Security console supervision, threat monitoring, and preventive measures. Report preparation on security status and equipment performance. Development of action plans for problem resolution.",
          photoUrl: "https://picsum.photos/seed/pjudicial/200/200",
        },
      ],
    },
    {
      trackKey: "oficios",
      trackLabel: "Trades & Ventures",
      heroImage: "https://picsum.photos/seed/oficios/800/400",
      milestones: [
        {
          year: "2020 - 2022",
          title: "Owner — Emme 3D",
          description:
            "Scaled the venture to 10 simultaneous 3D printers, managing maintenance, supplies, deliveries, and customer service. Industrial design and manufacturing of customized products through 3D modeling. Design of specialized parts for Tucumán industry machinery. Complete management from concept to final delivery.",
          photoUrl: "https://picsum.photos/seed/carpinteria/200/200",
        },
      ],
    },
  ],

  certifications: [
    {
      category: "Formal",
      categoryKey: "formal",
      items: [
        {
          title: "Software Development Technician",
          issuer: "Technical Institute — Tucumán",
          year: "2023",
        },
        {
          title: "High School Diploma — Natural Sciences",
          issuer: "National High School — Tucumán",
          year: "2011",
          pdfUrl: "/pdfs/titulo-bachiller.pdf",
        },
      ],
    },
    {
      category: "Technical",
      categoryKey: "tecnica",
      items: [
        {
          title: "QA Testing — Manual & Automation",
          issuer: "UTN — Tucumán Regional Faculty",
          year: "2024",
          pdfUrl: "/pdfs/cert-qa-utn.pdf",
        },
        {
          title: "Full Stack Web Development",
          issuer: "Platzi",
          year: "2023",
        },
        {
          title: "Advanced React — Patterns & Architecture",
          issuer: "Frontend Masters",
          year: "2024",
        },
        {
          title: "TypeScript: Zero to Expert",
          issuer: "Fernando Herrera — Udemy",
          year: "2024",
        },
        {
          title: "Docker & Containers for Developers",
          issuer: "KodeKloud",
          year: "2024",
        },
        {
          title: "Node.js: REST API with TypeScript & PostgreSQL",
          issuer: "DevTalles",
          year: "2025",
        },
      ],
    },
    {
      category: "Extracurricular",
      categoryKey: "extracurricular",
      items: [
        {
          title: "Leadership & Team Management",
          issuer: "Scouts de Argentina",
          year: "2015",
        },
        {
          title: "First Aid & CPR",
          issuer: "Argentine Red Cross",
          year: "2022",
        },
        {
          title: "Advanced Trekking Guide",
          issuer: "Los Alerces National Park",
          year: "2020",
          pdfUrl: "/pdfs/guia-trekking.pdf",
        },
        {
          title: "Industrial Safety & Hygiene",
          issuer: "Superintendency of Occupational Risks",
          year: "2018",
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
    { href: "#experience", label: "Experience" },
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
