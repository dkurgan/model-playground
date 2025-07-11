# Model Playground

A React-based playground for testing and comparing AI models with real-time streaming chat capabilities.

## Architecture

[View Architecture Diagram](https://excalidraw.com/#json=Vq0I1ZyR8nEmChzaK8Ciz,dgSLDlSl8cBXathewlTgxw)

## Features

- Real-time streaming chat interface
- Model comparison and performance metrics
- History tracking with model change detection
- Network statistics and cost monitoring
- Support for multiple AI model providers

## Tech Stack

- React + TypeScript + Vite
- Real-time streaming with Server-Sent Events
- Context-based state management
- Responsive design

## Development

This project uses Vite for fast development and HMR (Hot Module Replacement).

### Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### ESLint Configuration

The project includes ESLint with TypeScript support. For production applications, consider enabling type-aware lint rules by updating the configuration to use `recommendedTypeChecked` or `strictTypeChecked`.