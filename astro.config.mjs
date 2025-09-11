import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },

  // 挂载 Vue 集成
  integrations: [vue()],

  // Vite 配置：在这里添加插件以支持按需自动导入
  vite: {
    plugins: [
      // 自动导入组合式 API（和 Element Plus 的部分函数）
      AutoImport({
        imports: [
          'vue',
          // 也可以在这里显式列出要自动导入的 element-plus API，但使用 resolver 更简洁
        ],
        // 使用 Element Plus 的解析器来自动导入 ElMessage / ElNotification / ElLoading 等
        resolvers: [ElementPlusResolver()],
        // 生成的 dts（可帮助 IDE 类型提示）
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
          enabled: false,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),

      // 自动按需注册组件（例如 <el-button />）
      Components({
        // 生成组件声明，便于 TS/IDE
        dts: 'src/types/components.d.ts',
        // 使用 Element Plus 解析器（可选参数：importStyle: 'sass' / 'css'）
        resolvers: [ElementPlusResolver({ importStyle: 'css' })],
        extensions: ['vue'],
        include: [/\.vue$/, /\.vue\?vue/, /\.astro$/],
      }),
    ],
  },
});
