import Icon from './global/Icon';
import UserAvatar from './global/UserAvatar';

export const displayName = 'Testimonials Section';
export const shortDescription = 'Three testimonial cards from real team members';

const testimonials = [
  {
    quote: 'SyncSpace replaced 4 tools in our stack. Our designers and engineers finally feel like they\'re in the same room.',
    name: 'Priya Sharma', role: 'Head of Product, Raycast',
    gender: 'female', heritage: 'South Asian', ageGroup: '25-35', index: 5,
  },
  {
    quote: 'The code editor is legitimately great — not a toy. And being able to sketch a flow on the whiteboard next to the code is magic.',
    name: 'James Carter', role: 'Engineering Lead, Pitch',
    gender: 'male', heritage: 'European', ageGroup: '35-50', index: 6,
  },
  {
    quote: 'Sync latency is barely noticeable. We have a globally distributed team and it just works. Nightly standups are now half the time.',
    name: 'Yuki Tanaka', role: 'CTO, Loom',
    gender: 'female', heritage: 'East Asian', ageGroup: '25-35', index: 7,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full px-16 py-24">
      <div className="flex flex-col items-center mb-16">
        <span className="text-xs font-body font-medium tracking-widest text-secondary uppercase mb-4">{'Testimonials'}</span>
        <h2 className="font-headings font-bold text-4xl text-foreground text-center" style={{ letterSpacing: '-0.8px' }}>
          {'Teams who live in SyncSpace.'}
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {testimonials.map((t2, i) => (
          <div
            key={i}
            className="flex flex-col gap-6 p-8 rounded-lg"
            style={{
              background: 'rgba(15,12,31,0.55)',
              border: '1px solid rgba(168,85,247,0.14)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 30px rgba(0,0,0,0.25)',
            }}
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {[0,1,2,3,4].map(s => (
                <Icon key={s} i="star" size={14} style={{ color: '#a855f7', filter: 'drop-shadow(0 0 3px #a855f7)' }} />
              ))}
            </div>
            <p className="text-base text-surface-foreground font-body leading-relaxed flex-1">"{t2.quote}"</p>
            <div className="flex items-center gap-3">
              <UserAvatar
                gender={t2.gender}
                heritage={t2.heritage}
                ageGroup={t2.ageGroup}
                index={t2.index}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-body font-semibold text-foreground">{t2.name}</p>
                <p className="text-xs text-muted-foreground font-body">{t2.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
