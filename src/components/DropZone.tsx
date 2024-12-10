import React from 'react';
import { useDrop } from 'react-dnd';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

interface DropZoneProps {
  status: string;
  children: React.ReactNode;
  updateTaskStatus: (id: number, status: string) => void;
  className?: string;
}

interface DraggedItem {
  id: number;
  status: string;
}

const DropZone = ({
  status,
  children,
  updateTaskStatus,
  className,
}: DropZoneProps): JSX.Element => {
  const [, drop] = useDrop<DraggedItem>({
    accept: 'TASK',
    drop: (draggedItem) => {
      if (draggedItem.status !== status) {
        updateTaskStatus(draggedItem.id, status);
      }
    },
  });

  const color = (status: string): string => {
    switch (status) {
      case 'Queue':
        return 'lightblue';
      case 'Development':
        return 'lightgreen';
      case 'Done':
        return 'lightcoral';
      default:
        return 'white';
    }
  };

  return (
    <Box
      ref={drop as React.Ref<HTMLDivElement>}
      sx={{
        padding: 2,
        border: '1px solid grey',
        borderRadius: 2,
        backgroundColor: color(status),
        width: '50vh',
        minHeight: '250px',
      }}
    >
      <Typography variant='h6' align='center' gutterBottom>
        {status}
      </Typography>
      <List>
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child) ? (
            <ListItem key={index} disablePadding>
              {child}
            </ListItem>
          ) : null
        )}
      </List>
    </Box>
  );
};

export default DropZone;
