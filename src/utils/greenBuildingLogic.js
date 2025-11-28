
// 判斷建築物類別（第 4 條）
export function classifyBuildingType(b) {
  // 第 5 類：已領使用執照
  if (b.hasUsagePermit) return 5;

  // 第 1 類：公有新建建築物，且非「公布前預算已審」或「造價 < 3000 萬」
  const costLimit = 30000000;
  if (
    b.isNew &&
    b.isPublicOwned &&
    !(b.budgetApprovedBeforeOrdinance || b.constructionCostNTD < costLimit)
  ) {
    return 1;
  }

  // 第 2 類：多目標使用 / 綜合設計申請 或 樓高 ≥ 16 層之新建建築
  if (
    b.isNew &&
    (b.usesMultiPurposePublicFacilityReg ||
      b.usesComprehensiveDesignCh15 ||
      b.floorsAboveGround >= 16)
  ) {
    return 2;
  }

  // 第 3 類：工廠類新建建築物，建築面積 > 1000m²
  if (b.isNew && b.isFactory && b.buildingArea > 1000) {
    return 3;
  }

  // 第 4 類：其他供公眾使用之新建建築，基地建築面積 ≥ 200m²
  if (
    b.isNew &&
    !b.isPublicOwned &&
    !b.isFactory &&
    b.isPublicUse &&
    b.siteBuildingArea >= 200
  ) {
    return 4;
  }

  return null; // 無法歸類
}

// ====== 各項檢核 Helper ======

// 第 10 條：太陽光電
function checkSolarRequirement(type, roof) {
  const issues = [];

  if (!roof) {
    issues.push("缺少 roof 資料");
    return { ok: false, issues };
  }

  if (type === 1 || type === 2 || type === 4) {
    if ((roof.pvCapacityKWp || 0) < 2) {
      issues.push("第10條：第1/2/4類建築物，每幢太陽光電容量需 ≥ 2 kWp");
    }
  } else if (type === 3) {
    const effectiveArea = (roof.maxBuildingArea || 0) - (roof.nonBuildableArea || 0);
    const requiredArea = effectiveArea * 0.5;
    if ((roof.pvProjectionArea || 0) < requiredArea) {
      issues.push(
        `第10條：第3類建築物太陽光電投影面積需 ≥ 有效最大建築面積 1/2（要求 ${requiredArea.toFixed(
          2
        )} m²）`
      );
    }

    if ((roof.roofGreenProjectionArea || 0) < requiredArea) {
      issues.push(
        `第11條：屋頂綠化投影面積需 ≥ 有效最大建築面積 1/2（要求 ${requiredArea.toFixed(
          2
        )} m²）`
      );
    }

    return { ok: issues.length === 0, issues };
  }

  return { ok: issues.length === 0, issues };
}

// 第 12 條：屋頂隔熱
function checkRoofInsulation(roof) {
  const issues = [];
  if (!roof) {
    issues.push("缺少 roof 資料");
    return { ok: false, issues };
  }
  if (!roof.hasInsulationLayer) {
    issues.push("第12條：屋頂須設置隔熱層");
  }
  if (typeof roof.avgUValue === "number" && roof.avgUValue >= 0.8) {
    issues.push("第12條：屋頂平均熱傳透率需 < 0.8 W/(m²·°C)");
  }
  return { ok: issues.length === 0, issues };
}

