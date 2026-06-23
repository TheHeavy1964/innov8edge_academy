import Link from "next/link";
import { ArrowLeft, BookOpen, BrainCircuit, Cable, Workflow, Database, Cpu, Zap, Blocks } from "lucide-react";

export default function NotebookLMReferencePage() {
  return (
    <div className="min-h-screen bg-[#0A120B] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(143,185,150,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -left-[20%] top-[20%] w-[500px] h-[500px] bg-[var(--primary)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -right-[20%] top-[60%] w-[400px] h-[400px] bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-sm font-bold mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Coach Innov8 Reference Knowledge</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            The Universal Connector: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-emerald-300">
              Understanding MCP
            </span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-3xl leading-relaxed">
            The Model Context Protocol (MCP) represents the exact same architectural shift for the era of Artificial Intelligence as USB-C did for hardware. Here's everything you need to know about how Coach Innov8 leverages it.
          </p>
        </div>

        {/* Section 1: The Aha Moment */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Cable className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <h2 className="text-3xl font-bold">1. The "Aha!" Moment: The USB-C of AI</h2>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none mb-10 text-[var(--muted)]">
            <p>
              In the early days of mobile computing, hardware connectivity was a fragmented nightmare; every manufacturer utilized proprietary pins and cables, creating massive inefficiencies for consumers and developers alike. The introduction of the USB-C standard revolutionized this landscape by providing a singular, universal port that handles power, data, and peripherals across any device.
            </p>
            <p>
              The Model Context Protocol (MCP) represents the exact same architectural shift for the era of Artificial Intelligence. Rather than requiring developers to engineer custom, brittle integrations every time a Large Language Model (LLM) needs to interoperate with a new data silo or software utility, MCP provides a standardized software interface—a universal "plug"—that allows disparate systems to communicate instantly and securely.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-bold text-white w-1/2">The Physical Standard (USB-C)</th>
                  <th className="p-4 font-bold text-white w-1/2">The AI Standard (MCP)</th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted)] text-sm md:text-base">
                <tr className="border-b border-white/5">
                  <td className="p-4">A physical port and cable specification that standardizes hardware connections.</td>
                  <td className="p-4">A software protocol that standardizes how AI applications access external resources.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4">Connects diverse hardware like laptops, smartphones, and peripheral cameras.</td>
                  <td className="p-4">Connects diverse AI models like Claude or ChatGPT to external systems.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4">Interfaces with power and data to expand a device's physical capabilities.</td>
                  <td className="p-4">Interfaces with data sources, tools, and workflows to expand a model's cognitive capabilities.</td>
                </tr>
                <tr>
                  <td className="p-4">Eliminates the need for proprietary cables, enabling one-to-many connectivity.</td>
                  <td className="p-4">Eliminates the need for custom integrations, enabling one integration to work across all AI platforms.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-[var(--muted)]/70 italic text-center">
            Just as the universal adoption of USB-C removed the friction of physical connectivity, MCP ensures that AI no longer requires a bespoke integration for every individual data source or tool in an organization's stack.
          </p>
        </div>

        {/* Section 2: Defining the Protocol */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold">2. Defining the Protocol: What is MCP?</h2>
          </div>
          
          <p className="text-[var(--muted)] text-lg mb-8 leading-relaxed">
            The Model Context Protocol (MCP) is an open-source standard—maintained under the auspices of LF Projects, LLC (a Linux Foundation project)—designed to bridge the gap between isolated AI applications and the external ecosystems they need to navigate. By establishing a common language for information exchange, MCP enables AI models to move beyond static text generation and begin interacting with technical environments through three distinct categories:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--primary)]/50 transition-colors">
              <Database className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Data Sources</h3>
              <p className="text-[var(--muted)] text-sm">
                These allow the AI to securely "read" and ingest information from specific repositories, such as local files on a workstation or structured information residing in enterprise databases.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--primary)]/50 transition-colors">
              <Blocks className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Tools</h3>
              <p className="text-[var(--muted)] text-sm">
                These are functional executable utilities that an AI can trigger to perform specific actions, ranging from search engines for real-time information retrieval to calculators for precise mathematical execution.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--primary)]/50 transition-colors">
              <Workflow className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Workflows</h3>
              <p className="text-[var(--muted)] text-sm">
                Rather than simple text strings, these are standardized, repeatable sequences and multi-step prompt structures that guide the AI through complex processes with predictable, high-fidelity outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: The Three-Way Win */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold">3. The Three-Way Win: Why MCP Matters</h2>
          </div>

          <p className="text-[var(--muted)] text-lg mb-8">
            From a structural perspective, MCP creates a "force multiplier" effect. By solving the problem of connectivity at the protocol level, it delivers specialized value to every stakeholder in the AI lifecycle.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <span className="font-bold text-blue-400">1</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">For Developers</h4>
                <p className="text-[var(--muted)]">MCP drastically accelerates development velocity by reducing the complexity of building and maintaining integrations. Instead of managing a sprawling web of proprietary APIs, developers can build to a single standard, ensuring their tools are compatible with any MCP-compliant AI application.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="font-bold text-emerald-400">2</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">For AI Applications and Agents</h4>
                <p className="text-[var(--muted)]">By adopting a universal standard, AI agents gain immediate access to a vast, plug-and-play ecosystem of data and tools. This capability expansion improves the model's contextual awareness and utility, directly elevating the quality of the intelligence provided to the end-user.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="font-bold text-purple-400">3</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">For End-Users</h4>
                <p className="text-[var(--muted)]">The ultimate result is a more autonomous and capable AI "agent." Because the protocol allows the AI to securely access user data and take authorized actions on their behalf, it transforms the AI from a simple conversationalist into a functional assistant capable of solving real-world problems.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Real-World Capabilities */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold">4. MCP in Action: Real-World Capabilities</h2>
          </div>

          <p className="text-[var(--muted)] text-lg mb-8">
            MCP fundamentally shifts the AI's role from a "chatbot" to an "active agent" by providing the necessary hooks to manipulate and analyze the real world.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                Personalized Assistance
              </h4>
              <ul className="space-y-3 text-sm">
                <li><strong className="text-white/90">Action:</strong> Integrating an AI agent with a user's Google Calendar and Notion workspace via MCP.</li>
                <li><strong className="text-white/90">Outcome:</strong> The AI functions as a context-aware personal assistant that proactively manages schedules and references private notes.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                Design to Development
              </h4>
              <ul className="space-y-3 text-sm">
                <li><strong className="text-white/90">Action:</strong> Utilizing a Figma design file as a direct context input for Claude Code.</li>
                <li><strong className="text-white/90">Outcome:</strong> The AI analyzes the visual architecture and generates a fully functional, production-ready web application.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                Enterprise Data Synthesis
              </h4>
              <ul className="space-y-3 text-sm">
                <li><strong className="text-white/90">Action:</strong> Connecting a centralized chatbot to multiple, disparate organization-wide databases.</li>
                <li><strong className="text-white/90">Outcome:</strong> Employees can perform complex cross-database analysis and generate insights through natural language queries.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                Physical Environments
              </h4>
              <ul className="space-y-3 text-sm">
                <li><strong className="text-white/90">Action:</strong> Linking AI models to 3D modeling software like Blender and physical manufacturing hardware.</li>
                <li><strong className="text-white/90">Outcome:</strong> An AI can iterate on a 3D design and transmit the finalized instructions directly to a 3D printer.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
