use crate::types::files::File;
use tauri;
use tauri_plugin_clipboard_manager::ClipboardExt;

#[tauri::command]
pub fn add_clipboard(app: tauri::AppHandle, file: File) -> Result<(), String> {
    let clipboard = app.clipboard();

    if file.icon == "document" {
        let content = std::fs::read_to_string(&file.path).map_err(|e| e.to_string())?;
        clipboard.write_text(&content).map_err(|e| e.to_string())?;
    } else {
        // 对于图像和其他文件类型，复制文件路径
        clipboard.write_text(&file.path).map_err(|e| e.to_string())?;
    }

    println!("Added to clipboard: {} type: {}", file.path, file.icon);
    Ok(())
}