// 縣有畸零地處理作業要點 – JS 檢核程式（屏東縣）
// ==================================================
// 本程式依據「屏東縣縣有畸零地處理作業要點」設計，用於檢核個案處理方式是否合法。

// ===== 1. 資料結構範例 =====

export const defaultLandCase = {
    // 基本案件資訊
    caseId: "",                 // 案件編號
    county: "Pingtung",                    // 縣市名稱（此作業要點限定屏東縣）
    isCountyOddLot: true,                  // 是否為「縣有畸零地」案件（第1點、第2點）
    isAdjacentPrivateOddLot: true,         // 是否為鄰接私有畸零地合併使用案件（第2點）
    applicantType: "private",              // 申請人類型："private" | "government" | "publicEnterprise"
    managingAgencyHasCertifiedMergeNeeded: false, // 本府公文認定應合併建築使用（第8點）

    // 擬合併土地面積與建築基地條件（第3點、第4點、第5點）
    countyPartAreaSqm: 0,                // 擬合併使用之縣有土地「部分」面積（㎡）
    privateOddLotAreaSqm: 0,              // 私有畸零地面積（㎡）
    minBuildingSiteAreaSqm: 0,            // 縣畸零地使用規則規定「最小建築基地面積」（㎡）
    combinedAreaSqm: 0,                  // 合併後預計建築基地總面積（㎡），可由程式自行計算

    countyPartCanStandaloneBuild: false,   // 擬合併之縣有土地整筆是否可單獨建築（第5點）
    privateLotComesFromSplitOfBuildableLot: false, // 私有畸零地是否由原已達可單獨建築之土地分割出（第5點第1款）
    privateLotComesFromPreviousOddLotPurchaseSplitOut: false, // 是否由先前以畸零地方式承購縣有土地後再分割出（第5點第2款）

    isOnlyPossibleMergeTarget: true,       // 擬合併之縣有土地是否為該私有畸零地「惟一應合併建築之土地」（第5點第1款但書）
    privateMustMergeWithThisCountyLandOnly: true, // 私有畸零地必須與惟一部分縣有土地合併始可建築使用（第5點第2項）
    remainingCountyPartCanStandaloneBuild: true,  // 合併剩餘部分縣有土地仍可單獨建築（第5點第2項但書）

    // 協議調整地形程序狀態（第3點、第4點、第5點）
    landAdjustmentTried: false,            // 是否曾試行協議調整地形
    landAdjustmentSucceeded: null,         // 協議調整地形是否成立（true/false/null）
    mediationTried: false,                 // 是否曾進行調處（例如由地政或主管機關調處）
    mediationSucceeded: null,              // 調處是否成立（true/false/null）
    canAdjustWithinWidthDepthRules: null,  // 是否能調整至雙方基地均達最小寬度及深度（第4點第1款）※此處需人工判斷
    noWayToAdjustLandShape: null,          // 是否「確無調整地形」的可能（第5點第2項但書）※此處需人工判斷

    // 調整地形後建築基地與法定空地（第4點）
    bothSitesMeetMinWidthDepth: null,      // 調整後雙方建築基地是否均達最小面積之寬度及深度（第4點第1款）※人工判斷
    keepOriginalPositionOrAreaAsMuchAsPossible: null, // 是否儘量維持原有位置或面積/土地等值（第4點第1款）※人工判斷
    nonLegalOpenSpace: null,               // 合併後基地是否非屬法定空地（第4點第2款）※人工判斷

    // 占用與補償（第6點）
    isOccupied: false,                     // 縣有畸零地是否已被占用（第6點第1項）
    occupantIsAdjacentOwner: false,        // 占用人是否為鄰地所有權人（第6點第2項）
    occupantIsApplicant: false,            // 占用人是否同時為申購人
    applicantIsAdjacentOwner: true,        // 申購人是否為鄰地所有權人（第2點、第6點第2項）
    occupantWillRemoveStructures: false,   // 占用人是否切結願自行排除地上物（第6點第2項）
    compensationFeeCollected: false,       // 是否已追繳使用補償金（第6點第1項）

    // 土地權利狀態（第4點第2款、第7點）
    hasSurfaceRight: false,                // 是否設定地上權
    hasDianRight: false,                   // 是否設定典權
    hasLease: false,                       // 是否有出租情事（承租人）
    applicantIsPriorityRightHolder: false, // 申購人是否為地上權人/典權人/承租人（第7點）
    priorityRightHoldersWaived: false,     // 是否已取得地上權人/典權人/承租人放棄優先購買之證明

    // 共有狀態（第9點）
    isCoOwnedWithOtherGovAgency: false,    // 縣有畸零地是否與其他政府機關共有（第9點第1款）
    otherGovAgencyConsentedEntrust: null,  // 他共有機關是否同意委託縣府併同處理（第9點第1款）
    isCoOwnedWithPrivateOwners: false,     // 是否為縣私共有畸零地（第9點第2款）
    hasAskedCoOwnersPriorityPurchase: null,// 是否已依土地法34-1第4項徵詢他共有人優先承購意願（第9點第2款）

    // 稅費與補償（第4點）
    taxAndFeeSharingAgreed: false,         // 協議雙方是否已約定稅費負擔方式（第4點第3款）
    areaOrValueChangedAfterAdjustment: false, // 協議調整地形後土地面積或價值是否有增減（第4點第4款）
    cashCompensationCalculated: false,     // 是否依專案查估價格計算現金補償（第4點第4款）

    // 價格與承諾（第3點、第10點、第附件二）
    buyerAgreesSpecialAppraisalPrice: false, // 是否承諾照專案提估價格承購（第3點第1、2款、第10點第6款）
    buyerRefusesLandAdjustment: false,       // 是否切結不願調處/不願再行調整地形（第3點第2款）
    commitmentLetterSigned: false,           // 是否已簽署承諾書/切結書（對應附件二、第10點第6款）

    // 處理方式（實際擬採之方式，以供檢核是否符合法定路徑）
    plannedHandling: "directSale",        // "directSale" | "auction" | "noSale" | "landAdjustmentOnly" | "other"
    plannedSplitCountyLand: false,        // 是否擬辦理縣有土地分割供他人合併使用（第5點第2項）

    // 申請文件是否齊備（第10點）
    docSaleListAttached: false,                       // 土地擬出售清冊（第10點第1款）
    docOddLotMergeCertificateAttached: false,         // 公有畸零地合併使用證明書（第10點第2款）
    docGovMergeOfficialDocAttached: false,           // 本府認定應合併建築使用之公文書（第10點第3款，限政府/公營）
    docLandRegistryAndCadastralMapAttached: false,    // 土地登記簿謄本暨地籍圖謄本（第10點第4款）
    docZoningAndAnnouncedLandValueAttached: false,    // 都市計畫使用分區證明及公告現值證明（第10點第5款）
    docCommitmentLetterAttached: false,               // 以專案提估方式計價之承諾書（第10點第6款）
    docOtherRequiredDocsAttached: false               // 其他法令規定應檢附之文件（第10點第7款）
};

