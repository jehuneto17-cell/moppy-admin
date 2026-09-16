// Service worker mínimo só pra habilitar "Instalar app" no navegador —
// sem cache/offline (o admin sempre precisa de dados ao vivo do Firestore).
self.addEventListener("fetch", () => {});
