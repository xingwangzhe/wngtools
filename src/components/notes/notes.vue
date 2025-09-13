<template>
  <el-input
    v-model="textcontent"
    style="width: 100%; min-height: 100vh"
    type="textarea"
    :autosize="{ minRows: 20 }"
    placeholder="Please input"
    maxlength="10000000000"
    show-word-limit
  />
</template>
<script lang="ts" setup>
const textcontent = ref('');
import { ref, onMounted, onUnmounted } from 'vue';
import { Window } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
interface Event {
  payload: boolean;
}
const currentWindow = Window.getCurrent();
let unlisten: (() => void) | undefined;
let unlistenNoteClose: (() => void) | undefined;
let ifclose = ref<boolean>(false);
onMounted(async () => {
  unlistenNoteClose = await listen('note_close', (event: Event) => {
    ifclose.value = event.payload;
    // 可以在这里添加处理逻辑，比如更新UI或执行其他操作
    console.log('saiodiojas  ' + ifclose.value);
  });
  unlisten = await currentWindow.onCloseRequested(async (event) => {
    if (!ifclose.value) {
      event.preventDefault();
      const shouldClose = await invoke('save_notes', {
        label: currentWindow.label,
        content: textcontent.value,
      });
    }
  });
});
</script>