// ===== 2. 工具函式：判斷法定處理路徑（第3點） =====

/**
 * 依第3點規定，依縣有擬合併部分土地面積與程序狀態，推論應採的處理方式：
 * - "directSaleWithinMinArea": 第3點第1款
 * - "directSaleUnder500AfterFailedAdjustment": 第3點第2款
 * - "auctionOver500AfterFailedAdjustmentAndMediation": 第3點第3款
 * - "noSale_Art5_1" / "noSale_Art5_2": 第5點不得讓售情形
 * - "notApplicable": 非縣有畸零地案件
 * - "undeterminedNeedManualReview": 資料不足或條件不符合任一法定類型
 */
export function determineOddLotSalePath(c) {
    // 非縣有畸零地則不適用本要點
    if (!c.isCountyOddLot) {
        return "notApplicable";
    }

    // 先檢查第5點不得讓售情形
    if (
        c.privateLotComesFromSplitOfBuildableLot &&
        c.countyPartCanStandaloneBuild &&
        !c.isOnlyPossibleMergeTarget
    ) {
        // 第5點第1款：不得讓售
        return "noSale_Art5_1";
    }

    if (
        c.privateLotComesFromPreviousOddLotPurchaseSplitOut &&
        c.countyPartCanStandaloneBuild
    ) {
        // 第5點第2款：不得讓售
        return "noSale_Art5_2";
    }

    // 第3點第1款：擬合併部分土地「在最小建築基地面積內」，且願照專案提估售價承購者，予以讓售。
    // 實務上對「在最小建築基地面積內」有不同解讀，此處以「縣有部分面積 <= 最小建築基地面積」為簡化判斷。
    if (
        typeof c.countyPartAreaSqm === "number" &&
        typeof c.minBuildingSiteAreaSqm === "number" &&
        c.countyPartAreaSqm > 0 &&
        c.countyPartAreaSqm <= c.minBuildingSiteAreaSqm &&
        c.buyerAgreesSpecialAppraisalPrice
    ) {
        return "directSaleWithinMinArea";
    }

    // 第3點第2款：縣有擬合併部分面積 ≤ 500㎡，且「超過最小建築基地面積」，協議調整地形不成立，申購人切結不願調處並願照專案提估價格承購。
    if (
        typeof c.countyPartAreaSqm === "number" &&
        typeof c.minBuildingSiteAreaSqm === "number" &&
        c.countyPartAreaSqm > c.minBuildingSiteAreaSqm &&
        c.countyPartAreaSqm <= 500 &&
        c.landAdjustmentTried === true &&
        c.landAdjustmentSucceeded === false &&
        c.buyerRefusesLandAdjustment === true &&
        c.buyerAgreesSpecialAppraisalPrice === true
    ) {
        return "directSaleUnder500AfterFailedAdjustment";
    }

    // 第3點第3款：縣有擬合併部分面積 > 500㎡，協議調整地形及調處均不成立者，予以標售。
    if (
        typeof c.countyPartAreaSqm === "number" &&
        c.countyPartAreaSqm > 500 &&
        c.landAdjustmentTried === true &&
        c.landAdjustmentSucceeded === false &&
        c.mediationTried === true &&
        c.mediationSucceeded === false
    ) {
        return "auctionOver500AfterFailedAdjustmentAndMediation";
    }

    // 其他情形：資料不足或不符合任一法條類型，需承辦人進一步判斷。
    return "undeterminedNeedManualReview";
}

