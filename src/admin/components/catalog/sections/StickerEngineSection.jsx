import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

export const StickerEngineSection = ({ formData, setFormData }) => {
  if (!formData.enableStickerEngine) return null;

  const stickerConfig = formData.stickerConfig || {
    inkType: 'White Ink Underprint',
    cutType: 'Custom Die-Cut Single',
    whiteInkMode: 'Underprint Layer + Full CMYK Color',
    borderMarginMm: 2
  };

  const updateSticker = (key, val) => {
    setFormData({
      ...formData,
      stickerConfig: { ...stickerConfig, [key]: val }
    });
  };

  return (
    <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 shadow-3xs space-y-4">
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
        <h4 className="font-extrabold text-amber-900 text-[14px] uppercase tracking-wider flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-600" />
          Sticker White Ink & Die-Cut Engine
        </h4>
        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
          Clear Vinyl & White Ink Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Sticker Material & Ink Type
          </label>
          <select
            value={stickerConfig.inkType}
            onChange={(e) => updateSticker('inkType', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-amber-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-amber-600"
          >
            <option value="White Vinyl Standard">White Vinyl Vinyl (Standard Full Color)</option>
            <option value="Clear Transparent Vinyl">Clear Transparent Vinyl (Requires White Ink)</option>
            <option value="Holographic Foil Vinyl">Holographic Rainbow Foil Vinyl</option>
            <option value="Metallic Gold Vinyl">Metallic Gold / Silver Vinyl</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Die-Cut Format & Sheet Option
          </label>
          <select
            value={stickerConfig.cutType}
            onChange={(e) => updateSticker('cutType', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-amber-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-amber-600"
          >
            <option value="Custom Die-Cut Single">Custom Die-Cut Single Stickers (Individually Cut)</option>
            <option value="Kiss-Cut Sheet (Peel-Off)">Kiss-Cut Sticker Sheet (Multiple on A4/A5 Sheet)</option>
            <option value="Roll Format (Machine Label)">Roll Labels (For Packaging Machines)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            White Ink Mode Options
          </label>
          <select
            value={stickerConfig.whiteInkMode}
            onChange={(e) => updateSticker('whiteInkMode', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-amber-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-amber-600"
          >
            <option value="Underprint Layer + Full CMYK Color">White Underprint Layer + CMYK Color (Opaque Color)</option>
            <option value="White Ink Only (Monochrome White)">White Ink Only (Pure White Artwork on Clear)</option>
            <option value="Selective White Mask">Selective White Mask (Transparent Windows in Art)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            White Border Outline Margin (mm)
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="10"
            value={stickerConfig.borderMarginMm}
            onChange={(e) => updateSticker('borderMarginMm', parseFloat(e.target.value) || 0)}
            className="w-full p-2.5 rounded-xl border border-amber-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-amber-600"
            placeholder="e.g. 2mm"
          />
        </div>
      </div>
    </div>
  );
};
