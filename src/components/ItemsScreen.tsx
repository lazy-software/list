import React, { useState } from 'react';
import type { TodoList } from '../types';

interface ItemsScreenProps {
    activeList: TodoList | null;
    onAddItem: (text: string) => void;
    onToggleItem: (itemId: string) => void;
    onDeleteCompleted: () => void;
}

export function ItemsScreen({
    activeList,
    onAddItem,
    onToggleItem,
    onDeleteCompleted,
}: ItemsScreenProps) {
    const [newItemText, setNewItemText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemText.trim()) {
            onAddItem(newItemText);
            setNewItemText('');
        }
    };

    if (!activeList) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No List Selected</h2>
                <p className="text-gray-500">Go to the Lists tab to create or select a list.</p>
            </div>
        );
    }

    const completedCount = activeList.items.filter(i => i.completed).length;

    return (
        <div className="p-4 pb-24 max-w-md mx-auto w-full">
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder={`Add item to ${activeList.name}...`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </form>

            <div className="space-y-2 mb-8">
                {activeList.items.length === 0 ? (
                    <p className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        List is empty. Add an item above!
                    </p>
                ) : (
                    activeList.items.map((item) => (
                        <label
                            key={item.id}
                            className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${item.completed
                                ? 'bg-gray-50 border-gray-200'
                                : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => onToggleItem(item.id)}
                                className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                            />
                            <span className={`ml-3 flex-1 text-lg ${item.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                                }`}>
                                {item.text}
                            </span>
                        </label>
                    ))
                )}
            </div>

            {completedCount > 0 && (
                <button
                    onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${completedCount} completed item${completedCount !== 1 ? 's' : ''}?`)) {
                            onDeleteCompleted();
                        }
                    }}
                    className="w-full py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors border border-red-100"
                >
                    Remove {completedCount} Checked Item{completedCount !== 1 ? 's' : ''}
                </button>
            )}
        </div>
    );
}
