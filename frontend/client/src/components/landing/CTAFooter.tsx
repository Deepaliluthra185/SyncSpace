import Icon from './global/Icon';
import { useLocation } from 'wouter';

export const displayName = 'CTA Footer Section';
export const shortDescription = 'Full-width CTA banner and site footer';

const footerLinks = {
  ['Product']: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  ['Developers']: ['Docs', 'API', 'Status', 'GitHub'],
  ['Company']: ['About', 'Blog', 'Careers', 'Contact'],
};

export default function CTAFooter() {
  const [, setLocation] = useLocation();
  return (
    <>
      {/* CTA Banner */}
      <section className="w-full px-16 py-24 flex flex-col items-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.22) 0%, rgba(236,72,153,0.12) 40%, transparent 72%)',
          }}
        />
        <div
          className="relative w-full max-w-3xl flex flex-col items-center gap-8 py-16 px-12 rounded-xl"
          style={{
            background: 'rgba(15,12,31,0.7)',
            border: '1px solid rgba(168,85,247,0.25)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 0 80px rgba(168,85,247,0.18), 0 0 160px rgba(236,72,153,0.08)',
          }}
        >
          <h2
            className="font-headings font-bold text-center"
            style={{ fontSize: '44px', letterSpacing: '-1px', color: '#f0eeff' }}
          >
            {'Your whole team,'}<br />
            <span
              style={{
                background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >{'in sync.'}</span>
          </h2>
          <p className="text-base text-muted-foreground font-body text-center max-w-md leading-relaxed">
            {'Start free, invite your team in 30 seconds, and cancel anytime. No credit card required.'}
          </p>
          <button
            onClick={() => setLocation('/auth')}
            className="text-base font-body font-semibold text-white px-10 py-3.5 rounded-md cursor-pointer transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              boxShadow: '0 0 36px rgba(168,85,247,0.6), 0 8px 32px rgba(236,72,153,0.3)',
            }}
          >
            {'Get started free →'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full px-16 pt-12 pb-8"
        style={{ borderTop: '1px solid rgba(168,85,247,0.1)' }}
      >
        <div className="flex justify-between mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  boxShadow: '0 0 14px rgba(168,85,247,0.5)',
                }}
              >
                <Icon i="layers" size={16} className="text-white" />
              </div>
              <span className="font-headings font-bold text-lg text-foreground">{'SyncSpace'}</span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {'Real-time collaborative whiteboard + code editor for distributed teams.'}
            </p>
          </div>
          {/* Link groups */}
          <div className="flex gap-20">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <p className="text-xs font-body font-semibold text-foreground tracking-wider uppercase">{group}</p>
                {links.map(l => (
                  <a key={l} className="text-sm text-muted-foreground font-body">{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex items-center justify-between pt-6"
          style={{ borderTop: '1px solid rgba(168,85,247,0.08)' }}
        >
          <span className="text-xs text-muted-foreground font-body">{'© 2025 SyncSpace, Inc. All rights reserved.'}</span>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} className="text-xs text-muted-foreground font-body">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
