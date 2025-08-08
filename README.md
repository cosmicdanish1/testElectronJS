# Electron React TypeScript App

A basic Electron application built with React and TypeScript, using Vite as the build tool.

## Features

- ⚡ **Fast Development**: Hot reload with Vite
- 🔒 **Secure**: Context isolation and proper security practices
- 🎨 **Modern UI**: Beautiful gradient design with glassmorphism effects
- 📱 **Responsive**: Works on different screen sizes
- 🔧 **TypeScript**: Full type safety throughout the application

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will:
- Start the Vite dev server for the React app
- Compile the TypeScript main process
- Launch the Electron application

## Building for Production

To build the application for production:

```bash
npm run build
```

This will:
- Build the React app using Vite
- Compile the TypeScript main process
- Create a `dist` folder with the built application

## Running the Built Application

After building, you can run the production version:

```bash
npm start
```

## Project Structure

```
my-electron-react-ts/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.ts    # Main entry point
│   │   └── preload.ts  # Preload script for security
│   └── renderer/       # React renderer process
│       ├── App.tsx     # Main React component
│       ├── App.css     # Styles
│       └── main.tsx    # React entry point
├── dist/               # Built files (generated)
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config for renderer
├── tsconfig.main.json  # TypeScript config for main process
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:renderer` - Start only the Vite dev server
- `npm run dev:main` - Compile and run only the main process
- `npm run build` - Build for production
- `npm run build:renderer` - Build only the React app
- `npm run build:main` - Compile only the main process
- `npm start` - Run the built application

## Security Features

- Context isolation enabled
- Node integration disabled
- Preload script for secure IPC communication
- External links opened in default browser
- Window creation prevention

## Customization

- Modify `src/renderer/App.tsx` to change the UI
- Update `src/main/index.ts` to modify Electron behavior
- Edit `src/main/preload.ts` to add new IPC methods
- Customize styles in `src/renderer/App.css`

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Clear the dist folder: `rm -rf dist`
3. Rebuild the project: `npm run build`
4. Check the console for any error messages

## License

ISC 