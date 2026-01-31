export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Use import.meta.env.BASE_URL to get the correct base path
    const swPath = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker.register(swPath).catch((err) => {
      // fail silently; offline still works during dev if not registered
      console.warn('SW registration failed:', err)
    })
  }
}
