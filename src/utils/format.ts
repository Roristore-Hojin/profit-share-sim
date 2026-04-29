/** 숫자를 ₩1,234,567 형식으로 포맷 */
export function formatCurrency(value: number): string {
  return `₩${Math.round(value).toLocaleString('ko-KR')}`
}

/** 입력 문자열에서 숫자만 추출하여 콤마 포맷 문자열 반환 */
export function formatNumberInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  if (digits === '') return ''
  return Number(digits).toLocaleString('ko-KR')
}

/** 콤마 포함 문자열 → 순수 숫자 (파싱 실패 시 0) */
export function parseNumber(value: string): number {
  const n = Number(value.replace(/,/g, ''))
  return isNaN(n) || n < 0 ? 0 : n
}

/** 비율 문자열 → 숫자 (0~100 클램프) */
export function parseRatio(value: string): number {
  const n = Number(value)
  if (isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}

/** 고유 ID 생성 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
