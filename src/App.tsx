import { useState } from 'react'
import type { Project, CostItem, Member, CalculationResult } from './types'
import { parseNumber, parseRatio, generateId } from './utils/format'
import ProjectSection from './components/ProjectSection'
import CostSection from './components/CostSection'
import MemberSection from './components/MemberSection'
import ResultSection from './components/ResultSection'

function createDefaultProjects(): Project[] {
  return [{ id: generateId(), name: '', revenue: '', margin: '' }]
}

function createDefaultCosts(): CostItem[] {
  return [{ id: generateId(), name: '', amount: '' }]
}

function createDefaultMembers(): Member[] {
  return [
    { id: generateId(), name: '', ratio: '50' },
    { id: generateId(), name: '', ratio: '50' },
  ]
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(createDefaultProjects)
  const [costs, setCosts] = useState<CostItem[]>(createDefaultCosts)
  const [members, setMembers] = useState<Member[]>(createDefaultMembers)
  const [result, setResult] = useState<CalculationResult | null>(null)

  const totalRatio = members.reduce((sum, m) => sum + (Number(m.ratio) || 0), 0)
  const canCalculate = totalRatio === 100

  function calculate() {
    const totalRevenue = projects.reduce((sum, p) => sum + parseNumber(p.revenue), 0)
    const totalProfit = projects.reduce(
      (sum, p) => sum + parseNumber(p.revenue) * (parseRatio(p.margin) / 100),
      0
    )
    const totalCost = costs.reduce((sum, c) => sum + parseNumber(c.amount), 0)
    const netProfit = totalProfit - totalCost

    const memberPayouts = members.map((m) => ({
      name: m.name,
      ratio: Number(m.ratio) || 0,
      payout: netProfit * ((Number(m.ratio) || 0) / 100),
    }))

    setResult({ totalRevenue, totalProfit, totalCost, netProfit, memberPayouts })

    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  function reset() {
    setProjects(createDefaultProjects())
    setCosts(createDefaultCosts())
    setMembers(createDefaultMembers())
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">이익 분배 시뮬레이터</h1>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            전체 초기화
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <ProjectSection projects={projects} onChange={setProjects} />
        <CostSection costs={costs} onChange={setCosts} />
        <MemberSection members={members} onChange={setMembers} />

        {/* 계산하기 버튼 */}
        <div className="flex justify-center pt-2">
          <button
            className="btn-primary w-full sm:w-auto sm:px-16"
            onClick={calculate}
            disabled={!canCalculate}
          >
            계산하기
          </button>
        </div>

        {!canCalculate && totalRatio !== 0 && (
          <p className="text-center text-sm text-red-500">
            분배율 합계가 100%가 되어야 계산할 수 있습니다. (현재 {totalRatio}%)
          </p>
        )}

        {/* 결과 영역 */}
        {result && (
          <div id="result-section" className="pt-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">결과</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <ResultSection result={result} />
          </div>
        )}
      </main>
    </div>
  )
}
