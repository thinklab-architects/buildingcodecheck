import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const StatusIcon = ({ ok }) => (
    ok ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />
);

const ResultCard = ({ title, result }) => {
    if (!result) return null;
    const { ok, issues } = result;

    return (
        <div className={`p-4 rounded-xl border transition-all ${ok ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold ${ok ? 'text-emerald-900' : 'text-rose-900'}`}>{title}</h4>
                <StatusIcon ok={ok} />
            </div>
            {!ok && (
                <ul className="space-y-2 mt-2">
                    {issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-rose-700">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{issue}</span>
                        </li>
                    ))}
                </ul>
            )}
            {ok && <p className="text-sm text-emerald-700">符合規定</p>}
        </div>
    );
};

export default function ComplianceResult({ results }) {
    if (!results) return null;

    const { buildingType, isCompliant, checks } = results;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Overall Status Banner */}
            <div className={`p-8 rounded-2xl text-center border shadow-sm ${isCompliant ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'}`}>
                <div className="flex justify-center mb-4">
                    {isCompliant ? (
                        <CheckCircle className="w-16 h-16 text-white" />
                    ) : (
                        <XCircle className="w-16 h-16 text-white" />
                    )}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    {isCompliant ? '檢核通過' : '檢核未通過'}
                </h2>
                <p className="text-white/90 text-lg font-medium">
                    {buildingType ? `建築類別：第 ${buildingType} 類` : '無法歸類或非適用範圍'}
                </p>
            </div>

            {/* Detailed Checks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">無法歸類說明</p>
                        <p>若顯示無法歸類，可能因條件未達本自治條例適用範圍（例如：非公有且非供公眾使用、或規模未達標準）。請確認輸入資料是否正確。</p>
                    </div>
                </div>
            )}
        </div>
    );
}
