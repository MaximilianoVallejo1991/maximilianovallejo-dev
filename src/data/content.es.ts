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
    photoUrl: "https://res.cloudinary.com/dc3kybsmr/image/upload/v1752021992/max_foto_yqzdwl.png",
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
      title: "Stock Control",
      description:
        "Sistema integral de gestión de inventarios y punto de venta (POS) con motor de descuentos dinámico, control de stock en tiempo real, seguimiento de ventas, cuentas corrientes y reportes estadísticos avanzados.",
      techTags: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "JWT"],
      liveUrl: "https://stockdetienda.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/stock-controll-main",
      screenshot: "https://picsum.photos/seed/stock-control/800/450",
    },
    {
      slug: "elianapp",
      title: "ElianApp",
      description:
        "Aplicación para control de gastos compartidos: cada persona reporta sus propios items, el sistema valida y balancea. Soporta división equitativa, por porcentaje y exacta por participante.",
      techTags: ["React 19", "Express 5", "Prisma 7", "PostgreSQL", "JWT"],
      liveUrl: "https://elianapp.vercel.app",
      repoUrl: "https://github.com/MaximilianoVallejo1991/ElianApp",
      screenshot: "https://picsum.photos/seed/elianapp/800/450",
    },
    {
      slug: "countdown-christmas",
      title: "Countdown to Christmas",
      description:
        "Buscá tu país y mirá la cuenta regresiva hasta Navidad y Año Nuevo. Proyecto liviano con despliegue en Vercel.",
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
        branchLabel: "Hab. Blandas",
        accentKey: "soft",
        icon: "compass",
        milestones: [
          {
            year: "2000",
            title: "Scout",
            description:
              "De niño, mi primera escuela de trabajo en equipo y disciplina.",
            hoverIllumination: { downwardsYears: 17 },
          },
          {
            year: "2015",
            title: "Instructor Scout",
            description:
              "Nivel II como Instructor, formando a las nuevas generaciones.",
            hoverIllumination: { upwardsYears: 1, downwardsYears: 2 },
          },
          {
            year: "2017",
            title: "Formación Dirigente Rover",
            description:
              "Formación en roverismo y liderazgo, Taller \"El Umbral\".",
            hoverIllumination: { upwardsYears: 2, downwardsYears: 2 },
          },
          {
            year: "2020",
            title: "Guía APN",
            description:
              "Habilitado como guía de sitio en el Parque Nacional Aconquija.",
            hoverIllumination: { upwardsYears: 1, downwardsYears: 4 },
          },
          {
            year: "2024",
            title: "Distinción Montañismo",
            description:
              "Reconocimiento municipal por mi trayectoria en la montaña.",
            hoverIllumination: { upwardsYears: 1, downwardsYears: 1 },
          },
                    {
            year: "Actualidad",
            title: "Hobbie Montañismo",
            description:
              "Disfruto de la montaña como hobbie en lugar de verlo como una actividad comercial.",
            hoverIllumination: { upwardsYears: 3 },
          },
        ],
      },
      {
        branchKey: "trade",
        branchLabel: "Oficio",
        accentKey: "trade",
        icon: "anvil",
        milestones: [
          {
            year: "2008",
            title: "Taller Metalmecánico",
            description:
              "Diez años junto a mi padre, fabricando y reparando maquinaria.",
            hoverIllumination: { downwardsYears: 5 },
          },
          {
            year: "2017",
            title: "Automatizaciones PLC",
            description:
              "Automatización con Ladder y PLCs — mi primer contacto con la lógica de programar.",
            hoverIllumination: { upwardsYears: 4, downwardsYears: 1 },
          },
          {
            year: "2019",
            title: "Emme 3D",
            description:
              "Mi emprendimiento de impresión 3D. Llegué a tener 10 impresoras funcionando en simultáneo.",
            hoverIllumination: { upwardsYears: 1, downwardsYears: 3 },
          },
          {
            year: "2022",
            title: "PJT Sistemas",
            description:
              "Entré a la oficina de Sistemas del Poder Judicial de Tucumán — mi primer trabajo formal en tecnología.",
            hoverIllumination: { downwardsYears: 4 },
            
          },
                    {
            year: "Actualidad",
            title: "Crecimiento profesional",
            description:
              "Sigo creciendo profesionalmente en el área de Sistemas, con foco en Soporte IT y Seguridad Informática.",
            hoverIllumination: { upwardsYears: 3 },
          },
        ],
      },
      {
        branchKey: "study",
        branchLabel: "Estudios Formales",
        accentKey: "study",
        icon: "graduation",
        milestones: [
          {
            year: "2007",
            title: "Téc. Electrónica y Rep. Electrodomésticos",
            description: "Mi primer título técnico.",
            hoverIllumination: { downwardsYears: 1 },
          },
          {
            year: "2009",
            title: "Téc. Constructor",
            description: "Formación técnica en construcción.",
            hoverIllumination: { upwardsYears: 4 },
          },
          {
            year: "2010",
            title: "MMO",
            description:
              "Maestro Mayor de Obras, un año extra de terciario en la secundaria.",
            hoverIllumination: {  upwardsYears: 1},
          },
          {
            year: "2011",
            title: "Ciclo Básico Ingeniería Química",
            description:
              "Dos años de Ingeniería Química — lógica y rigor desde el vamos.",
            hoverIllumination: { upwardsYears: 1, downwardsYears: 4 },
          },
          {
            year: "2021",
            title: "Argentina Programa",
            description:
              "Primera etapa de Argentina Programa: #SéProgramar. Mi entrada formal al código.",
            hoverIllumination: { upwardsYears: 1 },
          },
          {
            year: "2021–2022",
            title: "QA T.TEC Tucumán/UTN",
            description:
              "300 horas de QA, certificado por la UTN Facultad Regional Tucumán.",
            hoverIllumination: { upwardsYears: 1, downwardsYears: 1 },
          },
          {
            year: "Actualidad",
            title: "Capacitación continua",
            description:
              "Sigo formándome: IA, nuevas tecnologías, buenas prácticas.",
            hoverIllumination: { upwardsYears: 3 },
          },
        ],
      },
    ],
    convergenceLabel: "Desarrollador Full Stack",
    presentLabel: "Actualidad",
    originLabel: "José Maximiliano Vallejo",
    originLabelMobile: "Maxi Vallejo", 
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
