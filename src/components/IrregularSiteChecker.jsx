import React, { useEffect } from 'react';
import {
    Ruler,
    MapPin,
    AlertTriangle,
    CheckSquare,
    Info,
    LandPlot,
    Gavel,
    History,
    Factory,
    ArrowRight
} from 'lucide-react';
import { GlassCard, CardHeader, InputGroup, TechInput, TechCheckbox, StatusBanner, StatusIcon } from './SharedUI';
import { checkPingtungIrregularLandRules } from '../utils/irregularSiteLogic';

// --- Sub-components for Results ---

const ResultCard = ({ title, result }) => {
    if (!result) return null;
    const { ok, issues } = result;

    return (
        <div className={`p-4 rounded-xl border transition-all ${ok ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
            }`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-700">{title}</h4>
                <StatusIcon ok={ok} />
            </div>

            {!ok && issues.length > 0 && (
                <div className="mt-2 pt-2 border-t border-rose-200/50 space-y-1">
                    {issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-rose-600">
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

    const { isCompliant, buildingType, checks } = results;

    // buildingType: 0=非畸零地, 1=面積狹小, 2=地界曲折, 3=同時具備
    const typeLabels = {
        0: '非畸零地 (一般基地)',
        1: '面積狹小基地',
        2: '地界曲折基地',
        3: '面積狹小且地界曲折基地'
    };

    return (
        <GlassCard className="sticky top-6">
            <CardHeader title="檢核結果">
                <div className="text-xs text-slate-400">
                    依據：屏東縣畸零地使用規則
                </div>
            </CardHeader>

            <StatusBanner
                isCompliant={isCompliant}
                title={isCompliant ? '可單獨建築' : '不得單獨建築'}
            />

            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-sm text-slate-500 mb-1">基地型態判定</div>
                <div className="font-bold text-lg text-slate-800">
                    {typeLabels[buildingType]}
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <ResultCard title="第3、6條：面積狹小判定" result={checks.art3_6_narrowSite} />
                <ResultCard title="第7條：地界曲折判定" result={checks.art7_tortuousBoundary} />
                <ResultCard title="第8條：例外建築條件" result={checks.art8_buildability} />
                <ResultCard title="第9條：舊小基地例外" result={checks.art9_legacySmallSite} />
                <ResultCard title="第10條：舊丁建/工業區例外" result={checks.art10_legacyIndustrialSite} />
            </div>
        </GlassCard>
    );
};

// --- Main Checker Component ---

export default function IrregularSiteChecker({ data, onChange, onResultChange }) {
    // Calculate results whenever data changes
    const results = checkPingtungIrregularLandRules(data);

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

                {/* 1. 幾何與分區基本資訊 */}
                <GlassCard>
                    <CardHeader icon={Ruler} title="幾何與分區基本資訊" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="使用分區">
                            <select
                                className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={data.useZone}
                                onChange={(e) => handleChange('useZone', e.target.value)}
                            >
                                <option value="A_OR_RESIDENTIAL">甲、乙種建築用地及住宅區</option>
                                <option value="COMMERCIAL">商業區</option>
                                <option value="B_SCENIC_D_INDUSTRIAL">丙、丁種建築用地及風景/工業區</option>
                                <option value="OTHER">其他使用分區</option>
                            </select>
                        </InputGroup>
                        <div className="grid grid-cols-2 gap-2">
                            <InputGroup label="正面路寬" subLabel="(m)">
                                <TechInput
                                    type="number"
                                    value={data.frontRoadWidthM}
                                    onChange={(e) => handleChange('frontRoadWidthM', parseFloat(e.target.value) || 0)}
                                />
                            </InputGroup>
                            <InputGroup label="基地面積" subLabel="(m²)">
                                <TechInput
                                    type="number"
                                    value={data.siteAreaM2}
                                    onChange={(e) => handleChange('siteAreaM2', parseFloat(e.target.value) || 0)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <InputGroup label="最小寬度" subLabel="(m)">
                            <TechInput
                                type="number"
                                value={data.minWidthM}
                                onChange={(e) => handleChange('minWidthM', parseFloat(e.target.value) || 0)}
                            />
                        </InputGroup>
                        <InputGroup label="最小深度" subLabel="(m)">
                            <TechInput
                                type="number"
                                value={data.minDepthM}
                                onChange={(e) => handleChange('minDepthM', parseFloat(e.target.value) || 0)}
                            />
                        </InputGroup>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="屬側面應留設騎樓基地"
                            checked={data.isSideArcadeRequired}
                            onChange={(v) => handleChange('isSideArcadeRequired', v)}
                        />
                        <TechCheckbox
                            label="必須留設側院"
                            checked={data.hasSideYardRequirement}
                            onChange={(v) => handleChange('hasSideYardRequirement', v)}
                        />
                    </div>
                </GlassCard>

                {/* 2. 第6條調整用 */}
                <GlassCard>
                    <CardHeader icon={ArrowRight} title="第6條調整用 (加寬減深)" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TechCheckbox
                            label="考慮加寬換減深"
                            checked={data.applyArt6Adjustment}
                            onChange={(v) => handleChange('applyArt6Adjustment', v)}
                        />
                        <TechCheckbox
                            label="需前後院/騎樓/退縮"
                            checked={data.hasMandatorySetbacks}
                            onChange={(v) => handleChange('hasMandatorySetbacks', v)}
                        />
                    </div>
                </GlassCard>

                {/* 3. 第7條 — 地界曲折 */}
                <GlassCard>
                    <CardHeader icon={LandPlot} title="第7條 — 地界曲折" />
                    <div className="grid grid-cols-1 gap-2">
                        <TechCheckbox
                            label="基地界線曲折且無法建築 (人工判斷)"
                            checked={data.isBoundaryShapeAbnormalAndUnbuildable}
                            onChange={(v) => handleChange('isBoundaryShapeAbnormalAndUnbuildable', v)}
                        />
                        <TechCheckbox
                            label="與建築線夾角 <60° 或 >120°"
                            checked={data.hasExtremeAngleBetweenBoundaryAndBuildingLine}
                            onChange={(v) => handleChange('hasExtremeAngleBetweenBoundaryAndBuildingLine', v)}
                        />
                        <TechCheckbox
                            label="可配置符合最小寬深之平行四邊形"
                            checked={data.canFitRegularParallelogram}
                            onChange={(v) => handleChange('canFitRegularParallelogram', v)}
                        />
                    </div>
                </GlassCard>

                {/* 4. 第8條 — 例外條件檢核 */}
                <GlassCard>
                    <CardHeader icon={Gavel} title="第8條 — 例外條件檢核" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputGroup label="臨接土地使用類別">
                            <select
                                className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                value={data.adjacentLandUseType}
                                onChange={(e) => handleChange('adjacentLandUseType', e.target.value)}
                            >
                                <option value="OTHER">其他 (一般私有地)</option>
                                <option value="ROAD">道路</option>
                                <option value="DITCH">水溝</option>
                                <option value="MILITARY">軍事設施用地</option>
                                <option value="PUBLIC_FACILITY">公共設施用地</option>
                            </select>
                        </InputGroup>
                        <TechCheckbox
                            label="臨接土地已建築完成"
                            checked={data.adjacentLandAlreadyBuilt}
                            onChange={(v) => handleChange('adjacentLandAlreadyBuilt', v)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputGroup label="扣除騎樓/退縮後深度" subLabel="(m)">
                            <TechInput
                                type="number"
                                value={data.depthAfterArcadeOrSetbackM}
                                onChange={(e) => handleChange('depthAfterArcadeOrSetbackM', parseFloat(e.target.value) || 0)}
                            />
                        </InputGroup>
                        <InputGroup label="扣除騎樓/退縮後寬度" subLabel="(m)">
                            <TechInput
                                type="number"
                                value={data.widthAfterArcadeOrSetbackM}
                                onChange={(e) => handleChange('widthAfterArcadeOrSetbackM', parseFloat(e.target.value) || 0)}
                            />
                        </InputGroup>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <TechCheckbox
                            label="臨接地已領建照並完成一樓頂版"
                            checked={data.adjacentLandHasBuildingPermitAndSlabChecked}
                            onChange={(v) => handleChange('adjacentLandHasBuildingPermitAndSlabChecked', v)}
                        />
                        <TechCheckbox
                            label="臨接地為合法房屋"
                            checked={data.adjacentLandIsLegalHouse}
                            onChange={(v) => handleChange('adjacentLandIsLegalHouse', v)}
                        />
                        <TechCheckbox
                            label="因地形障礙無法合併使用"
                            checked={data.hasTerrainObstacleForMerge}
                            onChange={(v) => handleChange('hasTerrainObstacleForMerge', v)}
                        />
                    </div>
                </GlassCard>

                {/* 5. 第9條 — 舊小基地 */}
                <GlassCard>
                    <CardHeader icon={History} title="第9條 — 舊小基地" />
                    <div className="grid grid-cols-1 gap-2">
                        <TechCheckbox
                            label="實施區域計畫非都市土地編定前已分割"
                            checked={data.isInRegionalPlanNonUrbanBeforeZoning}
                            onChange={(v) => handleChange('isInRegionalPlanNonUrbanBeforeZoning', v)}
                        />
                        <TechCheckbox
                            label="實施都市計畫地區 62.07.12 前已分割"
                            checked={data.isInUrbanPlanBefore1973_07_12}
                            onChange={(v) => handleChange('isInUrbanPlanBefore1973_07_12', v)}
                        />
                        <TechCheckbox
                            label="因公共設施用地劃定逕為分割"
                            checked={data.isSplitByPublicFacilityZoning}
                            onChange={(v) => handleChange('isSplitByPublicFacilityZoning', v)}
                        />
                    </div>
                </GlassCard>

                {/* 6. 第10條 — 舊丁建、工業區 */}
                <GlassCard>
                    <CardHeader icon={Factory} title="第10條 — 舊丁建、工業區" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="屬丁種建築用地"
                            checked={data.isTypeDLand}
                            onChange={(v) => handleChange('isTypeDLand', v)}
                        />
                        <TechCheckbox
                            label="屬工業區"
                            checked={data.isIndustrialZone}
                            onChange={(v) => handleChange('isIndustrialZone', v)}
                        />
                        <TechCheckbox
                            label="於 75.11.02 前分割完成"
                            checked={data.isSplitBefore1986_11_02}
                            onChange={(v) => handleChange('isSplitBefore1986_11_02', v)}
                        />
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