// ===== 3. 各項細部檢核函式 =====

function checkSalePath(landCase) {
    const issues = [];
    const path = determineOddLotSalePath(landCase);

    // 將推論出的 path 與實際擬採處理方式比對
    if (path === "notApplicable") {
        return {
            ok: true,
            issues: ["本案非縣有畸零地，屏東縣縣有畸零地處理作業要點不適用。"],
            computedPath: path
        };
    }

    if (path.startsWith("noSale_")) {
        if (landCase.plannedHandling !== "noSale") {
            issues.push(
                `第5點規定本案屬不得讓售情形（${path}），但 plannedHandling = ${landCase.plannedHandling}，應改為不予讓售。`
            );
        }
        return {
            ok: issues.length === 0,
            issues,
            computedPath: path
        };
    }

    // 根據第3點各款，比對處理方式
    if (path === "directSaleWithinMinArea") {
        if (landCase.plannedHandling !== "directSale") {
            issues.push(
                "第3點第1款：依面積與承諾情形，本案應採協議讓售（directSale），請確認 plannedHandling。"
            );
        }
    } else if (path === "directSaleUnder500AfterFailedAdjustment") {
        if (landCase.plannedHandling !== "directSale") {
            issues.push(
                "第3點第2款：面積在 500㎡ 以下且超過最小建築基地，協議調整地形不成立且申購人切結不再調處，應採協議讓售（directSale）。"
            );
        }
    } else if (path === "auctionOver500AfterFailedAdjustmentAndMediation") {
        if (landCase.plannedHandling !== "auction") {
            issues.push(
                "第3點第3款：面積超過 500㎡，協議調整地形及調處均不成立，本案應採標售（auction）。"
            );
        }
    } else if (path === "undeterminedNeedManualReview") {
        issues.push(
            "第3點：依現有面積與程序資料無法明確歸類至任一款，須承辦人依事實與縣畸零地使用規則進一步判斷。"
        );
    }

    return {
        ok: issues.length === 0,
        issues,
        computedPath: path
    };
}

