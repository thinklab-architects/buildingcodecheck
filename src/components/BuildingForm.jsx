import React from 'react';
import {
    Building2,
    TreeDeciduous,
    Sun,
    Bike,
    Lightbulb,
    Trash2,
    Droplet,
    PaintBucket,
    ArrowUpDown,
    Grid3x3
} from 'lucide-react';
import { GlassCard, CardHeader, InputGroup, TechInput, TechCheckbox } from './SharedUI';

const BuildingForm = ({ data, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const handleNestedChange = (parent, field, value) => {
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
            {/* 1. 基本資料（建築分類） */}
            <GlassCard>
                <CardHeader icon={Building2} title="基本資料" />
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="新建建築"
                            checked={data.isNew}
                            onChange={(v) => handleChange('isNew', v)}
                        />
                        <TechCheckbox
                            label="公有建築"
                            checked={data.isPublicOwned}
                            onChange={(v) => handleChange('isPublicOwned', v)}
                        />
                        <TechCheckbox
                            label="已領使用執照"
                            checked={data.hasUsagePermit}
                            onChange={(v) => handleChange('hasUsagePermit', v)}
                        />
                        <TechCheckbox
                            label="供公眾使用"
                            checked={data.isPublicUse}
                            onChange={(v) => handleChange('isPublicUse', v)}
                        />
                        <TechCheckbox
                            label="工廠類建築"
                            checked={data.isFactory}
                            onChange={(v) => handleChange('isFactory', v)}
                        />
                        <TechCheckbox
                            label="條例施行前預算已審"
                            checked={data.budgetApprovedBeforeOrdinance}
                            onChange={(v) => handleChange('budgetApprovedBeforeOrdinance', v)}
                        />
                        <TechCheckbox
                            label="依多目標使用辦法申請"
                            checked={data.usesMultiPurposePublicFacilityReg}
                            onChange={(v) => handleChange('usesMultiPurposePublicFacilityReg', v)}
                        />
                        <TechCheckbox
                            label="依第15章綜合設計申請"
                            checked={data.usesComprehensiveDesignCh15}
                            onChange={(v) => handleChange('usesComprehensiveDesignCh15', v)}
                        />
                    </div>
                    <div className="input-grid">
                        <InputGroup label="工程造價" subLabel="(新台幣)">
                            <TechInput
                                type="number"
                                value={data.constructionCostNTD}
                                onChange={(e) => handleChange('constructionCostNTD', parseFloat(e.target.value) || 0)}
                                placeholder="50000000"
                                unit="元"
                            />
                        </InputGroup>
                        <InputGroup label="樓高" subLabel="(層數)">
                            <TechInput
                                type="number"
                                value={data.floorsAboveGround}
                                onChange={(e) => handleChange('floorsAboveGround', parseInt(e.target.value) || 0)}
                                placeholder="10"
                                unit="層"
                            />
                        </InputGroup>
                        <InputGroup label="單層建築面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.buildingArea}
                                onChange={(e) => handleChange('buildingArea', parseFloat(e.target.value) || 0)}
                                placeholder="1500"
                                unit="㎡"
                            />
                        </InputGroup>
                        <InputGroup label="基地建築面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.siteBuildingArea}
                                onChange={(e) => handleChange('siteBuildingArea', parseFloat(e.target.value) || 0)}
                                placeholder="300"
                                unit="㎡"
                            />
                        </InputGroup>
                    </div>
                </div>
            </GlassCard>

            {/* 2. 屋頂設施 */}
            <GlassCard>
                <CardHeader icon={Sun} title="屋頂設施" />
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="設置隔熱層"
                            checked={data.roof.hasInsulationLayer}
                            onChange={(v) => handleNestedChange('roof', 'hasInsulationLayer', v)}
                        />
                    </div>
                    <div className="input-grid">
                        <InputGroup label="屋頂平均熱傳透率" subLabel="(W/m²·°C)">
                            <TechInput
                                type="number"
                                step="0.01"
                                value={data.roof.avgUValue}
                                onChange={(e) => handleNestedChange('roof', 'avgUValue', parseFloat(e.target.value) || 0)}
                                placeholder="0.65"
                                unit="W/m²·°C"
                            />
                        </InputGroup>
                        <InputGroup label="最大建築面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.roof.maxBuildingArea}
                                onChange={(e) => handleNestedChange('roof', 'maxBuildingArea', parseFloat(e.target.value) || 0)}
                                placeholder="1000"
                                unit="㎡"
                            />
                        </InputGroup>
                        <InputGroup label="太陽光電容量" subLabel="(kWp)">
                            <TechInput
                                type="number"
                                step="0.1"
                                value={data.roof.pvCapacityKWp}
                                onChange={(e) => handleNestedChange('roof', 'pvCapacityKWp', parseFloat(e.target.value) || 0)}
                                placeholder="5"
                                unit="kWp"
                            />
                        </InputGroup>
                        <InputGroup label="太陽光電投影面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.roof.pvProjectionArea}
                                onChange={(e) => handleNestedChange('roof', 'pvProjectionArea', parseFloat(e.target.value) || 0)}
                                placeholder="600"
                                unit="㎡"
                            />
                        </InputGroup>
                        <InputGroup label="屋頂綠化投影面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.roof.roofGreenProjectionArea}
                                onChange={(e) => handleNestedChange('roof', 'roofGreenProjectionArea', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                unit="㎡"
                            />
                        </InputGroup>
                        <InputGroup label="不可設置區域面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.roof.nonBuildableArea}
                                onChange={(e) => handleNestedChange('roof', 'nonBuildableArea', parseFloat(e.target.value) || 0)}
                                placeholder="100"
                                unit="㎡"
                            />
                        </InputGroup>
                    </div>
                </div>
            </GlassCard>

            {/* 3. 垃圾處理設施 */}
            <GlassCard>
                <CardHeader icon={Trash2} title="垃圾處理設施" />
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="設置垃圾處理設施"
                            checked={data.waste.hasFacility}
                            onChange={(v) => handleNestedChange('waste', 'hasFacility', v)}
                        />
                        <TechCheckbox
                            label="設置垃圾存放空間"
                            checked={data.waste.hasStorageSpace}
                            onChange={(v) => handleNestedChange('waste', 'hasStorageSpace', v)}
                        />
                        <TechCheckbox
                            label="廚餘收集再利用設施"
                            checked={data.waste.hasFoodWasteFacility}
                            onChange={(v) => handleNestedChange('waste', 'hasFoodWasteFacility', v)}
                        />
                        <TechCheckbox
                            label="資源垃圾分類回收設施"
                            checked={data.waste.hasRecyclingFacility}
                            onChange={(v) => handleNestedChange('waste', 'hasRecyclingFacility', v)}
                        />
                        <TechCheckbox
                            label="樓高 ≥ 16 層"
                            checked={data.waste.isHighRise16Plus}
                            onChange={(v) => handleNestedChange('waste', 'isHighRise16Plus', v)}
                        />
                        <TechCheckbox
                            label="垃圾存放於室內（高樓層）"
                            checked={data.waste.isStorageIndoorIfHighRise}
                            onChange={(v) => handleNestedChange('waste', 'isStorageIndoorIfHighRise', v)}
                        />
                    </div>
                    <div className="input-grid">
                        <InputGroup label="容積總樓地板面積" subLabel="(㎡)">
                            <TechInput
                                type="number"
                                value={data.waste.totalFloorArea}
                                onChange={(e) => handleNestedChange('waste', 'totalFloorArea', parseFloat(e.target.value) || 0)}
                                placeholder="10000"
                                unit="㎡"
                            />
                        </InputGroup>
                        <InputGroup label="垃圾存放空間體積" subLabel="(m³)">
                            <TechInput
                                type="number"
                                value={data.waste.storageVolumeM3}
                                onChange={(e) => handleNestedChange('waste', 'storageVolumeM3', parseFloat(e.target.value) || 0)}
                                placeholder="50"
                                unit="m³"
                            />
                        </InputGroup>
                    </div>
                </div>
            </GlassCard>

            {/* 4. 省水設備 */}
            <GlassCard>
                <CardHeader icon={Droplet} title="省水設備" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <TechCheckbox
                        label="便器取得省水標章"
                        checked={data.waterSaving.allToiletsWaterSavingCertified}
                        onChange={(v) => handleNestedChange('waterSaving', 'allToiletsWaterSavingCertified', v)}
                    />
                    <TechCheckbox
                        label="公用洗手設備為感應或踩踏式"
                        checked={data.waterSaving.publicWashIsSensorOrFoot}
                        onChange={(v) => handleNestedChange('waterSaving', 'publicWashIsSensorOrFoot', v)}
                    />
                </div>
            </GlassCard>

            {/* 5. 綠建材 */}
            <GlassCard>
                <CardHeader icon={PaintBucket} title="綠建材" />
                <div className="input-grid">
                    <InputGroup label="綠建材面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.materials.greenMaterialArea}
                            onChange={(e) => handleNestedChange('materials', 'greenMaterialArea', parseFloat(e.target.value) || 0)}
                            placeholder="900"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="總檢討面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.materials.totalAreaForCalc}
                            onChange={(e) => handleNestedChange('materials', 'totalAreaForCalc', parseFloat(e.target.value) || 0)}
                            placeholder="1800"
                            unit="㎡"
                        />
                    </InputGroup>
                </div>
            </GlassCard>

            {/* 6. 自行車停車 */}
            <GlassCard>
                <CardHeader icon={Bike} title="自行車停車" />
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="設置自行車停車空間"
                            checked={data.bikeParking.hasBikeParking}
                            onChange={(v) => handleNestedChange('bikeParking', 'hasBikeParking', v)}
                        />
                    </div>
                    <div className="input-grid">
                        <InputGroup label="停車格寬度" subLabel="(cm)">
                            <TechInput
                                type="number"
                                value={data.bikeParking.stallWidthCm}
                                onChange={(e) => handleNestedChange('bikeParking', 'stallWidthCm', parseFloat(e.target.value) || 0)}
                                placeholder="70"
                                unit="cm"
                            />
                        </InputGroup>
                        <InputGroup label="停車格長度" subLabel="(cm)">
                            <TechInput
                                type="number"
                                value={data.bikeParking.stallLengthCm}
                                onChange={(e) => handleNestedChange('bikeParking', 'stallLengthCm', parseFloat(e.target.value) || 0)}
                                placeholder="190"
                                unit="cm"
                            />
                        </InputGroup>
                        <InputGroup label="法定汽機車停車位數" subLabel="(個)">
                            <TechInput
                                type="number"
                                value={data.bikeParking.legalCarParkingCount}
                                onChange={(e) => handleNestedChange('bikeParking', 'legalCarParkingCount', parseInt(e.target.value) || 0)}
                                placeholder="100"
                                unit="個"
                            />
                        </InputGroup>
                        <InputGroup label="實際自行車位數" subLabel="(個)">
                            <TechInput
                                type="number"
                                value={data.bikeParking.bikeParkingStallsCount}
                                onChange={(e) => handleNestedChange('bikeParking', 'bikeParkingStallsCount', parseInt(e.target.value) || 0)}
                                placeholder="60"
                                unit="個"
                            />
                        </InputGroup>
                    </div>
                </div>
            </GlassCard>

            {/* 7. 電梯設施 */}
            <GlassCard>
                <CardHeader icon={ArrowUpDown} title="電梯設施" />
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <TechCheckbox
                            label="建築技術規則要求設置電梯"
                            checked={data.lifts.requiredByCode}
                            onChange={(v) => handleNestedChange('lifts', 'requiredByCode', v)}
                        />
                        <TechCheckbox
                            label="設置可載人+自行車電梯"
                            checked={data.lifts.hasBikeLift}
                            onChange={(v) => handleNestedChange('lifts', 'hasBikeLift', v)}
                        />
                        <TechCheckbox
                            label="自行車位在地面層"
                            checked={data.lifts.bikeParkingOnGroundFloor}
                            onChange={(v) => handleNestedChange('lifts', 'bikeParkingOnGroundFloor', v)}
                        />
                    </div>
                    <div className="input-grid">
                        <InputGroup label="電梯額定人數" subLabel="(人)">
                            <TechInput
                                type="number"
                                value={data.lifts.personsCapacity}
                                onChange={(e) => handleNestedChange('lifts', 'personsCapacity', parseInt(e.target.value) || 0)}
                                placeholder="12"
                                unit="人"
                            />
                        </InputGroup>
                    </div>
                </div>
            </GlassCard>

            {/* 8. 基地鋪面 */}
            <GlassCard>
                <CardHeader icon={Grid3x3} title="基地鋪面" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <TechCheckbox
                        label="有人工基盤硬舖面"
                        checked={data.paving.hasHardPavingOnArtificialBase}
                        onChange={(v) => handleNestedChange('paving', 'hasHardPavingOnArtificialBase', v)}
                    />
                    <TechCheckbox
                        label="使用透水性鋪面"
                        checked={data.paving.usesPermeablePaving}
                        onChange={(v) => handleNestedChange('paving', 'usesPermeablePaving', v)}
                    />
                </div>
            </GlassCard>

            {/* 9. 室內裝修（第5類建築） */}
            <GlassCard>
                <CardHeader icon={Lightbulb} title="室內裝修" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <TechCheckbox
                        label="使用高耗能燈具"
                        checked={data.lighting.usesHighPowerLuminaires}
                        onChange={(v) => handleNestedChange('lighting', 'usesHighPowerLuminaires', v)}
                    />
                </div>
            </GlassCard>

            {/* 10. 其他資訊 */}
            <GlassCard>
                <CardHeader icon={Building2} title="其他資訊" />
                <div className="input-grid">
                    <InputGroup label="申請年度" subLabel="(民國年)">
                        <TechInput
                            type="number"
                            value={data.applicationYear}
                            onChange={(e) => handleChange('applicationYear', parseInt(e.target.value) || 0)}
                            placeholder="105"
                            unit="年"
                        />
                    </InputGroup>
                </div>
            </GlassCard>
        </div>
    );
};

export default BuildingForm;
