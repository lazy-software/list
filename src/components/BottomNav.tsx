interface BottomNavProps {
    activeTab: 'items' | 'lists';
    onTabChange: (tab: 'items' | 'lists') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around pt-4 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-lg z-10 transition-colors duration-200">
            <button
                onClick={() => onTabChange('items')}
                className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${activeTab === 'items'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
            >
                Items
            </button>
            <div className="w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>
            <button
                onClick={() => onTabChange('lists')}
                className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${activeTab === 'lists'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
            >
                Lists
            </button>
        </div>
    );
}
