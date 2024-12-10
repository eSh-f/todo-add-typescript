import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
    addTasks,
    toggleTaskCompletion,
    deleteTask,
    updateTaskTitle,
    updateTaskStatus,
    updateTaskDiscription,
    updatePriority,
    startTask,
    updateDeadLineDate,
} from '../redux/slices/taskListSlice';
import {RootState} from '../redux/store';
import TaskModal from '../components/modals/TaskModal';
import Task from '../components/Task';
import DropZone from '../components/DropZone';
import type {Task as TaskType} from '@/types/taskTypes';

interface TaskListProps {
    updateTaskStatus?: (task: TaskType) => void;
    searchQuery: string,
    isSearching: boolean,
    filteredTasks: TaskType[],
    resetSearch: () => void
}

const TaskList = ({isSearching, filteredTasks, resetSearch}: TaskListProps) => {
    const {title} = useParams<{ title: string }>();
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [priority, setPriority] = useState<string>('low');
    const [deadLineDate, setDeadLineDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<TaskType | null>(null);
    const dispatch = useDispatch();

    const project = useSelector((state: RootState) =>
        state.projectList.projects.find((proj) => proj.title === title)
    );

    const tasks = useSelector((state: RootState) =>
        project
            ? state.taskList.tasks.filter((task) => task.projectId === project?.id)
            : []
    );

    const taskToDisplay = isSearching ? filteredTasks : tasks;

    const handleAddOrUpdateTask = () => {
        if (editingTask) {
            dispatch(updateTaskTitle({id: editingTask.id, title: taskTitle}));
            dispatch(updateTaskDiscription({id: editingTask.id, description}));
            dispatch(updatePriority({id: editingTask.id, priority}));
            dispatch(
                updateDeadLineDate({
                    id: editingTask.id,
                    deadLineDate: deadLineDate || '',
                })
            );
        } else {
            dispatch(
                addTasks({
                    projectId: project?.id || 0,
                    title: taskTitle,
                    description,
                    priority,
                    status: 'Queue',
                    deadLineDate: deadLineDate || '',
                })
            );
        }
        resetModal();
    };

    const resetModal = (): void => {
        setTaskTitle('');
        setDescription('');
        setPriority('low');
        setEditingTask(null);
        setIsModalOpen(false);
    };

    const openModal = (): void => {
        resetModal();
        setIsModalOpen(true);
        setEditingTask(null);
    };
    const openEditModal = (task: Task): void => {
        setTaskTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        setDeadLineDate(task.deadLineDate || null);
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    const tasksByStatus: Record<string, Task[]> = {
        Queue: taskToDisplay.filter((task) => task.status === 'Queue'),
        Development: taskToDisplay.filter((task) => task.status === 'Development'),
        Done: taskToDisplay.filter((task) => task.status === 'Done'),
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: 2,
                }}
            >
                <Box sx={{marginBottom: '10px'}}>
                    <Button variant='contained' onClick={openModal}>
                        Добавить задачу
                    </Button>
                </Box>

                <Box>
                    <Grid container spacing={1}>
                        {Object.entries(tasksByStatus).map(([status, tasks]) => (
                            <Grid key={status}>
                                <Box>
                                    <DropZone
                                        status={status}
                                        updateTaskStatus={(id: number, status: string) =>
                                            dispatch(updateTaskStatus({id, status}))
                                        }
                                    >
                                        {tasks.map((task) => (
                                            <Task
                                                handleStart={(id) => {
                                                    dispatch(startTask({id: task.id}));
                                                }}
                                                key={task.id}
                                                task={task}
                                                editingTask={editingTask}
                                                openModal={() => openEditModal(task)}
                                                toggleTaskCompletion={(id) =>
                                                    dispatch(toggleTaskCompletion(id))
                                                }
                                                deleteTask={(id) => dispatch(deleteTask(id))}
                                                updateTaskTitle={(id: any   , newTitle: any) =>
                                                    dispatch(updateTaskTitle({id, "title": newTitle}))
                                                }
                                            />
                                        ))}
                                    </DropZone>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <TaskModal
                        deadLineDate={deadLineDate || ''}
                        setDeadLineDate={setDeadLineDate}
                        editingTask={editingTask}
                        isModalOpen={isModalOpen}
                        closeModal={closeModal}
                        taskTitle={taskTitle}
                        description={description}
                        priority={priority}
                        setTaskTitle={setTaskTitle}
                        setDescription={setDescription}
                        setPriority={setPriority}
                        handleAddOrUpdateTask={handleAddOrUpdateTask}
                    />
                </Box>
            </Box>
        </>
    );
};

export default TaskList;
