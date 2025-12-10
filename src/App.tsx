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
              onDeleteCompleted={deleteCompletedItems}
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
      </div>
    </div>
  );
}

export default App;
