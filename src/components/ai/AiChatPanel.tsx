import { Send, Sparkles, Loader2, ShoppingBag, Crown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProduct, products, type Product } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { useAccount, FREE_DAILY_LIMIT } from '../../features/account/AccountContext';

type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProducts?: Product[];
};

export function AiChatPanel({ builder = false }: { builder?: boolean }) {
  const [inputMsg, setInputMsg] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init',
      sender: 'assistant',
      text: builder
        ? 'Welcome to Outfit Studio. Select an occasion or describe your anchor piece, and I will compose a structured look.'
        : 'Good evening, Alex. What are we styling today? Describe an occasion, a mood, or a piece from your wardrobe.',
    },
  ]);

  const { addItem } = useCart();
  const { showToast } = useToast();
  const { membership, canUseAi, incrementAiUsage, dailyAiCount } = useAccount();

  const handleSend = (userText: string) => {
    if (!userText.trim() || isThinking) return;

    // Check AI usage allowance
    if (!canUseAi) {
      showToast('Daily AI limit reached (3/3). Upgrade to Falcon Pro for unlimited styling.', 'error');
      return;
    }

    const allowed = incrementAiUsage();
    if (!allowed) {
      showToast('Daily AI limit reached (3/3). Upgrade to Falcon Pro for unlimited styling.', 'error');
      return;
    }

    const userMessageId = Date.now().toString();
    const newMsg: ChatMessage = { id: userMessageId, sender: 'user', text: userText };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
    setIsThinking(true);

    // Simulate AI synthesis logic
    setTimeout(() => {
      let responseText = '';
      let recommended: Product[] = [];

      const query = userText.toLowerCase();
      if (query.includes('evening') || query.includes('milan') || query.includes('gown')) {
        responseText = 'For a minimal evening silhouette, I recommend layering our fluid Mulberry Silk Gown with the sculptural Virgin Wool Coat in Obsidian.';
        recommended = [getProduct('obsidian-silk-gown'), getProduct('obsidian-wool-coat')].filter(Boolean);
      } else if (query.includes('blazer') || query.includes('tailored') || query.includes('gallery')) {
        responseText = 'Here is a sharp, architectural tailoring edit pairing our Double-Breasted Charcoal Blazer with Graphite Trousers.';
        recommended = [getProduct('charcoal-blazer'), getProduct('graphite-tailored-trousers')].filter(Boolean);
      } else if (query.includes('knit') || query.includes('turtleneck') || query.includes('casual')) {
        responseText = 'A refined texture story featuring the Ivory Ribbed Turtleneck and Smoke Cashmere Wrap.';
        recommended = [getProduct('ivory-knit-turtleneck'), getProduct('smoke-cashmere-wrap')].filter(Boolean);
      } else {
        responseText = `I've synthesized a cohesive editorial selection based on "${userText}". Here are the anchor pieces for this composition.`;
        recommended = products.slice(0, 2);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: responseText,
          recommendedProducts: recommended,
        },
      ]);
      setIsThinking(false);
    }, 900);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSend(inputMsg);
  };

  const handleAddLookToBag = (prods: Product[]) => {
    prods.forEach((p) => {
      addItem(p, p.sizes[0] ?? 'One Size');
    });
    showToast(`Added look (${prods.length} pieces) to your bag`, 'success');
  };

  return (
    <section className="ai-chat-panel theme-dark" aria-labelledby="ai-chat-title" style={{
      background: 'var(--color-surface-low, #141416)',
      border: '1px solid var(--color-outline-muted)',
      borderRadius: '4px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div className="ai-chat-panel__intro" style={{ position: 'relative', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(194, 168, 120, 0.1)',
          border: '1px solid var(--color-champagne, #C2A878)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: 'var(--color-champagne, #C2A878)',
        }}>
          <Sparkles size={20} aria-hidden="true" />
        </div>
        <p className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', marginBottom: '0.25rem' }}>
          {builder ? 'OUTFIT STUDIO' : 'ATELIER INTELLIGENCE'}
        </p>
        <h2 id="ai-chat-title" style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 400, margin: '0.25rem 0 0.5rem' }}>
          {builder ? 'Build a look with intention.' : 'Personal Styling Assistant'}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
          {builder
            ? 'Choose an occasion, mood, or anchor piece. Falcon will compose the rest.'
            : 'Explore architectural silhouettes, pair wardrobe items, or curate looks for global occasions.'}
        </p>

        {/* AI Tier Badge */}
        <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', background: 'var(--color-surface-high, #1a1a1e)', padding: '4px 14px', borderRadius: '2px', border: '1px solid var(--color-outline-muted)', fontFamily: 'var(--font-mono)' }}>
          {membership === 'pro' ? (
            <span style={{ color: 'var(--color-champagne, #C2A878)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Crown size={12} /> FALCON PRO: UNLIMITED AI CLIENTELING
            </span>
          ) : (
            <span style={{ color: dailyAiCount >= FREE_DAILY_LIMIT ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
              FREE TIER: {dailyAiCount}/{FREE_DAILY_LIMIT} SESSIONS USED TODAY
            </span>
          )}
        </div>
      </div>

      {/* Limit Reached Warning Banner */}
      {!canUseAi && membership === 'free' && (
        <div style={{
          margin: '0 0 1.5rem 0',
          padding: '1rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#ef4444', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Daily Free AI Limit Reached (3/3)
            </strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Upgrade to Falcon Pro for unlimited styling, personal capsule curation, and 2× XP rewards.
            </span>
          </div>
          <Link className="button button--primary" to="/atelier/settings" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* Messages Feed */}
      <div
        className="ai-chat-messages"
        aria-live="polite"
        style={{
          display: 'grid',
          gap: '1.25rem',
          marginBlock: '1rem 1.5rem',
          maxHeight: '440px',
          overflowY: 'auto',
          paddingRight: '6px',
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`ai-message ${m.sender === 'user' ? 'ai-message--user' : 'ai-message--assistant'}`}
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '2px',
              background: m.sender === 'user' ? 'var(--color-surface-high)' : 'var(--color-surface-mid, #18181c)',
              border: '1px solid var(--color-outline-muted)',
              borderLeft: `3px solid ${m.sender === 'user' ? 'var(--color-champagne)' : 'var(--color-champagne)'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', color: m.sender === 'user' ? 'var(--color-champagne)' : 'var(--color-champagne)' }}>
                {m.sender === 'user' ? 'CLIENT REQUEST' : 'FALCON ATELIER AI'}
              </span>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.925rem', color: 'var(--color-text-main, #eaeaea)' }}>{m.text}</p>

            {m.recommendedProducts && m.recommendedProducts.length > 0 && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-outline-muted)' }}>
                <p className="eyebrow" style={{ margin: '0 0 0.75rem', fontSize: '10px', color: 'var(--color-champagne)' }}>
                  CURATED SILHOUETTES
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {m.recommendedProducts.map((p) => (
                    <ProductCard key={p.slug} product={p} variant="compact" />
                  ))}
                </div>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => handleAddLookToBag(m.recommendedProducts!)}
                  style={{ marginTop: '1.25rem', width: '100%', fontSize: '0.8rem', minHeight: '40px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ShoppingBag size={14} aria-hidden="true" />
                  Add curated look to bag
                </button>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="ai-message ai-message--thinking" style={{ padding: '1rem 1.25rem', background: 'var(--color-surface-mid, #18181c)', border: '1px solid var(--color-outline-muted)', borderLeft: '3px solid var(--color-champagne)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-champagne)' }}>
              <Loader2 size={14} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
              SYNTHESIZING SILHOUETTE & ARCHIVAL HARMONY...
            </span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="ai-suggestions" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => handleSend('Minimal evening in Milan')}
          disabled={!canUseAi && membership === 'free'}
          style={{
            padding: '6px 12px',
            borderRadius: '2px',
            background: 'var(--color-surface-high)',
            border: '1px solid var(--color-outline-muted)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Minimal evening in Milan
        </button>
        <button
          type="button"
          onClick={() => handleSend('Architectural tailoring for gallery opening')}
          disabled={!canUseAi && membership === 'free'}
          style={{
            padding: '6px 12px',
            borderRadius: '2px',
            background: 'var(--color-surface-high)',
            border: '1px solid var(--color-outline-muted)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Architectural tailoring
        </button>
        <button
          type="button"
          onClick={() => handleSend('Elevate my black silk pieces')}
          disabled={!canUseAi && membership === 'free'}
          style={{
            padding: '6px 12px',
            borderRadius: '2px',
            background: 'var(--color-surface-high)',
            border: '1px solid var(--color-outline-muted)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Elevate black silk pieces
        </button>
      </div>

      {/* Composer Form */}
      <form className="ai-composer" onSubmit={handleFormSubmit} style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--color-surface-high, #1a1a1e)',
        border: '1px solid var(--color-outline-muted)',
        borderRadius: '2px',
        padding: '6px 10px',
        gap: '8px',
      }}>
        <label className="sr-only" htmlFor="ai-prompt">
          Describe your desired aesthetic
        </label>
        <textarea
          id="ai-prompt"
          value={inputMsg}
          onChange={(event) => setInputMsg(event.target.value)}
          placeholder={!canUseAi && membership === 'free' ? 'Daily AI limit reached. Upgrade to Pro...' : 'Describe an occasion, mood, or style preference...'}
          rows={1}
          disabled={!canUseAi && membership === 'free'}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '0.9rem',
            resize: 'none',
            padding: '8px 4px',
            fontFamily: 'var(--font-body, sans-serif)',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(inputMsg);
            }
          }}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!inputMsg.trim() || isThinking || (!canUseAi && membership === 'free')}
          style={{
            background: inputMsg.trim() ? 'var(--color-champagne, #C2A878)' : 'rgba(255,255,255,0.08)',
            color: inputMsg.trim() ? '#111' : 'var(--color-text-muted)',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputMsg.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>

      {builder && (
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link className="text-link" to="/stylist/look/obsidian-evening" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            View a curated look &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}