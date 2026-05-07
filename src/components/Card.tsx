import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <section className="surface-card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default Card;

