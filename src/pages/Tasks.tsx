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

  useEffect(() => {
    document.title = `Tareas: ${tasks.length}`;
  }, [tasks]);

  const handleAddTask = async (title: string, description: string): Promise<void> => {
    if (!user) {
      return;
    }

    const taskId = await addTask({
      title,
      description,
      userId: user.uid,
    });

    const newTask: FirestoreTask = {
      id: taskId,
      title,
      description,
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
  ): Promise<void> => {
    await updateTask(id, { title, description });

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title,
            description,
          };
        }

        return task;
      }),
    );
  };

  return (
    <main>
      <Welcome
        title="Panel de tareas"
        message="Gestiona las tareas diarias de tu equipo en un solo lugar"
      />

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

