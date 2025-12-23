# eLSA → MyClub Converter

A web application to convert eLSA basketball schedule Excel files to MyClub-compatible import format.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Material UI 7** (MUI) for components and styling
- **xlsx** (SheetJS) for Excel processing
- **Jest** + React Testing Library
- **ESLint** with TypeScript and React Compiler plugins

### Prerequisites

- Node.js (version in `.nvmrc`)
- npm

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
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
```

### Environment Variables (Optional)

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Defaults to production URL
```

### Available Scripts

```bash
npm run dev            # Development server
npm run build          # Production build
npm run start          # Production server
npm run lint           # Check linting
npm run lint:fix       # Fix linting errors
npm test               # Run tests
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Coverage report
npm run format         # Format with Prettier
npm run format:check   # Check formatting
```

### Versioning

Follows [Semantic Versioning](https://semver.org/). To release a new version:

1. Update `version` in `package.json` and run `npm i`
2. Add entry to `CHANGELOG.md` (in Finnish)
3. Commit: `Bump version to x.x.x`

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
npm test               # All tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## Code Quality

ESLint is configured with strict TypeScript rules and React Compiler support:

```bash
npm run lint           # Check for issues
npm run lint:fix       # Auto-fix issues
npm run format         # Format with Prettier
```

Configuration is in `eslint.config.js` using the flat config format.

## Credits

Created by [Timo Kirkkala](https://github.com/kirkkala) to help basketball team managers save time importing game schedules to MyClub.
