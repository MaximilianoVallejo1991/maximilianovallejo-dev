import type { PortfolioContent } from "./content";

export const es: PortfolioContent = {
  meta: {
    title: "Maximiliano Vallejo — Desarrollador Full Stack",
    description:
      "Portfolio profesional de Maximiliano Vallejo. Sitio en construcción, pronto disponible con información completa.",
    author: "Maximiliano Vallejo",
    siteUrl: "https://maximilianovallejo-dev.vercel.app",
  },

  construction: {
    label: "En construcción",
    message: "Este portfolio está en construcción. El contenido completo estará disponible próximamente. Seguime en LinkedIn:",
  },

  hero: {
    greeting: "Hola, soy",
    name: "Maximiliano Vallejo",
    subtitle: "Desarrollador Full Stack",
    nodes: [
      "Capacidad de Coordinación",
      "Dinámica de Equipos",
      "Resolución de Problemas Reales",
      "Aplicación de Software",
      "Conocimiento Técnico",
    ],
    mobileGreeting: "Hola, Soy",
    mobileName: "Maxi Vallejo",
    mobileSubtitle: "Full Stack",
  },

  about: {
    paragraphs: [
      "No llegué al software por un camino tradicional. Durante más de 10 años trabajé junto a mi padre en un taller de metalmecánica fabricando y reparando maquinaria. Durante los primeros años, cursé Ingeniería y completé el ciclo básico. Así fue que aprendí a trabajar en equipo, a usar la lógica para resolver problemas y a estar en búsqueda de nuevos desafíos.",

      "Integrar automatizaciones con diagramas Ladder y PLCs en el taller despertó una curiosidad que me llevó al mundo de las impresoras 3D. Mi emprendimiento, Emme 3D, llegó a tener 10 impresoras funcionando en simultáneo, lo que me dio horas de trabajo en la PC, preparándome para lo que seguía.",

      "Ahí apareció la programación web. Hice la primera etapa de Argentina Programa, un curso de QA Testing y luego continué estudiando por mi cuenta. En el medio surgió mi puesto en la oficina de Sistemas en el Poder Judicial de Tucumán. Actualmente trabajo ahí por las mañanas en Soporte IT y Seguridad Informática, y por las tardes sigo realizando cursos, programando y formándome como desarrollador.",

      "Hoy soy capaz de construir aplicaciones full-stack completas con React, Node.js, Express y PostgreSQL. Mi diferencial: uso la IA estratégicamente —spec-driven development, evaluación de modelos y optimización de contextos. No es el camino típico, pero cada paso, desde el taller hasta el código, me dio herramientas que quiero aplicar en mi próximo desafío profesional.",
    ],
    mobileParagraphs: [
      "Por más de 10 años trabajé junto a mi padre en un taller de metalmecánica fabricando y reparando maquinaria. Durante los primeros años, cursé Ingeniería y completé el ciclo básico. Allí integramos automatizaciones con diagramas Ladder y PLCs, lo que despertó la curiosidad que me llevó a mi emprendimiento, Emme 3D, con más de 10 impresoras funcionando en simultáneo.",

      "Pronto apareció la programación web. Hice la primera etapa de Argentina Programa, un curso de QA Testing y luego continué estudiando por mi cuenta. En el medio surgió mi puesto en la oficina de Sistemas en el Poder Judicial de Tucumán. Actualmente trabajo ahí por las mañanas en Soporte IT y Seguridad Informática, y por las tardes sigo realizando cursos, programando y formándome como desarrollador.",

      "Hoy soy capaz de construir aplicaciones full-stack completas con React, Node.js, Express y PostgreSQL. Mi diferencial: uso la IA estratégicamente —spec-driven development, evaluación de modelos y optimización de contextos. No es el camino típico, pero cada paso, desde el taller hasta el código, me dio herramientas que quiero aplicar en mi próximo desafío profesional.",
    ],
    photoUrl: "https://picsum.photos/seed/mv-portrait/400/400",
    photoAlt: "Retrato de Maximiliano Vallejo",
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
      category: "Herramientas",
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
        { name: "Mecánica Industrial", icon: "wrench" },
        { name: "Mantenimiento", icon: "settings" },
        { name: "Diagnóstico de Fallas", icon: "search" },
        { name: "Seguridad Laboral", icon: "shield" },
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
    cta: "¿Trabajamos juntos?",
    linkLabels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
  },

  navLinks: [
    { href: "#hero", label: "Inicio" },
    { href: "#about", label: "Sobre mí" },
    { href: "#skills", label: "Habilidades" },
    { href: "#projects", label: "Proyectos" },
    { href: "#experience", label: "Trayectoria" },
    { href: "#certifications", label: "Certificaciones" },
    { href: "#contact", label: "Contacto" },
  ],

  skipLink: "Saltar al contenido",
  footerCredits: "Construido con React, TypeScript, Tailwind CSS",
  footerBackToTop: "Volver arriba",
  navAriaLabel: "Navegación principal",
  navOpenMenu: "Abrir menú",
  navCloseMenu: "Cerrar menú",
};

export default es;
