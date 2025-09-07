<template>
  <div class="file-list">
    <ul>
      <li v-for="file in Array.from(files)" :key="file.path" class="file-item">
        <img :src="getIconPath(file)" :alt="file.type + ' icon'" class="file-icon" />
        <span class="file-name">{{ file.name }}</span>
        <span class="file-type">({{ file.type }})</span>
        <span class="file-path">{{ file.path }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { listen } from '@tauri-apps/api/event';
import { ref } from 'vue';
import { extname, basename } from '@tauri-apps/api/path'; // 使用 Path API
import { stat } from '@tauri-apps/plugin-fs';

interface DragDropPayload {
  paths: string[];
}
interface File {
  name: string;
  path: string;
  type: string;
}

const files = ref<Set<File>>(new Set());

// 使用 Vite 的 import.meta.glob 动态导入图标
const iconModules = import.meta.glob('/src/assets/icons/*.svg', { eager: true });
const iconMap: Record<string, string> = {};

for (const path in iconModules) {
  const type = path.split('/').pop()?.replace('.svg', '') || '';
  iconMap[type] = path;
}

// 文件图标映射，简化为7个基本类型
const fileIconMappings = [
  // 1. 文本（纯文字，人类能直接读）
  { fileExtensions: ['txt', 'md', 'csv', 'log', 'tex', 'rst', 'rtf', 'ini', 'conf', 'cfg'], icon: 'document' },
  
  // 2. 代码/标记（给人看也给编译器/解释器看）
  { fileExtensions: ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts', 'jsx', 'tsx', 'vue', 'astro', 'py', 'java', 'c', 'cpp', 'cc', 'cxx', 'h', 'hpp', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'scala', 'clj', 'hs', 'ml', 'fs', 'vb', 'lua', 'pl', 'pm', 'r', 'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd', 'html', 'htm', 'xhtml', 'xml', 'json', 'jsonc', 'json5', 'yaml', 'yml', 'toml', 'css', 'scss', 'sass', 'less', 'styl'], icon: 'file' },
  
  // 3. 表格/结构化数据
  { fileExtensions: ['xlsx', 'xlsm', 'xls', 'xlsb', 'ods', 'csv', 'tsv', 'parquet', 'db', 'sqlite', 'sqlite3', 'mdb', 'accdb', 'dbf'], icon: 'table' },
  
  // 4. 图片（像素图 & 矢量）
  { fileExtensions: ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp', 'tiff', 'tif', 'svg', 'eps', 'ai', 'psd', 'xcf', 'ico', 'icns'], icon: 'image' },
  
  // 5. 音频
  { fileExtensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'au', 'mid', 'midi'], icon: 'audio' },
  
  // 6. 视频
  { fileExtensions: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm2ts', 'mts', 'mxf', 'vob', 'ogv', '3gp'], icon: 'video' },
  
  // 7. 可执行/二进制容器
  { fileExtensions: ['exe', 'dll', 'so', 'dylib', 'deb', 'rpm', 'dmg', 'iso', 'img', 'bin', 'apk', 'ipa', 'app', 'msi', 'pkg', 'appx', 'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lzma'], icon: 'exe' },
];

// 文件夹图标映射 - 简化，只使用普通文件夹图标
const folderIconMappings = [
  { folderNames: [], icon: 'folder' }, // 所有文件夹都使用同一个图标
];

const getIconPath = (file: File) => {
  let iconName = 'file'; // 默认图标

  if (file.type === 'directory') {
    // 所有文件夹都使用同一个图标
    iconName = 'folder';
  } else {
    // 文件匹配 - 只使用扩展名匹配
    const fileExt = file.type.toLowerCase().replace(/^\./, '');

    // 检查扩展名匹配
    for (const mapping of fileIconMappings) {
      if (mapping.fileExtensions && mapping.fileExtensions.includes(fileExt)) {
        iconName = mapping.icon;
        break;
      }
    }
  }

  return iconMap[iconName] || iconMap['file'] || '/src/assets/icons/file.svg';
};

listen('tauri://drag-drop', async (e) => {
  console.log('Dropped files:', e);
  const payload = e.payload as DragDropPayload;
  if (!payload?.paths) return;
  console.log('Dropped files:', payload?.paths[0]);
  const fullPath = payload?.paths[0];
  const meta = await stat(fullPath); // 返回 Metadata
  let fileName = '';
  let fileType = '';
  let dirname = '';
  if (!meta.isFile) {
    dirname = await basename(fullPath);
    fileType = 'directory';
  } else if (meta.isFile) {
    fileType = await extname(fullPath);
    fileName = await basename(fullPath);
  }
  let file: File = {
    name: fileName || dirname,
    path: fullPath,
    type: fileType,
  };
  console.log('File object:', file);
  const existingFile = Array.from(files.value).find((f) => f.path === file.path);
  if (!existingFile) {
    files.value.add(file);
  }
});
listen('tauri://drag-leave', () => {
  console.log('Drag leave');
});
listen('tauri://drag-enter', () => {
  console.log('Drag enter');
});
</script>

<style>
.file-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.file-item:hover {
  background-color: #f5f5f5;
}

.file-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  flex-shrink: 0;
}

.file-name {
  font-weight: 500;
  flex-grow: 1;
}

.file-type {
  color: #666;
  font-size: 0.9em;
  margin-left: 4px;
}

.file-path {
  color: #999;
  font-size: 0.8em;
  margin-left: auto;
  text-align: right;
  flex-shrink: 0;
}
</style>
