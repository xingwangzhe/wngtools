<template>
  <div>
    <ul>
      <li v-for="file in Array.from(files)" :key="file.path">
        {{ file.name }} ({{ file.type }}) - {{ file.path }}
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

listen('tauri://drag-drop', async (e) => {
  console.log('Dropped files:', e);
  const payload = e.payload as DragDropPayload;
  if (!payload?.paths) return;
  console.log('Dropped files:', payload?.paths[0]);
  const fullPath = payload?.paths[0];
  const meta = await stat(fullPath); // 返回 Metadata
  if (meta.isDirectory) {
    const dirname = await basename(fullPath);
    const filetype = 'directory';
  } else if (meta.isFile) {
    const fileType = await extname(fullPath);
    const fileName = await basename(fullPath);
    let file: File = {
      name: fileName,
      path: fullPath,
      type: fileType,
    };
    console.log('File object:', file);
    const existingFile = Array.from(files.value).find((f) => f.path === file.path);
    if (!existingFile) {
      files.value.add(file);
    }
  }
});
listen('tauri://drag-leave', () => {
  console.log('Drag leave');
});
listen('tauri://drag-enter', () => {
  console.log('Drag enter');
});
</script>

<style></style>
