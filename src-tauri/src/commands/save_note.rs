use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
#[tauri::command]

pub fn save_notes(label: &str, content: &str, app: AppHandle) {
    println!("nia - saving note for window: {}", label);
    let note_window = app.get_webview_window(label).unwrap();
    let note_window_clone = note_window.clone();
    let app_clone = app.clone();
    let label_clone = label.to_string();
    let result = note_window
        .dialog()
        .message("Do you want to save the note?")
        .title("Save Note")
        .buttons(MessageDialogButtons::OkCancelCustom(
            "Save".to_string(),
            "Cancel".to_string(),
        ))
        .show(move |result| match result {
            true => {
                println!("{}", result);
                app_clone
                    .emit_to(&label_clone, "note_close", result)
                    .unwrap();

                let _ = note_window_clone.close();
            } // do something,
            false => {
                let _ = note_window_clone.close();
            } // do something,
        });
}
