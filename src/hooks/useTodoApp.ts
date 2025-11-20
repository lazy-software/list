import { useState, useEffect } from 'react';
import type { AppState, TodoList, TodoItem } from '../types';

const STORAGE_KEY = 'todo-app-data';

export function useTodoApp() {
    const [state, setState] = useState<AppState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved state', e);
            }
        }
        return { lists: [], activeListId: null };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const addList = (name: string) => {
        if (!name.trim()) return;
        const newList: TodoList = {
            id: crypto.randomUUID(),
            name: name.trim(),
            items: []
        };
        setState(prev => ({
            ...prev,
            lists: [...prev.lists, newList],
            activeListId: prev.activeListId || newList.id
        }));
    };

    const deleteList = (id: string) => {
        setState(prev => {
            const newLists = prev.lists.filter(l => l.id !== id);
            let newActiveId = prev.activeListId;
            if (id === prev.activeListId) {
                newActiveId = newLists.length > 0 ? newLists[0].id : null;
            }
            return {
                ...prev,
                lists: newLists,
                activeListId: newActiveId
            };
        });
    };

    const setActiveList = (id: string) => {
        setState(prev => ({ ...prev, activeListId: id }));
    };

    const addItem = (text: string) => {
        if (!state.activeListId || !text.trim()) return;
        const newItem: TodoItem = {
            id: crypto.randomUUID(),
            text: text.trim(),
            completed: false
        };
        setState(prev => ({
            ...prev,
            lists: prev.lists.map(list =>
                list.id === prev.activeListId
                    ? { ...list, items: [...list.items, newItem] }
                    : list
            )
        }));
    };

    const toggleItem = (itemId: string) => {
        if (!state.activeListId) return;
        setState(prev => ({
            ...prev,
            lists: prev.lists.map(list =>
                list.id === prev.activeListId
                    ? {
                        ...list,
                        items: list.items.map(item =>
                            item.id === itemId ? { ...item, completed: !item.completed } : item
                        )
                    }
                    : list
            )
        }));
    };

    const deleteCompletedItems = () => {
        if (!state.activeListId) return;
        setState(prev => ({
            ...prev,
            lists: prev.lists.map(list =>
                list.id === prev.activeListId
                    ? { ...list, items: list.items.filter(item => !item.completed) }
                    : list
            )
        }));
    };

    const sortedLists = [...state.lists].sort((a, b) => a.name.localeCompare(b.name));

    const activeList = state.lists.find(l => l.id === state.activeListId) || null;
    const sortedActiveList = activeList
        ? { ...activeList, items: [...activeList.items].sort((a, b) => a.text.localeCompare(b.text)) }
        : null;

    return {
        lists: sortedLists,
        activeListId: state.activeListId,
        activeList: sortedActiveList,
        addList,
        deleteList,
        setActiveList,
        addItem,
        toggleItem,
        deleteCompletedItems
    };
}
