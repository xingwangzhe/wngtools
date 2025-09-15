use crate::commands::locale::t_with_current_locale;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn show_window(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|e| e.to_string())?;
        println!("{}", t_with_current_locale("pages.about"));
        Ok(())
    } else {
        Err("窗口显示错误".to_string())
    }
}
