import React, { useEffect } from 'react';
import BuildingForm from './BuildingForm';
import ComplianceResult from './ComplianceResult';
import { checkGreenBuildingCompliance } from '../utils/greenBuildingLogic';

export default function GreenBuildingChecker({ data, onChange, onResultChange }) {
    // Calculate results whenever data changes
    const results = checkGreenBuildingCompliance(data);

    // Notify parent of result changes (for export)
    useEffect(() => {
        if (onResultChange) onResultChange(results);
    }, [results, onResultChange]);

    return (
        <div className="app-main">
            {/* Left: Input Form */}
            <section className="input-section">
                <BuildingForm
                    data={data}
                    onChange={onChange}
                />
            </section>

            {/* Right: Results */}
            <section className="result-section">
                <ComplianceResult results={results} />
            </section>
        </div>
    );
}
