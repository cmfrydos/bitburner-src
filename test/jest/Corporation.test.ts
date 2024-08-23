import { PositiveInteger } from "../../src/types";
import { Corporation } from "../../src/Corporation/Corporation";
import { Division } from "../../src/Corporation/Division";
import { Warehouse } from "../../src/Corporation/Warehouse";
import { Material } from "../../src/Corporation/Material";
import { OfficeSpace } from "../../src/Corporation/OfficeSpace";
import { CorpUpgrades } from "../../src/Corporation/data/CorporationUpgrades";
import { CorpUnlockName, CorpEmployeeJob } from "@enums";
import {
  calculateMaxAffordableUpgrade,
  calculateUpgradeCost,
  calculateOfficeSizeUpgradeCost,
} from "../../src/Corporation/helpers";
import { Player, setPlayer } from "../../src/Player";
import { PlayerObject } from "../../src/PersonObjects/Player/PlayerObject";
import {
  acceptInvestmentOffer,
  buyBackShares,
  goPublic,
  issueNewShares,
  sellShares,
} from "../../src/Corporation/Actions";

describe("Corporation", () => {
  let corporation: Corporation;

  beforeEach(() => {
    setPlayer(new PlayerObject());
    Player.init();
    corporation = new Corporation({ name: "Test" });
  });

  describe("helpers.calculateUpgradeCost", () => {
    it("should have fixed formula", () => {
      for (let currentUpgradeLevel = 0; currentUpgradeLevel < 5; currentUpgradeLevel++) {
        Object.values(CorpUpgrades).forEach((upgrade) => {
          corporation.upgrades[upgrade.name].level = currentUpgradeLevel;

          for (let targetUpgradeLevel = currentUpgradeLevel + 1; targetUpgradeLevel < 6; targetUpgradeLevel++) {
            expect(calculateUpgradeCost(corporation, upgrade, targetUpgradeLevel as PositiveInteger)).toMatchSnapshot(
              `${upgrade.name}: from ${currentUpgradeLevel} to ${targetUpgradeLevel}`,
            );
          }
        });
      }
    });
  });

  describe("helpers.calculateMaxAffordableUpgrade", () => {
    it("should return zero for negative funds", () => {
      corporation.funds = -1;

      Object.values(CorpUpgrades).forEach((upgrade) => {
        expect(calculateMaxAffordableUpgrade(corporation, upgrade)).toBe(0);
      });
    });

    it("should return zero for zero funds", () => {
      corporation.funds = 0;

      Object.values(CorpUpgrades).forEach((upgrade) => {
        expect(calculateMaxAffordableUpgrade(corporation, upgrade)).toBe(0);
      });
    });

    it("should be in sync with 'calculateUpgradeCost'", () => {
      for (let currentUpgradeLevel = 0; currentUpgradeLevel < 100; currentUpgradeLevel++) {
        Object.values(CorpUpgrades).forEach((upgrade) => {
          corporation.upgrades[upgrade.name].level = currentUpgradeLevel;

          for (let targetUpgradeLevel = currentUpgradeLevel + 1; targetUpgradeLevel < 100; targetUpgradeLevel++) {
            const calculatedCost = calculateUpgradeCost(corporation, upgrade, targetUpgradeLevel as PositiveInteger);
            corporation.funds = calculatedCost + 1; // +1 for floating point accuracy issues
            expect(calculateMaxAffordableUpgrade(corporation, upgrade)).toEqual(targetUpgradeLevel);
          }
        });
      }
    });
  });

  describe("Corporation totalShares", () => {
    function expectSharesToAddUp(corp: Corporation) {
      expect(corp.totalShares).toEqual(corp.numShares + corp.investorShares + corp.issuedShares);
    }

    it("should equal the sum of each kind of shares", () => {
      expectSharesToAddUp(corporation);
    });
    it("should be preserved by seed funding", () => {
      const seedFunded = true;
      Player.startCorporation("TestCorp", seedFunded);
      expectSharesToAddUp(Player.corporation!);
    });
    it("should be preserved by acceptInvestmentOffer", () => {
      acceptInvestmentOffer(corporation);
      expectSharesToAddUp(corporation);
    });
    it("should be preserved by goPublic", () => {
      const numShares = 1e8;
      goPublic(corporation, numShares);
      expectSharesToAddUp(corporation);
    });
    it("should be preserved by IssueNewShares", () => {
      const numShares = 1e8;
      goPublic(corporation, numShares);
      corporation.issueNewSharesCooldown = 0;
      issueNewShares(corporation, numShares);
      expectSharesToAddUp(corporation);
    });
    it("should be preserved by BuyBackShares", () => {
      const numShares = 1e8;
      goPublic(corporation, numShares);
      buyBackShares(corporation, numShares);
      expectSharesToAddUp(corporation);
    });
    it("should be preserved by SellShares", () => {
      const numShares = 1e8;
      goPublic(corporation, numShares);
      corporation.shareSaleCooldown = 0;
      sellShares(corporation, numShares);
      expectSharesToAddUp(corporation);
    });
  });

  describe("helpers.calculateOfficeSizeUpgradeCost matches documented formula", () => {
    // for discussion and computation of these test values, see:
    // https://github.com/bitburner-official/bitburner-src/pull/1179#discussion_r1534948725
    it.each([
      { fromSize: 3, increaseBy: 3, expectedCost: 4360000000.0 },
      { fromSize: 3, increaseBy: 15, expectedCost: 26093338259.6 },
      { fromSize: 3, increaseBy: 150, expectedCost: 3553764305895.24902 },
      { fromSize: 6, increaseBy: 3, expectedCost: 4752400000.0 },
      { fromSize: 6, increaseBy: 15, expectedCost: 28441738702.964 },
      { fromSize: 6, increaseBy: 150, expectedCost: 3873603093425.821 },
      { fromSize: 9, increaseBy: 3, expectedCost: 5180116000.0 },
      { fromSize: 9, increaseBy: 15, expectedCost: 31001495186.23076 },
      { fromSize: 9, increaseBy: 150, expectedCost: 4222227371834.145 },
    ])(
      "should cost $expectedCost to upgrade office by $increaseBy from size $fromSize",
      ({ fromSize, increaseBy, expectedCost }) => {
        expect(calculateOfficeSizeUpgradeCost(fromSize, increaseBy as PositiveInteger)).toBeCloseTo(expectedCost, 1);
      },
    );
  });
});

