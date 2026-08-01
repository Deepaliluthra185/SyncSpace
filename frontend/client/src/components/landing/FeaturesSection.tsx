import Icon from './global/Icon';

export const displayName = 'Features Section';
export const shortDescription = 'Three-column feature highlights for SyncSpace landing page';

const features = [
  {
    icon: 'pen-tool',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    glow: 'rgba(168,85,247,0.4)',
    title: 'Infinite Canvas',
    desc: 'Sketch flows, wireframes, and diagrams on a real-time collaborative whiteboard. Everyone draws together — no lag, no conflicts.',
  },
  {
    icon: 'code-2',
    gradient: 'linear-gradient(135deg, #06b6d4, #a855f7)',
    glow: 'rgba(6,182,212,0.35)',
    title: 'Live Code Editor',
    desc: 'Write and review code side-by-side in a VS Code-grade editor with syntax highlighting, multi-cursor support, and presence awareness.',
  },
  {
    icon: 'users',
    gradient: 'linear-gradient(135deg, #ec4899, #f97316)',
    glow: 'rgba(236,72,153,0.35)',
    title: 'Multiplayer Presence',
    desc: 'See where every teammate is in real time. Named cursors, live selections, and inline chat keep context tight without extra meetings.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full px-16 py-24">
      {/* Section label */}
      <div className="flex flex-col items-center mb-16">
        <span
          className="text-xs font-body font-medium tracking-widest text-primary uppercase mb-4"
        >
          {'Why SyncSpace'}
        </span>
        <h2 className="font-headings font-bold text-4xl text-foreground text-center" style={{ letterSpacing: '-0.8px' }}>
          {'Every tool your team needs,'}<br />{'in one shared space.'}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="relative p-8 rounded-lg flex flex-col gap-4"
            style={{
              background: 'rgba(15,12,31,0.6)',
              border: '1px solid rgba(168,85,247,0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Top glow accent */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
              style={{ background: f.gradient }}
            />
            <div
              className="w-11 h-11 rounded-md flex items-center justify-center"
              style={{ background: f.gradient, boxShadow: `0 0 20px ${f.glow}` }}
            >
              <Icon i={f.icon} size={20} className="text-white" />
            </div>
            <h3 className="font-headings font-semibold text-xl text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
