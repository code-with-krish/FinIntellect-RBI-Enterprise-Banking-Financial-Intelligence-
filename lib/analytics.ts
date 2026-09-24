import { getMasterAnalytics, MasterAnalyticsData } from './db';

export interface KPIOverview {
  totalDeposits: number;
  totalAdvances: number;
  cdRatio: number;
  grossNpa: number;
  netNpa: number;
  gnpaRatio: number;
  avgRoa: number;
  totalBranches: number;
  source: string;
}

export const BankingAnalyticsService = {
  getKPIs(): KPIOverview {
    const data = getMasterAnalytics();
    return {
      totalDeposits: data.kpis.total_deposits_crore,
      totalAdvances: data.kpis.total_advances_crore,
      cdRatio: data.kpis.cd_ratio_pct,
      grossNpa: data.kpis.gross_npa_crore,
      netNpa: data.kpis.net_npa_crore,
      gnpaRatio: data.kpis.gnpa_ratio_pct,
      avgRoa: data.kpis.avg_roa_pct,
      totalBranches: data.kpis.total_branches,
      source: data.metadata.source,
    };
  },

  getFinancialTrends() {
    const data = getMasterAnalytics();
    return data.trends;
  },

  getBankGroups() {
    const data = getMasterAnalytics();
    return data.bank_groups;
  },

  getGeographicRankings(limit: number = 20) {
    const data = getMasterAnalytics();
    return data.states.slice(0, limit);
  },

  getSectoralDistribution() {
    const data = getMasterAnalytics();
    return data.sectors;
  },

  getAnomalies() {
    const data = getMasterAnalytics();
    return data.anomalies;
  },

  getDataQualityMetrics() {
    const data = getMasterAnalytics();
    return data.data_quality;
  },

  getMetadata() {
    const data = getMasterAnalytics();
    return data.metadata;
  }
};
