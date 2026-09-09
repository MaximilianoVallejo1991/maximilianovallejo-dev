import { IMAGE_URLS, PROJECT_ASSETS, type PortfolioContent } from "./content";

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
    photoUrl: IMAGE_URLS.aboutPhoto,
    photoAlt: "Retrato de Maximiliano Vallejo",
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
      ...PROJECT_ASSETS.stockControl,
    },
    {
      slug: "elianapp",
      title: "ElianApp",
      description:
        "Aplicación para control de gastos compartidos: cada persona reporta sus propios items, el sistema valida y balancea. Soporta división equitativa, por porcentaje y exacta por participante.",
      techTags: ["React 19", "Express 5", "Prisma 7", "PostgreSQL", "JWT"],
      ...PROJECT_ASSETS.elianapp,
    },
    {
      slug: "countdown-christmas",
      title: "Countdown to Christmas",
      description:
        "Buscá tu país y mirá la cuenta regresiva hasta Navidad y Año Nuevo. Proyecto liviano con despliegue en Vercel.",
      techTags: ["JavaScript", "HTML5", "CSS3", "Vercel"],
      ...PROJECT_ASSETS.countdownChristmas,
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
            year: "2015",
            title: "Ladrillos Macizos Concepción",
            description:
              "Vendí y alquilé las máquinas del taller —ladrilleras, sierras, arrancadoras de papa— y los ladrillos que producían.",
            hoverIllumination: { upwardsYears: 3, downwardsYears: 1 },
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
      category: "Formal",
      categoryKey: "formal",
      items: [
        {
          title: "MMO — Diploma",
          year: "s/f",
          description: "Diploma correspondiente a la formación MMO.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/mmo-diploma.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/mmo-diploma.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/mmo-diploma.pdf",
        },
        {
          title: "Técnico Constructor — Diploma",
          year: "s/f",
          description: "Diploma de la carrera de Técnico Constructor.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/tec-constructor-diploma.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/tec-constructor-diploma.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/tec-constructor-diploma.pdf",
        },
        {
          title: "Técnico en Electrónica y Rep. de Electrodomésticos",
          year: "s/f",
          description:
            "Certificado de formación técnica en electrónica y reparación de electrodomésticos.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/tec-electronica-electrodomesticos.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/tec-electronica-electrodomesticos.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/tec-electronica-electrodomesticos.pdf",
        },
        {
          title: "Taller — Certificado de Trabajo",
          year: "s/f",
          description:
            "Certificado de participación en taller y desempeño laboral.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/taller-certificado-trabajo.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/taller-certificado-trabajo.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/taller-certificado-trabajo.pdf",
        },
        /* Hidden — "MMO — Título en Trámite" superseded by "MMO — Diploma",
           keep for future reference.
        {
          title: "MMO — Título en Trámite",
          year: "s/f",
          description: "Constancia de título en trámite (MMO).",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/mmo-constancia-tramite.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/mmo-constancia-tramite.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/mmo-constancia-tramite.pdf",
        },
        */
        /* Hidden — "Título Analítico — Técnico Constructor" superseded by
           "Técnico Constructor — Diploma", keep for future reference.
        {
          title: "Título Analítico — Técnico Constructor",
          year: "s/f",
          description:
            "Título analítico correspondiente a la carrera de Técnico Constructor.",
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
      category: "Dev Full Stack",
      categoryKey: "dev",
      items: [
        {
          title: "Argentina Programa",
          year: "2021",
          description:
            'Certificado de finalización del programa de formación en desarrollo de software "Argentina Programa".',
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
            "Certificado de formación en testing y aseguramiento de calidad de software (QA).",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/qa-2021.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/qa-2021.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/qa-2021.pdf",
        },
        {
          title: "Inicio en Desarrollo con IA",
          year: "2026",
          description:
            "Certificado de un curso introductorio de desarrollo de software asistido por IA.",
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
          description: "Diploma de Platzi por aprobar el curso de Frontend Developer.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-frontend-developer.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-frontend-developer.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-frontend-developer.pdf",
        },
        {
          title: "Backend con Node.js: API REST con Express.js",
          year: "2026",
          description:
            "Diploma de Platzi por aprobar el curso de Backend con Node.js: API REST con Express.js.",
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
          description: "Diploma de Platzi por aprobar el curso de Claude AI.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-claude-ai.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-claude-ai.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-claude-ai.pdf",
        },
        {
          title: "Conseguir Trabajo como Frontend Developer",
          year: "2024",
          description:
            "Diploma de Platzi por aprobar el curso para conseguir trabajo como Frontend Developer.",
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
          description: "Diploma de Platzi por aprobar el curso de React.js.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-react.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-react.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-react.pdf",
        },
        {
          title: "Fundamentos de JavaScript",
          year: "2024",
          description: "Diploma de Platzi por aprobar el curso de Fundamentos de JavaScript.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-javascript.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-javascript.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-javascript.pdf",
        },
        {
          title: "Práctico de Frontend Developer",
          year: "2024",
          description: "Diploma de Platzi por aprobar el curso Práctico de Frontend Developer.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-frontend-developer-practico.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-frontend-developer-practico.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-frontend-developer-practico.pdf",
        },
        {
          title: "Fundamentos de Arquitectura de Software",
          year: "2026",
          description:
            "Diploma de Platzi por aprobar el curso de Fundamentos de Arquitectura de Software.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-arquitectura-software.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-arquitectura-software.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-arquitectura-software.pdf",
        },
        {
          title: "Asincronismo con JavaScript",
          year: "2024",
          description: "Diploma de Platzi por aprobar el curso de Asincronismo con JavaScript.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-asincronismo-js.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-asincronismo-js.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-asincronismo-js.pdf",
        },
        {
          title: "React.js con Vite.js y TailwindCSS",
          year: "2024",
          description:
            "Diploma de Platzi por aprobar el curso de React.js con Vite.js y TailwindCSS.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-react-vite-tailwindcss.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-react-vite-tailwindcss.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-react-vite-tailwindcss.pdf",
        },
        {
          title: "Introducción al Desarrollo Backend",
          year: "2026",
          description:
            "Diploma de Platzi por aprobar el curso de Introducción al Desarrollo Backend.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-backend-intro.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-backend-intro.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-backend-intro.pdf",
        },
        {
          title: "Laboratorio de React.js: E-commerce Profesional",
          year: "2024",
          description:
            "Diploma de Platzi por aprobar el Laboratorio de React.js: E-commerce Profesional.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/platzi-react-ecommerce-lab.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/platzi-react-ecommerce-lab.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/platzi-react-ecommerce-lab.pdf",
        },
        {
          title: "NPM: Gestión de Paquetes y Dependencias en JavaScript",
          year: "2024",
          description:
            "Diploma de Platzi por aprobar el curso de NPM: Gestión de Paquetes y Dependencias en JavaScript.",
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
          title: "Guía APN",
          year: "2019",
          description:
            "Habilitación como guía en la Administración de Parques Nacionales.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/guia-apn-2019.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/guia-apn-2019.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/guia-apn-2019.pdf",
        },
        {
          title: "Habilitación Guía APN 2020",
          year: "2020",
          description:
            "Resolución de habilitación como guía en Parques Nacionales.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/habilitacion-guia-apn-2020.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/habilitacion-guia-apn-2020.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/habilitacion-guia-apn-2020.pdf",
        },
        {
          title: "Habilitación Guía APN 2021",
          year: "2021",
          description:
            "Resolución de habilitación como guía en Parques Nacionales.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/habilitacion-guia-apn-2021.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/habilitacion-guia-apn-2021.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/habilitacion-guia-apn-2021.pdf",
        },
        {
          title: "Distinción en Montañismo",
          year: "2024",
          description:
            "Distinción municipal por trayectoria y aporte a la actividad de montañismo.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/distincion-montanismo-municipal.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/distincion-montanismo-municipal.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/distincion-montanismo-municipal.pdf",
        },
        {
          title: "Formación Scout",
          year: "s/f",
          description: "Certificado de formación en el movimiento scout.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/formacion-scout.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/formacion-scout.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/formacion-scout.pdf",
        },
        {
          title: "Instructor Scout",
          year: "s/f",
          description:
            "Certificación como instructor dentro del movimiento scout.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/instructor-scout.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/instructor-scout.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/instructor-scout.pdf",
        },
        {
          title: "ILVEM",
          year: "s/f",
          description: "Certificado de estudios secundarios (ILVEM).",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/ilvem.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/ilvem.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/ilvem.pdf",
        },
        {
          title: "Evaluación de Personal — PJT",
          year: "s/f",
          description: "Evaluación de desempeño laboral en PJT Sistemas.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/evaluacion-personal-pjt.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/evaluacion-personal-pjt.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/evaluacion-personal-pjt.pdf",
        },
        {
          title: "Primeros Auxilios",
          year: "s/f",
          description: "Certificado de formación en primeros auxilios.",
          thumbnailUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_fill,g_north,h_450,w_800/f_auto/q_auto/certifications/primeros-auxilios.jpg",
          imageUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/pg_1/c_limit,w_1600/f_auto/q_auto/certifications/primeros-auxilios.jpg",
          pdfUrl:
            "https://res.cloudinary.com/dc3kybsmr/image/upload/certifications/primeros-auxilios.pdf",
        },
        {
          title: "RCP",
          year: "s/f",
          description:
            "Certificado de formación en reanimación cardiopulmonar (RCP).",
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
    // Skills section temporarily hidden — re-add when scroll behavior is fixed.
    // { href: "#skills", label: "Habilidades" },
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
