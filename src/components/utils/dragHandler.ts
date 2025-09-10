// 文件拖拽处理器模块
// 负责处理从应用内部拖拽文件到外部系统的逻辑
import type { DragDropPayload, File } from '../../types/file';

/**
 * 处理拖拽开始事件
 * @param event 拖拽事件对象
 * @param file 文件对象
 */
export const handleDragStart = (event: DragEvent, file: File) => {
  // 设置拖拽数据为文件路径和URI
  event.dataTransfer?.setData('text/plain', file.path);
  event.dataTransfer?.setData('text/uri-list', `file://${file.path}`);

  // 设置拖拽效果为复制
  event.dataTransfer!.effectAllowed = 'copy';
};

/**
 * 处理文件拖拽到应用中的事件
 * @param payload 拖拽载荷
 * @param addFile 回调函数，用于添加文件到列表
 */
export const handleFileDrop = async (payload: DragDropPayload, addFile: (file: File) => void) => {
  if (!payload?.paths?.length) return;

  const fullPath = payload.paths[0];

  // 获取文件元数据
  const { stat } = await import('@tauri-apps/plugin-fs');
  const meta = await stat(fullPath);

  const { basename, extname } = await import('@tauri-apps/api/path');

  let fileName = '';
  let fileType = '';

  if (!meta.isFile) {
    // 如果是目录
    fileName = await basename(fullPath);
    fileType = 'directory';
  } else {
    // 如果是文件
    fileType = await extname(fullPath);
    fileName = await basename(fullPath);
  }
  const file: File = {
    name: fileName,
    path: fullPath,
    type_: fileType,
  };
  // 添加文件到列表
  addFile(file);
};
