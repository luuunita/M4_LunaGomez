import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EmailSummaryButton from '../components/EmailSummaryButton';
import type { FirestoreTask } from '../services/tasks';

const tasks: FirestoreTask[] = [
  {
    id: '1',
    title: 'Preparar entrega',
    description: 'Revisar README',
    dueDate: '2026-05-20',
    completed: false,
    userId: 'user-1',
  },
];

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('EmailSummaryButton', () => {
  it('envía el resumen y muestra éxito', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, messageId: 'abc123' }),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <EmailSummaryButton
        tasks={tasks}
        userEmail="alguien@email.com"
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /enviar mi resumen/i }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/send-email',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText(/email enviado/i)).toBeInTheDocument();
    });
  });

  it('muestra error si el servidor responde mal', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Failed to send email' }),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <EmailSummaryButton
        tasks={tasks}
        userEmail="alguien@email.com"
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /enviar mi resumen/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to send email/i)).toBeInTheDocument();
    });
  });
});
