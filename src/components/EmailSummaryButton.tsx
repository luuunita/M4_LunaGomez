import { useState } from 'react';
import type { FirestoreTask } from '../services/tasks';
import { buildTodoSummary } from '../utils/taskSummary';

interface EmailSummaryButtonProps {
  tasks: FirestoreTask[];
  userEmail: string;
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



