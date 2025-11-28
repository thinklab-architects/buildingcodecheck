// =======================
// 資料結構示範
// =======================

/**
 * 建議的輸入資料結構範例（請依實務資料填入）
 */
export const exampleTdrData = {
    projectName: "某容積移轉案",

    // 基本容積資訊
    baselineFar: 300,              // 基準容積率（例如 300 代表 300%）
    legalFar: 300,                 // 法定容積率（通常與基準容積率相同，視個案調整）
    tdrBonusFar: 60,               // 本次容積移轉欲移入之容積率（獎勵部分，％）
    otherBonusFar: 20,             // 其他依法規規定之獎勵容積率（不含都更，％）
    urbanRenewalBonusFar: 0,       // 都市更新獎勵容積率（不計入 50% 上限）

    // 是否位於可提高移入上限的特定地區（第5點第2項）
    isInIntegratedDevArea: false,       // 是否為整體開發地區
    isInUrbanRenewalArea: false,        // 是否為實施都市更新地區
    isInOtherDesignatedAreaForExtraTdr: false, // 其他都市計畫指定可提高上限之地區
    urbanDesignCommitteeApprovedForExtraTdr: false, // 移入容積超過 20/30% 時，是否經都市設計審議委員會同意

    // 送出基地（多筆宗地）
    sendOutParcels: [
        {
            parcelId: "屏東段123-1",
            area: 500,                        // 面積 m²
            landUseZone: "publicFacility",    // 自行約定：例如 publicFacility / historic / preservation / openSpace
            isHistoricBuildingLand: false,    // 是否為依文資法公告之歷史建築定著土地
            isUrbanPlanPreservedArea: false,  // 是否為都市計畫指定應予保存地區
            isForPublicOpenSpace: false,      // 是否提供作為公共開放空間使用之可建築土地
            isPublicFacilityReservation: true,// 是否為公共設施保留地
            publicFacilityType: "park",       // 公園、公園兼兒童遊樂場、綠地、廣場…等（第2點第1項第3款）
            isCommonBurdenFacilityLandInIntegratedDev: false, // 是否為區段徵收、市地重劃等共同負擔公共設施用地（第2點第2項）
            isPublicOwnership: true,          // 是否公有土地
            landValue: 100000                 // 土地公告現值（元/㎡ 或其他單位，依你內部慣例）
        }
    ],
    sendOutOwnersAllAgreed: true,        // 除公有土地外，是否全數所有權人同意（第2點第3項）
    sendOutAcceptedByCompetentAuthority: true, // 送出基地目的事業主管機關是否同意受贈（第4點）
    sendOutLandManagerAgency: "公園管理機關",

    // 接受基地（多筆宗地合併一建築基地）
    receiveParcels: [
        {
            parcelId: "屏東段456-1",
            area: 800,
            landUseZone: "residential", // residential / commercial / specialDesignated
            landValue: 120000,          // 土地公告現值
            far: 300                    // 該宗地法定容積率，供第8點加權計算
        }
    ],

    // 接受基地合併後建築基地幾何條件（第3點第1項）
    receiveLandUseCategory: "residential", // 住宅區 residential / 商業區 commercial / 指定地區 specialDesignated
    receiveBaseArea: 800,                  // 建築基地總面積（m²）
    receiveBasePerimeter: 120,             // 建築基地周長（m）
    adjacentRoadWidth: 8,                  // 臨接計畫道路寬度（m）
    adjacentRoadLength: 30,                // 臨接計畫道路長度（m）

    // 接受基地不得有之情形（第3點第2項）
    isExistingBuildingAddition: false,         // 是否為已領使用執照建物辦理增建
    isSlopeLand: false,                        // 是否為山坡地範圍內土地
    isInProhibitedTdrAreaByPlan: false,       // 是否為都市計畫禁止容積移轉或獎勵地區
    isInProhibitedAreaByCommittee: false,     // 是否為經都委會決議公告禁止容積移轉地區
    isInCulturalAssetBlockOrDesignArea: false,// 是否為文化資產所在街廓或因此需都市設計審議地區（附件一）
    isProhibitedByOtherLaw: false,            // 是否其他相關法令禁止容積移轉
    isSpecialUrbanPlanDesignatedArea: false,  // 是否為第3點第1項第3款所稱都市計畫指定地區
    compliesWithSpecialUrbanPlanTdrRules: false, // 是否符合該都市計畫之容積移轉相關規定（此處需人工判斷）
    isReceiveBaseScopeConsistent: true,       // 接受基地範圍是否與都市設計審議範圍及建照申請範圍一致（第3點第3項）

    // 水利法第82條河川區域（第6點）
    isWithinWaterConservationRiverArea: false, // 是否為水利法第82條規定之河川區域

    // 折繳代金（第7點）
    useCashInsteadOfPhysicalTransfer: false,   // 是否以折繳代金方式移入容積（計算金額需另由估價，此處不計算）

    // 初步認定與程序（第9點、第10點）
    applyTdrAndOtherBonusTogether: true,       // 是否與其他獎勵容積併同申請（第9點第1項）
    reviewedByUrbanDesignCommittee: true,      // 是否已送都市設計審議委員會審查（用於對照第9點第2項門檻）
    reviewedByTdrUnit: false,                  // 是否由容積移轉業務單位審查

    preliminaryTdrApprovalDate: "2024-01-01",  // 容積移轉初步認定函核發日期
    permitApplicationDate: "2024-10-01",       // 申請容積移轉許可函日期
    hasPreliminaryApprovalExtension: false,    // 是否申請展延有效期限（第10點第3項）
    preliminaryApprovalExtendedMonths: 0,      // 展延月數（不得超過 6 個月）

    // 初步認定後一年內須完成之事項（第10點第1項）
    sendOutOwnershipAcquired: true,           // 是否取得送出基地所有權
    sendOutImprovementsCleared: true,        // 是否清理土地改良物
    sendOutRightsCleared: true,              // 是否清理租賃契約、他項權利及限制登記
    sendOutDonatedToAuthority: true,         // 是否將送出基地產權贈與並完成移轉登記
    tdrPaymentCompleted: true,               // 是否繳納代金完竣（若採折繳）

    // 書件檢附（第12點）
    docs: {
        form1Checklist: false,                 // 【書件1】申請查核表
        form2Application: false,               // 【書件2】申請書
        form3CalculationSheet: false,          // 【書件3】計算表
        form4OwnerConsent: false,              // 【書件4】送出基地所有權人及權利關係人同意書
        form5Affidavit: false,                 // 【書件5】切結書
        hasSendOutOwnershipCopies: false,      // 送出基地土地所有權狀影本
        hasReceiveOwnershipCopies: false,      // 接受基地土地所有權狀影本
        hasZoningCertificates: false,          // 土地使用分區證明書
        hasLandRegistryTranscripts: false,     // 土地登記簿謄本
        hasCadastreMaps: false,                // 地籍圖謄本
        hasCurrentPhotos: false,               // 現況照片
        hasUrbanPlanLocationMap: false,        // 都市計畫位置圖
        hasBuildingLineMap: false,             // 建築線指示（定）圖
        hasFacilityAndTrafficAnalysis: false,  // 公共設施服務品質與交通影響分析資料
        hasOtherRequiredDocs: false            // 其他本府認為必要之文件
    },

    // 第8點計算後會自動塞入的欄位（起初可不給值）
    weightedSendOutLandValue: null,          // 送出基地加權平均土地公告現值
    weightedReceiveLandValue: null,          // 接受基地加權平均土地公告現值
    weightedReceiveFar: null                 // 接受基地加權平均容積率
};


