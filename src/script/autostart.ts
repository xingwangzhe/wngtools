import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
import { MenuItem } from '@tauri-apps/api/menu';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { invoke } from '@tauri-apps/api/core';
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

// 检查并请求通知权限
async function checkNotificationPermission(): Promise<boolean> {
    try {
        let permissionGranted = await isPermissionGranted();
        console.log('当前通知权限状态:', permissionGranted);
        if (!permissionGranted) {
            const permission = await requestPermission();
            console.log('请求通知权限结果:', permission);
            permissionGranted = permission === "granted";
        }
        return permissionGranted;
    } catch (error) {
        console.error('检查通知权限时出错:', error);
        return false;
    }
}

// 发送通知的封装函数
async function sendStateNotification(title: string, body: string) {
    try {
        const permissionGranted = await checkNotificationPermission();
        console.log('准备发送通知，权限状态:', permissionGranted);
        if (permissionGranted) {
            // 使用后端命令发送通知
            await invoke('send_notification', { 
                title: title, 
                body: body
            });
            console.log('已通过后端命令发送通知:', title, body);
            
            // 添加一个小延迟，确保通知被系统处理
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            console.log('没有通知权限，无法发送通知');
        }
    } catch (error) {
        console.error('发送通知时出错:', error);
    }
}

async function changestate(){
    let text = '';  
    if (await isEnabled()) {
        await disable();
        text = '已关闭自启🔴';
        await sendStateNotification("Wngtools", "已关闭自启🔴");
    } else {
        await enable();
        text = '已开机自启🟢';
        await sendStateNotification("Wngtools", "已开机自启🟢");
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