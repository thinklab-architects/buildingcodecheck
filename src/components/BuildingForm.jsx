import React from 'react';
import { Building2, Leaf, Trash2, Droplets, Bike, ArrowUpFromLine, Lightbulb, Grid } from 'lucide-react';

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="card-header">
        <div className="card-title">
            <Icon size={18} className="text-sky-400" />
            {title}
        </div>
    </div>
);

const InputGroup = ({ label, children, subLabel }) => (
    <div className="input-group">
        <label className="input-label">
            {label}
            {subLabel && <span className="text-xs text-slate-500 ml-2">({subLabel})</span>}
        </label>
        {children}
    </div>
);

const Checkbox = ({ label, checked, onChange }) => (
    <label className={`tech-checkbox ${checked ? 'checked' : ''}`}>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <span>{label}</span>
    </label>
);

const NumberInput = ({ value, onChange, placeholder, unit }) => (
    <div className="relative">
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="input-dark w-full"
            placeholder={placeholder}
        />
        {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                {unit}
            </span>
        )}
    </div>
);

export default function BuildingForm({ data, onChange }) {
    const update = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const updateNested = (parent, field, value) => {
        onChange({
            ...data,
            [parent]: {
                ...data[parent],
                [field]: value
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Basic Info */}
            <div className="glass-card">
                <SectionHeader icon={Building2} title="基本資料" />
                <div className="flex flex-wrap gap-3 mb-6">
                    <Checkbox label="新建建築" checked={data.isNew} onChange={(v) => update('isNew', v)} />
                    <Checkbox label="公有建築" checked={data.isPublicOwned} onChange={(v) => update('isPublicOwned', v)} />
                    <Checkbox label="已領使用執照" checked={data.hasUsagePermit} onChange={(v) => update('hasUsagePermit', v)} />
                    <Checkbox label="供公眾使用" checked={data.isPublicUse} onChange={(v) => update('isPublicUse', v)} />
                    <Checkbox label="工廠類" checked={data.isFactory} onChange={(v) => update('isFactory', v)} />
                    <Checkbox label="預算已審議" checked={data.budgetApprovedBeforeOrdinance} onChange={(v) => update('budgetApprovedBeforeOrdinance', v)} />
                    <Checkbox label="多目標使用" checked={data.usesMultiPurposePublicFacilityReg} onChange={(v) => update('usesMultiPurposePublicFacilityReg', v)} />
                    <Checkbox label="綜合設計" checked={data.usesComprehensiveDesignCh15} onChange={(v) => update('usesComprehensiveDesignCh15', v)} />
                </div>

                <div className="input-grid">
                    <InputGroup label="工程造價" subLabel="NTD">
                        <NumberInput value={data.constructionCostNTD} onChange={(v) => update('constructionCostNTD', v)} />
                    </InputGroup>
                    <InputGroup label="樓高" subLabel="層數">
                        <NumberInput value={data.floorsAboveGround} onChange={(v) => update('floorsAboveGround', v)} />
                    </InputGroup>
                    <InputGroup label="單層建築面積" subLabel="m²">
                        <NumberInput value={data.buildingArea} onChange={(v) => update('buildingArea', v)} />
                    </InputGroup>
                    <InputGroup label="基地建築面積" subLabel="m²">
                        <NumberInput value={data.siteBuildingArea} onChange={(v) => update('siteBuildingArea', v)} />
                    </InputGroup>
                </div>
            </div>

            {/* Roof */}
            <div className="glass-card">
                <SectionHeader icon={ArrowUpFromLine} title="屋頂相關" />
                <div className="flex flex-wrap gap-3 mb-6">
                    <Checkbox label="有隔熱層" checked={data.roof.hasInsulationLayer} onChange={(v) => updateNested('roof', 'hasInsulationLayer', v)} />
                </div>
                <div className="input-grid">
                    <InputGroup label="屋頂平均熱傳透率">
                        <NumberInput value={data.roof.avgUValue} onChange={(v) => updateNested('roof', 'avgUValue', v)} unit="W/m²·°C" />
                    </InputGroup>
                    <InputGroup label="新建最大建築面積">
                        <NumberInput value={data.roof.maxBuildingArea} onChange={(v) => updateNested('roof', 'maxBuildingArea', v)} unit="m²" />
                    </InputGroup>
                    <InputGroup label="太陽光電容量">
                        <NumberInput value={data.roof.pvCapacityKWp} onChange={(v) => updateNested('roof', 'pvCapacityKWp', v)} unit="kWp" />
                    </InputGroup>
                    <InputGroup label="太陽光電投影面積">
                        <NumberInput value={data.roof.pvProjectionArea} onChange={(v) => updateNested('roof', 'pvProjectionArea', v)} unit="m²" />
                    </InputGroup>
                    <InputGroup label="屋頂綠化面積">
                        <NumberInput value={data.roof.roofGreenProjectionArea} onChange={(v) => updateNested('roof', 'roofGreenProjectionArea', v)} unit="m²" />
                    </InputGroup>
                    <InputGroup label="不可設置區域">
                        <NumberInput value={data.roof.nonBuildableArea} onChange={(v) => updateNested('roof', 'nonBuildableArea', v)} unit="m²" />
                    </InputGroup>
                </div>
            </div>

            {/* Waste */}
            <div className="glass-card">
                <SectionHeader icon={Trash2} title="垃圾設施" />
                <div className="flex flex-wrap gap-3 mb-6">
                    <Checkbox label="垃圾處理設施" checked={data.waste.hasFacility} onChange={(v) => updateNested('waste', 'hasFacility', v)} />
                    <Checkbox label="垃圾存放空間" checked={data.waste.hasStorageSpace} onChange={(v) => updateNested('waste', 'hasStorageSpace', v)} />
                    <Checkbox label="廚餘回收" checked={data.waste.hasFoodWasteFacility} onChange={(v) => updateNested('waste', 'hasFoodWasteFacility', v)} />
                    <Checkbox label="資源回收" checked={data.waste.hasRecyclingFacility} onChange={(v) => updateNested('waste', 'hasRecyclingFacility', v)} />
                    <Checkbox label="樓高 ≥ 16層" checked={data.waste.isHighRise16Plus} onChange={(v) => updateNested('waste', 'isHighRise16Plus', v)} />
                    <Checkbox label="室內存放 (高層)" checked={data.waste.isStorageIndoorIfHighRise} onChange={(v) => updateNested('waste', 'isStorageIndoorIfHighRise', v)} />
                </div>
                <div className="input-grid">
                    <InputGroup label="容積總樓地板面積">
                        <NumberInput value={data.waste.totalFloorArea} onChange={(v) => updateNested('waste', 'totalFloorArea', v)} unit="m²" />
                    </InputGroup>
                    <InputGroup label="垃圾存放體積">
                        <NumberInput value={data.waste.storageVolumeM3} onChange={(v) => updateNested('waste', 'storageVolumeM3', v)} unit="m³" />
                    </InputGroup>
                </div>
            </div>

            {/* Other Sections */}
            <div className="glass-card">
                <SectionHeader icon={Droplets} title="省水與綠建材" />
                <div className="flex flex-wrap gap-3 mb-6">
                    <Checkbox label="省水標章便器" checked={data.waterSaving.allToiletsWaterSavingCertified} onChange={(v) => updateNested('waterSaving', 'allToiletsWaterSavingCertified', v)} />
                    <Checkbox label="感應/踩踏洗手" checked={data.waterSaving.publicWashIsSensorOrFoot} onChange={(v) => updateNested('waterSaving', 'publicWashIsSensorOrFoot', v)} />
                </div>
                <div className="input-grid">
                    <InputGroup label="綠建材面積">
                        <NumberInput value={data.materials.greenMaterialArea} onChange={(v) => updateNested('materials', 'greenMaterialArea', v)} unit="m²" />
                    </InputGroup>
                    <InputGroup label="總檢討面積">
                        <NumberInput value={data.materials.totalAreaForCalc} onChange={(v) => updateNested('materials', 'totalAreaForCalc', v)} unit="m²" />
                    </InputGroup>
                </div>
            </div>

            {/* Bike & Lifts */}
            <div className="glass-card">
                <SectionHeader icon={Bike} title="自行車與電梯" />
                <div className="flex flex-wrap gap-3 mb-6">
                    <Checkbox label="自行車停車" checked={data.bikeParking.hasBikeParking} onChange={(v) => updateNested('bikeParking', 'hasBikeParking', v)} />
                    <Checkbox label="法規要求電梯" checked={data.lifts.requiredByCode} onChange={(v) => updateNested('lifts', 'requiredByCode', v)} />
                    <Checkbox label="可載自行車電梯" checked={data.lifts.hasBikeLift} onChange={(v) => updateNested('lifts', 'hasBikeLift', v)} />
                    <Checkbox label="自行車位在地面" checked={data.lifts.bikeParkingOnGroundFloor} onChange={(v) => updateNested('lifts', 'bikeParkingOnGroundFloor', v)} />
                </div>
                <div className="input-grid">
                    <InputGroup label="停車格寬度">
                        <NumberInput value={data.bikeParking.stallWidthCm} onChange={(v) => updateNested('bikeParking', 'stallWidthCm', v)} unit="cm" />
                    </InputGroup>
                    <InputGroup label="停車格長度">
                        <NumberInput value={data.bikeParking.stallLengthCm} onChange={(v) => updateNested('bikeParking', 'stallLengthCm', v)} unit="cm" />
                    </InputGroup>
                    <InputGroup label="法定汽車位">
                        <NumberInput value={data.bikeParking.legalCarParkingCount} onChange={(v) => updateNested('bikeParking', 'legalCarParkingCount', v)} unit="格" />
                    </InputGroup>
                    <InputGroup label="自行車位數">
                        <NumberInput value={data.bikeParking.bikeParkingStallsCount} onChange={(v) => updateNested('bikeParking', 'bikeParkingStallsCount', v)} unit="格" />
                    </InputGroup>
                    <InputGroup label="電梯人數">
                        <NumberInput value={data.lifts.personsCapacity} onChange={(v) => updateNested('lifts', 'personsCapacity', v)} unit="人" />
                    </InputGroup>
                </div>
            </div>

            {/* Lighting & Paving */}
            <div className="glass-card">
                <SectionHeader icon={Lightbulb} title="照明與鋪面" />
                <div className="flex flex-wrap gap-3">
                    <Checkbox label="高耗能燈具" checked={data.lighting.usesHighPowerLuminaires} onChange={(v) => updateNested('lighting', 'usesHighPowerLuminaires', v)} />
                    <Checkbox label="人工基盤硬舖面" checked={data.paving.hasHardPavingOnArtificialBase} onChange={(v) => updateNested('paving', 'hasHardPavingOnArtificialBase', v)} />
                    <Checkbox label="透水鋪面" checked={data.paving.usesPermeablePaving} onChange={(v) => updateNested('paving', 'usesPermeablePaving', v)} />
                </div>
            </div>
        </div>
    );
}
