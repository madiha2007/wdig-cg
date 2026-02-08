"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  category: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  category?: string;
  message?: string;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    category: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');

  const categories = [
    'General Question',
    'Technical Issue',
    'Account Problem',
    'Feature Request',
    'Bug Report',
    'Other'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select an issue category';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    // Simulate API call (replace with actual API integration)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful submission
      console.log('Form submitted:', formData);
      setStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          category: '',
          message: ''
        });
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-10">
        
        {/* Success Message */}
        {status === 'success' && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 mb-1">Message sent successfully!</h4>
              <p className="text-sm text-emerald-700">We'll get back to you within 24-48 hours.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Oops! Something went wrong</h4>
              <p className="text-sm text-red-700">Please try again or contact us directly at support@yourapp.com</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Field */}
          <div>
            <label 
              htmlFor="fullName" 
              className="block text-sm font-semibold text-slate-900 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.fullName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              } focus:ring-2 focus:outline-none transition-all duration-200`}
              placeholder="John Doe"
              disabled={status === 'submitting'}
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-slate-900 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              } focus:ring-2 focus:outline-none transition-all duration-200`}
              placeholder="john@example.com"
              disabled={status === 'submitting'}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label 
              htmlFor="category" 
              className="block text-sm font-semibold text-slate-900 mb-2"
            >
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.category 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              } focus:ring-2 focus:outline-none transition-all duration-200 bg-white`}
              disabled={status === 'submitting'}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-semibold text-slate-900 mb-2"
            >
              Message / Problem Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.message 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              } focus:ring-2 focus:outline-none transition-all duration-200 resize-none`}
              placeholder="Please describe your issue or question in detail..."
              disabled={status === 'submitting'}
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>

          <p className="text-sm text-slate-500 text-center">
            We typically respond within 24-48 hours on business days
          </p>
        </form>
      </div>
    </div>
  );
}
