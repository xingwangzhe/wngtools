import { MenuItem } from '@tauri-apps/api/menu/menuItem';
import { exit, relaunch } from '@tauri-apps/plugin-process';
import i18n from '../i18n/index';

export const restartItem: MenuItem = await MenuItem.new({
  id: 'restartItem',
  text: i18n.t('tray.restartApp'),
  action: async () => {
    try {
      await relaunch();
    } catch {
      exit(0); // 退出应用，依赖操作系统或启动器重新启动
    }
  },
});
