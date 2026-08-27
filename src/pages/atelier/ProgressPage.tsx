import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from '../../features/account/AccountContext';
import { useToast } from '../../features/toast/ToastContext';
import { Button } from '../../components/ui/Button';
import { Award, Coins, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export function ProgressPage() {
  const { xp, coins, level, nextXp, loyaltyHistory, spendCoins } = useAccount();
  const { showToast } = useToast();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const progressPercent = Math.min(100, Math.round((xp / nextXp) * 100));

  const rewards = [
    { id: 'r1', title: '$20 Atelier Voucher', cost: 200, description: 'Redeem 200 coins for a $20 voucher toward your next commission.' },
    { id: 'r2', title: 'Early Access Pass', cost: 150, description: 'Get 48-hour early priority access to upcoming seasonal drops.' },
    { id: 'r3', title: 'Private AI Styling Session', cost: 100, description: 'Complimentary deep-dive styling consultation with Falcon AI.' },
  ];

  const handleRedeem = (title: string, cost: number) => {
    const success = spendCoins(cost, title);
    if (success) {
      showToast(`Successfully redeemed "${title}"!`, 'success');
      setSelectedReward(title);
    } else {
      showToast(`Insufficient Falcon Coins (Need ${cost} Coins).`, 'error');
    }
  };

  return (
    <div className="atelier-page progress-page" style={{ paddingBottom: '3rem' }}>
      <header className="atelier-page-heading" style={{ marginBottom: '2.5rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Loyalty & Rewards
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.5rem 0' }}>
            Your Style Journey
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
            Every commission, styling consultation, and wardrobe curation sharpens your personal style language and unlocks atelier rewards.
          </p>
        </div>
      </header>

      {/* Hero Tier & XP Overview */}
      <section className="journey-hero" style={{
        background: 'var(--color-surface, #141416)',
        border: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
        borderRadius: '8px',
        padding: '2rem',
        marginBottom: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={18} style={{ color: 'var(--color-champagne, #d4af37)' }} />
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-champagne, #d4af37)', letterSpacing: '0.08em' }}>
              Current Tier
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0 0 0.5rem 0' }}>
            {level} / Atelier Collector
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
            {xp.toLocaleString()} / {nextXp.toLocaleString()} XP to Level 05
          </p>

          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-champagne, #d4af37)', transition: 'width 0.5s ease' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '6px' }}>
            {progressPercent}% completed to next milestone
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--color-surface-low, #1a1a1e)', padding: '1.25rem', borderRadius: '6px', minWidth: '140px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <Coins size={14} style={{ color: 'var(--color-champagne)' }} />
              Falcon Coins
            </div>
            <strong style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', display: 'block', margin: '6px 0 2px' }}>
              {coins.toLocaleString()}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Available to redeem</span>
          </div>

          <div style={{ background: 'var(--color-surface-low, #1a1a1e)', padding: '1.25rem', borderRadius: '6px', minWidth: '140px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <Sparkles size={14} style={{ color: 'var(--color-champagne)' }} />
              Style Score
            </div>
            <strong style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', display: 'block', margin: '6px 0 2px' }}>
              72 / 100
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Intelligence Level</span>
          </div>
        </div>
      </section>

      {/* Rewards Catalog */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
          Redeem Falcon Coins
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {rewards.map((reward) => (
            <div key={reward.id} style={{
              background: 'var(--color-surface, #141416)',
              border: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.15rem', margin: 0 }}>
                    {reward.title}
                  </h3>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-champagne, #d4af37)', fontFamily: 'var(--font-mono)' }}>
                    {reward.cost} Coins
                  </span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                  {reward.description}
                </p>
              </div>

              <Button
                variant={coins >= reward.cost ? 'primary' : 'secondary'}
                onClick={() => handleRedeem(reward.title, reward.cost)}
                disabled={coins < reward.cost}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                {coins >= reward.cost ? 'Redeem Voucher' : `Need ${reward.cost - coins} More Coins`}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Activity History */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
          Recent Loyalty Activity
        </h2>
        {loyaltyHistory.length > 0 ? (
          <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', overflow: 'hidden' }}>
            {loyaltyHistory.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--color-outline-muted)',
              }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text, #fff)', display: 'block' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {item.date}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: item.type === 'coins_spent' ? '#f44336' : 'var(--color-champagne, #d4af37)',
                }}>
                  {item.type === 'coins_spent' ? `-${item.amount} Coins` : `+${item.amount} ${item.type === 'xp_earned' ? 'XP' : 'Coins'}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--color-outline-muted)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No recent loyalty activity recorded.</p>
          </div>
        )}
      </section>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link className="button button--primary" to="/stylist">
          Consult AI Stylist &rarr;
        </Link>
        <Link className="button button--secondary" to="/shop">
          Browse Catalog &rarr;
        </Link>
      </div>
    </div>
  );
}