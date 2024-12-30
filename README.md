# ELSA -> MyClub Excel Converter

A tool to convert ELSA basketball schedule Excel files to MyClub format.

## Tech Stack

- [Next.js](https://nextjs.org/) 15.x
- [React](https://react.dev/) 19.x
- [TypeScript](https://www.typescriptlang.org/) 5.x (strict mode)
- [formidable](https://www.npmjs.com/package/formidable) 3.x (file upload handling)
- [xlsx](https://sheetjs.com) 0.20.3 (Excel file processing from SheetJS CDN)
- [React Icons](https://react-icons.github.io/react-icons/) 5.x (Icon components)

### Prerequisites
- Node.js version defined in `.nvmrc`
- Vercel CLI (`npm i -g vercel`)

### Project structure:
```
elsa-myclub/
├── pages/
│   ├── index.tsx         (React frontend for file upload)
│   └── api/
│       └── upload.ts     (API handler for file conversion)
├── styles/
│   └── Home.module.scss  (SCSS styles for the frontend)
├── package.json          (project metadata and dependencies)
├── next.config.js        (Next.js configuration)
├── tsconfig.json        (TypeScript configuration with strict mode)
├── vercel.json          (Vercel configuration)
└── .nvmrc               (Node.js version specification)
```

### TypeScript Configuration

The project uses strict TypeScript mode with additional type checking:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

### Excel File Requirements

Input file should have these columns:
- `Pvm` - Date (e.g., "22.09" or "29,09")
- `Klo` - Time (e.g., "18:30")
- `Kenttä` - Venue
- `Koti` - Home team
- `Vieras` - Away team
- `Sarja` - Division/Series

Output will have:
- `Tapahtuma` - Event (e.g., "III div. Honka/Gold - HNMKY/Stadi")
- `Alkaa` - Start (e.g., "22.09.2024 18:30:00")
- `Päättyy` - End (calculated based on duration)
- `Paikka` - Venue

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
1. Update APP_VERSION in `pages/index.tsx`
2. Add changelog entry in `pages/index.tsx`
3. Commit with message: `chore: bump version to x.x.x`


### Deployment
Deploy to Vercel (practically git push to main should do the same):
```bash
npm run deploy
```

### Credits

Created by [Timo Kirkkala](https://github.com/kirkkala) (timo.kirkkala@gmail.com) to help basketball team managers save time when importing game schedules to MyClub.
