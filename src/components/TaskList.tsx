import type { Task } from '../types/task';
import Card from './Card';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  getStatusLabel: (status: Task['status']) => string;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, title: string, description: string) => void;
}

function TaskList({
  tasks,
  getStatusLabel,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  return (
    <Card title="Tareas del dia">
      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            statusLabel={getStatusLabel(task.status)}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </ul>
    </Card>
  );
}

export default TaskList;

