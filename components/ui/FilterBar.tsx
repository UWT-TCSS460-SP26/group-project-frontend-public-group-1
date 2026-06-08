"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./Button";
import { Input } from "./Input";

interface FilterBarProps {
  currentSort: string;
  currentOrder: string;
  currentAfter: string;
  currentBefore: string;
  baseUrl: string;
  options: { value: string; label: string }[];
}

export const FilterBar = ({ 
  currentSort, 
  currentOrder, 
  currentAfter, 
  currentBefore,
  baseUrl, 
  options 
}: FilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const hasActiveFilters = currentAfter || currentBefore || currentSort !== 'popularity' || currentOrder !== 'desc';

  return (
    <div className="w-full bg-surface/30 border border-border rounded-2xl p-6 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Sorting & Order */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.1em]">Sort Results By</label>
          <div className="flex gap-2">
            <select 
              value={currentSort}
              className="flex-grow bg-surface border border-border text-text-primary rounded-xl px-4 py-2.5 text-sm outline-hidden focus:border-brand-blue transition-colors cursor-pointer"
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="flex bg-surface border border-border rounded-xl p-1">
              <Button 
                variant={currentOrder === "asc" ? "secondary" : "ghost"} 
                size="sm" 
                className="px-4 py-1 text-[10px] rounded-lg h-full"
                onClick={() => updateParams({ order: "asc" })}
              >
                ASC
              </Button>
              <Button 
                variant={currentOrder === "desc" ? "secondary" : "ghost"} 
                size="sm" 
                className="px-4 py-1 text-[10px] rounded-lg h-full"
                onClick={() => updateParams({ order: "desc" })}
              >
                DESC
              </Button>
            </div>
          </div>
        </div>

        {/* Year Filters */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.1em]">Release Period</label>
          <div className="flex items-center gap-3">
            <Input 
              type="number" 
              placeholder="After Year" 
              defaultValue={currentAfter}
              className="flex-1 py-2.5 text-sm rounded-xl text-center"
              onBlur={(e) => updateParams({ after: e.target.value })}
            />
            <span className="text-text-muted text-xs font-bold font-mono">TO</span>
            <Input 
              type="number" 
              placeholder="Before Year" 
              defaultValue={currentBefore}
              className="flex-1 py-2.5 text-sm rounded-xl text-center"
              onBlur={(e) => updateParams({ before: e.target.value })}
            />
          </div>
        </div>

        {/* Reset Actions */}
        <div className="flex items-end pb-0.5">
          {hasActiveFilters ? (
            <Button 
              variant="outline" 
              className="w-full py-2.5 border-red-900/30 text-red-400 hover:bg-red-950/20 hover:border-red-500/50 uppercase text-xs font-black tracking-widest transition-all"
              onClick={() => router.push(baseUrl)}
            >
              Reset All Filters
            </Button>
          ) : (
             <div className="w-full py-2.5 text-center text-text-muted text-[10px] uppercase font-bold tracking-widest border border-dashed border-border rounded-xl">
               No Filters Active
             </div>
          )}
        </div>

      </div>
    </div>
  );
};
