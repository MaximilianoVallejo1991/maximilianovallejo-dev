import type { PortfolioContent } from "./content";

export const es: PortfolioContent = {
  meta: {
    title: "Maximiliano Vallejo — Desarrollador Full Stack",
    description:
      "Portfolio profesional de Maximiliano Vallejo. Full Stack Developer con trayectoria en voluntariado, industria, tecnología y oficios.",
    author: "Maximiliano Vallejo",
    siteUrl: "https://maximilianovallejo-dev.vercel.app",
  },

  hero: {
    greeting: "Hola, soy",
    name: "Maximiliano Vallejo",
    subtitle: "Desarrollador Full Stack",
    quadrantLabels: [
      "Voluntariado",
      "Industria",
      "Tecnología",
      "Oficios",
    ],
  },

  about: {
    paragraphs: [
      "No llegué al software por un camino tradicional. Durante más de 10 años trabajé junto a mi padre en un taller de metalmecánica fabricando y reparando maquinaria. Durante los primeros años, cursé Ingeniería y completé el ciclo básico. Así fue que aprendí a trabajar en equipo, a usar la lógica para resolver problemas y a estar en búsqueda de nuevos desafíos.",

      "Integrar automatizaciones con diagramas Ladder y PLCs en el taller despertó una curiosidad que me llevó al mundo de las impresoras 3D. Mi emprendimiento, Emme 3D, llegó a tener 10 impresoras funcionando en simultáneo, lo que me dio horas de trabajo en la PC, preparándome para lo que seguía.",

      "Ahí apareció la programación web. Hice la primera etapa de Argentina Programa, un curso de QA Testing y luego continué estudiando por mi cuenta. En el medio surgió mi puesto en la oficina de Sistemas en el Poder Judicial de Tucumán. Actualmente trabajo ahí por las mañanas en Soporte IT y Seguridad Informática, y por las tardes sigo realizando cursos, programando y formándome como desarrollador.",

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

  experience: [
    {
      trackKey: "voluntariado",
      trackLabel: "Voluntariado y Liderazgo",
      heroImage: "https://picsum.photos/seed/voluntariado/800/400",
      milestones: [
        {
          year: "2003-2023",
          title: "Scout Leader — Grupo Scout San Cayetano",
          description:
            "20 años de liderazgo en el movimiento scout. Coordinación de equipos, planificación de campamentos, gestión de proyectos comunitarios y formación de jóvenes líderes.",
          photoUrl: "https://picsum.photos/seed/scout1/200/200",
        },
        {
          year: "2015-2023",
          title: "Jefe de Grupo — Scouts de Argentina",
          description:
            "Dirección del grupo scout local. Responsable de la gestión administrativa, formación de dirigentes y representación institucional ante la comunidad.",
        },
        {
          year: "2018-2022",
          title: "Coordinador de Proyectos Solidarios",
          description:
            "Lideré iniciativas de servicio comunitario: colectas de alimentos, construcción de viviendas de emergencia, y programas educativos en zonas rurales.",
          photoUrl: "https://picsum.photos/seed/scout2/200/200",
        },
        {
          year: "2019-2023",
          title: "Guía de Sitio — Parque Nacional del Aconquija",
          description:
            "Guía habilitado por Parques Nacionales en el Parque Nacional del Aconquija, provincia de Tucumán. Interpretación ambiental, seguridad en montaña, atención al visitante y conservación del patrimonio natural.",
          photoUrl: "https://picsum.photos/seed/aconquija/200/200",
        },
      ],
    },
    {
      trackKey: "industria",
      trackLabel: "Industria y Mecánica",
      heroImage: "https://picsum.photos/seed/industria/800/400",
      milestones: [
        {
          year: "2009 - 2020",
          title: "Técnico Mecánico — Taller Mecánica",
          description:
            "Más de 10 años reparando, diseñando y fabricando maquinaria industrial — camiones, maquinaria vial, arrancadoras de papa, sierras sin fin, ladrilleras simples y automatizadas con PLC. Creación de planos de piezas con modelado 3D. Diseño y programación con PLC Siemens LOGO!8 para automatización de corte en máquinas ladrilleras, integrando sistemas neumáticos. Planificación y ejecución de proyectos para industrias azucareras, ladrilleras y agrícolas.",
          photoUrl: "https://picsum.photos/seed/mecanica1/200/200",
        },
        {
          year: "2017 - 2022",
          title: "Coordinador de Ventas, Alquiler y Logística — Ladrillos Macizos Concepción",
          description:
            "Comercialización de máquinas diseñadas y fabricadas en el taller — ladrilleras, sierras, arrancadoras de papa — más los ladrillos producidos por estas. Gestión de ventas y alquiler con soporte técnico incluido. Responsable de cobranza y administración de contratos. Coordinación de logística de entrega asegurando suministro oportuno en obra.",
          photoUrl: "https://picsum.photos/seed/parque1/200/200",
        },
      ],
    },
    {
      trackKey: "tech",
      trackLabel: "Tecnología y Desarrollo",
      heroImage: "https://picsum.photos/seed/tech/800/400",
      milestones: [
        {
          year: "2023 - Actualidad",
          title: "Desarrollador Full Stack — Proyectos Propios",
          description:
            "Construyo aplicaciones web completas desde el diseño hasta el deploy, aplicando buenas prácticas de arquitectura, testing y desarrollo iterativo. Stack principal: React, TypeScript, Node.js, Express, Prisma, PostgreSQL. Proyectos destacados: Stock Control (POS e inventarios con descuentos dinámicos), ElianApp (gastos compartidos con división equitativa, porcentual y exacta), Countdown to Christmas (countdown filtrável por país).",
          photoUrl: "https://picsum.photos/seed/code1/200/200",
        },
        {
          year: "2022 - Actualidad",
          title: "Soporte Técnico y Seguridad Informática — Poder Judicial de Tucumán",
          description:
            "Configuración y mantenimiento de redes de internet e intranet, asegurando el funcionamiento óptimo según los estándares del organismo. Supervisión de la consola de seguridad, monitoreo de amenazas y aplicación de medidas preventivas. Elaboración de reportes sobre el estado de seguridad y desempeño de equipos. Desarrollo de planes de acción para resolución de problemas.",
          photoUrl: "https://picsum.photos/seed/pjudicial/200/200",
        },
      ],
    },
    {
      trackKey: "oficios",
      trackLabel: "Oficios y Emprendimientos",
      heroImage: "https://picsum.photos/seed/oficios/800/400",
      milestones: [
        {
          year: "2020 - 2022",
          title: "Propietario — Emme 3D",
          description:
            "Escalé el emprendimiento a 10 impresoras 3D operando en simultáneo, gestionando mantenimiento, insumos, entregas y atención al cliente. Diseño industrial y fabricación de productos personalizados mediante modelado 3D. Diseño de piezas especializadas para maquinaria de la industria tucumana. Administración completa del proceso de fabricación y venta — desde el concepto hasta la entrega final.",
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
          title: "Técnico en Desarrollo de Software",
          issuer: "Instituto Técnico — Tucumán",
          year: "2023",
        },
        {
          title: "Bachiller en Ciencias Naturales",
          issuer: "Colegio Nacional — Tucumán",
          year: "2011",
          pdfUrl: "/pdfs/titulo-bachiller.pdf",
        },
      ],
    },
    {
      category: "Técnica",
      categoryKey: "tecnica",
      items: [
        {
          title: "QA Testing Manual y Automatización",
          issuer: "UTN — Facultad Regional Tucumán",
          year: "2024",
          pdfUrl: "/pdfs/cert-qa-utn.pdf",
        },
        {
          title: "Desarrollo Web Full Stack",
          issuer: "Platzi",
          year: "2023",
        },
        {
          title: "React Avanzado — Patrones y Arquitectura",
          issuer: "Frontend Masters",
          year: "2024",
        },
        {
          title: "TypeScript: De Cero a Experto",
          issuer: "Fernando Herrera — Udemy",
          year: "2024",
        },
        {
          title: "Docker y Contenedores para Desarrolladores",
          issuer: "KodeKloud",
          year: "2024",
        },
        {
          title: "Node.js: REST API con TypeScript y PostgreSQL",
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
          title: "Liderazgo y Gestión de Equipos",
          issuer: "Scouts de Argentina",
          year: "2015",
        },
        {
          title: "Primeros Auxilios y RCP",
          issuer: "Cruz Roja Argentina",
          year: "2022",
        },
        {
          title: "Guía de Trekking — Nivel Avanzado",
          issuer: "Parque Nacional Los Alerces",
          year: "2020",
          pdfUrl: "/pdfs/guia-trekking.pdf",
        },
        {
          title: "Seguridad e Higiene Industrial",
          issuer: "Superintendencia de Riesgos del Trabajo",
          year: "2018",
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
