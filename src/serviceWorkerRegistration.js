export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      // fail silently; offline still works during dev if not registered
      console.warn('SW registration failed:', err)
    })
  }
}
