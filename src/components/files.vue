<template>
  <div>
    <ul>
        <li v-for="file in files" :key="file.path">
            {{ file.name }} ({{ file.type }}) - {{ file.path }}
        </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
    import { listen } from "@tauri-apps/api/event";
    import { ref } from 'vue';
    
    interface DragDropPayload {
        paths: string[];
    }
    interface File {
        name: string;
        path: string;
        type: string;
    }

    const files = ref<Set<File>>(new Set());

    listen('tauri://drag-drop', (e) => {
        console.log("Dropped files:", e);
        const payload = e.payload as DragDropPayload;
        console.log("Dropped files:", payload?.paths[0]);
        const fullPath = payload?.paths[0];
        const fileType = fullPath?.split('.').pop() || '';
        const fileName = fullPath?.split('/').pop() || '';
        let file: File = {
            name: fileName,
            path: fullPath,
            type: fileType
        };
        console.log("File object:", file);
        const existingFile = Array.from(files.value).find(f => f.path === file.path);
        if (!existingFile) {
            files.value.add(file);
        }
    });
    listen('tauri://drag-leave', () => {
      console.log("Drag leave");
    });
    listen('tauri://drag-enter', () => {
      console.log("Drag enter");
    });
</script>

<style>

</style>