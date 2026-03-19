# Ranked Prep Assistant

Ranked Prep Assistant is a second-screen MVP for Rainbow Six Siege players who want a usable ranked prep board in under 90 seconds. Instead of acting like a wiki, it stays focused on the decisions that matter before operator select: map, side, site, stack size, comfort picks, bans, default lineup, role ownership, concise checklists, squad notes, and patch-aware context.

## Why this app exists

Ranked teams usually need three things fast:

1. A default plan that is good enough to trust without opening five tabs.
2. Ban suggestions that are explainable and adjustable.
3. A place to store squad-specific reminders without turning prep into admin work.

This MVP is built around those needs. Everything important is stored as structured data so map rotations, patch cards, sites, operators, and ban logic can evolve without scraping unofficial endpoints or hardcoding a single season into the UI.

## Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- shadcn-style UI components
- PostgreSQL
- Prisma ORM
- Zod
- React Hook Form
- Zustand
- Lucide icons
- Demo auth/session mode

## Product surfaces

- `/` dashboard
- `/prep` selector
- `/prep/[map]` map overview
- `/prep/[map]/[side]/[site]` tactical prep board
- `/bans` deterministic ban assistant
- `/playbook` squad playbooks
- `/playbook/[id]` squad detail and editing
- `/patches` patch-aware update feed
- `/admin` data management overview
- `/admin/maps`
- `/admin/sites`
- `/admin/operators`
- `/admin/strategies`
- `/admin/bans`
- `/admin/patches`

## Local setup

### Prerequisites

- Node.js 22+
- npm 10+
- Docker Desktop or any local PostgreSQL instance

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update values if needed.

```bash
cp .env.example .env
```

Default demo values:

- `DATABASE_URL` points to the included local Postgres setup
- `DEMO_USER_EMAIL` selects the seeded demo user shown in the UI
- `ENABLE_DEV_ADMIN=true` enables the admin content screens

### 3. Start PostgreSQL

Using the included Docker Compose file:

```bash
docker compose up -d
```

If you already have PostgreSQL running elsewhere, just point `DATABASE_URL` at it.

### 4. Create the schema

```bash
npm run db:push
```

### 5. Seed demo data

```bash
npm run db:seed
```

The seed adds:

- 5 maps
- 2 sites per map
- 16 demo operators
- ban rules across ranked bands
- 3 plan tabs per site per side
- patch update cards
- rotation events
- 2 squads
- saved notes
- custom playbook cards

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run db:push
npm run db:seed
npm run db:studio
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma |
| `DEMO_USER_EMAIL` | No | Chooses the seeded demo user for mock auth |
| `ENABLE_DEV_ADMIN` | No | Enables or disables the admin area |

## Database model overview

The Prisma schema includes the required models from the spec:

- `User`
- `Squad`
- `SquadMember`
- `Map`
- `Site`
- `Operator`
- `StrategyCard`
- `StrategyStep`
- `BanRule`
- `PatchNote`
- `MapRotationEvent`
- `SavedNote`

It also adds:

- `PlaybookCard`

`PlaybookCard` stores squad-specific named strategy cards so the `/playbook/[id]` route can act as a true squad playbook editor without overloading the curated `StrategyCard` content.

## Architecture

### App router structure

- `src/app` holds routes and route-level shells
- `src/components` contains reusable UI, tactical cards, and client forms
- `src/actions` contains server actions for playbook and admin CRUD
- `src/lib/services` contains the query and recommendation layer
- `src/lib/validation` holds Zod schemas
- `src/store` holds the recent-plans Zustand store
- `prisma` contains schema and seed data

### Recommendation logic

Ban recommendations live in `src/lib/services/ban-assistant.ts`.

The logic is deterministic and explainable:

- map-specific default rules come from seeded `BanRule` rows
- rank-band specific rules override or reinforce the baseline
- playstyle adds transparent modifiers
- stack size affects info and coordination pressure
- comfort operators are protected from self-bans
- role coverage checks adjust bans when the comfort pool lacks hard breach, flank watch, or denial

### Auth choice

This MVP uses demo auth on purpose. It keeps user-owned squads and notes working without slowing the build with a full auth integration. Replacing it with Supabase Auth later is straightforward because user ownership already exists in the schema and server actions.

## Assumptions made for the MVP

- Playbooks are squad-centric, so `/playbook/[id]` is the squad board.
- Strategy content is seeded for both attack and defense, even though the minimum seed requirement only demanded three cards per site.
- The admin area is dev-focused and functional rather than heavily polished.
- Patch cards are clearly framed as curated demo prep guidance, not official patch summaries or win-rate data.
- Local auth is mocked through a seeded demo user to keep the MVP moving fast.

## Future roadmap

- Replace demo auth with Supabase Auth
- Add richer player switching and squad ownership controls
- Add import/export for playbook cards
- Add seasonal content versioning and archival views
- Add map screenshots and richer visual callouts
- Add analyst-facing validation tools for conflicting strategy cards
- Add optional ingestion workflows for official or manually maintained patch sources

## Notes for extension

- Map rotation is data-driven through `Map` and `MapRotationEvent`
- Patch feed is data-driven through `PatchNote`
- Ban logic is intentionally isolated in a service layer
- Strategy tabs are driven by structured JSON and `StrategyStep` rows
- Recent plans are stored locally in Zustand for fast repeat access
