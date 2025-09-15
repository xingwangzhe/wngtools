use log::{debug, error, info};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter, command};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LanguageInfo {
    pub language_code: String,
    pub is_from_frontend: bool,
}

// 使用 Arc<Mutex<>> 来安全地管理全局语言状态
lazy_static::lazy_static! {
    static ref CURRENT_LANGUAGE: Arc<Mutex<String>> = Arc::new(Mutex::new("en".to_string()));
}

/// 从前端接收语言信息并设置到 rust-i18n
#[command]
pub fn set_language_from_frontend(language_code: String) -> Result<(), String> {
    // 验证语言代码
    let valid_languages = ["zh-CN", "zh-HK", "en"];
    if !valid_languages.contains(&language_code.as_str()) {
        return Err(format!("不支持的语言代码: {}", language_code));
    }

    // 设置 rust-i18n 的语言
    rust_i18n::set_locale(&language_code);

    // 保存到全局变量
    if let Ok(mut current_lang) = CURRENT_LANGUAGE.lock() {
        *current_lang = language_code.clone();
        info!("后端语言已设置为: {}", language_code);
        debug!("当前 rust-i18n locale: {}", rust_i18n::locale().to_string());
    } else {
        error!("设置全局语言变量失败");
    }

    Ok(())
}

/// 获取当前设置的语言
#[command]
pub fn get_current_language() -> String {
    CURRENT_LANGUAGE
        .lock()
        .unwrap_or_else(|_| panic!("Mutex poisoned"))
        .clone()
}

/// 请求前端发送语言信息
#[command]
pub fn request_language_from_frontend(app_handle: AppHandle) -> Result<(), String> {
    debug!("向前端请求语言信息");

    // 向前端发送事件，请求语言信息
    app_handle.emit("request-language", ()).map_err(|e| {
        error!("发送语言请求事件失败: {}", e);
        e.to_string()
    })?;

    debug!("语言请求事件已发送到前端");
    Ok(())
}

/// 获取支持的语言列表
#[command]
pub fn get_supported_languages() -> Vec<String> {
    vec!["zh-CN".to_string(), "zh-HK".to_string(), "en".to_string()]
}

/// 使用当前语言进行翻译的辅助函数
pub fn t_with_current_locale(key: &str) -> String {
    let current_locale = CURRENT_LANGUAGE
        .lock()
        .unwrap_or_else(|_| panic!("Mutex poisoned"))
        .clone();

    debug!("翻译请求: key='{}', 当前语言='{}'", key, current_locale);

    // 临时设置语言（如果需要的话）
    let original_locale = rust_i18n::locale().to_string();
    if original_locale != current_locale {
        debug!("切换语言: {} -> {}", original_locale, current_locale);
        rust_i18n::set_locale(&current_locale);
    }

    let result = rust_i18n::t!(key).to_string();
    debug!("翻译结果: '{}'", result);

    // 恢复原始语言设置（如果需要的话）
    if original_locale != current_locale {
        rust_i18n::set_locale(&original_locale);
    }

    result
}
