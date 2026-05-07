import type { FirestoreTask } from '../services/tasks';

export function formatDueDate(date: string | undefined): string {
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

export function buildTodoSummary(tasks: FirestoreTask[]): string {
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
