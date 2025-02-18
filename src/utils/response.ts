// 统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T | null;
}

// 成功响应
export const success = <T>(data: T, msg: string = '操作成功'): ApiResponse<T> => ({
  code: 0,
  msg,
  data
});

// 错误响应
export const error = (msg: string = '操作失败', code: number = 1): ApiResponse => ({
  code,
  msg,
  data: null
}); 