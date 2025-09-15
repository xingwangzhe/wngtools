import i18n from 'i18next';
import zhCN from '../../locales/zh-CN.json';
import zhHK from '../../locales/zh-HK.json';
import en from '../../locales/en.json';

// 自动检测系统语言
function detectSystemLanguage(): string {
  // 检查是否在浏览器环境中
  if (typeof navigator !== 'undefined') {
    // 获取浏览器语言设置
    const language = navigator.language || navigator.languages?.[0] || 'en';

    // 根据完整的语言代码进行匹配
    const lowerLang = language.toLowerCase();

    if (lowerLang.startsWith('zh-cn') || lowerLang.startsWith('zh-hans')) {
      return 'zh-CN';
    } else if (
      lowerLang.startsWith('zh-hk') ||
      lowerLang.startsWith('zh-tw') ||
      lowerLang.startsWith('zh-hant') ||
      lowerLang.startsWith('zh-mo')
    ) {
      return 'zh-HK';
    } else if (lowerLang.startsWith('zh')) {
      // 默认情况下，如果只是 'zh'，默认简体
      return 'zh-CN';
    }

    // 其他语言默认英语
    return 'en';
  }

  // 默认返回英语
  return 'en';
}

// 获取检测到的系统语言
const systemLanguage = detectSystemLanguage();
console.log('🌐 前端检测到的系统语言:', systemLanguage);
console.log(
  '🌐 navigator.language:',
  typeof navigator !== 'undefined' ? navigator.language : 'undefined'
);

i18n.init({
  lng: systemLanguage,
  fallbackLng: 'en',
  resources: {
    'zh-CN': {
      translation: zhCN,
    },
    'zh-HK': {
      translation: zhHK,
    },
    en: {
      translation: en,
    },
  },
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

// Tauri 相关功能
async function sendLanguageToBackend(languageCode: string, retryCount = 0) {
  console.log(`📤 尝试发送语言到后端: ${languageCode} (尝试 ${retryCount + 1})`);

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    console.log('📤 调用 set_language_from_frontend 命令...');
    await invoke('set_language_from_frontend', { languageCode });
    console.log('✅ 语言信息已成功发送到后端:', languageCode);
    return true;
  } catch (error) {
    console.error('❌ 发送语言信息到后端失败:', error);

    // 如果失败且重试次数小于3，则重试
    if (retryCount < 3) {
      console.log(`🔄 重试发送语言信息 (${retryCount + 1}/3)...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sendLanguageToBackend(languageCode, retryCount + 1);
    }
    return false;
  }
}

// 监听后端的语言请求
async function setupBackendLanguageListener() {
  try {
    console.log('🎧 设置后端语言请求监听器...');
    const { listen } = await import('@tauri-apps/api/event');
    await listen('request-language', async () => {
      console.log('📨 收到后端语言请求，发送当前语言:', systemLanguage);
      await sendLanguageToBackend(systemLanguage);
    });
    console.log('✅ 后端语言监听器已设置');
  } catch (error) {
    console.error('❌ 设置后端语言监听器失败:', error);
  }
}

// 等待 Tauri 环境完全准备就绪
async function waitForTauriReady(maxAttempts = 30) {
  console.log('⏳ 等待 Tauri 环境准备就绪...');

  for (let i = 0; i < maxAttempts; i++) {
    try {
      // 尝试调用一个简单的 Tauri API 来确认环境就绪
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('get_supported_languages');
      console.log('✅ Tauri 环境已准备就绪');
      return true;
    } catch (error) {
      console.log(`⏳ 等待 Tauri 环境... (尝试 ${i + 1}/${maxAttempts})`);
      // 如果失败，继续等待
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  console.log('❌ Tauri 环境准备超时');
  return false;
}

// 初始化时发送语言信息到后端
async function initializeLanguageSync() {
  console.log('🚀 开始初始化语言同步...');
  console.log('🌐 要发送的语言:', systemLanguage);

  // 等待 Tauri 环境完全准备就绪
  const isReady = await waitForTauriReady();

  if (!isReady) {
    console.error('❌ Tauri 环境未就绪，跳过语言同步');
    return;
  }

  try {
    // 设置监听器以响应后端请求
    await setupBackendLanguageListener();

    // 发送当前语言到后端
    console.log('📤 向后端发送语言信息:', systemLanguage);
    const success = await sendLanguageToBackend(systemLanguage);

    if (success) {
      console.log('✅ 语言同步初始化成功');
    } else {
      console.error('❌ 语言同步初始化失败');
    }
  } catch (error) {
    console.error('❌ 初始化语言同步失败:', error);
  }
}

// 确保在 DOM 加载完成后启动语言同步
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initializeLanguageSync, 100);
    });
  } else {
    // DOM 已经加载完成
    setTimeout(initializeLanguageSync, 100);
  }
} else {
  // 在非浏览器环境中立即执行
  initializeLanguageSync();
}

export default i18n;
