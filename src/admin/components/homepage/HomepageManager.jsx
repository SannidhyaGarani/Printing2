import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Save, 
  CheckCircle2, 
  Grid, 
  Plus, 
  Trash2, 
  Eye, 
  Layers, 
  Type, 
  Star, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { uploadToCloudinary } from '../../../services/cloudinary';

export const HomepageManager = () => {
  const { homepageSettings, updateHomepageSettings } = useAdmin();
  
  const [formData, setFormData] = useState(homepageSettings || {});
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'categories', 'preview'
  const [uploadingField, setUploadingField] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if context changes
  React.useEffect(() => {
    if (homepageSettings) {
      setFormData(homepageSettings);
    }
  }, [homepageSettings]);

  // Cloudinary image upload handler for single banner image
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField('heroBanner');
    const res = await uploadToCloudinary(file, 'homepage');
    if (res.success) {
      setFormData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          bannerImage: res.url
        }
      }));
    }
    setUploadingField(null);
  };

  // Cloudinary image upload handler for category card images
  const handleCatImageUpload = async (e, catIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField(`catImage_${catIndex}`);
    const res = await uploadToCloudinary(file, 'homepage_categories');
    if (res.success) {
      setFormData(prev => {
        const updatedCats = [...(prev.categoriesSection?.categories || [])];
        updatedCats[catIndex] = {
          ...updatedCats[catIndex],
          img: res.url
        };
        return {
          ...prev,
          categoriesSection: {
            ...prev.categoriesSection,
            categories: updatedCats
          }
        };
      });
    }
    setUploadingField(null);
  };

  const handleSave = async () => {
    await updateHomepageSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addCategoryCard = () => {
    const currentCats = formData.categoriesSection?.categories || [];
    const newCat = {
      id: `cat_${Date.now()}`,
      name: 'New Custom Category',
      sub: 'Custom high-precision print products & packaging',
      img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
      iconName: 'FiBox'
    };
    setFormData(prev => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection,
        categories: [...currentCats, newCat]
      }
    }));
  };

  const removeCategoryCard = (index) => {
    setFormData(prev => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection,
        categories: prev.categoriesSection.categories.filter((_, idx) => idx !== index)
      }
    }));
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md">
              Storefront Customization Studio
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Homepage Banner & Category Manager
          </h2>
          <p className="text-[14px] text-slate-300 max-w-2xl mt-1 font-medium">
            Customize hero headline banners, Cloudinary showcase images, and Category section cards synced directly with Firebase real-time database.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-[#FF5A1F] hover:bg-[#e44d15] text-white font-extrabold text-[14px] flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/30 transition cursor-pointer border-none"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" /> Saved to Firebase!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save & Publish Live
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'hero'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> 1. Hero Banner Studio
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-4 h-4" /> 2. Category Section Studio ({formData.categoriesSection?.categories?.length || 0} Cards)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition flex items-center gap-2 cursor-pointer border ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4" /> 3. Live Customer Storefront Preview
        </button>
      </div>

      {/* TAB 1: HERO BANNER STUDIO */}
      {activeTab === 'hero' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Type className="w-4 h-4" /> Main Hero Banner Copy & Headline Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Eyebrow Badge Text</label>
                <input
                  type="text"
                  value={formData.hero?.eyebrowText || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, eyebrowText: e.target.value }
                  })}
                  placeholder="e.g. Enterprise Print & Packaging"
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Verified Quality Badge</label>
                <input
                  type="text"
                  value={formData.hero?.badgeText || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, badgeText: e.target.value }
                  })}
                  placeholder="e.g. Verified High-Resolution Output"
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Headline Line 1</label>
                <input
                  type="text"
                  value={formData.hero?.headlineLine1 || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, headlineLine1: e.target.value }
                  })}
                  placeholder="e.g. Print Your Imagination,"
                  className="w-full p-3 rounded-xl border border-slate-200 font-extrabold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Headline Line 2 (Highlighted Orange)</label>
                <input
                  type="text"
                  value={formData.hero?.headlineLine2 || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, headlineLine2: e.target.value }
                  })}
                  placeholder="e.g. Perfected."
                  className="w-full p-3 rounded-xl border border-slate-200 font-extrabold text-[#FF5A1F] focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Subheading / Description</label>
                <textarea
                  rows={3}
                  value={formData.hero?.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value }
                  })}
                  placeholder="Detailed value proposition..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Primary Button Text</label>
                <input
                  type="text"
                  value={formData.hero?.primaryCtaText || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, primaryCtaText: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Secondary Button Text</label>
                <input
                  type="text"
                  value={formData.hero?.secondaryCtaText || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, secondaryCtaText: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Cloudinary Hero Banner Image Upload Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ImageIcon className="w-4 h-4" /> Cloudinary Hero Banner Showcase Image
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative shadow-md">
                <img
                  src={formData.hero?.bannerImage}
                  alt="Hero Banner Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20">
                  Live Banner Preview
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-[14px]">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Image Cloudinary URL</label>
                  <input
                    type="text"
                    value={formData.hero?.bannerImage || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, bannerImage: e.target.value }
                    })}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono text-[14px] text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[14px] flex items-center gap-2 cursor-pointer transition shadow-md shadow-blue-500/20">
                    <Upload className="w-4 h-4" />
                    {uploadingField === 'heroBanner' ? 'Uploading to Cloudinary...' : 'Upload New Hero Banner Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Auto uploads via Cloudinary preset print85</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">Showcase Card Title</label>
                    <input
                      type="text"
                      value={formData.hero?.productTitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        hero: { ...formData.hero, productTitle: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">Showcase Card Subtitle</label>
                    <input
                      type="text"
                      value={formData.hero?.productSubtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        hero: { ...formData.hero, productSubtitle: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY SECTION STUDIO */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Grid className="w-4 h-4" /> Category Section Titles & Description
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Section Eyebrow Badge</label>
                <input
                  type="text"
                  value={formData.categoriesSection?.badgeText || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    categoriesSection: { ...formData.categoriesSection, badgeText: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Heading Prefix</label>
                <input
                  type="text"
                  value={formData.categoriesSection?.headingLine1 || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    categoriesSection: { ...formData.categoriesSection, headingLine1: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Heading Highlight (Orange)</label>
                <input
                  type="text"
                  value={formData.categoriesSection?.headingHighlight || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    categoriesSection: { ...formData.categoriesSection, headingHighlight: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-bold text-[#FF5A1F] focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">Section Subtitle Description</label>
                <textarea
                  rows={2}
                  value={formData.categoriesSection?.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    categoriesSection: { ...formData.categoriesSection, description: e.target.value }
                  })}
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Category Cards Grid & Cloudinary Image Uploaders */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Category Grid Display Cards ({formData.categoriesSection?.categories?.length || 0})
              </h3>
              <button
                type="button"
                onClick={addCategoryCard}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-extrabold text-[14px] flex items-center gap-1.5 border border-blue-200 cursor-pointer shadow-3xs"
              >
                <Plus className="w-4 h-4" /> Add New Category Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.categoriesSection?.categories || []).map((cat, idx) => (
                <div key={cat.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      Card #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCategoryCard(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer transition"
                      title="Delete Category Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-200 shrink-0 relative group">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-slate-950/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-[9px] font-bold p-1 text-center">
                        <Upload className="w-4 h-4 mb-0.5" />
                        {uploadingField === `catImage_${idx}` ? 'Uploading...' : 'Change Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCatImageUpload(e, idx)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex-1 space-y-2 text-[14px]">
                      <div>
                        <label className="block font-bold text-slate-600 text-[10px] uppercase">Category Name</label>
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => {
                            const newCats = [...formData.categoriesSection.categories];
                            newCats[idx].name = e.target.value;
                            setFormData({
                              ...formData,
                              categoriesSection: { ...formData.categoriesSection, categories: newCats }
                            });
                          }}
                          className="w-full p-2 rounded-lg border border-slate-200 font-extrabold text-slate-900 bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 text-[10px] uppercase">Subtitle Text</label>
                        <input
                          type="text"
                          value={cat.sub}
                          onChange={(e) => {
                            const newCats = [...formData.categoriesSection.categories];
                            newCats[idx].sub = e.target.value;
                            setFormData({
                              ...formData,
                              categoriesSection: { ...formData.categoriesSection, categories: newCats }
                            });
                          }}
                          className="w-full p-2 rounded-lg border border-slate-200 font-medium text-slate-700 bg-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 text-[10px] uppercase mb-1">Image Cloudinary URL</label>
                    <input
                      type="text"
                      value={cat.img}
                      onChange={(e) => {
                        const newCats = [...formData.categoriesSection.categories];
                        newCats[idx].img = e.target.value;
                        setFormData({
                          ...formData,
                          categoriesSection: { ...formData.categoriesSection, categories: newCats }
                        });
                      }}
                      className="w-full p-2 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-600 bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE CUSTOMER STOREFRONT PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-2xl space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-extrabold text-[14px] text-slate-300 uppercase tracking-widest">
                  Live Customer View Mockup
                </span>
              </div>
              <span className="text-[14px] text-slate-400 font-mono">Real-time preview mode</span>
            </div>

            {/* Mock Hero Section */}
            <div className="bg-[#07152F] rounded-2xl p-6 border border-slate-800 space-y-6">
              <span className="bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full inline-block">
                {formData.hero?.eyebrowText}
              </span>

              <h1 className="text-3xl font-bold text-white leading-snug">
                {formData.hero?.headlineLine1} <br />
                <span className="text-[#FF5A1F]">{formData.hero?.headlineLine2}</span>
              </h1>

              <p className="text-[14px] text-slate-400 max-w-xl">
                {formData.hero?.description}
              </p>

              <div className="flex items-center gap-3">
                <button type="button" className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] text-white font-bold text-[14px] border-none">
                  {formData.hero?.primaryCtaText}
                </button>
                <button type="button" className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-[14px] border border-white/20">
                  {formData.hero?.secondaryCtaText}
                </button>
              </div>

              {/* Showcase image mockup */}
              <div className="mt-4 rounded-xl overflow-hidden h-48 border border-white/20 relative">
                <img src={formData.hero?.bannerImage} alt="Hero showcase" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs p-2 rounded-lg text-[10px]">
                  <p className="font-bold text-white">{formData.hero?.productTitle}</p>
                  <p className="text-slate-300">{formData.hero?.productSubtitle}</p>
                </div>
              </div>
            </div>

            {/* Mock Categories Section */}
            <div className="space-y-4">
              <div>
                <span className="text-[#FF5A1F] text-[10px] font-extrabold uppercase tracking-widest">
                  {formData.categoriesSection?.badgeText}
                </span>
                <h2 className="text-xl font-bold text-white">
                  {formData.categoriesSection?.headingLine1} <span className="text-[#FF5A1F]">{formData.categoriesSection?.headingHighlight}</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(formData.categoriesSection?.categories || []).map((cat, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl p-2.5 border border-slate-700 space-y-2">
                    <div className="h-24 rounded-lg overflow-hidden bg-slate-900">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-[14px] text-white truncate">{cat.name}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{cat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
