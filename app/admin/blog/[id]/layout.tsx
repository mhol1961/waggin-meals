import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Blog Post | Admin',
  description: 'Edit blog post',
};

export default function AdminBlogEditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
