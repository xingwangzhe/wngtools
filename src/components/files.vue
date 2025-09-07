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

// 文件图标映射，仿照 Material Icon Theme
const fileIconMappings = [
  // 文件名匹配（优先级高）
  { fileNames: ['package.json'], icon: 'npm' },
  { fileNames: ['tsconfig.json'], icon: 'typescript' },
  { fileNames: ['bun.lock'], icon: 'bun' },
  { fileNames: ['yarn.lock'], icon: 'yarn' },
  { fileNames: ['pnpm-lock.yaml'], icon: 'pnpm' },
  { fileNames: ['dockerfile'], icon: 'docker' },
  { fileNames: ['readme.md'], icon: 'readme' },
  { fileNames: ['license'], icon: 'license' },
  { fileNames: ['.gitignore'], icon: 'git' },
  { fileNames: ['.env'], icon: 'env' },
  // 扩展名匹配
  { fileExtensions: ['js', 'mjs', 'cjs'], icon: 'javascript' },
  { fileExtensions: ['ts', 'mts', 'cts'], icon: 'typescript' },
  { fileExtensions: ['vue'], icon: 'vue' },
  { fileExtensions: ['astro'], icon: 'astro' },
  { fileExtensions: ['json'], icon: 'json' },
  { fileExtensions: ['md'], icon: 'markdown' },
  { fileExtensions: ['html'], icon: 'html' },
  { fileExtensions: ['css'], icon: 'css' },
  { fileExtensions: ['scss', 'sass'], icon: 'sass' },
  { fileExtensions: ['py'], icon: 'python' },
  { fileExtensions: ['rs'], icon: 'rust' },
  { fileExtensions: ['go'], icon: 'go' },
  { fileExtensions: ['java'], icon: 'java' },
  { fileExtensions: ['cpp', 'cc', 'cxx'], icon: 'cpp' },
  { fileExtensions: ['c'], icon: 'c' },
  { fileExtensions: ['php'], icon: 'php' },
  { fileExtensions: ['rb'], icon: 'ruby' },
  { fileExtensions: ['sh'], icon: 'shell' },
  { fileExtensions: ['bat'], icon: 'bat' },
  { fileExtensions: ['ps1'], icon: 'powershell' },
  { fileExtensions: ['yml', 'yaml'], icon: 'yaml' },
  { fileExtensions: ['xml'], icon: 'xml' },
  { fileExtensions: ['sql'], icon: 'database' },
  { fileExtensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'], icon: 'image' },
  { fileExtensions: ['mp4', 'avi', 'mov', 'mkv'], icon: 'video' },
  { fileExtensions: ['mp3', 'wav', 'flac'], icon: 'audio' },
  { fileExtensions: ['pdf'], icon: 'pdf' },
  { fileExtensions: ['zip', 'rar', '7z', 'tar', 'gz'], icon: 'archive' },
  { fileExtensions: ['exe'], icon: 'exe' },
  { fileExtensions: ['dll'], icon: 'dll' },
];

// 文件夹图标映射
const folderIconMappings = [
  { folderNames: ['node_modules'], icon: 'folder-node' },
  { folderNames: ['src'], icon: 'folder-src' },
  { folderNames: ['public'], icon: 'folder-public' },
  { folderNames: ['dist', 'build'], icon: 'folder-dist' },
  { folderNames: ['components'], icon: 'folder-components' },
  { folderNames: ['pages'], icon: 'folder-pages' },
  { folderNames: ['assets'], icon: 'folder-assets' },
  { folderNames: ['utils', 'helpers'], icon: 'folder-utils' },
  { folderNames: ['config', 'configs'], icon: 'folder-config' },
  { folderNames: ['test', 'tests'], icon: 'folder-test' },
  { folderNames: ['docs'], icon: 'folder-docs' },
  { folderNames: ['scripts'], icon: 'folder-scripts' },
  { folderNames: ['types'], icon: 'folder-types' },
  { folderNames: ['styles'], icon: 'folder-styles' },
  { folderNames: ['.git'], icon: 'folder-git' },
  { folderNames: ['.vscode'], icon: 'folder-vscode' },
  { folderNames: ['.github'], icon: 'folder-github' },
];

const getIconPath = (file: File) => {
  let iconName = 'file'; // 默认图标

  if (file.type === 'directory') {
    // 文件夹匹配
    const folderName = file.name.toLowerCase();
    for (const mapping of folderIconMappings) {
      if (mapping.folderNames.some((name) => folderName.includes(name))) {
        iconName = mapping.icon;
        break;
      }
    }
  } else {
    // 文件匹配
    const fileName = file.name.toLowerCase();
    const fileExt = file.type.toLowerCase().replace(/^\./, '');

    // 首先检查文件名匹配（优先级高）
    for (const mapping of fileIconMappings) {
      if (mapping.fileNames && mapping.fileNames.some((name) => fileName === name.toLowerCase())) {
        iconName = mapping.icon;
        break;
      }
    }

    // 如果没有文件名匹配，检查扩展名匹配
    if (iconName === 'file') {
      for (const mapping of fileIconMappings) {
        if (mapping.fileExtensions && mapping.fileExtensions.includes(fileExt)) {
          iconName = mapping.icon;
          break;
        }
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
