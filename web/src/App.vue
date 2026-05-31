<script setup lang="ts">
const externalAppUrl = (port: number) => {
  if (typeof window === "undefined") {
    return "/";
  }

  const protocol = window.location.protocol || "http:";
  return `${protocol}//${window.location.hostname}:${port}/`;
};
</script>

<template>
  <nav class="app-launcher" aria-label="App launcher">
    <RouterLink to="/portfolio">Portfolio</RouterLink>
    <a :href="externalAppUrl(8081)" target="_blank" rel="noreferrer">Cycle Food</a>
    <a :href="externalAppUrl(8082)" target="_blank" rel="noreferrer">Moguratataki</a>
  </nav>

  <router-view />
</template>

<style scoped>
.app-launcher {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  max-width: calc(100vw - 32px);
}

.app-launcher a {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid rgba(132, 144, 191, 0.28);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #5c6389;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 10px 28px rgba(80, 87, 130, 0.12);
  backdrop-filter: blur(12px);
}

.app-launcher a:hover {
  color: #4654c8;
  border-color: rgba(117, 129, 238, 0.52);
  background: rgba(255, 255, 255, 0.95);
}

@media (max-width: 640px) {
  .app-launcher {
    top: 8px;
    right: 8px;
  }

  .app-launcher a {
    min-height: 32px;
    padding: 7px 9px;
    font-size: 12px;
  }
}
</style>
