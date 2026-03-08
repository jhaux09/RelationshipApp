import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData, FriendEvent } from '../context/DataContext';

export default function EditFriend() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getFriend, updateFriend } = useData();

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('家人');
  const [notes, setNotes] = useState('');
  const [events, setEvents] = useState<FriendEvent[]>([]);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (id) {
      const friend = getFriend(id);
      if (friend) {
        setName(friend.name);
        setRelation(friend.relation);
        setNotes(friend.notes || '');
        setEvents(friend.events || []);
        setAvatar(friend.avatar);
      } else {
        navigate('/friends');
      }
    }
  }, [id, getFriend, navigate]);

  const handleAddEvent = () => {
    setEvents([...events, { id: Date.now().toString(), type: '生日', date: '', budget: 500 }]);
  };

  const handleEventChange = (eventId: string, field: keyof FriendEvent, value: any) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, [field]: value } : e));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('请输入姓名');
      return;
    }
    if (id) {
      await updateFriend(id, {
        name,
        relation,
        notes,
        events,
        avatar: avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrv9BRiWSjYaEBH9tMa9c86eBwPG7wX1hoKCTh3UETPiZY52l3y9SrNQa77rrQ3rBmcQBbCknFTqQ_-OVb6wzHEX01ULR4V9-X6edSe7aXz8hYtU-oX6R2l2AhsGfeNzO5pmdgqOINxngDlhNMB8_xWu9jac8sZWZnIX9EJxiD36qUqfiWwqo2i12nt47M8c16XGNQKcWbws69_5N6l_Nv1j_cQUgJa8Y8BJ1BqO9UjJLQPjM0Bu65nCDEh5C70lHDI1S1ZoIquO2Y'
      });
      navigate(`/friends/${id}`);
    }
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
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">编辑联系人</h2>
        <div className="flex w-10 items-center justify-end">
          <p 
            onClick={handleSave}
            className="text-primary text-base font-bold leading-normal cursor-pointer"
          >
            保存
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* Avatar Section */}
        <div className="flex p-8 justify-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="relative group cursor-pointer">
              <div 
                className="bg-primary/10 border-2 border-dashed border-primary/30 aspect-square rounded-full min-h-32 w-32 flex items-center justify-center overflow-hidden bg-cover" 
                style={{ backgroundImage: `url("${avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrv9BRiWSjYaEBH9tMa9c86eBwPG7wX1hoKCTh3UETPiZY52l3y9SrNQa77rrQ3rBmcQBbCknFTqQ_-OVb6wzHEX01ULR4V9-X6edSe7aXz8hYtU-oX6R2l2AhsGfeNzO5pmdgqOINxngDlhNMB8_xWu9jac8sZWZnIX9EJxiD36qUqfiWwqo2i12nt47M8c16XGNQKcWbws69_5N6l_Nv1j_cQUgJa8Y8BJ1BqO9UjJLQPjM0Bu65nCDEh5C70lHDI1S1ZoIquO2Y'}")` }}
              >
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-slate-900 text-lg font-bold">点击更换头像</p>
              <p className="text-slate-500 text-sm">记录下你们的精彩瞬间</p>
            </div>
          </div>
        </div>

        {/* Basic Info Form */}
        <div className="px-6 space-y-6">
          <div className="retro-paper p-6 rounded-xl space-y-5">
            <h3 className="text-primary font-bold text-sm uppercase tracking-widest border-b border-primary/20 pb-2">基本信息</h3>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium px-1">姓名</label>
              <input 
                className="w-full rounded-lg border-primary/20 bg-white/50 focus:border-primary focus:ring-primary text-slate-900 h-12 px-4" 
                placeholder="对方的名字" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-medium px-1">关系</label>
              <select 
                className="w-full rounded-lg border-primary/20 bg-white/50 focus:border-primary focus:ring-primary text-slate-900 h-12 px-4"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              >
                <option value="家人">家人</option>
                <option value="挚友">挚友</option>
                <option value="同事">同事</option>
                <option value="同学">同学</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          {/* Important Dates Section */}
          <div className="retro-paper p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between border-b border-primary/20 pb-2">
              <h3 className="text-primary font-bold text-sm uppercase tracking-widest">重要日子</h3>
              <button 
                onClick={handleAddEvent}
                className="flex items-center gap-1 text-primary text-sm font-bold hover:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                添加日期
              </button>
            </div>

            {events.map((event) => (
              <div key={event.id} className="p-4 rounded-lg bg-primary/5 border border-primary/10 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">事件类型</label>
                    <select 
                      className="w-full rounded-lg border-primary/10 bg-white text-sm h-10 px-2"
                      value={event.type}
                      onChange={(e) => handleEventChange(event.id, 'type', e.target.value)}
                    >
                      <option value="生日">生日</option>
                      <option value="纪念日">纪念日</option>
                      <option value="聚会">聚会</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">日期</label>
                    <input 
                      className="w-full rounded-lg border-primary/10 bg-white text-sm h-10 px-2" 
                      type="date" 
                      value={event.date}
                      onChange={(e) => handleEventChange(event.id, 'date', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500">礼金/预算 (¥)</label>
                    <span className="text-primary font-bold text-sm">¥{event.budget}</span>
                  </div>
                  <input 
                    className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary" 
                    max="5000" min="0" step="100" type="range" 
                    value={event.budget}
                    onChange={(e) => handleEventChange(event.id, 'budget', parseInt(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <div className="retro-paper p-6 rounded-xl space-y-4">
            <h3 className="text-primary font-bold text-sm uppercase tracking-widest border-b border-primary/20 pb-2">备注</h3>
            <textarea 
              className="w-full rounded-lg border-primary/20 bg-white/50 focus:border-primary focus:ring-primary text-slate-900 min-h-[100px] p-4" 
              placeholder="记录一些特别的喜好或避讳..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
