import type { CostItem } from '../types'
import { formatNumberInput, generateId } from '../utils/format'

const PLACEHOLDERS = ['임대료', '세무기장료', '○○ 월급', '기타 비용']

interface Props {
  costs: CostItem[]
  onChange: (costs: CostItem[]) => void
}

export default function CostSection({ costs, onChange }: Props) {
  function update(id: string, field: keyof CostItem, raw: string) {
    onChange(
      costs.map((c) => {
        if (c.id !== id) return c
        if (field === 'amount') return { ...c, amount: formatNumberInput(raw) }
        return { ...c, [field]: raw }
      })
    )
  }

  function add() {
    onChange([...costs, { id: generateId(), name: '', amount: '' }])
  }

  function remove(id: string) {
    if (costs.length <= 1) return
    onChange(costs.filter((c) => c.id !== id))
  }

  return (
    <div className="card">
      <h2 className="section-title">B. 고정 비용</h2>

      <div className="space-y-2">
        <div className="hidden sm:grid sm:grid-cols-[1fr_160px_32px] gap-2 px-1">
          <span className="text-xs text-gray-400 font-medium">항목명</span>
          <span className="text-xs text-gray-400 font-medium">금액 (원)</span>
          <span />
        </div>

        {costs.map((c, i) => (
          <div
            key={c.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_160px_32px] gap-2 items-center"
          >
            <input
              type="text"
              className="input-base"
              placeholder={PLACEHOLDERS[i % PLACEHOLDERS.length]}
              value={c.name}
              onChange={(e) => update(c.id, 'name', e.target.value)}
            />
            <input
              type="text"
              inputMode="numeric"
              className="input-base"
              placeholder="0"
              value={c.amount}
              onChange={(e) => update(c.id, 'amount', e.target.value)}
            />
            <button
              className="btn-delete"
              onClick={() => remove(c.id)}
              disabled={costs.length <= 1}
              aria-label="삭제"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>

      <button className="btn-ghost mt-4" onClick={add}>
        + 비용 추가
      </button>
    </div>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="2" y1="2" x2="12" y2="12" />
      <line x1="12" y1="2" x2="2" y2="12" />
    </svg>
  )
}
