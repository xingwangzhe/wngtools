export interface DragDropPayload {
  paths: string[];
}

export interface File {
  name: string;
  path: string;
  type_: string; // 使用 type_ 避免与 TypeScript 关键字冲突
}
