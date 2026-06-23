"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  GraduationCap,
  Rocket,
  Briefcase,
  ChevronRight,
  BookOpen,
  Cpu,
  Bot,
  Building,
} from "lucide-react";
import Link from "next/link";

const tracks = [
  {
    icon: Sparkles,
    tier: "Beginner",
    color: "#4CBB17",
    gradient: "from-[#4CBB17] to-[#A1CCA5]",
    courses: [
      "What is AI?",
      "What is an LLM?",
      "Prompt Engineering Basics",
      "AI Memory Explained",
      "AI vs Automation",
      "AI Agents for Beginners",
    ],
  },
  {
    icon: Cpu,
    tier: "Intermediate",
    color: "#A1CCA5",
    gradient: "from-[#8FB996] to-[#A1CCA5]",
    courses: [
      "MCP Explained",
      "AI Workflows",
      "Multi-Agent Systems",
      "RAG (Retrieval Augmented Generation)",
      "AI Tool Calling",
      "Vector Databases",
    ],
  },
  {
    icon: Rocket,
    tier: "Builder",
    color: "#D4A843",
    gradient: "from-[#D4A843] to-[#B8860B]",
    courses: [
      "Build Your First AI Agent",
      "Create a Support Agent",
      "Build a Research Agent",
      "Automate Business Workflows",
      "AI Sales Assistant",
      "AI YouTube Script Generator",
    ],
  },
  {
    icon: Briefcase,
    tier: "Business",
    color: "#709775",
    gradient: "from-[#415D43] to-[#709775]",
    courses: [
      "AI for Realtors",
      "AI for Restaurants",
      "AI for Small Businesses",
      "AI for Content Creators",
      "AI for Consultants",
      "AI for Ecommerce",
    ],
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LearningPaths() {
  return (
    <section id="paths" className="section relative">
      {/* Divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />

      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge mx-auto mb-5">
            <GraduationCap className="w-3.5 h-3.5" />
            Learning Paths
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Guided <span className="gradient-text">Career Trees</span>,
            <br />
            Not Random Courses
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
            Follow structured paths from absolute beginner to AI builder.
            Every step builds on the last.
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
      >
        {tracks.map((track) => (
          <motion.div
            key={track.tier}
            variants={cardVariants}
            className="card group"
            id={`path-${track.tier.toLowerCase()}`}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <track.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{track.tier} Track</h3>
                <p className="text-xs text-[var(--muted)]">{track.courses.length} courses</p>
              </div>
            </div>

            {/* Course List */}
            <ul className="space-y-2.5">
              {track.courses.map((course, i) => (
                <li
                  key={course}
                  className="flex items-center gap-3 text-sm group/item hover:translate-x-1 transition-transform duration-200"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: `${track.color}15`,
                      color: track.color,
                      border: `1px solid ${track.color}30`,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-[var(--muted)] group-hover/item:text-white transition-colors">
                    {course}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)] opacity-0 group-hover/item:opacity-100 transition-opacity ml-auto" />
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/learn"
              className="mt-6 flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: track.color }}
            >
              <BookOpen className="w-4 h-4" />
              Start this path
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Career transitions teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 text-center"
      >
        <div className="glass inline-flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 px-6 sm:px-8 py-5 rounded-2xl mx-auto">
          <Building className="w-5 h-5 text-[var(--primary-light)] shrink-0" />
          <div className="text-center sm:text-left">
            <div className="text-sm font-semibold text-white">Career Transition Paths</div>
            <div className="text-xs text-[var(--muted)] leading-relaxed">
              Office Worker → AI Workflow Specialist &nbsp;|&nbsp;
              Teacher → AI Content Builder &nbsp;|&nbsp;
              Admin → AI Operations Manager
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--muted)] hidden sm:block" />
        </div>
      </motion.div>
    </section>
  );
}
