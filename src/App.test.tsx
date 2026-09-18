import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('App composer focus', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('todo-app-data', JSON.stringify({
            lists: [{ id: '1', name: 'Groceries', items: [] }],
            activeListId: '1',
        }));
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
