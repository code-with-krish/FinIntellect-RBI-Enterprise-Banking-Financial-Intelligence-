import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), 'reports', 'banking_executive_report.pdf');

    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { success: false, error: 'PDF report has not been generated yet. Please run the ETL pipeline.' },
        { status: 404 }
      );
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="AI_Banking_Insights_Report.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to download report', detail: error?.message },
      { status: 500 }
    );
  }
}
