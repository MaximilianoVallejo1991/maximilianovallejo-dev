# Final Content: Career-Journey Trajectory Diagram Section

Change: `portfolio-career-timeline`
Status: **Approved by user** — locked in for the proposal/spec/design/tasks phases.

## Scope decision

**Replaces** the existing `experience` section/data in `content.es.ts` / `content.en.ts` (currently 4 tracks, 100% Lorem Ipsum placeholder). Not an additive new section.

## Approach

Hybrid (per [explore.md](explore.md)): a simplified, lightweight convergence graphic (3 branches → 1 "Full Stack Developer" node) as a compact visual, with the existing `TimelineNode`/accordion list underneath for full per-milestone detail. Avoids replicating `Hero.tsx`'s hardcoded per-node SVG coordinate approach.

## Content — ES

**Hab. Blandas**
| Año | Título | Descripción |
|---|---|---|
| 2008 | Scout | Mi primera escuela de trabajo en equipo y disciplina. |
| 2015 | Instructor Scout | Nivel II como Instructor, formando a las nuevas generaciones. |
| 2017 | Formación Dirigente Rover | Formación en roverismo y liderazgo, Taller "El Umbral". |
| 2020 | Guía APN | Habilitado como guía de sitio en el Parque Nacional Aconquija. |
| 2024 | Distinción Montañismo | Reconocimiento municipal por mi trayectoria en la montaña. |

**Oficio**
| Año | Título | Descripción |
|---|---|---|
| 2008 | Taller Metalmecánico | Diez años junto a mi padre, fabricando y reparando maquinaria. |
| 2017 | PLC | Automatización con Ladder y PLCs — mi primer contacto con la lógica de programar. |
| 2019 | Emme 3D | Mi emprendimiento de impresión 3D. Llegué a tener 10 impresoras funcionando en simultáneo. |
| 2022 | PJT Sistemas | Entré a la oficina de Sistemas del Poder Judicial de Tucumán — mi primer trabajo formal en tecnología. |

**Estudios Formales**
| Año | Título | Descripción |
|---|---|---|
| 2007 | Téc. Electrónica y Rep. Electrodomésticos | Mi primer título técnico. |
| 2009 | Téc. Constructor | Formación técnica en construcción. |
| 2010 | MMO | Maestro Mayor de Obras, un año extra de terciario en la secundaria. |
| 2011 | Ciclo Básico Ingeniería Química | Dos años de Ingeniería Química — lógica y rigor desde el vamos. |
| 2021 | Argentina Programa | Primera etapa de Argentina Programa: #SéProgramar. Mi entrada formal al código. |
| 2021–2022 | QA T.TEC Tucumán/UTN | 300 horas de QA, certificado por la UTN Facultad Regional Tucumán. |
| Continua | Capacitación continua | Sigo formándome: IA, nuevas tecnologías, buenas prácticas. |

Converge en: **Desarrollador Full Stack**.

## Content — EN

**Soft Skills**
| Year | Title | Description |
|---|---|---|
| 2008 | Scout | My first school in teamwork and discipline. |
| 2015 | Scout Instructor | Level II Instructor, training the next generation. |
| 2017 | Rover Leader Training | Leadership and roverism training, "El Umbral" workshop. |
| 2020 | APN Guide | Certified site guide at Aconquija National Park. |
| 2024 | Mountaineering Recognition | Municipal recognition for my trajectory in mountaineering. |

**Trade**
| Year | Title | Description |
|---|---|---|
| 2008 | Metalworking Shop | Ten years alongside my father, building and repairing machinery. |
| 2017 | PLC | Automation with Ladder logic and PLCs — my first contact with the logic of programming. |
| 2019 | Emme 3D | My 3D printing venture. Grew to 10 printers running simultaneously. |
| 2022 | PJT Systems | Joined the Systems office at the Tucumán Judiciary — my first formal job in tech. |

**Formal Education**
| Year | Title | Description |
|---|---|---|
| 2007 | Electronics & Appliance Repair Technician | My first technical degree. |
| 2009 | Construction Technician | Technical training in construction. |
| 2010 | MMO (Master Builder) | An extra year of tertiary-level training on top of high school. |
| 2011 | Chemical Engineering Core Curriculum | Two years of Chemical Engineering — logic and rigor from day one. |
| 2021 | Argentina Programa | First stage of Argentina Programa: #SéProgramar. My formal entry into code. |
| 2021–2022 | QA T.TEC Tucumán/UTN | 300-hour QA course, certified by UTN Facultad Regional Tucumán. |
| Ongoing | Continuous training | Still learning: AI, new technologies, best practices. |

Converges into: **Full Stack Developer**.

## Sources

- Original hand-sketched diagram (photo provided by user).
- User's existing About Me copy (`content.es.ts` / `content.en.ts`, `about.paragraphs`).
- Certificates in `certificados/` (project root) — see [explore.md](explore.md) risk notes for the specific corrections made against the original sketch (QA name/year, Argentina Programa year, Instructor Scout split into two real milestones, Guía APN habilitación year + new 2024 distinction).

## Next

Ready for `sdd-propose`.
