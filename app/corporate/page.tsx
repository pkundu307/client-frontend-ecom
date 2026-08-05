// app/corporate/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  Squares2X2Icon,
  AcademicCapIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  BanknotesIcon,
  RocketLaunchIcon,
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  HeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiOpenjdk,
  SiRust,
  SiGo,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiNodedotjs,
  SiNestjs,
  SiPrisma,
  SiSpringboot,
} from "react-icons/si";
import type { IconType } from "react-icons";

/* ---------------------------------- Types --------------------------------- */

type SectorId = "education" | "ecommerce" | "crm" | "finance" | "health";
type SectorFilter = SectorId | "all";

interface Project {
  id: string;
  name: string;
  url: string;
  sector: SectorId;
  tagline: string;
}

interface TechItem {
  name: string;
  Icon: IconType;
  color: string;
}

/* ---------------------------------- Data ---------------------------------- */

const SECTORS: { id: SectorFilter; name: string; icon: typeof Squares2X2Icon }[] = [
  { id: "all", name: "All Projects", icon: Squares2X2Icon },
  { id: "education", name: "Education", icon: AcademicCapIcon },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingBagIcon },
  { id: "crm", name: "CRM", icon: UserGroupIcon },
  { id: "finance", name: "Loan & Finance", icon: BanknotesIcon },
  { id: "health", name: "Health & Wellness", icon: HeartIcon },
];

const PROJECTS: Project[] = [
  {
    id: "quicklearner",
    name: "QuickLearner",
    url: "https://quicklearner.in/",
    sector: "education",
    tagline: "Online learning platform for students and educators",
  },
  {
    id: "quicklearner-oms",
    name: "QuickLearner OMS",
    url: "https://oms.quicklearner.in/",
    sector: "education",
    tagline: "Order management system powering QuickLearner operations",
  },
  {
    id: "jottosop",
    name: "JottoSOP",
    url: "https://jottosop.in",
    sector: "ecommerce",
    tagline: "Our own multi-vendor e-commerce platform",
  },
  {
    id: "diary",
    name: "Diary",
    url: "https://diary.jottosop.in",
    sector: "crm",
    tagline: "CRM suite built for the JottoSOP operations team",
  },
  {
    id: "gurucool",
    name: "GuruCool",
    url: "https://www.gurucool.life/",
    sector: "finance",
    tagline: "Digital platform for loan and financial services",
  },
  {
    id: "tap4credit",
    name: "Tap4Credit",
    url: "https://tap4credit.in",
    sector: "finance",
    tagline: "Instant credit and loan application platform",
  },
  {
    id: "paytrust",
    name: "PayTrust",
    url: "https://paytrust.co.in",
    sector: "finance",
    tagline: "Trusted payments and financial services platform",
  },
  {
    id: "arthfincare",
    name: "ArthFincare",
    url: "https://arthfincare.com",
    sector: "finance",
    tagline: "Financial care and lending services platform",
  },
  {
    id: "mudraboxx",
    name: "MudraBoxx",
    url: "https://mudraboxx.com/",
    sector: "finance",
    tagline: "Digital lending and loan management platform",
  },
  {
    id: "lybl",
    name: "LYBL",
    url: "https://www.lybl.com/",
    sector: "health",
    tagline: "Holistic health, wellness, and telemedicine platform",
  },
];

const SERVICES = [
  {
    title: "New Website Development",
    desc: "Custom, high-performance websites built from scratch for your brand.",
    icon: RocketLaunchIcon,
  },
  {
    title: "App Development",
    desc: "Web and mobile applications designed to scale with your business.",
    icon: DevicePhoneMobileIcon,
  },
  {
    title: "Legacy Project Support",
    desc: "Safely modernize, refactor, and extend existing codebases.",
    icon: WrenchScrewdriverIcon,
  },
  {
    title: "Ongoing Maintenance",
    desc: "Continuous monitoring, updates, and support after launch.",
    icon: ShieldCheckIcon,
  },
];

