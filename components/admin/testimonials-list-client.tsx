'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArchiveButton from './archive-button';

interface Testimonial {
  id: string;
  dog_name: string;
  owner_name: string;
  category: string;
  rating: number;
  is_published: boolean;
  is_featured: boolean;
  archived?: boolean;
}

interface TestimonialsListClientProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsListClient({ initialTestimonials }: TestimonialsListClientProps) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  // Filter out archived testimonials
  const activeTestimonials = testimonials.filter(testimonial => !testimonial.archived);

  const handleArchiveComplete = (testimonialId: string) => {
    setTestimonials(prevTestimonials => prevTestimonials.filter(testimonial => testimonial.id !== testimonialId));
    router.refresh();
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {activeTestimonials.length} {activeTestimonials.length === 1 ? 'testimonial' : 'testimonials'} total
        </div>
        <Link
          href="/admin/testimonials/new"
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
        >
          + New Testimonial
        </Link>
      </div>

      {activeTestimonials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No testimonials yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start sharing success stories
          </p>
          <Link
            href="/admin/testimonials/new"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Add First Testimonial
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dog & Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTestimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {testimonial.dog_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.owner_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {testimonial.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {'⭐'.repeat(testimonial.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {testimonial.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                      {testimonial.is_featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/admin/testimonials/${testimonial.id}`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </Link>
                      <ArchiveButton
                        contentType="testimonial"
                        contentId={testimonial.id}
                        contentTitle={`${testimonial.dog_name} - ${testimonial.owner_name}`}
                        onArchiveComplete={() => handleArchiveComplete(testimonial.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
