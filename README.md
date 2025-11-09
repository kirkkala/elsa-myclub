# eLSA → MyClub Converter

A web application to convert eLSA basketball schedule Excel files to MyClub-compatible import format.

## Tech Stack

- **Next.js** 16.x - React framework with App Router
- **React** 19.x - UI library
- **TypeScript** 5.x - Type safety
- **SCSS** - Styling with CSS modules
- **formidable** - File upload handling
- **xlsx** - Excel file processing (SheetJS CDN)
- **React Icons** - Icon components

### Prerequisites

- Node.js (see `.nvmrc` for version)
- nvm (for node version management)
- npm (comes with Node.js)

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
├── styles/                 # Global SCSS styles
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

Use correct node version and install dependencies

```bash
nvm install
nvm use
npm install
```

### Environment Variables

Create a `.env.local` file to configure the application:

```bash
# Base URL for the application (used in sitemap.xml and robots.txt)
# Defaults to https://elsa-myclub.vercel.app if not set
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Run development mode

```bash
npm run dev
```

The app will be available at http://localhost:3000

### All available Scripts

```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting erros
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run format          # Format code with prettier
npm run format:check    # Check formatting with prettier
```

### Versioning

<details>
<summary>The app follows Semantic Versioning (SemVer)</summary>

```
Major version (x.0.0): Breaking changes
Minor version (0.x.0): New features
Patch version (0.0.x): Bug fixes
Beta suffix (-beta): Pre-release version
```

</details>

To update the version:

1. Update APP_VERSION in `package.json`
2. Add changelog entry in `CHANGELOG.md`

- Changelog in Finnish because that's shown on the app also

3. Commit with message: `Bump version to x.x.x`

## Configuration

### MyClub Team Names

Update `config/groups.json` with current season team names from your organization's MyClub setup.

### Deployment

The app auto-deploys to Vercel on pushes to main branch. Manual deployment:

```bash
vercel --prod
```

## Testing

Uses Jest and React Testing Library. Tests run automatically on GitHub Actions for all pushes and PRs.

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

Test locations:

- `components/**/__tests__/` - Component tests
- `__tests__/` - Page and utility tests

### Credits

Created by [Timo Kirkkala](https://github.com/kirkkala) to help basketball team managers save time when importing game schedules to MyClub.
