import { useState } from 'react';
import type { FirestoreTask } from '../services/tasks';

interface TaskItemProps {
  task: FirestoreTask;
  statusLabel: string;
  onToggleTask: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onEditTask: (
    id: string,
    title: string,
    description: string,
  ) => Promise<void>;
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

  const handleSaveEdit = async (): Promise<void> => {
    if (editedTitle === '' || editedDescription === '') {
      return;
    }

    await onEditTask(task.id, editedTitle, editedDescription);
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

        <button type="button" onClick={() => void handleSaveEdit()}>
          Guardar cambios
        </button>
        <button type="button" onClick={handleCancelEdit}>
          Cancelar
        </button>
      </li>
    );
  }

  return (
    <li>
      <h3>{task.title}</h3>
      <p>Estado: {statusLabel}</p>
      {task.description && <p>Descripcion: {task.description}</p>}

      <button type="button" onClick={() => void onToggleTask(task.id)}>
        {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
      </button>

      <button type="button" onClick={handleStartEdit}>
        Editar tarea
      </button>

      <button type="button" onClick={() => void onDeleteTask(task.id)}>
        Eliminar tarea
      </button>
    </li>
  );
}

export default TaskItem;


