import React from 'react';
import { Maximize2, AlignJustify, AlignCenter } from 'lucide-react';

export const OrientationSection = ({ formData, setFormData }) => {
  if (formData.enableOrientation === false) return null;

  return (
    <div>
      <label className="block font-bold text-slate-700 mb-2 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
        <Maximize2 className="w-3.5 h-3.5 text-blue-500" /> Print Orientation
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, orientation: 'horizontal' })}
          className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer font-extrabold text-[13px] ${
            formData.orientation === 'horizontal'
              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
          }`}
        >
          <div className={`w-12 h-8 rounded-lg border-2 flex items-center justify-center ${
            formData.orientation === 'horizontal' ? 'border-blue-500 bg-blue-100' : 'border-slate-300 bg-slate-50'
          }`}>
            <AlignJustify className="w-5 h-4 text-blue-600" />
          </div>
          <span>Landscape</span>
          <span className="text-[10px] font-semibold text-slate-400">Width &gt; Height</span>
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, orientation: 'vertical' })}
          className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer font-extrabold text-[13px] ${
            formData.orientation === 'vertical'
              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
          }`}
        >
          <div className={`w-8 h-12 rounded-lg border-2 flex items-center justify-center ${
            formData.orientation === 'vertical' ? 'border-blue-500 bg-blue-100' : 'border-slate-300 bg-slate-50'
          }`}>
            <AlignCenter className="w-4 h-5 text-blue-600" />
          </div>
          <span>Portrait</span>
          <span className="text-[10px] font-semibold text-slate-400">Height &gt; Width</span>
        </button>
      </div>
    </div>
  );
};