// 第 13 條：垃圾存放空間
function checkWasteFacilities(waste) {
  const issues = [];
  if (!waste) {
    issues.push("缺少 waste 資料");
    return { ok: false, issues };
  }

  if (!waste.hasFacility || !waste.hasStorageSpace) {
    issues.push("第13條：須設垃圾暫存設施及垃圾存放空間");
  }
  if (!waste.hasFoodWasteFacility) {
    issues.push("第13條：須設廚餘收集處理再利用設施");
  }
  if (!waste.hasRecyclingFacility) {
    issues.push("第13條：須設資源垃圾分類回收設施");
  }

  // 使用人口計算：每20m² 算1人
  if (waste.totalFloorArea && waste.storageVolumeM3 != null) {
    const population = waste.totalFloorArea / 20;
    const requiredVolume = population * 0.00605; // m³
    if (waste.storageVolumeM3 < requiredVolume) {
      issues.push(
        `第13條：垃圾存放空間容量不足，需 ≥ ${requiredVolume.toFixed(2)} m³`
      );
    }
  }

  if (waste.isHighRise16Plus && !waste.isStorageIndoorIfHighRise) {
    issues.push("第13條：樓高16層以上垃圾存放空間須設於室內");
  }

  return { ok: issues.length === 0, issues };
}

// 第 14 條：省水設備
function checkWaterSaving(waterSaving) {
  const issues = [];
  if (!waterSaving) {
    issues.push("缺少 waterSaving 資料");
    return { ok: false, issues };
  }
  if (!waterSaving.allToiletsWaterSavingCertified) {
    issues.push("第14條：便器須取得省水標章認證");
  }
  if (!waterSaving.publicWashIsSensorOrFoot) {
    issues.push("第14條：供公眾使用之洗手設備須為踩踏式或感應式");
  }
  return { ok: issues.length === 0, issues };
}

// 第 15 條 + 第 6 條第 3 款：綠建材使用率 ≥ 45%
function checkGreenMaterialRate(materials) {
  const issues = [];
  if (!materials) {
    issues.push("缺少 materials 資料");
    return { ok: false, issues };
  }
  const total = materials.totalAreaForCalc || 0;
  const green = materials.greenMaterialArea || 0;
  if (total <= 0) {
    issues.push("第15條：綠建材檢討面積總面積需大於 0");
    return { ok: false, issues };
  }
  const rate = (green / total) * 100;
  if (rate < 45) {
    issues.push(
      `第6條、第15條：綠建材使用率需 ≥ 45%，目前約為 ${rate.toFixed(1)}%`
    );
  }
  return { ok: issues.length === 0, issues };
}

// 第 16 條：自行車停車規定
function checkBikeParking(bikeParking, isPublicOwned) {
  const issues = [];
  if (!bikeParking) {
    issues.push("缺少 bikeParking 資料");
    return { ok: false, issues };
  }

  if (!bikeParking.hasBikeParking) {
    issues.push("須設置自行車停車空間（第5或第8條）");
  }

  if (bikeParking.stallWidthCm != null && bikeParking.stallWidthCm < 60) {
    issues.push("第16條：自行車停車格寬度不得小於 60 cm");
  }

  if (bikeParking.stallLengthCm != null && bikeParking.stallLengthCm < 185) {
    issues.push("第16條：自行車停車格長度不得小於 185 cm");
  }

  if (isPublicOwned) {
    const requiredBikeStalls = (bikeParking.legalCarParkingCount || 0) / 2;
    if ((bikeParking.bikeParkingStallsCount || 0) < requiredBikeStalls) {
      issues.push(
        `第16條：公有建築物自行車停車數量不得少於法定停車位 1/2（需 ≥ ${requiredBikeStalls} 格）`
      );
    }
  }

  return { ok: issues.length === 0, issues };
}

// 第 17 條：可載自行車電梯
function checkBikeLift(lifts, bikeParkingRequired) {
  const issues = [];
  if (!lifts) {
    issues.push("缺少 lifts 資料");
    return { ok: false, issues };
  }

  if (!lifts.requiredByCode) {
    // 若建築技術規則本身就不要求設置電梯，則不檢查
    return { ok: true, issues: [] };
  }

  // 若自行車位在地面層，可免具載車功能
  if (lifts.bikeParkingOnGroundFloor) {
    return { ok: true, issues: [] };
  }

  if (bikeParkingRequired && !lifts.hasBikeLift) {
    issues.push("第5條/第6條：須設置可同時搭載人員及自行車之電梯 1 部");
  }

  if (lifts.hasBikeLift && lifts.personsCapacity < 12) {
    issues.push("第17條：此類電梯承載人數不得少於 12 人");
  }

  return { ok: issues.length === 0, issues };
}

