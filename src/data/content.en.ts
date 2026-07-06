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
      "I'm a full stack developer with an unconventional background. For 20 years I led scout groups, managed teams, and coordinated community service projects. That experience taught me how to work with people, solve problems under pressure, and stay calm when things get complicated.",
      "Before writing code, I spent 11 years as an industrial mechanic and national park guide. I learned to diagnose failures, maintain critical systems, and pay attention to detail — skills I now apply when debugging an API or designing application architecture.",
      "Today I combine all of that with my self-taught and formal training in software development. I work with modern technologies from the JavaScript/TypeScript ecosystem, both frontend and backend, and I'm always learning something new. My profile isn't the typical one: I come from the trenches, from fixing machines and leading volunteers, and that mix gives me a unique perspective to build software that actually solves problems.",
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
        { name: "REST APIs", icon: "api" },
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
        "Full stack stock and inventory control system with authentication, user roles, admin dashboard, and exportable reports. Built with React, Node.js, and PostgreSQL.",
      techTags: ["React", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
      repoUrl: "https://github.com/maximilianovallejo/stock-control",
      screenshot: "https://picsum.photos/seed/stock-control/800/450",
    },
    {
      slug: "elianapp",
      title: "ElianApp",
      description:
        "Business management application with product catalog, shopping cart, integrated payments, and admin panel. Built with Next.js and TypeScript.",
      techTags: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS", "Stripe"],
      liveUrl: "https://elianapp.vercel.app",
      repoUrl: "https://github.com/maximilianovallejo/elianapp",
      screenshot: "https://picsum.photos/seed/elianapp/800/450",
    },
    {
      slug: "countdown-christmas",
      title: "Countdown to Christmas",
      description:
        "Interactive app with animated Christmas countdown. Includes visual themes, background music, and personalized messages. A creative and festive side project.",
      techTags: ["React", "TypeScript", "Framer Motion", "CSS Animations"],
      liveUrl: "https://countdown-christmas.vercel.app",
      repoUrl: "https://github.com/maximilianovallejo/countdown-christmas",
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
      ],
    },
    {
      trackKey: "industria",
      trackLabel: "Industry & Mechanics",
      heroImage: "https://picsum.photos/seed/industria/800/400",
      milestones: [
        {
          year: "2012-2023",
          title: "Industrial Mechanic — Ladrillera La Banda",
          description:
            "11 years in heavy industrial machinery maintenance and repair. Fault diagnosis, welding, lathe work, and critical spare parts management.",
          photoUrl: "https://picsum.photos/seed/mecanica1/200/200",
        },
        {
          year: "2019-2023",
          title: "National Park Guide — Los Alerces National Park",
          description:
            "Trekking and hiking guide at Los Alerces National Park. Environmental interpretation, mountain safety, and visitor assistance in English and Spanish.",
          photoUrl: "https://picsum.photos/seed/parque1/200/200",
        },
        {
          year: "2020-2022",
          title: "Production Operator — Laminados Industriales",
          description:
            "Quality control in a continuous production line. Industrial furnace operation and scheduled preventive maintenance.",
        },
      ],
    },
    {
      trackKey: "tech",
      trackLabel: "Technology & Development",
      heroImage: "https://picsum.photos/seed/tech/800/400",
      milestones: [
        {
          year: "2020-2026",
          title: "Self-Taught Full Stack Developer",
          description:
            "Self-taught training in web development. Studied JavaScript, React, Node.js, TypeScript, databases, and software architecture. Completed multiple personal projects and open source contributions.",
          photoUrl: "https://picsum.photos/seed/code1/200/200",
        },
        {
          year: "2022-2023",
          title: "IT Support — Poder Judicial de Tucumán",
          description:
            "Technical support in the systems department of the Judiciary. Help desk, hardware maintenance, software installation, and ticket management with GLPI.",
          photoUrl: "https://picsum.photos/seed/pjudicial/200/200",
        },
        {
          year: "2024-2025",
          title: "Technical Certifications",
          description:
            "Completed professional certifications in QA Testing (UTN), frontend development with React, and various JavaScript ecosystem technologies. Continuous learning through platforms like Platzi, freeCodeCamp, and Frontend Masters.",
        },
        {
          year: "2025-2026",
          title: "Freelance Projects & Portfolio",
          description:
            "Freelance project development and professional portfolio building. Focus on modern architectures, code best practices, and user experience.",
          photoUrl: "https://picsum.photos/seed/code2/200/200",
        },
      ],
    },
    {
      trackKey: "oficios",
      trackLabel: "Trades & Manual Skills",
      heroImage: "https://picsum.photos/seed/oficios/800/400",
      milestones: [
        {
          year: "2010-2023",
          title: "Welder & Lathe Operator",
          description:
            "Skills in electric and oxyacetylene welding, conventional lathe work, and basic CNC. Applied in repair projects and parts manufacturing.",
        },
        {
          year: "2015-2020",
          title: "Hobbyist Woodworker",
          description:
            "Woodworking projects: furniture, repairs, and restoration work. Experience with manual and power tools.",
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
    linkedin: "https://linkedin.com/in/maximilianovallejo",
    github: "https://github.com/maximilianovallejo",
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
