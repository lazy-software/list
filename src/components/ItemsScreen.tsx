import React, { useState } from 'react';
import type { TodoList } from '../types';

interface ItemsScreenProps {
    activeList: TodoList | null;
    onAddItem: (text: string) => void;
    onToggleItem: (itemId: string) => void;
}

export function ItemsScreen({
    activeList,
    onAddItem,
    onToggleItem,
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
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No List Selected</h2>
                <p className="text-gray-500 dark:text-gray-400">Go to the Lists tab to create or select a list.</p>
            </div>
        );
    }



    return (
        <div className="p-4 pb-12 max-w-md mx-auto w-full">
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder={`Add item to ${activeList.name}...`}
                    enterKeyHint="done"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                />
            </form>

            <div className="space-y-2 mb-8">
                {activeList.items.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                        List is empty. Add an item above!
                    </p>
                ) : (
                    activeList.items.map((item) => (
                        <label
                            key={item.id}
                            className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${item.completed
                                ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => onToggleItem(item.id)}
                                className="w-6 h-6 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 transition-colors"
                            />
                            <span className={`ml-3 flex-1 text-lg ${item.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                {item.text}
                            </span>
                        </label>
                    ))
                )}
            </div>

        </div>
    );
}
