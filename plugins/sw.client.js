export default defineNuxtPlugin(() => {
  if (process.client && 'serviceWorker' in navigator) {
    const register = () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .catch((err) => console.error('SW register failed:', err));
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }
});


