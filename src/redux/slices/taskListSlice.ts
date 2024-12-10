import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { Task, TaskListState, Comment } from '../../types/taskTypes';

const initialState: TaskListState = {
  tasks: [],
};

const findComment = (comments: Comment[], id: number): Comment | null => {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    if (comment.replies) {
      const found = findComment(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
};

const taskList = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTasks: (
      state,
      action: PayloadAction<{
        status: string;
        title: string;
        description?: string;
        priority: string;
        projectId: number;
        deadLineDate: string;
      }>
    ) => {
      state.tasks.push({
        status: action.payload.status,
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description || null,
        completed: false,
        priority: action.payload.priority,
        projectId: action.payload.projectId,
        createdAt: dayjs().format('DD.MM.YYYY'),
        startTime: null,
        workingTime: 0,
        isActive: false,
        deadLineDate: action.payload.deadLineDate || null,
        subTasks: [],
        comments: [],
      });
    },
    toggleTaskCompletion: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = 'Done';
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: number; status: string }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.completed = action.payload.status === 'Done';
      }
    },
    updateTaskTitle: (
      state,
      action: PayloadAction<{ id: number; title: string }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
    },
    updateTaskDiscription: (
      state,
      action: PayloadAction<{ id: number; description: string }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.description = action.payload.description;
      }
    },
    updatePriority: (
      state,
      action: PayloadAction<{ id: number; priority: string }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
      }
    },
    startTask: (state, action: PayloadAction<{ id: number }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        if (task.isActive) {
          const diff = dayjs().diff(dayjs(task.startTime), 'second');
          task.workingTime += diff;
          task.startTime = null;
          task.isActive = false;
        } else {
          task.startTime = dayjs().valueOf();
          task.isActive = true;
        }
      }
    },
    updateDeadLineDate: (
      state,
      action: PayloadAction<{ id: number; deadLineDate: string }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.deadLineDate = action.payload.deadLineDate;
      }
    },
    addSubtask: (
      state,
      action: PayloadAction<{ taskId: number; title: string }>
    ) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );
      if (task) {
        const newSubtask = {
          id: Date.now(),
          title: action.payload.title,
          completed: false,
        };
        task.subTasks.push(newSubtask);
      }
    },
    deleteSubTask: (
      state,
      action: PayloadAction<{ taskId: number; subTaskId: number }>
    ) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );
      if (task) {
        task.subTasks = task.subTasks.filter(
          (subTask) => subTask.id !== action.payload.subTaskId
        );
      }
    },
    toggleSubtaskCompletion: (
      state,
      action: PayloadAction<{ taskId: number; subTaskId: number }>
    ) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload.taskId
      );
      if (task) {
        const subtask = task.subTasks.find(
          (subTask) => subTask.id === action.payload.subTaskId
        );
        if (subtask) {
          subtask.completed = !subtask.completed;
        }
      }
    },
    addComment: (
      state,
      action: PayloadAction<{
        taskId: number;
        parentId: number | null;
        content: string;
      }>
    ) => {
      const { taskId, parentId, content } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        const newComment: Comment = {
          id: Date.now(),
          content,
          replies: [] as Comment[],
        };
        if (parentId !== null) {
          const parentComment = findComment(task.comments, parentId);
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.push(newComment);
          }
        } else {
          task.comments.push(newComment);
        }
      }
    },
  },
});

export const {
  addTasks,
  toggleTaskCompletion,
  deleteTask,
  updateTaskStatus,
  updateTaskTitle,
  updateTaskDiscription,
  updatePriority,
  startTask,
  updateDeadLineDate,
  addSubtask,
  deleteSubTask,
  toggleSubtaskCompletion,
  addComment,
} = taskList.actions;

export default taskList.reducer;
