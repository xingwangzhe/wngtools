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
    }
    if (permissionGranted) {
      console.log('准备发送退出通知');
      try {
        await sendNotification({ title: "Wngtools", body: "应用已关闭" });
        console.log('退出通知发送成功');
      } catch (error) {
        console.error('发送退出通知失败:', error);
      }
    }
    exit(1);
  },
});
