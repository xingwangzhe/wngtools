// import { Window } from "@tauri-apps/api/window"
import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { filespace } from './filespace';
import { autostart } from './autostart';
import { quitItem } from './quitItem';
import { restartItem } from './restart';
// 直接执行创建系统托盘的代码
try {
  // 创建菜单
  const menu = await Menu.new({
    items: [filespace, autostart, restartItem, quitItem],
  });

  // 配置托盘图标选项
  const options: any = {
    tooltip: 'Wngtools',
    menu: menu,
    icon: await defaultWindowIcon(),
  };
  // 创建托盘图标
  const _tray = await TrayIcon.new(options);
  // console.log('系统托盘创建成功');
} catch (error) {
  // console.error('创建系统托盘失败:', error);
}
