// iconMap.ts
// 负责加载图标并提供 getIconPath 工具函数
import type {} from 'vue';

type FileLike = { type?: string; path?: string };

// 使用 Vite 的 import.meta.glob 动态导入 icons 目录下的 svg
const iconModules = import.meta.glob('/src/assets/icons/*.svg', { eager: true }) as Record<
  string,
  any
>;
const iconMap: Record<string, string> = {};

for (const p in iconModules) {
  const name = p.split('/').pop()?.replace('.svg', '') || '';
  const mod = iconModules[p];
  // Vite 的 eager 导入会把模块默认导出放在 default
  const url = (mod && (mod.default || mod)) || p;
  iconMap[name] = url;
}

// 7 类文件映射（与项目现有分类保持一致）
const fileIconMappings = [
  {
    fileExtensions: ['txt', 'md', 'csv', 'log', 'tex', 'rst', 'rtf', 'ini', 'conf', 'cfg'],
    icon: 'document',
  },
  {
    fileExtensions: [
      'js',
      'mjs',
      'cjs',
      'ts',
      'mts',
      'cts',
      'jsx',
      'tsx',
      'vue',
      'astro',
      'py',
      'java',
      'c',
      'cpp',
      'cc',
      'cxx',
      'h',
      'hpp',
      'cs',
      'php',
      'rb',
      'go',
      'rs',
      'swift',
      'kt',
      'scala',
      'clj',
      'hs',
      'ml',
      'fs',
      'vb',
      'lua',
      'pl',
      'pm',
      'r',
      'sh',
      'bash',
      'zsh',
      'fish',
      'ps1',
      'bat',
      'cmd',
      'html',
      'htm',
      'xhtml',
      'xml',
      'json',
      'jsonc',
      'json5',
      'yaml',
      'yml',
      'toml',
      'css',
      'scss',
      'sass',
      'less',
      'styl',
    ],
    icon: 'file',
  },
  {
    fileExtensions: [
      'xlsx',
      'xlsm',
      'xls',
      'xlsb',
      'ods',
      'csv',
      'tsv',
      'parquet',
      'db',
      'sqlite',
      'sqlite3',
      'mdb',
      'accdb',
      'dbf',
    ],
    icon: 'table',
  },
  {
    fileExtensions: [
      'png',
      'jpeg',
      'jpg',
      'gif',
      'bmp',
      'webp',
      'tiff',
      'tif',
      'svg',
      'eps',
      'ai',
      'psd',
      'xcf',
      'ico',
      'icns',
    ],
    icon: 'image',
  },
  {
    fileExtensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'au', 'mid', 'midi'],
    icon: 'audio',
  },
  {
    fileExtensions: [
      'mp4',
      'mkv',
      'avi',
      'mov',
      'wmv',
      'flv',
      'webm',
      'm2ts',
      'mts',
      'mxf',
      'vob',
      'ogv',
      '3gp',
    ],
    icon: 'video',
  },
  {
    fileExtensions: [
      'exe',
      'dll',
      'so',
      'dylib',
      'deb',
      'rpm',
      'dmg',
      'iso',
      'img',
      'bin',
      'apk',
      'ipa',
      'app',
      'msi',
      'pkg',
      'appx',
      'zip',
      'rar',
      '7z',
      'tar',
      'gz',
      'bz2',
      'xz',
      'lzma',
    ],
    icon: 'exe',
  },
];

const defaultFileIcon = 'file';
const defaultFolderIcon = 'folder';

export function getIconPath(file: FileLike) {
  let iconName = defaultFileIcon;

  if (file.type === 'directory') {
    iconName = defaultFolderIcon;
  } else {
    const fileExt = (file.type || '').toLowerCase().replace(/^\./, '');
    for (const mapping of fileIconMappings) {
      if (mapping.fileExtensions && mapping.fileExtensions.includes(fileExt)) {
        iconName = mapping.icon;
        break;
      }
    }
  }

  return iconMap[iconName] || iconMap[defaultFileIcon] || '/src/assets/icons/file.svg';
}

export { iconMap };
