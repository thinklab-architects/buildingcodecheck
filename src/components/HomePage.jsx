import React from 'react';
import { Building2, Map, ArrowRight, LandPlot, Ruler, Construction, Check, AlertCircle, Circle } from 'lucide-react';

const StatusBadge = ({ isCompliant }) => {
    if (isCompliant === true) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                <Check size={20} strokeWidth={3} />
                <span className="text-lg font-bold">合格</span>
            </div>
        );
    } else if (isCompliant === false) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 shadow-sm">
                <AlertCircle size={20} strokeWidth={3} />
                <span className="text-lg font-bold">不合格</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            <Circle size={18} />
            <span className="text-base font-medium">未檢核</span>
        </div>
    );
};

const ToolCard = ({
    Icon,
    title,
    description,
    onClick,
    colorClass = "text-sky-600",
    isEnabled,
    onToggle,
    status
}) => (
    <div
        className={`glass-card relative overflow-hidden transition-all duration-300 ${isEnabled
                ? 'hover:scale-[1.02] hover:shadow-lg ring-1 ring-slate-200/50 bg-white/60'
                : 'opacity-40 grayscale bg-slate-200/80 pointer-events-none'
            }`}
    >
        {/* Background Icon Decoration */}
        <div className={`absolute top-0 right-0 p-4 transition-opacity duration-300 ${isEnabled ? 'opacity-10 group-hover:opacity-20' : 'opacity-0'
            }`}>
            <Icon size={120} />
        </div>

        {/* Checkbox for Activation - Needs pointer-events-auto to work when card is disabled */}
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
            <label className="relative inline-flex items-center cursor-pointer group">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isEnabled}
                    onChange={onToggle}
                />
                <div className="w-7 h-7 bg-white border-2 border-slate-300 rounded-md peer-checked:bg-sky-600 peer-checked:border-sky-600 transition-all flex items-center justify-center shadow-sm group-hover:border-sky-400">
                    <Check size={20} className={`text-white transform transition-transform ${isEnabled ? 'scale-100' : 'scale-0'}`} />
                </div>
            </label>
        </div>

        {/* Card Content - Clickable Area */}
        <div
            onClick={isEnabled ? onClick : undefined}
            className={`relative z-10 flex flex-col h-full p-6 ${isEnabled ? 'cursor-pointer group' : ''}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/80 w-fit shadow-sm backdrop-blur-sm ${isEnabled ? colorClass : 'text-slate-400'}`}>
                    <Icon size={32} />
                </div>
                {/* Status Badge - Only show if enabled */}
                {isEnabled && (
                    <div className="mr-10"> {/* Margin right to avoid overlap with checkbox */}
                        <StatusBadge isCompliant={status} />
                    </div>
                )}
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isEnabled ? 'text-slate-800' : 'text-slate-500'}`}>
                {title}
            </h3>

            <p className={`text-sm mb-6 flex-1 leading-relaxed ${isEnabled ? 'text-slate-500' : 'text-slate-400'}`}>
                {description}
            </p>

            <div className={`flex items-center text-sm font-semibold transition-colors ${isEnabled
                    ? 'text-slate-700 group-hover:text-sky-600'
                    : 'text-slate-400'
                }`}>
                {isEnabled ? (
                    <>
                        開始檢核
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                ) : (
                    <span>未啟用</span>
                )}
            </div>
        </div>
    </div>
);

export default function HomePage({ onNavigate, enabledCheckers, toggleChecker, checkerStatuses }) {
    // Fallback for initial render or if props are missing
    const isEnabled = (id) => enabledCheckers ? enabledCheckers[id] : true;
    const getStatus = (id) => checkerStatuses ? checkerStatuses[id] : null;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
                    建築法規自動化檢核系統
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    請勾選您要進行的法規檢討項目。系統將協助您快速計算並產出合規性報告。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ToolCard
                    Icon={Building2}
                    title="屏東縣綠建築自治條例"
                    description="檢核綠化保水、屋頂設施、節能資源及其他設施等項目是否符合屏東縣綠建築自治條例規定。"
                    onClick={() => onNavigate('green-building')}
                    colorClass="text-emerald-600"
                    isEnabled={isEnabled('green-building')}
                    onToggle={() => toggleChecker('green-building')}
                    status={getStatus('green-building')}
                />

                <ToolCard
                    Icon={Map}
                    title="都市計畫容積移轉"
                    description="檢核送出基地與接受基地條件、容積移入上限、書件齊備度等是否符合屏東縣都市計畫容積移轉許可審查要點。"
                    onClick={() => onNavigate('tdr')}
                    colorClass="text-sky-600"
                    isEnabled={isEnabled('tdr')}
                    onToggle={() => toggleChecker('tdr')}
                    status={getStatus('tdr')}
                />

                <ToolCard
                    Icon={LandPlot}
                    title="縣有畸零地處理"
                    description="檢核縣有畸零地之讓售、標售、調整地形等處理方式是否符合屏東縣縣有畸零地處理作業要點。"
                    onClick={() => onNavigate('county-odd-lot')}
                    colorClass="text-amber-600"
                    isEnabled={isEnabled('county-odd-lot')}
                    onToggle={() => toggleChecker('county-odd-lot')}
                    status={getStatus('county-odd-lot')}
                />

                <ToolCard
                    Icon={Ruler}
                    title="屏東縣畸零地使用規則"
                    description="檢核基地是否屬面積狹小或地界曲折之畸零地，並判斷是否符合例外准予建築之規定。"
                    onClick={() => onNavigate('irregular-site')}
                    colorClass="text-rose-600"
                    isEnabled={isEnabled('irregular-site')}
                    onToggle={() => toggleChecker('irregular-site')}
                    status={getStatus('irregular-site')}
                />

                <ToolCard
                    Icon={Construction}
                    title="屏東縣臨時性建築物管理要點"
                    description="檢核樣品屋、短期展演場所、競選辦事處等臨時性建築物是否符合管理要點規定。"
                    onClick={() => onNavigate('temporary-building')}
                    colorClass="text-orange-600"
                    isEnabled={isEnabled('temporary-building')}
                    onToggle={() => toggleChecker('temporary-building')}
                    status={getStatus('temporary-building')}
                />
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200/60 text-center text-slate-400 text-sm">
                <p>ThinkLab Architects © {new Date().getFullYear()}</p>
            </div>
        </div>
    );
}
