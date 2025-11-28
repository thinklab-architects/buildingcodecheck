import React, { useEffect } from 'react';
import {
    Building2,
    MapPin,
    FileText,
    Calendar,
    CheckSquare,
    AlertTriangle,
    Info,
    LandPlot,
    Gavel,
    Users,
    DollarSign,
    FileCheck
} from 'lucide-react';
import { GlassCard, CardHeader, InputGroup, TechInput, TechCheckbox, StatusBanner, StatusIcon } from './SharedUI';
import { checkCountyOddLotCase, determineOddLotSalePath } from '../utils/countyOddLotLogic';

// --- Sub-components for Results ---

const ResultCard = ({ title, result }) => {
    if (!result) return null;
    const { ok, issues, computedPath } = result;

    return (
        <div className="result-item flex-col items-start gap-2">
            <div className="w-full flex justify-between items-center">
                <div className="result-item-title font-bold">{title}</div>
                <div className={`result-status ${ok ? 'text-pass' : 'text-fail'}`}>
                    {ok ? '合格' : '不合格'}
                    <StatusIcon ok={ok} />
                </div>
            </div>

            {computedPath && (
                <div className="w-full bg-slate-50 p-2 rounded text-sm text-slate-600 mt-1 mb-1">
                    <span className="font-semibold">系統推論路徑：</span> {computedPath}
                </div>
            )}

            {!ok && issues.length > 0 && (
                <div className="w-full mt-2 space-y-1">
                    {issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50/50 p-2 rounded">
                            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                            <span>{issue}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ComplianceResult = ({ results }) => {
    if (!results) return null;

    const { isCompliant, checks } = results;

    // Map check keys to readable names
    const checkNames = {
        salePath: '法定處理路徑檢核',
        nonSaleProhibitions: '不得讓售情形檢核',
        landAdjustment: '協議調整地形檢核',
        occupancy: '占用與補償檢核',
        priorityRightHolders: '優先購買權檢核',
        govApplicants: '機關申購條件檢核',
        coOwnership: '共有土地處理檢核',
        applicationDocuments: '應附書件檢核'
    };

    return (
        <GlassCard className="sticky top-6">
            <CardHeader title="檢核結果">
                <div className="text-xs text-slate-400">
                    依據：屏東縣縣有畸零地處理作業要點
                </div>
            </CardHeader>

            <StatusBanner
                isCompliant={isCompliant}
                title={isCompliant ? '符合規定' : '未符合規定'}
            />

            <div className="mt-6 space-y-3">
                {checks && Object.entries(checks).map(([key, check]) => (
                    <div
                        key={key}
                        className={`p-4 rounded-xl border transition-all ${check.ok
                                ? 'bg-emerald-50/50 border-emerald-100'
                                : 'bg-rose-50/50 border-rose-100'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-700">
                                {checkNames[key] || key}
                            </h4>
                            <StatusIcon ok={check.ok} />
                        </div>

                        {check.computedPath && (
                            <div className="text-xs text-slate-500 mb-2 bg-white/50 p-1.5 rounded border border-slate-100">
                                系統推論：{check.computedPath}
                            </div>
                        )}

                        {!check.ok && check.issues && check.issues.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-rose-200/50">
                                {check.issues.map((issue, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-600 mt-1">
                                        <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                                        <span>{issue}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </GlassCard>
    );
};

// --- Main Checker Component ---

export default function CountyOddLotChecker({ data, onChange, onResultChange }) {
    // Calculate results whenever data changes
    const results = checkCountyOddLotCase(data);

    // Notify parent of result changes
    useEffect(() => {
        if (onResultChange) onResultChange(results);
    }, [results, onResultChange]);

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Input Form */}
            <section className="lg:col-span-2 flex flex-col gap-6">

                {/* 1. 基本資料 */}
                <GlassCard>
                    <CardHeader icon={FileText} title="基本資料" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="案件編號">
                            <TechInput
                                value={data.caseId}
                                onChange={(e) => handleChange('caseId', e.target.value)}
                                placeholder="PT-2025-001"
                            />
                        </InputGroup>
                        <InputGroup label="申請人類型">
                            <select
                                className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={data.applicantType}
                                onChange={(e) => handleChange('applicantType', e.target.value)}
                            >
                                <option value="private">私人</option>
                                <option value="government">政府機關</option>
                                <option value="publicEnterprise">公營事業</option>
                            </select>
                        </InputGroup>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="屬縣有畸零地案件"
                            checked={data.isCountyOddLot}
                            onChange={(v) => handleChange('isCountyOddLot', v)}
                        />
                        <TechCheckbox
                            label="鄰接私有畸零地合併使用"
                            checked={data.isAdjacentPrivateOddLot}
                            onChange={(v) => handleChange('isAdjacentPrivateOddLot', v)}
                        />
                        {(data.applicantType === 'government' || data.applicantType === 'publicEnterprise') && (
                            <TechCheckbox
                                label="本府公文認定應合併建築"
                                checked={data.managingAgencyHasCertifiedMergeNeeded}
                                onChange={(v) => handleChange('managingAgencyHasCertifiedMergeNeeded', v)}
                            />
                        )}
                    </div>
                </GlassCard>

                {/* 2. 擬合併土地與建築條件 */}
                <GlassCard>
                    <CardHeader icon={LandPlot} title="擬合併土地與建築條件" />
                    <div className="input-grid">
                        <InputGroup label="擬合併縣有地面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.countyPartAreaSqm}
                                onChange={(e) => handleChange('countyPartAreaSqm', parseFloat(e.target.value) || 0)}
                            />
                        </InputGroup>
                        <InputGroup label="私有畸零地面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.privateOddLotAreaSqm}
                                onChange={(e) => handleChange('privateOddLotAreaSqm', parseFloat(e.target.value) || 0)}
                            />
                        </InputGroup>
                        <InputGroup label="最小建築基地面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.minBuildingSiteAreaSqm}
                                onChange={(e) => handleChange('minBuildingSiteAreaSqm', parseFloat(e.target.value) || 0)}
                            />
                        </InputGroup>
                        <InputGroup label="合併後總面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.countyPartAreaSqm + data.privateOddLotAreaSqm}
                                readOnly
                                className="bg-slate-100"
                            />
                        </InputGroup>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-2">
                        <TechCheckbox
                            label="擬合併之縣有土地整筆可單獨建築"
                            checked={data.countyPartCanStandaloneBuild}
                            onChange={(v) => handleChange('countyPartCanStandaloneBuild', v)}
                        />
                        <TechCheckbox
                            label="私有地由原可單獨建築土地分割出"
                            checked={data.privateLotComesFromSplitOfBuildableLot}
                            onChange={(v) => handleChange('privateLotComesFromSplitOfBuildableLot', v)}
                        />
                        <TechCheckbox
                            label="私有地由原承購畸零地後再分割出"
                            checked={data.privateLotComesFromPreviousOddLotPurchaseSplitOut}
                            onChange={(v) => handleChange('privateLotComesFromPreviousOddLotPurchaseSplitOut', v)}
                        />
                        <TechCheckbox
                            label="縣有地為私有地惟一應合併對象"
                            checked={data.isOnlyPossibleMergeTarget}
                            onChange={(v) => handleChange('isOnlyPossibleMergeTarget', v)}
                        />
                        <TechCheckbox
                            label="私有地僅能與此縣有地合併建築"
                            checked={data.privateMustMergeWithThisCountyLandOnly}
                            onChange={(v) => handleChange('privateMustMergeWithThisCountyLandOnly', v)}
                        />
                        <TechCheckbox
                            label="合併剩餘縣有地仍可單獨建築"
                            checked={data.remainingCountyPartCanStandaloneBuild}
                            onChange={(v) => handleChange('remainingCountyPartCanStandaloneBuild', v)}
                        />
                    </div>
                </GlassCard>

                {/* 3. 協議調整地形 */}
                <GlassCard>
                    <CardHeader icon={MapPin} title="協議調整地形" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <TechCheckbox
                            label="曾試行協議調整地形"
                            checked={data.landAdjustmentTried}
                            onChange={(v) => handleChange('landAdjustmentTried', v)}
                        />
                        {data.landAdjustmentTried && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">協議結果：</span>
                                <select
                                    className="bg-white/50 border border-slate-200 rounded px-2 py-1 text-sm"
                                    value={data.landAdjustmentSucceeded === null ? '' : data.landAdjustmentSucceeded}
                                    onChange={(e) => handleChange('landAdjustmentSucceeded', e.target.value === 'true')}
                                >
                                    <option value="">請選擇</option>
                                    <option value="true">成立</option>
                                    <option value="false">不成立</option>
                                </select>
                            </div>
                        )}
                        <TechCheckbox
                            label="曾進行調處"
                            checked={data.mediationTried}
                            onChange={(v) => handleChange('mediationTried', v)}
                        />
                        {data.mediationTried && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">調處結果：</span>
                                <select
                                    className="bg-white/50 border border-slate-200 rounded px-2 py-1 text-sm"
                                    value={data.mediationSucceeded === null ? '' : data.mediationSucceeded}
                                    onChange={(e) => handleChange('mediationSucceeded', e.target.value === 'true')}
                                >
                                    <option value="">請選擇</option>
                                    <option value="true">成立</option>
                                    <option value="false">不成立</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {data.landAdjustmentSucceeded && (
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                            <h4 className="text-sm font-bold text-blue-700 mb-2">調整後條件確認</h4>
                            <TechCheckbox
                                label="雙方基地均達最小寬度及深度"
                                checked={data.bothSitesMeetMinWidthDepth}
                                onChange={(v) => handleChange('bothSitesMeetMinWidthDepth', v)}
                            />
                            <TechCheckbox
                                label="維持原有位置或面積/等值"
                                checked={data.keepOriginalPositionOrAreaAsMuchAsPossible}
                                onChange={(v) => handleChange('keepOriginalPositionOrAreaAsMuchAsPossible', v)}
                            />
                            <TechCheckbox
                                label="已約定稅費負擔方式"
                                checked={data.taxAndFeeSharingAgreed}
                                onChange={(v) => handleChange('taxAndFeeSharingAgreed', v)}
                            />
                            <TechCheckbox
                                label="面積價值增減已完成補償計算"
                                checked={data.cashCompensationCalculated}
                                onChange={(v) => handleChange('cashCompensationCalculated', v)}
                            />
                        </div>
                    )}
                </GlassCard>

                {/* 4. 占用與補償 */}
                <GlassCard>
                    <CardHeader icon={AlertTriangle} title="占用與補償" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="縣有地已被占用"
                            checked={data.isOccupied}
                            onChange={(v) => handleChange('isOccupied', v)}
                        />
                        {data.isOccupied && (
                            <>
                                <TechCheckbox
                                    label="已追繳使用補償金"
                                    checked={data.compensationFeeCollected}
                                    onChange={(v) => handleChange('compensationFeeCollected', v)}
                                />
                                <TechCheckbox
                                    label="占用人為鄰地所有權人"
                                    checked={data.occupantIsAdjacentOwner}
                                    onChange={(v) => handleChange('occupantIsAdjacentOwner', v)}
                                />
                                <TechCheckbox
                                    label="申購人為鄰地所有權人"
                                    checked={data.applicantIsAdjacentOwner}
                                    onChange={(v) => handleChange('applicantIsAdjacentOwner', v)}
                                />
                                {!data.occupantIsAdjacentOwner && data.applicantIsAdjacentOwner && (
                                    <TechCheckbox
                                        label="占用人已切結願自行排除"
                                        checked={data.occupantWillRemoveStructures}
                                        onChange={(v) => handleChange('occupantWillRemoveStructures', v)}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </GlassCard>

                {/* 5. 土地權利與共有 */}
                <GlassCard>
                    <CardHeader icon={Users} title="土地權利與共有" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-600">他項權利</h4>
                            <TechCheckbox label="設定地上權" checked={data.hasSurfaceRight} onChange={(v) => handleChange('hasSurfaceRight', v)} />
                            <TechCheckbox label="設定典權" checked={data.hasDianRight} onChange={(v) => handleChange('hasDianRight', v)} />
                            <TechCheckbox label="有出租情事" checked={data.hasLease} onChange={(v) => handleChange('hasLease', v)} />
                            {(data.hasSurfaceRight || data.hasDianRight || data.hasLease) && (
                                <>
                                    <TechCheckbox label="申購人為權利人" checked={data.applicantIsPriorityRightHolder} onChange={(v) => handleChange('applicantIsPriorityRightHolder', v)} />
                                    <TechCheckbox label="已取得放棄優先購買證明" checked={data.priorityRightHoldersWaived} onChange={(v) => handleChange('priorityRightHoldersWaived', v)} />
                                </>
                            )}
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-600">共有狀態</h4>
                            <TechCheckbox label="與其他機關共有" checked={data.isCoOwnedWithOtherGovAgency} onChange={(v) => handleChange('isCoOwnedWithOtherGovAgency', v)} />
                            {data.isCoOwnedWithOtherGovAgency && (
                                <TechCheckbox label="他機關同意委託處理" checked={data.otherGovAgencyConsentedEntrust} onChange={(v) => handleChange('otherGovAgencyConsentedEntrust', v)} />
                            )}
                            <TechCheckbox label="縣私共有" checked={data.isCoOwnedWithPrivateOwners} onChange={(v) => handleChange('isCoOwnedWithPrivateOwners', v)} />
                            {data.isCoOwnedWithPrivateOwners && (
                                <TechCheckbox label="已徵詢他共有人優先承購" checked={data.hasAskedCoOwnersPriorityPurchase} onChange={(v) => handleChange('hasAskedCoOwnersPriorityPurchase', v)} />
                            )}
                        </div>
                    </div>
                </GlassCard>

                {/* 6. 價格與承諾 */}
                <GlassCard>
                    <CardHeader icon={DollarSign} title="價格與承諾" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="承諾照專案提估價格承購"
                            checked={data.buyerAgreesSpecialAppraisalPrice}
                            onChange={(v) => handleChange('buyerAgreesSpecialAppraisalPrice', v)}
                        />
                        <TechCheckbox
                            label="切結不願調處/不願再調整地形"
                            checked={data.buyerRefusesLandAdjustment}
                            onChange={(v) => handleChange('buyerRefusesLandAdjustment', v)}
                        />
                        <TechCheckbox
                            label="已簽署承諾書/切結書"
                            checked={data.commitmentLetterSigned}
                            onChange={(v) => handleChange('commitmentLetterSigned', v)}
                        />
                    </div>
                </GlassCard>

                {/* 7. 擬採處理方式 */}
                <GlassCard className="border-l-4 border-l-blue-500">
                    <CardHeader icon={Gavel} title="擬採處理方式" />
                    <div className="p-4 bg-blue-50 rounded-lg mb-4 text-sm text-blue-800">
                        請選擇本案預計採行的處理方式，系統將檢核是否符合法定要件。
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="處理方式">
                            <select
                                className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={data.plannedHandling}
                                onChange={(e) => handleChange('plannedHandling', e.target.value)}
                            >
                                <option value="directSale">協議讓售 (Direct Sale)</option>
                                <option value="auction">標售 (Auction)</option>
                                <option value="noSale">不予讓售 (No Sale)</option>
                                <option value="landAdjustmentOnly">僅調整地形 (Land Adjustment Only)</option>
                                <option value="other">其他 (Other)</option>
                            </select>
                        </InputGroup>
                        <div className="flex items-end pb-2">
                            <TechCheckbox
                                label="擬辦理縣有地分割供合併"
                                checked={data.plannedSplitCountyLand}
                                onChange={(v) => handleChange('plannedSplitCountyLand', v)}
                            />
                        </div>
                    </div>
                </GlassCard>

                {/* 8. 應附書件 */}
                <GlassCard>
                    <CardHeader icon={FileCheck} title="應附書件檢核" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox label="土地擬出售清冊" checked={data.docSaleListAttached} onChange={(v) => handleChange('docSaleListAttached', v)} />
                        <TechCheckbox label="公有畸零地合併使用證明書" checked={data.docOddLotMergeCertificateAttached} onChange={(v) => handleChange('docOddLotMergeCertificateAttached', v)} />
                        <TechCheckbox label="認定應合併建築公文書(機關)" checked={data.docGovMergeOfficialDocAttached} onChange={(v) => handleChange('docGovMergeOfficialDocAttached', v)} />
                        <TechCheckbox label="土地登記簿/地籍圖謄本" checked={data.docLandRegistryAndCadastralMapAttached} onChange={(v) => handleChange('docLandRegistryAndCadastralMapAttached', v)} />
                        <TechCheckbox label="分區/公告現值證明" checked={data.docZoningAndAnnouncedLandValueAttached} onChange={(v) => handleChange('docZoningAndAnnouncedLandValueAttached', v)} />
                        <TechCheckbox label="專案提估承諾書" checked={data.docCommitmentLetterAttached} onChange={(v) => handleChange('docCommitmentLetterAttached', v)} />
                        <TechCheckbox label="其他法令規定文件" checked={data.docOtherRequiredDocsAttached} onChange={(v) => handleChange('docOtherRequiredDocsAttached', v)} />
                    </div>
                </GlassCard>

            </section>

            {/* Right: Results */}
            <section className="lg:col-span-1">
                <ComplianceResult results={results} />
            </section>
        </div>
    );
}
