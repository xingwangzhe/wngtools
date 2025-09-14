<template>
  <div>
    <div class="welcome">
      <div>
        <img src="/wngtools-icon.png" alt="Wngtools Logo" width="128" height="128" />
      </div>
      <h2>欢迎使用 Wngtools</h2>
      <p>这是一个 Tauri 应用，支持文件管理和主题同步。</p>
    </div>
    <div>点击,下次启动不再显示About页</div>
  </div>
</template>

<script setup>
// No script needed for now
</script>

<style>
.welcome {
  text-align: center;
  padding: 2rem;
}

.welcome h2 {
  color: var(--text-color);
}

.welcome p {
  color: var(--text-color);
  opacity: 0.8;
}
</style>
