import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay } from 'date-fns';

export default function Calendar() {
  const navigate = useNavigate();
  const { friends } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = "yyyy年 M月";
  const monthFormat = "MMMM";

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const startingDayIndex = getDay(monthStart);

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const events: any[] = [];
    friends.forEach(friend => {
      friend.events?.forEach(event => {
        if (event.date) {
          const eventDate = new Date(event.date);
          if (eventDate.getMonth() === date.getMonth() && eventDate.getDate() === date.getDate()) {
            events.push({ ...event, friend });
          }
        }
      });
    });
    return events;
  };

  const selectedDateEvents = useMemo(() => getEventsForDate(selectedDate), [selectedDate, friends]);

  return (
    <div className="flex flex-col min-h-full bg-background-light">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-md border-b border-sepia-100">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-sepia-900">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-sepia-900">往来</h1>
          <button 
            onClick={() => navigate('/friends/add')}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-sepia-900">add_circle</span>
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-6 pb-4">
          <button onClick={prevMonth} className="flex items-center justify-center p-1 text-warm-gray">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold">{format(currentDate, dateFormat)}</h2>
            <p className="text-xs text-warm-gray font-medium uppercase tracking-widest">{format(currentDate, monthFormat)}</p>
          </div>
          <button onClick={nextMonth} className="flex items-center justify-center p-1 text-warm-gray">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Calendar Grid */}
        <div className="px-4 py-2">
          <div className="grid grid-cols-7 text-center mb-2">
            <div className="text-xs font-bold text-warm-gray py-2">日</div>
            <div className="text-xs font-bold text-warm-gray py-2">一</div>
            <div className="text-xs font-bold text-warm-gray py-2">二</div>
            <div className="text-xs font-bold text-warm-gray py-2">三</div>
            <div className="text-xs font-bold text-warm-gray py-2">四</div>
            <div className="text-xs font-bold text-warm-gray py-2">五</div>
            <div className="text-xs font-bold text-warm-gray py-2">六</div>
          </div>
          
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: startingDayIndex }).map((_, index) => (
              <div key={`empty-${index}`} className="h-14"></div>
            ))}
            
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button 
                  key={index}
                  onClick={() => onDateClick(day)}
                  className={`h-14 flex flex-col items-center justify-start pt-1 relative ${isSelected ? 'bg-primary rounded-xl text-white shadow-lg shadow-primary/20' : ''}`}
                >
                  <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'} ${isToday && !isSelected ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}></div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="mt-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{format(selectedDate, 'M月d日')} {selectedDateEvents.length > 0 ? '宜送礼' : ''}</h3>
            {selectedDateEvents.length > 0 && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{selectedDateEvents.length} 个提醒</span>
            )}
          </div>
          
          <div className="space-y-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event, index) => (
                <div key={index} className="bg-white border border-sepia-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                      <img 
                        className="w-full h-full object-cover" 
                        src={event.friend.avatar} 
                        alt={event.friend.name} 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{event.friend.name}的{event.type}</h4>
                          <p className="text-sm text-warm-gray">{event.friend.relation}</p>
                        </div>
                        <span className="material-symbols-outlined text-primary">
                          {event.type === '生日' ? 'cake' : event.type === '纪念日' ? 'favorite' : 'event'}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-sepia-100 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm">payments</span>
                          <span className="text-sm font-bold">预算: ¥{event.budget}</span>
                        </div>
                        <button 
                          onClick={() => navigate('/gifts')}
                          className="text-xs font-bold px-3 py-1.5 bg-primary text-white rounded-full"
                        >
                          选礼物
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <p>今天没有特别的安排</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

