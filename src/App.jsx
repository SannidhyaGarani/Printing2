import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CommandPalette } from './components/layout/CommandPalette'
import { CursorGlow } from './components/layout/CursorGlow'
import { FloatingActions } from './components/layout/FloatingActions'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { useLenis } from './hooks/useLenis'
import { useScrollProgress } from './hooks/useScrollProgress'
import { HomePage } from './pages/HomePage'

// Sub pages imports
import { ProductsPage } from './pages/ProductsPage'
import { ServicesPage } from './pages/ServicesPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { TrackOrderPage } from './pages/TrackOrderPage'
import { HelpCenterPage } from './pages/HelpCenterPage'
import { BlogPage } from './pages/BlogPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { OrdersPage } from './pages/OrdersPage'
import { OrderDetailsPage } from './pages/OrderDetailsPage'
import { CustomQuotePage } from './pages/CustomQuotePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { AccountPage } from './pages/AccountPage'
import { AdminApp } from './admin/AdminApp'

import { AuthProvider } from './context/AuthContext'
import { AuthModal } from './components/auth/AuthModal'

function AppContent() {
  const [darkMode, setDarkMode] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const progress = useScrollProgress()
  useLenis()

  // Initial page state resolved from pathname, searchParams (?page=...), or hash
  const getPageFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = searchParams.get('page');
    if (pageParam) return pageParam;

    const path = window.location.pathname.toLowerCase();
    if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
    return 'home';
  };

  const [currentPage, setCurrentPageState] = useState(getPageFromUrl);

  // Synchronize state with URL and browser history (pushState)
  const setCurrentPage = (page, extraParams = {}, fragment = '') => {
    setCurrentPageState(page);
    try {
      const url = new URL(window.location.href);
      if (page === 'admin') {
        url.pathname = '/admin';
      } else {
        url.pathname = '/';
      }

      url.searchParams.set('page', page);

      // Clean up sku query param if not explicitly passed in extraParams
      if (!extraParams.sku) {
        url.searchParams.delete('sku');
      }

      // Update additional query params if provided
      Object.entries(extraParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          url.searchParams.set(k, v);
        } else {
          url.searchParams.delete(k);
        }
      });

      // Update URL hash fragment if provided
      if (fragment) {
        url.hash = fragment.startsWith('#') ? fragment : `#${fragment}`;
      } else {
        url.hash = '';
      }

      window.history.pushState(null, '', url.toString());
    } catch (e) {}
  };

  // Sync state on browser back/forward buttons (popstate & hashchange)
  useEffect(() => {
    const handleUrlChange = () => {
      const page = getPageFromUrl();
      setCurrentPageState(page);

      // Handle smooth scrolling for hash fragments if present
      if (window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        const el = document.getElementById(targetId);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Smooth scroll to fragment if present when currentPage mounts
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (currentPage === 'admin') {
    return <AdminApp onSwitchToWebsite={() => setCurrentPage('home')} />
  }

  // Page switcher renderer helper
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />
      case 'products':
        return <ProductsPage onNavigateCart={() => setCurrentPage('cart')} setCurrentPage={setCurrentPage} />
      case 'services':
        return <ServicesPage />
      case 'templates':
        return <TemplatesPage />
      case 'about':
        return <AboutPage />
      case 'contact':
        return <ContactPage />
      case 'track':
        return <TrackOrderPage />
      case 'help':
        return <HelpCenterPage />
      case 'blog':
        return <BlogPage />
      case 'cart':
        return <CartPage setCurrentPage={setCurrentPage} />
      case 'checkout':
        return <CheckoutPage setCurrentPage={setCurrentPage} />
      case 'order-success':
        return <OrderSuccessPage setCurrentPage={setCurrentPage} />
      case 'orders':
        return <OrdersPage setCurrentPage={setCurrentPage} />
      case 'order-details':
        return <OrderDetailsPage setCurrentPage={setCurrentPage} />
      case 'quote':
        return <CustomQuotePage />
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} />
      case 'account':
        return <AccountPage setCurrentPage={setCurrentPage} />
      default:
        return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Scroll progress indicator */}
      <div className="fixed inset-x-0 top-0 z-[100] h-[3px] bg-slate-200/50">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-[#D946EF] via-[#C026D3] to-[#E11D48]"
          animate={{ scaleX: progress / 100 }}
          transition={{ type: 'spring', stiffness: 120, damping: 25 }}
        />
      </div>
      <CursorGlow />
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Switcher Main */}
      {renderCurrentPage()}
      
      <Footer setCurrentPage={setCurrentPage} />
      <FloatingActions />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <AuthModal />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
