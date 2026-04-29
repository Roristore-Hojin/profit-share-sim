import type { Project } from '../types'
import { formatNumberInput, generateId } from '../utils/format'

interface Props {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

export default function ProjectSection({ projects, onChange }: Props) {
  function update(id: string, field: keyof Project, raw: string) {
    onChange(
      projects.map((p) => {
        if (p.id !== id) return p
        if (field === 'revenue') return { ...p, revenue: formatNumberInput(raw) }
        if (field === 'margin') {
          const n = raw.replace(/[^0-9.]/g, '')
          const clamped = Math.min(100, Math.max(0, Number(n) || 0))
          return { ...p, margin: n === '' ? '' : String(clamped) }
        }
        return { ...p, [field]: raw }
      })
    )
  }

  function add() {
    onChange([...projects, { id: generateId(), name: '', revenue: '', margin: '' }])
  }

  function remove(id: string) {
    if (projects.length <= 1) return
    onChange(projects.filter((p) => p.id !== id))
  }

  return (
    <div className="card">
      <h2 className="section-title">A. 프로젝트 매출</h2>

      <div className="space-y-2">
        {/* 헤더 */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_160px_100px_32px] gap-2 px-1">
          <span className="text-xs text-gray-400 font-medium">프로젝트명</span>
          <span className="text-xs text-gray-400 font-medium">매출액 (원)</span>
          <span className="text-xs text-gray-400 font-medium">마진율 (%)</span>
          <span />
        </div>

        {projects.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_160px_100px_32px] gap-2 items-center"
          >
            <input
              type="text"
              className="input-base"
              placeholder="프로젝트명 (선택)"
              value={p.name}
              onChange={(e) => update(p.id, 'name', e.target.value)}
            />
            <input
              type="text"
              inputMode="numeric"
              className="input-base"
              placeholder="0"
              value={p.revenue}
              onChange={(e) => update(p.id, 'revenue', e.target.value)}
            />
            <input
              type="number"
              className="input-base"
              placeholder="0"
              min={0}
              max={100}
              value={p.margin}
              onChange={(e) => update(p.id, 'margin', e.target.value)}
            />
            <button
              className="btn-delete"
              onClick={() => remove(p.id)}
              disabled={projects.length <= 1}
              aria-label="삭제"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>

      <button className="btn-ghost mt-4" onClick={add}>
        + 프로젝트 추가
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
