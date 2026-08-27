import { Menu, ShoppingBag, UserRound, X, Bell, Heart, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../features/cart/CartContext';
import { useNotifications } from '../../features/notifications/NotificationContext';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { isPageVisible } from '../../data/pageRegistry';

const mainLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Discover', to: '/discover' },
];

const audienceNavLinks = [
  { label: 'Women', to: '/collections/women' },
  { label: 'Men', to: '/collections/men' },
  { label: 'Kids', to: '/collections/kids' },
  { label: 'Young Adults', to: '/collections/youngAdults' },
  { label: 'Adults', to: '/collections/adults' },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { notifications } = useNotifications();
  const { wishlistSlugs } = useWishlist();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const wishlistCount = wishlistSlugs.length;

  // Filter audience links by page registry visibility
  const visibleAudienceLinks = audienceNavLinks.filter((link) => isPageVisible(link.to));

  // Handle Escape key to close navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <header className="public-header">
      <div className="container public-header__inner">
        <Link className="wordmark" to="/" aria-label="Falcon home">
          Falcon
        </Link>

        <nav className="public-header__links" aria-label="Primary navigation">
          {mainLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}

          {/* Dynamic Audience Links */}
          {visibleAudienceLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}

          <NavLink to="/stylist">Styling</NavLink>
        </nav>

        <div className="public-header__actions">
          <Link className="header-action header-action--search" to="/search" aria-label="Search catalog">
            <Search size={18} aria-hidden="true" />
          </Link>
          <Link className="header-action header-action--account" to="/sign-in" aria-label="Account dashboard">
            <UserRound size={16} aria-hidden="true" />
            <span>Account</span>
          </Link>
          <Link
            className="header-action header-action--wishlist"
            to="/wishlist"
            aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
          >
            <Heart size={18} aria-hidden="true" />
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link>
          <Link
            className="header-action header-action--bag"
            to="/cart"
            aria-label={`Shopping bag${itemCount ? `, ${itemCount} items` : ''}`}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
          <Link className="header-action header-action--notifications" to="/notifications" aria-label="Notifications">
            <Bell size={20} aria-hidden="true" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </Link>
          <Link className="button button--primary header-cta" to="/create-account">
            Get started
          </Link>
          <button
            className="icon-button menu-trigger"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Navigation */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9,
          }}
        />
      )}

      <MobileNavigation isOpen={isOpen} onClose={() => setIsOpen(false)} visibleAudiences={visibleAudienceLinks} />
    </header>
  );
}

function MobileNavigation({
  isOpen,
  onClose,
  visibleAudiences,
}: {
  isOpen: boolean;
  onClose: () => void;
  visibleAudiences: typeof audienceNavLinks;
}) {
  return (
    <nav className={`mobile-navigation ${isOpen ? 'mobile-navigation--open' : ''}`} id="mobile-navigation" aria-label="Mobile navigation">
      <NavLink to="/shop" onClick={onClose}>Shop</NavLink>
      <NavLink to="/discover" onClick={onClose}>Discover</NavLink>
      <NavLink to="/search" onClick={onClose}>Search Catalog</NavLink>
      <div style={{ height: '1px', background: 'var(--color-outline-muted)', margin: '8px 0' }} />
      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Collections
      </span>
      {visibleAudiences.map((link) => (
        <NavLink key={link.to} to={link.to} onClick={onClose}>
          {link.label} Collection
        </NavLink>
      ))}
      <div style={{ height: '1px', background: 'var(--color-outline-muted)', margin: '8px 0' }} />
      <NavLink to="/stylist" onClick={onClose}>Falcon Styling</NavLink>
      <NavLink to="/wishlist" onClick={onClose}>Saved Wishlist</NavLink>
      <NavLink to="/orders" onClick={onClose}>Orders & Tracking</NavLink>
      <NavLink to="/sign-in" onClick={onClose}>Account</NavLink>
    </nav>
  );
}