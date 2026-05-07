import { describe, expect, it } from 'vitest';
import { buildTodoSummary, formatDueDate } from '../utils/taskSummary';
import type { FirestoreTask } from '../services/tasks';

describe('taskSummary utils', () => {
  it('formatea fechas correctamente', () => {
    expect(formatDueDate('2026-05-20')).toMatch(/20/);
    expect(formatDueDate(undefined)).toBe('Sin fecha');
  });

  it('genera un resumen con pendientes, completadas y próximas tareas', () => {
    const tasks: FirestoreTask[] = [
      {
        id: '1',
        title: 'Estudiar React',
        description: 'Repasar componentes',
        dueDate: '2026-05-20',
        completed: false,
        userId: 'user-1',
      },
      {
        id: '2',
        title: 'Enviar entrega',
        description: 'Subir proyecto',
        dueDate: '2026-05-21',
        completed: true,
        userId: 'user-1',
      },
    ];

    const summary = buildTodoSummary(tasks);

    expect(summary).toContain('Pendientes: 1');
    expect(summary).toContain('Completadas: 1');
    expect(summary).toContain('Estudiar React');
  });
});
