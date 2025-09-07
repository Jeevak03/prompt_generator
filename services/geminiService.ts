import { GoogleGenAI, Type } from "@google/genai";
import { SdlcRole } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      roleName: {
        type: Type.STRING,
        description: "The name of the SDLC role, e.g., 'Product Owner', 'Scrum Master', 'Developer', 'QA Engineer', 'DevOps Engineer', 'UX/UI Designer'."
      },
      frameworks: {
        type: Type.ARRAY,
        description: "Agile frameworks this role and its tasks are relevant to, such as ['Scrum', 'SAFe', 'Kanban'].",
        items: { type: Type.STRING }
      },
      tasks: {
        type: Type.ARRAY,
        description: "A list of tasks relevant to this role, derived from the document content.",
        items: {
          type: Type.OBJECT,
          properties: {
            taskDescription: {
              type: Type.STRING,
              description: "A detailed but clear description of the specific task to be performed."
            },
            nlpPrompt: {
              type: Type.STRING,
              description: "A concise, actionable NLP prompt for an AI assistant or tool to help with or automate the task. For example: 'Generate user stories for the login feature based on the requirements doc.' or 'Create a checklist for a code review of the new API endpoint.'"
            }
          },
          required: ["taskDescription", "nlpPrompt"]
        }
      }
    },
    required: ["roleName", "frameworks", "tasks"]
  }
};

export async function generateTasksFromDocuments(base64Data: string, documentName: string, mimeType: string): Promise<SdlcRole[]> {
  const model = "gemini-2.5-flash";

  const prompt = `
    Based on the content of the attached document named "${documentName}", please act as an expert Agile project management consultant. Your goal is to generate a comprehensive list of potential tasks and corresponding natural language processing (NLP) prompts that can be used in an organization's internal AI tools.

    Please follow these instructions carefully:
    1.  Analyze the provided document content thoroughly. The document could be a coding standard, requirement document, RFP, SOW, or checklist.
    2.  Identify potential tasks for a software development project based on the content.
    3.  Categorize these tasks according to standard Software Development Life Cycle (SDLC) roles.
    4.  For each role, specify which Agile frameworks (Scrum, SAFe, Kanban) the tasks are most applicable to.
    5.  For each identified task, create a concise and actionable NLP prompt. This prompt should be something a user could type into an AI tool to get help with that specific task.
    6.  The final output must be a JSON array of objects that strictly adheres to the provided response schema.
  `;

  const filePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const textPart = {
    text: prompt,
  };


  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, filePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }

    const parsedResponse = JSON.parse(jsonText);
    return parsedResponse as SdlcRole[];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate tasks: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}

export async function generateOrchestrationPrompt(roles: SdlcRole[]): Promise<string> {
  const model = "gemini-2.5-flash";

  const formattedRolesAndTasks = roles.map(role => {
    const tasks = role.tasks.map(task => `  - Task: ${task.taskDescription}\n    - NLP Prompt: ${task.nlpPrompt}`).join('\n');
    return `Role: ${role.roleName}\nFrameworks: ${role.frameworks.join(', ')}\nTasks:\n${tasks}`;
  }).join('\n\n');

  const prompt = `
    You are an expert AI Project Orchestrator. Your task is to create a master prompt that can be used to guide another advanced AI agent to autonomously manage and execute a software development project.

    Below is a list of roles and their identified tasks for a project, derived from the project documentation:
    ---
    ${formattedRolesAndTasks}
    ---

    Based on this information, generate a single, comprehensive "orchestration prompt". This prompt should be a set of instructions for an AI agent. When given this prompt, the agent should be able to:

    1.  Assume the persona of an autonomous Project Manager.
    2.  Understand the full scope of the project based on the provided roles and tasks.
    3.  Establish a logical sequence and a high-level project plan for the tasks, identifying potential dependencies.
    4.  Simulate task delegation to the appropriate roles and track progress.
    5.  Define a communication and reporting protocol. For example, generating daily stand-up summaries or weekly progress reports.
    6.  Outline a decision-making framework for handling ambiguities, prioritizing tasks, and managing hypothetical roadblocks.
    7.  Engage in a continuous loop of planning, executing, and reporting to drive the project to completion.

    The final output should be ONLY the orchestration prompt itself, written in a clear, instructive, and detailed tone. It should be ready to be copied and used to initialize a powerful AI model for project management simulation. Do not include any introductory text like "Here is the orchestration prompt:".
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for orchestration prompt:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate orchestration prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the orchestration prompt.");
  }
}
