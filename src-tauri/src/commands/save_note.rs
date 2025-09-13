use std::fs;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};

#[tauri::command]
pub fn save_notes(label: &str, content: &str, app: AppHandle) {
    println!("nia - saving note for window: {}", label);
    let note_window = app.get_webview_window(label).unwrap();
    let note_window_clone = note_window.clone();
    let app_clone = app.clone();
    let label_clone = label.to_string();
    let content_clone = content.to_string();

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
                // 用户选择保存：先通知前端（保留现有结构）
                let _ = app_clone.emit_to(&label_clone, "note_close", result);

                // 使用 dialog 插件的 blocking_save_file 获取 FilePath，然后用 into_path() 转成 PathBuf
                let filepath = app_clone
                    .dialog()
                    .file()
                    .add_filter("Text", &["txt"])
                    .blocking_save_file();

                match filepath {
                    Some(fp) => {
                        match fp.into_path() {
                            Ok(pathbuf) => {
                                match fs::write(&pathbuf, &content_clone) {
                                    Ok(_) => {
                                        // 保存成功：通知前端（此处使用 note_close true 表示可以关闭）
                                        let _ = app_clone.emit_to(&label_clone, "note_close", true);
                                        println!("Note saved to {:?}", pathbuf);
                                    }
                                    Err(e) => {
                                        eprintln!("Failed to write note to {:?}: {}", pathbuf, e);
                                        let _ =
                                            app_clone.emit_to(&label_clone, "note_close", false);
                                    }
                                }
                            }
                            Err(e) => {
                                eprintln!("Failed to convert FilePath into PathBuf: {}", e);
                                let _ = app_clone.emit_to(&label_clone, "note_close", false);
                            }
                        }
                    }
                    None => {
                        // 用户在保存对话框中取消：通知前端不要关闭
                        let _ = app_clone.emit_to(&label_clone, "note_close", false);
                        println!("Save dialog cancelled by user");
                    }
                }

                let _ = note_window_clone.close();
            }
            false => {
                // 用户在最初确认对话框中取消：通知前端不要关闭
                let _ = app_clone.emit_to(&label_clone, "note_close", false);
                let _ = note_window_clone.close();
            }
        });
}
