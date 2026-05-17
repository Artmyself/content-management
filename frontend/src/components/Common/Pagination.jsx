import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ current, totalPages, onChange }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                disabled={current === 1}
                onClick={() => onChange(current - 1)}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium px-4">Page {current} of {totalPages}</span>
            <button
                disabled={current === totalPages}
                onClick={() => onChange(current + 1)}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};
export default Pagination;