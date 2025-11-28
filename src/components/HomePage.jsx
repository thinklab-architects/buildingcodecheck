import React from 'react';
import { Building2, Map, ArrowRight } from 'lucide-react';
import { GlassCard } from './SharedUI';

// eslint-disable-next-line no-unused-vars
const ToolCard = ({ Icon, title, description, onClick, colorClass = "text-sky-600" }) => (
    <div
        onClick={onClick}
        className="glass-card cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={120} />
        </div>
        <div className="relative z-10 flex flex-col h-full">
            <div className={`p-3 rounded-xl bg-white/50 w-fit mb-4 ${colorClass}`}>
                <Icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">{description}</p>
            <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">
                開始檢核 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </div>
);

export default function HomePage({ onNavigate }) {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
                    建築法規自動化檢核系統
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    請選擇您要進行的法規檢討項目。系統將協助您快速計算並產出合規性報告。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ToolCard
                    Icon={Building2}
                    title="屏東縣綠建築自治條例"
                    description="檢核綠化保水、屋頂設施、節能資源及其他設施等項目是否符合屏東縣綠建築自治條例規定。"
                    onClick={() => onNavigate('green-building')}
                    colorClass="text-emerald-600"
                />

                <ToolCard
                    Icon={Map}
                    title="都市計畫容積移轉"
                    description="檢核送出基地與接受基地條件、容積移入上限、書件齊備度等是否符合屏東縣都市計畫容積移轉許可審查要點。"
                    onClick={() => onNavigate('tdr')}
                    colorClass="text-sky-600"
                />
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200/60 text-center text-slate-400 text-sm">
                <p>ThinkLab Architects © {new Date().getFullYear()}</p>
            </div>
        </div>
    );
}
