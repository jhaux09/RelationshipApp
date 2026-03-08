import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { differenceInDays, format, differenceInSeconds } from 'date-fns';
import { useMemo, useState, useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { friends } = useData();

  // Calculate upcoming events
  const upcomingEvents = useMemo(() => {
    const events: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    friends.forEach(friend => {
      friend.events?.forEach(event => {
        if (event.date) {
          const eventDate = new Date(event.date);
          eventDate.setFullYear(today.getFullYear());
          
          if (eventDate < today) {
            eventDate.setFullYear(today.getFullYear() + 1);
          }
          
          const daysUntil = differenceInDays(eventDate, today);
          
          events.push({
            ...event,
            friend,
            daysUntil,
            originalDate: eventDate
          });
        }
      });
    });

    return events.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [friends]);

  const nextEvent = upcomingEvents[0];
  const upcomingTwoWeeks = upcomingEvents.filter(e => e.daysUntil <= 14);

  // Dynamic countdown logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextEvent) return;

    const targetDate = new Date(nextEvent.originalDate);
    // Set to start of the day for the event
    targetDate.setHours(0, 0, 0, 0);

    const updateCountdown = () => {
      const now = new Date();
      const diffInSeconds = differenceInSeconds(targetDate, now);

      if (diffInSeconds <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diffInSeconds / (3600 * 24));
      const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-md px-4 py-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              <img 
                alt="User Avatar" 
                className="size-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcfCIoW9_3n2cQCDD0m4pgFNC860joxsDvrgMO61qCw7sXa6A4f66oKU3NcmUBHrLvjf4oPgeLS7QoVBvbF0o_bidfuDqQ-7rMEAs3LM4WTsYaUJdvYgTXq0m2TC_muG6ZiDgKEhXB7xb0sbOxvivoTqvy-BwswNH7BGuE1_MExrLY5FAqSunKm2eBM1wJVwNL6Wa1uEgR_cTaOm8CqzeAfhtREaYvjxL4zYqVKb6Tt-gwUf0zNQxn-vvKqK6XLjtN4Jg-VJWnKO8i"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight">往来</h1>
          </div>
          <button 
            onClick={() => navigate('/calendar')}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-primary">calendar_add_on</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Countdown Section */}
        {nextEvent && (
          <section className="px-4 py-6">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">redeem</span>
                下个送礼倒计时：{nextEvent.friend.name}的{nextEvent.type}
              </h2>
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-16 flex items-center justify-center rounded-lg bg-white shadow-sm">
                    <p className="text-2xl font-bold text-primary">{String(timeLeft.days).padStart(2, '0')}</p>
                  </div>
                  <p className="text-xs opacity-60 font-medium">天</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-16 flex items-center justify-center rounded-lg bg-white shadow-sm">
                    <p className="text-2xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</p>
                  </div>
                  <p className="text-xs opacity-60 font-medium">时</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-16 flex items-center justify-center rounded-lg bg-white shadow-sm">
                    <p className="text-2xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</p>
                  </div>
                  <p className="text-xs opacity-60 font-medium">分</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-16 flex items-center justify-center rounded-lg bg-white shadow-sm">
                    <p className="text-2xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</p>
                  </div>
                  <p className="text-xs opacity-60 font-medium">秒</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reminders List */}
        <section className="px-4 py-2">
          <h3 className="text-lg font-bold mb-4 px-1">近期提醒</h3>
          <div className="space-y-3">
            {upcomingTwoWeeks.length > 0 ? (
              upcomingTwoWeeks.map((event, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate(`/friends/${event.friend.id}`)}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-primary/5 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">
                      {event.type === '生日' ? 'cake' : event.type === '纪念日' ? 'favorite' : 'celebration'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{event.friend.name}的{event.type}</p>
                    <p className="text-sm opacity-60">
                      {format(event.originalDate, 'M月d日')} · {event.daysUntil === 0 ? '就在今天' : `还有${event.daysUntil}天`}
                    </p>
                  </div>
                  <span className="material-symbols-outlined opacity-30">chevron_right</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-primary/5">
                <p>近期没有特别的安排</p>
              </div>
            )}
          </div>
        </section>

        {/* Calendar Promotion Card */}
        <section className="px-4 py-8">
          <div 
            onClick={() => navigate('/calendar')}
            className="relative overflow-hidden rounded-xl bg-primary aspect-[16/7] flex items-center p-6 text-white group cursor-pointer shadow-lg shadow-primary/20"
          >
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-1">日历视图</h4>
              <p className="text-white/80 text-sm max-w-[180px]">点击查看所有的礼尚往来节点，不再错过任何重要时刻</p>
            </div>
            <div className="absolute right-[-10%] top-[-20%] opacity-20 transform rotate-12">
              <span className="material-symbols-outlined !text-[120px]">calendar_month</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/30">
              点击进入
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
