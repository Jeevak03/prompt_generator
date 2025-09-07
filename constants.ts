export const MAX_FILES = 10;
// Set a realistic max size to avoid the token limit for a single file.
// The gemini-2.5-flash context window is 1M tokens, which is roughly 3.5-4MB of text. 3.5MB is a safe limit.
export const MAX_FILE_SIZE_BYTES = 3.5 * 1024 * 1024; // 3.5MB
export const MAX_FILE_SIZE_MB = 3.5;

// Whitelist of allowed MIME types for file uploads.
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'text/plain',
  'text/markdown',
  'text/csv',
];

// Blocklist of file extensions that are not allowed for security reasons.
export const BLOCKED_FILE_EXTENSIONS = ['.exe', '.msi', '.bat', '.sh', '.cmd', '.dll'];
