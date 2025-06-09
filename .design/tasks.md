# Development Stories

> **Note:** Each item below represents \~1 story point of work. Check a box when the story is accepted.

### Project & Environment Setup

- [ ] **Bootstrap repo and CI** – create Git repository, enable branch protection, add pre-commit lint/format hooks, wire up GitHub Actions for TypeScript checks and unit tests.
- [ ] **Initialize Next.js 14 with strict TypeScript** – `create-next-app`, enable `strict`, `noUncheckedIndexedAccess`, and ESLint/Prettier.
- [ ] **Install & configure Tailwind CSS** – add Tailwind, post-CSS config, custom color palette, typography plugin, purge settings for production.
- [ ] **Add ShadCN UI & Lucide icons** – install packages, run shadcn/init, set up default theme extension, verify tree-shaking.
- [ ] **Provision Supabase project & env vars** – create project in Supabase, copy anon & service keys into `.env.local`, enable Row-Level Security.
- [ ] **Add Prisma & generate client** – install Prisma, configure `schema.prisma` provider to Supabase/PostgreSQL, run first `npx prisma generate`.
- [ ] **Set up automated database migrations** – add `prisma:migrate` script to CI/CD, confirm migrations run in staging pipeline.
- [ ] **Implement base logging & error boundary** – centralized server logging via `console` wrapper, global React error boundary with user-friendly message.

### Data Modeling

- [ ] **Define `Event` model** – fields: id (uuid), title, startsAt, endsAt, createdBy, wizardStage, settings (JSON).
- [ ] **Define `Room` model** – id, eventId FK, name, capacity, sortOrder.
- [ ] **Define `TimeBlock` model** – id, eventId FK, startsAt, endsAt, sortOrder.
- [ ] **Define `Topic` model** – id, eventId FK, title, createdBy, isLocked, deletedAt (soft delete).
- [ ] **Define `Vote` model** – id, topicId FK, attendeeId FK, createdAt (one vote per pair constraint).
- [ ] **Define `Session` model** – id, topicId FK, roomId FK, startsAt, endsAt.
- [ ] **Define `Note` model** – id, sessionId FK, authorId FK (nullable), content (Markdown).
- [ ] **Define `Attendee` model** – id, eventId FK, name, email (nullable), lastSeenAt, interests (TEXT\[]).
- [ ] **Seed script for local dev fixtures** – generate demo event, two rooms, three blocks, sample topics, and one test attendee.

### Common UI & State

- [ ] **Create top-level `<AppShell>`** – header placeholder, toast region, responsive container, dark-mode toggle.
- [ ] **Implement Supabase auth wrapper (client-only)** – anonymous session for attendees; JWT-based organiser session if logged-in.
- [ ] **Add global React Query provider** – configure default stale/retry times, hook into Supabase Realtime for websocket invalidation.

### Organiser Wizard

- [ ] **Step 1 UI – Event Details** – form for title, date, start/end time; validation and optimistic draft save.
- [ ] **Step 2 UI – Rooms** – dynamic list input, capacity field, drag to reorder; add/remove rows.
- [ ] **Step 3 UI – Time Blocks** – time-range picker, automatic duration hint, conflict detection.
- [ ] **Wizard progress persistence** – resume where organiser left off via `wizardStage` field.
- [ ] **Generate event access URL slug** – `/e/{shortId}` route, collision-safe 6-char code.
- [ ] **Create QR code component** – SVG-based QR, copy link button, download PNG option.

### Attendee On-Boarding

- [ ] **Landing page for QR visitors** – auto-fetch event details, show name/email optional form, continue button.
- [ ] **Persist attendee record** – insert anonymous attendee row, store id in `localStorage` for reconnect.
- [ ] **Interest & topic entry form** – chips input for interests, multiline textbox for proposed topic, submit handler.
- [ ] **Thank-you redirect to Voting Board** – navigate after initial submission or “Skip”.

### Voting Board