// =======================
// 工具函式
// =======================

function makeResult(ok, issues = [], notes = []) {
    return { ok, issues, notes };
}

/**
 * 面積加權平均工具
 */
function calcAreaWeightedAverage(parcels, valueKey) {
    if (!Array.isArray(parcels) || parcels.length === 0) return null;
    let areaSum = 0;
    let weightedSum = 0;
    for (const p of parcels) {
        const area = Number(p.area) || 0;
        const value = Number(p[valueKey]);
        if (!area || isNaN(value)) continue;
        areaSum += area;
        weightedSum += area * value;
    }
    if (!areaSum) return null;
    return weightedSum / areaSum;
}

/**
 * 日期差（天數）
 */
function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

function daysBetween(start, end) {
    const s = parseDate(start);
    const e = parseDate(end);
    if (!s || !e) return null;
    const ms = e.getTime() - s.getTime();
    return ms / (1000 * 60 * 60 * 24);
}

/**
 * 判斷送出基地是否全部屬第2點第1項第1款（歷史建築或指定保存地區）
 */
function isSendOutBaseAllHistoricOrPreserved(building) {
    const parcels = building.sendOutParcels || [];
    if (parcels.length === 0) return false;
    return parcels.every(
        (p) => p.isHistoricBuildingLand || p.isUrbanPlanPreservedArea
    );
}

