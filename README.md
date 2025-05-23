# ELSA → MyClub Excel Converter

A tool to convert ELSA basketball schedule Excel files to MyClub format.

## Tech Stack

- [Next.js](https://nextjs.org/) 15.x
- [React](https://react.dev/) 19.x
- [TypeScript](https://www.typescriptlang.org/) 5.x (strict mode)
- [formidable](https://www.npmjs.com/package/formidable) 3.x (file upload handling)
- [xlsx](https://sheetjs.com) 0.20.3 (Excel file processing from SheetJS CDN)
- [React Icons](https://react-icons.github.io/react-icons/) 5.x (Icon components)

### Prerequisites

- Node.js version as defined in `.nvmrc`
- Vercel CLI (`npm i -g vercel`)

### Project structure:

```
elsa-myclub/
├── __tests__/                # Tests and test data
│   ├── mocks/                # Mock data for tests
│   │   └── test-data.ts
│   └── utils/                # Utility function tests
│       └── excel.test.ts
├── components/               # React components with their styles and tests
│   └── Form/
│       ├── UploadForm/       # Upload form component, styles, and tests
│       │   ├── UploadForm.tsx
│       │   ├── UploadForm.module.scss
│       │   └── __tests__/
│       │       └── UploadForm.test.tsx
│       ├── FileUpload/      # File upload field component
│       ├── SelectField/     # Select field component
│       └── SelectOrInput/   # Select or input switchable field
├── config/
│   ├── groups.json          # MyClub group names
│   └── index.ts             # Other site configurations
├── pages/
│   ├── index.tsx            # Main page
│   ├── changelog.tsx        # Changelog page
│   └── api/
│       ├── preview.ts       # File preview API handler
│       └── upload.ts        # File conversion handler
├── public/
│   └── images/              # App icons and logos
├── styles/
│   ├── shared/              # Shared style modules
│   ├── globals.scss         # Global styles
│   └── variables.scss       # Variables for styles
├── utils/                   # Shared utility functions
│   ├── excel.ts             # Excel parsing and conversion utilities
│   └── error.ts             # Centralized error messages and logging
├── jest.config.js           # Jest test configuration
├── jest.setup.js            # Test environment setup
└── .github/
    └── workflows/           # CI/CD configurations
        └── test.yml         # GitHub Actions test workflow
```

### Excel File Requirements

Input file should have columns as they were in ELSA export file 2024-12-31:

- `Pvm` - Date (e.g., "22.09" or "29,09")
- `Klo` - Time (e.g., "18:30")
- `Kenttä` - Venue
- `Koti` - Home team
- `Vieras` - Away team
- `Sarja` - Division/Series

Output will be an excel file in the format of MyClub importable file, columns and rows combined and mutated from the provided ELSA excel file.

### Development

Use node version defined in `.nvmrc`:

```bash
nvm use
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000

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

### Deployment

Deploy to Vercel (practically git push to main should do the same):

```bash
npm run deploy
```

## Configuration

##

### MyClub groups names

1. Ask from organization's office a list of team names (MyClub groups) for the
   current season and update them to `config/groups.json`.

## Testing

The project uses Jest and React Testing Library for testing. Tests are located:

- Component tests: `components/**/__tests__/`
- Utility tests: `utils/__tests__/`
- Mock data: `__mocks__/`

### Running Tests

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### CI/CD

Tests are automatically run on GitHub Actions for:

- All pushes to main branch
- All pull requests

See `.github/workflows/test.yml` for CI configuration.

### Credits

Created by [Timo Kirkkala](https://github.com/kirkkala) (timo.kirkkala@gmail.com) to help basketball team managers save time when importing game schedules to MyClub.
