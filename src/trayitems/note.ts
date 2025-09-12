import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Menu } from '@tauri-apps/api/menu';
let idd = 0;
function id() {
  idd += 1;
  return 'note-' + idd.toString;
}
export const notes = {
  id: 'note',
  text: '创建便贴',
  action: async () => {
    const noteWindow = new WebviewWindow(id(), {
      title: '便贴',
      width: 800,
      height: 600,
      alwaysOnTop: true,
      visible: true,
      resizable: true,
      decorations: true,
      url: '/note',
    });
  },
};
