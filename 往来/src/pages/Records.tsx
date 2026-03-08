import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Records() {
  const [view, setView] = useState<'time' | 'person'>('time');
  const navigate = useNavigate();
  const { records, friends } = useData();

  // Group records by month for 'time' view
  const timeRecords = records.reduce((acc, record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    const existingGroup = acc.find(g => g.month === monthKey);
    
    const friend = friends.find(f => f.id === record.personId);
    const item = {
      id: record.id,
      title: record.title,
      person: friend ? friend.name : '未知',
      date: record.date,
      price: `¥${record.price}`,
      type: record.type === 'sent' ? '送出' : '收到',
      img: record.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY-_DWuX057fP9totUtencpzUbIPqiPBLhEZhT3j_rrCx7oNmeFo8UZqBYo9yo12dnKD5VyoA0Hnxsb9KcQJOcQ3R1gWsr-mHxMtgro6OG67KAN67kpASsFO8qmESDmO7rJgHqbwD1macU_grjHusMzgRzOUEtwBjkiP9q165sgwCdn_8pakVuZAr2F9xfm1WZqBHdEub9bNo64rorlAMu4XEXCumAV21V_vsLp9K0fojVCELGk-KvVrXBFktT5Hwk-SYZHlNIOsyL'
    };

    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      acc.push({ id: monthKey, month: monthKey, items: [item] });
    }
    return acc;
  }, [] as { id: string, month: string, items: any[] }[]);

  // Calculate total spent
  const totalSpent = records
    .filter(r => r.type === 'sent')
    .reduce((sum, r) => sum + r.price, 0);

  // Group records by person
  const personRecords = friends.map(friend => {
    const friendRecords = records.filter(r => r.personId === friend.id);
    const spent = friendRecords.filter(r => r.type === 'sent').reduce((sum, r) => sum + r.price, 0);
    return {
      id: friend.id,
      name: friend.name,
      tag: friend.relation,
      count: friendRecords.length,
      spent: `¥${spent}`,
      img: friend.avatar,
      expanded: false,
      records: friendRecords
    };
  }).filter(p => p.count > 0);

  return (
    <div className="flex flex-col min-h-full bg-background-light">
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between">
          <div 
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-slate-900">arrow_back</span>
          </div>
          <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 text-center">收送记录</h1>
          <div className="flex gap-2">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-slate-900">search</span>
            </button>
            <button 
              onClick={() => navigate('/records/add')}
              className="flex size-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Toggle Switch */}
        <div className="px-4 py-4">
          <div className="flex h-11 items-center justify-center rounded-lg bg-primary/5 p-1 border border-primary/10">
            <button 
              onClick={() => setView('time')}
              className={`flex h-full grow items-center justify-center rounded-md px-2 transition-all text-sm font-semibold ${view === 'time' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
            >
              按时间
            </button>
            <button 
              onClick={() => setView('person')}
              className={`flex h-full grow items-center justify-center rounded-md px-2 transition-all text-sm font-semibold ${view === 'person' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
            >
              按人物
            </button>
          </div>
        </div>

        {view === 'time' ? (
          <>
            {/* Summary Card - Time View */}
            <div className="px-4 mb-4">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-primary/10 border border-primary/20 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                  <p className="text-slate-600 text-sm font-medium uppercase tracking-wider">本期累计支出</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-primary text-lg font-bold">¥</span>
                  <p className="text-slate-900 text-3xl font-extrabold leading-tight">{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Records List - Time View */}
            <div className="flex flex-col space-y-1">
              {timeRecords.map((group) => (
                <div key={group.id}>
                  <div className="px-4 py-2 bg-primary/5">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{group.month}</p>
                  </div>
                  {group.items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-background-light px-4 py-4 border-b border-primary/5 items-center hover:bg-primary/5 transition-colors">
                      <div className="shrink-0">
                        <div 
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 border border-primary/10" 
                          style={{ backgroundImage: `url("${item.img}")` }}
                        ></div>
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <h3 className="text-slate-900 text-base font-bold truncate">{item.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px] text-slate-400">person</span>
                          <p className="text-slate-500 text-sm font-medium">{item.person}</p>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">{item.date}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-primary text-lg font-bold">{item.price}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.type === '送出' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {timeRecords.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p>暂无记录</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Summary Card - Person View */}
            <div className="px-4 mb-8">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-primary/10 border border-primary/20 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                  <p className="text-slate-600 text-sm font-medium uppercase tracking-wider">支出总览 (本年度)</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-primary text-lg font-bold">¥</span>
                  <p className="text-slate-900 text-3xl font-extrabold leading-tight">{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-4 px-4">
              <h2 className="text-lg font-bold border-l-4 border-primary pl-3">人物汇总</h2>
              <span className="text-xs text-slate-500">共 {personRecords.length} 位亲友有记录</span>
            </div>

            {/* Person List */}
            <div className="space-y-4 px-4">
              {personRecords.map((person) => (
                <div key={person.id} className="bg-white rounded-xl p-4 border border-primary/5 shadow-sm hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <img 
                      alt={person.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/10" 
                      src={person.img} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{person.name}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{person.tag}</span>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-slate-500">
                        <span>礼尚往来: <span className="font-bold text-slate-700">{person.count}次</span></span>
                        <span>支出: <span className="font-bold text-primary">{person.spent}</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {personRecords.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <p>暂无记录</p>
                </div>
              )}
            </div>
            
            <div className="py-10 text-center opacity-30 italic text-sm">
              <p>—— 往来有度，岁月留痕 ——</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
