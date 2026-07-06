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
      "Soy un desarrollador full stack con una trayectoria poco convencional. Durante 20 años lideré grupos scouts, gestioné equipos y coordiné proyectos de servicio comunitario. Esa experiencia me enseñó a trabajar con personas, resolver problemas bajo presión y mantener la calma cuando las cosas se complican.",
      "Antes de escribir código, pasé 11 años como mecánico industrial y guía de parques nacionales. Aprendí a diagnosticar fallas, mantener sistemas críticos y prestar atención al detalle — habilidades que hoy aplico al debuggear una API o diseñar la arquitectura de una aplicación.",
      "Hoy combino todo eso con mi formación autodidacta y técnica en desarrollo de software. Trabajo con tecnologías modernas del ecosistema JavaScript/TypeScript, tanto en frontend como backend, y estoy siempre aprendiendo algo nuevo. Mi perfil no es el típico: vengo del barro, de arreglar máquinas y liderar voluntarios, y esa mezcla me da una perspectiva única para construir software que realmente resuelva problemas.",
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
        { name: "REST APIs", icon: "api" },
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
        "Sistema full stack de control de stock e inventario con autenticación, roles de usuario, dashboard administrativo y reportes exportables. Construido con React, Node.js y PostgreSQL.",
      techTags: ["React", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
      repoUrl: "https://github.com/maximilianovallejo/stock-control",
      screenshot: "https://picsum.photos/seed/stock-control/800/450",
    },
    {
      slug: "elianapp",
      title: "ElianApp",
      description:
        "Aplicación de gestión comercial con catálogo de productos, carrito de compras, pagos integrados y panel de administración. Desarrollada con Next.js y TypeScript.",
      techTags: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS", "Stripe"],
      liveUrl: "https://elianapp.vercel.app",
      repoUrl: "https://github.com/maximilianovallejo/elianapp",
      screenshot: "https://picsum.photos/seed/elianapp/800/450",
    },
    {
      slug: "countdown-christmas",
      title: "Countdown to Christmas",
      description:
        "Aplicación interactiva con cuenta regresiva animada para Navidad. Incluye temas visuales, música de fondo y mensajes personalizados. Ideal como proyecto creativo y festivo.",
      techTags: ["React", "TypeScript", "Framer Motion", "CSS Animations"],
      liveUrl: "https://countdown-christmas.vercel.app",
      repoUrl: "https://github.com/maximilianovallejo/countdown-christmas",
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
      ],
    },
    {
      trackKey: "industria",
      trackLabel: "Industria y Mecánica",
      heroImage: "https://picsum.photos/seed/industria/800/400",
      milestones: [
        {
          year: "2012-2023",
          title: "Mecánico Industrial — Ladrillera La Banda",
          description:
            "11 años en mantenimiento y reparación de maquinaria industrial pesada. Diagnóstico de fallas, soldadura, tornería y gestión de repuestos críticos.",
          photoUrl: "https://picsum.photos/seed/mecanica1/200/200",
        },
        {
          year: "2019-2023",
          title: "Guía de Parque Nacional — Parque Nacional Los Alerces",
          description:
            "Guía de trekking y senderismo en el Parque Nacional Los Alerces. Interpretación ambiental, seguridad en montaña y atención al visitante en inglés y español.",
          photoUrl: "https://picsum.photos/seed/parque1/200/200",
        },
        {
          year: "2020-2022",
          title: "Operador de Producción — Laminados Industriales",
          description:
            "Control de calidad en línea de producción continua. Operación de hornos industriales y mantenimiento preventivo programado.",
        },
      ],
    },
    {
      trackKey: "tech",
      trackLabel: "Tecnología y Desarrollo",
      heroImage: "https://picsum.photos/seed/tech/800/400",
      milestones: [
        {
          year: "2020-2026",
          title: "Desarrollador Full Stack Autodidacta",
          description:
            "Formación autodidacta en desarrollo web. Estudié JavaScript, React, Node.js, TypeScript, bases de datos y arquitectura de software. Completé múltiples proyectos personales y contribuciones open source.",
          photoUrl: "https://picsum.photos/seed/code1/200/200",
        },
        {
          year: "2022-2023",
          title: "Soporte IT — Poder Judicial de Tucumán",
          description:
            "Soporte técnico en el área de sistemas del Poder Judicial. Mesa de ayuda, mantenimiento de hardware, instalación de software y gestión de tickets en GLPI.",
          photoUrl: "https://picsum.photos/seed/pjudicial/200/200",
        },
        {
          year: "2024-2025",
          title: "Certificaciones Técnicas",
          description:
            "Completé certificaciones profesionales en QA Testing (UTN), desarrollo frontend con React y diversas tecnologías del ecosistema JavaScript. Formación continua en plataformas como Platzi, freeCodeCamp y Frontend Masters.",
        },
        {
          year: "2025-2026",
          title: "Proyectos Freelance y Portfolio",
          description:
            "Desarrollo de proyectos freelance y construcción de portfolio profesional. Enfoque en arquitecturas modernas, buenas prácticas de código y experiencia de usuario.",
          photoUrl: "https://picsum.photos/seed/code2/200/200",
        },
      ],
    },
    {
      trackKey: "oficios",
      trackLabel: "Oficios y Habilidades Manuales",
      heroImage: "https://picsum.photos/seed/oficios/800/400",
      milestones: [
        {
          year: "2010-2023",
          title: "Soldador y Tornero",
          description:
            "Habilidades en soldadura eléctrica y autógena, tornería convencional y CNC básica. Aplicación en proyectos de reparación y fabricación de piezas.",
        },
        {
          year: "2015-2020",
          title: "Carpintero Aficionado",
          description:
            "Proyectos de carpintería: muebles, reparaciones y trabajos de restauración. Experiencia con herramientas manuales y eléctricas.",
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
    linkedin: "https://linkedin.com/in/maximilianovallejo",
    github: "https://github.com/maximilianovallejo",
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
