export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
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
