// 屏東縣畸零地使用規則檢核程式（第2～10條為主）
// 注意：部分條文需人工判斷，於註解標註「此處需人工判斷」。

// ===== 1. 資料結構範例 =====
export const defaultSite = {
    // 幾何與分區基本資訊
    frontRoadWidthM: 6.0,                 // 正面路寬（m）
    minWidthM: 3.2,                       // 依第4條定義計算之最小寬度
    minDepthM: 11.5,                      // 依第4條定義計算之最小深度
    siteAreaM2: 40.0,                     // 基地面積（m²）

    useZone: 'A_OR_RESIDENTIAL',          // 'A_OR_RESIDENTIAL' | 'COMMERCIAL' | 'B_SCENIC_D_INDUSTRIAL' | 'OTHER'
    isSideArcadeRequired: false,          // 是否屬側面應留設騎樓基地
    hasSideYardRequirement: false,        // 是否必須留設側院
    sideYardWidthM: 0,                    // 側院寬度（如有）

    // 第6條調整用
    applyArt6Adjustment: true,            // 是否考慮加寬換減深
    hasMandatorySetbacks: true,           // 是否需前後院、法定騎樓、綠帶退縮或都市計畫退縮

    // 第7條 — 地界曲折
    isBoundaryShapeAbnormalAndUnbuildable: false, // 需人工判斷
    hasExtremeAngleBetweenBoundaryAndBuildingLine: false, // 是否有 <60° 或 >120° 斜交
    canFitRegularParallelogram: true,     // 需人工判斷，若可放入符合最小寬深之平行四邊形則非畸零地

    // 第8條 — 例外條件檢核
    adjacentLandUseType: 'OTHER',         // 'ROAD' | 'DITCH' | 'MILITARY' | 'PUBLIC_FACILITY' | 'OTHER'
    adjacentLandAlreadyBuilt: false,      // 臨接土地是否已建築完成（輔助說明）
    adjacentLandHasBuildingPermitAndSlabChecked: false,
    adjacentLandIsLegalHouse: false,
    depthAfterArcadeOrSetbackM: 11.5,     // 扣除騎樓或退縮後之深度
    widthAfterArcadeOrSetbackM: 3.2,      // 扣除騎樓或退縮後之寬度
    hasTerrainObstacleForMerge: false,    // 是否因地形障礙無法合併使用

    // 第9條 — 舊小基地（甲乙建築用地、住宅區、商業區）
    isInRegionalPlanNonUrbanBeforeZoning: false,
    isInUrbanPlanBefore1973_07_12: false,
    isSplitByPublicFacilityZoning: false,

    // 第10條 — 舊丁建、工業區
    isTypeDLand: false,
    isIndustrialZone: false,
    isSplitBefore1986_11_02: false
};

// ===== 共用工具 =====

// 將正面路寬換成類別，方便查表
function getFrontRoadWidthCategory(frontRoadWidthM) {
    if (frontRoadWidthM <= 7) return 'LE_7';
    if (frontRoadWidthM <= 15) return 'GT_7_TO_15';
    if (frontRoadWidthM <= 25) return 'GT_15_TO_25';
    return 'GT_25';
}

// 第3條：一般建築用地最小寬深表（非側面應留設騎樓基地）
// 資料來源：屏東縣畸零地使用規則第3條第1項第1款表列
const ART3_GENERAL_THRESHOLDS = {
    // 甲、乙種建築用地及住宅區
    A_OR_RESIDENTIAL: {
        LE_7: { minWidth: 3.0, minDepth: 12.0 },
        GT_7_TO_15: { minWidth: 3.5, minDepth: 14.0 },
        GT_15_TO_25: { minWidth: 4.0, minDepth: 16.0 },
        GT_25: { minWidth: 4.0, minDepth: 16.0 }
    },
    // 商業區
    COMMERCIAL: {
        LE_7: { minWidth: 3.5, minDepth: 11.0 },
        GT_7_TO_15: { minWidth: 4.0, minDepth: 13.0 },
        GT_15_TO_25: { minWidth: 4.5, minDepth: 15.0 },
        GT_25: { minWidth: 4.5, minDepth: 18.0 }
    },
    // 丙種建築用地及風景區、丁種建築用地及工業區（條文表格排版略混，以下為合理推定）
    // 此處如需完全精確，建議對照縣府原始 PDF 表格再行校正（此處需人工確認）。
    B_SCENIC_D_INDUSTRIAL: {
        LE_7: { minWidth: 6.0, minDepth: 20.0 },
        GT_7_TO_15: { minWidth: 6.0, minDepth: 20.0 },
        GT_15_TO_25: { minWidth: 6.0, minDepth: 20.0 },
        GT_25: { minWidth: 6.0, minDepth: 20.0 }
    },
    // 其他使用分區（不含農業區、保存區、保護區、公共設施用地及表列以外非都市土地）
    OTHER: {
        LE_7: { minWidth: 3.5, minDepth: 12.0 },
        GT_7_TO_15: { minWidth: 4.0, minDepth: 16.0 },
        GT_15_TO_25: { minWidth: 4.5, minDepth: 17.0 },
        GT_25: { minWidth: 4.5, minDepth: 18.0 }
    }
};

