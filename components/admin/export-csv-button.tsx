'use client';

interface ExportCSVButtonProps {
  data: string[][]; // Pre-formatted rows
  filename: string;
  headers: string[];
}

export default function ExportCSVButton({ data, filename, headers }: ExportCSVButtonProps) {
  const handleExport = () => {
    // Escape and quote CSV values properly
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csv = [
      headers.map(escapeCSV).join(','),
      ...data.map(row => row.map(escapeCSV).join(','))
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
      className="bg-[#8FAE8F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#6d8c6d] transition-colors"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      Export to CSV
    </button>
  );
}
