import { useState } from 'react';
import type { FirestoreTask } from '../services/tasks';

interface EmailSummaryButtonProps {
  tasks: FirestoreTask[];
  userEmail: string;
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

function buildTodoSummary(tasks: FirestoreTask[]): string {
  const pending = tasks.filter((task) => !task.completed);
  const completed = tasks.filter((task) => task.completed);

  const nextTasks = pending
    .slice(0, 5)
    .map(
      (task, index) =>
        `${index + 1}. ${task.title} — ${formatDueDate(task.dueDate)}`,
    )
    .join('\n');

  return [
    'Resumen de tareas',
    '',
    `Pendientes: ${pending.length}`,
    `Completadas: ${completed.length}`,
    '',
    'Próximas tareas:',
    nextTasks || 'No hay tareas pendientes por ahora.',
  ].join('\n');
}

function EmailSummaryButton({
  tasks,
  userEmail,
}: EmailSummaryButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSend(): Promise<void> {
    setStatus('loading');
    setErrorMessage('');

    const summary = buildTodoSummary(tasks);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userEmail,
          summary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(data?.message || 'Ocurrió un error al enviar el email.');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('No se pudo conectar con el servidor.');
    }
  }

  return (
    <div className="summary-bar">
      <button
        type="button"
        onClick={() => void handleSend()}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mi resumen'}
      </button>

      {status === 'success' && (
        <span className="success-text">Email enviado.</span>
      )}

      {status === 'error' && (
        <span className="error-text">{errorMessage}</span>
      )}
    </div>
  );
}

export default EmailSummaryButton;