function checkNonSaleProhibitions(landCase) {
    const issues = [];

    // 第5點第1款：不得讓售
    if (
        landCase.privateLotComesFromSplitOfBuildableLot &&
        landCase.countyPartCanStandaloneBuild &&
        !landCase.isOnlyPossibleMergeTarget
    ) {
        if (landCase.plannedHandling === "directSale" || landCase.plannedHandling === "auction") {
            issues.push(
                "第5點第1款：私有畸零地係由原已達可單獨建築之土地分割出，且擬合併縣有土地整筆可單獨建築，並非惟一應合併建築之土地，縣有土地不得讓售。"
            );
        }
    }

    // 第5點第2款：不得讓售
    if (
        landCase.privateLotComesFromPreviousOddLotPurchaseSplitOut &&
        landCase.countyPartCanStandaloneBuild
    ) {
        if (landCase.plannedHandling === "directSale" || landCase.plannedHandling === "auction") {
            issues.push(
                "第5點第2款：私有畸零地係由原以畸零地合併方式承購縣有土地後再分割出，且擬合併之縣有土地整筆可單獨建築者，不予讓售。"
            );
        }
    }

    // 第5點第2項：縣有土地可單獨建築者，不得分割供他人合併使用，但書另有例外。
    if (landCase.plannedSplitCountyLand) {
        if (landCase.countyPartCanStandaloneBuild) {
            // 例外條件：私有畸零地必須與惟一部分縣有土地合併始可建築，且合併剩餘部分縣有土地仍可單獨建築。
            const exceptionApplies =
                landCase.privateMustMergeWithThisCountyLandOnly &&
                landCase.remainingCountyPartCanStandaloneBuild;

            if (!exceptionApplies) {
                issues.push(
                    "第5點第2項：縣有土地本可單獨建築者，不得分割供他人合併使用；本案不符合但書例外（須為惟一可合併部分且剩餘部分仍可單獨建築）。"
                );
            }
        }
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

function checkLandAdjustment(landCase) {
    const issues = [];

    // 第4點：僅在辦理調整地形時適用
    if (!landCase.landAdjustmentTried) {
        return {
            ok: true,
            issues: ["第4點：本案未辦理協議調整地形，本點規定視為不適用。"]
        };
    }

    // 第4點第1款：儘量維持雙方土地原有位置或面積或土地等值，並使雙方建築基地均達最小面積之寬度及深度。
    if (landCase.landAdjustmentSucceeded) {
        if (landCase.bothSitesMeetMinWidthDepth !== true) {
            issues.push(
                "第4點第1款：應使雙方建築基地均能達到最小面積之寬度及深度，此處欄位 bothSitesMeetMinWidthDepth ≠ true，需人工確認。"
            );
        }
        if (landCase.keepOriginalPositionOrAreaAsMuchAsPossible !== true) {
            issues.push(
                "第4點第1款：調整地形應儘量維持原有位置或面積或土地等值，欄位 keepOriginalPositionOrAreaAsMuchAsPossible ≠ true，需人工確認。"
            );
        }
    }

    // 第4點第3款：稅費負擔
    if (!landCase.taxAndFeeSharingAgreed) {
        issues.push(
            "第4點第3款：協議調整地形所需稅費應由協議雙方依規定負擔，請確認已約定稅費負擔方式。"
        );
    }

    // 第4點第4款：面積或價值增減時的現金補償
    if (landCase.areaOrValueChangedAfterAdjustment && !landCase.cashCompensationCalculated) {
        issues.push(
            "第4點第4款：協議調整地形後土地面積或價值有增減時，雙方應按土地專案查估價格以現金互為補償，請確認已完成補償金計算。"
        );
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

function checkOccupancy(landCase) {
    const issues = [];

    if (!landCase.isOccupied) {
        return {
            ok: true,
            issues: ["第6點：本案縣有畸零地未被占用，無占用補償相關問題。"]
        };
    }

    // 第6點第1項：已被占用，出售時應追繳使用補償金。
    if (
        (landCase.plannedHandling === "directSale" ||
            landCase.plannedHandling === "auction") &&
        !landCase.compensationFeeCollected
    ) {
        issues.push("第6點第1項：縣有畸零地已被占用，出售時應追繳使用補償金。");
    }

    // 第6點第2項：占用人非鄰地所有權人，且鄰地所有權人檢附證明書申請讓售時，須切結排除地上物。
    if (!landCase.occupantIsAdjacentOwner && landCase.applicantIsAdjacentOwner) {
        if (!landCase.occupantWillRemoveStructures) {
            issues.push(
                "第6點第2項：占用人非鄰地所有權人，鄰地所有權人申請讓售時，應由占用人立具切結願自行排除地上物。"
            );
        }
        if (!landCase.docOddLotMergeCertificateAttached) {
            issues.push(
                "第6點第2項：鄰地所有權人申請讓售應檢附公有畸零地合併使用證明書。"
            );
        }
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

function checkPriorityRightHolders(landCase) {
    const issues = [];

    const hasAnyRight =
        landCase.hasSurfaceRight || landCase.hasDianRight || landCase.hasLease;

    if (!hasAnyRight) {
        return {
            ok: true,
            issues: ["第7點：本案無地上權、典權或租賃設定，無優先購買權相關問題。"]
        };
    }

    // 第7點：有地上權、典權或承租人者，對縣有畸零地有優先購買權。
    if (!landCase.applicantIsPriorityRightHolder && !landCase.priorityRightHoldersWaived) {
        issues.push(
            "第7點：縣有畸零地已設定地上權、典權或出租者，其權利人對該土地有依同樣條件優先購買之權，須確認是否由權利人申購或已取得其放棄優先購買之文件。"
        );
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

function checkGovApplicants(landCase) {
    const issues = [];

    if (landCase.applicantType === "government" || landCase.applicantType === "publicEnterprise") {
        // 第8點：須經本府以公文書認定應合併建築使用。
        if (!landCase.managingAgencyHasCertifiedMergeNeeded) {
            issues.push(
                "第8點：政府機關或公營事業申購毗鄰縣有畸零地，須經本府以公文認定應合併建築使用。"
            );
        }
        if (!landCase.docGovMergeOfficialDocAttached) {
            issues.push(
                "第10點第3款：政府機關、公營事業申購，應檢附本府認定應合併建築使用之公文書。"
            );
        }
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

function checkCoOwnership(landCase) {
    const issues = [];

    // 第9點第1款：與其他政府機關共有
    if (landCase.isCoOwnedWithOtherGovAgency) {
        if (!landCase.otherGovAgencyConsentedEntrust) {
            issues.push(
                "第9點第1款：縣有畸零地與其他政府機關共有者，經管機關應先行函徵他共有機關同意委託併同縣有部分處理。"
            );
        }
    }

    // 第9點第2款：縣私共有畸零地
    if (landCase.isCoOwnedWithPrivateOwners) {
        if (!landCase.hasAskedCoOwnersPriorityPurchase) {
            issues.push(
                "第9點第2款：縣私共有畸零地，應先依土地法第34條之一第4項規定，徵求他共有人是否優先承購。"
            );
        }
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

function checkApplicationDocuments(landCase) {
    const issues = [];

    // 第10點第1款：土地擬出售清冊
    if (!landCase.docSaleListAttached) {
        issues.push("第10點第1款：應檢附土地擬出售清冊。");
    }

    // 第10點第2款：公有畸零地合併使用證明書
    if (!landCase.docOddLotMergeCertificateAttached) {
        issues.push("第10點第2款：應檢附本府核發之公有畸零地合併使用證明書。");
    }

    // 第10點第3款：政府機關、公營事業
    if (
        (landCase.applicantType === "government" ||
            landCase.applicantType === "publicEnterprise") &&
        !landCase.docGovMergeOfficialDocAttached
    ) {
        issues.push(
            "第10點第3款：政府機關、公營事業申購，應檢附本府認定應合併建築使用之公文書。"
        );
    }

    // 第10點第4款：土地登記簿謄本暨地籍圖謄本
    if (!landCase.docLandRegistryAndCadastralMapAttached) {
        issues.push("第10點第4款：應檢附擬合併公、私有土地及四鄰土地登記簿及地籍圖謄本。");
    }

    // 第10點第5款：都市計畫使用分區證明及當期土地公告現值證明
    if (!landCase.docZoningAndAnnouncedLandValueAttached) {
        issues.push(
            "第10點第5款：應檢附擬出售縣有畸零地之都市計畫使用分區證明及當期土地公告現值證明。"
        );
    }

    // 第10點第6款：以專案提估方式計價之承諾書
    if (!landCase.docCommitmentLetterAttached || !landCase.commitmentLetterSigned) {
        issues.push(
            "第10點第6款：應檢附以專案提估方式計價之承諾書（附件二），並完成承諾書簽署。"
        );
    }

    // 第10點第7款：依其他法令規定應檢附之文件
    if (!landCase.docOtherRequiredDocsAttached) {
        issues.push("第10點第7款：尚未確認是否已檢附其他法令規定應備文件。");
    }

    return {
        ok: issues.length === 0,
        issues
    };
}

// ===== 4. 主函式：整體檢核 =====

export function checkCountyOddLotCase(caseInput) {
    const c = caseInput;

    const checks = {
        salePath: checkSalePath(c),
        nonSaleProhibitions: checkNonSaleProhibitions(c),
        landAdjustment: checkLandAdjustment(c),
        occupancy: checkOccupancy(c),
        priorityRightHolders: checkPriorityRightHolders(c),
        govApplicants: checkGovApplicants(c),
        coOwnership: checkCoOwnership(c),
        applicationDocuments: checkApplicationDocuments(c)
    };

    const isCompliant = Object.values(checks).every((r) => r.ok);

    return {
        buildingType: null, // 本作業要點非建築物類型分類，故設為 null
        checks,
        isCompliant
    };
}
