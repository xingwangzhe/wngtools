import { invoke } from '@tauri-apps/api/core';
import type { File } from '../../types/file';

export async function addClipboard(file: File): Promise<void> {
  console.log('addClipboard called with file:', file);
  try {
    console.log('Invoking add_clipboard command...');
    const result = await invoke('add_clipboard', { file });
    console.log('Invoke result:', result);
    console.log('File path copied to clipboard:', file.path);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // 重新抛出错误，让调用者处理
    throw error;
  }
}
