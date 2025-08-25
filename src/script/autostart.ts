import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
import { MenuItem } from '@tauri-apps/api/menu';

// 启用 autostart
await enable();
// 检查 enable 状态
console.log(`registered for autostart? ${await isEnabled()}`);
// 禁用 autostart
disable();

export const autostart: MenuItem = await MenuItem.new({
    id: 'autostart',
    text: '开机自启',
    action: async () => {
        if (await isEnabled()) {
            await autostart.setText('已关闭自启');
        } else {
            await enable();
            await autostart.setText('已开机自启');
        }
    }
});