- [ ] **Board layout grid** – responsive masonry list of topic cards sorted by vote count desc.
- [ ] **Up-vote button mechanics** – single click adds `Vote`, disables if already voted, optimistic UI.
- [ ] **Real-time vote updates via Supabase channel** – subscribe to `insert`/`delete` on `Vote`, patch counts within < 5 s SLA.
- [ ] **Topic card kebab menu (organiser)** – “Delete topic” action triggers soft delete mutation.
- [ ] **Evaluation countdown timer** – display remaining seconds; organiser can “Lock Now”.
- [ ] **Locked state banner & freeze interaction** – disable vote/submit inputs once locked.

### AI Topic Suggestions

- [ ] **Cluster interests endpoint (Edge Function)** – POST interests array, return array of grouped keywords.
- [ ] **Generate candidate topics with OpenAI** – prompt GPT-4.1 for up to 5 concise session titles; safety check length.
- [ ] **Cron job (supabase scheduler) to run every N seconds** – insert AI topics until locked.
- [ ] **Deduplicate AI titles** – Levenshtein similarity check server-side before insert.
- [ ] **Visual badge on AI-generated cards** – small “AI” chip next to title.

### Topic Lock & Scheduling

- [ ] **Lock mutation** – set `isLocked=true` for winning topics, record lock timestamp.
- [ ] **Greedy scheduling algorithm service** – assign topics to first-fit room/time slot without overlap.
- [ ] **Conflict detection unit tests** – verify algorithm produces unique (room, time) pairs.
- [ ] **Persist `Session` rows from schedule** – create records with references to rooms/blocks.
- [ ] **Broadcast “schedule-ready” event** – Supabase channel push to all clients.

### Schedule Grid View

- [ ] **Grid UI component** – rows = rooms, columns = time blocks, cards show session titles.
- [ ] **Session card deep-link** – click opens `/session/{id}` workspace.
- [ ] **Sticky header with share button** – copy public schedule link to clipboard.

### Session Workspace

- [ ] **Markdown notes editor** – textarea with preview toggle, autosave every 5 s to `Note` record.
- [ ] **Collaborative note merging** – last-write-wins strategy using updatedAt; display “edited by X sec ago” hint.
- [ ] **5-star rating widget** – click sets attendee-specific rating in `SessionRating` table.
- [ ] **View-only mode if event over** – disable editor after session end time.

### Live Updates Infrastructure

- [ ] **Supabase Realtime client abstraction** – hook to listen on arbitrary table events with auth token.
- [ ] **Reconnect & back-off strategy** – exponential retry on websocket drop, UI toast if offline > 30 s.

### Daily Recap

- [ ] **Aggregate notes & votes server function** – SQL query to collate top takeaways and engagement stats.
- [ ] **Generate Markdown → PDF** – use `@react-pdf/renderer`, embed event logo, agenda, session summaries.
- [ ] **Storage & share link** – upload PDF to Supabase Storage, make public, store URL on `Event`.
- [ ] **Email organiser with recap link** – Supabase SMTP add-on or webhook to external mail service.

### Quality & Accessibility

- [ ] **Keyboard navigation audit** – ensure tab order & ARIA roles on wizard, board, schedule.
- [ ] **Color-contrast check** – verify Tailwind palette meets WCAG AA for text & icons.
- [ ] **Unit test scaffolding with Vitest** – snapshot tests for components, mock Supabase client.
- [ ] **E2E smoke test with Playwright** – QR page → voting → lock → schedule flow in headless Chrome.

### Deployment & Ops

- [ ] **Vercel project integration** – connect repo, set environment variables, enable preview deployments.
- [ ] **Staging Supabase branch** – separate database schema/app for QA, sync migrations nightly.
- [ ] **Performance budget monitoring** – add Lighthouse CI GitHub Action, fail PR if TTI > 4 s.
- [ ] **Error tracking hook-up** – add Sentry SDK, source maps, environment tags (prod/stage).
- [ ] **Analytics event funnel** – log QR hits, board interactions, schedule views to Supabase `Analytics` table.

### Finishing Touches

- [ ] **Responsive testing on mobile & tablet** – verify tap targets >= 44 px, QR page fits small screens.
- [ ] **Iconography pass** – replace placeholder SVGs with Lucide icons, confirm semantic usage.
- [ ] **Final content copy review** – proof-read default text, error messages, and email templates.
- [ ] **Release checklist & version tag** – produce CHANGELOG, bump semver, create Git tag `v1.0.0`.
