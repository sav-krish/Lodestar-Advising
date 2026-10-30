# Project conventions
- Keep offered plan formats and the client-count claim in `src/data/programs.ts`; render plans and their structured data from that source so they cannot drift.
- Validate business offer rules with the adjacent Bun tests; no additional test dependency is required.