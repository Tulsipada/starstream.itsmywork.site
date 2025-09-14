/**
 * Deployment Configuration for tulsipada.in
 * Cinesaga - Modern Streaming Platform
 * 
 * Developer: tulsipada
 * Website: https://tulsipada.in
 * Repository: https://github.com/tulsipada/cinesaga
 */

export default {
  // Production deployment settings
  production: {
    domain: 'tulsipada.in',
    baseUrl: 'https://tulsipada.in',
    buildCommand: 'npm run build:prod',
    outputDir: 'dist',
    deployCommand: 'npm run deploy',

    // Performance settings
    compression: true,
    minification: true,
    sourceMaps: false,

    // SEO settings
    metaTags: {
      title: 'Cinesaga - Modern Streaming Platform',
      description: 'Experience the future of streaming with Cinesaga. Watch trending movies, popular shows, and exclusive original content.',
      keywords: 'streaming, movies, tv shows, entertainment, cinesaga, tulsipada',
      author: 'tulsipada',
      ogImage: '/src/assets/heroes/hero-dragon.jpg'
    }
  },

  // Development deployment settings
  development: {
    domain: 'dev.tulsipada.in',
    baseUrl: 'https://dev.tulsipada.in',
    buildCommand: 'npm run build:dev',
    outputDir: 'dist',
    deployCommand: 'npm run deploy:dev',

    // Development settings
    compression: false,
    minification: false,
    sourceMaps: true,

    // Debug settings
    debug: true,
    verbose: true
  },

  // GitHub Pages deployment
  githubPages: {
    repository: 'tulsipada/cinesaga',
    branch: 'gh-pages',
    domain: 'tulsipada.github.io/cinesaga',
    baseUrl: 'https://tulsipada.github.io/cinesaga',
    buildCommand: 'npm run build:prod',
    outputDir: 'dist',
    deployCommand: 'gh-pages -d dist'
  },

  // Build optimization settings
  optimization: {
    // Bundle analysis
    analyze: false,

    // Code splitting
    codeSplitting: true,

    // Tree shaking
    treeShaking: true,

    // Asset optimization
    imageOptimization: true,
    fontOptimization: true
  },

  // Environment variables
  env: {
    production: {
      NODE_ENV: 'production',
      VITE_APP_TITLE: 'Cinesaga',
      VITE_APP_DOMAIN: 'tulsipada.in',
      VITE_APP_API_URL: 'https://api.tulsipada.in'
    },
    development: {
      NODE_ENV: 'development',
      VITE_APP_TITLE: 'Cinesaga (Dev)',
      VITE_APP_DOMAIN: 'dev.tulsipada.in',
      VITE_APP_API_URL: 'https://dev-api.tulsipada.in'
    }
  },

  // Deployment checklist
  checklist: [
    '✅ Build passes without errors',
    '✅ All tests pass',
    '✅ Linting passes',
    '✅ Performance budget met',
    '✅ SEO meta tags configured',
    '✅ Analytics tracking setup',
    '✅ Error monitoring configured',
    '✅ SSL certificate valid',
    '✅ CDN configuration updated',
    '✅ Backup created'
  ]
};
