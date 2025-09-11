// iconMap.ts
// 负责加载图标并提供 getIconPath 工具函数
import type {} from 'vue';
import type { File } from '../../types/file';

// 直接导入每个图标文件（作为原始内容）
import audioIcon from '../../assets/icons/audio.svg?raw';
import documentIcon from '../../assets/icons/document.svg?raw';
import exeIcon from '../../assets/icons/exe.svg?raw';
import fileIcon from '../../assets/icons/file.svg?raw';
import folderIcon from '../../assets/icons/folder.svg?raw';
import imageIcon from '../../assets/icons/image.svg?raw';
import tableIcon from '../../assets/icons/table.svg?raw';
import videoIcon from '../../assets/icons/video.svg?raw';

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
