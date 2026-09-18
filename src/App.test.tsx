import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';
import { encodeList } from './utils/share';

describe('App composer focus', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.replaceState({}, '', '/');
        localStorage.setItem('todo-app-data', JSON.stringify({
            lists: [{ id: '1', name: 'Groceries', items: [] }],
            activeListId: '1',
        }));
    });

    afterEach(() => {
        window.history.replaceState({}, '', '/');
    });

    it('focuses the add-item field when clicking the list area', () => {
        render(<App />);

        const composer = screen.getByLabelText('Add item to Groceries');
        composer.blur();
        expect(composer).not.toHaveFocus();

        fireEvent.click(screen.getByText('List is empty. Add an item above!'));
        expect(composer).toHaveFocus();
    });
});

describe('App share links', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.replaceState({}, '', '/');
    });

    afterEach(() => {
        window.history.replaceState({}, '', '/');
    });

    it('imports a shared list from the URL without installing the PWA', () => {
        const shared = {
            id: 'shared-id',
            name: 'Shared Groceries',
            items: [{ id: 'item-1', text: 'Milk', completed: false }],
        };
        window.history.pushState({}, '', `/?data=${encodeList(shared)}`);

        render(<App />);

        expect(screen.getByLabelText('Add item to Shared Groceries')).toBeInTheDocument();
        expect(screen.getByText('Milk')).toBeInTheDocument();
        expect(window.location.search).not.toContain('data=');
    });
});
