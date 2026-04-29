import type { Member } from '../types'
import { generateId } from '../utils/format'

interface Props {
  members: Member[]
  onChange: (members: Member[]) => void
}

export default function MemberSection({ members, onChange }: Props) {
  const totalRatio = members.reduce((sum, m) => sum + (Number(m.ratio) || 0), 0)

  function update(id: string, field: keyof Member, raw: string) {
    onChange(
      members.map((m) => {
        if (m.id !== id) return m
        if (field === 'ratio') {
          const digits = raw.replace(/[^0-9.]/g, '')
          return { ...m, ratio: digits }
        }
        return { ...m, [field]: raw }
      })
    )
  }

  function add() {
    onChange([...members, { id: generateId(), name: '', ratio: '' }])
  }

  function remove(id: string) {
    if (members.length <= 1) return
    onChange(members.filter((m) => m.id !== id))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">C. 분배 인원</h2>
        <span className="text-sm font-semibold tabular-nums text-gray-500">
          현재 합계: {totalRatio}%
        </span>
      </div>

      <div className="space-y-2">
        <div className="hidden sm:grid sm:grid-cols-[1fr_120px_32px] gap-2 px-1">
          <span className="text-xs text-gray-400 font-medium">이름</span>
          <span className="text-xs text-gray-400 font-medium">분배율 (%)</span>
          <span />
        </div>

        {members.map((m) => (
          <div
            key={m.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_120px_32px] gap-2 items-center"
          >
            <input
              type="text"
              className="input-base"
              placeholder="이름"
              value={m.name}
              onChange={(e) => update(m.id, 'name', e.target.value)}
            />
            <input
              type="number"
              className="input-base"
              placeholder="0"
              min={0}
              max={100}
              value={m.ratio}
              onChange={(e) => update(m.id, 'ratio', e.target.value)}
            />
            <button
              className="btn-delete"
              onClick={() => remove(m.id)}
              disabled={members.length <= 1}
              aria-label="삭제"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>

      <button className="btn-ghost mt-4" onClick={add}>
        + 인원 추가
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
