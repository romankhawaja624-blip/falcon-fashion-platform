import { Menu, ShoppingBag, UserRound, X, Bell, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../features/cart/CartContext';
import { useNotifications } from '../../features/notifications/NotificationContext';
import { useWishlist } from '../../features/wishlist/WishlistContext';

const links = [
  { label: 'Collections', to: '/collections/women' },
  { label: 'Styling', to: '/stylist' },
  { label: 'Why Falcon', to: '/discover' },
  { label: 'AI Assistant', to: '/assistant' },
  { label: 'Wardrobe', to: '/atelier/wardrobe' },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { notifications } = useNotifications();
  const { wishlistSlugs } = useWishlist();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const wishlistCount = wishlistSlugs.length;

  return (
    <header className="public-header">
      <div className="container public-header__inner">
        <Link className="wordmark" to="/" aria-label="Falcon home">
          Falcon
        </Link>
        <nav className="public-header__links" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="public-header__actions">
          <Link className="header-action header-action--account" to="/sign-in">
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
      <MobileNavigation isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}

function MobileNavigation({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <nav className={`mobile-navigation ${isOpen ? 'mobile-navigation--open' : ''}`} id="mobile-navigation" aria-label="Mobile navigation">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} onClick={onClose}>
          {link.label}
        </NavLink>
      ))}
      <NavLink to="/wishlist" onClick={onClose}>Wishlist</NavLink>
      <NavLink to="/orders" onClick={onClose}>Orders & Tracking</NavLink>
      <NavLink to="/sign-in" onClick={onClose}>Account</NavLink>
    </nav>
  );
}