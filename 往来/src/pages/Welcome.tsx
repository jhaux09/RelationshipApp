import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col overflow-x-hidden max-w-[430px] mx-auto shadow-2xl bg-background-light">
      {/* Top App Bar / Header Area */}
      <div className="flex items-center bg-transparent p-6 justify-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">mail</span>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900">往来</h2>
        </div>
      </div>

      {/* Hero Illustration Section */}
      <div className="flex w-full flex-col grow px-6 justify-center">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-primary/10 border relative group border-primary/10 shadow-sm">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Muted gold and red accents through shapes */}
            <div className="absolute w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute w-48 h-48 bg-secondary/20 rounded-full blur-2xl -bottom-10 -right-10"></div>
          </div>
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <div 
              className="w-full h-full bg-center bg-no-repeat bg-contain" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDicTbE1HquYb8eorSXvMmAPgtQjqiNl5Yfo4gSxAI5x6sI4n8iIm7_fGkjAsRQhd2dEFlnVKE8CdRuQxmDkcW8h27-CjVSg1BIObxpsU5Tcn3G1HEJ2YLXEdDUmSCBScbELslOYwut3w4CTsEJgKOPj_UKX9ShJvJ9uI66LGjtPM1uFlast-DzMdA81OF_bme8UBLmEqfbiAOt9s-_pJOUoQAdxKoWKHv_DVfjAcvfzgx71WX_6mbQ1GyjSjrJmukQ7yS-MZMncUn-")' }}
            >
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 text-center pb-8">
          <h1 className="tracking-tight text-[32px] font-bold leading-tight px-4 pb-4 text-slate-900">欢迎来到“往来”</h1>
          <p className="text-base font-normal leading-relaxed px-6">在充满怀旧气息的时光里，通过贴心的送礼提醒与个性化推荐，珍藏您最真挚的情谊。</p>
        </div>
      </div>

      {/* Action Button Section */}
      <div className="p-6 pb-12 w-full">
        <button 
          onClick={() => navigate('/home')}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          开启旅程 <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
        <p className="mt-4 text-center text-xs text-slate-500 uppercase tracking-widest font-semibold">为现代友谊留存一份怀旧之情</p>
      </div>
    </div>
  );
}
