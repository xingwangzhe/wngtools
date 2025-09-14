import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Menu } from '@tauri-apps/api/menu';
import i18n from '../i18n/index';

export const filespace = {
  id: 'toggle',
  text: i18n.t('tray.createFileTransfer'),
  action: async () => {
    // 构建菜单（注意：只构建，绑定后会调用菜单 action）
    const menu = await Menu.new({
      items: [
        {
          id: 'files-open-files',
          text: i18n.t('tray.fileTransferStation'),
          action: async () => {
            try {
              const w = await WebviewWindow.getByLabel('filespace');
              if (w) {
                // 通知渲染进程切换到 files 页面
                await w.emit('menu:open-files', {});
              }
            } catch (e) {
              console.error('files-open-files action error:', e);
            }
          },
        },
        {
          id: 'files-open-settings',
          text: i18n.t('tray.settings'),
          action: async () => {
            try {
              const w = await WebviewWindow.getByLabel('filespace');
              if (w) {
                // 通知渲染进程切换到 settings 页面
                await w.emit('menu:open-settings', {});
              }
            } catch (e) {
              console.error('files-open-settings action error:', e);
            }
          },
        },
      ],
    });
    const fileWindow = new WebviewWindow('filespace', {
      title: i18n.t('tray.fileTransferStation'),
      width: 800,
      height: 600,
      alwaysOnTop: true,
      visible: true,
      resizable: true,
      decorations: true,
      url: '/filespace',
    });
    fileWindow.once('tauri://created', async () => {
      await menu.setAsWindowMenu(fileWindow);
    });
  },
};
