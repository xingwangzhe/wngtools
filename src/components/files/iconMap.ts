// iconMap.ts
// 负责加载图标并提供 getIconPath 工具函数
import type {} from 'vue';
import type { File } from '../../types/file';

// 直接定义SVG代码字符串
const audioIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#ef5350" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m6 10h-4v8a4 4 0 1 1-4-4 3.96 3.96 0 0 1 2 .555V8h6Z"/></svg>`;
const documentIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/><path fill="#42a5f5" d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z"/></svg>`;
const exeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#e64a19" d="M28 4H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 22H4V10h24Z"/></svg>`;
const fileIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`;
const folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const imageIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="#26a69a" d="M8.5 6h4l-4-4zM3.875 1H9.5l4 4v8.6c0 .773-.616 1.4-1.375 1.4h-8.25c-.76 0-1.375-.627-1.375-1.4V2.4c0-.777.612-1.4 1.375-1.4M4 13.6h8V8l-2.625 2.8L8 9.4zm1.25-7.7c-.76 0-1.375.627-1.375 1.4s.616 1.4 1.375 1.4c.76 0 1.375-.627 1.375-1.4S6.009 5.9 5.25 5.9"/></svg>`;
const tableIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#8bc34a" d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V9h5.5zm4 7.5h-4v2h1l-2 1.67L10 13h1v-2H7v2h1l3 2.5L8 18H7v2h4v-2h-1l2-1.67L14 18h-1v2h4v-2h-1l-3-2.5 3-2.5h1z"/></svg>`;
const videoIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#ff9800" d="m24 6 2 6h-4l-2-6h-3l2 6h-4l-2-6h-3l2 6H8L6 6H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V6Z"/></svg>`;

// 手动构建 iconMap
const iconMap: Record<string, string> = {
  audio: audioIcon,
  document: documentIcon,
  exe: exeIcon,
  file: fileIcon,
  folder: folderIcon,
  image: imageIcon,
  table: tableIcon,
  video: videoIcon,
};

// 图标样式
const iconStyle = 'width: 24px; height: 24px; margin-right: 8px; flex-shrink: 0;';

// 7 类文件映射（与项目现有分类保持一致）
const fileIconMappings = [
  {
    fileExtensions: [
      'txt',
      'md',
      'csv',
      'log',
      'tex',
      'rst',
      'rtf',
      'ini',
      'conf',
      'cfg',
      'readme',
      'changelog',
      'license',
      'authors',
      'contributors',
    ],
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
      'dockerfile',
      'makefile',
      'cmake',
      'gradle',
      'maven',
      'cargo.toml',
      'package.json',
      'requirements.txt',
      'pipfile',
      'poetry.lock',
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
      'accdb',
      'numbers',
      'gsheet',
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
      'heic',
      'heif',
      'raw',
      'cr2',
      'nef',
      'arw',
      'dng',
    ],
    icon: 'image',
  },
  {
    fileExtensions: [
      'mp3',
      'wav',
      'flac',
      'aac',
      'ogg',
      'm4a',
      'wma',
      'aiff',
      'au',
      'mid',
      'midi',
      'flac',
      'alac',
      'dsd',
      'dsd',
      'ape',
      'wv',
    ],
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
      'm4v',
      'f4v',
      'f4p',
      'f4a',
      'f4b',
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
      'tgz',
      'tbz2',
      'txz',
      'jar',
      'war',
      'ear',
      'nupkg',
      'gem',
      'whl',
      'egg',
    ],
    icon: 'exe',
  },
];

const defaultFileIcon = 'file';
const defaultFolderIcon = 'folder';

export function getIconPath(file: File) {
  let iconName = defaultFileIcon;

  if (file.type_ === 'directory') {
    iconName = defaultFolderIcon;
  } else {
    const fileExt = (file.type_ || '').toLowerCase().replace(/^\./, '');

    for (const mapping of fileIconMappings) {
      if (mapping.fileExtensions && mapping.fileExtensions.includes(fileExt)) {
        iconName = mapping.icon;
        break;
      }
    }
  }

  // 确保图标存在，否则使用默认图标
  const iconSvg = iconMap[iconName];
  if (iconSvg) {
    return { iconSvg, iconName, iconStyle };
  }

  // 如果找不到对应图标，使用默认文件图标
  const fallbackSvg = iconMap[defaultFileIcon] || iconMap[defaultFolderIcon] || '';
  return { iconSvg: fallbackSvg, iconName: defaultFileIcon, iconStyle };
}

export { iconMap };
