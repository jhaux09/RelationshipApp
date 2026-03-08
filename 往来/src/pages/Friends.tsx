import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { format, differenceInDays } from 'date-fns';

export default function Friends() {
  const navigate = useNavigate();
  const { friends } = useData();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex flex-col min-h-full bg-background-light">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background-light/90 backdrop-blur-md px-4 pt-6 pb-2 border-b border-primary/10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-slate-900 font-display">亲友录</h1>
          <div className="flex gap-2">
            <button className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button 
              onClick={() => navigate('/friends/add')}
              className="size-10 rounded-full bg-primary shadow-sm flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">person_add</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {['全部', '家人', '挚友', '同事', '同学', '其他'].map((tab, index) => {
            const tabKey = tab === '全部' ? 'all' : tab;
            return (
              <button 
                key={index}
                onClick={() => setActiveTab(tabKey)}
                className={`pb-2 whitespace-nowrap text-sm font-bold transition-colors relative ${
                  activeTab === tabKey ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === tabKey && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {friends
            .filter(f => activeTab === 'all' || f.relation === activeTab)
            .map((friend) => {
            // Find the closest upcoming event
            const upcomingEvent = friend.events && friend.events.length > 0 
              ? [...friend.events].sort((a, b) => {
                  if (!a.date) return 1;
                  if (!b.date) return -1;
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  const today = new Date();
                  dateA.setFullYear(today.getFullYear());
                  dateB.setFullYear(today.getFullYear());
                  if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
                  if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);
                  return dateA.getTime() - dateB.getTime();
                })[0]
              : null;

            let daysUntil = null;
            if (upcomingEvent && upcomingEvent.date) {
              const eventDate = new Date(upcomingEvent.date);
              const today = new Date();
              eventDate.setFullYear(today.getFullYear());
              if (eventDate < today) {
                eventDate.setFullYear(today.getFullYear() + 1);
              }
              daysUntil = differenceInDays(eventDate, today);
            }

            return (
              <div 
                key={friend.id}
                onClick={() => navigate(`/friends/${friend.id}`)}
                className="retro-paper rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div 
                  className="size-20 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                  style={{ backgroundImage: `url(${friend.avatar})` }}
                />
                <div className="text-center">
                  <h3 className="font-bold text-slate-900">{friend.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{friend.relation}</p>
                </div>
                
                {upcomingEvent && daysUntil !== null && (
                  <div className="mt-auto w-full bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                    <p className="text-[10px] text-slate-500 mb-0.5">{upcomingEvent.type}</p>
                    <p className="text-xs font-bold text-primary">
                      {daysUntil === 0 ? '就在今天' : `还有 ${daysUntil} 天`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {friends.filter(f => activeTab === 'all' || f.relation === activeTab).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">group_off</span>
            <p>暂无联系人</p>
          </div>
        )}
      </div>
    </div>
  );
}
