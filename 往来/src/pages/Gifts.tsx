import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const allGiftIdeas = [
  { id: 1, title: '经典胶片单反相机套装', price: '¥1,280', tag: '复古', recommendTo: '陈晓芳', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVZkhJ_LQM8ywXmqyxx1YWPgMEJzL8nHZLBrofSoLFR-_BXMCTDdXy29lmaFS-61qk6XMDpn1SYKR6oXyCimWcaMb6zSluxUS8aW0kKsW2_J6oHd6XlMspgMb-HV4ESoTujjGyhrkEunZjoOexHpVlYjrOnI355ZX9-aGhLoTRSrcfDdKJOfkDKqNX-XuI2qNqOzew4btZbHEYKREsvUwA3PFo7Y43s2wxwWgnZWXfSWj7EAGoVL-Z28kv9HMzAD7pBLVRVu8Lf-e5' },
  { id: 2, title: '手工陶瓷咖啡杯 限量版', price: '¥168', tag: '咖啡', recommendTo: '李明', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI6JmhqMyN-QduUDATL9ysbCFZuj7eBri7p9VaW8jHLPl4fMOoWQ13hUrvuKJDsCTLTn0cOkEPHKfneIXD6mgfEQdyDNek6XrLkHcqQdtW5-xAUhI_IOAeqUdX9t_L9Vkenc55zWqswv3U3QZXioLWz5RixAkjebdG67MB0VO4LDPs4Ox17cQWqf1aXJ11yh74zWhT_imdBV48IHR94b0pqbz76GKB6MZRABB8MNffeco1F8oZ2qiM3-RcMXsvoJxBLZZw8q_WSjK9' },
  { id: 3, title: '复古便携式露营汽灯', price: '¥459', tag: '露营', recommendTo: '张伟', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI06pQ9uG-msR52ih00cJbVMV_yXZDh48F2Pbdkak7-uL-XntJsn1RCIOn6NB1kfQAoT2x4nKnINZr9O3IC8-6zGUS137gOSkLkeGHpyHokkKLxCu6sb6Z98PcaMzCsPS6w8pPeFbBBuR03R3_8czMThZPI0E8XSDwac3pYWGuK_ZIm1Jppv7pZHFj_p0u7QaF04kSP1cp2FJiTMXlzxTvk8eW_wGnccz07kHBTOYaFDAnpL7Ve-Sk3SAE1k4rAS2-IiN0XyxbNOHO' },
  { id: 4, title: '意大利植鞣皮手账本', price: '¥320', tag: '文具', recommendTo: '王紫薇', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFGFejwksu6uC3hE7em6r82GdCx7iHd7HFush3zag6IGdM-ltaXr-PjY0FcpxD8qTRl6q1YGj4KiVIEwjGBNAWqEA2C48CS92CBT4raiXMwBYHGOwYULTL6SpViIyIEOZKGVaYDgys3HYwTQwLwCfNGnGj8E1-b7nefctNeIiFiRDLceroIH95n-QX2YpPZsGFDPcLPT-ELCpVKa5Zi_1j-vC63-NcXLCpI0OXSeP6eDxt5no6u6yWCWO6NaUyl5Ob75BVYgk40cfP' },
  { id: 5, title: '高保真降噪蓝牙耳机', price: '¥1,599', tag: '数码', recommendTo: '赵铁柱', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrv9BRiWSjYaEBH9tMa9c86eBwPG7wX1hoKCTh3UETPiZY52l3y9SrNQa77rrQ3rBmcQBbCknFTqQ_-OVb6wzHEX01ULR4V9-X6edSe7aXz8hYtU-oX6R2l2AhsGfeNzO5pmdgqOINxngDlhNMB8_xWu9jac8sZWZnIX9EJxiD36qUqfiWwqo2i12nt47M8c16XGNQKcWbws69_5N6l_Nv1j_cQUgJa8Y8BJ1BqO9UjJLQPjM0Bu65nCDEh5C70lHDI1S1ZoIquO2Y' },
  { id: 6, title: '精选红酒礼盒装', price: '¥588', tag: '美酒', recommendTo: '孙尚香', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY-_DWuX057fP9totUtencpzUbIPqiPBLhEZhT3j_rrCx7oNmeFo8UZqBYo9yo12dnKD5VyoA0Hnxsb9KcQJOcQ3R1gWsr-mHxMtgro6OG67KAN67kpASsFO8qmESDmO7rJgHqbwD1macU_grjHusMzgRzOUEtwBjkiP9q165sgwCdn_8pakVuZAr2F9xfm1WZqBHdEub9bNo64rorlAMu4XEXCumAV21V_vsLp9K0fojVCELGk-KvVrXBFktT5Hwk-SYZHlNIOsyL' },
];

export default function Gifts() {
  const navigate = useNavigate();
  const { friends } = useData();
  const recommendations = friends.slice(0, 4);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(recommendations[0]?.id || null);

  // Mock logic to shuffle/change gift ideas based on selected friend
  const getGiftIdeas = () => {
    if (!selectedFriendId) return allGiftIdeas.slice(0, 4);
    const friend = friends.find(f => f.id === selectedFriendId);
    
    // Just a simple deterministic shuffle based on friend id length to simulate different recommendations
    const startIndex = (selectedFriendId.length + (friend?.name.length || 0)) % 3;
    const ideas = [...allGiftIdeas.slice(startIndex, startIndex + 4)];
    
    // Update the recommendTo name
    return ideas.map(idea => ({
      ...idea,
      recommendTo: friend?.name || idea.recommendTo
    }));
  };

  const currentGiftIdeas = getGiftIdeas();

  return (
    <div className="flex flex-col min-h-full bg-background-light">
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-primary">礼物</h1>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-primary">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <label className="flex flex-col w-full">
            <div className="flex w-full items-center rounded-xl bg-primary/5 border border-primary/10 px-4 h-12">
              <span className="material-symbols-outlined text-primary/60">search</span>
              <input 
                className="w-full border-none bg-transparent focus:ring-0 text-base placeholder:text-primary/40 px-3 outline-none" 
                placeholder="搜索礼物、品牌或类别" 
              />
              <span className="material-symbols-outlined text-primary/60">tune</span>
            </div>
          </label>
        </div>
        <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-5 cursor-pointer shadow-sm">
            <span className="text-sm font-medium">全部</span>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 text-primary px-5 cursor-pointer hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-sm">camera</span>
            <span className="text-sm font-medium">摄影</span>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 text-primary px-5 cursor-pointer hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-sm">coffee</span>
            <span className="text-sm font-medium">咖啡</span>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 text-primary px-5 cursor-pointer hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-sm">history_edu</span>
            <span className="text-sm font-medium">复古</span>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 text-primary px-5 cursor-pointer hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-sm">forest</span>
            <span className="text-sm font-medium">露营</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">为您好友推荐</h2>
            <a className="text-sm text-primary font-medium flex items-center" href="#">
              查看更多 <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                onClick={() => setSelectedFriendId(rec.id)}
                className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-full border-2 p-0.5 transition-colors ${selectedFriendId === rec.id ? 'border-primary' : 'border-transparent'}`}>
                  <img 
                    alt={rec.name} 
                    className="w-full h-full rounded-full object-cover" 
                    src={rec.avatar} 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className={`text-xs font-medium transition-colors ${selectedFriendId === rec.id ? 'text-primary' : 'text-slate-900'}`}>{rec.name}</span>
              </div>
            ))}
            <div 
              onClick={() => navigate('/friends/add')}
              className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border-2 border-transparent p-0.5">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">add</span>
                </div>
              </div>
              <span className="text-xs font-medium">添加</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight mb-4">精选礼物意念</h2>
          <div className="grid grid-cols-2 gap-4">
            {currentGiftIdeas.map((gift) => (
              <div key={gift.id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-primary/5 shadow-sm">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    alt={gift.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    src={gift.img} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {gift.tag}
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">{gift.title}</h3>
                  <p className="text-primary font-bold mt-auto mb-2">{gift.price}</p>
                  <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">recommend</span>
                    推荐给{gift.recommendTo}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
