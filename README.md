# ELSA -> MyClub Basketball Schedule Converter

A tool to convert ELSA basketball schedule Excel files to MyClub format.

## Features

- Converts ELSA Excel files to MyClub format
- Automatically calculates game end times based on selected duration
- Handles various date formats (22.09, 29,09, 6.10, etc.)
- Formats division names (e.g., "III divisioona" → "III div.")
- Web-based interface with React

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
│   └── Home.module.css   (Styles for the frontend)
├── package.json          (project metadata and dependencies)
├── next.config.js        (Next.js configuration)
├── vercel.json           (Vercel configuration)
└── .nvmrc               (Node.js version specification)
```

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

### Deployment
Deploy to Vercel (practically git push to main should do the same):
```bash
npm run deploy
```

### Credits

Created by Timo Kirkkala (timo.kirkkala@gmail.com) to help basketball team managers save time when importing game schedules to MyClub.
