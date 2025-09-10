#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct File {
    pub name: String,
    pub path: String,
    pub type_: String,  // 使用 type_ 避免与 Rust 关键字冲突
    pub icon: String,
}