mod commands;
mod main_window_handlers;
mod note_window_handlers;
mod types;

use tauri_plugin_window_state::StateFlags;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_window_state::Builder::new()
                .with_state_flags(StateFlags::all().difference(StateFlags::VISIBLE))
                .build(),
        )
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_positioner::init())
        // This is required to get tray-relative positions to work
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            println!(
                "单实例启动: app={:?}, args={:?}, cwd={:?}",
                app.package_info().name,
                args,
                cwd
            );
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
            main_window_handlers::setup_window_handlers(app);
            // note_window_handlers::setup_window_handlers(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::clipboard::add_clipboard,
            commands::show_window::show_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
