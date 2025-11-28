import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { GlassCard, CardHeader, StatusIcon, StatusBanner } from './SharedUI';

const ResultCard = ({ title, isCompliant, value, standard, unit, issues }) => (
    <div className={`p-4 rounded-xl border mb-3 transition-all ${isCompliant
            ? 'bg-emerald-50/50 border-emerald-100'
            : 'bg-rose-50/50 border-rose-100'
        }`}>
        <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-700">{title}</h4>
            <StatusIcon ok={isCompliant} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            <div>
                <span className="text-slate-400 block text-xs">設計值</span>
                <span className={`font-mono font-semibold ${isCompliant ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {value} {unit}
                </span>
            </div>
            <div>
                <span className="text-slate-400 block text-xs">法規標準</span>
                <span className="font-mono text-slate-600">
                    {standard} {unit}
                </span>
            </div>
        </div>

        {!isCompliant && issues && issues.length > 0 && (
            <div className="mt-2 pt-2 border-t border-rose-200/50">
                {issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-600 mt-1">
                        <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                        <span>{issue}</span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const ComplianceResult = ({ results, buildingType }) => {
    if (!results) return null;

    const { isCompliant, details } = results;

    return (
        <GlassCard className="sticky top-6">
            <CardHeader title="檢核結果">
                <div className="text-xs text-slate-400">
                    {buildingType ? `類別：第 ${buildingType} 類` : '未歸類'}
                </div>
            </CardHeader>

            <StatusBanner
                isCompliant={isCompliant}
                title={isCompliant ? '符合規定' : '未符合規定'}
            />

            <div className="mt-6">
                {details.map((item, index) => (
                    <ResultCard
                        key={index}
                        title={item.name}
                        isCompliant={item.isCompliant}
                        value={item.value}
                        standard={item.standard}
                        unit={item.unit}
                        issues={item.issues}
                    />
                ))}
            </div>

            <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-100">
                <div className="flex items-start gap-3">
                    <Info className="text-sky-500 shrink-0 mt-1" size={20} />
                    <div className="text-sm text-sky-700">
                        <p className="font-bold mb-1">注意事項</p>
                        <ul className="list-disc pl-4 space-y-1 opacity-90">
                            <li>本系統試算結果僅供參考，實際核准以主管機關審查為準。</li>
                            <li>請確認輸入數據（如基地面積、法定建蔽率等）與地籍圖及權狀相符。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default ComplianceResult;
