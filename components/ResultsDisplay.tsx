
import React, { useState } from 'react';
import { SdlcRole } from '../types';
import { ChevronDownIcon, ClipboardIcon, CheckIcon } from './icons/Icons';

interface AccordionItemProps {
    role: SdlcRole;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedPromptIndex(index);
        setTimeout(() => setCopiedPromptIndex(null), 2000);
    };

    return (
        <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/60 backdrop-blur-sm">
            <button
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-sky-300 hover:bg-slate-700/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{role.roleName}</span>
                <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-1 justify-end">
                        {role.frameworks.map((fw, i) => (
                           <span key={i} className="text-xs font-mono bg-sky-900/70 text-sky-300 px-2 py-1 rounded-full">{fw}</span>
                        ))}
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="p-4 bg-slate-800/30">
                    <div className="space-y-4">
                        {role.tasks.map((task, index) => (
                            <div key={index} className="p-4 border-l-4 border-sky-600 bg-slate-900/50 rounded-r-lg">
                                <p className="font-semibold text-slate-200 mb-2">{task.taskDescription}</p>
                                <div className="flex items-start justify-between gap-2 p-3 bg-slate-800 rounded-md font-mono text-sm text-cyan-300">
                                    <pre className="whitespace-pre-wrap flex-1"><code>{task.nlpPrompt}</code></pre>
                                    <button 
                                        onClick={() => handleCopy(task.nlpPrompt, index)} 
                                        className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-sky-300 transition-colors"
                                        title="Copy prompt"
                                    >
                                        {copiedPromptIndex === index ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface ResultsDisplayProps {
    results: SdlcRole[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    if (!results || results.length === 0) {
        return <p className="text-center text-slate-400 mt-8">No results to display.</p>;
    }

    return (
        <div className="space-y-4">
            {results.map((role, index) => (
                <AccordionItem key={index} role={role} />
            ))}
        </div>
    );
};

export default ResultsDisplay;
