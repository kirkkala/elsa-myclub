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
├── components/         # React components with their styles
├── config.ts           # App configuration and constants
├── pages/
│   ├── index.tsx       # Main page
│   ├── changelog.tsx   # Changelog page
│   └── api/
│       └── upload.ts   # File conversion handler
├── public/
│   └── images/         # App icons and logos
└── styles/
    ├── globals.scss    # Global styles
    └── variables.scss  # Variables for styles
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

### Credits

Created by [Timo Kirkkala](https://github.com/kirkkala) (timo.kirkkala@gmail.com) to help basketball team managers save time when importing game schedules to MyClub.
