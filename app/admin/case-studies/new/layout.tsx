import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Case Study | Admin',
  description: 'Create new case study',
};

export default function AdminNewCaseStudyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
