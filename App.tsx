import React, { useState, useCallback, useEffect } from 'react';
import { SdlcRole } from './types';
import { generateTasksFromDocuments } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { MAX_FILES, MAX_FILE_SIZE_MB } from './constants';

const mergeResults = (existingResults: SdlcRole[], newResults: SdlcRole[]): SdlcRole[] => {
    const roleMap = new Map<string, SdlcRole>();

    // Populate map with existing results
    for (const role of existingResults) {
        roleMap.set(role.roleName, { ...role, frameworks: [...role.frameworks], tasks: [...role.tasks] });
    }

    // Merge new results
    for (const newRole of newResults) {
        if (roleMap.has(newRole.roleName)) {
            const existingRole = roleMap.get(newRole.roleName)!;
            // Merge tasks
            existingRole.tasks.push(...newRole.tasks);
            // Merge frameworks, avoiding duplicates
            const newFrameworks = newRole.frameworks.filter(fw => !existingRole.frameworks.includes(fw));
            existingRole.frameworks.push(...newFrameworks);
        } else {
            // Add new role
            roleMap.set(newRole.roleName, { ...newRole, frameworks: [...newRole.frameworks], tasks: [...newRole.tasks] });
        }
    }

    return Array.from(roleMap.values());
};


const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SdlcRole[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const [progress, setProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyError(true);
      setError("API_KEY environment variable not set. Please configure it to use the application.");
    }
  }, []);

  const handleFilesChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
    setResults(null);
  };

  const handleGenerate = useCallback(async () => {
    if (files.length === 0 || apiKeyError) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setProgress(null);
    
    let cumulativeResults: SdlcRole[] = [];

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setProgress(`Processing file ${i + 1} of ${files.length}: ${file.name}`);
            
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target?.result as string);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });

            const base64Data = dataUrl.split(',')[1];
            if (!base64Data) {
                throw new Error(`Failed to read file: ${file.name}`);
            }

            const generatedResults = await generateTasksFromDocuments(base64Data, file.name, file.type);
            cumulativeResults = mergeResults(cumulativeResults, generatedResults);
        }
        setResults(cumulativeResults);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  }, [files, apiKeyError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-200 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            Agile SDLC Task & Prompt Generator
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
            Upload project documents to automatically generate categorized tasks and NLP prompts for your team.
          </p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-sky-900/20 p-6 md:p-8 border border-slate-700">
          <FileUpload onFilesChange={handleFilesChange} />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={files.length === 0 || isLoading || apiKeyError}
              className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? 'Generating...' : 'Generate Tasks'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && <Loader message={progress || undefined} />}

        {results && !isLoading && (
          <div className="mt-8">
             <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Generated Results</h2>
            <ResultsDisplay results={results} />
          </div>
        )}
        
        {!isLoading && !results && !error && (
            <div className="mt-12 text-center text-slate-500">
                <p>Upload up to {MAX_FILES} files (max {MAX_FILE_SIZE_MB.toFixed(1)}MB each) and click "Generate Tasks" to begin.</p>
            </div>
        )}
      </main>
      <footer className="text-center p-4 text-slate-600 text-sm">
        Powered by Google Gemini API
      </footer>
    </div>
  );
};

export default App;
