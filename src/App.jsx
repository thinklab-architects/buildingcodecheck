import React, { useState, useEffect, useMemo } from 'react';
import { Save, Upload, FileDown, ArrowLeft } from 'lucide-react';
import GreenBuildingChecker from './components/GreenBuildingChecker';
import TdrChecker from './components/TdrChecker';
import CountyOddLotChecker from './components/CountyOddLotChecker';
import IrregularSiteChecker from './components/IrregularSiteChecker';
import TemporaryBuildingChecker from './components/TemporaryBuildingChecker';
import HomePage from './components/HomePage';
import { defaultBuildingData, checkGreenBuildingCompliance } from './utils/greenBuildingLogic';
import { exampleTdrData, checkTdrCompliance } from './utils/pingtungTdrLogic';
import { defaultLandCase, checkCountyOddLotCase } from './utils/countyOddLotLogic';
import { defaultSite, checkPingtungIrregularLandRules } from './utils/irregularSiteLogic';
import { defaultTemporaryBuilding, checkPingtungTemporaryBuilding } from './utils/temporaryBuildingLogic';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'green-building', 'tdr', 'county-odd-lot', 'irregular-site', 'temporary-building'

  // Debug log for version check
  useEffect(() => {
    console.log('Building Code Check v0.1.0 loaded');
  }, []);

  // State is lifted here to allow Header buttons to access it for Save/Export
  const [greenData, setGreenData] = useState(defaultBuildingData);
  const [tdrData, setTdrData] = useState(exampleTdrData);
  const [countyOddLotData, setCountyOddLotData] = useState(defaultLandCase);
  const [irregularSiteData, setIrregularSiteData] = useState(defaultSite);
  const [temporaryBuildingData, setTemporaryBuildingData] = useState(defaultTemporaryBuilding);

  // Track which checkers are enabled (checked on home page)
  const [enabledCheckers, setEnabledCheckers] = useState({
    'green-building': true,
    'tdr': true,
    'county-odd-lot': true,
    'irregular-site': true,
    'temporary-building': true,
  });

  const toggleChecker = (id) => {
    setEnabledCheckers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate statuses for Home Page
  const checkerStatuses = useMemo(() => {
    return {
      'green-building': checkGreenBuildingCompliance(greenData).isCompliant,
      'tdr': checkTdrCompliance(tdrData).isCompliant,
      'county-odd-lot': checkCountyOddLotCase(countyOddLotData).isCompliant,
      'irregular-site': checkPingtungIrregularLandRules(irregularSiteData).isCompliant,
      'temporary-building': checkPingtungTemporaryBuilding(temporaryBuildingData).isCompliant,
    };
  }, [greenData, tdrData, countyOddLotData, irregularSiteData, temporaryBuildingData]);

  // We also need to track results for export
  const [currentResults, setCurrentResults] = useState(null);

  // Reset results when view changes
  const handleNavigate = (view) => {
    setCurrentView(view);
    setCurrentResults(null);
  };

  // --- Persistence Functions ---

  const getCurrentData = () => {
    if (currentView === 'green-building') return greenData;
    if (currentView === 'tdr') return tdrData;
    if (currentView === 'county-odd-lot') return countyOddLotData;
    if (currentView === 'irregular-site') return irregularSiteData;
    if (currentView === 'temporary-building') return temporaryBuildingData;
    return null;
  };

  const handleSaveProject = () => {
    // If on home page, save Master Project
    if (currentView === 'home') {
      const masterData = {
        type: 'master-project',
        timestamp: new Date().toISOString(),
        data: {
          greenData,
          tdrData,
          countyOddLotData,
          irregularSiteData,
          temporaryBuildingData,
          enabledCheckers
        }
      };
      downloadJSON(masterData, `master_project_${new Date().toISOString().slice(0, 10)}.json`);
      return;
    }

    // Fallback for individual views (though button is hidden)
    const data = getCurrentData();
    if (!data) return;

    const exportObj = {
      type: currentView,
      data: data,
      timestamp: new Date().toISOString()
    };
    downloadJSON(exportObj, `${currentView}_data_${new Date().toISOString().slice(0, 10)}.json`);
  };

  const downloadJSON = (obj, filename) => {
    const jsonString = JSON.stringify(obj, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loaded = JSON.parse(e.target.result);

        // Handle Master Project
        if (loaded.type === 'master-project') {
          if (loaded.data.greenData) setGreenData(loaded.data.greenData);
          if (loaded.data.tdrData) setTdrData(loaded.data.tdrData);
          if (loaded.data.countyOddLotData) setCountyOddLotData(loaded.data.countyOddLotData);
          if (loaded.data.irregularSiteData) setIrregularSiteData(loaded.data.irregularSiteData);
          if (loaded.data.temporaryBuildingData) setTemporaryBuildingData(loaded.data.temporaryBuildingData);
          if (loaded.data.enabledCheckers) setEnabledCheckers(loaded.data.enabledCheckers);
          alert("專案總檔讀取成功！");
          return;
        }

        // Handle Individual Files
        if (loaded.type === 'green-building') {
          setGreenData(loaded.data);
          alert("綠建築案件讀取成功！");
        } else if (loaded.type === 'tdr') {
          setTdrData(loaded.data);
          alert("容積移轉案件讀取成功！");
        } else if (loaded.type === 'county-odd-lot') {
          setCountyOddLotData(loaded.data);
          alert("縣有畸零地案件讀取成功！");
        } else if (loaded.type === 'irregular-site') {
          setIrregularSiteData(loaded.data);
          alert("畸零地使用規則案件讀取成功！");
        } else if (loaded.type === 'temporary-building') {
          setTemporaryBuildingData(loaded.data);
          alert("臨時性建築物案件讀取成功！");
        } else {
          // Fallback logic for old format
          if (loaded.sendOutParcels) {
            setTdrData(loaded);
            alert("偵測為容積移轉資料，讀取成功！");
          } else if (loaded.isCountyOddLot !== undefined) {
            setCountyOddLotData(loaded);
            alert("偵測為縣有畸零地資料，讀取成功！");
          } else if (loaded.frontRoadWidthM !== undefined && loaded.useZone !== undefined) {
            setIrregularSiteData(loaded);
            alert("偵測為畸零地使用規則資料，讀取成功！");
          } else if (loaded.locationCounty !== undefined && loaded.isTemporaryBuilding !== undefined) {
            setTemporaryBuildingData(loaded);
            alert("偵測為臨時性建築物資料，讀取成功！");
          } else {
            setGreenData(loaded);
            alert("偵測為綠建築資料，讀取成功！");
          }
        }
      } catch {
        alert("讀取失敗：檔案格式錯誤");
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const handleExportCSV = () => {
    if (!currentResults || !currentResults.checks) {
      alert("目前無檢核結果可匯出");
      return;
    }

    const rows = [['項目', '結果', '說明']];

    const pushResult = (name, res) => {
      if (!res) return;
      const status = res.ok ? '合格' : '不合格';
      const issues = res.issues ? res.issues.join('; ') : '';
      const notes = res.notes ? res.notes.join('; ') : '';
      const desc = [issues, notes].filter(Boolean).join(' | ');

      rows.push([name, status, desc]);
    };

    Object.entries(currentResults.checks).forEach(([key, val]) => {
      pushResult(key, val);
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + "\uFEFF"
      + rows.map(e => e.map(c => `"${c}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentView}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Render Helpers ---

  const renderCurrentView = () => {
    switch (currentView) {
      case 'green-building':
        return (
          <GreenBuildingChecker
            data={greenData}
            onChange={setGreenData}
            onResultChange={setCurrentResults}
          />
        );
      case 'tdr':
        return (
          <TdrChecker
            data={tdrData}
            onChange={setTdrData}
            onResultChange={setCurrentResults}
          />
        );
      case 'county-odd-lot':
        return (
          <CountyOddLotChecker
            data={countyOddLotData}
            onChange={setCountyOddLotData}
            onResultChange={setCurrentResults}
          />
        );
      case 'irregular-site':
        return (
          <IrregularSiteChecker
            data={irregularSiteData}
            onChange={setIrregularSiteData}
            onResultChange={setCurrentResults}
          />
        );
      case 'temporary-building':
        return (
          <TemporaryBuildingChecker
            data={temporaryBuildingData}
            onChange={setTemporaryBuildingData}
            onResultChange={setCurrentResults}
          />
        );
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            enabledCheckers={enabledCheckers}
            toggleChecker={toggleChecker}
            checkerStatuses={checkerStatuses}
          />
        );
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'green-building': return '屏東縣綠建築自治條例檢核';
      case 'tdr': return '都市計畫容積移轉許可審查';
      case 'county-odd-lot': return '屏東縣縣有畸零地處理作業要點';
      case 'irregular-site': return '屏東縣畸零地使用規則';
      case 'temporary-building': return '屏東縣臨時性建築物管理要點';
      default: return '建築法規自動化檢核系統';
    }
  };

  return (
    <div className="app-root">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-brand flex items-center gap-4">
            {currentView !== 'home' && (
              <button
                onClick={() => handleNavigate('home')}
                className="p-2 rounded-full hover:bg-slate-200 transition text-slate-500"
                title="回首頁"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div>
              <h1>{getTitle()}</h1>
              <p>ThinkLab Architects Code Check System</p>
            </div>
          </div>

          <div className="header-meta items-center">
            <div className="flex gap-2">
              {/* Save/Load only on Home Page as requested */}
              {currentView === 'home' && (
                <>
                  <button
                    onClick={() => document.getElementById('load-file').click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-sm font-medium shadow-sm"
                  >
                    <Upload size={16} />
                    讀取專案
                  </button>
                  <input
                    type="file"
                    id="load-file"
                    className="hidden"
                    accept=".json"
                    onChange={handleLoadProject}
                  />

                  <button
                    onClick={handleSaveProject}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-sm font-medium shadow-sm"
                  >
                    <Save size={16} />
                    儲存專案
                  </button>
                </>
              )}

              {currentView !== 'home' && (
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition text-sm font-medium shadow-sm"
                >
                  <FileDown size={16} />
                  匯出報告
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        {renderCurrentView()}

        {/* Footer */}
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} ThinkLab Architects</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-sky-600">使用說明</a>
            <a href="#" className="hover:text-sky-600">問題回報</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
