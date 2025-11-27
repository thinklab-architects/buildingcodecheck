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
    <div className="page-shell">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__title-block">
          <div className="app-logo">
            <Building2 size={20} />
          </div>
          <div className="app-title-text">
            <h1>屏東縣綠建築自治條例檢核</h1>
            <small>自動化建築法規檢核系統，協助建築師快速評估專案合規性。</small>
          </div>
        </div>
        <div className="app-header__actions">
          <span className="badge-pill">ThinkLab Code Check</span>
          <a
            href="https://github.com/thinklab-architects/buildingcodecheck"
            target="_blank"
            rel="noopener noreferrer"
            className="link-ghost"
          >
            View on GitHub
          </a>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Left: Input Form */}
        <BuildingForm
          data={buildingData}
          onChange={setBuildingData}
        />

        {/* Right: Results */}
        <ComplianceResult results={results} />
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Pingtung Green Building Checker</span>
        <span>
          <a
            href="https://github.com/thinklab-architects/buildingcodecheck"
            target="_blank"
            rel="noopener noreferrer"
          >
            貢獻 / issue 建議
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
