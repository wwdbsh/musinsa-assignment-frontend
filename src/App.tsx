import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  // '조회'와 '관리자' 중 선택 상태 관리 (초기값: '조회')
  const [ activeTab, setActiveTab ] = useState<'조회' | '관리자'>('조회');

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 영역 */}
      <header className="bg-gray-100 border-b border-gray-300 px-4 py-3">
        <nav className="flex space-x-2">
          <button
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                activeTab === '조회'
                  ? 'bg-blue-500 text-white border border-blue-500'
                  : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              }
            `}
            onClick={() => setActiveTab('조회')}
          >
            조회
          </button>
          <button
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                activeTab === '관리자'
                  ? 'bg-blue-500 text-white border border-blue-500'
                  : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              }
            `}
            onClick={() => setActiveTab('관리자')}
          >
            관리자
          </button>
        </nav>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="p-8 flex-1">
        {activeTab === '조회' ? <Dashboard /> : <AdminPanel />}
      </main>
    </div>
  );
};

export default App;