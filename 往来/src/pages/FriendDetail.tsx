import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function FriendDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFriend, records } = useData();

  const friend = getFriend(id || '');

  if (!friend) {
    return (
      <div className="flex flex-col min-h-full bg-background-light items-center justify-center">
        <p>未找到该联系人</p>
        <button onClick={() => navigate('/friends')} className="mt-4 text-primary underline">返回</button>
      </div>
    );
  }

  const friendRecords = records.filter(r => r.personId === friend.id);
  const totalSpent = friendRecords.filter(r => r.type === 'sent').reduce((sum, r) => sum + r.price, 0);
  const totalReceived = friendRecords.filter(r => r.type === 'received').reduce((sum, r) => sum + r.price, 0);

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
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">人物详情</h2>
        <div className="flex w-10 items-center justify-end">
          <span 
            className="material-symbols-outlined text-primary cursor-pointer"
            onClick={() => navigate(`/friends/${id}/edit`)}
          >
            edit
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Profile Info */}
        <div className="flex flex-col items-center p-8 pb-4">
          <div 
            className="size-24 rounded-full bg-cover bg-center border-4 border-white shadow-md mb-4"
            style={{ backgroundImage: `url(${friend.avatar})` }}
          />
          <h1 className="text-2xl font-bold text-slate-900">{friend.name}</h1>
          <p className="text-slate-500 mt-1">{friend.relation}</p>
        </div>

        {/* Important Dates */}
        <div className="px-6 mt-6 space-y-4">
          <h3 className="text-primary font-bold text-sm uppercase tracking-widest border-b border-primary/20 pb-2">重要日子</h3>
          {friend.events && friend.events.length > 0 ? (
            <div className="space-y-3">
              {friend.events.map(event => (
                <div key={event.id} className="retro-paper p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{event.type}</p>
                    <p className="text-xs text-slate-500">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">预算</p>
                    <p className="font-bold text-primary">¥{event.budget}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">暂无记录</p>
          )}
        </div>

        {/* Records Summary */}
        <div className="px-6 mt-8 space-y-4">
          <h3 className="text-primary font-bold text-sm uppercase tracking-widest border-b border-primary/20 pb-2">往来记录</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-center">
              <p className="text-xs text-slate-500 mb-1">累计送出</p>
              <p className="text-lg font-bold text-primary">¥{totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-center">
              <p className="text-xs text-slate-500 mb-1">累计收到</p>
              <p className="text-lg font-bold text-primary">¥{totalReceived.toLocaleString()}</p>
            </div>
          </div>

          {friendRecords.length > 0 ? (
            <div className="space-y-3">
              {friendRecords.map(record => (
                <div key={record.id} className="bg-white p-4 rounded-xl flex justify-between items-center border border-primary/5 shadow-sm">
                  <div>
                    <p className="font-bold text-slate-900">{record.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{record.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${record.type === 'sent' ? 'text-primary' : 'text-slate-700'}`}>
                      {record.type === 'sent' ? '-' : '+'}¥{record.price}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold mt-1 inline-block ${record.type === 'sent' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                      {record.type === 'sent' ? '送出' : '收到'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">暂无往来记录</p>
          )}
        </div>

        {/* Notes */}
        {friend.notes && (
          <div className="px-6 mt-8 space-y-4">
            <h3 className="text-primary font-bold text-sm uppercase tracking-widest border-b border-primary/20 pb-2">备注</h3>
            <div className="retro-paper p-4 rounded-xl">
              <p className="text-slate-700 text-sm whitespace-pre-wrap">{friend.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