// 第3條：側面應留設騎樓之建築基地最小寬深表
const ART3_SIDE_ARCADE_THRESHOLDS = {
    // 住宅區
    RESIDENTIAL: {
        LE_7: { minWidth: 6.6, minDepth: 12.0 },
        GT_7_TO_15: { minWidth: 7.1, minDepth: 14.0 },
        GT_15_TO_25: { minWidth: 7.6, minDepth: 16.0 },
        GT_25: { minWidth: 7.6, minDepth: 16.0 }
    },
    // 商業區
    COMMERCIAL: {
        LE_7: { minWidth: 6.6, minDepth: 11.0 },
        GT_7_TO_15: { minWidth: 7.1, minDepth: 13.0 },
        GT_15_TO_25: { minWidth: 7.6, minDepth: 15.0 },
        GT_25: { minWidth: 7.6, minDepth: 18.0 }
    },
    // 工業區
    INDUSTRIAL: {
        LE_7: { minWidth: 8.0, minDepth: 16.0 },
        GT_7_TO_15: { minWidth: 8.0, minDepth: 16.0 },
        GT_15_TO_25: { minWidth: 8.0, minDepth: 16.0 },
        GT_25: { minWidth: 8.0, minDepth: 16.0 }
    },
    // 其他使用分區
    OTHER: {
        LE_7: { minWidth: 6.6, minDepth: 12.0 },
        GT_7_TO_15: { minWidth: 7.1, minDepth: 16.0 },
        GT_15_TO_25: { minWidth: 7.6, minDepth: 17.0 },
        GT_25: { minWidth: 7.6, minDepth: 18.0 }
    }
};

// 第9條：舊小基地寬深面積標準（甲、乙種建築用地、住宅區、商業區）
const ART9_THRESHOLDS = {
    LE_7: { minWidth: 3.0, minDepth: 5.0, minArea: 20.0 },
    GT_7_TO_15: { minWidth: 3.5, minDepth: 6.0, minArea: 30.0 },
    GT_15_TO_25: { minWidth: 3.5, minDepth: 6.0, minArea: 35.0 },
    GT_25: { minWidth: 4.0, minDepth: 7.0, minArea: 40.0 }
};

// 第10條：舊丁種建築用地及工業區最小寬深標準
const ART10_THRESHOLDS = {
    LE_7: { minWidth: 3.5, minDepth: 12.0 },
    GT_7_TO_15: { minWidth: 4.0, minDepth: 16.0 },
    GT_15_TO_25: { minWidth: 4.5, minDepth: 17.0 },
    GT_25: { minWidth: 4.5, minDepth: 18.0 }
};

// ===== 第3條、6條：面積狹小基地判定 =====

// 依第3條取得基準寬深
function getBaseMinWidthDepthByArt3(site) {
    const cat = getFrontRoadWidthCategory(site.frontRoadWidthM);

    if (!site.isSideArcadeRequired) {
        const table = ART3_GENERAL_THRESHOLDS[site.useZone];
        if (!table) {
            return null; // 未定義使用分區，需人工處理
        }
        return table[cat];
    }

    // 側面應留設騎樓之建築基地 — 需再依實際分區細分類
    let keyForSide;
    switch (site.useZone) {
        case 'A_OR_RESIDENTIAL':
            keyForSide = 'RESIDENTIAL'; break;
        case 'COMMERCIAL':
            keyForSide = 'COMMERCIAL'; break;
        case 'B_SCENIC_D_INDUSTRIAL':
            keyForSide = 'INDUSTRIAL'; break;
        default:
            keyForSide = 'OTHER';
    }

    const table = ART3_SIDE_ARCADE_THRESHOLDS[keyForSide];
    if (!table) return null;

    return table[cat];
}

