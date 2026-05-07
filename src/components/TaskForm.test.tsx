import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  it('muestra errores si se envia vacio', async () => {
    const onAddTask = vi.fn();

    render(<TaskForm onAddTask={onAddTask} />);

    await userEvent.click(
      screen.getByRole('button', { name: /agregar tarea/i }),
    );

    expect(screen.getByText(/ingresa un título/i)).toBeInTheDocument();
    expect(screen.getByText(/ingresa una descripción/i)).toBeInTheDocument();
    expect(screen.getByText(/selecciona una fecha/i)).toBeInTheDocument();
    expect(onAddTask).not.toHaveBeenCalled();
  });

  it('envia el formulario con datos validos', async () => {
    const onAddTask = vi.fn();

    render(<TaskForm onAddTask={onAddTask} />);

    await userEvent.type(
      screen.getByRole('textbox', { name: /título/i }),
      'Estudiar testing',
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: /descripción/i }),
      'Repasar Vitest y RTL',
    );

    await userEvent.type(
      screen.getByLabelText(/fecha límite/i),
      '2026-05-20',
    );

    await userEvent.click(
      screen.getByRole('button', { name: /agregar tarea/i }),
    );

    await waitFor(() => {
      expect(onAddTask).toHaveBeenCalledWith(
        'Estudiar testing',
        'Repasar Vitest y RTL',
        '2026-05-20',
      );
    });
  });
});

