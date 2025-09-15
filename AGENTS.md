# AGENTS.md - AI Collaboration Guide

> This document provides comprehensive guidance for AI assistants about the WngTools project, helping AI better understand and assist in developing this project.

## 📋 Project Overview

### Basic Information
- **Project Name**: WngTools
- **Type**: Cross-platform desktop application
- **Architecture**: Tauri 2.8.3 + Astro 5.13.3 + Vue 3.5.21
- **Languages**: TypeScript + Rust
- **License**: GPL-3.0
- **Main Features**: System tray application, file management, notes functionality, multi-language support

### Core Philosophy
- Focus on system tray integration
- Lightweight desktop tools
- Cross-platform compatibility
- Modern technology stack
- Internationalization support

## 🏗️ Project Architecture

### Technology Stack Details

#### Frontend
```
src/
├── components/          # Vue components
│   └── notes/          # Notes components
├── layouts/            # Astro layouts
│   └── Layout.astro    # Main layout (includes theme and language detection)
├── pages/              # Page routing
│   ├── index.astro     # Homepage (about page)
│   ├── filespace.astro # File management page
│   └── note.astro      # Notes page
├── i18n/               # Internationalization
│   └── index.ts        # i18next configuration and language detection
├── trayitems/          # System tray menu items
│   ├── main.ts         # Tray main entry
│   ├── about.ts        # About menu item
│   ├── filespace.ts    # File management menu item
│   ├── note.ts         # Notes menu item
│   ├── autostart.ts    # Auto-start menu item
│   ├── restart.ts      # Restart menu item
│   └── quitItem.ts     # Quit menu item
└── types/              # TypeScript type definitions
```

#### Backend (Rust)
```
src-tauri/src/
├── commands/           # Tauri commands
│   ├── clipboard.rs    # Clipboard operations
│   ├── locale.rs       # Language management
│   ├── save_note.rs    # Note saving
│   └── show_window.rs  # Window display
├── types/              # Rust type definitions
├── lib.rs              # Main library file
├── main.rs             # Entry file
└── main_window_handlers.rs # Window event handlers
```

### Language Support
```
locales/
├── zh-CN.json          # Simplified Chinese
├── zh-HK.json          # Traditional Chinese (Hong Kong)
└── en.json             # English
```

## 🔧 Development Standards

### Code Style
- **Frontend**: Use Prettier + Oxlint
- **Backend**: Use Rust standard format
- **Naming Convention**: camelCase (TS) + snake_case (Rust)
- **Commit Convention**: Clear Chinese descriptions

### Directory Structure Principles
- Group by functionality, not technical layers
- Keep directory structure flat
- Separate components from pages
- Centralized type definition management

### Performance Optimization Configuration
- **Production Environment**: Automatically remove console.log (Vite esbuild)
- **Rust Release**: Ultimate package size optimization
- **Logging System**: Detailed in development, disabled in production

## 🌐 Internationalization (i18n) System

### Architecture Design
- **Frontend**: i18next + automatic language detection
- **Backend**: rust-i18n + frontend-backend language synchronization
- **Detection Rules**:
  - `zh-CN`, `zh-Hans` → Simplified Chinese
  - `zh-HK`, `zh-TW`, `zh-Hant`, `zh-MO` → Traditional Chinese (Hong Kong)
  - Others → English

### Workflow
1. Frontend detects system language (`navigator.language`)
2. Set i18next language
3. Send language information to backend
4. Backend sets rust-i18n language
5. Implement frontend-backend translation synchronization

### Backend Translation Function Special Instructions
**⚠️ Important**: When using translation features in backend Rust code, **DO NOT directly use** the `rust_i18n::t!()` macro.

#### Correct Usage
- **Recommended**: Use `t_with_current_locale(key)` function
- **Forbidden**: Direct calls to `rust_i18n::t!(key)`

#### Explanation
1. `rust_i18n::t!()` uses globally set language environment
2. Language environment may not be synchronized from frontend during app startup
3. Language switching is asynchronous, direct use of `t!()` may get wrong language
4. `t_with_current_locale()` ensures using the correct current language

#### Code Examples
```rust
// ❌ Wrong usage - may use incorrect language
let message = rust_i18n::t!("saveNote.dialogTitle");

// ✅ Correct usage - uses currently synchronized language
use crate::commands::locale::t_with_current_locale;
let message = t_with_current_locale("saveNote.dialogTitle");

// Real project usage example
// In save_note.rs:
use crate::commands::locale::t_with_current_locale;

let dialog_message = t_with_current_locale("saveNote.dialogMessage");
let dialog_title = t_with_current_locale("saveNote.dialogTitle");
let save_button = t_with_current_locale("saveNote.saveButton");
```

#### Language File Structure
Language configuration files use nested JSON structure with dot-notation hierarchical access:
```json
{
  "saveNote": {
    "dialogTitle": "Save Note",
    "dialogMessage": "Please select save location",
    "saveButton": "Save",
    "cancelButton": "Cancel"
  },
  "app": {
    "singleInstance": "Single instance application"
  }
}
```

