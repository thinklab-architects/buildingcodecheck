import React, { useEffect } from 'react';
import {
    Building2,
    MapPin,
    FileText,
    Calendar,
    CheckSquare,
    Plus,
    Trash2
} from 'lucide-react';
import { GlassCard, CardHeader, InputGroup, TechInput, TechCheckbox, StatusBanner, StatusIcon } from './SharedUI';
import { checkTdrCompliance } from '../utils/pingtungTdrLogic';

// --- Sub-components for TDR Results ---

const TdrResultCard = ({ title, result }) => {
    if (!result) return null;
    const { ok, issues, notes } = result;

    return (
        <div className="result-item flex-col items-start gap-2">
            <div className="w-full flex justify-between items-center">
                <div className="result-item-title font-bold">{title}</div>
                <div className={`result-status ${ok ? 'text-pass' : 'text-fail'}`}>
                    {ok ? '合格' : '不合格'}
                    <StatusIcon ok={ok} />
                </div>
            </div>

            {!ok && issues.length > 0 && (
                <div className="w-full bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                    <ul className="space-y-1">
                        {issues.map((issue, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-rose-600">
                                <span className="mt-0.5">•</span>
                                <span>{issue}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {notes && notes.length > 0 && (
                <div className="w-full bg-sky-50/50 p-3 rounded-lg border border-sky-100 mt-1">
                    <ul className="space-y-1">
                        {notes.map((note, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-sky-700">
                                <span className="mt-0.5 text-sky-400">i</span>
                                <span>{note}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Main TDR Checker Component ---

export default function TdrChecker({ data, onChange, onResultChange }) {
    // Calculate results whenever data changes
    const results = checkTdrCompliance(data);

    // Notify parent of result changes
    useEffect(() => {
        if (onResultChange) onResultChange(results);
    }, [results, onResultChange]);

    const handleChange = (field, value) => {
        onChange(prev => ({ ...prev, [field]: value }));
    };

    // Helper for nested docs updates
    const handleDocChange = (field, value) => {
        onChange(prev => ({
            ...prev,
            docs: {
                ...prev.docs,
                [field]: value
            }
        }));
    };

    const handleParcelChange = (type, index, field, value) => {
        onChange(prev => {
            const list = [...prev[type]];
            list[index] = { ...list[index], [field]: value };
            return { ...prev, [type]: list };
        });
    };

    const addParcel = (type) => {
        onChange(prev => ({
            ...prev,
            [type]: [...prev[type], { parcelId: "", area: 0, landValue: 0 }]
        }));
    };

    const removeParcel = (type, index) => {
        onChange(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="app-main">
            {/* Left: Input Form */}
            <section className="input-section flex flex-col gap-6">

                {/* 1. Project Info */}
                <GlassCard>
                    <CardHeader icon={FileText} title="案件基本資料" />
                    <div className="input-grid">
                        <InputGroup label="專案名稱">
                            <TechInput
                                value={data.projectName}
                                onChange={(e) => handleChange('projectName', e.target.value)}
                            />
                        </InputGroup>
                    </div>
                    <div className="input-grid mt-4">
                        <InputGroup label="基準容積率" subLabel="(%)">
                            <TechInput type="number" value={data.baselineFar} onChange={(e) => handleChange('baselineFar', parseFloat(e.target.value))} unit="%" />
                        </InputGroup>
                        <InputGroup label="法定容積率" subLabel="(%)">
                            <TechInput type="number" value={data.legalFar} onChange={(e) => handleChange('legalFar', parseFloat(e.target.value))} unit="%" />
                        </InputGroup>
                        <InputGroup label="移入容積率 (TDR)" subLabel="(%)">
                            <TechInput type="number" value={data.tdrBonusFar} onChange={(e) => handleChange('tdrBonusFar', parseFloat(e.target.value))} unit="%" />
                        </InputGroup>
                        <InputGroup label="其他獎勵容積" subLabel="(%)">
                            <TechInput type="number" value={data.otherBonusFar} onChange={(e) => handleChange('otherBonusFar', parseFloat(e.target.value))} unit="%" />
                        </InputGroup>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <TechCheckbox label="位於整體開發地區" checked={data.isInIntegratedDevArea} onChange={(v) => handleChange('isInIntegratedDevArea', v)} />
                        <TechCheckbox label="位於都市更新地區" checked={data.isInUrbanRenewalArea} onChange={(v) => handleChange('isInUrbanRenewalArea', v)} />
                        <TechCheckbox label="經都設審同意提高上限" checked={data.urbanDesignCommitteeApprovedForExtraTdr} onChange={(v) => handleChange('urbanDesignCommitteeApprovedForExtraTdr', v)} />
                    </div>
                </GlassCard>

                {/* 2. Send Out Parcels */}
                <GlassCard>
                    <CardHeader icon={MapPin} title="送出基地 (多筆)">
                        <button onClick={() => addParcel('sendOutParcels')} className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded hover:bg-sky-200 transition flex items-center gap-1">
                            <Plus size={12} /> 新增宗地
                        </button>
                    </CardHeader>
                    <div className="flex flex-col gap-4">
                        {data.sendOutParcels.map((p, idx) => (
                            <div key={idx} className="p-4 bg-white/40 rounded-xl border border-white/50 relative">
                                <button onClick={() => removeParcel('sendOutParcels', idx)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500">
                                    <Trash2 size={14} />
                                </button>
                                <div className="input-grid mb-2">
                                    <InputGroup label="宗地地號">
                                        <TechInput value={p.parcelId} onChange={(e) => handleParcelChange('sendOutParcels', idx, 'parcelId', e.target.value)} />
                                    </InputGroup>
                                    <InputGroup label="面積" subLabel="(㎡)">
                                        <TechInput type="number" value={p.area} onChange={(e) => handleParcelChange('sendOutParcels', idx, 'area', parseFloat(e.target.value))} unit="㎡" />
                                    </InputGroup>
                                </div>
                                <div className="input-grid mb-2">
                                    <InputGroup label="土地公告現值">
                                        <TechInput type="number" value={p.landValue} onChange={(e) => handleParcelChange('sendOutParcels', idx, 'landValue', parseFloat(e.target.value))} />
                                    </InputGroup>
                                    <InputGroup label="公共設施種類">
                                        <TechInput value={p.publicFacilityType} onChange={(e) => handleParcelChange('sendOutParcels', idx, 'publicFacilityType', e.target.value)} placeholder="park/road..." />
                                    </InputGroup>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <TechCheckbox label="公設保留地" checked={p.isPublicFacilityReservation} onChange={(v) => handleParcelChange('sendOutParcels', idx, 'isPublicFacilityReservation', v)} />
                                    <TechCheckbox label="公有土地" checked={p.isPublicOwnership} onChange={(v) => handleParcelChange('sendOutParcels', idx, 'isPublicOwnership', v)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                        <TechCheckbox label="所有權人全數同意" checked={data.sendOutOwnersAllAgreed} onChange={(v) => handleChange('sendOutOwnersAllAgreed', v)} />
                        <TechCheckbox label="主管機關同意受贈" checked={data.sendOutAcceptedByCompetentAuthority} onChange={(v) => handleChange('sendOutAcceptedByCompetentAuthority', v)} />
                    </div>
                </GlassCard>

                {/* 3. Receive Base Info */}
                <GlassCard>
                    <CardHeader icon={Building2} title="接受基地條件" />
                    <div className="input-grid">
                        <InputGroup label="使用分區類別">
                            <select
                                className="input-dark w-full"
                                value={data.receiveLandUseCategory}
                                onChange={(e) => handleChange('receiveLandUseCategory', e.target.value)}
                            >
                                <option value="residential">住宅區</option>
                                <option value="commercial">商業區</option>
                                <option value="specialDesignated">指定地區</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="基地總面積" subLabel="(㎡)">
                            <TechInput type="number" value={data.receiveBaseArea} onChange={(e) => handleChange('receiveBaseArea', parseFloat(e.target.value))} unit="㎡" />
                        </InputGroup>
                        <InputGroup label="臨接道路寬度" subLabel="(m)">
                            <TechInput type="number" value={data.adjacentRoadWidth} onChange={(e) => handleChange('adjacentRoadWidth', parseFloat(e.target.value))} unit="m" />
                        </InputGroup>
                        <InputGroup label="臨接道路長度" subLabel="(m)">
                            <TechInput type="number" value={data.adjacentRoadLength} onChange={(e) => handleChange('adjacentRoadLength', parseFloat(e.target.value))} unit="m" />
                        </InputGroup>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <TechCheckbox label="非已領使照增建" checked={!data.isExistingBuildingAddition} onChange={(v) => handleChange('isExistingBuildingAddition', !v)} />
                        <TechCheckbox label="非山坡地" checked={!data.isSlopeLand} onChange={(v) => handleChange('isSlopeLand', !v)} />
                        <TechCheckbox label="範圍與都設/建照一致" checked={data.isReceiveBaseScopeConsistent} onChange={(v) => handleChange('isReceiveBaseScopeConsistent', v)} />
                    </div>
                </GlassCard>

                {/* 4. Dates & Procedures */}
                <GlassCard>
                    <CardHeader icon={Calendar} title="程序與時程" />
                    <div className="input-grid">
                        <InputGroup label="初步認定函日期">
                            <TechInput type="date" value={data.preliminaryTdrApprovalDate} onChange={(e) => handleChange('preliminaryTdrApprovalDate', e.target.value)} />
                        </InputGroup>
                        <InputGroup label="許可函申請日期">
                            <TechInput type="date" value={data.permitApplicationDate} onChange={(e) => handleChange('permitApplicationDate', e.target.value)} />
                        </InputGroup>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <TechCheckbox label="已完成送出基地贈與" checked={data.sendOutDonatedToAuthority} onChange={(v) => handleChange('sendOutDonatedToAuthority', v)} />
                        <TechCheckbox label="已清理土地改良物" checked={data.sendOutImprovementsCleared} onChange={(v) => handleChange('sendOutImprovementsCleared', v)} />
                    </div>
                </GlassCard>

                {/* 5. Documents */}
                <GlassCard>
                    <CardHeader icon={CheckSquare} title="應附書件檢核" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox label="【書件1】申請查核表" checked={data.docs.form1Checklist} onChange={(v) => handleDocChange('form1Checklist', v)} />
                        <TechCheckbox label="【書件2】申請書" checked={data.docs.form2Application} onChange={(v) => handleDocChange('form2Application', v)} />
                        <TechCheckbox label="【書件3】計算表" checked={data.docs.form3CalculationSheet} onChange={(v) => handleDocChange('form3CalculationSheet', v)} />
                        <TechCheckbox label="【書件4】同意書" checked={data.docs.form4OwnerConsent} onChange={(v) => handleDocChange('form4OwnerConsent', v)} />
                        <TechCheckbox label="【書件5】切結書" checked={data.docs.form5Affidavit} onChange={(v) => handleDocChange('form5Affidavit', v)} />
                        <TechCheckbox label="送出基地土地權狀影本" checked={data.docs.hasSendOutOwnershipCopies} onChange={(v) => handleDocChange('hasSendOutOwnershipCopies', v)} />
                        <TechCheckbox label="接受基地土地權狀影本" checked={data.docs.hasReceiveOwnershipCopies} onChange={(v) => handleDocChange('hasReceiveOwnershipCopies', v)} />
                        <TechCheckbox label="土地使用分區證明書" checked={data.docs.hasZoningCertificates} onChange={(v) => handleDocChange('hasZoningCertificates', v)} />
                        <TechCheckbox label="土地登記簿謄本" checked={data.docs.hasLandRegistryTranscripts} onChange={(v) => handleDocChange('hasLandRegistryTranscripts', v)} />
                        <TechCheckbox label="地籍圖謄本" checked={data.docs.hasCadastreMaps} onChange={(v) => handleDocChange('hasCadastreMaps', v)} />
                        <TechCheckbox label="現況照片" checked={data.docs.hasCurrentPhotos} onChange={(v) => handleDocChange('hasCurrentPhotos', v)} />
                        <TechCheckbox label="都市計畫位置圖" checked={data.docs.hasUrbanPlanLocationMap} onChange={(v) => handleDocChange('hasUrbanPlanLocationMap', v)} />
                        <TechCheckbox label="建築線指示（定）圖" checked={data.docs.hasBuildingLineMap} onChange={(v) => handleDocChange('hasBuildingLineMap', v)} />
                        <TechCheckbox label="公共設施與交通影響分析" checked={data.docs.hasFacilityAndTrafficAnalysis} onChange={(v) => handleDocChange('hasFacilityAndTrafficAnalysis', v)} />
                        <TechCheckbox label="其他必要文件" checked={data.docs.hasOtherRequiredDocs} onChange={(v) => handleDocChange('hasOtherRequiredDocs', v)} />
                    </div>
                </GlassCard>

            </section>

            {/* Right: Results */}
            <section className="result-section">
                <GlassCard className="sticky top-6">
                    <CardHeader title="容積移轉檢核結果">
                        <div className="text-xs text-slate-400">屏東縣都市計畫容積移轉許可審查要點</div>
                    </CardHeader>

                    {results && (
                        <>
                            <StatusBanner
                                isCompliant={results.isCompliant}
                                title={results.isCompliant ? '符合規定' : '未符合規定'}
                            />

                            <div className="flex flex-col mt-6">
                                <TdrResultCard title="送出基地資格 (第2,4,6,8點)" result={results.checks.sendOutBase} />
                                <TdrResultCard title="接受基地資格 (第3,6,8點)" result={results.checks.receiveBase} />
                                <TdrResultCard title="容積移入上限 (第5,9點)" result={results.checks.volumeLimits} />
                                <TdrResultCard title="多筆宗地計算 (第8點)" result={results.checks.multiParcel} />
                                <TdrResultCard title="程序與期限 (第9,10點)" result={results.checks.procedure} />
                                <TdrResultCard title="書件齊備 (第12點)" result={results.checks.documents} />
                            </div>

                            <div className="mt-6 p-4 bg-slate-100 rounded-lg text-xs text-slate-500">
                                <p className="font-bold mb-1">加權平均結果 (第8點)</p>
                                <p>送出基地加權現值: {data.weightedSendOutLandValue?.toFixed(2) || 'N/A'}</p>
                                <p>接受基地加權現值: {data.weightedReceiveLandValue?.toFixed(2) || 'N/A'}</p>
                                <p>接受基地加權容積: {data.weightedReceiveFar?.toFixed(2) || 'N/A'}%</p>
                            </div>
                        </>
                    )}
                </GlassCard>
            </section>
        </div>
    );
}
