export default function Topbar({ onMenuClick }) {
    return (
        <div className="fixed top-0 left-0 right-0 z-[150] lg:hidden h-[62px] px-4
      bg-[#0c1812] border-b border-white/5 flex items-center justify-between gap-3">

            <button
                onClick={onMenuClick}
                className="w-9 h-9 bg-[#13201a] border border-white/10 rounded-[10px]
          flex items-center justify-center transition-all hover:border-[#0dce8f]/40"
            >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>

            <div className="font-syne text-lg font-black flex-1">
                Health<span className="text-[#0dce8f]">Setu</span>
            </div>

            <div className="text-xs text-[#456659]">AI Healthcare</div>
        </div>
    )
}