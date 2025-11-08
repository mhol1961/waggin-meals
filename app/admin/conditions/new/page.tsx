'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { ConditionPageContent, ContentSection, FAQItem } from '@/types/condition-page';

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface FormData {
  condition_name: string;
  primary_keyword: string;
  use_ai: boolean;
  meta_title: string;
  meta_description: string;
  secondary_keywords: string[];
  content: ConditionPageContent;
  featured_image: string;
}

export default function NewConditionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(false);
  const [seoScore, setSeoScore] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    condition_name: '',
    primary_keyword: '',
    use_ai: false,
    meta_title: '',
    meta_description: '',
    secondary_keywords: [],
    content: {
      h1: '',
      hero_subheading: '',
      sections: [
        { heading: '', content: '', layout: 'full-width', order: 1 }
      ],
      faq: [
        { question: '', answer: '', order: 1 }
      ],
      cta_placements: ['hero', 'bottom']
    },
    featured_image: ''
  });

  // Common dog health conditions
  const conditionOptions = [
    'Allergies',
    'Pancreatitis',
    'Kidney Disease',
    'Sensitive Stomach',
    'Skin Issues',
    'IBD (Inflammatory Bowel Disease)',
    'Diarrhea',
    'Weight Management',
    'Arthritis',
    'Custom (Enter Below)'
  ];

  const generateSlug = (condition: string) => {
    return 'fresh-food-for-dogs-with-' +
           condition.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: [
          ...prev.content.sections,
          { heading: '', content: '', layout: 'full-width', order: prev.content.sections.length + 1 }
        ]
      }
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.filter((_, i) => i !== index)
      }
    }));
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        faq: [
          ...prev.content.faq,
          { question: '', answer: '', order: prev.content.faq.length + 1 }
        ]
      }
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        faq: prev.content.faq.filter((_, i) => i !== index)
      }
    }));
  };

  const calculateSEO = () => {
    let score = 0;
    const checks = {
      hasMetaTitle: false,
      hasMetaDescription: false,
      keywordInTitle: false,
      keywordInH1: false,
      hasMinContent: false,
      hasFAQ: false,
      hasMultipleSections: false,
      metaDescriptionLength: false,
      hasCTAs: false,
      hasSecondaryKeywords: false
    };

    // Meta title (10 points)
    if (formData.meta_title && formData.meta_title.length >= 30) {
      score += 10;
      checks.hasMetaTitle = true;
    }

    // Meta description (10 points)
    if (formData.meta_description && formData.meta_description.length >= 120) {
      score += 10;
      checks.hasMetaDescription = true;
      if (formData.meta_description.length <= 160) {
        checks.metaDescriptionLength = true;
      }
    }

    // Keyword in title (15 points)
    if (formData.meta_title.toLowerCase().includes(formData.primary_keyword.toLowerCase())) {
      score += 15;
      checks.keywordInTitle = true;
    }

    // Keyword in H1 (15 points)
    if (formData.content.h1.toLowerCase().includes(formData.primary_keyword.toLowerCase())) {
      score += 15;
      checks.keywordInH1 = true;
    }

    // Word count (15 points)
    const totalWords = formData.content.sections.reduce((acc, section) => {
      return acc + section.content.split(/\s+/).length;
    }, 0);
    if (totalWords >= 500) {
      score += 15;
      checks.hasMinContent = true;
    }

    // FAQ section (10 points)
    if (formData.content.faq.length >= 3 && formData.content.faq.every(q => q.question && q.answer)) {
      score += 10;
      checks.hasFAQ = true;
    }

    // Multiple sections (10 points)
    if (formData.content.sections.length >= 3) {
      score += 10;
      checks.hasMultipleSections = true;
    }

    // CTAs (5 points)
    if (formData.content.cta_placements.length >= 2) {
      score += 5;
      checks.hasCTAs = true;
    }

    // Secondary keywords (10 points)
    if (formData.secondary_keywords.length >= 3) {
      score += 10;
      checks.hasSecondaryKeywords = true;
    }

    setSeoScore(score);
    return { score, checks };
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const slug = generateSlug(formData.condition_name);

      // Generate schema markup
      const schema_markup = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MedicalCondition',
            name: formData.condition_name,
            possibleTreatment: {
              '@type': 'MedicalTherapy',
              name: 'Fresh Food Diet',
              description: formData.meta_description
            }
          },
          {
            '@type': 'FAQPage',
            mainEntity: formData.content.faq.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
              }
            }))
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://wagginmeals.com'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Conditions',
                item: 'https://wagginmeals.com/conditions'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: formData.condition_name,
                item: `https://wagginmeals.com/conditions/${slug}`
              }
            ]
          }
        ]
      };

      const { data, error } = await supabase
        .from('condition_pages')
        .insert({
          condition_name: formData.condition_name,
          slug: slug,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          primary_keyword: formData.primary_keyword,
          secondary_keywords: formData.secondary_keywords,
          content: formData.content,
          schema_markup: schema_markup,
          seo_score: seoScore,
          featured_image: formData.featured_image,
          status: 'draft',
          ai_generated: formData.use_ai
        })
        .select()
        .single();

      if (error) throw error;

      alert('Condition page created successfully!');
      router.push('/admin/conditions');
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
      if (currentStep === 2) {
        calculateSEO();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Condition Page</h1>
            <p className="text-sm text-gray-600">SEO-optimized landing page for dog health conditions</p>
          </div>
          <Link
            href="/admin/conditions"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to List
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step === currentStep
                        ? 'bg-blue-600 text-white'
                        : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  <div className="text-xs mt-2 text-gray-600">
                    {step === 1 && 'Choose'}
                    {step === 2 && 'Create'}
                    {step === 3 && 'SEO Check'}
                    {step === 4 && 'Preview'}
                    {step === 5 && 'Publish'}
                  </div>
                </div>
                {step < 5 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Step 1: Choose Condition */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Choose Condition</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Health Condition
                  </label>
                  <select
                    value={formData.condition_name}
                    onChange={(e) => {
                      const condition = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        condition_name: condition === 'Custom (Enter Below)' ? '' : condition,
                        primary_keyword: condition !== 'Custom (Enter Below)'
                          ? `fresh food for dogs with ${condition.toLowerCase()}`
                          : ''
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select a condition --</option>
                    {conditionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {(formData.condition_name === '' || formData.condition_name === 'Custom (Enter Below)') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Enter Custom Condition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Cushing's Disease"
                      value={formData.condition_name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        condition_name: e.target.value,
                        primary_keyword: `fresh food for dogs with ${e.target.value.toLowerCase()}`
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary SEO Keyword (Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={formData.primary_keyword}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_keyword: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="fresh food for dogs with..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This keyword will be used throughout the page for SEO optimization
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 AI Content Generation (Coming Soon)</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Want AI to write the content for you? This feature requires an OpenRouter API key.
                  </p>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-not-allowed">
                    <input
                      type="checkbox"
                      disabled
                      className="rounded"
                    />
                    <span>Generate content with AI (Requires API key)</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    For now, we'll use the manual editor with a helpful template.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Create Content */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Create Content</h2>

              <div className="space-y-6">
                {/* Meta Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Meta Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title (30-60 characters)
                      </label>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                        placeholder={`Fresh Food for Dogs with ${formData.condition_name} | Waggin Meals`}
                        maxLength={60}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.meta_title.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description (120-160 characters)
                      </label>
                      <textarea
                        value={formData.meta_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="Board-certified nutritionist creates custom fresh food plans for dogs with..."
                        maxLength={160}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.meta_description.length}/160 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.secondary_keywords.join(', ')}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          secondary_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                        }))}
                        placeholder="low fat dog food, pancreatitis diet, digestive health"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        H1 Heading
                      </label>
                      <input
                        type="text"
                        value={formData.content.h1}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          content: { ...prev.content, h1: e.target.value }
                        }))}
                        placeholder={`Fresh Food for Dogs with ${formData.condition_name}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hero Subheading
                      </label>
                      <input
                        type="text"
                        value={formData.content.hero_subheading}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          content: { ...prev.content, hero_subheading: e.target.value }
                        }))}
                        placeholder="Science-Based Meal Plans from a Board-Certified Canine Nutritionist"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Content Sections</h3>
                    <button
                      onClick={addSection}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add Section
                    </button>
                  </div>

                  {formData.content.sections.map((section, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                        {formData.content.sections.length > 1 && (
                          <button
                            onClick={() => removeSection(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => {
                            const newSections = [...formData.content.sections];
                            newSections[index].heading = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              content: { ...prev.content, sections: newSections }
                            }));
                          }}
                          placeholder="Section Heading"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />

                        <textarea
                          value={section.content}
                          onChange={(e) => {
                            const newSections = [...formData.content.sections];
                            newSections[index].content = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              content: { ...prev.content, sections: newSections }
                            }));
                          }}
                          placeholder="Section content (you can use basic HTML like <p>, <strong>, <ul>, <li>)"
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">FAQ Section</h3>
                    <button
                      onClick={addFAQ}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add FAQ
                    </button>
                  </div>

                  {formData.content.faq.map((item, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">FAQ {index + 1}</span>
                        {formData.content.faq.length > 1 && (
                          <button
                            onClick={() => removeFAQ(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => {
                            const newFAQ = [...formData.content.faq];
                            newFAQ[index].question = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              content: { ...prev.content, faq: newFAQ }
                            }));
                          }}
                          placeholder="Question"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />

                        <textarea
                          value={item.answer}
                          onChange={(e) => {
                            const newFAQ = [...formData.content.faq];
                            newFAQ[index].answer = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              content: { ...prev.content, faq: newFAQ }
                            }));
                          }}
                          placeholder="Answer"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: SEO Check */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: SEO Check</h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Overall SEO Score</h3>
                    <p className="text-sm text-gray-600">Based on SEO best practices</p>
                  </div>
                  <div className={`text-5xl font-bold ${
                    seoScore >= 80 ? 'text-green-600' : seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {seoScore}/100
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      seoScore >= 80 ? 'bg-green-600' : seoScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${seoScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <CheckItem
                  label="Meta Title (30-60 chars)"
                  passed={formData.meta_title.length >= 30}
                  points={10}
                />
                <CheckItem
                  label="Meta Description (120-160 chars)"
                  passed={formData.meta_description.length >= 120 && formData.meta_description.length <= 160}
                  points={10}
                />
                <CheckItem
                  label="Primary Keyword in Title"
                  passed={formData.meta_title.toLowerCase().includes(formData.primary_keyword.toLowerCase())}
                  points={15}
                />
                <CheckItem
                  label="Primary Keyword in H1"
                  passed={formData.content.h1.toLowerCase().includes(formData.primary_keyword.toLowerCase())}
                  points={15}
                />
                <CheckItem
                  label="Minimum 500 Words"
                  passed={
                    formData.content.sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0) >= 500
                  }
                  points={15}
                />
                <CheckItem
                  label="At Least 3 FAQ Items"
                  passed={formData.content.faq.length >= 3 && formData.content.faq.every(q => q.question && q.answer)}
                  points={10}
                />
                <CheckItem
                  label="Multiple Content Sections (3+)"
                  passed={formData.content.sections.length >= 3}
                  points={10}
                />
                <CheckItem
                  label="Multiple CTAs Placed"
                  passed={formData.content.cta_placements.length >= 2}
                  points={5}
                />
                <CheckItem
                  label="3+ Secondary Keywords"
                  passed={formData.secondary_keywords.length >= 3}
                  points={10}
                />
              </div>

              {seoScore < 80 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">💡 Recommendations</h4>
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    {formData.meta_title.length < 30 && <li>Add a longer meta title (currently {formData.meta_title.length} chars)</li>}
                    {!formData.meta_title.toLowerCase().includes(formData.primary_keyword.toLowerCase()) && <li>Include your primary keyword in the meta title</li>}
                    {formData.content.sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0) < 500 && (
                      <li>Add more content (currently {formData.content.sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0)} words)</li>
                    )}
                    {formData.content.faq.length < 3 && <li>Add at least 3 FAQ items for better SEO</li>}
                    {formData.secondary_keywords.length < 3 && <li>Add more secondary keywords</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Preview</h2>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                {/* Preview Hero */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{formData.content.h1}</h1>
                  <p className="text-xl text-gray-600">{formData.content.hero_subheading}</p>
                </div>

                {/* Preview Sections */}
                {formData.content.sections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                    <div
                      className="text-gray-700 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                ))}

                {/* Preview FAQ */}
                {formData.content.faq.length > 0 && (
                  <div className="mt-8 border-t border-gray-300 pt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {formData.content.faq.map((item, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                          <p className="text-gray-700">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a simplified preview. The actual page will include CTAs, images, and full styling.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 5: Publish</h2>

              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">✓ Ready to Publish!</h3>
                  <p className="text-green-800 mb-4">
                    Your condition page is ready. Here's what will happen when you click Publish:
                  </p>
                  <ul className="text-sm text-green-800 space-y-2 list-disc list-inside">
                    <li>Page will be saved as a draft (you can publish it live later)</li>
                    <li>SEO schema markup will be automatically generated</li>
                    <li>Page slug: <code className="bg-green-100 px-2 py-1 rounded">{generateSlug(formData.condition_name)}</code></li>
                    <li>SEO score: <strong>{seoScore}/100</strong></li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Page Summary</h4>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-600">Condition</dt>
                      <dd className="font-medium">{formData.condition_name}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Primary Keyword</dt>
                      <dd className="font-medium">{formData.primary_keyword}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Content Sections</dt>
                      <dd className="font-medium">{formData.content.sections.length}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">FAQ Items</dt>
                      <dd className="font-medium">{formData.content.faq.length}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Word Count</dt>
                      <dd className="font-medium">
                        {formData.content.sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">SEO Score</dt>
                      <dd className={`font-bold ${
                        seoScore >= 80 ? 'text-green-600' : seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {seoScore}/100
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!formData.condition_name || !formData.primary_keyword)) ||
                  (currentStep === 2 && (!formData.content.h1 || !formData.meta_title))
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : 'Publish as Draft'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckItem({ label, passed, points }: { label: string; passed: boolean; points: number }) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          passed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {passed ? '✓' : '○'}
        </div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${passed ? 'text-green-600' : 'text-gray-400'}`}>
        {points} pts
      </span>
    </div>
  );
}
