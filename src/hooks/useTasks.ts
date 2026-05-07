import { useEffect, useState } from 'react';
import { getTasksByUser } from '../services/tasks';
import type { FirestoreTask } from '../services/tasks';

export function useTasks(uid: string) {
  const [tasks, setTasks] = useState<FirestoreTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTasksByUser(uid);

        if (!cancelled) {
          setTasks(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'No se pudieron obtener las tareas.',
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { tasks, setTasks, loading, error };
}
