import { MenuItem } from "@tauri-apps/api/menu/menuItem";
import { exit } from '@tauri-apps/plugin-process';

export const quitItem: MenuItem = await MenuItem.new({
  id: "quitItem",
  text: "退出应用",
  action: async () => {
    exit(0);
  },
});