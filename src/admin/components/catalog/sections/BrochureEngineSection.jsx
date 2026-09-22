import React from 'react';
import { BookOpen, Folders } from 'lucide-react';

export const BrochureEngineSection = ({ formData, setFormData }) => {
  if (!formData.enableBrochureEngine) return null;

  const brochureConfig = formData.brochureConfig || {
    foldType: 'Tri-Fold (C-Fold)',
    creasingRequired: true,
    flatUnfoldedSize: 'A4 (297 x 210mm)',
    foldedPanelCount: 6
  };

  const updateBrochure = (key, val) => {
    setFormData({
      ...formData,
      brochureConfig: { ...brochureConfig, [key]: val }
    });
  };

  return (
    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-200/80 shadow-3xs space-y-4">
      <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2.5">
        <h4 className="font-extrabold text-indigo-900 text-[14px] uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          Brochure & Leaflet Folds Engine
        </h4>
        <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-300">
          Fold Pattern Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Fold Pattern Type
          </label>
          <select
            value={brochureConfig.foldType}
            onChange={(e) => updateBrochure('foldType', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-indigo-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="Half Fold (Bi-Fold)">Half Fold / Bi-Fold (4 Printed Panels)</option>
            <option value="Tri-Fold (C-Fold)">Tri-Fold / Letter C-Fold (6 Printed Panels)</option>
            <option value="Z-Fold (Accordion)">Z-Fold / Accordion Fold (6 Printed Panels)</option>
            <option value="Gate Fold">Gate Fold (6 Printed Panels)</option>
            <option value="Double Parallel Fold">Double Parallel Fold (8 Printed Panels)</option>
            <option value="No Fold (Flat Flysheet)">No Fold (Flat Sheet)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Flat Unfolded Sheet Size
          </label>
          <select
            value={brochureConfig.flatUnfoldedSize}
            onChange={(e) => updateBrochure('flatUnfoldedSize', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-indigo-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="A4 (297 x 210mm)">A4 Sheet (297 x 210mm)</option>
            <option value="A3 (420 x 297mm)">A3 Oversized (420 x 297mm)</option>
            <option value="A5 (210 x 148mm)">A5 Sheet (210 x 148mm)</option>
            <option value="DL Flat (297 x 210mm)">DL Tri-Fold Flat (297 x 210mm)</option>
          </select>
        </div>

        <div className="md:col-span-2 flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200">
          <div>
            <span className="font-extrabold text-[13px] text-indigo-950 flex items-center gap-1.5">
              <Folders className="w-4 h-4 text-indigo-600" /> Automated Machine Creasing & Scoring
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Prevents paper cracking along fold lines on 170+ GSM cardstocks</p>
          </div>
          <button
            type="button"
            onClick={() => updateBrochure('creasingRequired', !brochureConfig.creasingRequired)}
            className={`px-4 py-2 rounded-xl text-[12px] font-black cursor-pointer border transition ${
              brochureConfig.creasingRequired
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {brochureConfig.creasingRequired ? 'CREASING INCLUDED' : 'NO CREASING'}
          </button>
        </div>
      </div>
    </div>
  );
};
