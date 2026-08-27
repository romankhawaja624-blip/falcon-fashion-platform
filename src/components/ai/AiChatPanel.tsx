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
    <section className="ai-chat-panel" aria-labelledby="ai-chat-title">
      <div className="ai-chat-panel__intro" style={{ position: 'relative' }}>
        <Sparkles size={34} aria-hidden="true" />
        <p className="eyebrow">Falcon AI Stylist</p>
        <h1 id="ai-chat-title">{builder ? 'Build a look with intention.' : 'Personal Styling Assistant'}</h1>
        <p>
          {builder
            ? 'Choose an occasion, mood, or anchor piece. Falcon will compose the rest.'
            : 'Explore architectural silhouettes, pair wardrobe items, or curate looks for global occasions.'}
        </p>

        {/* AI Tier Badge */}
        <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'var(--color-surface-low, #18181c)', padding: '4px 12px', borderRadius: '16px', border: '1px solid var(--color-outline-muted)' }}>
          {membership === 'pro' ? (
            <span style={{ color: 'var(--color-champagne)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Crown size={12} /> Falcon Pro: Unlimited AI Clienteling
            </span>
          ) : (
            <span style={{ color: dailyAiCount >= FREE_DAILY_LIMIT ? '#f44336' : 'var(--color-text-muted)' }}>
              Free Tier: {dailyAiCount}/{FREE_DAILY_LIMIT} messages used today
            </span>
          )}
        </div>
      </div>

      {/* Limit Reached Warning Banner */}
      {!canUseAi && membership === 'free' && (
        <div style={{
          margin: '1rem 0',
          padding: '1rem 1.25rem',
          background: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(244, 67, 54, 0.4)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#f44336' }}>
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

      <div
        className="ai-chat-messages"
        aria-live="polite"
        style={{ display: 'grid', gap: '20px', marginBlock: '24px', maxHeight: '420px', overflowY: 'auto', paddingRight: '8px' }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`ai-message ${m.sender === 'user' ? 'ai-message--user' : 'ai-message--assistant'}`}
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-control)',
              background: m.sender === 'user' ? 'var(--color-surface-high)' : 'var(--color-surface-low)',
              border: `1px solid ${m.sender === 'user' ? 'var(--color-outline-muted)' : 'var(--color-outline-muted)'}`,
              borderLeft: `3px solid ${m.sender === 'user' ? 'var(--color-intelligent-blue)' : 'var(--color-champagne)'}`,
            }}
          >
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: m.sender === 'user' ? 'var(--color-intelligent-blue)' : 'var(--color-champagne)' }}>
              {m.sender === 'user' ? 'Alex' : 'Falcon AI'}
            </span>
            <p style={{ margin: '8px 0 0', lineHeight: '24px', fontSize: '15px' }}>{m.text}</p>

            {m.recommendedProducts && m.recommendedProducts.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-outline-muted)' }}>
                <p className="eyebrow" style={{ margin: '0 0 12px', fontSize: '10px' }}>Curated Recommendation</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {m.recommendedProducts.map((p) => (
                    <ProductCard key={p.slug} product={p} variant="compact" />
                  ))}
                </div>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => handleAddLookToBag(m.recommendedProducts!)}
                  style={{ marginTop: '16px', width: '100%', fontSize: '12px', minHeight: '40px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ShoppingBag size={14} aria-hidden="true" />
                  Add curated look to bag
                </button>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="ai-message ai-message--thinking" style={{ padding: '12px 16px', background: 'var(--color-surface-low)', borderLeft: '3px solid var(--color-champagne)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-champagne)' }}>
              <Loader2 size={14} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
              Synthesizing texture & silhouette...
            </span>
          </div>
        )}
      </div>

      <div className="ai-suggestions" style={{ marginBlock: '12px' }}>
        <button type="button" onClick={() => handleSend('Minimal evening in Milan')} disabled={!canUseAi && membership === 'free'}>
          Minimal evening in Milan
        </button>
        <button type="button" onClick={() => handleSend('Architectural tailoring for gallery opening')} disabled={!canUseAi && membership === 'free'}>
          Architectural tailoring
        </button>
        <button type="button" onClick={() => handleSend('Elevate my black silk pieces')} disabled={!canUseAi && membership === 'free'}>
          Elevate black silk pieces
        </button>
      </div>

      <form className="ai-composer" onSubmit={handleFormSubmit}>
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(inputMsg);
            }
          }}
        />
        <button type="submit" aria-label="Send message" disabled={!inputMsg.trim() || isThinking || (!canUseAi && membership === 'free')}>
          <Send size={18} aria-hidden="true" />
        </button>
      </form>

      {builder && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link className="text-link" to="/stylist/look/obsidian-evening">
            View a curated look &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}