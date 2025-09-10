# StarStream

A modern streaming platform built with React, TypeScript, and Vite. StarStream provides an immersive viewing experience with a sleek interface and smooth navigation.

## Features

- 🎬 **Movie Catalog** - Browse trending, popular, and original content
- 🎭 **Hero Section** - Dynamic carousel showcasing featured content
- 🎨 **Modern UI** - Built with Shadcn UI and Tailwind CSS
- 📱 **Responsive Design** - Optimized for all devices
- ⚡ **Fast Performance** - Powered by Vite and React

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI, Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd starstream-home
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── HeroSlider.tsx  # Main hero carousel
│   ├── VideoCarousel.tsx # Movie carousels
│   └── Navigation.tsx   # Top navigation
├── pages/              # Page components
├── data/               # JSON data files
├── assets/             # Images and media
└── hooks/              # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.