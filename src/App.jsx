import React, { useState, useEffect } from 'react';
import BuildingForm from './components/BuildingForm';
import ComplianceResult from './components/ComplianceResult';
import { checkGreenBuildingCompliance, defaultBuildingData } from './utils/greenBuildingLogic';
import { Leaf } from 'lucide-react';

function App() {
  const [buildingData, setBuildingData] = useState(defaultBuildingData);
  const [results, setResults] = useState(null);

  // Auto-check whenever data changes
  useEffect(() => {
    const res = checkGreenBuildingCompliance(buildingData);
    setResults(res);
  }, [buildingData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 mb-4 ring-1 ring-emerald-500/30">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 mb-4 tracking-tight">
            屏東縣綠建築自治條例檢核
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            自動判斷建築類別並檢核各項綠建築指標是否符合規定
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-xl font-semibold text-white">案件資料輸入</h2>
              </div>
              <div className="p-6">
                <BuildingForm data={buildingData} onChange={setBuildingData} />
              </div>
            </div>
          </div>

          {/* Right Column: Results (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-xl font-semibold text-white">檢核結果報告</h2>
              </div>
              <div className="p-6">
                <ComplianceResult results={results} />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Pingtung Green Building Checker. Designed for Excellence.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
