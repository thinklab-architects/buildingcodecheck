// 屏東縣都市計畫區法定騎樓設置標準 檢核程式（示意版）
// -------------------------------------------------
// 第二階段：building 資料結構（含預設值）
// 第三階段：classifyBuildingType / checkArcadeStandard / checkCompliance 等函式
// -------------------------------------------------

// 1. 建築物資料結構範本（可複製後依案件實際情況填寫）
export const defaultBuildingData = {
    // ====== 基本資訊 ======
    name: "", // 建案名稱
    locationCounty: "屏東縣", // 縣市名稱（預設為屏東縣）
    locationDistrict: "", // 行政區
    urbanPlanAreaName: "", // 都市計畫區名稱
    isInUrbanPlanArea: true, // 是否位於都市計畫區

    // 建築使用與分類
    mainUseCode: "H2", // 建築技術規則使用類別，預設 H-2 集合住宅
    mainUseName: "集合住宅", // 使用類別中文說明
    isPublicUse: true, // 是否供公眾使用（預設是）
    isPublicOwned: false, // 是否公有建築（預設否）
    isFactory: false, // 是否工廠類建築（預設否）

    // 工程別（至少應勾選一項；若皆為 false，視為資料不足）
    isNew: true, // 是否新建工程（預設是）
    isExtension: false, // 是否增建工程
    isAlteration: false, // 是否改建工程
    isRepair: false, // 是否修建工程

    // 建築規模（本程式僅用於預設建築物類別判斷，可依需要補充）
    floors: 0, // 地上層數
    basementFloors: 0, // 地下層數
    siteArea: 0, // 基地面積（m²）
    buildingCoverageArea: 0, // 建築面積（m²）

    // 都市計畫及退縮規定
    landUseZone: "", // 土地使用分區：商業區／住宅區／文教區／學校用地…（必填）
    hasSpecificSetbackControl: false, // 都市計畫書土地使用分區管制要點是否另有退縮規定（有則本標準不適用）
    specificSetbackNote: "", // 退縮規定名稱或圖號備註

    // ====== 道路與臨接關係 ======
    frontRoadName: "", // 正面臨道路名稱
    frontRoadWidth: 0, // 正面計畫道路寬度（m）
    frontRoadIsPlannedRoad: true, // 是否為計畫道路（預設是）

    hasSideRoad: false, // 是否有側面臨道路
    sideRoadName: "", // 側面臨道路名稱
    sideRoadWidth: 0, // 側面計畫道路寬度（m）
    sideRoadIsPlannedRoad: false, // 側面是否為計畫道路

    // ====== 騎樓適用性與方案 ======
    applyArcadeStandardManually: null, // 若為 true/false 可強制指定是否套用本標準；null 則由程式自動判斷
    providesArcade: false, // 是否設置騎樓
    providesCanopyCorridor: false, // 是否設置庇廊
    providesOpenSidewalkInstead: false, // 是否以「無遮簷人行道」退後建築替代騎樓/庇廊
    openSidewalkWidth: 0, // 無遮簷人行道寬度（m）
    hasGovApprovalForOpenSidewalk: false, // 是否已取得屏東縣政府核准以無遮簷人行道替代

    // ====== 騎樓幾何尺寸 ======
    frontArcadeWidth: 0, // 正面騎樓寬度（m，自建築線起算）
    sideArcadeWidth: 0, // 側面騎樓寬度（m，若無側騎樓可為 0）
    arcadeWidthSpecialApproved: false, // 騎樓寬度是否已有主管機關特例認定

    arcadeColumnOffsetFromBuildingLine: 0, // 騎樓柱正面距建築線（溝邊石外緣）之距離（m）

    // ====== 騎樓地坪與人行道關係 ======
    hasExistingSidewalkAlongRoad: true, // 道路是否已設人行道
    arcadeFloorHeightDiffToSidewalk: 0, // 騎樓地面與人行道高差（m；有 人行道時適用）
    arcadeFloorHeightAboveRoadEdge: 0.15, // 無人行道時，騎樓地面高於道路邊界高程（m）

    arcadeFloorMaterial: "", // 騎樓地面材料：石／磚／混凝土／磁磚／瀝青／其他
    arcadeFloorIsEven: true, // 騎樓地坪是否舖裝平實
    arcadeHasStepsOrObstacles: false, // 騎樓範圍內是否設置台階或其他阻礙物

    arcadeDrainSlope: 1 / 40, // 向道路境界線之瀉水坡度（高差/水平長度），標準為 1/40 ≒ 0.025
    complyUrbanRoadActArt9: true, // 是否已依《市區道路條例》第九條辦理（人工勾選）

    // ====== 轉角截角 ======
    cornerChamferLength: 0, // 轉角截角長度（m）
    cornerChamferCheckByOtherRule: true, // 截角是否另依《屏東縣建築管理自治條例》第22條檢討（預設 true）

    // ====== 綠建築／其他檢討預留欄位（本次不真正檢核，僅保留架構） ======
    roofArea: 0, // 屋頂面積（m²）
    pvCapacityKWp: 0, // 太陽光電裝置容量（kWp）
    hasRoofGreening: false, // 是否有屋頂綠化
    bikeParkingCount: 0, // 腳踏車停車位數量
    carParkingCount: 0, // 汽車停車位數量
    dailyWaterConsumption: 0, // 每日用水量估計（m³）
    greenMaterialRatio: 0, // 綠建材比例（0–1）
    roofInsulationUValue: 0, // 屋頂熱傳導係數 U 值（W/m²K）
    averageIndoorIlluminance: 0 // 室內平均照度（lux）
};

