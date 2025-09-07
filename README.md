
# Agile SDLC Task & Prompt Generator

This application is a powerful tool for project managers, team leads, and developers designed to streamline the initial phases of project planning. By uploading project documents such as requirements, Statements of Work (SOWs), or coding standards, users can automatically generate a structured list of tasks categorized by Software Development Life Cycle (SDLC) roles and relevant Agile frameworks.

Beyond simple task creation, it also generates actionable Natural Language Processing (NLP) prompts for each task, enabling seamless integration with internal AI assistants or tools. The standout feature is the **Orchestration Prompt Generator**, which creates a master prompt to simulate an autonomous AI project manager, capable of planning, delegating, and managing the entire project workflow.

## ✨ Features

-   **Multi-File Upload**: Upload up to 10 project documents at once, including PDF, DOCX, PPTX, TXT, MD, and CSV files.
-   **Intelligent Document Analysis**: Leverages the Google Gemini API to read and understand the content of your documents.
-   **Role-Based Task Generation**: Automatically identifies and creates tasks for various SDLC roles, such as:
    -   Product Owner
    -   Scrum Master
    -   Developer
    -   QA Engineer
    -   DevOps Engineer
    -   UX/UI Designer
-   **Agile Framework Tagging**: Each role and its associated tasks are tagged with relevant Agile frameworks like **Scrum**, **SAFe**, and **Kanban**.
-   **NLP Prompt Crafting**: For every task, a concise and effective NLP prompt is generated, ready to be used with AI tools to assist or automate the work (e.g., *"Generate user stories for the login feature based on the requirements doc."*).
-   **Orchestration Prompt Generation**: After tasks are generated, create a comprehensive, high-level "master prompt". This prompt instructs an advanced AI model to act as an autonomous project manager, using the generated tasks to:
    -   Establish a project plan and identify dependencies.
    -   Simulate task delegation and progress tracking.
    -   Define a communication protocol (e.g., daily stand-up summaries).
    -   Outline a decision-making framework for handling roadblocks.
-   **Interactive & Responsive UI**: A clean, modern interface built with Tailwind CSS, featuring an accordion view to easily navigate results and a modal for displaying the orchestration prompt.
-   **Copy-to-Clipboard**: Easily copy individual NLP prompts or the entire orchestration prompt with a single click.

## 🚀 How to Use

1.  **API Key**: Ensure your `API_KEY` for the Google Gemini API is correctly configured as an environment variable. The application will show an error if it's missing.
2.  **Upload Documents**: Drag and drop your project files onto the upload area or click to select them from your computer. You can upload multiple files at once.
3.  **Generate Tasks**: Click the **"Generate Tasks"** button. The application will process each file and display a progress indicator.
4.  **Review Results**: The generated tasks will appear in an accordion, neatly organized by SDLC role. You can expand each role to see the detailed tasks, associated Agile frameworks, and the corresponding NLP prompts.
5.  **Create Orchestration Prompt**: Once you are satisfied with the generated tasks, click the **"✨ Create Orchestration Prompt"** button.
6.  **Use the Master Prompt**: A modal will appear displaying the orchestration prompt. Copy it and use it with a powerful AI model (like Gemini) to kick off an autonomous project management simulation.

## 🛠️ Technologies Used

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **AI Model**: Google Gemini API (`@google/genai`)

This tool is designed to bridge the gap between initial project documentation and actionable, AI-enhanced project planning, saving time and improving clarity from day one.
