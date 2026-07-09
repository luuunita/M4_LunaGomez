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
    dueDate: string,
  ) => Promise<void>;
}

function formatDueDate(date: string | undefined): string {
  if (!date) {
    return 'Sin fecha';
  }

  const parsedDate = new Date(`${date}T00:00:00`);
  return parsedDate.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
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
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate ?? '');

  const handleSaveEdit = async (): Promise<void> => {
    if (editedTitle === '' || editedDescription === '' || editedDueDate === '') {
      return;
    }

    await onEditTask(task.id, editedTitle, editedDescription, editedDueDate);
    setIsEditing(false);
  };

  const handleStartEdit = (): void => {
    setEditedTitle(task.title);
    setEditedDescription(task.description ?? '');
    setEditedDueDate(task.dueDate ?? '');
    setIsEditing(true);
  };

  const handleCancelEdit = (): void => {
    setEditedTitle(task.title);
    setEditedDescription(task.description ?? '');
    setEditedDueDate(task.dueDate ?? '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="task-item task-item-editing">
        <div className="edit-header">
          <span>Editando tarea</span>
          <strong>{task.title}</strong>
        </div>

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

        <input
          type="date"
          value={editedDueDate}
          onChange={(event) => setEditedDueDate(event.target.value)}
        />

        <div className="task-actions">
          <button type="button" onClick={() => void handleSaveEdit()}>
            Guardar cambios
          </button>
          <button type="button" onClick={handleCancelEdit}>
            Cancelar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--done' : ''}`}>
      <div className="task-item-head">
        <div>
          <p className="task-kicker">Tarea</p>
          <h3>{task.title}</h3>
        </div>
        <span className={`task-status ${task.completed ? 'done' : 'pending'}`}>
          {statusLabel}
        </span>
      </div>

      <div className="task-meta">
        {task.description && (
          <p>
            <span>Descripcion</span>
            {task.description}
          </p>
        )}

        <p>
          <span>Fecha limite</span>
          {formatDueDate(task.dueDate)}
        </p>
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => void onToggleTask(task.id)}>
          {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        </button>

        <button type="button" onClick={handleStartEdit}>
          Editar tarea
        </button>

        <button type="button" onClick={() => void onDeleteTask(task.id)}>
          Eliminar tarea
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
