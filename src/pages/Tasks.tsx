import { useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Welcome from '../components/Welcome';
import { useAuth } from '../features/auth/Authenticator';
import { useTasks } from '../hooks/useTasks';
import {
  addTask,
  deleteTask,
  toggleTaskStatus,
  updateTask,
} from '../services/tasks';
import type { FirestoreTask } from '../services/tasks';
import EmailSummaryButton from '../components/EmailSummaryButton';

function getStatusLabel(status: boolean): string {
  if (!status) {
    return 'Pendiente';
  }

  return 'Completada';
}

function Tasks() {
  const { user } = useAuth();

  const uid = user?.uid ?? '';
  const { tasks, setTasks, loading, error } = useTasks(uid);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const nextTask = tasks.find((task) => !task.completed);

  useEffect(() => {
    document.title = `Tareas: ${tasks.length}`;
  }, [tasks]);

  const handleAddTask = async (
    title: string,
    description: string,
    dueDate: string,
  ): Promise<void> => {
    if (!user) {
      return;
    }

    const taskId = await addTask({
      title,
      description,
      dueDate,
      userId: user.uid,
    });

    const newTask: FirestoreTask = {
      id: taskId,
      title,
      description,
      dueDate,
      completed: false,
      userId: user.uid,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleTask = async (id: string): Promise<void> => {
    const targetTask = tasks.find((task) => task.id === id);

    if (!targetTask) {
      return;
    }

    await toggleTaskStatus(id, targetTask.completed);

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }

        return task;
      }),
    );
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    await deleteTask(id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEditTask = async (
    id: string,
    title: string,
    description: string,
    dueDate: string,
  ): Promise<void> => {
    await updateTask(id, { title, description, dueDate });

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title,
            description,
            dueDate,
          };
        }

        return task;
      }),
    );
  };

  return (
    <main className="tasks-page">
      <Welcome
        title="TaskAura"
        message="Gestiona tus pendientes, organiza fechas clave y comparte un resumen por correo cuando lo necesites."
      />

      <section className="task-overview" aria-label="Resumen de tareas">
        <article className="metric-card">
          <span>Total</span>
          <strong>{tasks.length}</strong>
          <p>Tareas registradas</p>
        </article>
        <article className="metric-card metric-card--accent">
          <span>Pendientes</span>
          <strong>{pendingTasks}</strong>
          <p>Por completar</p>
        </article>
        <article className="metric-card">
          <span>Completadas</span>
          <strong>{completedTasks}</strong>
          <p>Progreso logrado</p>
        </article>
        <article className="metric-card metric-card--wide">
          <span>Siguiente foco</span>
          <strong>{nextTask?.title ?? 'Sin pendientes'}</strong>
          <p>{nextTask?.dueDate ? `Fecha limite: ${nextTask.dueDate}` : 'Disfruta el espacio libre.'}</p>
        </article>
      </section>

      {user?.email && (
        <EmailSummaryButton tasks={tasks} userEmail={user.email} />
      )}

      <TaskForm onAddTask={handleAddTask} />

      {loading && <p>Cargando tareas...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={tasks}
          getStatusLabel={getStatusLabel}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      )}
    </main>
  );
}

export default Tasks;


