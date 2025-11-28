// 屏東縣臨時性建築物管理要點 檢核程式
// 預設對象：位於屏東縣、H2 集合住宅供公眾使用之臨時性建築物（可再由外層建物分類模組判定）

// 臨時性建築物類型編碼（數字，方便與其他建物分類系統整合）
const TEMP_BUILDING_TYPE = {
    GENERAL: 101,              // 一般臨時性建築物
    SHORT_TERM_EXHIBITION: 102,// 短期展演場所（第4點）
    SAMPLE_HOUSE: 103,         // 樣品屋（第5點）
    CAMPAIGN_OFFICE: 104       // 競選活動辦事處（第2點第2款）
};

/**
 * 建議的輸入資料結構示例
 */
export const defaultTemporaryBuilding = {
    // === 基本資訊 ===
    locationCounty: '屏東縣',         // 縣市名稱
    isTemporaryBuilding: true,         // 是否為臨時性建築物（第2點）
    hasUsageDeadlineDefined: true,     // 是否訂有使用期限（第2點）
    compliesBuildingActArt4: true,     // 是否符合建築法第4條構造物/雜項工作物定義（第2點）

    // 主要用途：'sampleHouse' | 'shortTermExhibition' | 'campaignOffice' | 'other'
    useCase: 'sampleHouse',

    // === 主管機關、核准情形 ===
    hasPurposeAgency: true,                  // 是否有目的事業主管機關（第3點第2款但書）
    hasPurposeAgencyApproval: true,          // 是否已取得目的事業主管機關同意/核准（第2、3、4點）
    hasCountyGovShortTermApproval: false,    // 是否有本府核准短期使用（第2點第1款）

    // === 申請文件（第3點） ===
    hasApplicationForm: true,                    // (一) 申請書
    hasPurposeAgencyApprovalDocument: true,      // (二) 目的事業主管機關核准文件（有主管機關時必備）
    hasArchitectMandateLetter: true,            // (三) 建築師委託書
    hasLandRightDocs: true,                      // (四) 土地使用權利證明文件
    hasSiteAndPlans: true,                       // (五) 現況圖、位置圖、平面圖、立面圖
    hasStructuralSafetyCert: true,              // (六) 結構安全證明書（建築師或技師簽證）
    hasSelfDemolitionAffidavit: true,           // (七) 屆期自行拆除切結書
    hasOtherEquipDrawingsAndPhotos: true,       // (八) 其他設備圖說及現況照片
    isSampleHouse: true,                         // 是否為樣品屋（第2點第3款、第5點）
    hasOriginalBuildingPermitCopy: true,         // (九) 樣品屋之原建築工程建造執照影本

    // === 消防設備（第3點第2項） ===
    involvesFireEquipment: true,                 // 是否涉及消防設備（例如有自動滅火、警報等）
    hasFireEquipmentApprovalFromFireDept: false,// 是否已向消防局取得消防設備圖說核准

    // === 短期展演場所（第4點） ===
    isShortTermExhibition: false,     // 是否為短期展演場所
    exhibitionTotalDays: 5,           // 申請使用期間（天數）
    stageMaxHeightM: 0,               // 臨時舞台最高高度 (m)
    stallMaxHeightM: 0,               // 臨時攤棚最高高度 (m)
    hasReportedToCountyGovForRecord: false, // 是否已報請本府備查（高度超過門檻時）

    // === 樣品屋條件（第5點） ===
    sampleHouseInitialApprovedYears: 1, // 初次核准使用年數（不得超過1年）
    sampleHouseTotalApprovedYears: 2,   // 展期後合計使用年數（不得超過2年）
    absoluteHeightM: 10,                // 樣品屋絕對高度 (m)
    siteBuildingHeightControlLimitM: 15,// 設置地區建築物管制高度線 (m)，須人工填入
    // 以下為可能的違反狀態（如不確定可填 false 或改為由人工判斷）
    violatesLandUseControl: false,      // 是否有妨礙土地使用管制（第5點第4款）
    violatesUrbanPlan: false,           // 是否有妨礙都市計畫
    violatesRegionalPlan: false,        // 是否有妨礙區域計畫
    hasPublicSafetyIssue: false,        // 是否有公共安全問題
    hasTrafficIssue: false,             // 是否有公共交通問題
    hasPublicHealthIssue: false,        // 是否有公共衛生問題

    // === 使用期限與展期（第6點） ===
    approvedUseMonths: 6,               // 本府核定使用期限（月），樣品屋以外以6個月為限
    hasExtendedApprovalFromPurposeAgency: false, // 目的事業主管機關是否簽報核定延長
    hasOtherLawForExtension: false,     // 是否有其他法規另有規定可延長

    // === 拆除期限（第7點） ===
    // 日期格式建議 'YYYY-MM-DD'，若建物尚在使用中，可暫填 null
    useExpiryDate: '2025-06-30',        // 使用期限屆滿日
    actualDemolitionDate: '2025-07-05'  // 實際拆除完畢日
};

