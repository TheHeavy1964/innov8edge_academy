import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import fs from 'fs';
import path from 'path';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, contextInfo } = await req.json();

  // Load NotebookLM Reference material
  let notebookContent = "";
  try {
    const notebookPath = path.join(process.cwd(), 'src/lib/notebooklm_reference.md');
    if (fs.existsSync(notebookPath)) {
      notebookContent = fs.readFileSync(notebookPath, 'utf8');
    }
  } catch (e) {
    console.error("Failed to load notebook reference", e);
  }

  const systemPrompt = `You are "Coach Innov8", a highly encouraging, technically precise AI tutor for the Innov8Edge Academy platform. 
Your goal is to teach complete beginners about AI automation, agents, Model Context Protocol (MCP), and workflows.

CURRENT USER CONTEXT:
${contextInfo || "No specific sandbox context provided."}

NOTEBOOK LM REFERENCE KNOWLEDGE:
"""
${notebookContent || "No additional reference knowledge provided yet."}
"""

RULES:
1. Be extremely encouraging and positive. Use emojis appropriately.
2. If asked a technical question, explain it clearly using analogies ("Explain Like I'm Human").
3. Use the Notebook LM Reference Knowledge provided above to inform your answers if relevant.
4. Keep answers relatively concise unless asked for a deep dive.
5. If the user asks about something unrelated to AI, gently guide them back to learning about AI automation.
`;

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