/**
 * 分類接受基地類型（依第3點第1項及第5點）
 * 回傳：
 *  - "residentialType1"   住宅區：≥500㎡ & road≥8m
 *  - "residentialType2"   住宅區：≥1000㎡ & road≥12m
 *  - "commercialType1"    商業區：≥1000㎡ & road≥8m
 *  - "commercialType2"    商業區：≥1000㎡ & road≥10m
 *  - "specialDesignated"  都市計畫指定地區（第3點第1項第3款）
 *  - null                 不符合任一類型
 */
function classifyReceiveBaseType(building) {
    const {
        receiveLandUseCategory,
        receiveBaseArea,
        receiveBasePerimeter,
        adjacentRoadWidth,
        adjacentRoadLength,
        isSpecialUrbanPlanDesignatedArea,
        compliesWithSpecialUrbanPlanTdrRules
    } = building;

    const area = Number(receiveBaseArea) || 0;
    const perim = Number(receiveBasePerimeter) || 0;
    const roadWidth = Number(adjacentRoadWidth) || 0;
    const roadLen = Number(adjacentRoadLength) || 0;
    const adjacencyOk =
        roadLen >= 25 || (perim > 0 && roadLen > perim / 6);

    if (receiveLandUseCategory === "residential") {
        if (!adjacencyOk) return null;
        // 先檢查條件較嚴格者（可得到 30% 上限）
        if (area >= 1000 && roadWidth >= 12) {
            return "residentialType2";
        }
        if (area >= 500 && roadWidth >= 8) {
            return "residentialType1";
        }
        return null;
    }

    if (receiveLandUseCategory === "commercial") {
        if (!adjacencyOk) return null;
        // 先檢查 roadWidth ≥10m（30% 上限）
        if (area >= 1000 && roadWidth >= 10) {
            return "commercialType2";
        }
        if (area >= 1000 && roadWidth >= 8) {
            return "commercialType1";
        }
        return null;
    }

    if (receiveLandUseCategory === "specialDesignated") {
        if (isSpecialUrbanPlanDesignatedArea && compliesWithSpecialUrbanPlanTdrRules) {
            // 實際容積上限應依個別都市計畫規定，程式不強制判斷
            return "specialDesignated";
        }
        return null;
    }

    return null;
}


// =======================
// 檢核：送出基地（第2點、第4點、第6點、第8點部分）
// =======================

