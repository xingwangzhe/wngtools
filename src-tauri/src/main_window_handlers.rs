use tauri::{App, Manager, WindowEvent};

pub fn setup_window_handlers(app: &mut App) {
    // 获取主窗口并添加关闭事件监听器
    let main_window = app.get_webview_window("main").unwrap();
    let main_window_clone = main_window.clone();
    main_window.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
            // 确保窗口处于正常状态
            if main_window_clone.is_visible().unwrap_or(false) {
                let _ = main_window_clone.hide();
                api.prevent_close();
            }
        }
    });
}
