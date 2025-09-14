import { MenuItem } from '@tauri-apps/api/menu/menuItem';
import { invoke } from '@tauri-apps/api/core';
import i18n from '../i18n/index';

export const about: MenuItem = await MenuItem.new({
  id: 'about',
  text: i18n.t('tray.about'),
  action: async () => {
    try {
      await invoke('show_window');
    } catch (error) {
      console.error('调用显示窗口命令失败:', error);
    }
  },
});
