import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const StatusIcon = ({ ok }) => (
    ok ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-rose-400" />
);

const ResultCard = ({ title, result }) => {
    if (!result) return null;
    const { ok, issues } = result;

    return (
        <div className="result-item">
            <div className="flex-1">
                <div className="result-item-title">{title}</div>
                {!ok && (
                    <ul className="mt-1 space-y-1">
                        {issues.map((issue, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-rose-400">
                                <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                <span>{issue}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className={`result-status ${ok ? 'text-pass' : 'text-fail'}`}>
                {ok ? '合格' : '不合格'}
                <StatusIcon ok={ok} />
            </div>
        </div>
    );
};

export default function ComplianceResult({ results }) {
    if (!results) return null;

    const { buildingType, isCompliant, checks } = results;

    return (
        <div className="glass-card sticky top-6">
            <div className="card-header">
                <div className="card-title">
                    檢核結果
                </div>
                <div className="text-xs text-slate-400">
                    {buildingType ? `類別：第 ${buildingType} 類` : '未歸類'}
                </div>
            </div>

            <div className={`status-banner ${isCompliant ? 'pass' : 'fail'}`}>
                <div className="flex justify-center mb-2">
                    {isCompliant ? (
                        <CheckCircle className="w-12 h-12" />
                    ) : (
                        <XCircle className="w-12 h-12" />
                    )}
                </div>
                <div className="text-xl font-bold">
                    {isCompliant ? '符合規定' : '未符合規定'}
                </div>
            </div>

            <div className="flex flex-col">
                <ResultCard title="太陽光電 (第10條)" result={checks.solar} />
                <ResultCard title="屋頂隔熱 (第12條)" result={checks.roofInsulation} />
                <ResultCard title="屋頂方案組合 (第5-8條)" result={checks.roofCombo} />
                <ResultCard title="垃圾設施 (第13條)" result={checks.waste} />
                <ResultCard title="省水設備 (第14條)" result={checks.waterSaving} />
                <ResultCard title="綠建材 (第15條)" result={checks.materials} />
                <ResultCard title="自行車停車 (第16條)" result={checks.bikeParking} />
                <ResultCard title="自行車電梯 (第17條)" result={checks.bikeLift} />
                <ResultCard title="透水鋪面 (第8條)" result={checks.permeablePaving} />
                <ResultCard title="照明節能 (第9條)" result={checks.lighting} />
            </div>

            {!buildingType && (
                <div className="mt-6 p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="text-xs text-blue-200">
                        <p className="font-semibold mb-1 text-blue-300">無法歸類說明</p>
                        <p>若顯示無法歸類，可能因條件未達本自治條例適用範圍（例如：非公有且非供公眾使用、或規模未達標準）。請確認輸入資料是否正確。</p>
                    </div>
                </div>
            )}
        </div>
    );
}
