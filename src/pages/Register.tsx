import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/Authenticator';
import { getAuthErrorMessage } from '../features/auth/authErrors';

interface RegisterFormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const initialRegisterForm: RegisterFormState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 6,
    number: /\d/.test(password),
    letter: /[a-zA-Z]/.test(password),
  };
}

function validateRegister(form: RegisterFormState): FieldErrors<RegisterFormState> {
  const errors: FieldErrors<RegisterFormState> = {};
  const passwordChecks = getPasswordChecks(form.password);

  if (!form.fullName.trim()) {
    errors.fullName = 'Ingresa tu nombre.';
  } else if (form.fullName.trim().length < 3) {
    errors.fullName = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!form.email.trim() || !form.email.includes('@') || !form.email.includes('.')) {
    errors.email = 'Ingresa un email valido.';
  }

  if (!form.password.trim()) {
    errors.password = 'Crea una contrasena.';
  } else if (!passwordChecks.length || !passwordChecks.letter || !passwordChecks.number) {
    errors.password = 'Usa al menos 6 caracteres, una letra y un numero.';
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Las contrasenas no coinciden.';
  }

  if (!form.acceptedTerms) {
    errors.acceptedTerms = 'Debes aceptar las condiciones para continuar.';
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [errors, setErrors] = useState<FieldErrors<RegisterFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const passwordChecks = getPasswordChecks(form.password);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { checked, name, type, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validation = validateRegister(form);
    setErrors(validation);
    setSubmitError(null);

    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(form.email, form.password);
      setForm(initialRegisterForm);
      navigate('/tasks', { replace: true });
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page register-page">
      <div className="register-shell">
        <aside className="register-preview" aria-label="Beneficios de TaskAura">
          <p className="auth-eyebrow">Nuevo espacio</p>
          <h1>Crea tu centro de enfoque</h1>
          <p>
            Organiza tareas, fechas y recordatorios en una experiencia pensada
            para mantener claridad desde el primer dia.
          </p>

          <div className="register-benefits">
            <article>
              <span>01</span>
              <strong>Tablero personal</strong>
              <p>Guarda tus pendientes y revisa tu progreso diario.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Resumen por correo</strong>
              <p>Recibe una vista rapida de tus tareas importantes.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Acceso seguro</strong>
              <p>Tu cuenta queda protegida con autenticacion de Firebase.</p>
            </article>
          </div>
        </aside>

        <div className="auth-card register-card">
          <div className="auth-copy">
            <p className="auth-eyebrow">Registro guiado</p>
            <h2>Empieza con TaskAura</h2>
            <p className="auth-subtitle">
              Completa tu informacion para activar tu espacio de tareas.
            </p>
          </div>

          <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="fullName">Nombre</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Luna Gomez"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'register-name-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <p className="field-message error-text" id="register-name-error">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email">Correo electronico</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alguien@email.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="field-message error-text" id="register-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">Contrasena</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Crea una contrasena segura"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'register-password-error' : 'password-checks'}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="field-message error-text" id="register-password-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirmar contrasena</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contrasena"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="field-message error-text" id="register-confirm-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <ul className="password-checks" id="password-checks" aria-label="Requisitos de contrasena">
              <li className={passwordChecks.length ? 'is-valid' : ''}>6 caracteres minimo</li>
              <li className={passwordChecks.letter ? 'is-valid' : ''}>Incluye una letra</li>
              <li className={passwordChecks.number ? 'is-valid' : ''}>Incluye un numero</li>
            </ul>

            <label className="terms-row" htmlFor="acceptedTerms">
              <input
                id="acceptedTerms"
                name="acceptedTerms"
                type="checkbox"
                checked={form.acceptedTerms}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span>Acepto usar TaskAura para organizar mis tareas y recibir comunicaciones relacionadas con mi cuenta.</span>
            </label>
            {errors.acceptedTerms && (
              <p className="field-message error-text">{errors.acceptedTerms}</p>
            )}

            {submitError && (
              <div className="status-banner error-banner" role="alert">
                {submitError}
              </div>
            )}

            <button className="auth-primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Crear mi espacio'}
            </button>

            <p className="auth-footer">
              Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
