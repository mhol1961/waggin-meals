'use client';

interface ExportCSVButtonProps {
  data: any[];
  filename: string;
  headers: string[];
  mapRow: (item: any) => string[];
}

export default function ExportCSVButton({ data, filename, headers, mapRow }: ExportCSVButtonProps) {
  const handleExport = () => {
    const csv = [
      headers.join(','),
      ...data.map(item => mapRow(item).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-[#a5b5eb] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#8a9fd9] transition-colors"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      Export to CSV
    </button>
  );
}
