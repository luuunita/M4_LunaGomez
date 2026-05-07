import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Card from './Card';

interface TaskFormProps {
  onAddTask: (title: string, description: string) => void;
}

interface TaskFormState {
  title: string;
  description: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const initialTaskForm: TaskFormState = {
  title: '',
  description: '',
};

function validateTaskForm(form: TaskFormState): FieldErrors<TaskFormState> {
  const errors: FieldErrors<TaskFormState> = {};

  if (!form.title.trim()) {
    errors.title = 'Ingresa un titulo.';
  } else if (form.title.trim().length < 3) {
    errors.title = 'El titulo debe tener al menos 3 caracteres.';
  }

  if (!form.description.trim()) {
    errors.description = 'Ingresa una descripcion.';
  } else if (form.description.length > 200) {
    errors.description = 'La descripcion no puede superar 200 caracteres.';
  }

  return errors;
}

function TaskForm({ onAddTask }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormState>(initialTaskForm);
  const [errors, setErrors] = useState<FieldErrors<TaskFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validation = validateTaskForm(form);
    setErrors(validation);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      await new Promise((resolve) => {
        window.setTimeout(resolve, 800);
      });

      onAddTask(form.title, form.description);
      setForm(initialTaskForm);
      setSubmitSuccess(true);
    } catch {
      setSubmitError('No se pudo guardar la tarea. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card title="Nueva tarea">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">Titulo</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Titulo de la tarea"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p id="title-error">{errors.title}</p>
        )}

        <label htmlFor="description">Descripcion</label>
        <input
          id="description"
          name="description"
          type="text"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripcion de la tarea"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p id="description-error">{errors.description}</p>
        )}

        {submitError && (
          <div role="alert">{submitError}</div>
        )}

        {submitSuccess && (
          <div role="status">Tarea guardada con exito.</div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Agregar tarea'}
        </button>
      </form>
    </Card>
  );
}

export default TaskForm;

