use log::{error, info};
use rust_i18n::i18n;

i18n!("../locales");

mod commands;
mod main_window_handlers;
// mod note_window_handlers;
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
            info!(
                "{}: app={:?}, args={:?}, cwd={:?}",
                commands::locale::t_with_current_locale("app.singleInstance"),
                app.package_info().name,
                args,
                cwd
            );
        }))
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .setup(|app| {
            let log_level = if cfg!(debug_assertions) {
                log::LevelFilter::Debug
            } else {
                log::LevelFilter::Off
            };

            app.handle().plugin(
                tauri_plugin_log::Builder::default()
                    .level(log_level)
                    .build(),
            )?;

            // 请求前端发送语言信息
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                // 给前端一点时间初始化
                std::thread::sleep(std::time::Duration::from_millis(500));
                if let Err(e) = commands::locale::request_language_from_frontend(app_handle) {
                    error!("请求前端语言信息失败: {}", e);
                }
            });

            main_window_handlers::setup_window_handlers(app);
            // note_window_handlers::setup_window_handlers(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::clipboard::add_clipboard,
            commands::show_window::show_window,
            commands::save_note::save_notes,
            commands::locale::set_language_from_frontend,
            commands::locale::get_current_language,
            commands::locale::request_language_from_frontend,
            commands::locale::get_supported_languages,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