/**
 * 解析 YYYY-MM-DD 字串為 Date 物件
 * 若格式錯誤則回傳 null
 */
function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return null;
    const [year, month, day] = parts;
    if (!year || !month || !day) return null;
    // 使用 UTC 避免時區誤差
    return new Date(Date.UTC(year, month - 1, day));
}

/**
 * 計算兩個日期相差天數（b - a）
 */
function diffInDays(b, a) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/**
 * 臨時性建築物類型分類
 * 回傳數字編碼或 null（非屏東縣或非臨時性建築物）
 */
function classifyTemporaryBuildingType(building) {
    if (building.locationCounty !== '屏東縣') return null;
    if (!building.isTemporaryBuilding) return null;

    if (building.useCase === 'shortTermExhibition' || building.isShortTermExhibition) {
        return TEMP_BUILDING_TYPE.SHORT_TERM_EXHIBITION;
    }
    if (building.useCase === 'sampleHouse' || building.isSampleHouse) {
        return TEMP_BUILDING_TYPE.SAMPLE_HOUSE;
    }
    if (building.useCase === 'campaignOffice') {
        return TEMP_BUILDING_TYPE.CAMPAIGN_OFFICE;
    }
    return TEMP_BUILDING_TYPE.GENERAL;
}

/**
 * 第2點：臨時性建築物定義檢核
 */
