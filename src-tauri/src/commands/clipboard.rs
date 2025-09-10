use crate::types::files::File;
use image::{GenericImageView, ImageReader};
use tauri;
use tauri::image::Image;
use tauri_plugin_clipboard_manager::ClipboardExt;

#[tauri::command]
pub fn add_clipboard(app: tauri::AppHandle, file: File) -> Result<(), String> {
    let clipboard = app.clipboard();

    if file.icon == "document" {
        // 文档文件：读取文本内容
        let content = std::fs::read_to_string(&file.path).map_err(|e| e.to_string())?;
        clipboard.write_text(&content).map_err(|e| e.to_string())?;
        println!(
            "Added text content to clipboard: {} ({} chars)",
            file.path,
            content.len()
        );
    } else if file.icon == "image" {
        // 图像文件：解码图像数据并复制图像
        let img = ImageReader::open(&file.path)
            .map_err(|e| e.to_string())?
            .decode()
            .map_err(|e| e.to_string())?;
        let (w, h) = img.dimensions();
        let rgba_data = img.to_rgba8().into_raw();
        let tauri_img = Image::new(&rgba_data, w, h);
        clipboard
            .write_image(&tauri_img)
            .map_err(|e| e.to_string())?;
        println!("Added image to clipboard: {} ({}x{})", file.path, w, h);
    } else {
        clipboard
            .write_text(&file.path)
            .map_err(|e| e.to_string())?;
        println!("Added file path to clipboard: {}", file.path);
    }

    Ok(())
}
