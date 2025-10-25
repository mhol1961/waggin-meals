'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PetInfo {
  id: string;
  name: string;
  breed: string;
  weight: string;
  bodyCondition: string;
  recentHealthIssues: string;
  allergies: string;
  currentFeeding: string;
  activityLevel: string;
  healthGoals: string;
  supplements: string;
  behavioralChanges: string;
  proteinPreferences: string;
  includeBoneBroth: string;
  mealType: string;
}

export default function ContactExpertPage() {
  const [formData, setFormData] = useState({
    // Contact Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Preferences
    currentSpending: '',
    deliveryFrequency: '',
    additionalNotes: '',
  });

  const [pets, setPets] = useState<PetInfo[]>([
    {
      id: '1',
      name: '',
      breed: '',
      weight: '',
      bodyCondition: '',
      recentHealthIssues: '',
      allergies: '',
      currentFeeding: '',
      activityLevel: '',
      healthGoals: '',
      supplements: '',
      behavioralChanges: '',
      proteinPreferences: '',
      includeBoneBroth: '',
      mealType: '',
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePetChange = (petId: string, field: keyof PetInfo, value: string) => {
    setPets(prev => prev.map(pet =>
      pet.id === petId ? { ...pet, [field]: value } : pet
    ));
  };

  const addPet = () => {
    setPets(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      breed: '',
      weight: '',
      bodyCondition: '',
      recentHealthIssues: '',
      allergies: '',
      currentFeeding: '',
      activityLevel: '',
      healthGoals: '',
      supplements: '',
      behavioralChanges: '',
      proteinPreferences: '',
      includeBoneBroth: '',
      mealType: '',
    }]);
  };

  const removePet = (petId: string) => {
    if (pets.length > 1) {
      setPets(prev => prev.filter(pet => pet.id !== petId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pets,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          currentSpending: '',
          deliveryFrequency: '',
          additionalNotes: '',
        });
        setPets([{
          id: '1',
          name: '',
          breed: '',
          weight: '',
          bodyCondition: '',
          recentHealthIssues: '',
          allergies: '',
          currentFeeding: '',
          activityLevel: '',
          healthGoals: '',
          supplements: '',
          behavioralChanges: '',
          proteinPreferences: '',
          includeBoneBroth: '',
          mealType: '',
        }]);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Free Nutrition Consultation
          </h1>
          <p className="text-lg text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Get personalized nutrition advice from our certified canine nutritionist
          </p>
          <p className="text-md text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Fill out the form below to schedule your free consultation. We'll create a custom nutrition plan tailored to your pet's unique needs.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">

          {submitStatus === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700">
                Your consultation request has been submitted successfully. We'll review your information and reach out within 24-48 hours to schedule your free consultation.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Submission Error</h3>
              <p className="text-red-700">
                There was an error submitting your form. Please try again or contact us directly at{' '}
                <a href="mailto:info@wagginmeals.com" className="underline">info@wagginmeals.com</a>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Contact Information */}
            <div className="bg-[#f8f9fa] rounded-lg p-6 border-l-4 border-[#a5b5eb]">
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Your Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="For shipping/delivery cost estimates"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Pet Information */}
            {pets.map((pet, index) => (
              <div key={pet.id} className="bg-[#e8f4fb] rounded-lg p-6 border-2 border-[#a5b5eb]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    🐾 Pet #{index + 1} Information
                  </h2>
                  {pets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePet(pet.id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove Pet
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Pet's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={pet.name}
                      onChange={(e) => handlePetChange(pet.id, 'name', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Breed
                    </label>
                    <input
                      type="text"
                      value={pet.breed}
                      onChange={(e) => handlePetChange(pet.id, 'breed', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Current Weight
                    </label>
                    <input
                      type="text"
                      value={pet.weight}
                      onChange={(e) => handlePetChange(pet.id, 'weight', e.target.value)}
                      placeholder="e.g., 25 lbs"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Body Condition
                    </label>
                    <select
                      value={pet.bodyCondition}
                      onChange={(e) => handlePetChange(pet.id, 'bodyCondition', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="">Select...</option>
                      <option value="lean">Lean</option>
                      <option value="ideal">Ideal</option>
                      <option value="overweight">Overweight</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Recent Health Issues or Surgeries
                    </label>
                    <textarea
                      value={pet.recentHealthIssues}
                      onChange={(e) => handlePetChange(pet.id, 'recentHealthIssues', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Food Allergies or Sensitivities
                    </label>
                    <textarea
                      value={pet.allergies}
                      onChange={(e) => handlePetChange(pet.id, 'allergies', e.target.value)}
                      rows={2}
                      placeholder="List any known food allergies or sensitivities"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Current Feeding Routine
                    </label>
                    <textarea
                      value={pet.currentFeeding}
                      onChange={(e) => handlePetChange(pet.id, 'currentFeeding', e.target.value)}
                      rows={2}
                      placeholder="Brand, amount, frequency (e.g., 'Purina Pro Plan, 2 cups twice daily')"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Activity Level
                    </label>
                    <select
                      value={pet.activityLevel}
                      onChange={(e) => handlePetChange(pet.id, 'activityLevel', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="">Select...</option>
                      <option value="low">Low (mostly sedentary)</option>
                      <option value="moderate">Moderate (daily walks)</option>
                      <option value="high">High (very active/athletic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Meal Type
                    </label>
                    <select
                      value={pet.mealType}
                      onChange={(e) => handlePetChange(pet.id, 'mealType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="">Select...</option>
                      <option value="full">Full Meal</option>
                      <option value="topper">Meal Topper</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Health Goals
                    </label>
                    <textarea
                      value={pet.healthGoals}
                      onChange={(e) => handlePetChange(pet.id, 'healthGoals', e.target.value)}
                      rows={2}
                      placeholder="e.g., improve digestion, support joint health, maintain healthy coat"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Current Supplements or Medications
                    </label>
                    <textarea
                      value={pet.supplements}
                      onChange={(e) => handlePetChange(pet.id, 'supplements', e.target.value)}
                      rows={2}
                      placeholder="List any supplements or medications your pet is currently taking"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Recent Behavioral or Appetite Changes
                    </label>
                    <textarea
                      value={pet.behavioralChanges}
                      onChange={(e) => handlePetChange(pet.id, 'behavioralChanges', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Preferred Protein Sources or Restrictions
                    </label>
                    <input
                      type="text"
                      value={pet.proteinPreferences}
                      onChange={(e) => handlePetChange(pet.id, 'proteinPreferences', e.target.value)}
                      placeholder="e.g., chicken, beef, fish - avoid lamb"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                      Include Bone Broth & Seasonal Proteins?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`boneBroth-${pet.id}`}
                          value="yes"
                          checked={pet.includeBoneBroth === 'yes'}
                          onChange={(e) => handlePetChange(pet.id, 'includeBoneBroth', e.target.value)}
                          className="mr-2"
                        />
                        <span style={{ fontFamily: "'Poppins', sans-serif" }}>Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`boneBroth-${pet.id}`}
                          value="no"
                          checked={pet.includeBoneBroth === 'no'}
                          onChange={(e) => handlePetChange(pet.id, 'includeBoneBroth', e.target.value)}
                          className="mr-2"
                        />
                        <span style={{ fontFamily: "'Poppins', sans-serif" }}>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Pet Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={addPet}
                className="bg-[#c5d4f7] text-[#3c3a47] px-6 py-3 rounded-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                + Add Another Pet
              </button>
            </div>

            {/* Budget & Delivery Preferences */}
            <div className="bg-[#f8f9fa] rounded-lg p-6 border-l-4 border-[#a5b5eb]">
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Budget & Delivery Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    Current Weekly Spending on Food & Supplements
                  </label>
                  <input
                    type="text"
                    name="currentSpending"
                    value={formData.currentSpending}
                    onChange={handleInputChange}
                    placeholder="e.g., $50-75/week"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                    Preferred Delivery Frequency
                  </label>
                  <select
                    name="deliveryFrequency"
                    value={formData.deliveryFrequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <option value="">Select...</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-[#f8f9fa] rounded-lg p-6 border-l-4 border-[#a5b5eb]">
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Additional Information
              </h2>

              <label className="block text-sm font-semibold text-[#3c3a47] mb-2">
                Tell Us More About Your Pet(s)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={6}
                placeholder="Share any additional information that might help us create the perfect nutrition plan for your pet..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a5b5eb] focus:border-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#a5b5eb] text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-[#8a9fd9] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isSubmitting ? 'Submitting...' : 'Request Free Consultation'}
              </button>
              <p className="mt-4 text-sm text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                By submitting this form, you agree to our{' '}
                <Link href="/privacy" className="text-[#a5b5eb] hover:underline">Privacy Policy</Link>
                {' '}and{' '}
                <Link href="/terms" className="text-[#a5b5eb] hover:underline">Terms of Service</Link>
              </p>
            </div>
          </form>

          {/* What to Expect */}
          <div className="mt-12 bg-[#e8f4fb] rounded-lg p-8 border-2 border-[#a5b5eb]">
            <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              What to Expect
            </h2>
            <ul className="space-y-3 text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li className="flex items-start">
                <span className="text-[#a5b5eb] mr-3 text-xl">✓</span>
                <span><strong>24-48 Hour Response:</strong> We'll review your information and reach out to schedule your consultation</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#a5b5eb] mr-3 text-xl">✓</span>
                <span><strong>Personalized Nutrition Plan:</strong> Receive a custom feeding plan tailored to your pet's needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#a5b5eb] mr-3 text-xl">✓</span>
                <span><strong>Product Recommendations:</strong> Get specific meal and supplement suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#a5b5eb] mr-3 text-xl">✓</span>
                <span><strong>Ongoing Support:</strong> Questions? We're here to help every step of the way</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
