import { Badge, type BadgeTone, Button, Input } from "@nos/seixu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seixu · Nós Console",
};

const colors = [
  ["bg", "bg-bg"],
  ["surface", "bg-surface"],
  ["surface-2", "bg-surface-2"],
  ["surface-3", "bg-surface-3"],
  ["border", "bg-border"],
  ["text", "bg-text"],
  ["text-muted", "bg-text-muted"],
  ["accent-blue", "bg-accent-blue"],
  ["accent-purple", "bg-accent-purple"],
  ["accent-brown", "bg-accent-brown"],
  ["success", "bg-success"],
  ["danger", "bg-danger"],
] as const;

const typeScale = [
  "text-3xl",
  "text-2xl",
  "text-xl",
  "text-lg",
  "text-base",
  "text-sm",
  "text-xs",
] as const;

const radii = ["rounded-sm", "rounded-md", "rounded-lg"] as const;

const tones: BadgeTone[] = [
  "neutral",
  "blue",
  "purple",
  "brown",
  "green",
  "red",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function SeixuPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Seixu</h1>
        <p className="text-text-muted">
          Tokens e componentes base do design system da Nós.
        </p>
      </header>

      <Section title="Cores">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colors.map(([name, swatch]) => (
            <li key={name} className="flex flex-col gap-2">
              <span
                className={`h-12 rounded-md border border-border ${swatch}`}
              />
              <code className="font-mono text-xs text-text-muted">{name}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tipografia">
        <ul className="flex flex-col gap-2">
          {typeScale.map((size) => (
            <li key={size} className="flex items-baseline gap-4">
              <code className="w-24 shrink-0 font-mono text-xs text-text-muted">
                {size}
              </code>
              <span className={size}>
                Nós Tecnologia Desenvolvimento Criativo
              </span>
            </li>
          ))}
        </ul>
        <p className="font-mono text-sm">
          JetBrains Mono · R$ 12.345,67 · 2026-11-11
        </p>
      </Section>

      <Section title="Raios">
        <div className="flex gap-4">
          {radii.map((radius) => (
            <div key={radius} className="flex flex-col items-center gap-2">
              <span
                className={`size-16 border border-border bg-surface-3 ${radius}`}
              />
              <code className="font-mono text-xs text-text-muted">
                {radius}
              </code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Salvar</Button>
          <Button variant="secondary">Cancelar</Button>
          <Button variant="ghost">Ver detalhes</Button>
          <Button variant="danger">Excluir</Button>
          <Button size="sm">Pequeno</Button>
          <Button disabled>Desabilitado</Button>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          {tones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Input">
        <div className="grid max-w-md gap-4">
          <Input label="Nome do projeto" placeholder="Ex.: Portal Aurora" />
          <Input
            label="E-mail do cliente"
            type="email"
            placeholder="cliente@exemplo.com"
          />
          <Input label="Desabilitado" disabled defaultValue="Somente leitura" />
        </div>
      </Section>
    </main>
  );
}
