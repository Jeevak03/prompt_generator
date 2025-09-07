import React, { useState, useCallback } from 'react';
import { ClipboardIcon, CheckIcon, XIcon } from './icons/Icons';

interface OrchestrationPromptModalProps {
  prompt: string;
  onClose: () => void;
}

const OrchestrationPromptModal: React.FC<OrchestrationPromptModalProps> = ({ prompt, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            Project Orchestration Prompt
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
            <p className="text-slate-400 mb-4">
                Use this prompt with an advanced AI model (like Gemini) to simulate an autonomous project manager. It will guide the AI to understand the project scope, plan tasks, and orchestrate the entire workflow based on the roles you've generated.
            </p>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 max-h-[50vh] overflow-y-auto border border-slate-700">
                <pre className="whitespace-pre-wrap">
                    <code>{prompt}</code>
                </pre>
            </div>
        </div>
        <footer className="p-4 border-t border-slate-700 mt-auto">
             <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-all duration-300"
            >
              {copied ? <CheckIcon className="w-5 h-5 mr-2" /> : <ClipboardIcon className="w-5 h-5 mr-2" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default OrchestrationPromptModal;
