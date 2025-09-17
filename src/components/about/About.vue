<template>
  <div>
    <div class="welcome">
      <div>
        <img src="/wngtools-icon.png" :alt="t('welcome.logoAlt')" width="128" height="128" />
      </div>
      <h2>{{ t('welcome.title') }}</h2>
      <p>{{ t('welcome.description') }}</p>
      <p>V:{{ Wversion }}</p>
      <p>
        <el-link @click="openGithub">
          <img src="/github.svg" alt="GitHub" />
          <div>{{ t('welcome.github') }}</div>
        </el-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import i18n from '../../i18n/index';
import { invoke } from '@tauri-apps/api/core';

const t = i18n.t;

const openGithub = async () => {
  await invoke('shell_open_github');
};

const Wversion = await invoke('get_version');
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
