"use client";

import { motion, type Variants } from "framer-motion";
import {
  Eye,
  BrainCircuit,
  Workflow,
  MessageSquareText,
  Shield,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareText,
    title: "Prompt Playground",
    description:
      "Test prompts, compare models side-by-side, visualize token usage and context windows in real time.",
    gradient: "from-[#A1CCA5] to-[#8FB996]",
    delay: 0,
  },
  {
    icon: Workflow,
    title: "Workflow Builder",
    description:
      "Drag-and-drop visual automation builder. Connect LLMs, tools, APIs, and logic blocks — then run them live.",
    gradient: "from-[#4CBB17] to-[#709775]",
    delay: 0.1,
  },
  {
    icon: Shield,
    title: "MCP Playground",
    description:
      "Watch AI discover and use tools in real time. Visualize MCP calls, permissions, and API execution flows.",
    gradient: "from-[#D4A843] to-[#B8860B]",
    delay: 0.2,
  },
  {
    icon: BrainCircuit,
    title: "Agent Simulator",
    description:
      "Create researcher, planner, and service agents. Watch them think, plan, delegate, and collaborate visually.",
    gradient: "from-[#415D43] to-[#709775]",
    delay: 0.3,
  },
  {
    icon: Eye,
    title: '"See Inside the AI"',
    description:
      "Visualize WHY the AI made decisions, WHICH tools it used, WHAT context it received, and HOW workflows executed.",
    gradient: "from-[#8FB996] to-[#4CBB17]",
    delay: 0.4,
  },
  {
    icon: BookOpen,
    title: '"Explain Like I\'m Human"',
    description:
      "Every complex term — embeddings, vectors, tokens, MCP — translated into plain English, analogies, and animations.",
    gradient: "from-[#709775] to-[#A1CCA5]",
    delay: 0.5,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Features() {
  return (
    <section id="features" className="section relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge mx-auto mb-5">
            <Eye className="w-3.5 h-3.5" />
            Platform Features
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Everything You Need to
            <br />
            <span className="gradient-text">Master AI Automation</span>
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
            Visual, interactive, and beginner-first. Learn by doing, not just watching.
          </p>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            className="card group cursor-default"
            id={`feature-${feature.title.toLowerCase().replace(/[^a-z]/g, "-")}`}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <feature.icon className="w-6 h-6 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {feature.description}
            </p>

            {/* Bottom gradient line on hover */}
            <div
              className={`mt-6 h-[2px] w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} transition-all duration-500 rounded-full`}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
