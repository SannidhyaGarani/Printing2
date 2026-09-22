import React from 'react';
import { FileSpreadsheet, Check } from 'lucide-react';

export const NcrEngineSection = ({ formData, setFormData }) => {
  if (!formData.enableNcrEngine) return null;

  const ncrConfig = formData.ncrConfig || {
    parts: 'Duplicate (2-Part)',
    paperColors: 'Top White, Bottom Pink',
    numbering: true,
    startNumber: 1001,
    binding: 'Stapled & Perforated Book'
  };

  const updateNcr = (key, val) => {
    setFormData({
      ...formData,
      ncrConfig: { ...ncrConfig, [key]: val }
    });
  };

  return (
    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/80 shadow-3xs space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2.5">
        <h4 className="font-extrabold text-emerald-900 text-[14px] uppercase tracking-wider flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          NCR Bill Book Engine Settings
        </h4>
        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
          Carbonless Receipt Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Copy Parts / Sets
          </label>
          <select
            value={ncrConfig.parts}
            onChange={(e) => updateNcr('parts', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-emerald-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="Duplicate (2-Part)">Duplicate (1 + 1 = 2 Parts)</option>
            <option value="Triplicate (3-Part)">Triplicate (1 + 2 = 3 Parts)</option>
            <option value="Quadruplicate (4-Part)">Quadruplicate (1 + 3 = 4 Parts)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Paper Color Sequence
          </label>
          <select
            value={ncrConfig.paperColors}
            onChange={(e) => updateNcr('paperColors', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-emerald-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="Top White, Bottom Pink">Top White / Bottom Pink (Standard 2-Part)</option>
            <option value="Top White, Bottom Yellow">Top White / Bottom Yellow</option>
            <option value="Top White, Middle Pink, Bottom Yellow">Top White / Middle Pink / Bottom Yellow (3-Part)</option>
            <option value="Top White, Pink, Yellow, Blue">Top White / Pink / Yellow / Blue (4-Part)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Sequential Serial Numbering
          </label>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-emerald-200">
            <button
              type="button"
              onClick={() => updateNcr('numbering', !ncrConfig.numbering)}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold border cursor-pointer transition ${
                ncrConfig.numbering
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {ncrConfig.numbering ? '✓ Numbering Included' : 'No Numbering'}
            </button>
            {ncrConfig.numbering && (
              <div className="flex items-center gap-1 flex-1">
                <span className="text-[11px] font-bold text-slate-500">Start #:</span>
                <input
                  type="number"
                  value={ncrConfig.startNumber || 1001}
                  onChange={(e) => updateNcr('startNumber', parseInt(e.target.value) || 1)}
                  className="w-full p-1.5 rounded-md border border-slate-200 font-bold text-[13px]"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
            Binding & Book Finish
          </label>
          <select
            value={ncrConfig.binding}
            onChange={(e) => updateNcr('binding', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-emerald-300 font-bold text-slate-800 text-[13.5px] bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="Stapled & Perforated Book">Stapled Book + Perforation + Craft Cover</option>
            <option value="Pad Binding (Top Glue)">Pad Binding (Top Glued Tear-Off)</option>
            <option value="Loose Sets in Pack">Loose Sets Pack (Unbound)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
