"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Award,
  Mail,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  Building2,
  Calendar
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  color: string;
}

const jobListings: Job[] = [
  {
    id: "digital-marketing",
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    experience: "0-4 years",
    salary: "₹2-3.5 LPA",
    description: "Join our dynamic marketing team to drive brand awareness, customer engagement, and digital growth for Jottosop. Lead innovative campaigns and shape our online presence.",
    responsibilities: [
      "Develop and execute comprehensive digital marketing strategies across social media, email, and content platforms",
      "Manage SEO/SEM campaigns to increase organic and paid traffic",
      "Create engaging content for social media channels (Instagram, Facebook, LinkedIn)",
      "Analyze campaign performance metrics and optimize for better ROI",
      "Collaborate with design and development teams for marketing materials",
      "Plan and execute email marketing campaigns and automation workflows",
      "Monitor industry trends and competitor activities",
      "Manage advertising budgets and ensure cost-effective campaigns"
    ],
    requirements: [
      "Bachelor's degree in Marketing, Communications, or related field",
      "2-4 years of proven experience in digital marketing",
      "Strong understanding of Google Analytics, Google Ads, and Facebook Ads Manager",
      "Excellent knowledge of SEO best practices and content marketing",
      "Proficiency in social media management tools (Hootsuite, Buffer)",
      "Creative thinking with strong analytical skills",
      "Excellent written and verbal communication skills",
      "Experience with email marketing platforms (MailChimp, HubSpot)"
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "Health insurance coverage",
      "Flexible work hours and remote work options",
      "Professional development and training opportunities",
      "Modern office environment with latest tools"
    ],
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: "business-executive",
    title: "Business Development Executive",
    department: "Business Development",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹5-8 LPA + Incentives",
    description: "Drive business growth by identifying new opportunities, building strategic partnerships, and expanding our market presence. Be the catalyst for Jottosop's expansion.",
    responsibilities: [
      "Identify and develop new business opportunities and strategic partnerships",
      "Build and maintain strong relationships with key clients and stakeholders",
      "Conduct market research to identify trends and potential growth areas",
      "Prepare and deliver compelling business proposals and presentations",
      "Negotiate contracts and close deals with potential partners and clients",
      "Collaborate with cross-functional teams to ensure successful project delivery",
      "Track sales metrics and prepare regular performance reports",
      "Represent Jottosop at industry events, conferences, and networking sessions",
      "Develop strategies to increase market share and revenue"
    ],
    requirements: [
      "Bachelor's degree in Business Administration, Marketing, or related field (MBA preferred)",
      "3-5 years of experience in business development or sales",
      "Proven track record of meeting or exceeding sales targets",
      "Strong negotiation and relationship-building skills",
      "Excellent communication and presentation abilities",
      "Strategic thinking with problem-solving capabilities",
      "Experience in e-commerce or technology sector is a plus",
      "Proficiency in CRM tools and MS Office Suite",
      "Self-motivated with ability to work independently"
    ],
    benefits: [
      "Attractive salary with performance-based incentives",
      "Health and wellness benefits",
      "Travel allowances for client meetings",
      "Career growth opportunities",
      "Work with cutting-edge e-commerce technology"
    ],
    color: "from-purple-600 to-pink-600"
  },
  {
    id: "back-office-admin",
    title: "Back Office Administrator",
    department: "Administration",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    experience: "1-3 years",
    salary: "₹3-4.5 LPA",
    description: "Ensure smooth operational flow by managing administrative tasks, coordinating office activities, and supporting various departments with essential back-office functions.",
    responsibilities: [
      "Manage day-to-day administrative operations and office management",
      "Maintain accurate records, databases, and filing systems",
      "Process documentation, invoices, and expense reports",
      "Coordinate with vendors, suppliers, and service providers",
      "Handle correspondence, emails, and phone communications",
      "Assist in HR activities including onboarding and employee records management",
      "Prepare reports, presentations, and documentation as required",
      "Manage inventory and office supplies",
      "Support order processing and customer service operations",
      "Ensure compliance with company policies and procedures"
    ],
    requirements: [
      "Bachelor's degree in Business Administration or related field",
      "1-3 years of experience in administrative or back-office roles",
      "Proficiency in MS Office Suite (Word, Excel, PowerPoint)",
      "Strong organizational and time management skills",
      "Excellent attention to detail and accuracy",
      "Good written and verbal communication skills",
      "Ability to multitask and prioritize work efficiently",
      "Experience with ERP or office management software is a plus",
      "Problem-solving mindset with proactive approach"
    ],
    benefits: [
      "Competitive compensation package",
      "Health insurance benefits",
      "Structured training and skill development programs",
      "Supportive and collaborative work environment",
      "Career advancement opportunities"
    ],
    color: "from-green-600 to-teal-600"
  }
];