function checkSendOutBaseEligibility(building) {
    const parcels = building.sendOutParcels || [];
    const issues = [];
    const notes = [];

    if (parcels.length === 0) {
        issues.push("未提供送出基地宗地資料，無法依第2點檢核送出基地條件。");
        return makeResult(false, issues, notes);
    }

    const allowedFacilityTypes = new Set([
        "park",                 // 公園用地
        "childrenPlayground",   // 兒童遊樂場用地
        "parkAndPlayground",    // 公園兼兒童遊樂場用地
        "green",                // 綠地（帶）
        "square",               // 廣場用地
        "squareAndParking",     // 廣場兼停車場用地
        "parking",              // 停車場用地
        "road",                 // 道路用地
        "school",               // 學校（中小學）用地
        "ditch",                // 溝渠用地
        "drainage",             // 排水道用地
        "parkway",              // 園道用地
        "pedestrianSquare"      // 人行廣場用地
    ]);

    parcels.forEach((p, idx) => {
        const id = p.parcelId || `#${idx + 1}`;

        const isType1 = p.isHistoricBuildingLand || p.isUrbanPlanPreservedArea;
        const isType2 = p.isForPublicOpenSpace;
        const isType3 = p.isPublicFacilityReservation;

        if (!isType1 && !isType2 && !isType3) {
            issues.push(
                `第2點第1項：送出基地限歷史建築定著土地、都市計畫指定應予保存之地區、` +
                `作為公共開放空間之可建築土地或公共設施保留地。宗地 ${id} 不符合上述任一類型。`
            );
        }

        if (isType3) {
            // 公共設施保留地類型檢查
            if (!allowedFacilityTypes.has(p.publicFacilityType)) {
                issues.push(
                    `第2點第1項第3款：宗地 ${id} 為公共設施保留地，其公共設施種類應為公園、兒童遊樂場、綠地、廣場、停車場、道路、` +
                    `學校、溝渠、排水道、園道、人行廣場等之一。請確認 publicFacilityType 填寫是否符合。`
                );
            }
        }

        if (p.isCommonBurdenFacilityLandInIntegratedDev) {
            issues.push(
                `第2點第2項：宗地 ${id} 為區段徵收、市地重劃或其他方式整體開發地區共同負擔之公共設施用地，不得作為送出基地。`
            );
        }
    });

    if (!building.sendOutOwnersAllAgreed) {
        issues.push("第2點第3項：送出基地申請範圍內，除公有土地外，土地所有權人須全數同意辦理容積移轉。");
    }

    if (!building.sendOutAcceptedByCompetentAuthority) {
        issues.push("第4點：送出基地所有權人提出移出容積意願後，須經送出基地目的事業主管機關同意受贈。");
    }

    if (building.isWithinWaterConservationRiverArea) {
        notes.push("第6點：本案送出基地位於水利法第82條河川區域，其土地公告現值應依同條第5項辦理折減計算（此處需人工計算）。");
    }

    const ok = issues.length === 0;
    return makeResult(ok, issues, notes);
}


// =======================
// 檢核：接受基地（第3點、第6點、第8點）
// =======================

function checkReceiveBaseEligibility(building) {
    const issues = [];
    const notes = [];

    const parcels = building.receiveParcels || [];
    if (parcels.length === 0) {
        issues.push("未提供接受基地宗地資料，無法依第3點檢核接受基地條件。");
        return makeResult(false, issues, notes);
    }

    const type = classifyReceiveBaseType(building);
    if (!type) {
        issues.push(
            "第3點第1項：接受基地未符合住宅區/商業區面積與臨接道路寬度及長度條件，" +
            "或未能證明符合都市計畫指定地區之容積移轉相關規定。"
        );
    }

    // 第3點第2項：不得有之情形
    if (building.isExistingBuildingAddition) {
        issues.push("第3點第2項第1款：已領有使用執照之土地辦理增建不得作為接受基地。");
    }
    if (building.isSlopeLand) {
        issues.push("第3點第2項第2款：位於山坡地範圍內之土地不得作為接受基地。");
    }
    if (building.isInProhibitedTdrAreaByPlan) {
        issues.push("第3點第2項第3款：依各該都市計畫規定或原擬定機關公告禁止容積移轉、獎勵地區之土地不得作為接受基地。");
    }
    if (building.isInProhibitedAreaByCommittee) {
        issues.push("第3點第2項第4款：經本縣都市計畫委員會決議並公告禁止容積移轉地區之土地不得作為接受基地。");
    }
    if (building.isInCulturalAssetBlockOrDesignArea) {
        issues.push("第3點第2項第5款：文化資產定著土地所在街廓或因文化資產因素須辦理都市設計審議之地區不得作為接受基地。");
    }
    if (building.isProhibitedByOtherLaw) {
        issues.push("第3點第2項第6款：依其他相關法令規定禁止容積移轉之土地不得作為接受基地。");
    }

    // 第3點第3項：範圍一致
    if (!building.isReceiveBaseScopeConsistent) {
        issues.push("第3點第3項：接受基地範圍應與都市設計審議範圍及建造執照申請範圍一致。");
    }

    const ok = issues.length === 0;
    return makeResult(ok, issues, notes);
}


// =======================
// 檢核：容積移入上限與獎勵總量（第5點、第9點）
// =======================

