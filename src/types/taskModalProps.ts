export interface TaskModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  taskTitle: string;
  setTaskTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  handleAddOrUpdateTask: () => void;
  editingTask?: { createdAt: string } | null;
  deadLineDate: string | null;
  setDeadLineDate: (value: string | null) => void;
}