import { IMAGE_URLS, PROJECT_ASSETS, type PortfolioContent } from "./content";

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
    photoUrl: IMAGE_URLS.aboutPhoto,
    photoAlt: "Portrait of Maximiliano Vallejo",
  },

  skills: [
    {
      category: "Frontend",
      categoryKey: "frontend",
      items: [
        { name: "React", icon: "react" },
        { name: "TypeScript", icon: "typescript" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
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
      ...PROJECT_ASSETS.stockControl,
    },
    {
      slug: "elianapp",
      title: "ElianApp",
      description:
        "Shared expense tracking app: each person reports their own items, the system validates and balances. Supports equal, percentage, and exact splitting per participant.",
      techTags: ["React 19", "Express 5", "Prisma 7", "PostgreSQL", "JWT"],
      ...PROJECT_ASSETS.elianapp,
    },
    {
      slug: "countdown-christmas",
      title: "Countdown to Christmas",
      description:
        "Search for your country and watch the countdown to Christmas and New Year. Lightweight project deployed on Vercel.",
      techTags: ["JavaScript", "HTML5", "CSS3", "Vercel"],
      ...PROJECT_ASSETS.countdownChristmas,
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
            year: "2000",
            title: "Scout",
            description: "My first school in teamwork and discipline.",
            hoverIllumination: { downwardsYears: 18 },
          },
          {
            year: "2015",
            title: "Scout Instructor",
            description:
              "Level II Instructor, training the next generation.",
            hoverIllumination: { upwardsYears: 3, downwardsYears: 2 },
          },
          {
            year: "2017",
            title: "Rover Leader Training",
            description:
              "Leadership and roverism training, \"El Umbral\" workshop.",
            hoverIllumination: { upwardsYears: 2, downwardsYears: 4 },
          },
          {
            year: "2020",
            title: "APN Guide",
            description:
              "Certified site guide at Aconquija National Park.",
            hoverIllumination: { upwardsYears: 5 },
          },
          {
            year: "2024",
            title: "Mountaineering Recognition",
            description:
              "Municipal recognition for my trajectory in mountaineering.",
            hoverIllumination: { upwardsYears: 8 },
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
            hoverIllumination: { downwardsYears: 5 },
          },
          {
            year: "2017",
            title: "PLC",
            description:
              "Automation with Ladder logic and PLCs — my first contact with the logic of programming.",
            hoverIllumination: { upwardsYears: 4, downwardsYears: 2 },
          },
          {
            year: "2019",
            title: "Emme 3D",
            description:
              "My 3D printing venture. Grew to 10 printers running simultaneously.",
            hoverIllumination: { upwardsYears: 5 },
          },
          {
            year: "2022",
            title: "PJT Systems",
            description:
              "Joined the Systems office at the Tucumán Judiciary — my first formal job in tech.",
            hoverIllumination: { upwardsYears: 6 },
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
            hoverIllumination: { downwardsYears: 6 },
          },
          {
            year: "2009",
            title: "Construction Technician",
            description: "Technical training in construction.",
            hoverIllumination: { upwardsYears: 3, downwardsYears: 4 },
          },
          {
            year: "2010",
            title: "MMO (Master Builder)",
            description:
              "An extra year of tertiary-level training on top of high school.",
            hoverIllumination: { upwardsYears: 2, downwardsYears: 3 },
          },
          {
            year: "2011",
            title: "Chemical Engineering Core Curriculum",
            description:
              "Two years of Chemical Engineering — logic and rigor from day one.",
            hoverIllumination: { upwardsYears: 4, downwardsYears: 5 },
          },
          {
            year: "2021",
            title: "Argentina Programa",
            description:
              "First stage of Argentina Programa: #SéProgramar. My formal entry into code.",
            hoverIllumination: { upwardsYears: 5 },
          },
          {
            year: "2021–2022",
            title: "QA T.TEC Tucumán/UTN",
            description:
              "300-hour QA course, certified by UTN Facultad Regional Tucumán.",
            hoverIllumination: { upwardsYears: 4 },
          },
          {
            year: "Ongoing",
            title: "Continuous training",
            description:
              "Still learning: AI, new technologies, best practices.",
            hoverIllumination: { upwardsYears: 3 },
          },
        ],
      },
    ],
    convergenceLabel: "Full Stack Developer",
    presentLabel: "Present",
    originLabel: "José Maximiliano Vallejo",
    originLabelMobile: "Maxi Vallejo",
  },

  certifications: [
    {
      category: "Formal",
      categoryKey: "formal",
      items: [
        {
          title: "MMO — Diploma",
          year: "N/A",
          description: "Diploma for the MMO program.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/mmo-diploma.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/mmo-diploma.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/mmo-diploma.pdf",
        },
        {
          title: "Construction Technician — Diploma",
          year: "N/A",
          description: "Diploma for the Construction Technician program.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/tec-constructor-diploma.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/tec-constructor-diploma.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/tec-constructor-diploma.pdf",
        },
        {
          title: "Electronics & Home Appliance Repair Technician",
          year: "N/A",
          description:
            "Technical training certificate in electronics and home appliance repair.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/tec-electronica-electrodomesticos.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/tec-electronica-electrodomesticos.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/tec-electronica-electrodomesticos.pdf",
        },
        {
          title: "Workshop — Work Certificate",
          year: "N/A",
          description:
            "Certificate of workshop participation and work performance.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/taller-certificado-trabajo.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/taller-certificado-trabajo.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/taller-certificado-trabajo.pdf",
        },
        /* Hidden — "MMO — Degree in Process" superseded by "MMO — Diploma",
           keep for future reference.
        {
          title: "MMO — Degree in Process",
          year: "N/A",
          description: "Proof of degree in process (MMO).",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/mmo-constancia-tramite.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/mmo-constancia-tramite.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/mmo-constancia-tramite.pdf",
        },
        */
        /* Hidden — "Official Transcript — Construction Technician" superseded
           by "Construction Technician — Diploma", keep for future reference.
        {
          title: "Official Transcript — Construction Technician",
          year: "N/A",
          description:
            "Official transcript for the Construction Technician degree.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/titulo-analitico-tec-constructor.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/titulo-analitico-tec-constructor.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/titulo-analitico-tec-constructor.pdf",
        },
        */
      ],
    },
    {
      category: "Full-Stack Dev",
      categoryKey: "dev",
      items: [
        {
          title: "Argentina Programa",
          year: "2021",
          description:
            'Completion certificate for the "Argentina Programa" software development training program.',
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/argentina-programa.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/argentina-programa.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/argentina-programa.pdf",
        },
        {
          title: "QA",
          year: "2021",
          description:
            "Certificate in software testing and quality assurance (QA).",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/qa-2021.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/qa-2021.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/qa-2021.pdf",
        },
        {
          title: "Introduction to AI-Assisted Development",
          year: "2026",
          description:
            "Certificate from an introductory course on AI-assisted software development.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/inicio-desarrollo-ia.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/inicio-desarrollo-ia.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/inicio-desarrollo-ia.pdf",
        },
        {
          title: "Frontend Developer",
          year: "2024",
          description: "Platzi diploma for completing the Frontend Developer course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-frontend-developer.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-frontend-developer.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-frontend-developer.pdf",
        },
        {
          title: "Node.js Backend: REST API with Express.js",
          year: "2026",
          description:
            "Platzi diploma for completing the Node.js Backend: REST API with Express.js course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-backend-nodejs-express.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-backend-nodejs-express.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-backend-nodejs-express.pdf",
        },
        {
          title: "Claude AI",
          year: "2026",
          description: "Platzi diploma for completing the Claude AI course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-claude-ai.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-claude-ai.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-claude-ai.pdf",
        },
        {
          title: "Getting a Job as a Frontend Developer",
          year: "2024",
          description:
            "Platzi diploma for completing the course on landing a job as a Frontend Developer.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-conseguir-trabajo-frontend.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-conseguir-trabajo-frontend.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-conseguir-trabajo-frontend.pdf",
        },
        {
          title: "React.js",
          year: "2024",
          description: "Platzi diploma for completing the React.js course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-react.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-react.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-react.pdf",
        },
        {
          title: "JavaScript Fundamentals",
          year: "2024",
          description: "Platzi diploma for completing the JavaScript Fundamentals course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-javascript.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-javascript.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-javascript.pdf",
        },
        {
          title: "Practical Frontend Developer",
          year: "2024",
          description: "Platzi diploma for completing the Practical Frontend Developer course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-frontend-developer-practico.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-frontend-developer-practico.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-frontend-developer-practico.pdf",
        },
        {
          title: "Software Architecture Fundamentals",
          year: "2026",
          description:
            "Platzi diploma for completing the Software Architecture Fundamentals course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-arquitectura-software.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-arquitectura-software.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-arquitectura-software.pdf",
        },
        {
          title: "Asynchronous JavaScript",
          year: "2024",
          description: "Platzi diploma for completing the Asynchronous JavaScript course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-asincronismo-js.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-asincronismo-js.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-asincronismo-js.pdf",
        },
        {
          title: "React.js with Vite.js and TailwindCSS",
          year: "2024",
          description:
            "Platzi diploma for completing the React.js with Vite.js and TailwindCSS course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-react-vite-tailwindcss.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-react-vite-tailwindcss.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-react-vite-tailwindcss.pdf",
        },
        {
          title: "Introduction to Backend Development",
          year: "2026",
          description:
            "Platzi diploma for completing the Introduction to Backend Development course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-backend-intro.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-backend-intro.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-backend-intro.pdf",
        },
        {
          title: "React.js Lab: Professional E-commerce",
          year: "2024",
          description:
            "Platzi diploma for completing the React.js Lab: Professional E-commerce.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-react-ecommerce-lab.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-react-ecommerce-lab.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-react-ecommerce-lab.pdf",
        },
        {
          title: "NPM: Package and Dependency Management in JavaScript",
          year: "2024",
          description:
            "Platzi diploma for completing the NPM: Package and Dependency Management in JavaScript course.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-npm.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-npm.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-npm.pdf",
        },
      ],
    },
    {
      category: "Extracurricular",
      categoryKey: "extracurricular",
      items: [
        {
          title: "APN Guide",
          year: "2019",
          description:
            "Certification as a guide with Argentina's National Parks Administration (APN).",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/guia-apn-2019.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/guia-apn-2019.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/guia-apn-2019.pdf",
        },
        {
          title: "APN Guide Certification 2020",
          year: "2020",
          description:
            "Resolution certifying guide qualification with Argentina's National Parks Administration.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/habilitacion-guia-apn-2020.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/habilitacion-guia-apn-2020.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/habilitacion-guia-apn-2020.pdf",
        },
        {
          title: "APN Guide Certification 2021",
          year: "2021",
          description:
            "Resolution certifying guide qualification with Argentina's National Parks Administration.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/habilitacion-guia-apn-2021.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/habilitacion-guia-apn-2021.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/habilitacion-guia-apn-2021.pdf",
        },
        {
          title: "Municipal Mountaineering Recognition",
          year: "2024",
          description:
            "Municipal recognition for contribution and track record in mountaineering.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/distincion-montanismo-municipal.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/distincion-montanismo-municipal.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/distincion-montanismo-municipal.pdf",
        },
        {
          title: "Scout Training",
          year: "N/A",
          description: "Training certificate from the Scout movement.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/formacion-scout.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/formacion-scout.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/formacion-scout.pdf",
        },
        {
          title: "Scout Instructor",
          year: "N/A",
          description:
            "Certification as an instructor within the Scout movement.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/instructor-scout.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/instructor-scout.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/instructor-scout.pdf",
        },
        {
          title: "ILVEM",
          year: "N/A",
          description: "Secondary school completion certificate (ILVEM).",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/ilvem.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/ilvem.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/ilvem.pdf",
        },
        {
          title: "Personnel Evaluation — PJT",
          year: "N/A",
          description: "Job performance evaluation at PJT Sistemas.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/evaluacion-personal-pjt.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/evaluacion-personal-pjt.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/evaluacion-personal-pjt.pdf",
        },
        {
          title: "First Aid",
          year: "N/A",
          description: "First aid training certificate.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/primeros-auxilios.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/primeros-auxilios.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/primeros-auxilios.pdf",
        },
        {
          title: "RCP",
          year: "N/A",
          description:
            "Certificate in cardiopulmonary resuscitation (CPR) training.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/rcp.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/rcp.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/rcp.pdf",
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
    // Skills section temporarily hidden — re-add when scroll behavior is fixed.
    // { href: "#skills", label: "Skills" },
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
