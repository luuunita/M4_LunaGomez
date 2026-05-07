import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Card from './Card';

interface TaskFormProps {
  onAddTask: (title: string, description: string, dueDate: string) => void;
}

interface TaskFormState {
  title: string;
  description: string;
  dueDate: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const initialTaskForm: TaskFormState = {
  title: '',
  description: '',
  dueDate: '',
};

function validateTaskForm(form: TaskFormState): FieldErrors<TaskFormState> {
  const errors: FieldErrors<TaskFormState> = {};

  if (!form.title.trim()) {
    errors.title = 'Ingresa un título.';
  } else if (form.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres.';
  }

  if (!form.description.trim()) {
    errors.description = 'Ingresa una descripción.';
  } else if (form.description.length > 200) {
    errors.description = 'La descripción no puede superar 200 caracteres.';
  }

  if (!form.dueDate) {
    errors.dueDate = 'Selecciona una fecha.';
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

      onAddTask(form.title, form.description, form.dueDate);
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
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Título de la tarea"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="field-message error-text" id="title-error">
            {errors.title}
          </p>
        )}

        <label htmlFor="description">Descripción</label>
        <input
          id="description"
          name="description"
          type="text"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe brevemente la tarea"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="field-message error-text" id="description-error">
            {errors.description}
          </p>
        )}

        <label htmlFor="dueDate">Fecha límite</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          aria-invalid={Boolean(errors.dueDate)}
          aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.dueDate && (
          <p className="field-message error-text" id="dueDate-error">
            {errors.dueDate}
          </p>
        )}

        {submitError && (
          <div className="status-banner error-banner" role="alert">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="status-banner success-banner" role="status">
            Tarea guardada con éxito.
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Agregar tarea'}
        </button>
      </form>
    </Card>
  );
}

export default TaskForm;



