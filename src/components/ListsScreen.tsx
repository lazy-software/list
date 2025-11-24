import React, { useState } from 'react';
import type { TodoList } from '../types';

interface ListsScreenProps {
    lists: TodoList[];
    activeListId: string | null;
    onAddList: (name: string) => void;
    onDeleteList: (id: string) => void;
    onSelectList: (id: string) => void;
}

export function ListsScreen({
    lists,
    activeListId,
    onAddList,
    onDeleteList,
    onSelectList,
}: ListsScreenProps) {
    const [newListName, setNewListName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newListName.trim()) {
            onAddList(newListName);
            setNewListName('');
        }
    };

    return (
        <div className="p-4 pb-24 max-w-md mx-auto w-full">
            <form onSubmit={handleSubmit} className="mb-8">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Create list..."
                    enterKeyHint="done"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                />
            </form>

            <div className="space-y-3">
                {lists.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                        No lists yet. Create one above!
                    </p>
                ) : (
                    lists.map((list) => (
                        <div
                            key={list.id}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${activeListId === list.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                        >
                            <label className="flex items-center flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="activeList"
                                    checked={activeListId === list.id}
                                    onChange={() => onSelectList(list.id)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                />
                                <span className={`ml-3 font-medium ${activeListId === list.id ? 'text-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'
                                    }`}>
                                    {list.name}
                                </span>
                                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                    {list.items.length}
                                </span>
                            </label>

                            <button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete "${list.name}"?`)) {
                                        onDeleteList(list.id);
                                    }
                                }}
                                className="ml-4 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete list"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
