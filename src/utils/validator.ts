// 验证手机号
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 验证用户名
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
  return usernameRegex.test(username);
};

// 验证密码
export const isValidPassword = (password: string): boolean => {
  // 密码至少6位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// 验证图片URL
export const isValidImageUrl = (url: string): boolean => {
  const imageRegex = /\.(jpg|jpeg|png|gif)$/i;
  return imageRegex.test(url);
};

// 验证邮箱
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}; 