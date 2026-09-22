import React from 'react';
import { FileText, Tag } from 'lucide-react';

export const PaperSizesSection = ({ formData, setFormData }) => {
  if (formData.enablePaperSizes === false) return null;

  const sizesList = ['A3', 'A4', 'A5', 'A6', 'DL', 'Letter', 'Legal', '1/3 Size', '1/4 Size', '1/6 Size', 'Custom'];

  return (
    <div>
      <label className="block font-bold text-slate-700 mb-2 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-blue-500" /> Paper Sizes Supported
      </label>
      <div className="flex flex-wrap gap-2">
        {sizesList.map((size) => {
          const isSelected = (formData.paperSizes || []).includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => {
                const current = formData.paperSizes || [];
                const updated = isSelected
                  ? current.filter(s => s !== size)
                  : [...current, size];
                setFormData({ ...formData, paperSizes: updated });
              }}
              className={`px-3 py-1.5 rounded-xl border-2 font-extrabold text-[12px] transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              <Tag className="w-3 h-3" />
              {size}
            </button>
          );
        })}
      </div>
      {(formData.paperSizes || []).length > 0 && (
        <p className="mt-2 text-[11px] text-slate-500 font-medium">
          Selected: <span className="font-bold text-blue-600">{(formData.paperSizes || []).join(', ')}</span>
        </p>
      )}
    </div>
  );
};