// const fadeInUp = {
//   initial: { opacity: 0, y: 30 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6 }
// };

export default function CareersPage() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const toggleJob = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  return (
    <div className="min-h-screen bg-[#e8ecf0]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-red-600/20 px-4 py-2 rounded-full mb-6 border border-red-600/30">
              <Briefcase className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">We&apos;re Hiring!</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join the Jottosop Team
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Be part of our mission to revolutionize e-commerce with cutting-edge 3D technology and innovation
            </p>
          </motion.div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#e8ecf0]" 
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}
        />
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Why Work With Us?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Growth Opportunities",
                description: "Accelerate your career with continuous learning and advancement",
                color: "bg-blue-600"
              },
              {
                icon: Users,
                title: "Great Team Culture",
                description: "Work with passionate, talented professionals in a collaborative environment",
                color: "bg-purple-600"
              },
              {
                icon: Award,
                title: "Innovative Projects",
                description: "Work on cutting-edge e-commerce and 3D customization technology",
                color: "bg-red-600"
              },
              {
                icon: Target,
                title: "Work-Life Balance",
                description: "Flexible hours, remote options, and supportive policies",
                color: "bg-green-600"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className={`${benefit.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600 text-lg">
              Explore exciting career opportunities across various departments
            </p>
          </motion.div>

          <div className="space-y-6">
            {jobListings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Job Header */}
                <div className={`bg-gradient-to-r ${job.color} p-6 text-white`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {job.experience}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      View Details
                      <motion.div
                        animate={{ rotate: expandedJob === job.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>
                  </div>
                </div>

                {/* Job Details (Expandable) */}
                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 md:p-8 space-y-6">
                        {/* Description */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">About the Role</h4>
                          <p className="text-gray-700 leading-relaxed">{job.description}</p>
                        </div>

                        {/* Responsibilities */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Key Responsibilities</h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-700">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Requirements</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-700">
                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">What We Offer</h4>
                          <ul className="space-y-2">
                            {job.benefits.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-700">
                                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Apply Button */}
                        <div className="pt-6 border-t border-gray-200">
                          <a
                            href={`mailto:operation@jottosop.in?subject=Application for ${job.title}&body=Dear Hiring Team,%0D%0A%0D%0AI am writing to express my interest in the ${job.title} position at Jottosop.%0D%0A%0D%0APlease find my resume attached.%0D%0A%0D%0ABest regards`}
                            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r ${job.color} text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all`}
                          >
                            <Mail className="w-5 h-5" />
                            Apply for this Position
                            <ArrowRight className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
          >
            Our Hiring Process
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Apply",
                description: "Send your resume to operation@jottosop.in with the position title"
              },
              {
                step: "02",
                title: "Review",
                description: "Our HR team will review your application within 3-5 business days"
              },
              {
                step: "03",
                title: "Interview",
                description: "Shortlisted candidates will be invited for interviews (technical & HR)"
              },
              {
                step: "04",
                title: "Offer",
                description: "Selected candidates receive offer letters and onboarding details"
              }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-xl text-center"
              >
                <div className="text-4xl font-bold text-red-600 mb-3">{process.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Don&apos;t See Your Role?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              We&apos;re always looking for talented individuals. Send us your resume and we&apos;ll keep you in mind for future opportunities.
            </p>
            <a
              href="mailto:operation@jottosop.in?subject=General Application - Jottosop Careers"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Send Your Resume
              <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-red-100 text-sm mt-6">
              Email: <a href="mailto:operation@jottosop.in" className="underline font-semibold">operation@jottosop.in</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