describe("Division", () => {
  let corporation: Corporation;
  let divisionChem: Division;
  let divisionMining: Division;

  const city = "Sector-12";
  const name = "ChemTestDiv";

  function setupCorporation() {
    setPlayer(new PlayerObject());
    Player.init();
    const corporation = new Corporation({ name: "Test" });

    corporation.divisions.set(
      "ChemTestDiv",
      new Division({
        corp: corporation,
        name: "ChemTestDiv",
        type: "Chemical",
      }),
    );

    corporation.divisions.set(
      "MiningTestDiv",
      new Division({
        corp: corporation,
        name: "MiningTestDiv",
        type: "Mining",
      }),
    );

    corporation.unlocks.add(CorpUnlockName.SmartSupply);
    return corporation;
  }

  function setupWarehouse(division: Division, city: string, corporation: Corporation) {
    const warehouse = new Warehouse({ division, loc: city, size: 1 });
    warehouse.level = 1;
    warehouse.updateSize(corporation, division);
    warehouse.materials["Food"].stored = 333.33 * 5; // Fill half with filler material, so that free Warehouse space is 50
    warehouse.updateSize(corporation, division);
    warehouse.updateMaterialSizeUsed();
    warehouse.smartSupplyEnabled = true;
    warehouse.smartSupplyOptions["Plants"] = "leftovers";
    warehouse.smartSupplyOptions["Water"] = "leftovers";
    warehouse.smartSupplyOptions["Hardware"] = "leftovers";
    division.warehouses[city] = warehouse;
  }

  beforeAll(() => {
    corporation = setupCorporation();
    divisionChem = corporation.divisions.get("ChemTestDiv");
    divisionMining = corporation.divisions.get("MiningTestDiv");

    // Improve Productivity to fill the warehouse faster
    for (const div of [divisionChem, divisionMining]) {
      const office = div.offices[city];
      const osize = 2e6;
      office.size = osize;
      for (let i = 0; i < osize / 2; i++) {
        office.hireRandomEmployee("Engineer");
        office.hireRandomEmployee("Operations");
      }
      office.calculateEmployeeProductivity(corporation, div);
    }
  });

  beforeEach(() => {
    // Simulate until START phase
    while (corporation.state.nextName != "START") {
      corporation.state.incrementState();
    }

    setupWarehouse(divisionChem, city, corporation);
    setupWarehouse(divisionMining, city, corporation);
  });

  describe("processMaterials", () => {
    describe("SmartSupply", () => {
      it("should start in START phase and have SmartSupply unlocked", () => {
        expect(corporation.unlocks.has(CorpUnlockName.SmartSupply)).toBe(true);
        expect(corporation.state.nextName).toBe("START");
      });

      it("should prepare warehouses correctly for the Chemical division", () => {
        const warehouse = divisionChem.warehouses[city];
        expect(divisionChem.getOfficeProductivity(divisionChem.offices[city])).toBeGreaterThan(100);
        expect(divisionChem.requiredMaterials).toStrictEqual({ Plants: 1, Water: 0.5 });
        expect(warehouse.size).toBeCloseTo(100);
        expect(warehouse.sizeUsed).toBeCloseTo(50);
        expect(warehouse.smartSupplyEnabled).toBe(true);
      });

      it("should prepare warehouses correctly for the Mining division", () => {
        const warehouse = divisionMining.warehouses[city];
        expect(divisionMining.getOfficeProductivity(divisionMining.offices[city])).toBeGreaterThan(100);
        expect(divisionMining.requiredMaterials).toStrictEqual({ Hardware: 0.1 });
        expect(warehouse.size).toBeCloseTo(100);
        expect(warehouse.sizeUsed).toBeCloseTo(50);
        expect(warehouse.smartSupplyEnabled).toBe(true);
      });

      function simulateUntilSecondPurchasePhase(division: Division) {
        const warehouse = division.warehouses[city];

        // Simulate processing phases leading up to the second purchase phase
        for (let i = 0; i < 6; i++) {
          division.process(1, corporation);
          corporation.state.incrementState();
        }

        warehouse.updateMaterialSizeUsed();

        // Process again to simulate purchasing
        expect(corporation.state.nextName).toBe("PURCHASE");
        division.process(1, corporation);
        warehouse.updateMaterialSizeUsed();
      }

      function prepareWarehouseForTest(warehouse: Warehouse, material: string, amount: number) {
        warehouse.materials[material].stored = amount;
        warehouse.updateMaterialSizeUsed();
      }

      it("should buy maximum amount for the Chemical division when storage is empty", () => {
        const warehouse = divisionChem.warehouses[city];
        prepareWarehouseForTest(warehouse, "Plants", 0);
        simulateUntilSecondPurchasePhase(divisionChem);
        expect(warehouse.sizeUsed).toBeGreaterThan(warehouse.size - 1);
      });

      it("should buy maximum amount for the Chemical division when storage has 200 units of Plants", () => {
        const warehouse = divisionChem.warehouses[city];
        prepareWarehouseForTest(warehouse, "Plants", 200);
        simulateUntilSecondPurchasePhase(divisionChem);
        expect(warehouse.sizeUsed).toBeGreaterThan(warehouse.size - 1);
      });

      it("should buy maximum amount for the Chemical division when storage has 200 units of Water", () => {
        const warehouse = divisionChem.warehouses[city];
        prepareWarehouseForTest(warehouse, "Water", 200);
        simulateUntilSecondPurchasePhase(divisionChem);
        expect(warehouse.sizeUsed).toBeGreaterThan(warehouse.size - 1);
      });

      it("should buy maximum amount for the Chemical division when storage has 400 units of Plants", () => {
        const warehouse = divisionChem.warehouses[city];
        prepareWarehouseForTest(warehouse, "Plants", 400);
        simulateUntilSecondPurchasePhase(divisionChem);
        expect(warehouse.sizeUsed).toBeGreaterThan(warehouse.size - 1);
      });

      it("should buy maximum amount for the Chemical division when storage has 400 units of Water", () => {
        const warehouse = divisionChem.warehouses[city];
        prepareWarehouseForTest(warehouse, "Water", 400);
        simulateUntilSecondPurchasePhase(divisionChem);
        expect(warehouse.sizeUsed).toBeGreaterThan(warehouse.size - 1);
      });

      it("should not overbuy when product size is larger than base materials", () => {
        const warehouse = divisionMining.warehouses[city];
        prepareWarehouseForTest(warehouse, "Food", 3334 * 0.95); // Pre-fill with some food
        expect(warehouse.sizeUsed).toBeGreaterThan(95);

        simulateUntilSecondPurchasePhase(divisionMining);

        // Estimate that warehouse is not overly full
        expect(warehouse.sizeUsed).toBeLessThan(96);

        // Simulate production to use up the base material
        corporation.state.incrementState();
        divisionMining.process(1, corporation);

        // Verify that production uses up the warehouse space and base materials
        expect(warehouse.materials["Hardware"].stored).toBeLessThan(0.1);
        expect(warehouse.sizeUsed).toBeCloseTo(100, 1);
      });
    });
  });
});
