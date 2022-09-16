export type SpearlyGetParams = {
  limit?: number
  offset?: number
  order?: 'desc' | 'asc'
  orderDirection?: 'desc' | 'asc'
  orderBy?: string
  orders?: { [key: string]: 'asc' | 'desc' }
  filterBy?: string
  filterValue?: string | string[]
  filterMode: 'or' | 'and'
  filters: { [key: string]: string | string[] }
  filterRef?: string
  rangeFrom?: Date
  rangeTo?: Date
}
