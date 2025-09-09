<template>
  <div class="file-list">
    <ul>
      <li
        v-for="file in Array.from(files)"
        :key="file.path"
        class="file-item"
        draggable="true"
        @dragstart="handleDragStart($event, file)"
      >
        <img :src="getIconPath(file)" :alt="file.type + ' icon'" class="file-icon" />
        <span class="file-name">{{ file.name }}</span>
        <span class="file-type">({{ file.type }})</span>
        <span class="file-path">{{ file.path }}</span>
        <div class="delFile" @click="delFile(file)">删除</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { listen } from '@tauri-apps/api/event';
import { ref } from 'vue';

// 导入拖拽处理器
import { handleDragStart, handleFileDrop } from './utils/dragHandler';
// 导入图标映射
import { getIconPath } from './utils/iconMap';
// 导入类型定义
import type { DragDropPayload, File } from '../types/file';

const files = ref<Set<File>>(new Set());

// 添加文件的函数
const addFile = (file: File) => {
  const existingFile = Array.from(files.value).find((f) => f.path === file.path);
  if (!existingFile) {
    files.value.add(file);
  }
};

const delFile = (file: File) => {
  const existingFile = Array.from(files.value).find((f) => f.path === file.path);
  if (existingFile) {
    files.value.delete(existingFile);
  }
};

// 监听文件拖拽到应用中的事件
listen('tauri://drag-drop', async (e) => {
  const payload = e.payload as DragDropPayload;
  await handleFileDrop(payload, addFile);
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
  position: relative;
  min-height: 40px;
}

.delFile {
  position: absolute;
  top: 8px;
  right: 12px;
  padding: 2px 6px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
  user-select: none;
  z-index: 1;
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
