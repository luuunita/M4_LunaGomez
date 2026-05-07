import { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Welcome from '../components/Welcome';
import type { Task } from '../types/task';

function getStatusLabel(status: Task['status']): string {
  if (status === 'pending') {
    return 'Pendiente';
  }

  return 'Completada';
}

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = window.localStorage.getItem('tasks');

    if (savedTasks) {
      return JSON.parse(savedTasks) as Task[];
    }

    return [
      {
        id: 1,
        title: 'Revisar correos de clientes',
        description: 'Responder mensajes pendientes antes del mediodia',
        status: 'pending',
      },
      {
        id: 2,
        title: 'Actualizar reporte diario',
        status: 'done',
      },
    ];
  });

  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    document.title = `Tareas: ${tasks.length}`;
  }, [tasks]);

  useEffect(() => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
    setSaveMessage('Cambios guardados localmente');

    const timeoutId = window.setTimeout(() => {
      setSaveMessage('');
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [tasks]);

  const handleAddTask = (title: string, description: string): void => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      status: 'pending',
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleToggleTask = (id: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            status: task.status === 'pending' ? 'done' : 'pending',
          };
        }

        return task;
      }),
    );
  };

  const handleDeleteTask = (id: number): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (
    id: number,
    title: string,
    description: string,
  ): void => {
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

      {saveMessage && <p>{saveMessage}</p>}

      <TaskForm onAddTask={handleAddTask} />

      <TaskList
        tasks={tasks}
        getStatusLabel={getStatusLabel}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />
    </main>
  );
}

export default Tasks;