// 依第6條，以增加寬度換減深度
function getAdjustedDepthByArt6(baseMinDepth, baseMinWidth, actualWidth, hasMandatorySetbacks) {
    // 每增加 10 公分 => 深度可減少 20 公分
    const extraWidth = Math.max(0, actualWidth - baseMinWidth);
    const steps = Math.floor(extraWidth / 0.10);
    const depthReduction = steps * 0.20;
    const rawDepth = baseMinDepth - depthReduction;

    const depthFloor = hasMandatorySetbacks ? 6.0 : 8.0;
    return Math.max(rawDepth, depthFloor);
}

// 第3條＋第6條綜合檢核：是否為「面積狹小基地」
function checkNarrowSiteByArt3And6(site) {
    const issues = [];
    const base = getBaseMinWidthDepthByArt3(site);

    if (!base) {
        return {
            ok: false,
            isNarrowSite: null,
            issues: ['第3條：使用分區或騎樓條件未定義，無法自動判斷面積狹小（需人工依原表格確認）。']
        };
    }

    const baseMinWidth = base.minWidth;
    const baseMinDepth = base.minDepth;

    let requiredDepth = baseMinDepth;
    if (site.applyArt6Adjustment) {
        requiredDepth = getAdjustedDepthByArt6(
            baseMinDepth,
            baseMinWidth,
            site.minWidthM,
            site.hasMandatorySetbacks
        );
    }

    let isNarrow = false;

    if (site.minWidthM < baseMinWidth) {
        isNarrow = true;
        issues.push(
            `第3條：基地最小寬度 ${site.minWidthM}m 小於規定 ${baseMinWidth}m，屬面積狹小基地。`
        );
    }

    if (site.minDepthM < requiredDepth) {
        isNarrow = true;
        issues.push(
            `第3條、第6條：基地最小深度 ${site.minDepthM}m 小於調整後要求 ${requiredDepth}m，屬面積狹小基地。`
        );
    }

    if (!isNarrow) {
        return {
            ok: true,
            isNarrowSite: false,
            issues: []
        };
    }

    return {
        ok: false,
        isNarrowSite: true,
        issues
    };
}

// ===== 第7條：地界曲折基地判定 =====

function checkTortuousBoundaryByArt7(site) {
    const issues = [];
    const isCandidate =
        site.isBoundaryShapeAbnormalAndUnbuildable ||
        site.hasExtremeAngleBetweenBoundaryAndBuildingLine;

    if (!isCandidate) {
        // 不符合第7條第1項任一款，非地界曲折基地
        return {
            ok: true,
            isTortuousBoundary: false,
            issues: []
        };
    }

    // 如可配置符合第3或第6條規定之平行四邊形，則非畸零地
    if (site.canFitRegularParallelogram) {
        issues.push('第7條第2項：雖有曲折或斜交，但可配置符合最小寬深之平行四邊形，非畸零地。');
        return {
            ok: true,
            isTortuousBoundary: false,
            issues
        };
    }

    issues.push('第7條：基地界線曲折或與建築線夾角小於60度或大於120度，且無法配置符合最小寬深之平行四邊形，屬地界曲折基地。');
    return {
        ok: false,
        isTortuousBoundary: true,
        issues
    };
}

// ===== 第8條：不得建築與例外 =====

