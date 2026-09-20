import React, { useState, useEffect } from 'react';
import { 
  FiArrowLeft, 
  FiShoppingBag, 
  FiHeart, 
  FiCheckCircle, 
  FiTruck, 
  FiShield, 
  FiUploadCloud, 
  FiZap,
  FiFileText,
  FiPackage,
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiInfo
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_CATALOG_OPTIONS } from '../services/firebase';
import { ArtworkUploadModal } from '../Components/cart/ArtworkUploadModal';

// Helper to convert camelCase keys like 'boxStyle' -> 'Box Style'
const formatKeyToTitle = (key) => {
  const titles = {
    paperStock: 'Paper Stock & Board Weight',
    finishes: 'Special Finishes & Finishing Effects',
    sides: 'Print Sides Option',
    corners: 'Edge Cutting & Corner Finishing',
    sizeFormat: 'Card Size & Aspect Ratio Format',
    lamination: 'Lamination Option & Protective Coating',
    foilAccents: 'Metallic Foil Accents & Hot Stamping',
    spotUV: 'Spot UV & Selective Gloss Textures',
    bindingStyle: 'Binding & Booklet Construction',
    proofService: 'Prepress File Check & Proofing Service',
    packagingStyle: 'Packaging & Presentation Box',
    baseType: 'Base & Frame Specification',
    boxStyle: 'Box Construction & Style',
    customAreaPricing: 'Custom Area Pricing & Dimensions (Height × Width in sq. feet)',
  };
  if (titles[key]) return titles[key];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export function ProductDetailPage({ product, onBack, onNavigateCart }) {
  const { addToCart, toggleWishlist, isInWishlist } = useAuth();

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);

  const [selectedImage, setSelectedImage] = useState(
    imagesList.length > 0 ? imagesList[0] : null
  );

  useEffect(() => {
    if (imagesList.length > 0) {
      setSelectedImage(imagesList[0]);
    }
  }, [product]);

  // Minimum Order Quantity (Min Pieces) from product or default 1
  const minPieces = product.minOrderQty || 1;

  const [isCustomQty, setIsCustomQty] = useState(true);
  const [customQtyInput, setCustomQtyInput] = useState(minPieces);
  const [quantity, setQuantity] = useState(minPieces);

  // Accordion Tabs Toggle (description open by default)
  const [openAccordion, setOpenAccordion] = useState('description'); // 'overview', 'shipping', 'guarantee'

  // Custom Height & Width Area Calculation States (cm)
  const [customHeight, setCustomHeight] = useState('5');
  const [customWidth, setCustomWidth] = useState('10');

  const parsedH = parseFloat(customHeight) || 0;
  const parsedW = parseFloat(customWidth) || 0;
  const calculatedAreaSqCm = Math.round(parsedH * parsedW * 100) / 100;

  // Effective variants merging product.variants with default customAreaPricing fallback
  const effectiveVariants = React.useMemo(() => {
    const rawVariants = product.variants || {};
    const merged = { ...rawVariants };
    if (merged.customAreaPricing === undefined) {
      merged.customAreaPricing = DEFAULT_CATALOG_OPTIONS.customAreaPricing;
    }
    return merged;
  }, [product.variants]);

  // Active custom area tier matching
  const getMatchedAreaTier = () => {
    const areaTiers = effectiveVariants.customAreaPricing || [];
    if (!areaTiers || areaTiers.length === 0 || calculatedAreaSqCm <= 0) return null;
    const sorted = [...areaTiers].sort((a, b) => (a.maxArea || 0) - (b.maxArea || 0));
    const matched = sorted.find(t => calculatedAreaSqCm <= (t.maxArea || Infinity));
    return matched || sorted[sorted.length - 1];
  };

  const matchedAreaTier = getMatchedAreaTier();

  // Parse available variants dynamically from effectiveVariants
  const availableVariantEntries = Object.entries(effectiveVariants).filter(
    ([_, options]) => Array.isArray(options) && options.length > 0
  );

  // Initialize selected option values for each available variant category
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const initial = {};
    Object.entries(effectiveVariants).forEach(([key, options]) => {
      if (Array.isArray(options) && options.length > 0) {
        const first = options[0];
        initial[key] = typeof first === 'string' ? first : first.name;
      }
    });
    return initial;
  });

  // Keep state updated if product changes
  useEffect(() => {
    const initial = {};
    Object.entries(effectiveVariants).forEach(([key, options]) => {
      if (Array.isArray(options) && options.length > 0) {
        const first = options[0];
        initial[key] = typeof first === 'string' ? first : first.name;
      }
    });
    setSelectedVariants(initial);
  }, [effectiveVariants]);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  const isSaved = isInWishlist(product.id);

  // Active pricing tier lookup
  const getActiveTier = () => {
    if (!product.tieredPricing || product.tieredPricing.length === 0) return null;
    const sortedTiers = [...product.tieredPricing].sort((a, b) => b.tierMin - a.tierMin);
    const matched = sortedTiers.find(t => quantity >= t.tierMin);
    return matched || sortedTiers[sortedTiers.length - 1];
  };

  const activeTier = getActiveTier();

  // Dynamic Price Calculator based on product base price, tier, and selected variant modifiers
  const calculatePrice = () => {
    const validQty = Math.max(1, quantity || minPieces);
    let baseUnitPrice = product.basePrice || product.price || 0;
    if (activeTier) {
      baseUnitPrice = activeTier.pricePerUnit;
    }

    let totalModifiers = 0;
    Object.entries(effectiveVariants).forEach(([key, options]) => {
      if (key === 'customAreaPricing') return; // Handled separately with Height x Width
      if (Array.isArray(options) && options.length > 0) {
        const selectedVal = selectedVariants[key];
        const match = options.find(
          (opt) => (typeof opt === 'string' ? opt : opt.name) === selectedVal
        );
        if (match && typeof match === 'object' && match.priceModifier) {
          totalModifiers += Number(match.priceModifier) || 0;
        }
      }
    });

    if (matchedAreaTier && calculatedAreaSqCm > 0) {
      const areaPriceVal = Number(matchedAreaTier.priceModifier !== undefined ? matchedAreaTier.priceModifier : (matchedAreaTier.price || 0)) || 0;
      totalModifiers += areaPriceVal;
    }

    const calculatedTotal = (baseUnitPrice + totalModifiers) * validQty;
    return Math.max(1, Math.round(calculatedTotal));
  };

  const totalPrice = calculatePrice();
  const unitPrice = Math.max(0.01, Math.round((totalPrice / Math.max(1, quantity)) * 100) / 100);

  const handleOptionChange = (key, optionName) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [key]: optionName,
    }));
  };

  const validateInputsBeforeModal = () => {
    if (isCustomQty) {
      const parsed = parseInt(customQtyInput);
      if (!customQtyInput || isNaN(parsed) || parsed <= 0) {
        alert(`Mandatory Custom Quantity Required!\n\nPlease enter your desired quantity (Minimum ${minPieces} pieces) before adding to cart.`);
        const inputEl = document.getElementById('customQtyField');
        if (inputEl) {
          inputEl.focus();
          inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }
      if (parsed < minPieces) {
        alert(`Minimum Order Quantity Requirement:\n\nThis product requires a minimum of ${minPieces} pieces. Please enter ${minPieces} or more.`);
        const inputEl = document.getElementById('customQtyField');
        if (inputEl) inputEl.focus();
        return false;
      }
    }

    if (quantity < minPieces) {
      alert(`Minimum order quantity for this product is ${minPieces} pieces.`);
      return false;
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!validateInputsBeforeModal()) return;
    setIsBuyNowFlow(false);
    setIsArtworkModalOpen(true);
  };

  const handleBuyNow = () => {
    if (!validateInputsBeforeModal()) return;
    setIsBuyNowFlow(true);
    setIsArtworkModalOpen(true);
  };

  const handleConfirmArtworkUpload = ({ artworkFiles, artworkNotes }) => {
    addToCart({
      id: product.id,
      name: product.title || product.name,
      qty: quantity,
      selectedOptions: selectedVariants,
      paper: selectedVariants.paperStock || selectedVariants.paper || '',
      finish: selectedVariants.finishes || selectedVariants.finish || '',
      sides: selectedVariants.sides || '',
      customHeight: parsedH > 0 ? parsedH : null,
      customWidth: parsedW > 0 ? parsedW : null,
      calculatedArea: calculatedAreaSqCm > 0 ? calculatedAreaSqCm : null,
      areaTier: matchedAreaTier ? (matchedAreaTier.name || `Up to ${matchedAreaTier.maxArea} sq.ft`) : null,
      areaPrice: matchedAreaTier ? (matchedAreaTier.priceModifier || matchedAreaTier.price || 0) : 0,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      image: selectedImage || (imagesList.length > 0 ? imagesList[0] : null),
      artworkFiles: artworkFiles || [],
      artworkNotes: artworkNotes || ''
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);

    if (isBuyNowFlow && onNavigateCart) {
      onNavigateCart();
    }
  };


  // Step Counter tracking variable for dynamic section numbers
  let stepCounter = 1;

  return (
    <div className="bg-[#FAFBFD] font-sans min-h-screen text-[#0B1633] pb-20">
      
      {/* Top Breadcrumb & Quick Navigation Bar */}
      <div className="bg-[#07152F] text-white py-5 px-4 sm:px-8 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md bg-[#07152F]/95">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-300 hover:text-[#FF5A1F] transition cursor-pointer bg-transparent border-none"
          >
            <FiArrowLeft className="w-4 h-4 text-[#FF5A1F]" /> Back to Products Catalog
          </button>

          <div className="flex items-center gap-2 text-[14px] text-slate-400">
            <span>Products</span>
            <span>/</span>
            <span className="text-[#FF5A1F] font-bold">{product.category}</span>
            <span className="hidden xs:inline">/</span>
            <span className="text-white font-extrabold truncate max-w-[160px] hidden xs:inline">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main Product Details Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: STICKY IMAGE GALLERY & TECHNICAL SPECS (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 self-start space-y-5">
            
            {/* Main Stage Image Box */}
            <div className="relative bg-white rounded-3xl overflow-hidden border border-[#E7EAF0] shadow-xl group h-[400px] sm:h-[460px] flex items-center justify-center">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                  <FiPackage className="w-20 h-20 text-slate-300 mb-3" />
                  <span className="text-[14px] font-extrabold">No Image Uploaded</span>
                </div>
              )}

              {/* Wishlist Glass Heart Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-200 border-none cursor-pointer hover:scale-110 ${
                  isSaved ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'
                }`}
                title="Save to Wishlist"
              >
                <FiHeart className={`w-5 h-5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              {/* Verified Press Quality Badge */}
              <div className="absolute bottom-4 left-4 bg-[#07152F]/90 backdrop-blur-md text-white text-[14px] font-extrabold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>300 DPI Prepress Proofed</span>
              </div>
            </div>

            {/* Thumbnail Carousel Row */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer shrink-0 shadow-xs ${
                      selectedImage === img ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specifications Card if available */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div id="specs" className="bg-white rounded-3xl p-6 border border-[#E7EAF0] shadow-sm space-y-4 text-[14px]">
                <h4 className="font-black text-[#0B1633] flex items-center gap-2 border-b border-slate-100 pb-3 text-sm uppercase tracking-wider">
                  <FiFileText className="w-4 h-4 text-[#FF5A1F]" /> Technical Specs & Print Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-600 font-medium">
                  {product.specs.paperGsm && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Paper Weight</span>
                      <strong className="text-slate-900 font-extrabold text-[14px]">{product.specs.paperGsm}</strong>
                    </div>
                  )}
                  {product.specs.dimensions && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Dimensions</span>
                      <strong className="text-slate-900 font-extrabold text-[14px]">{product.specs.dimensions}</strong>
                    </div>
                  )}
                  {product.specs.printTech && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Press Tech</span>
                      <strong className="text-slate-900 font-extrabold text-[14px]">{product.specs.printTech}</strong>
                    </div>
                  )}
                  {product.specs.turnaround && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Turnaround</span>
                      <strong className="text-slate-900 font-extrabold text-[14px]">{product.specs.turnaround}</strong>
                    </div>
                  )}
                  {/* Orientation spec */}
                  {product.orientation && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Orientation</span>
                      <strong className="text-slate-900 font-extrabold text-[14px] capitalize">{product.orientation === 'vertical' ? 'Portrait' : 'Landscape'}</strong>
                    </div>
                  )}
                  {/* Paper Sizes spec */}
                  {product.paperSizes && product.paperSizes.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Paper Sizes</span>
                      <strong className="text-slate-900 font-extrabold text-[14px]">{product.paperSizes.join(', ')}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Press Guarantee Badges */}
            <div className="bg-white rounded-3xl p-5 border border-[#E7EAF0] shadow-sm grid grid-cols-3 gap-3 text-center text-[14px] font-bold text-slate-700">
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-orange-50/50">
                <FiTruck className="w-5 h-5 text-[#FF5A1F]" />
                <span className="text-[14px] font-black text-slate-900">Express Delivery</span>
                <span className="text-[9.5px] text-slate-500 font-medium">Pan-India Doorstep</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-emerald-50/50">
                <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-[14px] font-black text-slate-900">300 DPI Pre-Flight</span>
                <span className="text-[9.5px] text-slate-500 font-medium">Free File Proof</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-blue-50/50">
                <FiShield className="w-5 h-5 text-blue-600" />
                <span className="text-[14px] font-black text-slate-900">100% Quality</span>
                <span className="text-[9.5px] text-slate-500 font-medium">Re-print Guarantee</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PRODUCT CONFIGURATOR & PRICING ENGINE (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header: Title, Rating, Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3.5 py-1 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] text-[14px] font-black uppercase tracking-wider border border-[#FF5A1F]/20">
                  {product.category}
                </span>
                {/* Orientation Badge */}
                {product.orientation && (
                  <span className={`px-3 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${
                    product.orientation === 'vertical'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {product.orientation === 'vertical' ? (
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    ) : (
                      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    )}
                    {product.orientation === 'vertical' ? 'Portrait' : 'Landscape'}
                  </span>
                )}
                {/* Paper Sizes Badge */}
                {product.paperSizes && product.paperSizes.length > 0 && product.paperSizes.map(size => (
                  <span key={size} className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold uppercase tracking-wider">
                    {size}
                  </span>
                ))}
                <div className="flex items-center gap-1 text-amber-500 text-[14px] font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <FiStar className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">(148 Press Reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#0B1633] tracking-tight leading-tight">
                {product.title}
              </h1>
            </div>

            {/* LIVE DYNAMIC PRICING ENGINE BAR */}
            <div id="pricing" className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 border border-[#E7EAF0] shadow-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-[14px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    Calculated Total (Incl. 18% GST)
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-[#FF5A1F] tracking-tight">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-600 font-extrabold font-mono">
                      (₹{unitPrice} / unit)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-[14px] font-extrabold border border-emerald-300 inline-flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    In Stock & Press Ready
                  </span>
                </div>
              </div>

              {activeTier && (
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[14px] font-bold text-blue-900 bg-blue-50/80 p-3 rounded-2xl border border-blue-200/90">
                  <span>🎉 Volume Discount Applied: Tier Rate for up to {activeTier.tierMin} units</span>
                  <span className="font-extrabold text-blue-700">₹{activeTier.pricePerUnit}/unit</span>
                </div>
              )}
            </div>

            {/* STEP-BY-STEP PRODUCT CONFIGURATOR FORM */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7EAF0] shadow-sm space-y-6 text-[14px]">
              <h3 className="font-black text-sm text-[#0B1633] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Configure Print Specifications</span>
                <span className="text-[14px] font-bold text-[#FF5A1F] uppercase">Interactive Press Studio</span>
              </h3>

              {/* STEP 1: QUANTITY TIER & MANDATORY CUSTOM UNIT SELECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-sm text-[#0B1633] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#07152F] text-white flex items-center justify-center text-[14px] font-black">{stepCounter++}</span>
                    <span>Select Quantity Tier:</span>
                  </label>
                  <span className="text-[14px] font-black text-[#FF5A1F] bg-[#FF5A1F]/10 px-3 py-1 rounded-full border border-[#FF5A1F]/20">
                    {quantity || 0} units selected
                  </span>
                </div>

                {/* Preset Tier Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {(product.tieredPricing && product.tieredPricing.length > 0 ? product.tieredPricing : [
                    { tierMin: minPieces, pricePerUnit: product.basePrice || product.price || 5 }
                  ]).map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsCustomQty(false);
                        setQuantity(t.tierMin);
                      }}
                      className={`py-3 px-2.5 rounded-2xl font-extrabold text-[14px] transition border cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        !isCustomQty && quantity === t.tierMin
                          ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md scale-105'
                          : 'bg-[#F7F8FA] text-[#0B1633] border-[#E7EAF0] hover:border-[#FF5A1F]'
                      }`}
                    >
                      <span>Up to {t.tierMin} units</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        !isCustomQty && quantity === t.tierMin ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        ₹{t.pricePerUnit}/unit
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomQty(true);
                      setQuantity(customQtyInput || minPieces);
                    }}
                    className={`py-3 px-2.5 rounded-2xl font-extrabold text-[14px] transition border cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isCustomQty
                        ? 'bg-[#07152F] text-white border-[#07152F] shadow-md scale-105'
                        : 'bg-[#F7F8FA] text-[#0B1633] border-[#E7EAF0] hover:border-[#FF5A1F]'
                    }`}
                  >
                    <span>Custom Qty</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isCustomQty ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      Enter Units
                    </span>
                  </button>
                </div>

                {/* Custom Quantity Input Box with Mandatory Flag */}
                {isCustomQty && (
                  <div className={`p-4.5 rounded-2xl border transition-all duration-200 ${
                    !customQtyInput || parseInt(customQtyInput) < minPieces || isNaN(parseInt(customQtyInput))
                      ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200'
                      : 'bg-[#F7F8FA] border-[#E7EAF0]'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label htmlFor="customQtyField" className="font-extrabold text-[14px] text-[#0B1633] shrink-0 flex items-center gap-1">
                          <span>Enter Custom Units (Mandatory)</span>
                          <span className="text-rose-600 font-extrabold text-sm">*</span>:
                        </label>
                        <input
                          id="customQtyField"
                          type="number"
                          min={minPieces}
                          value={customQtyInput}
                          onChange={(e) => {
                            const raw = e.target.value;
                            setCustomQtyInput(raw);
                            const val = parseInt(raw);
                            if (!isNaN(val) && val > 0) {
                              setQuantity(val);
                            } else {
                              setQuantity(0);
                            }
                          }}
                          placeholder={`Min ${minPieces} pcs`}
                          className={`w-36 bg-white border rounded-xl px-3.5 py-2 font-black text-sm text-[#0B1633] focus:outline-none shadow-xs ${
                            !customQtyInput || parseInt(customQtyInput) < minPieces || isNaN(parseInt(customQtyInput))
                              ? 'border-rose-400 focus:border-rose-600 text-rose-900 ring-1 ring-rose-300'
                              : 'border-[#E7EAF0] focus:border-[#FF5A1F]'
                          }`}
                        />
                      </div>
                      {activeTier && (
                        <span className="text-[14px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                          Tier Rate ({activeTier.tierMin}+ units): ₹{activeTier.pricePerUnit}/unit
                        </span>
                      )}
                    </div>

                    {(!customQtyInput || parseInt(customQtyInput) <= 0 || isNaN(parseInt(customQtyInput))) ? (
                      <div className="mt-2.5 text-rose-700 text-[14px] font-extrabold flex items-center gap-1.5">
                        <span>⚠️ Mandatory Field: Please enter your desired quantity (Minimum {minPieces} pcs) to calculate price.</span>
                      </div>
                    ) : parseInt(customQtyInput) < minPieces ? (
                      <div className="mt-2.5 text-amber-700 text-[14px] font-extrabold flex items-center gap-1.5">
                        <span>⚠️ Minimum Order Quantity for this item is {minPieces} pieces. Please enter {minPieces} or more.</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* DYNAMIC VARIANT OPTION SECTIONS */}
              {availableVariantEntries.map(([key, optionsList]) => {
                const stepNum = stepCounter++;
                const title = formatKeyToTitle(key);
                const currentSelected = selectedVariants[key];

                // Custom Area Height & Width Pricing Section
                if (key === 'customAreaPricing') {
                  const activePrice = matchedAreaTier ? (matchedAreaTier.priceModifier !== undefined ? matchedAreaTier.priceModifier : matchedAreaTier.price) : 0;
                  return (
                    <div key={key} className="space-y-3 bg-gradient-to-r from-blue-50/80 via-slate-50 to-orange-50/50 p-4.5 rounded-2xl border border-blue-200/80 shadow-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="font-extrabold text-sm text-[#0B1633] flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#07152F] text-white flex items-center justify-center text-[14px] font-black">{stepNum}</span>
                          <span>{title}:</span>
                        </label>
                        {calculatedAreaSqCm > 0 && matchedAreaTier && (
                          <span className="text-[14px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Matched Tier: {matchedAreaTier.name || `Up to ${matchedAreaTier.maxArea} sq.ft`} (+₹{activePrice})</span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[14px] font-extrabold text-slate-700">Enter Height (ft):</label>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            placeholder="e.g. 1.5"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-black text-[14px] text-[#0B1633] focus:outline-none focus:border-[#FF5A1F] shadow-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[14px] font-extrabold text-slate-700">Enter Width (ft):</label>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            placeholder="e.g. 2"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 font-black text-[14px] text-[#0B1633] focus:outline-none focus:border-[#FF5A1F] shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-blue-100 flex items-center justify-between text-[14px] font-bold text-slate-700 shadow-3xs">
                        <span>📐 Automatically Calculated Area:</span>
                        <span className="text-sm font-black text-[#FF5A1F] font-mono">
                          {calculatedAreaSqCm > 0 ? `${customHeight}ft × ${customWidth}ft = ${calculatedAreaSqCm} sq.ft` : 'Enter Height & Width'}
                        </span>
                      </div>
                    </div>
                  );
                }

                // Dropdown layout for paperStock & finishes
                if (key === 'paperStock' || key === 'finishes') {
                  return (
                    <div key={key} className="space-y-2">
                      <label className="font-extrabold text-sm text-[#0B1633] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#07152F] text-white flex items-center justify-center text-[14px] font-black">{stepNum}</span>
                        <span>{title}:</span>
                      </label>
                      <select
                        value={currentSelected}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className="w-full bg-[#F7F8FA] border border-[#E7EAF0] rounded-2xl p-3.5 font-bold text-[14px] text-[#0B1633] focus:outline-none focus:border-[#FF5A1F] shadow-xs cursor-pointer"
                      >
                        {optionsList.map((opt, i) => {
                          const optName = typeof opt === 'string' ? opt : opt.name;
                          const optPrice = typeof opt === 'object' && opt.priceModifier ? opt.priceModifier : 0;
                          return (
                            <option key={i} value={optName}>
                              {optName} {optPrice > 0 ? `(+₹${optPrice}/unit)` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                }

                // Grid button layout for all other option types
                return (
                  <div key={key} className="space-y-2">
                    <label className="font-extrabold text-sm text-[#0B1633] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#07152F] text-white flex items-center justify-center text-[14px] font-black">{stepNum}</span>
                      <span>{title}:</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {optionsList.map((opt, i) => {
                        const optName = typeof opt === 'string' ? opt : opt.name;
                        const optPrice = typeof opt === 'object' && opt.priceModifier ? opt.priceModifier : 0;
                        const isSelected = currentSelected === optName;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleOptionChange(key, optName)}
                            className={`py-3 px-3 rounded-2xl font-extrabold text-[14px] transition-all duration-150 border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                              isSelected
                                ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md scale-105 ring-2 ring-[#FF5A1F]/30'
                                : 'bg-[#F7F8FA] text-[#0B1633] border-[#E7EAF0] hover:border-[#FF5A1F]'
                            }`}
                          >
                            <span>{optName}</span>
                            <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {optPrice > 0 ? `+₹${optPrice}/unit` : 'Included'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* STEP: UPLOAD PRINT ARTWORK DROPZONE */}
              <div className="space-y-2 pt-2">
                <label className="font-extrabold text-sm text-[#0B1633] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#07152F] text-white flex items-center justify-center text-[14px] font-black">{stepCounter++}</span>
                  <span>Upload Print Artwork File (PDF, AI, PSD, PNG):</span>
                </label>
                <label className="border-2 border-dashed border-[#E7EAF0] hover:border-[#FF5A1F] rounded-2xl p-5 text-center block bg-[#F7F8FA] cursor-pointer transition-all duration-200 group">
                  <FiUploadCloud className="w-8 h-8 text-[#FF5A1F] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[14px] text-slate-800 font-extrabold block">
                    {uploadedFile ? `Uploaded: ${uploadedFile.name}` : 'Click to select artwork file or drag here'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">
                    Accepts 300 DPI High-Res PDF, PSD, AI, EPS, PNG up to 100MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                  />
                </label>
              </div>

            </div>

            {/* ACTION BUTTONS: ADD TO CART & BUY NOW */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#FF5A1F] hover:bg-[#e44d15] text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-[#FF5A1F]/25 flex items-center justify-center gap-2 cursor-pointer transition border-none hover:scale-[1.02]"
              >
                {addedSuccess ? (
                  <>
                    <FiCheckCircle className="w-5 h-5 text-white" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <FiShoppingBag className="w-5 h-5" /> Add to Cart (₹{totalPrice.toLocaleString()})
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-4 px-8 rounded-2xl bg-[#07152F] hover:bg-slate-800 text-white font-black text-sm tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 cursor-pointer transition border-none hover:scale-[1.02]"
              >
                <FiZap className="w-4 h-4 text-amber-400 fill-amber-400" /> Buy Now / Checkout
              </button>
            </div>

            {/* PRODUCT INFORMATION ACCORDION DROPDOWN TABS */}
            <div className="bg-white rounded-3xl border border-[#E7EAF0] shadow-sm divide-y divide-slate-100 overflow-hidden text-[14px]">
              
              {/* TAB 1: PRODUCT DESCRIPTION & HIGHLIGHTS (OPEN BY DEFAULT) */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                  className="w-full p-4 sm:p-5 text-left font-extrabold text-sm text-[#0B1633] flex items-center justify-between cursor-pointer border-none bg-transparent hover:bg-slate-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FiFileText className="w-4.5 h-4.5 text-[#FF5A1F]" /> Product Description & Overview
                  </span>
                  {openAccordion === 'description' ? <FiChevronUp className="w-4 h-4 text-slate-500" /> : <FiChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {openAccordion === 'description' && (
                  <div className="p-5 pt-1 text-slate-700 leading-relaxed text-[14px] space-y-4">
                    <p className="font-medium text-slate-800 text-[14px] sm:text-sm leading-relaxed">
                      {product.description || product.summary || 'High-quality custom print product crafted with premium finishing and industrial offset precision.'}
                    </p>

                    {/* Summary Quick Chips */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Selected Quantity</span>
                        <span className="font-extrabold text-[#0B1633] text-[14px]">{quantity.toLocaleString()} Units</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Category</span>
                        <span className="font-extrabold text-[#0B1633] text-[14px] truncate block">{product.category}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Est. Turnaround</span>
                        <span className="font-extrabold text-emerald-700 text-[14px]">{product.specs?.turnaround || product.turnaround || '24-48 Hours Express'}</span>
                      </div>
                    </div>

                    {/* Active Variant Configuration Summary */}
                    {Object.keys(selectedVariants).length > 0 && (
                      <div className="pt-2 space-y-1.5">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Selected Configuration:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(selectedVariants).map(([key, val]) => (
                            <span key={key} className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[14px] font-bold text-slate-800 flex items-center gap-1">
                              <span className="text-slate-400 font-semibold">{formatKeyToTitle(key)}:</span>
                              <span className="text-[#0B1633] font-black">{val}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* TAB 2: PRINT SPECIFICATIONS & PRE-FLIGHT RULES */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'overview' ? null : 'overview')}
                  className="w-full p-4 sm:p-5 text-left font-extrabold text-sm text-[#0B1633] flex items-center justify-between cursor-pointer border-none bg-transparent hover:bg-slate-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FiInfo className="w-4.5 h-4.5 text-[#FF5A1F]" /> Print Guidelines & File Pre-flight Rules
                  </span>
                  {openAccordion === 'overview' ? <FiChevronUp className="w-4 h-4 text-slate-500" /> : <FiChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {openAccordion === 'overview' && (
                  <div className="p-5 pt-1 text-slate-600 leading-relaxed space-y-2">
                    <p className="font-medium text-[14px]">
                      For optimal CMYK press calibration, submit artwork files with 3mm bleed margins and minimum 300 DPI resolution.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 font-medium text-[14px] text-slate-700">
                      <li>Vector PDF, AI, or PSD preferred for crisp typography and vector logos</li>
                      <li>CMYK color space (RGB files automatically converted during RIP raster processing)</li>
                      <li>Font outlines enabled or fonts embedded inside vector files</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* TAB 3: PRODUCTION TURNAROUND & SHIPPING */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full p-4 sm:p-5 text-left font-extrabold text-sm text-[#0B1633] flex items-center justify-between cursor-pointer border-none bg-transparent hover:bg-slate-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FiTruck className="w-4.5 h-4.5 text-[#FF5A1F]" /> Production Turnaround & Shipping Logistics
                  </span>
                  {openAccordion === 'shipping' ? <FiChevronUp className="w-4 h-4 text-slate-500" /> : <FiChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-5 pt-1 text-slate-600 leading-relaxed space-y-1 font-medium text-[14px]">
                    <p className="text-slate-800 font-bold">⚡ Standard Production: 3-5 business days after artwork approval.</p>
                    <p className="text-slate-800 font-bold">⚡ Same-Day Express: Select Express at checkout for 24-hour priority dispatch.</p>
                  </div>
                )}
              </div>

              {/* TAB 4: 100% QUALITY & RE-PRINT GUARANTEE */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'guarantee' ? null : 'guarantee')}
                  className="w-full p-4 sm:p-5 text-left font-extrabold text-sm text-[#0B1633] flex items-center justify-between cursor-pointer border-none bg-transparent hover:bg-slate-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FiShield className="w-4.5 h-4.5 text-[#FF5A1F]" /> 100% Quality & Re-print Guarantee
                  </span>
                  {openAccordion === 'guarantee' ? <FiChevronUp className="w-4 h-4 text-slate-500" /> : <FiChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {openAccordion === 'guarantee' && (
                  <div className="p-5 pt-1 text-slate-600 leading-relaxed font-medium text-[14px]">
  Please note that our studio holds no responsibility or liability for any defects present upon the arrival of your print order.
</div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      <ArtworkUploadModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        onConfirmUpload={handleConfirmArtworkUpload}
        productTitle={product.title || product.name}
      />
    </div>
  );
}

