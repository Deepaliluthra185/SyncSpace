import Icon from './global/Icon';
import { useLocation } from 'wouter';

export const displayName = 'NavBar';
export const shortDescription = 'SyncSpace top navigation bar';

export default function NavBar() {
  const [, setLocation] = useLocation();
  const links = ['Features', 'Pricing', 'Blog', 'Docs'];
  return (
    <nav
      style={{
        background: 'rgba(7,6,15,0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(168,85,247,0.14)',
      }}
      className="w-full px-16 py-4 flex items-center justify-between"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            boxShadow: '0 0 16px rgba(168,85,247,0.55)',
          }}
        >
          <Icon i="layers" size={16} className="text-white" />
        </div>
        <span className="font-headings font-bold text-lg text-foreground tracking-tight">{'SyncSpace'}</span>
      </div>
      {/* Links */}
      <div className="flex items-center gap-8">
        {links.map(l => (
          <a key={l} className="text-sm text-muted-foreground font-body font-medium cursor-pointer transition-colors hover:text-foreground">{l}</a>
        ))}
      </div>
      {/* CTA */}
      <div className="flex items-center gap-3">
        <a onClick={() => setLocation('/auth?mode=login')} className="text-sm text-muted-foreground font-body font-medium px-4 py-2 cursor-pointer transition-colors hover:text-foreground">{'Sign in'}</a>
        <button
          onClick={() => setLocation('/auth')}
          className="text-sm font-body font-medium text-primary-foreground px-5 py-2 rounded-md cursor-pointer transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            boxShadow: '0 0 18px rgba(168,85,247,0.4)',
          }}
        >
          {'Get Started Free'}
        </button>
      </div>
    </nav>
  );
}
