import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const docPath = path.join(process.cwd(), 'public', 'AI_Banking_Insights_Report.docx');
    
    if (!fs.existsSync(docPath)) {
      return NextResponse.json(
        { success: false, error: 'Document not found on server' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(docPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="AI_Banking_Insights_Report.docx"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to serve Word document', detail: error?.message },
      { status: 500 }
    );
  }
}
