
use tauri::{command, AppHandle};

#[command]
pub fn send_notification(app: AppHandle, title: String, body: String) -> Result<(), String> {
    use tauri_plugin_notification::NotificationExt;
    
    // Try to send notification
    let result = app.notification()
        .builder()
        .title(&title)
        .body(&body)
        .show();
    
    // Print logs based on the result
    match result {
        Ok(_) => {
            println!("OK: Notification sent successfully - Title: '{}', Body: '{}'", title, body);
            Ok(())
        }
        Err(e) => {
            eprintln!("ERR: Failed to send notification - Error: '{}'", e);
            Err(e.to_string())
        }
    }
}