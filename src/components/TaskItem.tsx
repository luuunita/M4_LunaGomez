import { useState } from 'react';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  statusLabel: string;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, title: string, description: string) => void;
}

function TaskItem({
  task,
  statusLabel,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description ?? '');

  const handleSaveEdit = (): void => {
    if (editedTitle === '' || editedDescription === '') {
      return;
    }

    onEditTask(task.id, editedTitle, editedDescription);
    setIsEditing(false);
  };

  const handleStartEdit = (): void => {
    setEditedTitle(task.title);
    setEditedDescription(task.description ?? '');
    setIsEditing(true);
  };

  const handleCancelEdit = (): void => {
    setEditedTitle(task.title);
    setEditedDescription(task.description ?? '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li>
        <input
          type="text"
          value={editedTitle}
          onChange={(event) => setEditedTitle(event.target.value)}
          placeholder="Nuevo titulo"
        />

        <input
          type="text"
          value={editedDescription}
          onChange={(event) => setEditedDescription(event.target.value)}
          placeholder="Nueva descripcion"
        />

        <button onClick={handleSaveEdit}>Guardar cambios</button>
        <button onClick={handleCancelEdit}>Cancelar</button>
      </li>
    );
  }

  return (
    <li>
      <h3>{task.title}</h3>
      <p>Estado: {statusLabel}</p>
      {task.description && <p>Descripcion: {task.description}</p>}

      <button onClick={() => onToggleTask(task.id)}>
        {task.status === 'pending'
          ? 'Marcar como completada'
          : 'Marcar como pendiente'}
      </button>

      <button onClick={handleStartEdit}>Editar tarea</button>

      <button onClick={() => onDeleteTask(task.id)}>
        Eliminar tarea
      </button>
    </li>
  );
}

export default TaskItem;


