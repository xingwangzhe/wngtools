<template>
  <div v-if="page" class="file-list">
    <div v-if="files.size > 0">
      <el-card
        v-for="file in Array.from(files)"
        :key="file.path"
        style="max-width: 400px; margin-bottom: 8px"
        draggable="true"
        @dragstart="handleDragStart($event, file)"
        @click="handleFileClick(file, $event)"
      >
        <template #header>
          <div class="card-header">
            <span v-html="getIconPath(file).iconSvg" :style="getIconPath(file).iconStyle"></span>
            <span>{{ file.name }}</span>
          </div>
        </template>
        <p class="text item">
          {{ t('files.typeLabel') }}{{ file.type_ }} | {{ t('files.pathLabel') }}{{ file.path }}
        </p>
        <template #footer>
          <div class="openFile" @click="openFile(file, $event)">{{ t('files.open') }}</div>
          <div class="delFile" @click="delFile(file, $event)">{{ t('files.delete') }}</div>
        </template>
      </el-card>
    </div>
    <div v-else class="p-4 text-center text-gray-500">{{ t('files.dragFilesHere') }}</div>
  </div>
  <div v-else-if="!page">
    <div>
      {{ t('files.enableObjectClick') }}
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
      {{ t('files.enableTextClick') }}
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
      {{ t('files.enableImageClick') }}
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
      {{ t('files.enableOtherClick') }}
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
import { ref, watch } from 'vue';
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
import { openPath } from '@tauri-apps/plugin-opener';
import i18n from '../../i18n/index';
const t = i18n.t;
const files = ref<Set<File>>(new Set());
const page = ref(true);
const options = ref(false);
const optext = ref(false);
const optImage = ref(false);
const optOther = ref(false);
const opt = ref(false);

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
// 打开文件或文件夹
const openFile = async (file: File, event: Event) => {
  event.stopPropagation(); // 阻止事件冒泡
  try {
    await openPath(file.path);
  } catch (error) {
    console.error('Error opening file:', error);
  }
};

// 监听来自主进程/托盘的菜单事件，切换视图
await listen('menu:open-settings', () => {
  page.value = false;
});
await listen('menu:open-files', () => {
  page.value = true;
});
</script>

<style>
.openFile {
  padding: 4px 8px;
  background-color: #67c23a;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  user-select: none;
  display: inline-block;
  margin-right: 8px;
}

.delFile {
  padding: 4px 8px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  user-select: none;
  display: inline-block;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header span {
  font-weight: 500;
}

.el-card__body {
  padding: 8px 16px;
}
</style>
