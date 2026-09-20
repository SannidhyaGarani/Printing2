import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { 
  FiArrowRight, 
  FiCheck, 
  FiFilter, 
  FiUploadCloud, 
  FiX, 
  FiShoppingBag, 
  FiStar, 
  FiSliders, 
  FiHeart, 
  FiPlusCircle, 
  FiSearch,
  FiZap,
  FiClock,
  FiTag,
  FiRotateCcw,
  FiGrid,
  FiMaximize2,
  FiFileText,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiLayers
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { subscribeToProducts } from '../services/firebase'
import { ProductDetailPage } from './ProductDetailPage'

export const FALLBACK_PRODUCTS = [
  // ── Business Cards ──
  {
    id: 'prod-bc-1',
    title: 'Standard Business Cards',
    slug: 'standard-business-cards',
    category: 'Business Cards',
    subcategory: 'Standard Cards',
    finish: 'Matte/Gloss',
    turnaround: 'Express (24-48h)',
    orientation: 'horizontal',
    paperSizes: ['A4', 'Custom'],
    basePrice: 299,
    summary: 'Classic 350 GSM premium art card with crisp offset color printing.',
    description: 'High quality executive business cards printed on thick 350 GSM paper stock with smooth matte or gloss lamination.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800',
    tags: ['Standard Cards', 'Business Cards', 'Stationery']
  },
  {
    id: 'prod-bc-2',
    title: 'Spot UV Business Cards',
    slug: 'spot-uv-business-cards',
    category: 'Business Cards',
    subcategory: 'Spot UV Cards',
    finish: 'Spot UV',
    turnaround: 'Express (24-48h)',
    orientation: 'horizontal',
    paperSizes: ['A4', 'Custom'],
    basePrice: 599,
    summary: 'Tactile 3D raised gloss UV varnish accents on logo and titles.',
    description: 'Make your logo pop with elevated 3D high-gloss UV coating over a velvet soft-touch matte finish.',
    image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=800',
    tags: ['Spot UV Cards', 'Spot UV', 'Business Cards']
  },
  {
    id: 'prod-bc-3',
    title: 'Die Cut Custom Business Cards',
    slug: 'die-cut-business-cards',
    category: 'Business Cards',
    subcategory: 'Die Cut Cards',
    finish: 'Die Cut',
    turnaround: 'Standard (3-5 Days)',
    orientation: 'vertical',
    paperSizes: ['Custom'],
    basePrice: 699,
    summary: 'Unique custom shape die-cutting with rounded corners or custom contours.',
    description: 'Break away from rectangle standards with precision laser and punch die cutting.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
    tags: ['Die Cut Cards', 'Die Cut', 'Business Cards']
  },
  {
    id: 'prod-bc-4',
    title: 'Metallic Foil Business Cards',
    slug: 'metallic-foil-business-cards',
    category: 'Business Cards',
    subcategory: 'Metallic Foil Cards',
    finish: 'Metallic Foil',
    turnaround: 'Standard (3-5 Days)',
    orientation: 'horizontal',
    paperSizes: ['A4', 'Custom'],
    basePrice: 899,
    summary: 'Hot stamped Gold, Silver, or Rose Gold foil accents.',
    description: 'Luxury hot-stamping foil press on premium matte textured cotton cards.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800',
    tags: ['Metallic Foil Cards', 'Gold Foil', 'Business Cards']
  },
  {
    id: 'prod-bc-5',
    title: 'Soft-Touch Velvet Business Cards',
    slug: 'velvet-business-cards',
    category: 'Business Cards',
    subcategory: 'Soft-Touch Velvet Cards',
    finish: 'Soft-Touch Velvet',
    turnaround: 'Express (24-48h)',
    orientation: 'horizontal',
    paperSizes: ['A4', 'Custom'],
    basePrice: 799,
    summary: 'Ultra-soft suede touch velvet lamination on 400 GSM cardstock.',
    description: 'Experience pure luxury under your fingertips with silk velvet soft-touch coating.',
    image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=800',
    tags: ['Soft-Touch Velvet Cards', 'Velvet Cards', 'Business Cards']
  },
  {
    id: 'prod-bc-6',
    title: 'Luxury Ultra-Thick Duplex Cards',
    slug: 'luxury-thick-cards',
    category: 'Business Cards',
    subcategory: 'Luxury Thick Cards',
    finish: 'Textured Paper',
    turnaround: 'Standard (3-5 Days)',
    orientation: 'horizontal',
    paperSizes: ['Custom'],
    basePrice: 999,
    summary: 'Heavyweight 600 GSM triple-layer card with colored seam edge.',
    description: 'Command respect in C-suite meetings with ultra-thick cotton duplex cards.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800',
    tags: ['Luxury Thick Cards', 'Thick Cards', 'Business Cards']
  },

  // ── Invitations ──
  {
    id: 'prod-inv-1',
    title: 'Luxury Wedding Invitation Suites',
    slug: 'wedding-cards',
    category: 'Invitations',
    subcategory: 'Wedding Cards',
    finish: 'Metallic Foil',
    turnaround: 'Standard (3-5 Days)',
    orientation: 'vertical',
    paperSizes: ['A5', 'Custom'],
    basePrice: 1299,
    summary: 'Royal textured paper invitations with gold foil stamping and vellum wrap.',
    description: 'Bespoke wedding card collection crafted with metallic foil embossing and wax seals.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    tags: ['Wedding Cards', 'Invitations', 'Cards']
  },
  {
    id: 'prod-inv-2',
    title: 'Custom Birthday Invitation Cards',
    slug: 'birthday-cards',
    category: 'Invitations',
    subcategory: 'Birthday Cards',
    finish: 'Matte/Gloss',
    turnaround: 'Express (24-48h)',
    orientation: 'vertical',
    paperSizes: ['A5', 'A4'],
    basePrice: 499,
    summary: 'Vibrant theme birthday invites on 300 GSM silk art paper.',
    description: 'Personalized birthday party invitations with matching custom envelopes.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800',
    tags: ['Birthday Cards', 'Invitations', 'Cards']
  },
  {
    id: 'prod-inv-3',
    title: 'Personalized Thank You Note Cards',
    slug: 'thank-you-cards',
    category: 'Invitations',
    subcategory: 'Thank You Cards',
    finish: 'Textured Paper',
    turnaround: 'Express (24-48h)',
    orientation: 'horizontal',
    paperSizes: ['A5', 'A6'],
    basePrice: 399,
    summary: 'Folded thank you note cards on cotton textured paper.',
    description: 'Express heartfelt gratitude with premium folded thank you cards.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800',
    tags: ['Thank You Cards', 'Invitations', 'Notes']
  },

  // ── Printing & Marketing ──
  {
    id: 'prod-pr-1',
    title: 'A4 & A5 Glossy Promotional Flyers',
    slug: 'brochures-flyers',
    category: 'Printing',
    subcategory: 'Brochures & Flyers',
    finish: 'Matte/Gloss',
    turnaround: 'Express (24-48h)',
    orientation: 'vertical',
    paperSizes: ['A4', 'A5', 'A3'],
    basePrice: 399,
    summary: 'High-speed offset printed marketing flyers on 170 GSM gloss paper.',
    description: 'Vibrant promotional leaflets perfect for retail offers, events, and trade shows.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800',
    tags: ['Brochures & Flyers', 'Flyers', 'Printing']
  },
  {
    id: 'prod-pr-2',
    title: 'Outdoor Roll-Up Standees & Banners',
    slug: 'banners-standees',
    category: 'Printing',
    subcategory: 'Banners & Standees',
    finish: 'Vinyl Waterproof',
    turnaround: 'Express (24-48h)',
    orientation: 'vertical',
    paperSizes: ['Custom'],
    basePrice: 1499,
    summary: 'Heavy-duty aluminum retractable standee with Star Flex banner print.',
    description: 'Portable pop-up banner displays designed for exhibition booths and store entrances.',
    image: 'https://images.unsplash.com/photo-1542744094-3a3172720177?q=80&w=800',
    tags: ['Banners & Standees', 'Banners', 'Printing']
  },
  {
    id: 'prod-pr-3',
    title: 'Die-Cut Product Stickers & Decals',
    slug: 'stickers-labels',
    category: 'Printing',
    subcategory: 'Stickers & Labels',
    finish: 'Vinyl Waterproof',
    turnaround: 'Express (24-48h)',
    orientation: 'horizontal',
    paperSizes: ['Custom', 'A4'],
    basePrice: 349,
    summary: 'Waterproof vinyl die-cut stickers on easy-peel backing rolls or sheets.',
    description: 'Scratch-proof, UV resistant custom shape adhesive labels for jars, boxes, and branding.',
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=800',
    tags: ['Stickers & Labels', 'Stickers', 'Printing']
  },

  // ── Packaging & Boxes ──
  {
    id: 'prod-pk-1',
    title: 'Custom Printed Product Folding Carton',
    slug: 'product-boxes',
    category: 'Packaging',
    subcategory: 'Custom Product Boxes',
    finish: 'Soft-Touch Velvet',
    turnaround: 'Standard (3-5 Days)',
    orientation: 'horizontal',
    paperSizes: ['Custom'],
    basePrice: 899,
    summary: '350 GSM custom die-cut product box with gloss foil branding.',
    description: 'Custom sized folding cartons ideal for cosmetics, pharma, electronics, and retail packaging.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
    tags: ['Custom Product Boxes', 'Boxes', 'Packaging']
  },
  {
    id: 'prod-pk-2',
    title: 'Rigid Magnetic Closure Gift Boxes',
    slug: 'rigid-gift-boxes',
    category: 'Packaging',
    subcategory: 'Rigid Gift Boxes',
    finish: 'Spot UV',
    turnaround: 'Standard (3-5 Days)',
    orientation: 'horizontal',
    paperSizes: ['Custom'],
    basePrice: 1899,
    summary: 'Heavyweight rigid cardboard box with concealed magnetic catch.',
    description: 'Unboxing perfection with thick 1200 GSM Kappa board wrapped in custom printed art paper.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800',
    tags: ['Rigid Gift Boxes', 'Gift Boxes', 'Packaging']
  },
  {
    id: 'prod-pk-3',
    title: 'Custom Corrugated E-Commerce Mailer Boxes',
    slug: 'mailer-boxes',
    category: 'Packaging',
    subcategory: 'Mailer Boxes & Shipping',
    finish: 'Matte/Gloss',
    turnaround: 'Express (24-48h)',
    orientation: 'horizontal',
    paperSizes: ['Custom'],
    basePrice: 1199,
    summary: 'Sturdy 3-ply E-flute corrugated shipping boxes with full inside & outside print.',
    description: 'Crush-resistant subscription and e-commerce shipping boxes custom printed with your brand colors.',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800',
    tags: ['Mailer Boxes & Shipping', 'Mailer Boxes', 'Packaging']
  },

  // ── Corporate Merch ──
  {
    id: 'prod-cm-1',
    title: 'Custom Embroidered Corporate Polo T-Shirts',
    slug: 'custom-tshirts-polos',
    category: 'Corporate & Merch',
    subcategory: 'Custom T-Shirts & Polos',
    finish: 'Textured Paper',
    turnaround: 'Express (24-48h)',
    orientation: 'vertical',
    paperSizes: ['Custom'],
    basePrice: 599,
    summary: '220 GSM 100% combed cotton pique polo t-shirts with chest logo embroidery.',
    description: 'Premium staff uniforms and promotional event apparel with high-density thread embroidery.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
    tags: ['Custom T-Shirts & Polos', 'Apparel', 'Corporate & Merch']
  },
  {
    id: 'prod-cm-2',
    title: 'Branded Ceramic Coffee Mugs',
    slug: 'mugs-drinkware',
    category: 'Corporate & Merch',
    subcategory: 'Mugs & Drinkware',
    finish: 'Matte/Gloss',
    turnaround: 'Express (24-48h)',
    orientation: 'vertical',
    paperSizes: ['Custom'],
    basePrice: 249,
    summary: '325ml dishwasher-safe ceramic mugs with vibrant sublimation photo printing.',
    description: 'Classic white and inner-color ceramic mugs personalized with company logos, quotes, or photos.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800',
    tags: ['Mugs & Drinkware', 'Mugs', 'Corporate & Merch']
  }
];

export function ProductsPage({ onNavigateCart, setCurrentPage }) {
  const { addToCart, toggleWishlist, isInWishlist } = useAuth()
  const prefersReducedMotion = useReducedMotion()

  const getSearchParams = () => new URLSearchParams(window.location.search);

  const [activeCategory, setActiveCategoryState] = useState(() => {
    return getSearchParams().get('category') || 'All';
  });

  const [searchTerm, setSearchTermState] = useState(() => {
    return getSearchParams().get('search') || '';
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedFinish, setSelectedFinish] = useState('All');
  const [selectedTurnaround, setSelectedTurnaround] = useState('All');
  const [selectedOrientation, setSelectedOrientation] = useState('All');
  const [selectedPaperSize, setSelectedPaperSize] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [selectedProduct, setSelectedProductState] = useState(null);

  // Real-time Products State from Firestore
  const [liveProducts, setLiveProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Subscribe to live Firestore products
  useEffect(() => {
    const unsubscribe = subscribeToProducts((prods) => {
      setLiveProducts(prods && prods.length > 0 ? prods : FALLBACK_PRODUCTS);
      setLoadingProducts(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen & sync state automatically with URL searchParams (popstate & hashchange)
  useEffect(() => {
    const handleUrlSync = () => {
      const searchParams = getSearchParams();
      const cat = searchParams.get('category') || 'All';
      const q = searchParams.get('search') || '';
      const currentSku = searchParams.get('sku');

      setActiveCategoryState(cat);
      setSearchTermState(q);

      const allProds = liveProducts.length > 0 ? liveProducts : FALLBACK_PRODUCTS;
      if (currentSku && allProds.length > 0) {
        const found = allProds.find(p => p.id === currentSku || p.slug === currentSku);
        if (found) setSelectedProductState(found);
      } else if (!currentSku) {
        setSelectedProductState(null);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, [liveProducts]);

  const setActiveCategory = (cat) => {
    setActiveCategoryState(cat);
    setSelectedSubcategory('All');
    if (setCurrentPage) {
      setCurrentPage('products', { category: cat === 'All' ? '' : cat, search: searchTerm }, '#catalog');
    }
  };

  const clearAllFilters = () => {
    setSearchTermState('');
    setActiveCategoryState('All');
    setSelectedSubcategory('All');
    setSelectedFinish('All');
    setSelectedTurnaround('All');
    setSelectedOrientation('All');
    setSelectedPaperSize('All');
    setMinPrice(0);
    setMaxPrice(3000);
    setSortBy('featured');
    if (setCurrentPage) {
      setCurrentPage('products', {}, '#catalog');
    }
  };

  const setSelectedProduct = (prod) => {
    setSelectedProductState(prod);
    if (setCurrentPage) {
      if (prod) {
        setCurrentPage('products', { sku: prod.id, category: activeCategory !== 'All' ? activeCategory : '' }, '#specs');
      } else {
        setCurrentPage('products', { category: activeCategory !== 'All' ? activeCategory : '' }, '#catalog');
      }
    }
  };

  const categories = [
    'All', 
    'Business Cards', 
    'Invitations', 
    'Printing', 
    'Packaging', 
    'Corporate & Merch'
  ];

  // Subcategories mapping by main category
  const subcategoryMap = {
    'Business Cards': ['Standard Cards', 'Spot UV Cards', 'Die Cut Cards', 'Metallic Foil Cards', 'Soft-Touch Velvet Cards', 'Luxury Thick Cards'],
    'Invitations': ['Wedding Cards', 'Birthday Cards', 'Thank You Cards', 'Save the Date Cards', 'Luxury Foil Invitations', 'Envelope & Seal Sets'],
    'Printing': ['Brochures & Flyers', 'Banners & Standees', 'Stickers & Labels', 'Letterheads & Stationery', 'Posters & Wall Art', 'Booklets & Catalogs'],
    'Packaging': ['Custom Product Boxes', 'Rigid Gift Boxes', 'Mailer Boxes & Shipping', 'Paper Bags & Pouches', 'Custom Printed Tapes', 'Product Hang Tags'],
    'Corporate & Merch': ['Custom T-Shirts & Polos', 'Mugs & Drinkware', 'ID Cards & Lanyards', 'Corporate Gift Kits', 'Calendars & Diaries', 'Rubber Stamps & Seals']
  };

  const availableSubcategories = activeCategory !== 'All' && subcategoryMap[activeCategory]
    ? subcategoryMap[activeCategory]
    : Object.values(subcategoryMap).flat();

  const finishes = ['All', 'Spot UV', 'Metallic Foil', 'Soft-Touch Velvet', 'Die Cut', 'Textured Paper', 'Matte/Gloss', 'Vinyl Waterproof'];
  const turnarounds = ['All', 'Express (24-48h)', 'Standard (3-5 Days)'];
  const paperSizeOptions = ['All', 'A3', 'A4', 'A5', 'Letter', 'Legal', 'Custom'];

  const pool = liveProducts.length > 0 ? liveProducts : FALLBACK_PRODUCTS;

  const filteredProducts = pool.filter((p) => {
    const catLower = activeCategory.toLowerCase();
    const pCatLower = (p.category || '').toLowerCase();
    
    const matchesCategory = activeCategory === 'All' || 
      pCatLower === catLower ||
      pCatLower.includes(catLower) ||
      catLower.includes(pCatLower);

    const matchesSubcategory = selectedSubcategory === 'All' ||
      (p.subcategory || '').toLowerCase() === selectedSubcategory.toLowerCase() ||
      (p.tags && Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase() === selectedSubcategory.toLowerCase()));

    const matchesFinish = selectedFinish === 'All' ||
      (p.finish || '').toLowerCase().includes(selectedFinish.toLowerCase()) ||
      (p.variants?.finishes && Array.isArray(p.variants.finishes) && p.variants.finishes.some(f => (f.name || f).toLowerCase().includes(selectedFinish.toLowerCase())));

    const matchesTurnaround = selectedTurnaround === 'All' ||
      (p.turnaround || '').toLowerCase().includes(selectedTurnaround.toLowerCase()) ||
      (p.specs?.turnaround || '').toLowerCase().includes(selectedTurnaround.toLowerCase());

    const matchesOrientation = selectedOrientation === 'All' ||
      (p.orientation || '').toLowerCase() === selectedOrientation.toLowerCase();

    const matchesPaperSize = selectedPaperSize === 'All' ||
      (p.paperSizes && Array.isArray(p.paperSizes) && p.paperSizes.includes(selectedPaperSize));

    const pPrice = Number(p.basePrice || p.price || 0);
    const matchesPrice = pPrice >= minPrice && pPrice <= maxPrice;

    const searchLower = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchLower || 
      (p.title || '').toLowerCase().includes(searchLower) ||
      (p.category || '').toLowerCase().includes(searchLower) ||
      (p.summary || p.description || '').toLowerCase().includes(searchLower) ||
      (p.tags && Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(searchLower)));

    return matchesCategory && matchesSubcategory && matchesFinish && matchesTurnaround && matchesOrientation && matchesPaperSize && matchesPrice && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.basePrice - b.basePrice;
    if (sortBy === 'price-high') return b.basePrice - a.basePrice;
    if (sortBy === 'title-az') return a.title.localeCompare(b.title);
    return 0;
  });

  if (selectedProduct) {
    return (
      <ProductDetailPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onNavigateCart={onNavigateCart}
      />
    );
  }

  const isAnyFilterActive = activeCategory !== 'All' || 
    selectedSubcategory !== 'All' || 
    selectedFinish !== 'All' || 
    selectedTurnaround !== 'All' || 
    selectedOrientation !== 'All' || 
    selectedPaperSize !== 'All' || 
    minPrice > 0 || 
    maxPrice < 3000 || 
    searchTerm !== '' || 
    sortBy !== 'featured';

  // Helper filter sidebar component to reuse in desktop sidebar & mobile drawer
  const FilterSidebarContent = () => (
    <div className="space-y-6 text-[#0B1633]">
      
      {/* 1. Category Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-3xs space-y-3">
        <h3 className="font-extrabold text-sm text-[#07152F] uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="flex items-center gap-2">
            <FiLayers className="w-4 h-4 text-[#FF5A1F]" /> Categories
          </span>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-black">
            {categories.length - 1}
          </span>
        </h3>

        <div className="space-y-1">
          {categories.map((cat) => {
            const count = cat === 'All' 
              ? pool.length 
              : pool.filter(p => (p.category || '').toLowerCase().includes(cat.toLowerCase())).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[13.5px] font-extrabold transition-all flex items-center justify-between cursor-pointer border-none ${
                  isSelected
                    ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/20'
                    : 'bg-slate-50/70 text-slate-700 hover:bg-slate-100 hover:text-[#FF5A1F]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-3xs space-y-3">
        <h3 className="font-extrabold text-sm text-[#07152F] uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="flex items-center gap-2">
            <FiDollarSign className="w-4 h-4 text-[#FF5A1F]" /> Price Range (₹)
          </span>
          <span className="text-[11px] font-black text-[#FF5A1F]">
            ₹{minPrice} - ₹{maxPrice}+
          </span>
        </h3>

        <div className="space-y-3 pt-1">
          <input
            type="range"
            min="0"
            max="3000"
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#FF5A1F] cursor-pointer"
          />
          <div className="flex items-center justify-between text-[12px] font-extrabold text-slate-500">
            <span>₹0</span>
            <span>₹1,500</span>
            <span>₹3,000+</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setMinPrice(0); setMaxPrice(500); }}
              className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-[#FF5A1F] hover:text-white text-[11px] font-bold transition border-none cursor-pointer"
            >
              Under ₹500
            </button>
            <button
              type="button"
              onClick={() => { setMinPrice(500); setMaxPrice(1000); }}
              className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-[#FF5A1F] hover:text-white text-[11px] font-bold transition border-none cursor-pointer"
            >
              ₹500 - ₹1K
            </button>
            <button
              type="button"
              onClick={() => { setMinPrice(1000); setMaxPrice(3000); }}
              className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-[#FF5A1F] hover:text-white text-[11px] font-bold transition border-none cursor-pointer"
            >
              ₹1K+
            </button>
          </div>
        </div>
      </div>

      {/* 3. Subcategories Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-3xs space-y-3">
        <h3 className="font-extrabold text-sm text-[#07152F] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <FiTag className="w-4 h-4 text-[#FF5A1F]" /> Subcategory / Type
        </h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-[13px]">
          <button
            type="button"
            onClick={() => setSelectedSubcategory('All')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg font-extrabold transition border-none cursor-pointer ${
              selectedSubcategory === 'All'
                ? 'bg-[#07152F] text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-[#FF5A1F]'
            }`}
          >
            All Subcategories
          </button>
          {availableSubcategories.map((subcat) => (
            <button
              key={subcat}
              type="button"
              onClick={() => setSelectedSubcategory(subcat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg font-bold transition border-none cursor-pointer ${
                selectedSubcategory === subcat
                  ? 'bg-[#FF5A1F] text-white font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#FF5A1F]'
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Print Orientation Filter */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-3xs space-y-3">
        <h3 className="font-extrabold text-sm text-[#07152F] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <FiMaximize2 className="w-4 h-4 text-[#FF5A1F]" /> Print Orientation
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'All', label: 'All' },
            { id: 'horizontal', label: 'Landscape' },
            { id: 'vertical', label: 'Portrait' }
          ].map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelectedOrientation(o.id)}
              className={`py-2 rounded-xl text-[12px] font-extrabold transition cursor-pointer border flex flex-col items-center justify-center gap-1 ${
                selectedOrientation === o.id
                  ? 'bg-[#07152F] text-white border-[#07152F] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#FF5A1F]'
              }`}
            >
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Paper Sizes Supported Filter */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-3xs space-y-3">
        <h3 className="font-extrabold text-sm text-[#07152F] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <FiFileText className="w-4 h-4 text-[#FF5A1F]" /> Paper Sizes
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {paperSizeOptions.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedPaperSize(size)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-extrabold transition cursor-pointer border ${
                selectedPaperSize === size
                  ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Special Finishes Filter */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-3xs space-y-3">
        <h3 className="font-extrabold text-sm text-[#07152F] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <FiStar className="w-4 h-4 text-[#FF5A1F]" /> Premium Finishes
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {finishes.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFinish(f)}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-bold transition cursor-pointer border ${
                selectedFinish === f
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#FF5A1F]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Dispatch Speed / Turnaround Filter */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7EAF0] shadow-3xs space-y-3">
        <h3 className="font-extrabold text-sm text-[#07152F] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <FiClock className="w-4 h-4 text-[#FF5A1F]" /> Dispatch Speed
        </h3>
        <div className="space-y-1.5">
          {turnarounds.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTurnaround(t)}
              className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] font-extrabold transition cursor-pointer border ${
                selectedTurnaround === t
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50/50 text-emerald-900 border-emerald-200/60 hover:bg-emerald-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Reset All Filters Button */}
      {isAnyFilterActive && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[13.5px] border border-rose-200 transition cursor-pointer flex items-center justify-center gap-2 shadow-3xs"
        >
          <FiRotateCcw className="w-4 h-4" /> Reset All Filters
        </button>
      )}

    </div>
  );

  return (
    <div className="bg-[#FAFBFD] font-sans min-h-screen text-[#0B1633]">

      {/* Page Hero Header — Deep Navy #07152F */}
      <section className="bg-[#07152F] text-white py-14 sm:py-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-[#FF5A1F]/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start text-[14px] font-semibold text-slate-400">
                <span>Home</span>
                <span>/</span>
                <span className="text-[#FF5A1F] font-bold">Shop Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2 text-center sm:text-left">
                Full Print & Packaging Catalog
              </h1>
              <p className="text-slate-300 text-[14px] max-w-xl leading-relaxed text-center sm:text-left">
                Explore custom business cards, invitations, boxes, standees, stickers & corporate swag.
              </p>
            </div>

            {/* In-Hero Live Search Bar */}
            <div className="w-full md:w-80 relative">
              <FiSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTermState(e.target.value)}
                placeholder="Search cards, packaging..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-[14px] font-medium placeholder-slate-400 focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTermState('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white border-none bg-transparent cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog & Filter Area */}
      <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Control Bar: SKU Count, Active Filter Pills, Sort & Mobile Filter Toggle */}
        <div className="bg-white border border-[#E7EAF0] rounded-2xl p-4 shadow-xs mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap text-[14px]">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-[#07152F] text-white font-extrabold text-[13px] flex items-center gap-2 cursor-pointer border-none shadow-xs"
            >
              <FiSliders className="w-4 h-4 text-[#FF5A1F]" /> Filters
            </button>

            <span className="font-extrabold text-slate-800">
              Showing <strong className="text-[#FF5A1F]">{filteredProducts.length}</strong> of {pool.length} SKUs
            </span>

            {isAnyFilterActive && (
              <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                {activeCategory !== 'All' && (
                  <span className="bg-[#07152F] text-white px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                    Category: {activeCategory}
                    <button type="button" onClick={() => setActiveCategory('All')} className="hover:text-rose-400 border-none bg-transparent cursor-pointer"><FiX className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedSubcategory !== 'All' && (
                  <span className="bg-[#FF5A1F] text-white px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                    Sub: {selectedSubcategory}
                    <button type="button" onClick={() => setSelectedSubcategory('All')} className="hover:text-slate-200 border-none bg-transparent cursor-pointer"><FiX className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedFinish !== 'All' && (
                  <span className="bg-slate-800 text-white px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                    Finish: {selectedFinish}
                    <button type="button" onClick={() => setSelectedFinish('All')} className="hover:text-rose-400 border-none bg-transparent cursor-pointer"><FiX className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedTurnaround !== 'All' && (
                  <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                    Speed: {selectedTurnaround}
                    <button type="button" onClick={() => setSelectedTurnaround('All')} className="hover:text-slate-200 border-none bg-transparent cursor-pointer"><FiX className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[12px] font-extrabold text-[#FF5A1F] hover:underline border-none bg-transparent cursor-pointer ml-1"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 text-[13.5px] font-bold text-slate-700">
            <span className="flex items-center gap-1 text-slate-400">
              <FiSliders className="text-[#FF5A1F]" /> Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[13.5px] font-extrabold text-[#0B1633] focus:outline-none focus:border-[#FF5A1F] cursor-pointer"
            >
              <option value="featured">Featured SKUs</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title-az">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout: Left Filter Sidebar (3 cols) + Right Product Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FILTER SIDEBAR (Desktop Only: sticky top-24) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
            <FilterSidebarContent />
          </div>

          {/* MOBILE FILTER DRAWER MODAL */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex justify-start p-4 lg:hidden animate-in fade-in">
              <div className="bg-white rounded-3xl w-full max-w-sm h-full overflow-y-auto p-6 space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-[#07152F] flex items-center gap-2">
                    <FiSliders className="text-[#FF5A1F]" /> Filter Catalog
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebarContent />
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 rounded-xl bg-[#07152F] text-white font-extrabold text-[14px] cursor-pointer border-none"
                  >
                    Show {filteredProducts.length} Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: PRODUCT CARDS GRID */}
          <div className="lg:col-span-9 space-y-6">
            {loadingProducts ? (
              <div className="py-20 text-center text-slate-500 font-bold text-sm bg-white rounded-3xl border border-[#E7EAF0]">
                Loading Live Products Catalog...
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => {
                  const isSaved = isInWishlist(prod.id);
                  const imgSrc = (prod.images && prod.images[0]) || prod.image || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600';
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="group bg-white rounded-2xl overflow-hidden border border-[#E7EAF0] hover:border-[#FF5A1F]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Product Image Stage */}
                      <div className="relative h-[200px] w-full overflow-hidden bg-[#F7F8FA]">
                        <img
                          src={imgSrc}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 bg-[#07152F]/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                          {prod.category}
                        </span>
                        {prod.turnaround && (
                          <span className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                            <FiClock className="w-3 h-3" /> {prod.turnaround}
                          </span>
                        )}
                        {prod.orientation && (
                          <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                            {prod.orientation === 'vertical' ? 'Portrait' : 'Landscape'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={`absolute top-3 left-3 w-8.5 h-8.5 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition border-none cursor-pointer hover:scale-110 ${
                            isSaved ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'
                          }`}
                          title="Save to Wishlist"
                        >
                          <FiHeart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                        </button>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5 text-[13px] font-extrabold text-[#FF5A1F]">
                            <span>{prod.subcategory || prod.category}</span>
                            {prod.finish && (
                              <span className="text-slate-400 font-medium">• {prod.finish}</span>
                            )}
                          </div>
                          <h3 className="text-[15.5px] font-extrabold text-[#0B1633] group-hover:text-[#FF5A1F] transition-colors mb-1.5 leading-snug line-clamp-1">
                            {prod.title}
                          </h3>
                          <p className="text-[#667085] text-[13px] leading-relaxed mb-4 line-clamp-2">
                            {prod.summary || prod.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#E7EAF0] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#667085] block font-semibold uppercase tracking-wider">Starting from</span>
                            <span className="text-[18px] font-black text-[#0B1633]">₹{prod.basePrice}</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(prod);
                            }}
                            className="inline-flex items-center gap-1.5 bg-[#FF5A1F] hover:bg-[#e44d15] text-white font-extrabold text-[13px] px-3.5 py-2 rounded-xl transition-all cursor-pointer border-none shadow-xs shadow-[#FF5A1F]/20 active:scale-95"
                          >
                            Configure & Order <FiArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#E7EAF0] shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center mx-auto mb-3 shadow-3xs">
                  <FiShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0B1633] mb-1">No SKUs Match Your Active Filters</h3>
                <p className="text-slate-500 text-[13.5px] mb-6 leading-relaxed">Try broadening your search criteria or resetting your active price range, orientation, or finish filters.</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-[#07152F] hover:bg-slate-800 text-white font-extrabold text-[14px] px-6 py-3 rounded-xl inline-flex items-center gap-2 cursor-pointer border-none transition shadow-sm"
                >
                  <FiRotateCcw className="w-4 h-4 text-[#FF5A1F]" /> Reset All Filters & View Full Catalog
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}