function checkTransferVolumeLimits(building) {
    const { baselineFar, legalFar, tdrBonusFar, otherBonusFar } = building;
    const issues = [];
    const notes = [];

    const type = classifyReceiveBaseType(building);

    // 第5點第1項：依接受基地類型給予 20% 或 30% 基準容積之上限
    let baseLimitRatio = null; // 0.2 或 0.3
    if (type === "residentialType1" || type === "commercialType1") {
        baseLimitRatio = 0.2;
    } else if (type === "residentialType2" || type === "commercialType2") {
        baseLimitRatio = 0.3;
    } else if (type === "specialDesignated") {
        // 都市計畫指定地區上限依個別都市計畫規定，此處不強制判斷
        notes.push("第3點第1項第3款、第5點第1項：本案為都市計畫指定地區，其容積移入上限應依個別都市計畫規定人工檢核。");
    }

    const inExtraArea =
        building.isInIntegratedDevArea ||
        building.isInUrbanRenewalArea ||
        building.isInOtherDesignatedAreaForExtraTdr;

    if (baseLimitRatio !== null) {
        const baseLimitFar = baselineFar * baseLimitRatio;
        const maxExtraLimitFar = baselineFar * 0.4; // 第5點第2項：最高 40%

        if (inExtraArea) {
            // 可於 20/30% 基礎上，在都設審同意下提高至最多 40%
            if (tdrBonusFar > maxExtraLimitFar) {
                issues.push(
                    "第5點第2項：整體開發地區、都市更新地區或其他都市計畫指定地區之接受基地，" +
                    "可移入容積最高不得超過基準容積之 40%。本案 tdrBonusFar 超過此上限。"
                );
            } else if (tdrBonusFar > baseLimitFar && !building.urbanDesignCommitteeApprovedForExtraTdr) {
                issues.push(
                    "第5點第2項：位於整體開發/都更/指定地區之接受基地，如移入容積超過基準容積之 20% 或 30%，" +
                    "須經屏東縣都市設計審議委員會審議通過。本案缺少都設審同意。"
                );
            }
        } else {
            // 非上述地區，僅能到 20% 或 30% 上限
            if (tdrBonusFar > baseLimitFar) {
                issues.push(
                    "第5點第1項：接受基地可移入容積，以基準容積之 20% 或 30% 為限（視基地類型而定），" +
                    "本案 tdrBonusFar 超過該上限。"
                );
            }
        }
    }

    // 第5點第3、4項：本要點移入容積 + 其他獎勵容積 ≤ 法定容積 50%（不含都更獎勵）
    const totalBonusFarExcludingUrbanRenewal = tdrBonusFar + otherBonusFar;
    if (totalBonusFarExcludingUrbanRenewal > legalFar * 0.5) {
        issues.push(
            "第5點第3、4項：接受基地依本要點移入之容積加計其他依法規規定予以獎勵之容積總和，" +
            "不得超過法定容積之 50%，且該總和不含都市更新獎勵容積。本案超過 50% 上限。"
        );
    }

    // 第9點第1項：應與其他獎勵併同申請
    if (!building.applyTdrAndOtherBonusTogether) {
        issues.push("第9點第1項：容積移轉申請案件應與其他依法規規定予以獎勵之容積併同申請。");
    }

    // 第9點第2項：增加容積總和超過基準容積 30% 者須送都設審
    const totalIncreaseFar = tdrBonusFar + otherBonusFar; // 仍不含都更獎勵
    const needUDCommittee = totalIncreaseFar > baselineFar * 0.3;

    if (needUDCommittee && !building.reviewedByUrbanDesignCommittee) {
        issues.push(
            "第9點第2項：增加容積總和超過基準容積之 30% 者，應由都市設計審議委員會審查，" +
            "本案未標示經都設審審查。"
        );
    }

    if (!needUDCommittee && !building.reviewedByTdrUnit) {
        notes.push(
            "第9點第2項：增加容積總和未超過基準容積之 30% 者，由本府容積移轉業務單位審查許可，" +
            "請確認實務上是否由該單位審查。"
        );
    }

    const ok = issues.length === 0;
    return makeResult(ok, issues, notes);
}


// =======================
// 檢核：多筆宗地加權平均（第8點）
// =======================

