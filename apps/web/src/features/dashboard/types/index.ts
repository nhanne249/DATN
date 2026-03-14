export interface KpiCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export interface SubKpi {
  label: string;
  value: string | number;
}

export interface ChartData {
  date: string;
  revenue: number;
  occupancy: number;
}

export interface RoomStatusTab {
  key: string;
  label: string;
  count: number;
}

export interface DashboardTableData {
  id: string;
  code: string;
  rooms: string;
  guestName: string;
  source: string;
  nights: number;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  tabs: string[];
}

export interface DashboardSummary {
  kpiCards: KpiCard[];
  subKpis: SubKpi[];
  chartData: ChartData[];
  roomStatusTabs: RoomStatusTab[];
  tableData: DashboardTableData[];
}

export interface DashboardParams {
  propertyId: string;
  startDate?: string;
  endDate?: string;
}