function checkTemporaryDefinition(building) {
    const issues = [];

    if (building.locationCounty !== '屏東縣') {
        issues.push('第1、2點：本檢核僅適用屏東縣轄區，本案 locationCounty 非「屏東縣」。');
    }

    if (!building.isTemporaryBuilding) {
        issues.push('第2點：應屬臨時性建築物方適用本要點，請確認是否符合建築法第4條之構造物或雜項工作物。');
    }

    if (!building.hasUsageDeadlineDefined) {
        issues.push('第2點：臨時性建築物應訂有使用期限。');
    }

    if (building.compliesBuildingActArt4 === false) {
        issues.push('第2點：臨時性建築物應符合建築法第4條規定。');
    }

    const allowedUseCases = ['sampleHouse', 'shortTermExhibition', 'campaignOffice', 'other'];
    if (!allowedUseCases.includes(building.useCase)) {
        issues.push('第2點：用途未明確歸屬於樣品屋、短期展演場所、競選活動辦事處或其他經核准之臨時使用，請人工確認。');
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

/**
 * 第3點、第四點：申請文件檢核
 * 對短期展演 ≤7日者，依第4點改採簡化流程
 */
function checkApplicationDocuments(building) {
    const issues = [];

    const isShortTermCase =
        building.isShortTermExhibition &&
        typeof building.exhibitionTotalDays === 'number' &&
        building.exhibitionTotalDays <= 7;

    // 短期展演場所且使用期間在七日以內（第4點）
    if (isShortTermCase) {
        // 先檢查是否已取得目的事業主管機關同意
        if (!building.hasPurposeAgencyApproval) {
            issues.push('第4點：申請使用期間在7日以內之短期展演場所，應先經目的事業主管機關同意後，方可搭建。');
        }

        const stageHigh = typeof building.stageMaxHeightM === 'number' ? building.stageMaxHeightM : 0;
        const stallHigh = typeof building.stallMaxHeightM === 'number' ? building.stallMaxHeightM : 0;

        // 高度超過門檻時，需檢附文件並報本府備查（免再依第3點申請）
        if (stageHigh > 2 || stallHigh > 4) {
            if (!building.hasApplicationForm) {
                issues.push('第4點：高度超過規定之臨時舞台或攤棚，應檢附申請書報請本府備查。');
            }
            if (!building.hasPurposeAgencyApprovalDocument) {
                issues.push('第4點：高度超過規定之臨時舞台或攤棚，應檢附目的事業主管機關核准文件。');
            }
            if (!building.hasSiteAndPlans) {
                issues.push('第4點：高度超過規定之臨時舞台或攤棚，應檢附現況圖、位置圖、平面圖、立面圖等相關圖說。');
            }
            if (!building.hasStructuralSafetyCert) {
                issues.push('第4點：高度超過規定之臨時舞台或攤棚，應檢附結構安全證明書。');
            }
            if (!building.hasReportedToCountyGovForRecord) {
                issues.push('第4點：高度超過規定之臨時舞台或攤棚，應報請本府備查。');
            }
        }

        return {
            ok: issues.length === 0,
            issues
        };
    }

    // 一般情形：依第3點申請臨時性建築許可
    if (!building.hasApplicationForm) {
        issues.push('第3點第1款：申請搭建臨時性建築物應填具申請書。');
    }

    if (building.hasPurposeAgency) {
        if (!building.hasPurposeAgencyApprovalDocument) {
            issues.push('第3點第2款：有目的事業主管機關者，應檢附核准文件。');
        }
    }
    // 無目的事業主管機關者，免附核准文件，此處不強制檢核

    if (!building.hasArchitectMandateLetter) {
        issues.push('第3點第3款：應檢附建築師委託書。');
    }

    if (!building.hasLandRightDocs) {
        issues.push('第3點第4款：應檢附土地使用權利證明文件（含土地登記簿謄本、地籍圖謄本及土地使用權同意書）。');
    }

    if (!building.hasSiteAndPlans) {
        issues.push('第3點第5款：應檢附現況圖、位置圖、平面圖、立面圖。');
    }

    if (!building.hasStructuralSafetyCert) {
        issues.push('第3點第6款：應檢附經建築師或專業技師簽證之結構安全證明書。');
    }

    if (!building.hasSelfDemolitionAffidavit) {
        issues.push('第3點第7款：應檢附屆期自行拆除切結書。');
    }

    if (!building.hasOtherEquipDrawingsAndPhotos) {
        issues.push('第3點第8款：應檢附其他必要之設備圖說及現況照片。');
    }

    if (building.isSampleHouse && !building.hasOriginalBuildingPermitCopy) {
        issues.push('第3點第9款、第5點第1款：申請樣品屋者，應檢附原建築工程建造執照影本，且須於取得建照後方可申請。');
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

/**
 * 第3點第2項：消防設備相關檢核
 */
function checkFireEquipment(building) {
    const issues = [];

    if (building.involvesFireEquipment) {
        if (!building.hasFireEquipmentApprovalFromFireDept) {
            issues.push('第3點第2項：涉及消防設備者，其消防設備圖說應於取得臨時性建築許可後，另向本府消防局申請核准。');
        }
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

/**
 * 第4點：短期展演場所檢核
 */
function checkShortTermExhibition(building) {
    const issues = [];

    if (!building.isShortTermExhibition) {
        return { ok: true, issues };
    }

    if (typeof building.exhibitionTotalDays !== 'number') {
        issues.push('第4點：短期展演場所應明確設定申請使用期間（天數），此處需人工確認。');
    } else if (building.exhibitionTotalDays > 7) {
        issues.push('第4點：短期展演場所之申請使用期間應在七日以內。');
    }

    if (!building.hasPurposeAgencyApproval) {
        issues.push('第4點：短期展演場所應先經目的事業主管機關同意後方可搭建。');
    }

    // 高度相關僅為是否須報備及檢附文件，實際高度上限並未在本要點中限制
    // 故高度檢核在 checkApplicationDocuments 中處理文件需求，本處不再重複

    return {
        ok: issues.length === 0,
        issues
    };
}

/**
 * 第5點：樣品屋相關檢核
 */
function checkSampleHouseRequirements(building) {
    const issues = [];

    if (!building.isSampleHouse) {
        return { ok: true, issues };
    }

    // (一) 應於取得建照後方可申請
    if (!building.hasOriginalBuildingPermitCopy) {
        issues.push('第5點第1款：樣品屋應於取得建照執照後方得申請，並應檢附建照影本。');
    }

    // (二) 使用期限：一年，得展期一次，合計不得超過二年
    if (typeof building.sampleHouseInitialApprovedYears === 'number' &&
        building.sampleHouseInitialApprovedYears > 1) {
        issues.push('第5點第2款：樣品屋初次核准使用期限為一年，不得超過一年。');
    }

    if (typeof building.sampleHouseTotalApprovedYears === 'number' &&
        building.sampleHouseTotalApprovedYears > 2) {
        issues.push('第5點第2款：樣品屋期限屆滿得展期一次，合計使用期限不得超過二年。');
    }

    // (三) 絕對高度不得超過管制高度線，且不得超過十二公尺
    if (typeof building.absoluteHeightM === 'number' &&
        typeof building.siteBuildingHeightControlLimitM === 'number') {
        const maxAllowed = Math.min(building.siteBuildingHeightControlLimitM, 12);
        if (building.absoluteHeightM > maxAllowed) {
            issues.push('第5點第3款：樣品屋絕對高度不得超過設置地區建築物管制高度線，且不得超過12公尺。');
        }
    } else {
        // 此處需人工判斷：若未提供高度或管制高度線
        // 為避免誤判，程式僅提示，不直接判為不合格
        // 註解：此處需人工判斷
    }

    // (四) 不得妨礙土地使用管制、都市計畫、區域計畫、公共安全、公共交通、公共衛生
    if (building.violatesLandUseControl) {
        issues.push('第5點第4款：樣品屋不得有妨礙土地使用管制之情形。');
    }
    if (building.violatesUrbanPlan) {
        issues.push('第5點第4款：樣品屋不得有妨礙都市計畫之情形。');
    }
    if (building.violatesRegionalPlan) {
        issues.push('第5點第4款：樣品屋不得有妨礙區域計畫之情形。');
    }
    if (building.hasPublicSafetyIssue) {
        issues.push('第5點第4款：樣品屋不得有影響公共安全之情形。');
    }
    if (building.hasTrafficIssue) {
        issues.push('第5點第4款：樣品屋不得有影響公共交通之情形。');
    }
    if (building.hasPublicHealthIssue) {
        issues.push('第5點第4款：樣品屋不得有影響公共衛生之情形。');
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

/**
 * 第6點：使用期限與展期檢核
 */
function checkUsagePeriod(building) {
    const issues = [];

    // 樣品屋使用期限另依第5點檢核，此處僅處理一般臨時性建築物
    if (!building.isSampleHouse) {
        if (typeof building.approvedUseMonths !== 'number' || building.approvedUseMonths <= 0) {
            issues.push('第6點第1款：臨時性建築物之設置期限應由本府核定，並以明確月數表示。');
        } else if (building.approvedUseMonths > 6) {
            if (!building.hasExtendedApprovalFromPurposeAgency && !building.hasOtherLawForExtension) {
                issues.push('第6點第1款：除樣品屋外，臨時性建築物設置期限以六個月為限；超過六個月者，應經目的事業主管機關簽報本府核定，或依其他法規規定。');
            }
        }
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

/**
 * 第7點：拆除期限檢核
 */
function checkDemolition(building) {
    const issues = [];

    // 若尚在使用中或尚無日期資料，僅提示需人工判斷，不直接判不合格
    if (!building.useExpiryDate || !building.actualDemolitionDate) {
        // 註解：此處需人工判斷（尚未屆期或尚未拆除）
        return {
            ok: true,
            issues
        };
    }

    const expiry = parseDate(building.useExpiryDate);
    const demolition = parseDate(building.actualDemolitionDate);

    if (!expiry || !demolition) {
        // 日期格式錯誤視為需人工確認
        return {
            ok: true,
            issues
        };
    }

    const days = diffInDays(demolition, expiry);
    // 屆滿翌日起七日內拆除：大致可視為 demolition - expiry ≤ 7
    if (days > 7) {
        issues.push('第7點：臨時性建築物應於使用期限屆滿翌日起七日內自行拆除完畢，逾期視同違章建築。');
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

/**
 * 主檢核函式
 * 回傳：
 * {
 *   buildingType: number | null,
 *   checks: { [key: string]: { ok: boolean, issues: string[] } },
 *   isCompliant: boolean
 * }
 */
export function checkPingtungTemporaryBuilding(building) {
    const buildingType = classifyTemporaryBuildingType(building);

    const checks = {
        definition: checkTemporaryDefinition(building),
        applicationDocuments: checkApplicationDocuments(building),
        fireEquipment: checkFireEquipment(building),
        shortTermExhibition: checkShortTermExhibition(building),
        sampleHouse: checkSampleHouseRequirements(building),
        usagePeriod: checkUsagePeriod(building),
        demolition: checkDemolition(building)
    };

    const isCompliant = Object.values(checks).every(result => result.ok);

    return {
        buildingType,
        checks,
        isCompliant
    };
}
