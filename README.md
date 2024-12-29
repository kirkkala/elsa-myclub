# Elsa > MyClub Basketball Schedule Converter

A tool to convert ELSA basketball schedule Excel files to MyClub format.

### Prerequisites
- Node.js version defined in `.nvmrc`
- Vercel CLI (`npm i -g vercel`)

### Project structure:
```
elsa-myclub/
├── api/
│   └── index.js          (Edge API handler for file conversion)
├── public/
│   └── index.html        (frontend form for file upload)
├── package.json          (project metadata and dependencies)
├── vercel.json           (Vercel configuration)
└── .nvmrc               (Node.js version specification)
```

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
