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
      title: "Lorem Ipsum Dolor",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      techTags: ["Lorem", "Ipsum", "Dolor", "Sit"],
      liveUrl: "https://stockdetienda.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/stock-controll-main",
      screenshot: "https://picsum.photos/seed/stock-control/800/450",
    },
    {
      slug: "elianapp",
      title: "Consectetur Adipiscing",
      description:
        "Amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      techTags: ["Amet", "Consectetur", "Adipiscing", "Elit"],
      liveUrl: "https://elianapp.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/ElianApp",
      screenshot: "https://picsum.photos/seed/elianapp/800/450",
    },
    {
      slug: "countdown-christmas",
      title: "Sed Do Eiusmod",
      description:
        "Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      techTags: ["Tempor", "Incididunt", "Labore"],
      liveUrl: "https://tochristmas.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/CountdownToChristmas",
      screenshot: "https://picsum.photos/seed/christmas/800/450",
    },
  ],

  experience: [
    {
      trackKey: "voluntariado",
      trackLabel: "Lorem Ipsum Dolor Sit",
      heroImage: "https://picsum.photos/seed/voluntariado/800/400",
      milestones: [
        {
          year: "20XX",
          title: "Consectetur Adipiscing",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          photoUrl: "https://picsum.photos/seed/scout1/200/200",
        },
        {
          year: "20XX",
          title: "Sed Do Eiusmod Tempor",
          description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        {
          year: "20XX",
          title: "Incididunt Ut Labore",
          description:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          photoUrl: "https://picsum.photos/seed/scout2/200/200",
        },
        {
          year: "20XX",
          title: "Dolore Magna Aliqua",
          description:
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          photoUrl: "https://picsum.photos/seed/aconquija/200/200",
        },
      ],
    },
    {
      trackKey: "industria",
      trackLabel: "Amet Consectetur Elit",
      heroImage: "https://picsum.photos/seed/industria/800/400",
      milestones: [
        {
          year: "20XX",
          title: "Sed Ut Perspiciatis",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          photoUrl: "https://picsum.photos/seed/mecanica1/200/200",
        },
        {
          year: "20XX",
          title: "Unde Omnis Iste",
          description:
            "Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
          photoUrl: "https://picsum.photos/seed/parque1/200/200",
        },
      ],
    },
    {
      trackKey: "tech",
      trackLabel: "Eiusmod Tempor Incididunt",
      heroImage: "https://picsum.photos/seed/tech/800/400",
      milestones: [
        {
          year: "20XX",
          title: "At Vero Eos",
          description:
            "Et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
          photoUrl: "https://picsum.photos/seed/code1/200/200",
        },
        {
          year: "20XX",
          title: "Quas Molestias Excepturi",
          description:
            "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
          photoUrl: "https://picsum.photos/seed/pjudicial/200/200",
        },
      ],
    },
    {
      trackKey: "oficios",
      trackLabel: "Quis Autem Vel",
      heroImage: "https://picsum.photos/seed/oficios/800/400",
      milestones: [
        {
          year: "20XX",
          title: "Eum Iure Reprehenderit",
          description:
            "Qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
          photoUrl: "https://picsum.photos/seed/carpinteria/200/200",
        },
      ],
    },
  ],

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
