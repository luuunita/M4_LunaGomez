interface WelcomeProps {
  title: string;
  message: string;
}

function Welcome({ title, message }: WelcomeProps) {
  return (
    <section className="hero-panel">
      <h1>{title}</h1>
      <p>{message}</p>
    </section>
  );
}

export default Welcome;
