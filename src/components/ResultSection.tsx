import type { CalculationResult } from '../types'
import { formatCurrency } from '../utils/format'

interface Props {
  result: CalculationResult
}

export default function ResultSection({ result }: Props) {
  const { totalRevenue, totalProfit, totalCost, netProfit, memberPayouts } = result
  const isDeficit = netProfit < 0

  return (
    <div className="space-y-6">
      {/* 요약 카드 4개 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="총 매출"
          value={formatCurrency(totalRevenue)}
          colorClass="text-gray-800"
        />
        <SummaryCard
          label="총 이익"
          value={formatCurrency(totalProfit)}
          colorClass="text-blue-700"
        />
        <SummaryCard
          label="총 고정비용"
          value={formatCurrency(totalCost)}
          colorClass="text-orange-600"
        />
        <SummaryCard
          label="분배 가능 금액"
          value={formatCurrency(netProfit)}
          colorClass={isDeficit ? 'text-red-600' : 'text-green-700'}
          badge={isDeficit ? '적자' : undefined}
        />
      </div>

      {/* 사람별 수령액 테이블 */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">사람별 수령액</h3>
          {isDeficit && (
            <p className="text-xs text-red-500 mt-1">
              순이익이 마이너스이므로 손실을 분배율에 따라 분담합니다.
            </p>
          )}
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">이름</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">분배율</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">수령액</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {memberPayouts.map((mp, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {mp.name || `멤버 ${i + 1}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-right tabular-nums">
                  {mp.ratio}%
                </td>
                <td
                  className={`px-6 py-4 text-sm font-semibold text-right tabular-nums ${
                    mp.payout < 0 ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {formatCurrency(mp.payout)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td className="px-6 py-3 text-xs font-semibold text-gray-600">합계</td>
              <td className="px-6 py-3 text-xs font-semibold text-gray-600 text-right tabular-nums">
                {memberPayouts.reduce((s, m) => s + m.ratio, 0)}%
              </td>
              <td
                className={`px-6 py-3 text-sm font-bold text-right tabular-nums ${
                  netProfit < 0 ? 'text-red-600' : 'text-green-700'
                }`}
              >
                {formatCurrency(netProfit)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: string
  colorClass: string
  badge?: string
}

function SummaryCard({ label, value, colorClass, badge }: SummaryCardProps) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className={`text-xl font-bold tabular-nums break-all ${colorClass}`}>
        {value}
      </span>
    </div>
  )
}
