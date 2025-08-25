import { TrayIcon } from '@tauri-apps/api/tray';

const options = {
  // 你可以在这里添加一个托盘菜单、标题、任务提示、事件处理程序等等
};

const tray = await TrayIcon.new(options);
