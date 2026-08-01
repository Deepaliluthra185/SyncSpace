export const displayName = 'Social Proof Bar';
export const shortDescription = 'Logos and trust stats strip';

const stats = [
  { value: '12,000+', label: 'Teams' },
  { value: '98%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'Sync latency' },
  { value: '4.9★', label: 'on Product Hunt' },
];

export default function SocialProofBar() {
  return (
    <section
      className="w-full py-14 px-16 flex flex-col items-center gap-10"
      style={{ borderTop: '1px solid rgba(168,85,247,0.1)', borderBottom: '1px solid rgba(168,85,247,0.1)' }}
    >
      <p className="text-xs uppercase font-body tracking-widest text-muted-foreground">{'Loved by teams at'}</p>
      <div className="flex items-center justify-center gap-16 opacity-60">
        {['Vercel', 'Notion', 'Linear', 'Figma', 'Supabase', 'Stripe'].map(brand => (
          <span key={brand} className="font-headings font-bold text-lg text-foreground tracking-tight">{brand}</span>
        ))}
      </div>
      <div className="flex items-center gap-20 mt-4">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="font-headings font-bold text-3xl"
              style={{
                background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >{s.value}</span>
            <span className="text-sm text-muted-foreground font-body">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
