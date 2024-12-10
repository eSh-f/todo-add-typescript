import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: number;
  title: string;
  createdAt: string;
}

interface ProjectListState {
  projects: Project[];
}

const initialState: ProjectListState = {
  projects: [],
};

const projectList = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addTodoProject: (state, action: PayloadAction<{ title: string }>) => {
      state.projects.push({
        id: Date.now(),
        title: action.payload.title,
        createdAt: new Date().toLocaleDateString('ru-RU'),
      });
    },
    deleteTodoProject: (state, action: PayloadAction<{ id: number }>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload.id
      );
    },
  },
});

export const { addTodoProject, deleteTodoProject } = projectList.actions;

export default projectList.reducer;
