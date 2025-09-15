import i18n from 'i18next';
import zhCN from '../../locales/zh-CN.json';
import zhTW from '../../locales/zh-TW.json';
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
      lowerLang.startsWith('zh-tw') ||
      lowerLang.startsWith('zh-hant') ||
      lowerLang.startsWith('zh-hk') ||
      lowerLang.startsWith('zh-mo')
    ) {
      return 'zh-TW';
    } else if (lowerLang.startsWith('zh')) {
      // 默认情况下，如果只是 'zh'，根据地区判断，默认简体
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

i18n.init({
  lng: systemLanguage,
  fallbackLng: 'en',
  resources: {
    'zh-CN': {
      translation: zhCN,
    },
    'zh-TW': {
      translation: zhTW,
    },
    en: {
      translation: en,
    },
  },
});

export default i18n;
