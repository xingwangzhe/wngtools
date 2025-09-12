<template>
  <div v-if="page" class="file-list">
    <ul>
      <li
        v-for="file in Array.from(files)"
        :key="file.path"
        class="file-item"
        draggable="true"
        @dragstart="handleDragStart($event, file)"
        @click="handleFileClick(file, $event)"
      >
        <span v-html="getIconPath(file).iconSvg" :style="getIconPath(file).iconStyle"></span>
        <span class="file-name">{{ file.name }}</span>
        <span class="file-type">({{ file.type_ }})</span>
        <span class="file-path">{{ file.path }}</span>
        <div class="delFile" @click="delFile(file, $event)">删除</div>
      </li>
    </ul>
  </div>
  <div v-else-if="!page">
    <div>
      是否启用点击对象，复制到剪切板
      <el-switch
        v-model="options"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        :active-icon="Check"
        :inactive-icon="Close"
      />
    </div>
    <div>
      是否启用点击文本对象，复制内容到剪切板
      <el-switch
        :disabled="!opt"
        v-model="optext"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        :active-icon="Check"
        :inactive-icon="Close"
      />
    </div>
    <div>
      是否启用点击图片，复制图片到剪切板
      <el-switch
        :disabled="!opt"
        v-model="optImage"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        :active-icon="Check"
        :inactive-icon="Close"
      />
    </div>
    <div>
      是否启用点击其他文件，复制文件路径到剪切板
      <el-switch
        :disabled="!opt"
        v-model="optOther"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        :active-icon="Check"
        :inactive-icon="Close"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { listen } from '@tauri-apps/api/event';
import { ref } from 'vue';
// 导入拖拽处理器
import { handleDragStart, handleFileDrop } from './dragHandler';
// 导入图标映射
import { getIconPath } from './iconMap';
// 导入 Element Plus 组件
import { Check, Close } from '@element-plus/icons-vue';
// 导入类型定义
import type { DragDropPayload, File } from '../../types/file';
import { addClipboard } from './addClipboard';
import { Menu } from '@tauri-apps/api/menu';
const files = ref<Set<File>>(new Set());
const page = ref(true);
const options = ref(false);
const optext = ref(true);
const optImage = ref(true);
const optOther = ref(true);
const opt = ref(true);

// 监听主开关变化
watch(options, (newVal) => {
  if (!newVal) {
    // 主开关关闭时：先让子开关值变为false（变红），再禁用
    optext.value = false;
    optImage.value = false;
    optOther.value = false;
    setTimeout(() => {
      opt.value = false;
    }, 500);
  } else {
    // 主开关开启时：立即启用
    opt.value = true;
  }
});

// 添加文件的函数
const addFile = (file: File) => {
  const existingFile = Array.from(files.value).find((f) => f.path === file.path);
  if (!existingFile) {
    files.value.add(file);
  }
};
//删除文件索引(不是真的删除本地文件)
const delFile = (file: File, event: Event) => {
  event.stopPropagation(); // 阻止事件冒泡
  const existingFile = Array.from(files.value).find((f) => f.path === file.path);
  if (existingFile) {
    files.value.delete(existingFile);
  }
};

// 处理文件点击事件，复制到剪贴板
const handleFileClick = async (file: File, event?: Event) => {
  // console.log('File clicked:', file.name, 'Event:', event);
  // console.log('Files count:', files.value.size);

  if (event) {
    // console.log('Click target:', event.target);
    // console.log('Click currentTarget:', event.currentTarget);
  }

  try {
    await addClipboard(file, optext.value, optImage.value, optOther.value);
    // console.log('Clipboard operation completed for:', file.name);
  } catch (error) {
    // console.error('Error in handleFileClick:', error);
  }
};

// 监听文件拖拽到应用中的事件
listen('tauri://drag-drop', async (e) => {
  const payload = e.payload as DragDropPayload;
  await handleFileDrop(payload, addFile);
});
// 监听来自主进程/托盘的菜单事件，切换视图
await listen('menu:open-settings', () => {
  page.value = false;
});
await listen('menu:open-files', () => {
  page.value = true;
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
