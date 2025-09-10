use crate::types::files::File;
use tauri;
use tauri_plugin_clipboard_manager::ClipboardExt;

// remember to call `.manage(MyState::default())`
#[tauri::command]
pub fn add_clipboard(app: tauri::AppHandle, file: File) {
    let clipboard = app.clipboard();
    clipboard.write_text(&file.path).unwrap();
    println!("Added to clipboard: {}", file.path);
}