// ====== 共用小工具 ======

// 合併預設值與外部輸入，不改動 defaultBuilding 本體
function withDefaultBuilding(input) {
    return Object.assign({}, defaultBuildingData, input || {});
}

// 統一建立檢核結果物件
function createCheckResult() {
    return {
        ok: true, // 是否符合
        notRequired: false, // 是否不須檢討（true 時，ok 之值僅供參考）
        details: {}, // 各項計算與中間判斷結果
        issues: [] // 不符合或需提醒事項（字串陣列）
    };
}

// ====== 建築物類別判定 ======

export function classifyBuildingType(building) {
    // 依使用情境預設：供公眾使用之 H-2 集合住宅新建建築物，且基地建築面積通常 ≥ 200 m²
    // → 視為第 4 類建築物（屏東縣綠建築自治條例背景）
    const type = "第4類建築物（預設：供公眾使用之 H-2 集合住宅新建建築物）";

    return {
        type,
        basis:
            "未提供其他分類條件時，依使用者預設，直接視為第4類建築物；若實際案件有不同類別，應另行覆寫判定邏輯。"
    };
}

// ====== 核心：法定騎樓設置標準檢核 ======

export function checkArcadeStandard(buildingInput) {
    const building = withDefaultBuilding(buildingInput);
    const result = createCheckResult();

    const details = (result.details = {});
    const issues = result.issues;

    const WIDTH_STANDARD = 3.9; // 騎樓標準寬度（m）
    const COLUMN_OFFSET_STANDARD = 0.3; // 柱正面距建築線距離（m）
    const DRAIN_SLOPE_MIN = 1 / 40; // 最小瀉水坡度
    const FLOOR_HEIGHT_ROAD_EDGE = 0.15; // 無人行道時，地坪高於道路邊界 0.15m

    // --- 0. 適用性判斷（第1條、第2條前段） ---

    // (0-1) 縣市與都市計畫區
    if (building.locationCounty && building.locationCounty !== "屏東縣") {
        result.notRequired = true;
        result.ok = true;
        issues.push(
            "本標準僅適用屏東縣都市計畫區，本案所在地縣市非「屏東縣」，故不須依本標準檢討。"
        );
        details.scope = "縣市不適用";
        return result;
    }

    if (!building.isInUrbanPlanArea) {
        result.notRequired = true;
        result.ok = true;
        issues.push(
            "本標準僅適用都市計畫區，本案基地非屬都市計畫區範圍，故不須依本標準檢討。"
        );
        details.scope = "非都市計畫區";
        return result;
    }

    // (0-2) 都市計畫書土地使用分區管制要點是否另訂退縮規定（第1條第2項）
    if (building.hasSpecificSetbackControl) {
        result.notRequired = true;
        result.ok = true;
        issues.push(
            "依第1條第2項規定：都市計畫書土地使用分區管制要點（計畫）已訂有退縮規定者，從其規定，本標準不適用；本案已勾選有退縮規定，故不須依本標準檢討。"
        );
        details.scope = "另有退縮規定，本標準不適用";
        details.specificSetbackNote = building.specificSetbackNote || "";
        return result;
    }

    // (0-3) 基礎資料檢查
    const missingFields = [];
    if (!building.landUseZone) {
        missingFields.push("landUseZone（土地使用分區）");
    }
    if (!building.frontRoadWidth || building.frontRoadWidth <= 0) {
        missingFields.push("frontRoadWidth（正面計畫道路寬度）");
    }
    const workFlags = [
        building.isNew,
        building.isExtension,
        building.isAlteration,
        building.isRepair
    ];
    if (!workFlags.some(Boolean)) {
        missingFields.push("工程別（isNew / isExtension / isAlteration / isRepair 至少需一項為 true）");
    }

    if (missingFields.length > 0) {
        result.notRequired = true;
        result.ok = false;
        issues.push("資料不足，需人工補充後方可檢核：" + missingFields.join("、"));
        details.scope = "資料不足，無法判斷是否適用本標準";
        return result;
    }

    // (0-4) 工程別是否屬新建、增建、改建或修建（第2條前言）
    const isTargetWork =
        building.isNew || building.isExtension || building.isAlteration || building.isRepair;

    if (!isTargetWork) {
        result.notRequired = true;
        result.ok = true;
        issues.push(
            "第2條前言僅適用於新建、增建、改建、修建之建築物，本案工程別並非上述類型，故不須依本標準檢討。"
        );
        details.scope = "工程別不在本標準適用範圍";
        return result;
    }

    // --- 1. 是否屬應設置法定騎樓之基地（第2條第1款） ---

    const zone = building.landUseZone;
    const inCommercialLikeZone = ["商業區", "文教區", "學校用地"].includes(zone);
    const inResidentialZone = zone === "住宅區";

    const frontQualifies =
        building.frontRoadIsPlannedRoad &&
        ((inCommercialLikeZone && building.frontRoadWidth >= 7) ||
            (inResidentialZone && building.frontRoadWidth >= 10));

    const sideQualifies =
        building.hasSideRoad &&
        building.sideRoadIsPlannedRoad &&
        ((inCommercialLikeZone && building.sideRoadWidth >= 7) ||
            (inResidentialZone && building.sideRoadWidth >= 10));

    const requiresFrontArcade = frontQualifies;
    const requiresSideArcade = sideQualifies;

    details.zone = zone;
    details.frontRoadWidth = building.frontRoadWidth;
    details.sideRoadWidth = building.sideRoadWidth;
    details.requiresFrontArcade = requiresFrontArcade;
    details.requiresSideArcade = requiresSideArcade;

    const manualApply = building.applyArcadeStandardManually;
    const standardApplicable =
        manualApply === true || (manualApply === null && (requiresFrontArcade || requiresSideArcade));

    if (!standardApplicable) {
        // 不屬於需設置法定騎樓之基地，且未強制要求檢討
        result.notRequired = true;
        result.ok = true;
        issues.push(
            "依第2條第1款判斷，本案土地使用分區及臨路寬度條件不屬於必須設置法定騎樓或庇廊之基地，且未指定強制套用本標準，故本案騎樓設置不屬義務性檢討項目。"
        );
        details.scope = "非必設騎樓基地";
        return result;
    }

    // --- 2. 檢討「騎樓／庇廊」或「無遮簷人行道」方案選擇 ---

    if (building.providesOpenSidewalkInstead) {
        // 以無遮簷人行道替代
        details.scheme = "無遮簷人行道退後建築方案";

        if (!building.hasGovApprovalForOpenSidewalk) {
            result.ok = false;
            issues.push(
                "不符合第2條第1款但書：以無遮簷人行道替代騎樓時，應經屏東縣政府認可；本案尚未勾選已取得核准。"
            );
        }

        // 寬度檢核：原文「讓出其寬度」，本程式以 3.9 m 為標準寬度處理
        if (building.openSidewalkWidth <= 0 && !building.arcadeWidthSpecialApproved) {
            result.ok = false;
            issues.push(
                "不符合第2條第1款：未提供無遮簷人行道寬度資料，亦未勾選寬度特例認定，請補充設計值。"
            );
        } else if (
            building.openSidewalkWidth > 0 &&
            Math.abs(building.openSidewalkWidth - WIDTH_STANDARD) > 0.01 &&
            !building.arcadeWidthSpecialApproved
        ) {
            result.ok = false;
            issues.push(
                "不符合第2條第1款及第2款：以無遮簷人行道替代騎樓時，其寬度應相當於法定騎樓寬度 3.9 m；本案無遮簷人行道寬度為 " +
                building.openSidewalkWidth +
                " m，且未勾選主管機關特例認定。"
            );
        }

        // 地坪材料與瀉水坡度仍需符合第2條第4、5款
    } else {
        // 一般情形：應設置騎樓或庇廊
        details.scheme = "騎樓／庇廊方案";

        if (!building.providesArcade && !building.providesCanopyCorridor) {
            result.ok = false;
            issues.push(
                "不符合第2條第1款：本案屬應設置法定騎樓之基地，惟未勾選設置騎樓或庇廊，亦未勾選以無遮簷人行道替代。"
            );
        }
    }

    // --- 3. 騎樓寬度檢核（第2條第2款） ---

    if (!building.providesOpenSidewalkInstead) {
        // 僅在採騎樓／庇廊方案時，檢核騎樓寬度
        if (requiresFrontArcade) {
            if (building.frontArcadeWidth <= 0 && !building.arcadeWidthSpecialApproved) {
                result.ok = false;
                issues.push(
                    "不符合第2條第2款：未提供正面騎樓寬度，且未勾選寬度由主管機關特例認定。"
                );
            } else if (
                building.frontArcadeWidth > 0 &&
                Math.abs(building.frontArcadeWidth - WIDTH_STANDARD) > 0.01 &&
                !building.arcadeWidthSpecialApproved
            ) {
                result.ok = false;
                issues.push(
                    "不符合第2條第2款：正面騎樓寬度應自建築線起一律為 3.9 m；本案正面騎樓寬度為 " +
                    building.frontArcadeWidth +
                    " m，且未勾選主管機關逕行認定特例。"
                );
            }
        }

        if (requiresSideArcade) {
            if (building.sideArcadeWidth <= 0 && !building.arcadeWidthSpecialApproved) {
                result.ok = false;
                issues.push(
                    "不符合第2條第2款：側面亦屬應設置騎樓之基地，惟未提供側面騎樓寬度，且未勾選寬度特例認定。"
                );
            } else if (
                building.sideArcadeWidth > 0 &&
                Math.abs(building.sideArcadeWidth - WIDTH_STANDARD) > 0.01 &&
                !building.arcadeWidthSpecialApproved
            ) {
                result.ok = false;
                issues.push(
                    "不符合第2條第2款：側面騎樓寬度應自建築線起一律為 3.9 m；本案側面騎樓寬度為 " +
                    building.sideArcadeWidth +
                    " m，且未勾選主管機關逕行認定特例。"
                );
            }
        }
    }

    details.WIDTH_STANDARD = WIDTH_STANDARD;

    // --- 4. 騎樓柱位置檢核（第2條第3款） ---

    if (
        !building.providesOpenSidewalkInstead &&
        (building.providesArcade || building.providesCanopyCorridor)
    ) {
        if (building.arcadeColumnOffsetFromBuildingLine <= 0) {
            result.ok = false;
            issues.push(
                "不符合第2條第3款：未提供騎樓柱正面距建築線（溝邊石外緣）之距離資料。"
            );
        } else if (
            Math.abs(building.arcadeColumnOffsetFromBuildingLine - COLUMN_OFFSET_STANDARD) > 0.01
        ) {
            result.ok = false;
            issues.push(
                "不符合第2條第3款：騎樓柱正面應位於距建築線（溝邊石外緣）30 cm 處；本案實際距離為 " +
                building.arcadeColumnOffsetFromBuildingLine +
                " m。"
            );
        }
    }

    details.COLUMN_OFFSET_STANDARD = COLUMN_OFFSET_STANDARD;

    // --- 5. 騎樓地坪材料及高程、瀉水坡度檢核（第2條第4、5款） ---

    // 不論為騎樓或無遮簷人行道方案，地坪構造皆應適用第2條第4、5款
    const allowedMaterials = ["石", "磚", "混凝土", "磁磚", "瀝青"];

    if (!building.arcadeFloorMaterial) {
        result.ok = false;
        issues.push("不符合第2條第4款：未註明騎樓（或無遮簷人行道）地面材料。");
    } else if (!allowedMaterials.includes(building.arcadeFloorMaterial)) {
        result.ok = false;
        issues.push(
            "不符合第2條第4款：騎樓地面材料應為石、磚、混凝土、磁磚或瀝青等；本案填寫為「" +
            building.arcadeFloorMaterial +
            "」，請確認是否符合法規或另行取得認定。"
        );
    }

    if (!building.arcadeFloorIsEven) {
        result.ok = false;
        issues.push("不符合第2條第4款：騎樓地面舖裝應平實，請檢討地坪高低起伏。");
    }

    if (building.arcadeHasStepsOrObstacles) {
        result.ok = false;
        issues.push("不符合第2條第5款：騎樓地面不得設置任何台階或阻礙物。");
    }

    if (building.hasExistingSidewalkAlongRoad) {
        // 有人行道：騎樓地面應與人行道齊平
        if (Math.abs(building.arcadeFloorHeightDiffToSidewalk) > 0.01) {
            result.ok = false;
            issues.push(
                "不符合第2條第5款：有設人行道時，騎樓地面應與人行道齊平；本案高差為 " +
                building.arcadeFloorHeightDiffToSidewalk +
                " m。"
            );
        }
    } else {
        // 無人行道：騎樓地面應高於道路邊界處 15 cm
        if (Math.abs(building.arcadeFloorHeightAboveRoadEdge - FLOOR_HEIGHT_ROAD_EDGE) > 0.01) {
            result.ok = false;
            issues.push(
                "不符合第2條第5款：無人行道時，騎樓地面應高於道路邊界處 0.15 m；本案高差為 " +
                building.arcadeFloorHeightAboveRoadEdge +
                " m。"
            );
        }
    }

    if (building.arcadeDrainSlope < DRAIN_SLOPE_MIN) {
        result.ok = false;
        issues.push(
            "不符合第2條第5款：騎樓地面應向道路境界線作成 1/40 之瀉水坡度；本案設計瀉水坡度為 " +
            building.arcadeDrainSlope +
            "，小於 1/40 ≒ 0.025。"
        );
    }

    if (!building.complyUrbanRoadActArt9) {
        result.ok = false;
        issues.push("不符合第2條第5款：尚未確認已依《市區道路條例》第九條辦理相關事項。");
    }

    details.allowedFloorMaterials = allowedMaterials;
    details.DRAIN_SLOPE_MIN = DRAIN_SLOPE_MIN;
    details.FLOOR_HEIGHT_ROAD_EDGE = FLOOR_HEIGHT_ROAD_EDGE;

    // --- 6. 轉角截角要求（第2條第6款） ---

    if (requiresFrontArcade && requiresSideArcade) {
        details.cornerRequiresChamfer = true;

        if (building.cornerChamferCheckByOtherRule) {
            issues.push(
                "提醒：基地正面及側面均屬應設置騎樓者，其轉角截角長度應依《屏東縣建築管理自治條例》第22條規定設置；本程式僅提醒，未自動檢核具體長度，請另案依第22條檢討。"
            );
        } else if (building.cornerChamferLength <= 0) {
            issues.push(
                "提醒：已勾選需由本程式檢討轉角截角，惟未提供 cornerChamferLength（截角長度），請補充後再行檢核。"
            );
        }
    } else {
        details.cornerRequiresChamfer = false;
    }

    // --- 結論回傳 ---
    return result;
}

