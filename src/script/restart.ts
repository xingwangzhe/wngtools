import { MenuItem } from "@tauri-apps/api/menu/menuItem";
import { exit, relaunch } from "@tauri-apps/plugin-process";

export const restartItem: MenuItem = await MenuItem.new({
  id: "restartItem",
  text: "重启应用",
  action: async () => {
    try {
      await relaunch();
    } catch  {
      exit(0); // 退出应用，依赖操作系统或启动器重新启动
    }
  }
});
