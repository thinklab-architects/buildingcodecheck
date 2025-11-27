import React from 'react';
import { Building2, Leaf, Trash2, Droplets, Bike, ArrowUpFromLine, Lightbulb, Grid } from 'lucide-react';

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <Icon className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
);

const InputGroup = ({ label, children, subLabel }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {subLabel && <span className="text-xs text-gray-500 ml-2">({subLabel})</span>}
        </label>
        {children}
    </div>
);

const Checkbox = ({ label, checked, onChange }) => (
    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${checked ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 bg-white"
        />
        <span className={`text-sm ${checked ? 'text-emerald-900 font-medium' : 'text-gray-700'}`}>{label}</span>
    </label>
);

const NumberInput = ({ value, onChange, placeholder, unit }) => (
    <div className="relative">
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
            placeholder={placeholder}
        />
        {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
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
        <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={Building2} title="基本資料" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Checkbox
                        label="是否為新建建築"
                        checked={data.isNew}
                        onChange={(v) => update('isNew', v)}
                    />
                    <Checkbox
                        label="是否為公有建築"
                        checked={data.isPublicOwned}
                        onChange={(v) => update('isPublicOwned', v)}
                    />
                    <Checkbox
                        label="是否已領使用執照"
                        checked={data.hasUsagePermit}
                        onChange={(v) => update('hasUsagePermit', v)}
                    />
                    <Checkbox
                        label="供公眾使用"
                        checked={data.isPublicUse}
                        onChange={(v) => update('isPublicUse', v)}
                    />
                    <Checkbox
                        label="是否工廠類建築"
                        checked={data.isFactory}
                        onChange={(v) => update('isFactory', v)}
                    />
                    <Checkbox
                        label="條例施行前預算已審議通過"
                        checked={data.budgetApprovedBeforeOrdinance}
                        onChange={(v) => update('budgetApprovedBeforeOrdinance', v)}
                    />
                    <Checkbox
                        label="依「多目標使用辦法」申請"
                        checked={data.usesMultiPurposePublicFacilityReg}
                        onChange={(v) => update('usesMultiPurposePublicFacilityReg', v)}
                    />
                    <Checkbox
                        label="依第 15 章綜合設計申請"
                        checked={data.usesComprehensiveDesignCh15}
                        onChange={(v) => update('usesComprehensiveDesignCh15', v)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <InputGroup label="工程造價">
                        <NumberInput
                            value={data.constructionCostNTD}
                            onChange={(v) => update('constructionCostNTD', v)}
                            unit="NTD"
                        />
                    </InputGroup>
                    <InputGroup label="樓高（層數）">
                        <NumberInput
                            value={data.floorsAboveGround}
                            onChange={(v) => update('floorsAboveGround', v)}
                            unit="層"
                        />
                    </InputGroup>
                    <InputGroup label="單層建築面積">
                        <NumberInput
                            value={data.buildingArea}
                            onChange={(v) => update('buildingArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                    <InputGroup label="基地建築面積">
                        <NumberInput
                            value={data.siteBuildingArea}
                            onChange={(v) => update('siteBuildingArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Roof */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={ArrowUpFromLine} title="屋頂相關" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <Checkbox
                        label="是否有隔熱層"
                        checked={data.roof.hasInsulationLayer}
                        onChange={(v) => updateNested('roof', 'hasInsulationLayer', v)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="屋頂平均熱傳透率">
                        <NumberInput
                            value={data.roof.avgUValue}
                            onChange={(v) => updateNested('roof', 'avgUValue', v)}
                            unit="W/m²·°C"
                        />
                    </InputGroup>
                    <InputGroup label="新建最大建築面積">
                        <NumberInput
                            value={data.roof.maxBuildingArea}
                            onChange={(v) => updateNested('roof', 'maxBuildingArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                    <InputGroup label="太陽光電設置容量">
                        <NumberInput
                            value={data.roof.pvCapacityKWp}
                            onChange={(v) => updateNested('roof', 'pvCapacityKWp', v)}
                            unit="kWp"
                        />
                    </InputGroup>
                    <InputGroup label="太陽光電投影面積">
                        <NumberInput
                            value={data.roof.pvProjectionArea}
                            onChange={(v) => updateNested('roof', 'pvProjectionArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                    <InputGroup label="屋頂綠化投影面積">
                        <NumberInput
                            value={data.roof.roofGreenProjectionArea}
                            onChange={(v) => updateNested('roof', 'roofGreenProjectionArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                    <InputGroup label="屋頂不可設置區域面積">
                        <NumberInput
                            value={data.roof.nonBuildableArea}
                            onChange={(v) => updateNested('roof', 'nonBuildableArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Waste */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={Trash2} title="垃圾設施" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <Checkbox
                        label="設置垃圾處理設施"
                        checked={data.waste.hasFacility}
                        onChange={(v) => updateNested('waste', 'hasFacility', v)}
                    />
                    <Checkbox
                        label="設置垃圾存放空間"
                        checked={data.waste.hasStorageSpace}
                        onChange={(v) => updateNested('waste', 'hasStorageSpace', v)}
                    />
                    <Checkbox
                        label="廚餘收集再利用"
                        checked={data.waste.hasFoodWasteFacility}
                        onChange={(v) => updateNested('waste', 'hasFoodWasteFacility', v)}
                    />
                    <Checkbox
                        label="資源垃圾分類回收"
                        checked={data.waste.hasRecyclingFacility}
                        onChange={(v) => updateNested('waste', 'hasRecyclingFacility', v)}
                    />
                    <Checkbox
                        label="樓高是否 ≥ 16 層"
                        checked={data.waste.isHighRise16Plus}
                        onChange={(v) => updateNested('waste', 'isHighRise16Plus', v)}
                    />
                    <Checkbox
                        label="垃圾存放是否在室內 (若≥16層)"
                        checked={data.waste.isStorageIndoorIfHighRise}
                        onChange={(v) => updateNested('waste', 'isStorageIndoorIfHighRise', v)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="容積總樓地板面積">
                        <NumberInput
                            value={data.waste.totalFloorArea}
                            onChange={(v) => updateNested('waste', 'totalFloorArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                    <InputGroup label="垃圾存放空間體積">
                        <NumberInput
                            value={data.waste.storageVolumeM3}
                            onChange={(v) => updateNested('waste', 'storageVolumeM3', v)}
                            unit="m³"
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Water Saving */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={Droplets} title="省水設備" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Checkbox
                        label="省水標章便器"
                        checked={data.waterSaving.allToiletsWaterSavingCertified}
                        onChange={(v) => updateNested('waterSaving', 'allToiletsWaterSavingCertified', v)}
                    />
                    <Checkbox
                        label="公用洗手設備為感應或踩踏"
                        checked={data.waterSaving.publicWashIsSensorOrFoot}
                        onChange={(v) => updateNested('waterSaving', 'publicWashIsSensorOrFoot', v)}
                    />
                </div>
            </div>

            {/* Materials */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={Leaf} title="綠建材" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="綠建材面積">
                        <NumberInput
                            value={data.materials.greenMaterialArea}
                            onChange={(v) => updateNested('materials', 'greenMaterialArea', v)}
                            unit="m²"
                        />
                    </InputGroup>
                    <InputGroup label="總檢討面積">
                        <NumberInput
                            value={data.materials.totalAreaForCalc}
                            onChange={(v) => updateNested('materials', 'totalAreaForCalc', v)}
                            unit="m²"
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Bike Parking */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={Bike} title="自行車停車" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <Checkbox
                        label="設置自行車停車空間"
                        checked={data.bikeParking.hasBikeParking}
                        onChange={(v) => updateNested('bikeParking', 'hasBikeParking', v)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="停車格寬度">
                        <NumberInput
                            value={data.bikeParking.stallWidthCm}
                            onChange={(v) => updateNested('bikeParking', 'stallWidthCm', v)}
                            unit="cm"
                        />
                    </InputGroup>
                    <InputGroup label="停車格長度">
                        <NumberInput
                            value={data.bikeParking.stallLengthCm}
                            onChange={(v) => updateNested('bikeParking', 'stallLengthCm', v)}
                            unit="cm"
                        />
                    </InputGroup>
                    <InputGroup label="法定汽機車停車位數量">
                        <NumberInput
                            value={data.bikeParking.legalCarParkingCount}
                            onChange={(v) => updateNested('bikeParking', 'legalCarParkingCount', v)}
                            unit="格"
                        />
                    </InputGroup>
                    <InputGroup label="實際規劃自行車位數">
                        <NumberInput
                            value={data.bikeParking.bikeParkingStallsCount}
                            onChange={(v) => updateNested('bikeParking', 'bikeParkingStallsCount', v)}
                            unit="格"
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Lifts */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={ArrowUpFromLine} title="電梯" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <Checkbox
                        label="建築技術規則要求設置電梯"
                        checked={data.lifts.requiredByCode}
                        onChange={(v) => updateNested('lifts', 'requiredByCode', v)}
                    />
                    <Checkbox
                        label="設置可載人＋自行車電梯"
                        checked={data.lifts.hasBikeLift}
                        onChange={(v) => updateNested('lifts', 'hasBikeLift', v)}
                    />
                    <Checkbox
                        label="自行車位在地面層"
                        checked={data.lifts.bikeParkingOnGroundFloor}
                        onChange={(v) => updateNested('lifts', 'bikeParkingOnGroundFloor', v)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="電梯額定人數">
                        <NumberInput
                            value={data.lifts.personsCapacity}
                            onChange={(v) => updateNested('lifts', 'personsCapacity', v)}
                            unit="人"
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Lighting & Paving */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <SectionHeader icon={Lightbulb} title="其他 (照明/鋪面)" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Checkbox
                        label="使用高耗能燈具 (舊有建築裝修)"
                        checked={data.lighting.usesHighPowerLuminaires}
                        onChange={(v) => updateNested('lighting', 'usesHighPowerLuminaires', v)}
                    />
                    <Checkbox
                        label="有人工基盤硬舖面"
                        checked={data.paving.hasHardPavingOnArtificialBase}
                        onChange={(v) => updateNested('paving', 'hasHardPavingOnArtificialBase', v)}
                    />
                    <Checkbox
                        label="使用透水鋪面"
                        checked={data.paving.usesPermeablePaving}
                        onChange={(v) => updateNested('paving', 'usesPermeablePaving', v)}
                    />
                </div>
            </div>
        </div>
    );
}