const TECH_GROUPS: { title: string; items: TechItem[] }[] = [
  {
    title: "Languages & Runtimes",
    items: [
      { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "Python", Icon: SiPython, color: "#3776AB" },
      { name: "Java", Icon: SiOpenjdk, color: "#ED8B00" },
      { name: "Rust", Icon: SiRust, color: "#CE422B" },
      { name: "Go", Icon: SiGo, color: "#00ADD8" },
    ],
  },
  {
    title: "Frontend Frameworks & Libraries",
    items: [
      { name: "React", Icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
      { name: "Redux Toolkit", Icon: SiRedux, color: "#764ABC" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Framer Motion", Icon: SiFramer, color: "#0055FF" },
      { name: "Three.js", Icon: SiThreedotjs, color: "#000000" },
    ],
  },
  {
    title: "Backend & Infrastructure",
    items: [
      { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
      { name: "NestJS", Icon: SiNestjs, color: "#E0234E" },
      { name: "Spring Boot", Icon: SiSpringboot, color: "#6DB33F" },
      { name: "Prisma", Icon: SiPrisma, color: "#2D3748" },
    ],
  },
];

const SECTOR_LABEL: Record<SectorId, string> = {
  education: "Education",
  ecommerce: "E-commerce",
  crm: "CRM",
  finance: "Loan & Finance",
  health: "Health & Wellness",
};

/* --------------------------------- Component ------------------------------- */

export default function CorporatePage() {
  const router = useRouter();
  const [activeSector, setActiveSector] = useState<SectorFilter>("all");

  const filteredProjects = PROJECTS.filter(
    (p) => activeSector === "all" || p.sector === activeSector
  );

  const totalProjects = PROJECTS.length;
  const totalSectors = new Set(PROJECTS.map((p) => p.sector)).size;

  return (
    <div className="min-h-screen bg-[#e8ecf0] px-4 py-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 bg-[#e8ecf0] text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
            style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Our Work
            </h1>
            <p className="text-sm text-gray-600">
              Projects we&apos;ve built, the services we offer, and the stack behind them
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div
            className="bg-[#e8ecf0] rounded-2xl p-5 text-center"
            style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
          >
            <p className="text-3xl font-bold text-red-600">{totalProjects}</p>
            <p className="text-sm text-gray-600 mt-1">Live Platforms</p>
          </div>
          <div
            className="bg-[#e8ecf0] rounded-2xl p-5 text-center"
            style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
          >
            <p className="text-3xl font-bold text-red-600">{totalSectors}</p>
            <p className="text-sm text-gray-600 mt-1">Industries Served</p>
          </div>
          <div
            className="bg-[#e8ecf0] rounded-2xl p-5 text-center"
            style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
          >
            <p className="text-3xl font-bold text-red-600">70%+</p>
            <p className="text-sm text-gray-600 mt-1">In Revenue Phase</p>
          </div>
        </motion.div>

        {/* Smart Impact Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#e8ecf0] rounded-2xl p-5 mb-8 flex items-start sm:items-center gap-4 border-l-4 border-red-600"
          style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#e8ecf0]"
            style={{ boxShadow: "inset 3px 3px 6px #c5cdd5, inset -3px -3px 6px #ffffff" }}
          >
            <SparklesIcon className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-gray-900">Proven Engineering Impact: </span>
            Our developers and architectural brains have majorly contributed to building, scaling, and optimizing these real-world platforms—with over <span className="font-semibold text-red-600">70% currently actively generating revenue</span> in their respective markets.
          </p>
        </motion.div>

        {/* Services */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BriefcaseIcon className="w-5 h-5 text-red-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Services We Offer
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#e8ecf0] rounded-2xl p-5"
                  style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{ boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff" }}
                  >
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {service.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Sector filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SECTORS.map((sector) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.id}
                  onClick={() => setActiveSector(sector.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    activeSector === sector.id
                      ? "bg-red-600 text-white"
                      : "bg-[#e8ecf0] text-gray-700 hover:text-red-600"
                  }`}
                  style={{
                    boxShadow:
                      activeSector === sector.id
                        ? "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff"
                        : "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff",
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{sector.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filteredProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-[#e8ecf0] rounded-2xl overflow-hidden block group"
              style={{ boxShadow: "8px 8px 16px #c5cdd5, -8px -8px 16px #ffffff" }}
            >
              {/* Live preview */}
              <div
                className="relative w-full h-40 overflow-hidden bg-[#e8ecf0]"
                style={{ boxShadow: "inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://s.wordpress.com/mshots/v1/${encodeURIComponent(
                    project.url
                  )}?w=500&h=300`}
                  alt={`${project.name} preview`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-base">
                    {project.name}
                  </h3>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1 group-hover:text-red-600 transition-colors" />
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {project.tagline}
                </p>
                <span
                  className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full text-red-600 bg-[#e8ecf0]"
                  style={{ boxShadow: "inset 2px 2px 4px #c5cdd5, inset -2px -2px 4px #ffffff" }}
                >
                  {SECTOR_LABEL[project.sector]}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Tech stack */}
        <section className="mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Tech Stack
          </h2>
          <div className="space-y-6">
            {TECH_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-3">
                  {group.items.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#e8ecf0]"
                      style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
                    >
                      <tech.Icon className="w-5 h-5" style={{ color: tech.color }} />
                      <span className="text-sm font-medium text-gray-800">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#e8ecf0] rounded-3xl p-8 text-center"
          style={{ boxShadow: "12px 12px 24px #c5cdd5, -12px -12px 24px #ffffff" }}
        >
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Have a project in mind?
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Whether it&apos;s a new build, an app, or maintaining a legacy project, we&apos;d love to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/profile/tickets")}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              style={{ boxShadow: "8px 8px 16px #c5cdd5" }}
            >
              Contact Us
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-[#e8ecf0] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:text-red-600 transition-colors"
              style={{ boxShadow: "6px 6px 12px #c5cdd5, -6px -6px 12px #ffffff" }}
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}