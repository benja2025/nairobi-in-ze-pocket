import React from 'react';

export const DirectorySkeleton: React.FC = () => {
  return (
    <div className="space-y-6 pb-24 animate-pulse">
      {/* Banner Skeleton */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 bg-slate-900 border-slate-800 h-36" />

      {/* FilterBar Skeleton */}
      <div className="space-y-3">
        <div className="h-10 rounded-xl bg-slate-800/80 border border-slate-700/50" />
        <div className="flex gap-2 overflow-x-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 shrink-0 rounded-full bg-slate-800/60" />
          ))}
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="glass-panel rounded-2xl p-5 h-48 bg-slate-900/60 border-slate-800/80 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-20 rounded-full bg-slate-800" />
                <div className="h-5 w-24 rounded-full bg-slate-800" />
              </div>
              <div className="h-6 w-3/4 rounded bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-800/60" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-8 rounded-xl bg-slate-800" />
              <div className="h-8 rounded-xl bg-slate-800" />
              <div className="h-8 rounded-xl bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 pb-24 animate-pulse">
      <div className="glass-panel rounded-2xl p-6 bg-slate-900 border-slate-800 h-40" />
      <div className="glass-panel rounded-2xl p-6 bg-slate-900 border-slate-800 h-64" />
    </div>
  );
};
