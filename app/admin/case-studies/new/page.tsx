'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Edit3, Save, Eye, X } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { DocumentUploader } from '@/components/admin/document-uploader';
import type { CaseStudy, HealthIssueCategory } from '@/types/case-study';

const healthIssueOptions: HealthIssueCategory[] = [
  'Digestive Issues',
  'Weight Management',
  'Skin & Coat',
  'Allergies',
  'Joint & Mobility',
  'Energy & Vitality',
  'Picky Eating',
  'Kidney Disease',
  'Liver Disease',
  'Heart Health',
  'Dental Health',
  'Behavioral Issues',
  'Senior Dog Care',
  'Puppy Development',
  'Other'
];

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'upload' | 'manual'>('upload');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Case Study Fields
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState<'male' | 'female' | 'neutered-male' | 'spayed-female'>('spayed-female');
  const [ownerName, setOwnerName] = useState('');
  const [location, setLocation] = useState('');

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [slug, setSlug] = useState('');

  const [healthIssues, setHealthIssues] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const [problemDuration, setProblemDuration] = useState('');
  const [timeToResults, setTimeToResults] = useState('');

  const [productsUsed, setProductsUsed] = useState('');
  const [servicesUsed, setServicesUsed] = useState('');
  const [customPlan, setCustomPlan] = useState('');

  const [resultsAchieved, setResultsAchieved] = useState('');
  const [beforeWeight, setBeforeWeight] = useState('');
  const [afterWeight, setAfterWeight] = useState('');
  const [beforeEnergy, setBeforeEnergy] = useState('');
  const [afterEnergy, setAfterEnergy] = useState('');

  const [fullStory, setFullStory] = useState('');
  const [ownerQuote, setOwnerQuote] = useState('');
  const [christieNotes, setChristieNotes] = useState('');

  const [heroImage, setHeroImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);

  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const handleDocumentUpload = async (html: string, extractedTitle?: string) => {
    setFullStory(html);
    if (extractedTitle && !title) {
      setTitle(extractedTitle);
    }
    setMethod('manual'); // Switch to manual mode for editing
  };

  const handleHealthIssueToggle = (issue: string) => {
    setHealthIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);

    try {
      const caseStudyData = {
        dogName,
        breed,
        age: parseInt(age),
        weight: parseFloat(weight),
        sex,
        ownerName,
        location,
        title,
        summary,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        healthIssues,
        symptoms: symptoms.split('\n').filter(s => s.trim()),
        diagnosis: diagnosis || null,
        problemDuration: problemDuration || null,
        timeToResults: timeToResults || null,
        productsUsed: productsUsed.split('\n').filter(p => p.trim()),
        servicesUsed: servicesUsed.split('\n').filter(s => s.trim()),
        customPlan: customPlan || null,
        resultsAchieved: resultsAchieved.split('\n').filter(r => r.trim()),
        beforeMetrics: {
          weight: beforeWeight ? parseFloat(beforeWeight) : undefined,
          energy: beforeEnergy || undefined,
        },
        afterMetrics: {
          weight: afterWeight ? parseFloat(afterWeight) : undefined,
          energy: afterEnergy || undefined,
        },
        fullStory,
        ownerQuote,
        christieNotes: christieNotes || null,
        beforePhotos: [],
        afterPhotos: [],
        heroImage: heroImage || '/images/woman-with-white-dog.webp',
        category: category || null,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        featured,
        published: publish,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      };

      // Call API to create case study
      const response = await fetch('/api/admin/case-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseStudyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save case study');
      }

      const result = await response.json();
      console.log('Case study saved:', result.caseStudy);

      alert(`Case study ${publish ? 'published' : 'saved as draft'} successfully!`);
      router.push('/admin/case-studies');

    } catch (error) {
      console.error('Error saving case study:', error);
      alert(error instanceof Error ? error.message : 'Failed to save case study. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-bold text-[#3c3a47] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Create New Case Study
          </h1>
          <p className="text-[16px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Document a success story to inspire potential clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Method Selection Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setMethod('upload')}
                  className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                    method === 'upload'
                      ? 'bg-[#a5b5eb] text-white'
                      : 'bg-white text-[#666666] hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  Upload Document
                </button>
                <button
                  onClick={() => setMethod('manual')}
                  className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                    method === 'manual'
                      ? 'bg-[#a5b5eb] text-white'
                      : 'bg-white text-[#666666] hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Edit3 className="w-5 h-5" />
                  Create Manually
                </button>
              </div>

              <div className="p-6">
                {method === 'upload' ? (
                  <div>
                    <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                      Upload Case Study Document
                    </h3>
                    <p className="text-[14px] text-[#666666] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Upload a Word document (.docx) containing the case study content. We\'ll extract the text and you can edit it before publishing.
                    </p>
                    <DocumentUploader onContentExtracted={handleDocumentUpload} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Dog Information */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Dog Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Dog\'s Name *
                          </label>
                          <input
                            type="text"
                            value={dogName}
                            onChange={(e) => setDogName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Bella"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Breed *
                          </label>
                          <input
                            type="text"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Labrador Retriever"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Age (years) *
                          </label>
                          <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="6"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Weight (lbs) *
                          </label>
                          <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="70"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Sex *
                          </label>
                          <select
                            value={sex}
                            onChange={(e) => setSex(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            required
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="neutered-male">Neutered Male</option>
                            <option value="spayed-female">Spayed Female</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Owner Information */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Owner Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Owner Name *
                          </label>
                          <input
                            type="text"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Sarah M."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Location *
                          </label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Austin, TX"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Case Details */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Case Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Title *
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="How Bella Lost 15 Pounds and Regained Her Energy"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Summary (1-2 sentences) *
                          </label>
                          <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Bella went from overweight and lethargic to healthy and playful in just 4 months..."
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Health Issues */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Health Issues Addressed
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {healthIssueOptions.map((issue) => (
                          <label key={issue} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={healthIssues.includes(issue)}
                              onChange={() => handleHealthIssueToggle(issue)}
                              className="w-4 h-4 text-[#a5b5eb] border-gray-300 rounded focus:ring-[#a5b5eb]"
                            />
                            <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {issue}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Timeline
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Problem Duration
                          </label>
                          <input
                            type="text"
                            value={problemDuration}
                            onChange={(e) => setProblemDuration(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="2 years"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Time to Results
                          </label>
                          <input
                            type="text"
                            value={timeToResults}
                            onChange={(e) => setTimeToResults(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="4 months"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Treatment */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Treatment
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Products Used (one per line)
                          </label>
                          <textarea
                            value={productsUsed}
                            onChange={(e) => setProductsUsed(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Chicken & Sweet Potato Meal&#10;Joint Support Supplement"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Services Used (one per line)
                          </label>
                          <textarea
                            value={servicesUsed}
                            onChange={(e) => setServicesUsed(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="3-Month Custom Meal Plan&#10;Monthly Check-ins"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Results
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Results Achieved (one per line)
                          </label>
                          <textarea
                            value={resultsAchieved}
                            onChange={(e) => setResultsAchieved(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Lost 15 pounds safely&#10;Energy levels tripled&#10;Playful like a puppy again"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              Before Weight (lbs)
                            </label>
                            <input
                              type="number"
                              value={beforeWeight}
                              onChange={(e) => setBeforeWeight(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                              placeholder="85"
                            />
                          </div>
                          <div>
                            <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              After Weight (lbs)
                            </label>
                            <input
                              type="number"
                              value={afterWeight}
                              onChange={(e) => setAfterWeight(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                              placeholder="70"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Full Story */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Full Story
                      </h3>
                      <RichTextEditor
                        content={fullStory}
                        onChange={setFullStory}
                        onImageUpload={async (file) => {
                          // TODO: Implement image upload
                          console.log('Upload image:', file.name);
                          return '/images/logo-waggin-meals.png';
                        }}
                      />
                    </div>

                    {/* Testimonials */}
                    <div>
                      <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                        Testimonials
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Owner Quote *
                          </label>
                          <textarea
                            value={ownerQuote}
                            onChange={(e) => setOwnerQuote(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="I was skeptical about fresh food, but Christie's custom meal plan completely transformed Bella's life..."
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Christie\'s Professional Notes
                          </label>
                          <textarea
                            value={christieNotes}
                            onChange={(e) => setChristieNotes(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                            placeholder="Bella's case demonstrates how proper portion control combined with nutrient-dense fresh food can reverse obesity..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Publishing Options */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-[18px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Publishing
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px]"
                      placeholder="bella-weight-loss"
                    />
                    <p className="text-[12px] text-[#999999] mt-1">Auto-generated from title if left blank</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 text-[#a5b5eb] border-gray-300 rounded"
                      />
                      <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Feature this case study
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px]"
                    >
                      <option value="">Select category...</option>
                      {healthIssueOptions.map(issue => (
                        <option key={issue} value={issue}>{issue}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px]"
                      placeholder="labrador, weight-loss, senior"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-[18px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  SEO
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px]"
                      placeholder="Uses title if blank"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      SEO Description
                    </label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px]"
                      placeholder="Uses summary if blank"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-200 text-[#3c3a47] px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving || !dogName || !title}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#a5b5eb] text-[#a5b5eb] px-6 py-3 rounded-lg font-medium hover:bg-[#a5b5eb]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving || !dogName || !title || !ownerQuote}
                    className="w-full flex items-center justify-center gap-2 bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8fa3d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Publishing...' : 'Publish Case Study'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
