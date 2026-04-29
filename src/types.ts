export interface Project {
  id: string
  name: string
  revenue: string   // 입력용 string (콤마 포함)
  margin: string    // 입력용 string
}

export interface CostItem {
  id: string
  name: string
  amount: string    // 입력용 string (콤마 포함)
}

export interface Member {
  id: string
  name: string
  ratio: string     // 입력용 string
}

export interface CalculationResult {
  totalRevenue: number
  totalProfit: number
  totalCost: number
  netProfit: number
  memberPayouts: MemberPayout[]
}

export interface MemberPayout {
  name: string
  ratio: number
  payout: number
}
