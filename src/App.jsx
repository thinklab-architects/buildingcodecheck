import React, { useState, useEffect } from 'react';
import BuildingForm from './components/BuildingForm';
import ComplianceResult from './components/ComplianceResult';
import { checkGreenBuildingCompliance, defaultBuildingData } from './utils/greenBuildingLogic';

function App() {
  const [buildingData, setBuildingData] = useState(defaultBuildingData);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const res = checkGreenBuildingCompliance(buildingData);
    setResults(res);
  }, [buildingData]);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-emerald-600 font-bold tracking-[0.2em] text-sm uppercase mb-3">
              ThinkLab Code Check
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              屏東縣綠建築自治條例檢核
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              自動化建築法規檢核系統，協助建築師快速評估專案合規性。
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <BuildingForm
              data={buildingData}
              onChange={setBuildingData}
            />
          </div>

          {/* Right Column: Results (Sticky) */}
          <div className="lg:col-span-7">
            <div className="sticky top-8">
              <ComplianceResult results={results} />
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Pingtung Green Building Checker. Designed for Excellence.</p>
      </footer>
    </div>
  );
}

export default App;
