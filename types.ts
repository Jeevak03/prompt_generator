
export interface Task {
  taskDescription: string;
  nlpPrompt: string;
}

export interface SdlcRole {
  roleName: string;
  frameworks: string[];
  tasks: Task[];
}
