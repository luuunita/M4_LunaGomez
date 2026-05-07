import type { FirestoreTask } from '../services/tasks';
import Card from './Card';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: FirestoreTask[];
  getStatusLabel: (status: boolean) => string;
  onToggleTask: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onEditTask: (
    id: string,
    title: string,
    description: string,
    dueDate: string,
  ) => Promise<void>;
}

function TaskList({
  tasks,
  getStatusLabel,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskListProps) {
  return (
    <Card title="Tareas del día">
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            statusLabel={getStatusLabel(task.completed)}
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


