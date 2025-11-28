import React from 'react';
import {
    Building2,
    TreeDeciduous,
    Sun,
    Bike,
    Lightbulb
} from 'lucide-react';
import { GlassCard, CardHeader, InputGroup, TechInput, TechCheckbox } from './SharedUI';

const BuildingForm = ({ data, onChange }) => {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* 1. 基本資料 */}
            <GlassCard>
                <CardHeader icon={Building2} title="基本資料" />
                <div className="input-grid">
                    <InputGroup label="基地面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.baseArea}
                            onChange={(e) => handleChange('baseArea', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="法定建蔽率" subLabel="(%)">
                        <TechInput
                            type="number"
                            value={data.legalCoverageRate}
                            onChange={(e) => handleChange('legalCoverageRate', parseFloat(e.target.value) || 0)}
                            placeholder="60"
                            unit="%"
                        />
                    </InputGroup>
                </div>
            </GlassCard>

            {/* 2. 綠化與保水 */}
            <GlassCard>
                <CardHeader icon={TreeDeciduous} title="綠化與保水" />
                <div className="input-grid">
                    <InputGroup label="法定空地面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.legalOpenSpace}
                            onChange={(e) => handleChange('legalOpenSpace', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="實設空地面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.actualOpenSpace}
                            onChange={(e) => handleChange('actualOpenSpace', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="植栽面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.plantedArea}
                            onChange={(e) => handleChange('plantedArea', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="透水鋪面面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.permeableArea}
                            onChange={(e) => handleChange('permeableArea', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                </div>
            </GlassCard>

            {/* 3. 屋頂設施 */}
            <GlassCard>
                <CardHeader icon={Sun} title="屋頂設施" />
                <div className="input-grid">
                    <InputGroup label="屋頂層面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.roofArea}
                            onChange={(e) => handleChange('roofArea', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="太陽光電面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.solarPanelArea}
                            onChange={(e) => handleChange('solarPanelArea', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="屋頂綠化面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.roofGreeningArea}
                            onChange={(e) => handleChange('roofGreeningArea', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                    <InputGroup label="屋頂隔熱面積" subLabel="(㎡)">
                        <TechInput
                            type="number"
                            value={data.roofInsulationArea}
                            onChange={(e) => handleChange('roofInsulationArea', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            unit="㎡"
                        />
                    </InputGroup>
                </div>
                <div className="mt-4">
                    <TechCheckbox
                        label="屋頂隔熱材熱傳透率低於 0.5 W/(m²·K)"
                        checked={data.roofInsulationValue}
                        onChange={(val) => handleChange('roofInsulationValue', val)}
                    />
                </div>
            </GlassCard>

            {/* 4. 節能與資源 */}
            <GlassCard>
                <CardHeader icon={Lightbulb} title="節能與資源" />
                <div className="flex flex-col gap-3">
                    <TechCheckbox
                        label="使用省水標章設備"
                        checked={data.hasWaterSavingDevices}
                        onChange={(val) => handleChange('hasWaterSavingDevices', val)}
                    />
                    <TechCheckbox
                        label="使用綠建材 (比例達標)"
                        checked={data.hasGreenMaterials}
                        onChange={(val) => handleChange('hasGreenMaterials', val)}
                    />
                    <TechCheckbox
                        label="照明密度符合標準"
                        checked={data.hasEfficientLighting}
                        onChange={(val) => handleChange('hasEfficientLighting', val)}
                    />
                </div>
            </GlassCard>

            {/* 5. 其他設施 */}
            <GlassCard>
                <CardHeader icon={Bike} title="其他設施" />
                <div className="flex flex-col gap-3">
                    <TechCheckbox
                        label="設有自行車停車位"
                        checked={data.hasBikeParking}
                        onChange={(val) => handleChange('hasBikeParking', val)}
                    />
                    <TechCheckbox
                        label="設有自行車專用電梯 (如適用)"
                        checked={data.hasBikeLift}
                        onChange={(val) => handleChange('hasBikeLift', val)}
                    />
                    <TechCheckbox
                        label="設有垃圾分類儲存空間"
                        checked={data.hasWasteSorting}
                        onChange={(val) => handleChange('hasWasteSorting', val)}
                    />
                </div>
            </GlassCard>
        </div>
    );
};

export default BuildingForm;
