if (!process.env.npm_execpath?.includes("pnpm")) {
  console.error("");
  console.error("  ╔══════════════════════════════════════════════╗");
  console.error("  ║  Este proyecto usa pnpm, no npm.            ║");
  console.error("  ║                                             ║");
  console.error("  ║  Usá:   pnpm dev    pnpm build              ║");
  console.error("  ║                                             ║");
  console.error("  ║  No:    npm run dev    npm run build        ║");
  console.error("  ╚══════════════════════════════════════════════╝");
  console.error("");
  process.exit(1);
}
