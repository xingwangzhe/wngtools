import { MenuItem } from "@tauri-apps/api/menu/menuItem";
import { exit } from "@tauri-apps/plugin-process";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export const quitItem: MenuItem = await MenuItem.new({
  id: "quitItem",
  text: "退出应用",
  action: async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    };
    if (permissionGranted) {
      console.log('域开始');
      sendNotification({ title: "Wngtools", body: "应用已关闭"});
      console.log('域结束');
    };
    exit(1);
  },
});