// ====== 其他檢核項目骨架（本案未提供相關條文，全部標示為不須檢討） ======

function createNotRequiredResult(reason) {
    const r = createCheckResult();
    r.ok = true;
    r.notRequired = true;
    r.issues.push(reason);
    return r;
}

function checkSolarRequirement(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及太陽光電設置規定，故本項目不須檢討。"
    );
}

function checkRoofGreening(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及屋頂綠化規定，故本項目不須檢討。"
    );
}

function checkBikeParking(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及自行車停車設施規定，故本項目不須檢討。"
    );
}

function checkWasteFacilities(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及廢棄物處理空間規定，故本項目不須檢討。"
    );
}

function checkWaterSaving(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及節約用水設施規定，故本項目不須檢討。"
    );
}

function checkGreenMaterialRate(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及綠建材使用比例規定，故本項目不須檢討。"
    );
}

function checkRoofInsulation(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及屋頂隔熱性能規定，故本項目不須檢討。"
    );
}

function checkLighting(buildingInput) {
    return createNotRequiredResult(
        "本次僅依《屏東縣都市計畫區法定騎樓設置標準》檢討騎樓構造，未涉及照明設計或節能照明規定，故本項目不須檢討。"
    );
}

// ====== 主函式：整體檢核入口 ======

export function checkCompliance(buildingInput) {
    const building = withDefaultBuilding(buildingInput);
    const buildingType = classifyBuildingType(building);

    const arcade = checkArcadeStandard(building);
    const solar = checkSolarRequirement(building);
    const roofGreening = checkRoofGreening(building);
    const bikeParking = checkBikeParking(building);
    const waste = checkWasteFacilities(building);
    const water = checkWaterSaving(building);
    const greenMaterial = checkGreenMaterialRate(building);
    const roofInsulation = checkRoofInsulation(building);
    const lighting = checkLighting(building);

    const checks = {
        arcadeStandard: arcade,
        solarRequirement: solar,
        roofGreening,
        bikeParking,
        wasteFacilities: waste,
        waterSaving: water,
        greenMaterialRate: greenMaterial,
        roofInsulation,
        lighting
    };

    const isCompliant = Object.values(checks).every(function (c) {
        return c.notRequired || c.ok;
    });

    return {
        building,
        buildingType,
        checks,
        isCompliant
    };
}

