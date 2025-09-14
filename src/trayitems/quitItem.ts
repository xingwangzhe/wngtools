import { MenuItem } from '@tauri-apps/api/menu/menuItem';
import { exit } from '@tauri-apps/plugin-process';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import i18n from '../i18n/index';

export const quitItem: MenuItem = await MenuItem.new({
  id: 'quitItem',
  text: i18n.t('tray.quitApp'),
  action: async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      // console.log('准备发送退出通知');
      try {
        await sendNotification({ title: 'Wngtools', body: i18n.t('tray.appClosed') });
        // console.log('退出通知发送成功');
      } catch (error) {
        // console.error('发送退出通知失败:', error);
      }
    }
    exit(1);
  },
});
