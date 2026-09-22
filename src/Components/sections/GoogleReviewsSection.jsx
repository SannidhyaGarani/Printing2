import React from 'react';
import { FiStar, FiCheckCircle, FiExternalLink, FiMessageSquare } from 'react-icons/fi';

const REVIEWS_DATA = [
  {
    id: 1,
    name: 'Rahul Sharma',
    avatar: 'R',
    color: 'bg-blue-600',
    rating: 5,
    date: '1 week ago',
    verified: true,
    review: 'Ordered 500 Velvet Soft-Touch Business Cards. The quality is exceptional! Colors are super vibrant and the soft touch texture feels extremely luxury. Delivery was delivered within 48 hours.',
  },
  {
    id: 2,
    name: 'Ananya Verma',
    avatar: 'A',
    color: 'bg-[#EA580C]',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    review: 'Got our corporate polo t-shirts and custom NCR bill books printed. Pristine print alignment, crisp details and prompt WhatsApp design support. Highly recommended for bulk business printing!',
  },
  {
    id: 3,
    name: 'Vikram Patel',
    avatar: 'V',
    color: 'bg-emerald-600',
    rating: 5,
    date: '1 month ago',
    verified: true,
    review: 'Spot UV cards and flex banners turned out amazing. The online calculator makes pricing so transparent. Will definitely order all our event promotional materials from here.',
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    avatar: 'S',
    color: 'bg-purple-600',
    rating: 5,
    date: '1 month ago',
    verified: true,
    review: 'Fantastic customer service and high-grade paper quality. The foil stamping on our wedding invitation cards was stunning. Thanks to the team for quick dispatch!',
  }
];

export function GoogleReviewsSection() {
  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-1">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified Google Reviews
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Google Reviews
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              Trusted by 10,000+ businesses & individuals across India
            </p>
          </div>

          {/* Rating Summary Box */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0">
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">4.7</div>
              <div className="flex items-center text-amber-400 justify-center mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>
            <div className="border-l border-slate-200 pl-4 text-xs font-bold text-slate-600 space-y-0.5">
              <div className="text-slate-900 font-extrabold text-sm">226+ Reviews</div>
              <div className="text-emerald-600 flex items-center gap-1">
                <FiCheckCircle className="w-3.5 h-3.5" /> 98% Positive Feedback
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex flex-col justify-between space-y-4 hover:border-orange-300 transition-colors"
            >
              <div className="space-y-3">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${item.color} text-white font-black text-base flex items-center justify-center shadow-xs`}>
                      {item.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <span className="text-[11px] text-slate-400 font-medium block">{item.date}</span>
                    </div>
                  </div>
                  {item.verified && (
                    <span className="text-emerald-600" title="Verified Customer">
                      <FiCheckCircle className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <FiStar key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                  "{item.review}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Google Review</span>
                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                  ✓ Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition border-none text-decoration-none"
          >
            See all Google Reviews <FiExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-300 shadow-3xs transition text-decoration-none"
          >
            <FiMessageSquare className="w-4 h-4 text-[#EA580C]" /> Leave a Review
          </a>
        </div>

      </div>
    </section>
  );
}
