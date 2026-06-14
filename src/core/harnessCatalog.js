export const HARNESS_CATALOG = {
  frontend_ui: {
    id: 'frontend-ui-engineering',
    trigger: (fingerprint) => ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt'].includes(fingerprint.framework),
    symptom: 'Complex UI framework detected without explicit UI engineering guards.',
    fixStrategy: 'Activate the `frontend-ui-engineering` skill to ensure production-quality components and state management.',
  },
  chrome_devtools: {
    id: 'chrome-devtools',
    trigger: (fingerprint) => true, // Always good for web projects
    symptom: 'Web project detected. Agent lacks live browser validation.',
    fixStrategy: 'Activate the `chrome-devtools` skill or `browser-testing-with-devtools` to allow the agent to run and inspect the app locally.',
  },
  a11y_debugging: {
    id: 'a11y-debugging',
    trigger: (fingerprint) => true, // Accessibility is universally important
    symptom: 'High risk of inaccessible modals, missing ARIA tags, and bad contrast.',
    fixStrategy: 'Activate the `a11y-debugging` skill so the agent can use Chrome DevTools to audit accessibility properly.',
  },
  performance_lcp: {
    id: 'debug-optimize-lcp',
    trigger: (fingerprint) => ['next', 'nuxt', 'gatsby'].includes(fingerprint.framework),
    symptom: 'SSR/SSG framework detected (e.g. Next.js). High risk of LCP / Web Vitals regressions.',
    fixStrategy: 'Activate `debug-optimize-lcp` skill to ensure image optimization and Core Web Vitals are tested.',
  }
};
