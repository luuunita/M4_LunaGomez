function About() {
  return (
    <section className="hero-panel">
      <div>
        <p className="auth-eyebrow">Sobre la aplicacion</p>
        <h1>Acerca de TaskAura</h1>
        <p>
          TaskAura es una SPA desarrollada con React, TypeScript, Firebase,
          Firestore, Vercel Functions y AWS SES para gestionar tareas, fechas
          limite y resumenes por correo.
        </p>
      </div>

      <div className="hero-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

export default About;
