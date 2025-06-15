import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Lỗi không xác định';
  }
  return 'Lỗi không xác định';
}
