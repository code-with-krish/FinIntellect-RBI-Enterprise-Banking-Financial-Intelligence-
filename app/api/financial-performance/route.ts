import { NextResponse } from 'next/server';
import { BankingAnalyticsService } from '@/lib/analytics';

export async function GET() {
  try {
    const trends = BankingAnalyticsService.getFinancialTrends();
    const bankGroups = BankingAnalyticsService.getBankGroups();

    return NextResponse.json({
      success: true,
      data: {
        trends,
        bankGroups
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve financial performance', detail: error?.message },
      { status: 500 }
    );
  }
}
