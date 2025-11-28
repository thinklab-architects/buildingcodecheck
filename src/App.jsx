import React, { useState, useEffect } from 'react';
import BuildingForm from './components/BuildingForm';
import ComplianceResult from './components/ComplianceResult';
import { checkGreenBuildingCompliance, defaultBuildingData } from './utils/greenBuildingLogic';
import { Building2 } from 'lucide-react';

function App() {
  const [buildingData, setBuildingData] = useState(defaultBuildingData);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const res = checkGreenBuildingCompliance(buildingData);
    setResults(res);
  }, [buildingData]);

  return (
    <div className="app-root">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-brand">
            <h1>屏東縣綠建築自治條例檢核</h1>
            <p>Pingtung Green Building Compliance Checker</p>
          </div>
          <div className="header-meta">
            <span>資料來源：屏東縣政府</span>
            <span>最後更新：2025-11-28</span>
          </div>
        </header>

        {/* Main Layout */}
        <main className="app-main">
          {/* Left: Input Form (Toolbar style) */}
          <section className="input-section">
            <BuildingForm
              data={buildingData}
              onChange={setBuildingData}
            />
          </section>

          {/* Right: Results */}
          <section className="result-section">
            <ComplianceResult results={results} />
          </section>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} ThinkLab Architects</span>
          <span>Powered by React & Dark Tech UI</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
