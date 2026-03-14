# eLSA → MyClub Converter

A web application to convert eLSA basketball schedule Excel files to MyClub-compatible import format.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Material UI 7** (MUI) for components and styling
- **xlsx** (SheetJS) for Excel processing
- **Jest** + React Testing Library
- **Biome** for linting and formatting

### Prerequisites

- **Node.js** (version in `.nvmrc`, e.g. `nvm use`)
- **pnpm** – install with `npm install -g pnpm` or enable [Corepack](https://nodejs.org/api/corepack.html): `corepack enable`

## Project Structure

```
elsa-myclub/
├── __tests__/              # Jest tests
├── app/                    # Next.js App Router
│   ├── api/                # API routes (preview, upload)
│   ├── changelog/          # Version history page
│   ├── docs/               # Documentation page
│   └── page.tsx            # Main converter page
├── components/             # React components
│   ├── Form/               # Form fields (FileUpload, Select, etc.)
│   └── ...                 # Layout, Header, Footer, Preview
├── config/                 # App configuration & group data
├── public/                 # Static assets
├── theme/                  # MUI theme configuration
└── utils/                  # Excel parsing & error handling
```

## How It Works

The application converts eLSA basketball schedule Excel files to MyClub-compatible format:

**Input**: eLSA Excel export with columns:

- `Pvm` - Date (e.g., "22.09")
- `Klo` - Time (e.g., "18:30")
- `Kenttä` - Venue
- `Koti` - Home team
- `Vieras` - Away team
- `Sarja` - Division/Series

**Output**: MyClub-compatible Excel file with converted data, proper formatting, and user-configured settings (team, year, meeting times, etc.).

## Development

```bash
nvm use              # Use correct Node version
pnpm install         # Install dependencies
pnpm dev             # Start dev server at http://localhost:3000
```

### Environment Variables (Optional)

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Defaults to production URL
```

### Available Scripts

```bash
pnpm dev              # Development server
pnpm build            # Production build
pnpm start            # Production server
pnpm lint             # Check lint and format
pnpm lint:fix         # Fix and format
pnpm test             # Run tests
pnpm test:watch       # Tests in watch mode
pnpm test:coverage    # Coverage report
```

### Versioning

Follows [Semantic Versioning](https://semver.org/). To release a new version:

1. Update `version` in `package.json`
2. Add entry to `CHANGELOG.md` (in Finnish)
3. Commit: `Bump to version x.x.x`

## Configuration

**Team Names**: Update `config/groups.json` with your organization's MyClub team names.

## Deployment

Push to `main` deploy automatically to Vercel. For manual deployment use [vercel cli](https://vercel.com/docs/cli):

```bash
vercel --prod
```

## Testing

Tests run automatically on GitHub Actions. Local testing:

```bash
pnpm test              # All tests
pnpm test:watch        # Watch mode
pnpm test:coverage      # Coverage report
```

## Code Quality

Biome handles linting and formatting:

```bash
pnpm lint              # Check for issues
pnpm lint:fix          # Auto-fix and format
```

Configuration is in `biome.json`.

## Credits

Created by [Timo Kirkkala](https://github.com/kirkkala) to help basketball team managers save time importing game schedules to MyClub.