#### Implementation Principle
- `t_with_current_locale()` internally switches to the correct language environment temporarily
- Restores original language setting after translation
- Ensures thread safety and language synchronization accuracy
- Uses global `CURRENT_LANGUAGE` state to manage current language

#### Import and Usage Guide
```rust
// Add import at the top of Rust files that need translation
use crate::commands::locale::t_with_current_locale;

// Use translation in functions
#[tauri::command]
pub fn my_command() -> String {
    let translated_text = t_with_current_locale("my.translation.key");
    translated_text
}
```

#### Common Errors to Avoid
1. **Forgot to import**: Ensure importing `t_with_current_locale` at the top of file
2. **Wrong path**: Use `crate::commands::locale::t_with_current_locale` instead of relative paths
3. **Mixed translation methods**: Don't mix `rust_i18n::t!()` and `t_with_current_locale()` in the same file
4. **Wrong key names**: Translation keys must exactly match the path in JSON files (case-sensitive)

### Adding New Languages
1. Add new JSON file in `locales/` directory
2. Update language detection logic in `src/i18n/index.ts`
3. Update support list in `src-tauri/src/commands/locale.rs`
4. Add corresponding detection rules in `Layout.astro`

## 🚀 Main Feature Modules

### 1. System Tray
- **File**: `src/trayitems/main.ts`
- **Function**: Create system tray icon and menu
- **Menu Items**: About, File Management, Notes, Auto-start, Restart, Quit

### 2. Window Management
- **Hidden Startup**: Main window not displayed by default
- **Tray Interaction**: Display window through tray menu
- **Close Behavior**: Hide instead of exit when clicking close button

### 3. File Management
- **Drag Support**: Support file dragging to application
- **Clipboard Integration**: File path and content copying
- **Type Recognition**: Automatic file type identification

### 4. Notes Functionality
- **Real-time Editing**: Vue component implementation
- **Save Dialog**: Tauri native file dialog
- **Format Support**: Plain text format

## 🛠️ Development Workflow

### Local Development
```bash
# Install dependencies
bun install

# Start frontend development server
bun run dev

# Start complete application (recommended)
bun run tauri dev
```

### Code Quality Check
```bash
# Check frontend code
bun run lint
bun run lint:fix

# Format code
bun run format

# Comprehensive check
bun run check

# Check Rust code
cd src-tauri && cargo check
```

### Build and Release
```bash
# Build frontend
bun run build

# Build desktop application
bun run tauri build
```

## 🐛 Common Issues and Solutions

### Window Related Issues
1. **Window cannot close**: Check if CSS elements are covering window controls
2. **Window focus issues**: Ensure `set_focus()` is called in `show_window.rs`
3. **Window state abnormal**: Check event handling logic in `main_window_handlers.rs`

### Language Synchronization Issues
1. **Backend language not updating**: Check if frontend successfully sends language information
2. **Tauri environment not ready**: Ensure running in correct Tauri environment
3. **Language detection failed**: Verify `navigator.language` value and detection logic

### Tray Related Issues
1. **Tray icon not displaying**: Check icon path and permissions
2. **Menu items not responding**: Verify event handler function binding
3. **Tray creation failed**: Check console error messages

## 📋 AI Collaboration Suggestions

### Understanding the Project
1. First read README.md to understand project background
2. Check package.json and Cargo.toml to understand dependencies
3. Check tauri.conf.json to understand application configuration
4. Browse directory structure to understand architecture design

### Modifying Code
1. **Frontend modifications**: Pay attention to Astro + Vue hybrid architecture
2. **Backend modifications**: Follow Tauri 2.x API specifications
3. **Internationalization**: Update both frontend and backend language handling
4. **Logging**: Use `log` crate instead of `println!`
5. **Backend translation**: Must use `t_with_current_locale()` instead of direct `rust_i18n::t!()`

### Adding New Features
1. Evaluate whether new Tauri commands are needed
2. Consider internationalization requirements
3. Update corresponding type definitions
4. Add appropriate error handling
5. If backend translation is needed, import and use `t_with_current_locale()` function

### Debugging Issues
1. Check frontend and backend log output
2. Verify Tauri API call methods
3. Confirm development environment correctness
4. Use browser developer tools to debug frontend

## 🔄 Version Management

### Version Number Rules
- **Frontend**: version in package.json
- **Backend**: version in Cargo.toml
- **Application**: version in tauri.conf.json

### Release Process
1. Update version numbers
2. Run comprehensive tests
3. Build production version
4. Update CHANGELOG.md
5. Create Git tags

## 📚 Reference Documentation

### Official Documentation
- [Tauri 2.x Documentation](https://tauri.app/)
- [Astro Documentation](https://astro.build/)
- [Vue 3 Documentation](https://vuejs.org/)
- [i18next Documentation](https://www.i18next.com/)

### Project-Specific Resources
- [Tauri Package Size Optimization](https://tauri.app/concept/size/)
- [rust-i18n Documentation](https://docs.rs/rust-i18n/)
- [Element Plus Documentation](https://element-plus.org/)

---

**Note**: This project is under active development, and architecture and features may be adjusted. AI should maintain adaptability to project evolution when assisting in development.
