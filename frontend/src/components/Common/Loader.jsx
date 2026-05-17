import React from 'react';

const Loader = () => (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Processing request...</p>
    </div>
);
export default Loader;