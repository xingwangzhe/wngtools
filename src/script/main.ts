// import { Window } from "@tauri-apps/api/window"
import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { filespace } from './filespace';
import { autostart } from "./autostart";
// 直接创建系统托盘，不等待DOM加载完成
setupTray();

async function setupTray() {
  try {
    // 创建菜单项
    const quitItem = {
      id: 'quit',
      text: '退出'
    };
    
    // 创建菜单
    const menu = await Menu.new({
      items: [filespace, quitItem,autostart]
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
}