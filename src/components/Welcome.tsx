interface WelcomeProps {
  title: string;
  message: string;
}

function Welcome({ title, message }: WelcomeProps) {
  return (
    <section className="hero-panel">
      <div>
        <p className="auth-eyebrow">Tu espacio de enfoque</p>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      <div className="hero-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

export default Welcome;