function checkMultiParcelWeightedValues(building) {
    const issues = [];
    const notes = [];

    const sendOutParcels = building.sendOutParcels || [];
    const receiveParcels = building.receiveParcels || [];

    if (sendOutParcels.length > 0) {
        const weightedSendOutLandValue = calcAreaWeightedAverage(sendOutParcels, "landValue");
        building.weightedSendOutLandValue = weightedSendOutLandValue;
        if (weightedSendOutLandValue === null) {
            notes.push("第8點：送出基地多筆宗地之土地公告現值加權平均計算失敗（可能缺少 area 或 landValue），需人工計算。");
        } else {
            notes.push(
                `第8點：已依申請當期土地公告現值以面積加權平均計算送出基地之公告現值，結果為 ${weightedSendOutLandValue}（實際單位依系統定義）。`
            );
        }
    }

    if (receiveParcels.length > 0) {
        const weightedReceiveLandValue = calcAreaWeightedAverage(receiveParcels, "landValue");
        const weightedReceiveFar = calcAreaWeightedAverage(receiveParcels, "far");
        building.weightedReceiveLandValue = weightedReceiveLandValue;
        building.weightedReceiveFar = weightedReceiveFar;

        if (weightedReceiveLandValue === null) {
            notes.push("第8點：接受基地多筆宗地之土地公告現值加權平均計算失敗（可能缺少 area 或 landValue），需人工計算。");
        }
        if (weightedReceiveFar === null) {
            notes.push("第8點：接受基地若位於不同土地使用分區，其容積率以面積加權平均計算，此處因缺少 far 或 area 無法計算，需人工確認。");
        }
        if (weightedReceiveLandValue !== null || weightedReceiveFar !== null) {
            notes.push("第8點：加權平均結果已寫入 building.weightedReceiveLandValue / weightedReceiveFar 欄位供後續使用。");
        }
    }

    // 此檢核主要是計算與備註，通常不會直接產生不合格
    return makeResult(true, issues, notes);
}


// =======================
// 檢核：程序與期限（第9點第3項、第10點）
// =======================

function checkProcedureAndDeadlines(building) {
    const issues = [];
    const notes = [];

    // 第9點第3項：經審議後始得申請初步認定函
    // 實務上需檢核程序順序，程式難以透過單一物件判斷，只提醒
    notes.push("第9點第3項：容積移轉案件應先經前項審議後，始得申請核發容積移轉初步認定函，此處需依實際流程人工確認。");

    // 第10點第1項：除歷史建築/指定保存地區送出基地外，一年內須完成四項事項
    const isHistoricType = isSendOutBaseAllHistoricOrPreserved(building);
    if (!isHistoricType) {
        if (!building.sendOutOwnershipAcquired) {
            issues.push("第10點第1項第1款：非歷史建築/指定保存地區送出基地，應於一年內取得送出基地所有權。");
        }
        if (!building.sendOutImprovementsCleared || !building.sendOutRightsCleared) {
            issues.push("第10點第1項第2款：應清理送出基地土地改良物、租賃契約、他項權利及限制登記等法律關係。");
        }
        if (!building.sendOutDonatedToAuthority) {
            issues.push("第10點第1項第3款：應將送出基地土地產權贈與送出基地土地管理機關並辦理移轉登記。");
        }
        if (building.useCashInsteadOfPhysicalTransfer && !building.tdrPaymentCompleted) {
            issues.push("第10點第1項第4款：採折繳代金方式時，應向本府繳納代金完竣。");
        }

        // 一年期限 + 最多 6 個月展期
        const days = daysBetween(building.preliminaryTdrApprovalDate, building.permitApplicationDate);
        if (days === null) {
            notes.push("第10點第1項：未提供初步認定函日期或許可函申請日期，無法自動檢核一年期限，需人工確認。");
        } else {
            const baseDays = 365;
            let allowedDays = baseDays;
            if (building.hasPreliminaryApprovalExtension) {
                const months = Number(building.preliminaryApprovalExtendedMonths) || 0;
                if (months > 6) {
                    issues.push("第10點第3項：容積移轉初步確認函展延時間不得超過六個月。");
                }
                // 以 31 天/月 粗略估算，實務仍需人工確認
                allowedDays += Math.min(months, 6) * 31;
                notes.push("第10點第3項：展延期限以每月 31 天近似計算，實務應依實際日期人工確認。");
            }
            if (days > allowedDays) {
                issues.push("第10點第1項及第3項：自初步認定函核發日起至申請容積移轉許可函之期間，已逾一年及展延期限，本府得撤銷初步確認函。");
            }
        }
    } else {
        notes.push("第10點第1項但書：送出基地為歷史建築或都市計畫指定保存地區者，不適用一年內完成贈與與清理的時間限制規定。");
    }

    // 第10點第2項：各項稅費由申請人負擔，屬行政費用，程式僅提醒
    notes.push("第10點第2項：土地登記規費、印花稅及其他稅捐等均由申請人負擔，此為費用分擔規定，程式不另檢核。");

    const ok = issues.length === 0;
    return makeResult(ok, issues, notes);
}


