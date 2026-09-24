import { NextResponse } from 'next/server';
import { BankingAnalyticsService } from '@/lib/analytics';

export async function GET() {
  try {
    const kpis = BankingAnalyticsService.getKPIs();
    return NextResponse.json({
      success: true,
      data: kpis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve banking KPIs', detail: error?.message },
      { status: 500 }
    );
  }
}
