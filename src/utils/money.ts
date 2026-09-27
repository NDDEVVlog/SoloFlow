/** Format a plain number as Vietnamese currency, e.g. 1500000 -> "1.500.000đ". */
export function formatVnd(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ'
}