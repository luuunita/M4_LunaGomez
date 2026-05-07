import { useState } from 'react';
import type { FirestoreTask } from '../services/tasks';

interface EmailSummaryButtonProps {
  tasks: FirestoreTask[];
  userEmail: string;
}

function buildTodoSummary(tasks: FirestoreTask[]): string {
  const pending = tasks.filter((task) => !task.completed).length;
  const completed = tasks.filter((task) => task.completed).length;

  return `Pendientes: ${pending}\nCompletadas: ${completed}`;
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
        setErrorMessage(data?.message || 'Ocurrio un error al enviar el email.');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('No se pudo conectar con el servidor.');
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleSend()}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mi resumen'}
      </button>

      {status === 'success' && (
        <span> ¡Email enviado!</span>
      )}

      {status === 'error' && (
        <span>{errorMessage}</span>
      )}
    </div>
  );
}

export default EmailSummaryButton;
