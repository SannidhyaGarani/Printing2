import { useState, useEffect } from 'react'
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiChevronDown,
  FiTruck,
  FiHeart,
  FiSearch,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { SearchModal } from '../common/SearchModal'
import { subscribeToMegamenuCategories, DEFAULT_MEGAMENU_CATEGORIES } from '../../services/firebase'

export function Navbar({ currentPage, setCurrentPage }) {
  const { cartItems, wishlistItems } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [liveMegamenuCats, setLiveMegamenuCats] = useState(DEFAULT_MEGAMENU_CATEGORIES)

  useEffect(() => {
    const unsubscribe = subscribeToMegamenuCategories((cats) => {
      if (cats && Array.isArray(cats) && cats.length > 0) {
        setLiveMegamenuCats(cats)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (pageId, extraParams = {}, fragment = '') => {
    if (typeof setCurrentPage === 'function') {
      setCurrentPage(pageId, extraParams, fragment)
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="w-full font-sans sticky top-0 z-50 transition-all duration-300">

      {/* Main White Header (Matching Screenshot 2) */}
      <div className={`bg-white transition-all duration-300 border-b ${
        isScrolled ? 'py-3 shadow-md border-slate-200' : 'py-4 border-[#E2E8F0]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-6">

          {/* Visual BLINK Brand Logo (Matching Screenshot 2) */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex flex-col text-left border-none bg-transparent cursor-pointer flex-shrink-0 group"
          >
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-2xl sm:text-[26px] font-black text-[#0F172A] tracking-tight">
                Visual
              </span>
              <span className="text-2xl sm:text-[26px] font-black text-gradient tracking-tight">
                BLINK
              </span>
            </div>
            <span className="text-[8px] sm:text-[8.5px] font-black text-slate-400 tracking-[0.25em] uppercase mt-1">
              DESIGN • PRINT • BRAND
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => handleLinkClick('home')}
              className={`relative py-1 text-[14.5px] font-extrabold transition-colors border-none bg-transparent cursor-pointer ${
                currentPage === 'home' ? 'text-[#C026D3]' : 'text-[#0F172A] hover:text-[#C026D3]'
              }`}
            >
              Home
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#D946EF] to-[#E11D48] rounded-full" />
              )}
            </button>

            {/* Products Megamenu Trigger */}
            <div className="relative group">
              <button
                onClick={() => handleLinkClick('products')}
                className={`flex items-center gap-1 py-1 text-[14.5px] font-extrabold transition-colors border-none bg-transparent cursor-pointer ${
                  currentPage === 'products' ? 'text-[#C026D3]' : 'text-[#0F172A] group-hover:text-[#C026D3]'
                }`}
              >
                <span>Products</span>
                <FiChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#C026D3] transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute top-full left-0 pt-2 w-[720px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 grid grid-cols-4 gap-4">
                  {liveMegamenuCats.slice(0, 4).map((cat) => (
                    <div key={cat.title} className="flex flex-col text-left">
                      <h4 className="text-[14px] font-black text-[#0F172A] mb-2 pb-1 border-b border-slate-100">
                        {cat.title}
                      </h4>
                      <div className="space-y-1">
                        {(cat.items || []).map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleLinkClick('products', { category: cat.categoryQuery || cat.title, search: item.name }, '#catalog')}
                            className="block w-full text-left text-[14px] font-semibold text-slate-600 hover:text-[#C026D3] py-1 border-none bg-transparent cursor-pointer transition-colors"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLinkClick('services')}
              className={`py-1 text-[14.5px] font-extrabold transition-colors border-none bg-transparent cursor-pointer ${
                currentPage === 'services' ? 'text-[#C026D3]' : 'text-[#0F172A] hover:text-[#C026D3]'
              }`}
            >
              Services
            </button>

            <button
              onClick={() => handleLinkClick('about')}
              className={`py-1 text-[14.5px] font-extrabold transition-colors border-none bg-transparent cursor-pointer ${
                currentPage === 'about' ? 'text-[#C026D3]' : 'text-[#0F172A] hover:text-[#C026D3]'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleLinkClick('contact')}
              className={`py-1 text-[14.5px] font-extrabold transition-colors border-none bg-transparent cursor-pointer ${
                currentPage === 'contact' ? 'text-[#C026D3]' : 'text-[#0F172A] hover:text-[#C026D3]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Actions: Search Icon + Get Quote Gradient Button + Cart/User */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Search Trigger Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-[#C026D3] transition cursor-pointer border-none bg-transparent flex items-center justify-center"
              title="Search products..."
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Get Quote Pill Button (Matching Screenshot 2) */}
            <button
              onClick={() => handleLinkClick('quote')}
              className="btn-gradient inline-flex items-center gap-2 font-bold text-[13.5px] sm:text-[14px] px-5 sm:px-6 py-2.5 rounded-full shadow-sm cursor-pointer border-none group"
            >
              <span>Get Quote</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleLinkClick('cart')}
              className="relative p-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#C026D3] transition cursor-pointer border border-pink-200/60 flex items-center justify-center"
              title="Cart"
            >
              <FiShoppingBag className="w-4.5 h-4.5 text-[#C026D3]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E11D48] text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* User Account Button */}
            <button
              onClick={() => handleLinkClick('account')}
              className="hidden sm:flex p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] transition cursor-pointer border border-slate-200/80 items-center justify-center"
              title="Account"
            >
              <FiUser className="w-4.5 h-4.5 text-[#0F172A]" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#0F172A] cursor-pointer rounded-lg hover:bg-slate-100 transition-colors border-none bg-transparent"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-4 space-y-2 z-40">
          <div
            onClick={() => {
              setMobileMenuOpen(false)
              setIsSearchOpen(true)
            }}
            className="relative mb-3 cursor-pointer"
          >
            <FiSearch className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              readOnly
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-[14px] font-semibold text-slate-900 bg-slate-50"
            />
          </div>

          {[
            { label: 'Home', page: 'home' },
            { label: 'Products Catalog', page: 'products' },
            { label: 'Services', page: 'services' },
            { label: 'About Us', page: 'about' },
            { label: 'Contact', page: 'contact' },
            { label: 'Get Custom Quote', page: 'quote' },
            { label: 'My Cart', page: 'cart' },
            { label: 'My Account', page: 'account' },
            { label: 'Admin Panel', page: 'admin' },
          ].map(({ label, page }) => (
            <button
              key={page}
              onClick={() => handleLinkClick(page)}
              className={`block w-full text-left px-3 py-2.5 text-[14px] font-bold rounded-xl transition-colors border-none cursor-pointer ${
                currentPage === page ? 'text-[#C026D3] bg-pink-50' : 'text-[#0F172A] bg-transparent hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Instant Search Command Palette Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => {
          handleLinkClick('products', { sku: prod.id }, '#specs')
        }}
        onNavigateSearch={(term) => {
          handleLinkClick('products', { search: term }, '#catalog')
        }}
      />

    </header>
  )
}

