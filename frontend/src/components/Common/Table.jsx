import React from 'react';
import { Search } from 'lucide-react';

const Table = ({ columns, data, onSearch, title, actions, loading }) => {
    return (
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm w-64"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    {actions}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={columns.length} className="p-10 text-center text-slate-400">Loading records...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={columns.length} className="p-10 text-center text-slate-400">No records found.</td></tr>
                        ) : data.map((row, i) => (
                            <tr key={row.id || i} className="hover:bg-slate-50 transition-colors">
                                {columns.map(col => (
                                    <td key={col.key} className="p-4 text-sm text-slate-600">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default Table;