import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  List,
  ListItem,
  Box,
  Button,
  Checkbox,
  Typography,
  Card,
  CardContent,
  CardActions,
  ButtonGroup,
} from '@mui/material';
import { useDrag } from 'react-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import TimerIcon from '@mui/icons-material/Timer';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CreateIcon from '@mui/icons-material/Create';
import CommentIcon from '@mui/icons-material/Comment';
import dayjs from 'dayjs';
import {
  addSubtask,
  deleteSubTask,
  toggleSubtaskCompletion,
  addComment,
} from '../redux/slices/taskListSlice';

import { Comment } from '@/types/taskTypes';

interface Task {
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

interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

interface DraggedItem {
  id: number;
  status: string;
}

interface TaskProps {
  task: Task;
  toggleTaskCompletion: (id: number) => void;
  deleteTask: (id: number) => void;
  openModal: (task: Task) => void;
  handleStart: (id: number) => void;
  editingTask: Task | null;
  updateTaskTitle: (id: number, newTitle: string) => void;
}

const Task: React.FC<TaskProps> = ({
                                     task,
                                     toggleTaskCompletion,
                                     deleteTask,
                                     openModal,
                                     handleStart,
                                     updateTaskTitle,
                                   }: TaskProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newComment, setNewComment] = useState<string>('');
  const [replyingTo, setReplayingTo] = useState<null | number>(null);
  const [showSubtask, setShowSubtask] = useState<boolean>(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');
  const [showComment, setShowComment] = useState<boolean>(false);

  const [{ isDragging }, drag] = useDrag<
      DraggedItem,
      void,
      { isDragging: boolean }
  >(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleAddComment = (): void => {
    if (newComment.trim() === '') return;
    dispatch(
        addComment({ taskId: task.id, parentId: replyingTo, content: newComment })
    );
    setNewComment('');
    setReplayingTo(null);
  };

  const renderComments = (comments: Comment[] = []): JSX.Element[] =>
      comments.map((comment) => (
          <Box
              key={comment.id}
              sx={{
                padding: 1,
                border: '1px solid #ccc',
                borderRadius: 1,
                marginY: 1,
              }}
          >
            <Typography>{comment.content}</Typography>
            <Button onClick={() => setReplayingTo(comment.id)}>Ответить</Button>
            {replyingTo === comment.id && (
                <Box>
                  <input
                      type='text'
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder='Введите ваш ответ'
                  />
                  <Button onClick={handleAddComment}>Добавить ответ</Button>
                </Box>
            )}
          </Box>
      ));

  const handleAddSubtask = (): void => {
    if (newSubtaskTitle.trim() === '') return;
    dispatch(addSubtask({ taskId: task.id, title: newSubtaskTitle }));
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subTaskId: number): void => {
    dispatch(deleteSubTask({ taskId: task.id, subTaskId }));
  };

  const handleToggleSubtaskCompletion = (subTaskId: number): void => {
    dispatch(toggleSubtaskCompletion({ taskId: task.id, subTaskId }));
  };

  const [elapsedTime, setElapsedTime] = useState<number>(task.workingTime);
  const selectPriority: Record<string, string> = {
    low: '🟢',
    medium: '🟠',
    high: '🔴',
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (task.isActive) {
      timer = setInterval(() => {
        const diff = dayjs().diff(dayjs(task.startTime), 'second');
        setElapsedTime(task.workingTime + diff);
      }, 1000);
    } else {
      setElapsedTime(task.workingTime);
    }
    return () => clearInterval(timer);
  }, [task.isActive, task.startTime, task.workingTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${hours}h ${minutes}m ${sec}s`;
  };

  return (
      <Card
          ref={drag}
          sx={{
            marginBottom: 2,
            width: '100%',
            maxWidth: 350,
            margin: '8px auto',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
          }}
      >
        <CardContent sx={{ paddingBottom: '8px' }}>
          <Typography variant='body2' color='textSecondary'>
            {selectPriority[task.priority]}
          </Typography>
          <Typography
              onDoubleClick={() => openModal(task)}
              sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              variant='h6'
          >
            {task.title}
          </Typography>
          {task.description && (
              <Typography variant='body2'>
                Описание: {task.description.replace(/<[^>]+>/g, '')}
              </Typography>
          )}
          {task.deadLineDate && (
              <Typography variant='body2' sx={{ marginTop: 1, color: 'gray' }}>
                Крайний срок: {task.deadLineDate}
              </Typography>
          )}
          <Typography variant='body2' sx={{ marginTop: 1, color: 'gray' }}>
            Дата создания: {task.createdAt}
          </Typography>
        </CardContent>
        <CardActions
            sx={{
              justifyContent: 'space-between',
              padding: '8px 16px',
              flexWrap: 'wrap',
              gap: 1,
            }}
        >
          <ButtonGroup size='small'>
            <Button onClick={() => toggleTaskCompletion(task.id)}>
              <DoneIcon />
            </Button>
            <Button onClick={() => openModal(task)}>
              <CreateIcon />
            </Button>
            <Button onClick={() => deleteTask(task.id)}>
              <DeleteIcon />
            </Button>
            <Button onClick={() => handleStart(task.id)}>
              {task.isActive ? formatTime(elapsedTime) : <TimerIcon />}
            </Button>
          </ButtonGroup>
          <ButtonGroup size='small'>
            <Button onClick={() => setShowSubtask(!showSubtask)}>
              <FormatListBulletedIcon />
            </Button>
            <Button onClick={() => setShowComment(!showComment)}>
              <CommentIcon />
            </Button>
          </ButtonGroup>
          {showSubtask && (
              <Box sx={{ padding: '8px', borderTop: '1px solid #ddd' }}>
                <Typography variant='subtitle2'>Подзадачи:</Typography>
                <List>
                  {task.subTasks.map((subtask) => (
                      <ListItem
                          key={subtask.id}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Checkbox
                            checked={subtask.completed}
                            onChange={() => handleToggleSubtaskCompletion(subtask.id)}
                        />
                        <Typography>{subtask.title}</Typography>
                        <Button
                            size='small'
                            color='error'
                            onClick={() => handleDeleteSubtask(subtask.id)}
                        >
                          Удалить
                        </Button>
                      </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                  <input
                      type='text'
                      placeholder='Добавить подзадачу'
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                  />
                  <Button
                      onClick={handleAddSubtask}
                      size='small'
                      variant='contained'
                  >
                    Добавить
                  </Button>
                </Box>
              </Box>
          )}
          {showComment && (
              <Box sx={{ padding: '6px', borderTop: '1px solid #ddd' }}>
                <Typography variant='subtitle2'>Комментарии:</Typography>
                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                  <input
                      type='text'
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder='Введите комментарий'
                      style={{
                        flex: 1,
                        padding: '6px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                  />
                  <Button
                      onClick={handleAddComment}
                      size='small'
                      variant='contained'
                  >
                    Добавить комментарий
                  </Button>
                </Box>
                <Box>{renderComments(task.comments)}</Box>
              </Box>
          )}
        </CardActions>
      </Card>
  );
};

export default Task;