function checkBuildabilityExceptionsByArt8(site, narrowResult, tortuousResult) {
    const issues = [];
    const isNarrow = !!narrowResult.isNarrowSite;
    const isTortuous = !!tortuousResult.isTortuousBoundary;

    if (!isNarrow && !isTortuous) {
        // 非畸零地，建築可行，第8條限制不適用
        return {
            ok: true,
            canBuild: true,
            issues: []
        };
    }

    // 原則：面積狹小或地界曲折基地均不得建築，除非符合下列任一款
    let hasException = false;

    // 第8條第1款：臨接地為道路、水溝、軍事設施或公共設施用地
    if (['ROAD', 'DITCH', 'MILITARY', 'PUBLIC_FACILITY'].includes(site.adjacentLandUseType)) {
        hasException = true;
        issues.push('第8條第1款：臨接地為道路、水溝、軍事設施或公共設施用地，可例外建築。');
    }

    // 先計算第3條的基準（寬深是否符合）
    const base = getBaseMinWidthDepthByArt3(site);

    // 第8條第2款：寬度符合第3條最小寬度，且深度部分臨接土地已建築，扣除騎樓或退縮後深度 ≥ 6m
    if (base && site.depthAfterArcadeOrSetbackM !== undefined) {
        const widthOK = site.minWidthM >= base.minWidth;
        const depthOK = site.depthAfterArcadeOrSetbackM >= 6.0;
        if (widthOK && depthOK && site.adjacentLandAlreadyBuilt) {
            hasException = true;
            issues.push('第8條第2款：寬度符合第3條最小寬度且鄰地已建築，扣除騎樓或退縮後深度 ≥ 6m，可例外建築。');
        }
    }

    // 第8條第3款：深度符合第3條最小深度，且寬度部分臨接土地已建築，扣除騎樓或退縮後寬度 ≥ 2m
    if (base && site.widthAfterArcadeOrSetbackM !== undefined) {
        const depthOK = site.minDepthM >= base.minDepth;
        const widthOK2 = site.widthAfterArcadeOrSetbackM >= 2.0;
        if (depthOK && widthOK2 && site.adjacentLandAlreadyBuilt) {
            hasException = true;
            issues.push('第8條第3款：深度符合第3條最小深度且鄰地已建築，扣除騎樓或退縮後寬度 ≥ 2m，可例外建築。');
        }
    }

    // 第8條第4款：臨接土地已領得建造執照並完成一樓頂版勘驗，或為合法房屋
    if (site.adjacentLandHasBuildingPermitAndSlabChecked || site.adjacentLandIsLegalHouse) {
        hasException = true;
        issues.push('第8條第4款：臨接土地已領建照並完成一樓頂板勘驗或為合法房屋，可例外建築。');
    }

    // 第8條第5款：因地形障礙無法合併使用
    if (site.hasTerrainObstacleForMerge) {
        hasException = true;
        issues.push('第8條第5款：因地形障礙無法合併使用，可例外建築。');
    }

    if (hasException) {
        return {
            ok: true,
            canBuild: true,
            issues
        };
    }

    // 未符合任何例外
    issues.push('第8條：屬面積狹小或地界曲折基地，且不符合第1～5款任一例外，不得建築。');
    return {
        ok: false,
        canBuild: false,
        issues
    };
}

// ===== 第9條：舊小基地例外 =====

function checkLegacySmallSiteByArt9(site) {
    const issues = [];

    // 僅適用：甲、乙種建築用地、住宅區、商業區
    const eligibleZone = ['A_OR_RESIDENTIAL', 'COMMERCIAL'].includes(site.useZone);
    if (!eligibleZone) {
        return {
            ok: false,
            applies: false,
            issues: ['第9條：限甲、乙種建築用地、住宅區、商業區，本基地使用分區不適用本條例外。']
        };
    }

    const conditionLocation =
        site.isInRegionalPlanNonUrbanBeforeZoning ||
        site.isInUrbanPlanBefore1973_07_12 ||
        site.isSplitByPublicFacilityZoning;

    if (!conditionLocation) {
        return {
            ok: false,
            applies: false,
            issues: ['第9條：需為特定日期前之已分割基地或因公共設施用地劃定分割，本基地不符合時間／來源條件。']
        };
    }

    const cat = getFrontRoadWidthCategory(site.frontRoadWidthM);
    const t = ART9_THRESHOLDS[cat];
    if (!t) {
        return {
            ok: false,
            applies: false,
            issues: ['第9條：正面路寬不在預設範圍內，需人工檢核。']
        };
    }

    const widthOK = site.minWidthM >= t.minWidth;
    const depthOK = site.minDepthM >= t.minDepth;
    const areaOK = site.siteAreaM2 >= t.minArea;

    if (widthOK && depthOK && areaOK) {
        issues.push(`第9條：屬舊小基地且寬度≥${t.minWidth}m、深度≥${t.minDepth}m、面積≥${t.minArea}m²，得准予建築。`);
        return {
            ok: true,
            applies: true,
            issues
        };
    }

    if (!widthOK) {
        issues.push(`第9條：基地最小寬度 ${site.minWidthM}m 小於規定 ${t.minWidth}m。`);
    }
    if (!depthOK) {
        issues.push(`第9條：基地最小深度 ${site.minDepthM}m 小於規定 ${t.minDepth}m。`);
    }
    if (!areaOK) {
        issues.push(`第9條：基地面積 ${site.siteAreaM2}m² 小於規定 ${t.minArea}m²。`);
    }

    return {
        ok: false,
        applies: false,
        issues
    };
}

