import { ReactNode } from 'react';

interface InfoPanelProps {
  title: string;
  children: ReactNode;
}

export default function InfoPanel({ title, children }: InfoPanelProps) {
  return (
    <div className="absolute top-20 left-6 z-10 max-w-sm pointer-events-none">
      <div className="pointer-events-auto bg-void/80 backdrop-blur-md border border-nebula rounded-lg p-5">
        <h2 className="font-mono text-sm font-bold tracking-widest uppercase text-ecliptic mb-3">
          {title}
        </h2>
        <div className="text-sm text-star-dim leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}
