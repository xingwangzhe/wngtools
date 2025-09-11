import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Menu } from '@tauri-apps/api/menu';

export const filespace = {
  id: 'toggle',
  text: '创建文件中转',
  action: async () => {
    // 构建菜单（注意：只构建，绑定后会调用菜单 action）
    const menu = await Menu.new({
      items: [
        {
          id: 'files-open-files',
          text: '文件中转站',
          action: async () => {
            try {
              const w = await WebviewWindow.getByLabel('filespace');
              if (w) {
                // 通知渲染进程切换到 files 页面
                await w.emit('menu:open-files', {});
                await w.show();
                await w.setFocus();
              }
            } catch (e) {
              console.error('files-open-files action error:', e);
            }
          },
        },
        {
          id: 'files-open-settings',
          text: '设置',
          action: async () => {
            try {
              const w = await WebviewWindow.getByLabel('filespace');
              if (w) {
                // 通知渲染进程切换到 settings 页面
                await w.emit('menu:open-settings', {});
                await w.show();
                await w.setFocus();
              }
            } catch (e) {
              console.error('files-open-settings action error:', e);
            }
          },
        },
      ],
    });
    const fileWindow = new WebviewWindow('filespace', {
      title: '文件中转站',
      width: 400,
      height: 300,
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