// =======================
// 檢核：書件是否齊備（第12點）
// =======================

function checkDocumentsCompleteness(building) {
    const issues = [];
    const notes = [];

    const d = building.docs || {};

    if (!d.form1Checklist) {
        issues.push("第12點第1款：【書件1】屏東縣政府都市計畫容積移轉許可審查要點申請查核表未檢附。");
    }
    if (!d.form2Application) {
        issues.push("第12點第2款：【書件2】都市計畫容積移轉許可審查申請書未檢附。");
    }
    if (!d.form3CalculationSheet) {
        issues.push("第12點第3款：【書件3】都市計畫容積移轉許可審查計算表未檢附。");
    }
    if (!d.form4OwnerConsent) {
        issues.push("第12點第4款：【書件4】送出基地所有權人及權利關係人同意書未檢附。");
    }
    if (!d.form5Affidavit) {
        issues.push("第12點第10款：【書件5】切結書未檢附。");
    }

    if (!d.hasSendOutOwnershipCopies || !d.hasReceiveOwnershipCopies) {
        issues.push("第12點第5款：送出基地及接受基地土地所有權狀影本未齊備。");
    }
    if (!d.hasZoningCertificates) {
        issues.push("第12點第6款：送出基地及接受基地之土地使用分區證明書未檢附。");
    }
    if (!d.hasLandRegistryTranscripts || !d.hasCadastreMaps) {
        issues.push("第12點第7款：送出基地及接受基地之土地登記簿謄本、地籍圖謄本未齊備。");
    }
    if (!d.hasCurrentPhotos || !d.hasUrbanPlanLocationMap) {
        issues.push("第12點第7款：送出基地及接受基地現況照片或都市計畫位置圖未齊備。");
    }
    if (!d.hasBuildingLineMap) {
        issues.push("第12點第8款：接受基地之建築線指示（定）圖未檢附。");
    }
    if (!d.hasFacilityAndTrafficAnalysis) {
        issues.push("第12點第9款：接受基地鄰近地區公共設施服務品質與交通影響之分析資料未檢附。");
    }
    if (!d.hasOtherRequiredDocs) {
        notes.push("第12點第11款：本府認為必要之其他文件視個案需求而定，請依實務審查意見補充。");
    }

    const ok = issues.length === 0;
    return makeResult(ok, issues, notes);
}


// =======================
// 主整合函式
// =======================

/**
 * 主檢核函式：檢查屏東縣政府都市計畫容積移轉審查許可要點之主要量化條件
 *
 * @param {object} building - 依上述範例定義之建案/容移案件資料
 * @returns {{
 *   buildingType: number | null,
 *   checks: {
 *     sendOutBase: { ok: boolean, issues: string[], notes: string[] },
 *     receiveBase: { ok: boolean, issues: string[], notes: string[] },
 *     volumeLimits: { ok: boolean, issues: string[], notes: string[] },
 *     multiParcel: { ok: boolean, issues: string[], notes: string[] },
 *     procedure: { ok: boolean, issues: string[], notes: string[] },
 *     documents: { ok: boolean, issues: string[], notes: string[] }
 *   },
 *   isCompliant: boolean
 * }}
 */
export function checkTdrCompliance(building) {
    const checks = {
        sendOutBase: checkSendOutBaseEligibility(building),
        receiveBase: checkReceiveBaseEligibility(building),
        volumeLimits: checkTransferVolumeLimits(building),
        multiParcel: checkMultiParcelWeightedValues(building),
        procedure: checkProcedureAndDeadlines(building),
        documents: checkDocumentsCompleteness(building)
    };

    const isCompliant = Object.values(checks).every((c) => c.ok);

    return {
        buildingType: null, // 此要點未定義數字型建築類型，保留欄位供與其他法規整合
        checks,
        isCompliant
    };
}
