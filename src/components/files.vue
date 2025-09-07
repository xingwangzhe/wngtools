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
  const payload = e.payload as DragDropPayload;
  if (!payload?.paths || payload.paths.length === 0) return;

  for (const fullPath of payload.paths) {
    try {
      const meta = await stat(fullPath);
      if (meta.isDirectory) {
        // skip directories for now
        continue;
      }

      if (meta.isFile) {
        const fileType = await extname(fullPath);
        const fileName = await basename(fullPath);
        const file: File = {
          name: fileName,
          path: fullPath,
          type: fileType,
        };

        const exists = Array.from(files.value).some((f) => f.path === file.path);
        if (!exists) files.value.add(file);
      }
    } catch (err) {
      // stat may fail for some paths — ignore and continue
      // console.warn('stat failed', fullPath, err);
      continue;
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
<div></div>
