// iconMap.ts
// 负责加载图标并提供 getIconPath 工具函数
import type {} from 'vue';

type FileLike = { type?: string; path?: string };

// 直接导入每个图标文件（作为 URL）
import audioIcon from '../../assets/icons/audio.svg?url';
import documentIcon from '../../assets/icons/document.svg?url';
import exeIcon from '../../assets/icons/exe.svg?url';
import fileIcon from '../../assets/icons/file.svg?url';
import folderIcon from '../../assets/icons/folder.svg?url';
import imageIcon from '../../assets/icons/image.svg?url';
import tableIcon from '../../assets/icons/table.svg?url';
import videoIcon from '../../assets/icons/video.svg?url';

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

console.log('IconMap built manually:', iconMap);

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

export function getIconPath(file: FileLike) {
  let iconName = defaultFileIcon;

  if (file.type === 'directory') {
    iconName = defaultFolderIcon;
  } else {
    const fileExt = (file.type || '').toLowerCase().replace(/^\./, '');
    console.log('File extension:', fileExt, 'for file:', file); // 调试信息

    for (const mapping of fileIconMappings) {
      if (mapping.fileExtensions && mapping.fileExtensions.includes(fileExt)) {
        iconName = mapping.icon;
        console.log('Matched icon:', iconName); // 调试信息
        break;
      }
    }
  }

  // 确保图标存在，否则使用默认图标
  const iconUrl = iconMap[iconName];
  if (iconUrl) {
    console.log('Using icon URL:', iconUrl); // 调试信息
    return iconUrl;
  }

  // 如果找不到对应图标，使用默认文件图标
  const fallbackUrl = iconMap[defaultFileIcon] || iconMap[defaultFolderIcon] || '';
  console.log('Using fallback icon URL:', fallbackUrl); // 调试信息
  return fallbackUrl;
}

export { iconMap };
