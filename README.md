# eLSA → MyClub Converter

A web application to convert eLSA basketball schedule Excel files to MyClub-compatible import format.

## Tech Stack

- **Next.js** 15.x - React framework
- **React** 19.x - UI library  
- **TypeScript** 5.x - Type safety
- **SCSS** - Styling with CSS modules
- **formidable** - File upload handling
- **xlsx** - Excel file processing (SheetJS CDN)
- **React Icons** - Icon components

### Prerequisites

- Node.js 22.19.0 (see `.nvmrc`)
- npm (comes with Node.js)

## Project Structure

```
elsa-myclub/
├── __tests__/                # Tests and test data
│   ├── mocks/                # Mock data for tests
│   ├── pages/                # Page component tests
│   ├── shared/               # Shared component tests
│   └── utils/                # Utility function tests
├── components/               # React components with styles and tests
│   ├── BackLink/             # Navigation back link
│   ├── Footer/               # Site footer
│   ├── Form/                 # Form components
│   │   ├── Button/           # Button component
│   │   ├── FileUpload/       # File upload field
│   │   ├── SelectField/      # Select dropdown field
│   │   ├── SelectOrInput/    # Switchable select/input field
│   │   ├── TextInput/        # Text input field
│   │   └── UploadForm/       # Main upload form
│   ├── Head/                 # HTML head component
│   ├── Header/               # Site header
│   ├── Info/                 # Expandable info sections
│   ├── Layout/               # Page layout wrapper
│   └── Preview/              # Data preview table
├── config/
│   ├── groups.json           # MyClub group names (HNMKY teams)
│   └── index.ts              # Site configuration
├── pages/
│   ├── _app.tsx              # Next.js app wrapper
│   ├── _document.tsx         # HTML document structure
│   ├── index.tsx             # Main converter page
│   ├── docs.tsx              # Documentation page
│   ├── changelog.tsx         # Version history page
│   └── api/
│       ├── preview.ts        # File preview API
│       └── upload.ts         # File conversion API
├── public/
│   ├── images/               # Static images
│   │   └── docs/             # Documentation screenshots
│   └── favicon.ico           # Site favicon
├── styles/
│   ├── shared/               # Shared SCSS modules
│   ├── globals.scss          # Global styles
│   └── variables.scss        # SCSS variables
├── utils/
│   ├── excel.ts              # Excel parsing and conversion
│   └── error.ts              # Error handling utilities
├── jest.config.js            # Jest test configuration
├── jest.setup.js             # Test environment setup
└── .github/workflows/        # CI/CD GitHub Actions
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

Install Node.js 22.19.0 and run:

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
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