// ===== 第10條：舊丁種建築用地及工業區例外 =====

function checkLegacyIndustrialSiteByArt10(site) {
    const issues = [];

    const eligible =
        (site.isTypeDLand || site.isIndustrialZone) &&
        site.isSplitBefore1986_11_02;

    if (!eligible) {
        return {
            ok: false,
            applies: false,
            issues: ['第10條：限於民國75年11月2日前分割完成之丁種建築用地或工業區，本基地不符身份或時間條件。']
        };
    }

    const cat = getFrontRoadWidthCategory(site.frontRoadWidthM);
    const t = ART10_THRESHOLDS[cat];
    if (!t) {
        return {
            ok: false,
            applies: false,
            issues: ['第10條：正面路寬不在預設範圍內，需人工檢核。']
        };
    }

    const widthOK = site.minWidthM >= t.minWidth;
    const depthOK = site.minDepthM >= t.minDepth;

    if (widthOK && depthOK) {
        issues.push(`第10條：丁種建築用地或工業區舊基地，寬度≥${t.minWidth}m、深度≥${t.minDepth}m，准予建築，不受第3條限制。`);
        return {
            ok: true,
            applies: true,
            issues
        };
    }

    if (!widthOK) {
        issues.push(`第10條：基地最小寬度 ${site.minWidthM}m 小於規定 ${t.minWidth}m。`);
    }
    if (!depthOK) {
        issues.push(`第10條：基地最小深度 ${site.minDepthM}m 小於規定 ${t.minDepth}m。`);
    }

    return {
        ok: false,
        applies: false,
        issues
    };
}

// ===== 綜合分類與主檢核 =====

// 分類基地型態：0 = 非畸零地、1 = 面積狹小、2 = 地界曲折、3 = 同時具備
function classifyIrregularSiteType(narrowResult, tortuousResult) {
    const isNarrow = !!narrowResult.isNarrowSite;
    const isTortuous = !!tortuousResult.isTortuousBoundary;

    if (!isNarrow && !isTortuous) return 0;
    if (isNarrow && !isTortuous) return 1;
    if (!isNarrow && isTortuous) return 2;
    return 3;
}

// 主函式：檢核屏東縣畸零地使用規則（以「是否可單獨建築」為 isCompliant 判斷）
export function checkPingtungIrregularLandRules(site) {
    const checks = {};

    // 第3、6條：面積狹小基地
    const narrowResult = checkNarrowSiteByArt3And6(site);
    checks.art3_6_narrowSite = narrowResult;

    // 第7條：地界曲折基地
    const tortuousResult = checkTortuousBoundaryByArt7(site);
    checks.art7_tortuousBoundary = tortuousResult;

    // 第8條：不得建築與例外
    const buildabilityResult = checkBuildabilityExceptionsByArt8(site, narrowResult, tortuousResult);
    checks.art8_buildability = buildabilityResult;

    // 第9條：舊小基地例外
    const legacySmallResult = checkLegacySmallSiteByArt9(site);
    checks.art9_legacySmallSite = legacySmallResult;

    // 第10條：舊丁建及工業區例外
    const legacyIndustrialResult = checkLegacyIndustrialSiteByArt10(site);
    checks.art10_legacyIndustrialSite = legacyIndustrialResult;

    // 分類基地型態
    const buildingType = classifyIrregularSiteType(narrowResult, tortuousResult);

    // isCompliant 定義：下列任一為真即視為「可單獨建築」
    // 1. 非畸零地（既非面積狹小、亦非地界曲折）
    // 2. 雖為畸零地但符合第8條任一例外
    // 3. 符合第9條舊小基地例外
    // 4. 符合第10條舊丁建／工業區例外
    const nonIrregular = buildingType === 0;
    const canBuildByArt8 = buildabilityResult.canBuild;
    const canBuildByArt9 = legacySmallResult.applies && legacySmallResult.ok;
    const canBuildByArt10 = legacyIndustrialResult.applies && legacyIndustrialResult.ok;

    const isCompliant = !!(nonIrregular || canBuildByArt8 || canBuildByArt9 || canBuildByArt10);

    return {
        buildingType, // 0: 非畸零地；1: 面積狹小；2: 地界曲折；3: 同時具備
        checks,
        isCompliant
    };
}
