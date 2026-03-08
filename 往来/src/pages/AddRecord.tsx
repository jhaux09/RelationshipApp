import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function AddRecord() {
  const navigate = useNavigate();
  const { friends, addRecord } = useData();

  const [title, setTitle] = useState('');
  const [friendId, setFriendId] = useState(friends[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'sent' | 'received'>('sent');

  const handleSave = async () => {
    if (!title.trim() || !friendId || !price) {
      alert('请填写完整信息');
      return;
    }

    await addRecord({
      title,
      personId: friendId,
      date,
      price: parseFloat(price),
      type,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY-_DWuX057fP9totUtencpzUbIPqiPBLhEZhT3j_rrCx7oNmeFo8UZqBYo9yo12dnKD5VyoA0Hnxsb9KcQJOcQ3R1gWsr-mHxMtgro6OG67KAN67kpASsFO8qmESDmO7rJgHqbwD1macU_grjHusMzgRzOUEtwBjkiP9q165sgwCdn_8pakVuZAr2F9xfm1WZqBHdEub9bNo64rorlAMu4XEXCumAV21V_vsLp9K0fojVCELGk-KvVrXBFktT5Hwk-SYZHlNIOsyL'
    });

    navigate('/records');
  };

  return (
    <div className="flex flex-col min-h-full bg-background-light">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-primary/10">
        <div 
          onClick={() => navigate(-1)}
          className="text-primary flex size-10 shrink-0 items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">添加记录</h2>
        <div className="flex w-10 items-center justify-end">
          <p 
            onClick={handleSave}
            className="text-primary text-base font-bold leading-normal cursor-pointer"
          >
            保存
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Type Toggle */}
        <div className="flex h-12 items-center justify-center rounded-lg bg-primary/5 p-1 border border-primary/10">
          <button 
            onClick={() => setType('sent')}
            className={`flex h-full grow items-center justify-center rounded-md px-2 transition-all text-sm font-semibold ${type === 'sent' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
          >
            送出
          </button>
          <button 
            onClick={() => setType('received')}
            className={`flex h-full grow items-center justify-center rounded-md px-2 transition-all text-sm font-semibold ${type === 'received' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}
          >
            收到
          </button>
        </div>

        <div className="retro-paper p-6 rounded-xl space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-sm font-medium px-1">礼物名称</label>
            <input 
              className="w-full rounded-lg border-primary/20 bg-white/50 focus:border-primary focus:ring-primary text-slate-900 h-12 px-4" 
              placeholder="例如：羊绒围巾" 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-sm font-medium px-1">相关亲友</label>
            <select 
              className="w-full rounded-lg border-primary/20 bg-white/50 focus:border-primary focus:ring-primary text-slate-900 h-12 px-4"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
            >
              {friends.map(friend => (
                <option key={friend.id} value={friend.id}>{friend.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-sm font-medium px-1">日期</label>
            <input 
              className="w-full rounded-lg border-primary/20 bg-white/50 focus:border-primary focus:ring-primary text-slate-900 h-12 px-4" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 text-sm font-medium px-1">金额 (¥)</label>
            <input 
              className="w-full rounded-lg border-primary/20 bg-white/50 focus:border-primary focus:ring-primary text-slate-900 h-12 px-4" 
              placeholder="0.00" 
              type="number" 
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
