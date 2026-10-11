import { Volume2, VolumeX } from 'lucide-react';

const SoundAmbiance = ({ isMuted = true, onToggle, compact = false }) => {
  const canToggle = typeof onToggle === 'function';
  const label = isMuted ? 'Enable background ambience' : 'Mute background ambience';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!canToggle}
      className={[
        'nav-angular-button inline-flex min-h-8 items-center justify-center gap-2 border',
        'border-slate-900/10 bg-white/90 text-slate-600 shadow-[0_6px_18px_rgba(8,25,34,0.04)]',
        'transition-[background-color,border-color,color,opacity] duration-200',
        'hover:border-[var(--color-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-secondary)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        compact ? 'h-8 w-8 px-0 sm:h-9 sm:w-9' : 'min-h-10 px-3 py-2.5',
      ].join(' ')}
      title={isMuted ? 'Enable Animus Ambiance' : 'Mute Animus Ambiance'}
      aria-label={label}
      aria-pressed={!isMuted}
    >
      {isMuted ? (
        <VolumeX size={compact ? 16 : 14} aria-hidden="true" className="shrink-0 text-slate-500" />
      ) : (
        <Volume2
          size={compact ? 16 : 14}
          aria-hidden="true"
          className="shrink-0 text-[var(--color-secondary)]"
        />
      )}
      {!compact && (
        <span className={[
          'font-mono text-[10px] uppercase tracking-[0.08em]',
          isMuted ? 'text-slate-500' : 'font-bold text-[var(--color-secondary)]',
        ].join(' ')}>
          {isMuted ? 'Audio muted' : 'Animus sync'}
        </span>
      )}
    </button>
  );
};

export default SoundAmbiance;
