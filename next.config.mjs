/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pg', 'pg-native'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: '/AI_Banking_Insights_Report.docx',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'attachment; filename="AI_Banking_Insights_Report.docx"',
          },
          {
            key: 'Content-Type',
            value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
