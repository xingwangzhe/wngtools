import { MenuItem } from "@tauri-apps/api/menu/menuItem";
import { exit } from "@tauri-apps/plugin-process";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { invoke } from '@tauri-apps/api/core';
await invoke('close_app');
export const quitItem: MenuItem = await MenuItem.new({
  id: "quitItem",
  text: "退出应用",
  action: async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
    sendNotification({ title: "Wngtools", body: "wngtools已关闭" });
    await exit(0);
    // await invoke('close_app');
  },
});
