use rust_i18n::t;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn show_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err(t!("window_show_error").to_string())
    }
}
