<template>
  <div>
    <div class="welcome">
      <div>
        <img src="/wngtools-icon.png" :alt="t('welcome.logoAlt')" width="128" height="128" />
      </div>
      <h2>{{ t('welcome.title') }}</h2>
      <p>{{ t('welcome.description') }}</p>
    </div>
    <div>{{ t('welcome.click') }}</div>
  </div>
</template>

<script setup>
import i18n from '../../i18n/index';

const { t } = i18n.global;
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
