import React, { useEffect } from 'react';
import {
    Construction,
    FileText,
    Flame,
    Theater,
    Home,
    Calendar,
    Trash2,
    AlertTriangle,
    CheckSquare
} from 'lucide-react';
import { GlassCard, CardHeader, InputGroup, TechInput, TechCheckbox, StatusBanner, StatusIcon } from './SharedUI';
import { checkPingtungTemporaryBuilding } from '../utils/temporaryBuildingLogic';

// --- Sub-components for Results ---

const ResultCard = ({ title, result }) => {
    if (!result) return null;
    const { ok, issues } = result;

    return (
        <div className={`h-full p-4 rounded-xl border transition-all ${ok ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
            }`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-700">{title}</h4>
                <StatusIcon ok={ok} />
            </div>

            {!ok && issues.length > 0 ? (
                <div className="mt-2 pt-2 border-t border-rose-200/50 space-y-1">
                    {issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-rose-600">
                            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                            <span>{issue}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                    <CheckSquare size={12} />
                    <span>符合規定</span>
                </div>
            )}
        </div>
    );
};

const ComplianceResult = ({ results }) => {
    if (!results) return null;

    const { isCompliant, buildingType } = results;

    const typeLabels = {
        101: '一般臨時性建築物',
        102: '短期展演場所',
        103: '樣品屋',
        104: '競選活動辦事處',
        null: '非臨時性建築物或非屏東縣轄區'
    };

    return (
        <GlassCard className="mb-8">
            <CardHeader title="總體檢核結果">
                <div className="text-xs text-slate-400">
                    依據：屏東縣臨時性建築物管理要點
                </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatusBanner
                    isCompliant={isCompliant}
                    title={isCompliant ? '符合規定' : '不符合規定'}
                />

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-center">
                    <div className="text-sm text-slate-500 mb-1">判定建築物類型</div>
                    <div className="font-bold text-lg text-slate-800">
                        {typeLabels[buildingType]}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

// --- Helper Layout Component ---
const SectionLayout = ({ children, result, title }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
            {children}
        </div>
        <div className="lg:col-span-1">
            <ResultCard title={title} result={result} />
        </div>
    </div>
);

// --- Main Checker Component ---

export default function TemporaryBuildingChecker({ data, onChange, onResultChange }) {
    // Calculate results whenever data changes
    const results = checkPingtungTemporaryBuilding(data);

    // Notify parent of result changes
    useEffect(() => {
        if (onResultChange) onResultChange(results);
    }, [results, onResultChange]);

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Top: Overall Result */}
            <ComplianceResult results={results} />

            <div className="flex flex-col gap-2">

                {/* 1. 基本資訊 */}
                <SectionLayout result={results.checks.definition} title="檢核結果：基本資訊">
                    <GlassCard className="h-full">
                        <CardHeader icon={Construction} title="基本資訊" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup label="縣市">
                                <TechInput
                                    type="text"
                                    value={data.locationCounty}
                                    onChange={(e) => handleChange('locationCounty', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="主要用途">
                                <select
                                    className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    value={data.useCase}
                                    onChange={(e) => handleChange('useCase', e.target.value)}
                                >
                                    <option value="sampleHouse">樣品屋</option>
                                    <option value="shortTermExhibition">短期展演場所</option>
                                    <option value="campaignOffice">競選活動辦事處</option>
                                    <option value="other">其他</option>
                                </select>
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                            <TechCheckbox
                                label="屬臨時性建築物"
                                checked={data.isTemporaryBuilding}
                                onChange={(v) => handleChange('isTemporaryBuilding', v)}
                            />
                            <TechCheckbox
                                label="已訂有使用期限"
                                checked={data.hasUsageDeadlineDefined}
                                onChange={(v) => handleChange('hasUsageDeadlineDefined', v)}
                            />
                            <TechCheckbox
                                label="符合建築法第4條規定"
                                checked={data.compliesBuildingActArt4}
                                onChange={(v) => handleChange('compliesBuildingActArt4', v)}
                            />
                            <TechCheckbox
                                label="有目的事業主管機關"
                                checked={data.hasPurposeAgency}
                                onChange={(v) => handleChange('hasPurposeAgency', v)}
                            />
                            <TechCheckbox
                                label="已取得主管機關核准"
                                checked={data.hasPurposeAgencyApproval}
                                onChange={(v) => handleChange('hasPurposeAgencyApproval', v)}
                            />
                        </div>
                    </GlassCard>
                </SectionLayout>

                {/* 2. 申請文件 */}
                <SectionLayout result={results.checks.applicationDocuments} title="檢核結果：申請文件">
                    <GlassCard className="h-full">
                        <CardHeader icon={FileText} title="申請文件（第3點）" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <TechCheckbox
                                label="(一) 申請書"
                                checked={data.hasApplicationForm}
                                onChange={(v) => handleChange('hasApplicationForm', v)}
                            />
                            <TechCheckbox
                                label="(二) 主管機關核准文件"
                                checked={data.hasPurposeAgencyApprovalDocument}
                                onChange={(v) => handleChange('hasPurposeAgencyApprovalDocument', v)}
                            />
                            <TechCheckbox
                                label="(三) 建築師委託書"
                                checked={data.hasArchitectMandateLetter}
                                onChange={(v) => handleChange('hasArchitectMandateLetter', v)}
                            />
                            <TechCheckbox
                                label="(四) 土地使用權利證明"
                                checked={data.hasLandRightDocs}
                                onChange={(v) => handleChange('hasLandRightDocs', v)}
                            />
                            <TechCheckbox
                                label="(五) 現況圖、位置圖等"
                                checked={data.hasSiteAndPlans}
                                onChange={(v) => handleChange('hasSiteAndPlans', v)}
                            />
                            <TechCheckbox
                                label="(六) 結構安全證明書"
                                checked={data.hasStructuralSafetyCert}
                                onChange={(v) => handleChange('hasStructuralSafetyCert', v)}
                            />
                            <TechCheckbox
                                label="(七) 自行拆除切結書"
                                checked={data.hasSelfDemolitionAffidavit}
                                onChange={(v) => handleChange('hasSelfDemolitionAffidavit', v)}
                            />
                            <TechCheckbox
                                label="(八) 設備圖說及照片"
                                checked={data.hasOtherEquipDrawingsAndPhotos}
                                onChange={(v) => handleChange('hasOtherEquipDrawingsAndPhotos', v)}
                            />
                            <TechCheckbox
                                label="(九) 原建照影本（樣品屋）"
                                checked={data.hasOriginalBuildingPermitCopy}
                                onChange={(v) => handleChange('hasOriginalBuildingPermitCopy', v)}
                            />
                        </div>
                    </GlassCard>
                </SectionLayout>

                {/* 3. 消防設備 */}
                <SectionLayout result={results.checks.fireEquipment} title="檢核結果：消防設備">
                    <GlassCard className="h-full">
                        <CardHeader icon={Flame} title="消防設備（第3點第2項）" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <TechCheckbox
                                label="涉及消防設備"
                                checked={data.involvesFireEquipment}
                                onChange={(v) => handleChange('involvesFireEquipment', v)}
                            />
                            <TechCheckbox
                                label="已取得消防局核准"
                                checked={data.hasFireEquipmentApprovalFromFireDept}
                                onChange={(v) => handleChange('hasFireEquipmentApprovalFromFireDept', v)}
                            />
                        </div>
                    </GlassCard>
                </SectionLayout>

                {/* 4. 短期展演場所 */}
                <SectionLayout result={results.checks.shortTermExhibition} title="檢核結果：短期展演場所">
                    <GlassCard className="h-full">
                        <CardHeader icon={Theater} title="短期展演場所（第4點）" />
                        <div className="grid grid-cols-1 gap-2 mb-4">
                            <TechCheckbox
                                label="屬短期展演場所"
                                checked={data.isShortTermExhibition}
                                onChange={(v) => handleChange('isShortTermExhibition', v)}
                            />
                        </div>
                        {data.isShortTermExhibition && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <InputGroup label="使用期間" subLabel="(天)">
                                        <TechInput
                                            type="number"
                                            value={data.exhibitionTotalDays}
                                            onChange={(e) => handleChange('exhibitionTotalDays', parseInt(e.target.value) || 0)}
                                        />
                                    </InputGroup>
                                    <InputGroup label="舞台最高高度" subLabel="(m)">
                                        <TechInput
                                            type="number"
                                            value={data.stageMaxHeightM}
                                            onChange={(e) => handleChange('stageMaxHeightM', parseFloat(e.target.value) || 0)}
                                        />
                                    </InputGroup>
                                    <InputGroup label="攤棚最高高度" subLabel="(m)">
                                        <TechInput
                                            type="number"
                                            value={data.stallMaxHeightM}
                                            onChange={(e) => handleChange('stallMaxHeightM', parseFloat(e.target.value) || 0)}
                                        />
                                    </InputGroup>
                                </div>
                                <TechCheckbox
                                    label="已報請本府備查（高度超標時）"
                                    checked={data.hasReportedToCountyGovForRecord}
                                    onChange={(v) => handleChange('hasReportedToCountyGovForRecord', v)}
                                />
                            </>
                        )}
                    </GlassCard>
                </SectionLayout>

                {/* 5. 樣品屋 */}
                <SectionLayout result={results.checks.sampleHouse} title="檢核結果：樣品屋">
                    <GlassCard className="h-full">
                        <CardHeader icon={Home} title="樣品屋（第5點）" />
                        <div className="grid grid-cols-1 gap-2 mb-4">
                            <TechCheckbox
                                label="屬樣品屋"
                                checked={data.isSampleHouse}
                                onChange={(v) => handleChange('isSampleHouse', v)}
                            />
                        </div>
                        {data.isSampleHouse && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <InputGroup label="初次核准年數" subLabel="(年)">
                                        <TechInput
                                            type="number"
                                            value={data.sampleHouseInitialApprovedYears}
                                            onChange={(e) => handleChange('sampleHouseInitialApprovedYears', parseInt(e.target.value) || 0)}
                                        />
                                    </InputGroup>
                                    <InputGroup label="合計使用年數" subLabel="(年)">
                                        <TechInput
                                            type="number"
                                            value={data.sampleHouseTotalApprovedYears}
                                            onChange={(e) => handleChange('sampleHouseTotalApprovedYears', parseInt(e.target.value) || 0)}
                                        />
                                    </InputGroup>
                                    <InputGroup label="絕對高度" subLabel="(m)">
                                        <TechInput
                                            type="number"
                                            value={data.absoluteHeightM}
                                            onChange={(e) => handleChange('absoluteHeightM', parseFloat(e.target.value) || 0)}
                                        />
                                    </InputGroup>
                                    <InputGroup label="管制高度線" subLabel="(m)">
                                        <TechInput
                                            type="number"
                                            value={data.siteBuildingHeightControlLimitM}
                                            onChange={(e) => handleChange('siteBuildingHeightControlLimitM', parseFloat(e.target.value) || 0)}
                                        />
                                    </InputGroup>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <TechCheckbox
                                        label="妨礙土地使用管制"
                                        checked={data.violatesLandUseControl}
                                        onChange={(v) => handleChange('violatesLandUseControl', v)}
                                    />
                                    <TechCheckbox
                                        label="妨礙都市計畫"
                                        checked={data.violatesUrbanPlan}
                                        onChange={(v) => handleChange('violatesUrbanPlan', v)}
                                    />
                                    <TechCheckbox
                                        label="妨礙區域計畫"
                                        checked={data.violatesRegionalPlan}
                                        onChange={(v) => handleChange('violatesRegionalPlan', v)}
                                    />
                                    <TechCheckbox
                                        label="影響公共安全"
                                        checked={data.hasPublicSafetyIssue}
                                        onChange={(v) => handleChange('hasPublicSafetyIssue', v)}
                                    />
                                    <TechCheckbox
                                        label="影響公共交通"
                                        checked={data.hasTrafficIssue}
                                        onChange={(v) => handleChange('hasTrafficIssue', v)}
                                    />
                                    <TechCheckbox
                                        label="影響公共衛生"
                                        checked={data.hasPublicHealthIssue}
                                        onChange={(v) => handleChange('hasPublicHealthIssue', v)}
                                    />
                                </div>
                            </>
                        )}
                    </GlassCard>
                </SectionLayout>

                {/* 6. 使用期限 */}
                <SectionLayout result={results.checks.usagePeriod} title="檢核結果：使用期限">
                    <GlassCard className="h-full">
                        <CardHeader icon={Calendar} title="使用期限（第6點）" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputGroup label="核定使用期限" subLabel="(月)">
                                <TechInput
                                    type="number"
                                    value={data.approvedUseMonths}
                                    onChange={(e) => handleChange('approvedUseMonths', parseInt(e.target.value) || 0)}
                                />
                            </InputGroup>
                            <TechCheckbox
                                label="主管機關核定延長"
                                checked={data.hasExtendedApprovalFromPurposeAgency}
                                onChange={(v) => handleChange('hasExtendedApprovalFromPurposeAgency', v)}
                            />
                            <TechCheckbox
                                label="其他法規可延長"
                                checked={data.hasOtherLawForExtension}
                                onChange={(v) => handleChange('hasOtherLawForExtension', v)}
                            />
                        </div>
                    </GlassCard>
                </SectionLayout>

                {/* 7. 拆除期限 */}
                <SectionLayout result={results.checks.demolition} title="檢核結果：拆除期限">
                    <GlassCard className="h-full">
                        <CardHeader icon={Trash2} title="拆除期限（第7點）" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup label="使用期限屆滿日" subLabel="(YYYY-MM-DD)">
                                <TechInput
                                    type="date"
                                    value={data.useExpiryDate || ''}
                                    onChange={(e) => handleChange('useExpiryDate', e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup label="實際拆除完畢日" subLabel="(YYYY-MM-DD)">
                                <TechInput
                                    type="date"
                                    value={data.actualDemolitionDate || ''}
                                    onChange={(e) => handleChange('actualDemolitionDate', e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </GlassCard>
                </SectionLayout>

            </div>
        </div>
    );
}
