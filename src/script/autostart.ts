import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
import { MenuItem } from '@tauri-apps/api/menu';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
// 获取当前状态文本
export async function getAutostartStateText(): Promise<string> {
    if (await isEnabled()) {
        return '已开机自启🟢';
    } else {
        return '已关闭自启🔴';
    }
}

// 更新状态文本显示
async function updateStateText() {
    const text = await getAutostartStateText();
    await autostart.setText(text);
    return text;
}

async function changestate(){
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    };
    let text = '';  
    if (await isEnabled()) {
        await disable();
        if (permissionGranted) {
            text = '已关闭自启🔴';
            sendNotification({ 
                title: "Wngtools", 
                body: "已关闭自启🔴",
                autoCancel: true, 
            });
        }
    } else {
        await enable();
        if (permissionGranted) {
            text = '已开机自启🟢';
            sendNotification({ title: "Wngtools", body: "已开机自启🟢" });
        }
    }
    await autostart.setText(text);
    return text;
}

// 初始化时检查状态
setTimeout(async () => {
    await updateStateText();
}, 0);

export const autostart: MenuItem = await MenuItem.new({
    id: 'autostart',
    text: '开机自启',
    action: async () => {
        await changestate();
    }
});