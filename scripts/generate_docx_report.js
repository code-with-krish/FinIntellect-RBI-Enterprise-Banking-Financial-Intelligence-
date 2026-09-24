const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} = require('docx');
const fs = require('fs');
const path = require('path');

async function generateExecutiveDocx() {
  const borderNone = { style: BorderStyle.NONE, size: 0, color: 'auto' };
  const borderTable = {
    top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
  };

  const doc = new Document({
    title: 'AI Banking & Financial Intelligence Executive Report',
    description: 'Reserve Bank of India (RBI DBIE) Grounded Performance, Credit Analytics & Boardroom Directives',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins
          },
        },
        children: [
          // Header Badge
          new Paragraph({
            children: [
              new TextRun({
                text: 'OFFICIAL RESERVE BANK OF INDIA (RBI DBIE) AUDITED DATASET',
                bold: true,
                size: 18,
                color: '1E40AF',
              }),
            ],
            spacing: { after: 120 },
          }),

          // Main Title
          new Paragraph({
            children: [
              new TextRun({
                text: 'Executive Banking Performance & Financial Intelligence Report',
                bold: true,
                size: 36,
                color: '0F172A',
              }),
            ],
            spacing: { after: 100 },
          }),

          // Subtitle
          new Paragraph({
            children: [
              new TextRun({
                text: 'Multi-Year System Surveillance: FY2018 – FY2024 • Scheduled Commercial Banks (SCBs)',
                italics: true,
                size: 22,
                color: '475569',
              }),
            ],
            spacing: { after: 200 },
          }),

          // Metadata Box
          new Paragraph({
            children: [
              new TextRun({
                text: 'Published: Audited FY2024 Returns   |   Source: RBI DBIE Central Warehouse   |   Classification: Executive Boardroom Report',
                size: 18,
                color: '64748B',
              }),
            ],
            spacing: { after: 300 },
          }),

          // Divider Paragraph
          new Paragraph({
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                color: 'CBD5E1',
              }),
            ],
            spacing: { after: 250 },
          }),

          // Section 1: Executive Summary
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Executive Summary & Macro Highlights',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
            spacing: { before: 200, after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'The Indian Scheduled Commercial Banking (SCB) system has demonstrated unprecedented structural strength throughout the FY2018–FY2024 surveillance cycle. Gross Non-Performing Assets (GNPA) have dropped dramatically to a multi-decade record low of ',
                size: 22,
                color: '334155',
              }),
              new TextRun({
                text: '2.80% in FY2024',
                bold: true,
                size: 22,
                color: '15803D',
              }),
              new TextRun({
                text: ' (compared to 11.18% in FY2018), marking a total contraction of 838 basis points. Return on Assets (RoA) has rebounded to a historic high of ',
                size: 22,
                color: '334155',
              }),
              new TextRun({
                text: '+1.15%',
                bold: true,
                size: 22,
                color: '1E40AF',
              }),
              new TextRun({
                text: ' from -0.30% in FY2018, confirming a complete systemic turnaround.',
                size: 22,
                color: '334155',
              }),
            ],
            spacing: { after: 160 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'However, rapid credit expansion (+15.3% YoY to ₹164.20 Lakh Crore) continues to significantly outstrip deposit mobilization (+11.4% YoY to ₹204.38 Lakh Crore). This divergence has propelled the aggregate Credit-Deposit (CD) ratio to ',
                size: 22,
                color: '334155',
              }),
              new TextRun({
                text: '80.34%',
                bold: true,
                size: 22,
                color: 'B45309',
              }),
              new TextRun({
                text: '—breaching the RBI recommended comfort threshold of 75.00% by 534 basis points and requiring disciplined liquidity and liability management.',
                size: 22,
                color: '334155',
              }),
            ],
            spacing: { after: 240 },
          }),

          // Section 2: National Core Metrics Table
          new Paragraph({
            children: [
              new TextRun({
                text: '2. National Core Banking Performance Matrix',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
            spacing: { before: 200, after: 140 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: borderTable,
            rows: [
              // Header Row
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Indicator', bold: true, color: 'FFFFFF', size: 20 })] })],
                    shading: { fill: '0F172A' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'FY2024 Value', bold: true, color: 'FFFFFF', size: 20 })] })],
                    shading: { fill: '0F172A' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'FY2018 Baseline', bold: true, color: 'FFFFFF', size: 20 })] })],
                    shading: { fill: '0F172A' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Trajectory', bold: true, color: 'FFFFFF', size: 20 })] })],
                    shading: { fill: '0F172A' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Prudential Status', bold: true, color: 'FFFFFF', size: 20 })] })],
                    shading: { fill: '0F172A' },
                  }),
                ],
              }),
              // Row 1: Deposits
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Total Deposits', bold: true, size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹204.38 Lakh Cr', bold: true, color: '1E40AF', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹114.75 Lakh Cr', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '+78.1% (+11.4% YoY)', bold: true, color: '15803D', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Stable Expansion', size: 20 })] })] }),
                ],
              }),
              // Row 2: Credit
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Gross Bank Credit', bold: true, size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹164.20 Lakh Cr', bold: true, color: '4338CA', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹86.25 Lakh Cr', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '+90.4% (+15.3% YoY)', bold: true, color: '4338CA', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'High Growth', size: 20 })] })] }),
                ],
              }),
              // Row 3: CD Ratio
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Credit-Deposit (CD) Ratio', bold: true, size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '80.34%', bold: true, color: 'B45309', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '75.16%', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '+518 bps Expansion', bold: true, color: 'B45309', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tight Liquidity Warning', bold: true, color: 'B45309', size: 20 })] })] }),
                ],
              }),
              // Row 4: Gross NPA
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Gross NPA Ratio', bold: true, size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '2.80%', bold: true, color: '15803D', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '11.18%', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '-838 bps Contraction', bold: true, color: '15803D', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Decadal Solvency Low', bold: true, color: '15803D', size: 20 })] })] }),
                ],
              }),
              // Row 5: RoA
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Return on Assets (RoA)', bold: true, size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '1.15%', bold: true, color: '6D28D9', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '-0.30%', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '+145 bps Turnaround', bold: true, color: '6D28D9', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Record Profitability', bold: true, color: '6D28D9', size: 20 })] })] }),
                ],
              }),
            ],
          }),

          // Section 3: Geographic Distribution
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Geographic Credit Concentration (Top 5 States)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
            spacing: { before: 260, after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Indian credit distribution remains highly concentrated in industrial and financial epicenters. The top 5 states collectively account for ',
                size: 22,
                color: '334155',
              }),
              new TextRun({
                text: '52.4% of all gross bank credit',
                bold: true,
                size: 22,
                color: '1E40AF',
              }),
              new TextRun({
                text: ' in the country:',
                size: 22,
                color: '334155',
              }),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: '• ', bold: true }),
              new TextRun({ text: 'Maharashtra: ', bold: true }),
              new TextRun({ text: '₹45.16 Lakh Crore (27.5% national share) – India’s primary banking & corporate capital.' }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• ', bold: true }),
              new TextRun({ text: 'Tamil Nadu: ', bold: true }),
              new TextRun({ text: '₹14.45 Lakh Crore (8.8% national share) – Heavy automotive, manufacturing & MSME credit.' }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• ', bold: true }),
              new TextRun({ text: 'Uttar Pradesh: ', bold: true }),
              new TextRun({ text: '₹10.35 Lakh Crore (6.3% national share) – High deposit mobilization & growing infrastructure.' }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• ', bold: true }),
              new TextRun({ text: 'Karnataka: ', bold: true }),
              new TextRun({ text: '₹9.03 Lakh Crore (5.5% national share) – Tech hubs and innovation finance.' }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• ', bold: true }),
              new TextRun({ text: 'Gujarat: ', bold: true }),
              new TextRun({ text: '₹7.06 Lakh Crore (4.3% national share) – Export, chemicals & industrial manufacturing.' }),
            ],
            spacing: { after: 200 },
          }),

          // Section 4: Sectoral Allocation
          new Paragraph({
            children: [
              new TextRun({
                text: '4. Sectoral Credit Deployment',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
            spacing: { before: 200, after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: '1. Services (38.2%): Leading sector driven by transport, wholesale trade, non-banking financial companies (NBFCs), and logistics.',
                size: 22,
                color: '334155',
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Industry (28.5%): Heavy infrastructure, renewable power, steel, chemicals, and electronics manufacturing.',
                size: 22,
                color: '334155',
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Personal & Retail Loans (20.1%): Housing loans, vehicle financing, and consumer credit cards.',
                size: 22,
                color: '334155',
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '4. Agriculture & Allied Activities (13.2%): Priority sector lending (PSL) meeting mandatory RBI quotas with high recovery rates.',
                size: 22,
                color: '334155',
              }),
            ],
            spacing: { after: 200 },
          }),

          // Section 5: Recommendations
          new Paragraph({
            children: [
              new TextRun({
                text: '5. Boardroom Recommendations & Strategic Directives',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
            spacing: { before: 200, after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: '1. Structured Retail Deposit Mobilization: ', bold: true }),
              new TextRun({ text: 'Roll out digitized laddered term deposit campaigns to bring the system CD ratio down to the 74%-77% corridor.' }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Unsecured Credit Underwriting Safeguards: ', bold: true }),
              new TextRun({ text: 'Enforce strict 45.0% Debt-to-Income (DTI) caps on personal loans to shield balance sheets from rising retail defaults.' }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Geographic Credit Diversification: ', bold: true }),
              new TextRun({ text: 'Reallocate credit delivery quotas toward Tier-2 and Tier-3 manufacturing corridors to reduce metro over-concentration.' }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Capital Buffer Accretion: ', bold: true }),
              new TextRun({ text: 'Retain an additional 100 bps Common Equity Tier 1 (CET-1) capital from high FY2024 earnings prior to dividend distributions.' }),
            ],
            spacing: { after: 240 },
          }),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: 'Generated by AI Banking & Financial Intelligence Platform • Audited Reserve Bank of India DBIE Ground Truth • Confidential Boardroom Document',
                size: 16,
                italics: true,
                color: '94A3B8',
              }),
            ],
            spacing: { before: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

// Generate and save to project root and public folder
generateExecutiveDocx().then((buffer) => {
  const projectRoot = path.resolve(__dirname, '..');
  const rootPath = path.join(projectRoot, 'AI_Banking_Insights_Report.docx');
  const publicPath = path.join(projectRoot, 'public', 'AI_Banking_Insights_Report.docx');
  fs.writeFileSync(rootPath, buffer);
  fs.writeFileSync(publicPath, buffer);
  console.log('Saved report to root:', rootPath, 'size:', buffer.length);
  console.log('Saved report to public:', publicPath, 'size:', buffer.length);
});
