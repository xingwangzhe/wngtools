// import { Window } from "@tauri-apps/api/window"
import { TrayIcon } from "@tauri-apps/api/tray";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import { Menu } from "@tauri-apps/api/menu";
import { filespace } from "./filespace";
import { autostart } from "./autostart";
import { quitItem } from "./quitItem";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
// 直接执行创建系统托盘的代码
try {
  // 创建菜单
  const menu = await Menu.new({
    items: [filespace, autostart, quitItem],
  });

  // 配置托盘图标选项
  const options: any = {
    tooltip: "Wngtools",
    menu: menu,
  };

  // 尝试获取应用默认图标
  // try {
  //   const icon = await defaultWindowIcon();
  //   if (icon) {
  //     options.icon = icon;
  //   }
  // } catch (iconError) {
  //   console.warn("无法加载默认窗口图标:", iconError);
  // }

  // 创建托盘图标
  const tray = await TrayIcon.new(options);
  console.log("系统托盘创建成功");
  let permissionGranted = await isPermissionGranted();

  // 如果没有，我们需要请求它
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }
  if (permissionGranted) {
    sendNotification({ title: "Tauri", body: "Tauri is awesome!" });
    console.log("系统通知成功");
  }
} catch (error) {
  console.error("创建系统托盘失败:", error);
}
