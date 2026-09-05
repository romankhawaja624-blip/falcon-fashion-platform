// FALCON Redesigned Global Header & Navigation Component
// Features 3 clean primary nav items (Shop Mega Menu, Discover Dropdown, Styling Dropdown),
// compact luxury utility icon bar, scroll-aware sticky transition, and accessible mobile drawer.

import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, UserRound, ChevronDown, Menu, X, ArrowRight, Sparkles, SlidersHorizontal, BookOpen, Layers } from 'lucide-react';
import { useCart } from '../../features/cart/CartContext';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { isPageVisible } from '../../data/pageRegistry';

type ActiveMenu = 'shop' | 'discover' | 'styling' | null;

const audienceNavLinks = [
  { label: 'Women', to: '/collections/women' },
  { label: 'Men', to: '/collections/men' },
  { label: 'Kids', to: '/collections/kids' },
  { label: 'Young Adults', to: '/collections/youngAdults' },
  { label: 'Adults', to: '/collections/adults' },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>('shop');

  const { itemCount } = useCart();
  const { wishlistSlugs } = useWishlist();
  const wishlistCount = wishlistSlugs.length;

  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on route navigation
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // Scroll detection for sticky header backdrop transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Escape and Outside-click handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Smooth hover delay handlers for dropdown stability
  const handleMouseEnter = (menu: ActiveMenu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const toggleMenu = (menu: ActiveMenu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  // Filter audience links by page registry visibility
  const visibleAudienceLinks = audienceNavLinks.filter((link) => isPageVisible(link.to));

  return (
    <header className={`public-header ${scrolled ? 'public-header--scrolled' : ''}`}>
      <div className="container public-header__inner" ref={navContainerRef}>

        {/* LEFT: FALCON Logo */}
        <Link className="header-brand" to="/" aria-label="Falcon home">
          <span className="wordmark">Falcon</span>
        </Link>

        {/* CENTER / PRIMARY NAVIGATION (Only 3 Items) */}
        <nav className="header-nav" aria-label="Primary navigation">

          {/* 1. SHOP MEGA MENU */}
          <div
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('shop')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`nav-link-btn ${activeMenu === 'shop' || location.pathname.startsWith('/shop') || location.pathname.startsWith('/collections') ? 'active' : ''}`}
              aria-expanded={activeMenu === 'shop'}
              aria-controls="shop-mega-menu"
              onClick={() => toggleMenu('shop')}
            >
              Shop
              <ChevronDown size={14} className="nav-chevron" aria-hidden="true" />
            </button>

            <div
              id="shop-mega-menu"
              className={`dropdown-panel dropdown-panel--mega ${activeMenu === 'shop' ? 'dropdown-panel--open' : ''}`}
            >
              {/* Column 1: Demographics / Categories */}
              <div>
                <span className="dropdown-column-title">Categories</span>
                <ul className="dropdown-list">
                  {visibleAudienceLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="dropdown-link" onClick={() => setActiveMenu(null)}>
                        {link.label} Collection
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Featured Highlights */}
              <div>
                <span className="dropdown-column-title">Featured</span>
                <ul className="dropdown-list">
                  <li>
                    <Link to="/shop" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      New Arrivals <span className="link-badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      Best Sellers
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      Atelier Tailoring
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      Capsule Edits
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Editorial Card */}
              <div className="dropdown-editorial-card">
                <div>
                  <span className="dropdown-column-title" style={{ color: 'var(--color-text-muted)' }}>Atelier Editorial</span>
                  <p>Exploring architectural silhouettes, hand-finished textiles, and contemporary luxury tailoring.</p>
                </div>
                <Link to="/discover" className="editorial-card-btn" onClick={() => setActiveMenu(null)}>
                  Explore Editorial &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* 2. DISCOVER DROPDOWN */}
          <div
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('discover')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`nav-link-btn ${activeMenu === 'discover' || location.pathname.startsWith('/discover') ? 'active' : ''}`}
              aria-expanded={activeMenu === 'discover'}
              aria-controls="discover-menu"
              onClick={() => toggleMenu('discover')}
            >
              Discover
              <ChevronDown size={14} className="nav-chevron" aria-hidden="true" />
            </button>

            <div
              id="discover-menu"
              className={`dropdown-panel dropdown-panel--standard ${activeMenu === 'discover' ? 'dropdown-panel--open' : ''}`}
            >
              <div>
                <span className="dropdown-column-title">Brand & Stories</span>
                <ul className="dropdown-list">
                  <li>
                    <Link to="/discover" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <BookOpen size={15} aria-hidden="true" />
                      The Falcon Story
                    </Link>
                  </li>
                  <li>
                    <Link to="/discover" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <Layers size={15} aria-hidden="true" />
                      Editorial Journal
                    </Link>
                  </li>
                  <li>
                    <Link to="/discover" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <Sparkles size={15} aria-hidden="true" />
                      Season Lookbook
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <ArrowRight size={15} aria-hidden="true" />
                      All Collections
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. STYLING DROPDOWN */}
          <div
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('styling')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`nav-link-btn ${activeMenu === 'styling' || location.pathname.startsWith('/stylist') ? 'active' : ''}`}
              aria-expanded={activeMenu === 'styling'}
              aria-controls="styling-menu"
              onClick={() => toggleMenu('styling')}
            >
              Styling
              <ChevronDown size={14} className="nav-chevron" aria-hidden="true" />
            </button>

            <div
              id="styling-menu"
              className={`dropdown-panel dropdown-panel--standard ${activeMenu === 'styling' ? 'dropdown-panel--open' : ''}`}
            >
              <div>
                <span className="dropdown-column-title">Intelligent Atelier</span>
                <ul className="dropdown-list">
                  <li>
                    <Link to="/stylist" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <Sparkles size={15} style={{ color: 'var(--color-champagne)' }} aria-hidden="true" />
                      AI Personal Stylist <span className="link-badge">AI</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/stylist/builder" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <Layers size={15} aria-hidden="true" />
                      Outfit Builder
                    </Link>
                  </li>
                  <li>
                    <Link to="/onboarding/style" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <SlidersHorizontal size={15} aria-hidden="true" />
                      Style Quiz
                    </Link>
                  </li>
                  <li>
                    <Link to="/account/wardrobe" className="dropdown-link" onClick={() => setActiveMenu(null)}>
                      <UserRound size={15} aria-hidden="true" />
                      My Wardrobe
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </nav>

        {/* RIGHT: Compact Luxury Utility Action Icons */}
        <div className="header-actions">
          {/* Search */}
          <Link
            className="action-icon-link"
            to="/search"
            aria-label="Search catalog"
            title="Search"
          >
            <Search size={18} aria-hidden="true" />
          </Link>

          {/* Wishlist */}
          <Link
            className="action-icon-link"
            to="/wishlist"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
            title="Wishlist"
          >
            <Heart size={18} aria-hidden="true" />
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </Link>

          {/* Shopping Bag */}
          <Link
            className="action-icon-link"
            to="/cart"
            aria-label={`Shopping bag${itemCount > 0 ? `, ${itemCount} items` : ''}`}
            title="Shopping Bag"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            {itemCount > 0 && <span className="action-badge">{itemCount}</span>}
          </Link>

          {/* Account */}
          <Link
            className="action-icon-link"
            to="/sign-in"
            aria-label="Account dashboard"
            title="Account"
          >
            <UserRound size={18} aria-hidden="true" />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="menu-trigger"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER BACKDROP OVERLAY */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? 'mobile-drawer-overlay--open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* MOBILE EXPANDABLE DRAWER */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer ${mobileOpen ? 'mobile-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-title">Falcon</span>
          <button
            className="mobile-drawer-close"
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Accordions */}
        <div className="mobile-accordion">
          {/* Shop Accordion */}
          <div className="mobile-accordion-item">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileAccordion((prev) => (prev === 'shop' ? null : 'shop'))}
            >
              <span>Shop Collections</span>
              <ChevronDown
                size={16}
                style={{
                  transform: mobileAccordion === 'shop' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
                aria-hidden="true"
              />
            </button>
            {mobileAccordion === 'shop' && (
              <div className="mobile-accordion-content">
                <Link to="/shop" onClick={() => setMobileOpen(false)}>All Products</Link>
                {visibleAudienceLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                    {link.label} Collection
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Discover Accordion */}
          <div className="mobile-accordion-item">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileAccordion((prev) => (prev === 'discover' ? null : 'discover'))}
            >
              <span>Discover</span>
              <ChevronDown
                size={16}
                style={{
                  transform: mobileAccordion === 'discover' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
                aria-hidden="true"
              />
            </button>
            {mobileAccordion === 'discover' && (
              <div className="mobile-accordion-content">
                <Link to="/discover" onClick={() => setMobileOpen(false)}>The Falcon Story</Link>
                <Link to="/discover" onClick={() => setMobileOpen(false)}>Editorial Journal</Link>
                <Link to="/discover" onClick={() => setMobileOpen(false)}>Season Lookbook</Link>
              </div>
            )}
          </div>

          {/* Styling Accordion */}
          <div className="mobile-accordion-item">
            <button
              className="mobile-accordion-btn"
              onClick={() => setMobileAccordion((prev) => (prev === 'styling' ? null : 'styling'))}
            >
              <span>Intelligent Styling</span>
              <ChevronDown
                size={16}
                style={{
                  transform: mobileAccordion === 'styling' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
                aria-hidden="true"
              />
            </button>
            {mobileAccordion === 'styling' && (
              <div className="mobile-accordion-content">
                <Link to="/stylist" onClick={() => setMobileOpen(false)}>AI Personal Stylist</Link>
                <Link to="/stylist/builder" onClick={() => setMobileOpen(false)}>Outfit Builder</Link>
                <Link to="/onboarding/style" onClick={() => setMobileOpen(false)}>Style Quiz</Link>
                <Link to="/account/wardrobe" onClick={() => setMobileOpen(false)}>My Wardrobe</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Direct Action Links */}
        <div className="mobile-direct-links">
          <Link to="/sign-in" onClick={() => setMobileOpen(false)}>
            <UserRound size={16} aria-hidden="true" />
            Account Dashboard
          </Link>
          <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
            <Heart size={16} aria-hidden="true" />
            Saved Wishlist ({wishlistCount})
          </Link>
          <Link to="/orders" onClick={() => setMobileOpen(false)}>
            <ShoppingBag size={16} aria-hidden="true" />
            Orders & Tracking
          </Link>
          <Link to="/notifications" onClick={() => setMobileOpen(false)}>
            Notifications
          </Link>
        </div>
      </div>
    </header>
  );
}