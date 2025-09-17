import { MenuItem } from '@tauri-apps/api/menu/menuItem';
import i18n from '../i18n/index';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
export const about: MenuItem = await MenuItem.new({
  id: 'about',
  text: i18n.t('tray.about'),
  action: async () => {
    try {
      const noteWindow = new WebviewWindow('about', {
        title: i18n.t('tray.note'),
        width: 900,
        height: 900,
        center: true,
        alwaysOnTop: true,
        visible: true,
        resizable: true,
        decorations: true,
        url: '/abouts',
      });
      console.log('Note window created:', noteWindow);
    } catch (error) {
      console.error('Failed to create note window:', error);
    }
  },
});