// 第 8 條第 4 款：基地硬鋪面應用透水性鋪面
function checkPermeablePaving(paving) {
  const issues = [];
  if (!paving) return { ok: true, issues: [] }; // 未提供則不檢查此項

  if (paving.hasHardPavingOnArtificialBase && !paving.usesPermeablePaving) {
    issues.push("第8條第4款：人工基盤硬舖面須使用透水性鋪面");
  }
  return { ok: issues.length === 0, issues };
}

// 第 9 條：既有建築室內裝修不得使用高耗能燈具
function checkLightingForType5(lighting, isType5) {
  const issues = [];
  if (!isType5) return { ok: true, issues: [] };
  if (!lighting) {
    issues.push("缺少 lighting 資料");
    return { ok: false, issues };
  }
  if (lighting.usesHighPowerLuminaires) {
    issues.push("第9條：室內裝修不得使用高耗能燈具");
  }
  return { ok: issues.length === 0, issues };
}

// 主程式：整體檢核
export function checkGreenBuildingCompliance(building) {
  const type = classifyBuildingType(building);

  const results = {
    buildingType: type,
    checks: {},
    isCompliant: true,
  };

  // 通用條件（依類別再決定是否必要）
  const solar = checkSolarRequirement(type, building.roof);
  const roofIns = checkRoofInsulation(building.roof);
  const waste = checkWasteFacilities(building.waste);
  const water = checkWaterSaving(building.waterSaving);
  const materials =
    type === 2 ? checkGreenMaterialRate(building.materials) : { ok: true, issues: [] };
  const bikeParking = checkBikeParking(building.bikeParking, building.isPublicOwned);
  const bikeLift = checkBikeLift(
    building.lifts,
    type === 1 || type === 2 || type === 4
  );
  const paving = checkPermeablePaving(building.paving);
  const lighting = checkLightingForType5(building.lighting, type === 5);

  results.checks.solar = solar;
  results.checks.roofInsulation = roofIns;
  results.checks.waste = waste;
  results.checks.waterSaving = water;
  results.checks.materials = materials;
  results.checks.bikeParking = bikeParking;
  results.checks.bikeLift = bikeLift;
  results.checks.permeablePaving = paving;
  results.checks.lighting = lighting;

  // 依建築類別再檢查「應設或可二擇一」的屋頂方案：
  // 例如：第1、2、4類：屋頂需「隔熱層 +（太陽光電 or 屋頂綠化）」
  const extraIssues = [];

  if (type === 1 || type === 2 || type === 4) {
    const r = building.roof || {};
    const hasPVorGreen = (r.pvCapacityKWp || 0) > 0 || (r.roofGreenProjectionArea || 0) > 0;
    if (!r.hasInsulationLayer || !hasPVorGreen) {
      extraIssues.push(
        "第5條/第6條/第8條：第1、2、4類建築屋頂須具備隔熱層，且需設太陽光電或屋頂綠化之一"
      );
    }
  }

  if (type === 3) {
    const r = building.roof || {};
    const hasPVorGreen =
      (r.pvCapacityKWp || 0) > 0 || (r.roofGreenProjectionArea || 0) > 0;
    if (!hasPVorGreen) {
      extraIssues.push("第7條：第3類建築物屋頂須設太陽光電或屋頂綠化");
    }
  }

  if (extraIssues.length > 0) {
    results.checks.roofCombo = { ok: false, issues: extraIssues };
  } else {
    results.checks.roofCombo = { ok: true, issues: [] };
  }

  // 彙總是否全部通過
  for (const key of Object.keys(results.checks)) {
    if (!results.checks[key].ok) {
      results.isCompliant = false;
      break;
    }
  }

  return results;
}