// ====== 報告文字生成（可直接貼入建照圖說） ======

export function generateArcadeReport(checkResult) {
    const b = checkResult.building;
    const arcade = checkResult.checks.arcadeStandard;
    const buildingTypeInfo = checkResult.buildingType || {};

    const statusText = arcade.notRequired
        ? "不須檢討"
        : arcade.ok
            ? "符合"
            : "不符合";

    let issuesText = "";
    if (arcade.issues.length === 0) {
        issuesText = "- 無不符合事項。\n";
    } else {
        issuesText =
            arcade.issues
                .map(function (s, idx) {
                    return (idx + 1) + "、" + s;
                })
                .join("\n") + "\n";
    }

    const lines = [];

    // 第一章：法規依據
    lines.push("一、法規依據");
    lines.push("  1. 《屏東縣都市計畫區法定騎樓設置標準》（105年2月22日修正）。");
    lines.push("  2. 《屏東縣建築管理自治條例》第二十一條、第二十二條。");
    lines.push("  3. 《市區道路條例》第九條。");
    lines.push("");

    // 第二章：案件基本資料（僅列示部分欄位，可依需要增減）
    lines.push("二、案件基本資料");
    lines.push("  1. 建案名稱：" + (b.name || "（未填寫）"));
    lines.push("  2. 建築使用類別：建築技術規則 H-2 集合住宅（預設）");
    lines.push("  3. 建築物類別：" + (buildingTypeInfo.type || "（未分類）"));
    lines.push("  4. 所在縣市：" + (b.locationCounty || "（未填寫）"));
    lines.push("  5. 都市計畫區名稱：" + (b.urbanPlanAreaName || "（未填寫）"));
    lines.push("  6. 土地使用分區：" + (b.landUseZone || "（未填寫）"));
    lines.push(
        "  7. 臨接道路及寬度：正面「" +
        (b.frontRoadName || "（未填寫）") +
        "」計畫道路寬度 " +
        (b.frontRoadWidth || "（未填）") +
        " m；側面臨路寬度 " +
        (b.sideRoadWidth || 0) +
        " m。"
    );
    lines.push("");

    // 第三章：條文逐項檢討結果（僅針對騎樓標準）
    lines.push("三、條文逐項檢討結果");
    lines.push("【第2條 法定騎樓構造及各部尺寸】");
    lines.push("結論：" + statusText);
    lines.push("理由／說明：");
    lines.push(issuesText.trim().length > 0 ? issuesText : "- 無不符合事項。");
    lines.push("");

    // 第四章：必備計算式及判斷基準（摘要說明）
    lines.push("四、必備計算式及判斷基準");
    lines.push("  1. 適用基地判斷：");
    lines.push(
        "     (1) 土地使用分區為商業區／文教區／學校用地，且臨計畫道路寬度 ≥ 7 m；或"
    );
    lines.push("     (2) 土地使用分區為住宅區，且臨計畫道路寬度 ≥ 10 m。");
    lines.push("  2. 騎樓寬度：");
    lines.push("     騎樓寬度（自建築線起算） = 3.9 m（如有主管機關特例，得依核准值辦理）。");
    lines.push("  3. 騎樓柱位置：");
    lines.push("     柱正面距建築線（溝邊石外緣） = 0.30 m。");
    lines.push("  4. 騎樓地坪與道路／人行道關係：");
    lines.push("     (1) 有人行道：騎樓地面標高 = 人行道標高。");
    lines.push("     (2) 無人行道：騎樓地面標高 = 道路邊界高程 + 0.15 m。");
    lines.push("     (3) 瀉水坡度：向道路境界線之坡度 ≥ 1 / 40。");
    lines.push("");

    // 第五章：最終結論
    lines.push("五、最終結論");
    lines.push(
        "  本案依《屏東縣都市計畫區法定騎樓設置標準》檢討結果：「" + statusText + "」。"
    );
    if (!arcade.ok && !arcade.notRequired) {
        lines.push("  需改善事項請依前述條文逐項檢討結果辦理設計修正。");
    } else if (arcade.notRequired) {
        lines.push("  本案基地條件不屬義務設置法定騎樓範圍或另有退縮規定，故本標準不須檢討。");
    } else {
        lines.push("  騎樓構造及各部尺寸符合相關法定要求，得作為建照審查提示說明。");
    }

    return lines.join("\n");
}
