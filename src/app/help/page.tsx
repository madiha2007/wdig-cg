"use client";

import { useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  Zap, 
  Wrench, 
  Mail, 
  MessageSquare,
  ChevronDown,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import HelpCard from '../../components/HelpCard';
import FAQItem from '../../components/FAQItem';
import ContactForm from '../../components/ContactForm';

export default function HelpSupportPage() {
  const helpTopics = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics and set up your account in minutes",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: Zap,
      title: "Using Key Features",
      description: "Discover powerful features to maximize your productivity",
      color: "from-violet-400 to-purple-500"
    },
    {
      icon: Shield,
      title: "Account & Security",
      description: "Keep your account safe and manage your privacy settings",
      color: "from-amber-400 to-orange-500"
    },
    {
      icon: Wrench,
      title: "Troubleshooting",
      description: "Quick solutions to common issues and technical problems",
      color: "from-rose-400 to-pink-500"
    }
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click the 'Sign Up' button on the homepage, enter your name, email, and create a strong password. You'll receive a verification email—just click the link to activate your account and you're all set."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your data both in transit and at rest. Your information is stored on secure servers, and we never share your personal data with third parties without your explicit consent. You can read our full privacy policy for more details."
    },
    {
      question: "Can I use this application on mobile devices?",
      answer: "Yes! Our application is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. You can access all features from any device with a modern web browser."
    },
    {
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, click 'Forgot Password?' on the login page. Enter your registered email address, and we'll send you a secure link to create a new password. The link expires after 24 hours for security."
    },
    {
      question: "What should I do if I encounter an error?",
      answer: "First, try refreshing the page or clearing your browser cache. If the problem persists, check our Troubleshooting section or contact our support team with details about the error message you're seeing. Screenshots are always helpful!"
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export your data at any time from the Settings page. We support multiple export formats including CSV, JSON, and PDF to ensure compatibility with other tools you might use."
    },
    {
      question: "How long does support usually take to respond?",
      answer: "Our support team typically responds within 24-48 hours on business days. For urgent issues, please mark your request as 'Urgent' and we'll prioritize it accordingly."
    },
    {
      question: "Is there a limit to how much I can use the application?",
      answer: "Our free tier is generous and suitable for most users. If you need additional features or higher usage limits, check out our pricing page for premium plans designed for power users and teams."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              We're here to help
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Help & Support
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Find answers, get support, and learn how to make the most of our application. 
              We're committed to making your experience smooth and enjoyable.
            </p>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(248 250 252)" fillOpacity="1"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        
        {/* Help Topics Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Explore Help Topics
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Browse through our comprehensive guides to find what you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpTopics.map((topic, index) => (
              <HelpCard key={index} {...topic} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quick answers to common questions about our application
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </section>

        {/* Contact Support Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our support team is ready to assist you. Send us a message and we'll get back to you soon.
            </p>
          </div>
          
          <ContactForm />
        </section>

        {/* Additional Help Resources */}
        <section className="mt-20">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 lg:p-12 border border-indigo-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Need immediate assistance?
                </h3>
                <p className="text-slate-600 mb-6">
                  Check out our comprehensive documentation, video tutorials, and community forums for instant answers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#docs" 
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    View Documentation
                  </a>
                  <a 
                    href="#community" 
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-colors border border-indigo-200"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Join Community
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Email Support</h4>
                    <p className="text-sm text-slate-600 mb-2">support@yourapp.com</p>
                    <p className="text-xs text-slate-500">Response time: 24-48 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Live Chat</h4>
                    <p className="text-sm text-slate-600 mb-2">Available when logged in</p>
                    <p className="text-xs text-slate-500">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-slate-400 mb-2">
              © 2026 Your Application Name - Final Year Project
            </p>
            <p className="text-slate-500 text-sm">
              Developed with dedication for academic excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
