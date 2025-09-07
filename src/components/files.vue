<template>
  <div class="file-list">
    <ul>
      <li v-for="file in Array.from(files)" :key="file.path" class="file-item" draggable="true">
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

// 图标加载与映射由外部模块提供
import { getIconPath } from './script/iconMap';

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
