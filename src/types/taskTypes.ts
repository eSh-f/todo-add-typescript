export interface Task {
  status: string;
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: string;
  projectId: number;
  createdAt: string;
  startTime: number | null;
  workingTime: number;
  isActive: boolean;
  deadLineDate?: string | null;
  subTasks: SubTask[];
  comments: Comment[];
}

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: number;
  content: string;
  replies?: Comment[];
}

export interface TaskListState {
  tasks: Task[];
}
