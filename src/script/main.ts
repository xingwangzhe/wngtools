import { Window } from "@tauri-apps/api/window"
import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';

// 等待DOM加载完成后再创建托盘
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 创建菜单项
    const toggleItem = {
      id: 'toggle',
      text: '创建文件中转',
      action: async () => {
        const appWindow = new Window('filespace', {
          title: '文件中转站',
          width: 400,
          height: 300,
          alwaysOnTop: true,
          visible: true,
          resizable: true,
          decorations: true
        });
        appWindow.once('tauri://window-created', () => {
          console.log('文件中转窗口已创建');
        });
      }
    };

    const quitItem = {
      id: 'quit',
      text: '退出'
    };
    
    // 创建菜单
    const menu = await Menu.new({
      items: [toggleItem, quitItem]
    });

    // 配置托盘图标选项
    const options: any = {
      tooltip: 'Wngtools',
      menu: menu
    };

    // 尝试获取应用默认图标
    try {
      const icon = await defaultWindowIcon();
      if (icon) {
        options.icon = icon;
      }
    } catch (iconError) {
      console.warn('无法加载默认窗口图标:', iconError);
    }

    // 创建托盘图标
    const tray = await TrayIcon.new(options);
    console.log('系统托盘创建成功');
    
  } catch (error) {
    console.error('创建系统托盘失败:', error);
  }
});
