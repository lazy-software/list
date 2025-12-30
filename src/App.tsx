import { useState, useRef, useEffect } from 'react';
import { useTodoApp } from './hooks/useTodoApp';
import { BottomNav } from './components/BottomNav';
import { ListsScreen } from './components/ListsScreen';
import { ItemsScreen } from './components/ItemsScreen';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'items' | 'lists'>('items');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const {
    lists,
    activeListId,
    activeList,
    addList,
    deleteList,
    setActiveList,
    addItem,
    toggleItem,
    deleteCompletedItems,
    importList
  } = useTodoApp();

  return (
    <div className="h-[100dvh] bg-gray-100 dark:bg-gray-950 transition-colors duration-200 flex flex-col overflow-hidden pt-[env(safe-area-inset-top)]">
      <div className="max-w-md mx-auto w-full h-full bg-white dark:bg-gray-900 shadow-2xl relative transition-colors duration-200 flex flex-col overflow-hidden">


        {/* Main Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto pt-4">
          {activeTab === 'items' ? (
            <ItemsScreen
              activeList={activeList}
              onAddItem={addItem}
              onToggleItem={toggleItem}
            />
          ) : (
            <ListsScreen
              lists={lists}
              activeListId={activeListId}
              onAddList={addList}
              onDeleteList={deleteList}
              onSelectList={(id) => {
                setActiveList(id);
              }}
              onImportList={importList}
            />
          )}
        </main>


        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Floating Clear Button */}
        {activeTab === 'items' && activeList && activeList.items.some(i => i.completed) && (() => {
          const completedCount = activeList.items.filter(i => i.completed).length;
          return (
            <button
              onClick={() => {
                if (window.confirm(`Remove ${completedCount} completed item${completedCount !== 1 ? 's' : ''}?`)) {
                  deleteCompletedItems();
                }
              }}
              className="absolute right-4 bottom-[calc(6rem+env(safe-area-inset-bottom,20px))] z-50 flex items-center justify-center p-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full shadow-lg shadow-blue-600/30 dark:shadow-blue-900/40 hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          );
        })()}
      </div>
    </div>
  );
}

export default App;
