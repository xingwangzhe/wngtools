use tauri_plugin_opener::OpenerExt;

#[tauri::command]
pub fn shell_open_github(app_handle: tauri::AppHandle) -> Result<(), String> {
    app_handle
        .opener()
        .open_url("https://github.com/xingwangzhe/wngtools", None::<&str>)
        .map_err(|e| e.to_string())
}
