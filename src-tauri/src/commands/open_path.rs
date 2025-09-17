use tauri_plugin_opener::OpenerExt;

#[tauri::command]
pub fn open_path(app_handle: tauri::AppHandle, path: String) -> Result<(), String> {
    app_handle
        .opener()
        .open_path(path, None::<&str>)
        .map_err(|e| e.to_string())
}
