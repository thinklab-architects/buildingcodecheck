import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Check, AlertCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { defaultBuildingData, checkCompliance, generateArcadeReport } from '../utils/arcadeStandardLogic';

const SectionLayout = ({ title, children, isOpen, onToggle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
        >
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
        </button>

        {isOpen && (
            <div className="p-6 space-y-6">
                {children}
            </div>
        )}
    </div>
);

const InputField = ({ label, value, onChange, type = "text", placeholder, suffix, options, tooltip }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {tooltip && (
                <div className="group relative">
                    <HelpCircle size={16} className="text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
            )}
        </div>

        {options ? (
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
            >
                <option value="">請選擇</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        ) : type === "checkbox" ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-600">{placeholder || label}</span>
            </div>
        ) : (
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        {suffix}
                    </span>
                )}
            </div>
        )}
    </div>
);

export default function ArcadeStandardChecker({ onBack, data, onChange, onResultChange }) {
    // Use props 'data' instead of local state 'formData'
    // Use props 'onChange' instead of local state setter

    const [result, setResult] = useState(null);
    const [reportText, setReportText] = useState("");
    const [sectionsOpen, setSectionsOpen] = useState({
        basic: true,
        urban: true,
        road: true,
        scheme: true,
        geometry: true,
        floor: true,
        corner: false
    });

    useEffect(() => {
        if (!data) return;
        const res = checkCompliance(data);
        setResult(res);
        setReportText(generateArcadeReport(res));
        if (onResultChange) {
            onResultChange(res);
        }
    }, [data, onResultChange]);

    const updateField = (field, value) => {
        onChange(prev => ({ ...prev, [field]: value }));
    };

    const toggleSection = (section) => {
        setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const copyReport = () => {
        navigator.clipboard.writeText(reportText);
        alert("報告已複製到剪貼簿");
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                <FileText size={20} />
                            </span>
                            屏東縣都市計畫區法定騎樓設置標準
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={copyReport}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            <Save size={18} />
                            <span>複製報告</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Basic Info */}
                    <SectionLayout
                        title="基本資料"
                        isOpen={sectionsOpen.basic}
                        onToggle={() => toggleSection('basic')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="建案名稱" value={data.name} onChange={v => updateField('name', v)} />
                            <InputField label="縣市名稱" value={data.locationCounty} onChange={v => updateField('locationCounty', v)} />
                            <InputField label="都市計畫區名稱" value={data.urbanPlanAreaName} onChange={v => updateField('urbanPlanAreaName', v)} />
                            <InputField
                                label="位於都市計畫區"
                                type="checkbox"
                                value={data.isInUrbanPlanArea}
                                onChange={v => updateField('isInUrbanPlanArea', v)}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InputField label="新建工程" type="checkbox" value={data.isNew} onChange={v => updateField('isNew', v)} />
                            <InputField label="增建工程" type="checkbox" value={data.isExtension} onChange={v => updateField('isExtension', v)} />
                            <InputField label="改建工程" type="checkbox" value={data.isAlteration} onChange={v => updateField('isAlteration', v)} />
                            <InputField label="修建工程" type="checkbox" value={data.isRepair} onChange={v => updateField('isRepair', v)} />
                        </div>
                    </SectionLayout>

                    {/* Urban Plan & Setback */}
                    <SectionLayout
                        title="都市計畫及退縮規定"
                        isOpen={sectionsOpen.urban}
                        onToggle={() => toggleSection('urban')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="土地使用分區"
                                value={data.landUseZone}
                                onChange={v => updateField('landUseZone', v)}
                                options={["住宅區", "商業區", "文教區", "學校用地", "工業區", "其他"]}
                            />
                            <div className="space-y-4">
                                <InputField
                                    label="另有退縮規定"
                                    type="checkbox"
                                    value={data.hasSpecificSetbackControl}
                                    onChange={v => updateField('hasSpecificSetbackControl', v)}
                                    placeholder="都市計畫書已訂有退縮規定"
                                />
                                {data.hasSpecificSetbackControl && (
                                    <InputField
                                        label="退縮規定備註"
                                        value={data.specificSetbackNote}
                                        onChange={v => updateField('specificSetbackNote', v)}
                                        placeholder="請輸入規定名稱或圖號"
                                    />
                                )}
                            </div>
                        </div>
                    </SectionLayout>

                    {/* Road Info */}
                    <SectionLayout
                        title="道路與臨接關係"
                        isOpen={sectionsOpen.road}
                        onToggle={() => toggleSection('road')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <h4 className="font-bold text-slate-700">正面臨路</h4>
                                <InputField label="道路名稱" value={data.frontRoadName} onChange={v => updateField('frontRoadName', v)} />
                                <InputField label="計畫道路寬度" type="number" value={data.frontRoadWidth} onChange={v => updateField('frontRoadWidth', v)} suffix="m" />
                                <InputField label="是否為計畫道路" type="checkbox" value={data.frontRoadIsPlannedRoad} onChange={v => updateField('frontRoadIsPlannedRoad', v)} />
                            </div>

                            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-700">側面臨路</h4>
                                    <InputField label="有側面臨路" type="checkbox" value={data.hasSideRoad} onChange={v => updateField('hasSideRoad', v)} placeholder="啟用" />
                                </div>
                                {data.hasSideRoad && (
                                    <>
                                        <InputField label="道路名稱" value={data.sideRoadName} onChange={v => updateField('sideRoadName', v)} />
                                        <InputField label="計畫道路寬度" type="number" value={data.sideRoadWidth} onChange={v => updateField('sideRoadWidth', v)} suffix="m" />
                                        <InputField label="是否為計畫道路" type="checkbox" value={data.sideRoadIsPlannedRoad} onChange={v => updateField('sideRoadIsPlannedRoad', v)} />
                                    </>
                                )}
                            </div>
                        </div>
                    </SectionLayout>

                    {/* Scheme Selection */}
                    <SectionLayout
                        title="騎樓適用性與方案"
                        isOpen={sectionsOpen.scheme}
                        onToggle={() => toggleSection('scheme')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <InputField label="設置騎樓" type="checkbox" value={data.providesArcade} onChange={v => updateField('providesArcade', v)} />
                                <InputField label="設置庇廊" type="checkbox" value={data.providesCanopyCorridor} onChange={v => updateField('providesCanopyCorridor', v)} />
                            </div>
                            <div className="space-y-4">
                                <InputField label="以無遮簷人行道替代" type="checkbox" value={data.providesOpenSidewalkInstead} onChange={v => updateField('providesOpenSidewalkInstead', v)} />
                                {data.providesOpenSidewalkInstead && (
                                    <>
                                        <InputField label="無遮簷人行道寬度" type="number" value={data.openSidewalkWidth} onChange={v => updateField('openSidewalkWidth', v)} suffix="m" />
                                        <InputField label="已取得縣府核准" type="checkbox" value={data.hasGovApprovalForOpenSidewalk} onChange={v => updateField('hasGovApprovalForOpenSidewalk', v)} />
                                    </>
                                )}
                            </div>
                        </div>
                    </SectionLayout>

                    {/* Geometry */}
                    <SectionLayout
                        title="騎樓幾何尺寸"
                        isOpen={sectionsOpen.geometry}
                        onToggle={() => toggleSection('geometry')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="正面騎樓寬度" type="number" value={data.frontArcadeWidth} onChange={v => updateField('frontArcadeWidth', v)} suffix="m" />
                            <InputField label="側面騎樓寬度" type="number" value={data.sideArcadeWidth} onChange={v => updateField('sideArcadeWidth', v)} suffix="m" />
                            <InputField label="騎樓寬度特例認定" type="checkbox" value={data.arcadeWidthSpecialApproved} onChange={v => updateField('arcadeWidthSpecialApproved', v)} />
                            <InputField label="柱正面距建築線距離" type="number" value={data.arcadeColumnOffsetFromBuildingLine} onChange={v => updateField('arcadeColumnOffsetFromBuildingLine', v)} suffix="m" />
                        </div>
                    </SectionLayout>

                    {/* Floor & Sidewalk */}
                    <SectionLayout
                        title="騎樓地坪與人行道"
                        isOpen={sectionsOpen.floor}
                        onToggle={() => toggleSection('floor')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="地坪材料"
                                value={data.arcadeFloorMaterial}
                                onChange={v => updateField('arcadeFloorMaterial', v)}
                                options={["石", "磚", "混凝土", "磁磚", "瀝青", "其他"]}
                            />
                            <InputField label="地坪舖裝平實" type="checkbox" value={data.arcadeFloorIsEven} onChange={v => updateField('arcadeFloorIsEven', v)} />
                            <InputField label="有台階或阻礙物" type="checkbox" value={data.arcadeHasStepsOrObstacles} onChange={v => updateField('arcadeHasStepsOrObstacles', v)} />
                            <InputField label="瀉水坡度" type="number" value={data.arcadeDrainSlope} onChange={v => updateField('arcadeDrainSlope', v)} placeholder="0.025" />
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="道路已設人行道" type="checkbox" value={data.hasExistingSidewalkAlongRoad} onChange={v => updateField('hasExistingSidewalkAlongRoad', v)} />
                            {data.hasExistingSidewalkAlongRoad ? (
                                <InputField label="與人行道高差" type="number" value={data.arcadeFloorHeightDiffToSidewalk} onChange={v => updateField('arcadeFloorHeightDiffToSidewalk', v)} suffix="m" />
                            ) : (
                                <InputField label="高於道路邊界" type="number" value={data.arcadeFloorHeightAboveRoadEdge} onChange={v => updateField('arcadeFloorHeightAboveRoadEdge', v)} suffix="m" />
                            )}
                            <InputField label="已依市區道路條例辦理" type="checkbox" value={data.complyUrbanRoadActArt9} onChange={v => updateField('complyUrbanRoadActArt9', v)} />
                        </div>
                    </SectionLayout>

                    {/* Corner */}
                    <SectionLayout
                        title="轉角截角"
                        isOpen={sectionsOpen.corner}
                        onToggle={() => toggleSection('corner')}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="轉角截角長度" type="number" value={data.cornerChamferLength} onChange={v => updateField('cornerChamferLength', v)} suffix="m" />
                            <InputField label="依自治條例檢討" type="checkbox" value={data.cornerChamferCheckByOtherRule} onChange={v => updateField('cornerChamferCheckByOtherRule', v)} />
                        </div>
                    </SectionLayout>

                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="sticky top-24 space-y-6">

                        {/* Compliance Status Card */}
                        <div className={`rounded-xl p-6 shadow-sm border-2 transition-all ${result?.isCompliant
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-rose-50 border-rose-200'
                            }`}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-full ${result?.isCompliant ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                    }`}>
                                    {result?.isCompliant ? <Check size={32} strokeWidth={3} /> : <AlertCircle size={32} strokeWidth={3} />}
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-extrabold ${result?.isCompliant ? 'text-emerald-800' : 'text-rose-800'
                                        }`}>
                                        {result?.isCompliant ? '符合標準' : '未符合標準'}
                                    </h2>
                                    <p className={`text-sm font-medium ${result?.isCompliant ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        屏東縣都市計畫區法定騎樓設置標準
                                    </p>
                                </div>
                            </div>

                            {/* Issues List */}
                            {result?.checks?.arcadeStandard?.issues?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-rose-200/50">
                                    <h3 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        需改善事項
                                    </h3>
                                    <ul className="space-y-2">
                                        {result.checks.arcadeStandard.issues.map((issue, idx) => (
                                            <li key={idx} className="text-sm text-rose-700 flex items-start gap-2">
                                                <span className="mt-0.5">•</span>
                                                <span>{issue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Not Required Message */}
                            {result?.checks?.arcadeStandard?.notRequired && (
                                <div className="mt-4 pt-4 border-t border-emerald-200/50">
                                    <p className="text-sm text-emerald-700">
                                        本案依條件判斷，不須依本標準檢討（或另有退縮規定）。
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Report Preview */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">報告預覽</h3>
                                <span className="text-xs text-slate-500">即時生成</span>
                            </div>
                            <div className="p-6 bg-slate-50/50">
                                <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed h-[400px] overflow-y-auto custom-scrollbar">
                                    {reportText}
                                </pre>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
