import { WebviewWindow } from "@tauri-apps/api/webviewWindow"

export const filespace = {
      id: 'toggle',
      text: '创建文件中转',
      action: async () => {
          // 检查是否已经存在同名窗口
          const existingWindow = await WebviewWindow.getByLabel('filespace');
          if (existingWindow) {
            // 如果窗口已存在，将其显示并聚焦
            await existingWindow.show();
            await existingWindow.setFocus();
            console.log('已存在文件中转窗口，已将其显示');
            return;
          }

          // 创建新窗口
          const appWindow = new WebviewWindow('filespace', {
            title: '文件中转站',
            width: 400,
            height: 300,
            alwaysOnTop: true,
            visible: true,
            resizable: true,
            decorations: true,
            url: '/filespace'  // 指定窗口打开/filespace页面
          });

          appWindow.once('tauri://created', () => {
            console.log('文件中转窗口已创建');
          });

          appWindow.once('tauri://error', (e) => {
            console.error('创建文件中转窗口时出错:', e);
          });
      }
};
