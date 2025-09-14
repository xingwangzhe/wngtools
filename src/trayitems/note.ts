import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Menu } from '@tauri-apps/api/menu';
import i18n from '../i18n/index';
let idd = 0;
function id() {
  idd += 1;
  return 'note-' + idd.toString();
}
export const notes = {
  id: 'note',
  text: i18n.t('tray.createNote'),
  action: async () => {
    try {
      const noteWindow = new WebviewWindow(id(), {
        title: i18n.t('tray.note'),
        width: 400,
        height: 300,
        center: true,
        alwaysOnTop: true,
        visible: true,
        resizable: true,
        decorations: true,
        url: '/note',
      });
      console.log('Note window created:', noteWindow);
    } catch (error) {
      console.error('Failed to create note window:', error);
    }
  },
};
