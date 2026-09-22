import React from 'react';
import { Trash2 } from 'lucide-react';

export const TechSpecsSection = ({
  formData,
  setFormData,
  newSpecKey,
  setNewSpecKey,
  newSpecVal,
  setNewSpecVal
}) => {
  if (formData.enableTechSpecs === false) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-3xs space-y-4">
      <h4 className="font-extrabold text-slate-900 text-[14px] uppercase tracking-wider text-blue-600 flex items-center justify-between">
        <span>Technical Specifications & Custom Attributes</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(formData.specs || {}).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="text"
              value={key}
              readOnly
              className="w-1/3 p-2 rounded-lg bg-slate-100 font-bold text-slate-700 text-[13px] border border-slate-200 uppercase"
            />
            <input
              type="text"
              value={val}
              onChange={(e) => {
                const updated = { ...formData.specs, [key]: e.target.value };
                setFormData({ ...formData, specs: updated });
              }}
              className="flex-1 p-2 rounded-lg bg-white font-bold text-slate-900 text-[13px] border border-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                const updated = { ...formData.specs };
                delete updated[key];
                setFormData({ ...formData, specs: updated });
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border-none bg-transparent cursor-pointer"
              title="Remove attribute"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Spec Row */}
      <div className="flex items-center gap-2 pt-2 border-t border-dashed border-slate-200">
        <input
          type="text"
          value={newSpecKey}
          onChange={(e) => setNewSpecKey(e.target.value)}
          placeholder="Spec Name (e.g. turnaround)"
          className="w-1/3 p-2 rounded-xl border border-slate-200 font-bold text-[13px] focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={newSpecVal}
          onChange={(e) => setNewSpecVal(e.target.value)}
          placeholder="Spec Value (e.g. 24 Hours)"
          className="flex-1 p-2 rounded-xl border border-slate-200 font-bold text-[13px] focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => {
            if (newSpecKey.trim() && newSpecVal.trim()) {
              setFormData({
                ...formData,
                specs: { ...formData.specs, [newSpecKey.trim()]: newSpecVal.trim() }
              });
              setNewSpecKey('');
              setNewSpecVal('');
            }
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-[13px] hover:bg-blue-700 cursor-pointer border-none shadow-3xs"
        >
          Add Spec
        </button>
      </div>
    </div>
  );
};
