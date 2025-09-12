import { invoke } from '@tauri-apps/api/core';
import type { File } from '../../types/file';

export async function addClipboard(
  file: File,
  optext: boolean,
  optImage: boolean,
  optOther: boolean,
): Promise<void> {
  // console.log('addClipboard called with file:', file);
  let width: number | undefined;
  let height: number | undefined;

  if (file.icon === 'image' && optImage) {
    try {
      const img = new Image();
      img.src = `file://${file.path}`;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      width = img.naturalWidth;
      height = img.naturalHeight;
      // console.log(`Image dimensions: ${width}x${height}`);
    } catch (error) {
      // console.warn('Failed to get image dimensions, using defaults:', error);
      width = 100;
      height = 100;
    }
  }

  // 将尺寸添加到 file 对象中
  const fileWithSize = { ...file, width, height };

  try {
    // console.log('Invoking add_clipboard command...');
    const result = await invoke('add_clipboard', {
      file: fileWithSize,
      optext,
      optImage,
      optOther,
    });
    // console.log('Invoke result:', result);
    // console.log('File path copied to clipboard:', file.path);
  } catch (error) {
    // console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}
