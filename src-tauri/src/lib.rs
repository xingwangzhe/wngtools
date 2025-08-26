use tauri::tray::TrayIconBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            println!("test:{:?} {:?}, cwd: {}", app, args, cwd);
        }))
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_positioner::init())
        // This is required to get tray-relative positions to work
        .setup(|app| {
            TrayIconBuilder::new()
                .on_tray_icon_event(|app, event| {
                    tauri_plugin_positioner::on_tray_event(app.app_handle(), &event);
                })
                .build(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_persisted_scope::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
