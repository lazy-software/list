export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    snoozedUntil?: number;
}

export interface TodoList {
    id: string;
    name: string;
    items: TodoItem[];
}

export interface AppState {
    lists: TodoList[];
    activeListId: string | null;
}