export const defaultBuildingData = {
  // === 基本資料 ===
  isNew: true,                          // 是否新建
  isPublicOwned: true,                  // 公有建築
  hasUsagePermit: false,                // 是否已領使用執照
  constructionCostNTD: 50000000,        // 工程造價
  budgetApprovedBeforeOrdinance: false, // 條例施行前預算已審議通過？

  floorsAboveGround: 10,                // 樓高（層數）
  isFactory: false,                     // 是否工廠類建築
  buildingArea: 1500,                   // 單層建築面積（m²）
  siteBuildingArea: 300,                // 基地建築面積（m²）
  isPublicUse: true,                    // 是否供公眾使用

  usesMultiPurposePublicFacilityReg: false,  // 是否依「多目標使用辦法」申請
  usesComprehensiveDesignCh15: false,       // 是否依第 15 章綜合設計申請

  // === 屋頂相關 ===
  roof: {
    hasInsulationLayer: true,          // 是否有隔熱層（第 5,6,8,12）
    avgUValue: 0.65,                   // 屋頂平均熱傳透率（W/m²·°C）（第 12）
    maxBuildingArea: 1000,             // 新建最大建築面積（m²）
    pvCapacityKWp: 5,                  // 太陽光電設置容量（kWp）
    pvProjectionArea: 600,             // 太陽光電投影面積（m²）
    roofGreenProjectionArea: 0,        // 屋頂綠化投影面積（m²）
    nonBuildableArea: 100,             // 屋頂不可設置區域面積（m²）
  },

  // === 垃圾設施（第 5,6,13） ===
  waste: {
    hasFacility: true,                 // 是否設置垃圾處理設施
    hasStorageSpace: true,             // 是否設置垃圾存放空間
    hasFoodWasteFacility: true,        // 廚餘收集再利用
    hasRecyclingFacility: true,        // 資源垃圾分類回收
    totalFloorArea: 10000,             // 容積總樓地板面積（m²）
    storageVolumeM3: 50,               // 垃圾存放空間可容納之體積（m³）
    isHighRise16Plus: false,           // 樓高是否 ≥ 16 層
    isStorageIndoorIfHighRise: true,   // 若 ≥16 層，垃圾存放是否在室內
  },

  // === 省水設備（第 5,6,7,8,14） ===
  waterSaving: {
    allToiletsWaterSavingCertified: true, // 省水標章便器
    publicWashIsSensorOrFoot: true,      // 公用洗手設備為感應或踩踏
  },

  // === 綠建材（第 6, 15） ===
  materials: {
    greenMaterialArea: 900,           // 綠建材面積（m²）
    totalAreaForCalc: 1800,           // 總檢討面積（m²），窗不使用綠建材可不列入
  },

  // === 自行車停車（第 5,8,16） ===
  bikeParking: {
    hasBikeParking: true,
    stallWidthCm: 70,
    stallLengthCm: 190,
    legalCarParkingCount: 100,        // 法定汽機車停車位數量
    bikeParkingStallsCount: 60,       // 實際規劃自行車位數
  },

  // === 電梯（第 5,6,17） ===
  lifts: {
    requiredByCode: true,             // 建築技術規則是否要求設置電梯
    hasBikeLift: true,                // 是否設置可載人＋自行車電梯
    personsCapacity: 12,              // 電梯額定人數
    bikeParkingOnGroundFloor: false,  // 自行車位在地面層 → 可不需載車功能
  },

  // === 舊有建築室內裝修（第 9） ===
  lighting: {
    usesHighPowerLuminaires: false,   // 是否使用高耗能燈具（第 5 類建築裝修時）
  },

  // === 基地鋪面（第 8） ===
  paving: {
    hasHardPavingOnArtificialBase: true,  // 是否有人工基盤硬舖面
    usesPermeablePaving: true,            // 是否使用透水鋪面
  },

  // === 時間（第 20,21 折減用，可選） ===
  applicationYear: 105, // 民國年，用於第 21 條基金折減，非必要欄位
};
