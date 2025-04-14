/**
 * 将日期转换为指定格式的字符串
 * @param date 日期对象
 * @returns 格式为 YYYY-MM-DD 的日期字符串
 */
export function getDateString(date: Date): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFullYearString(date = new Date()): string {
  return date.getFullYear().toString();
}
