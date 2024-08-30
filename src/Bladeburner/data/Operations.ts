import { BladeburnerOperationName } from "@enums";
import { Operation } from "../Actions/Operation";
import { getRandomIntInclusive } from "../../utils/helpers/getRandomIntInclusive";
import { LevelableActionClass } from "../Actions/LevelableAction";
import { assertLoadingType } from "../../utils/TypeAssertion";
import { ActionEffect } from "../Actions/ActionEffect";

export function createOperations(): Record<BladeburnerOperationName, Operation> {
  return {
    [BladeburnerOperationName.Investigation]: new Operation({
      name: BladeburnerOperationName.Investigation,
      desc:
        "As a field agent, investigate and identify Synthoid populations, movements, and operations.\n\n" +
        "Successful Investigation ops will increase the accuracy of your synthoid data.\n\n" +
        "You will NOT lose HP from failed Investigation ops.",
      baseDifficulty: 400,
      difficultyFac: 1.03,
      rewardFac: 1.07,
      rankGain: 2.2,
      rankLoss: 0.2,
      weights: {
        hacking: 0.25,
        strength: 0.05,
        defense: 0.05,
        dexterity: 0.2,
        agility: 0.1,
        charisma: 0.25,
        intelligence: 0.1,
      },
      decays: {
        hacking: 0.85,
        strength: 0.9,
        defense: 0.9,
        dexterity: 0.9,
        agility: 0.9,
        charisma: 0.7,
        intelligence: 0.9,
      },
      isStealth: true,
      growthFunction: () => getRandomIntInclusive(10, 40) / 10,
      maxCount: 100,
      successEffect: new ActionEffect({
        popEstChangePercentage: () => 0.4,
      }),
      failureEffect: new ActionEffect({
        furtherEffect: (bladeburner, __, city) => {
          bladeburner.triggerPotentialMigration(city.name, 0.1);
        },
      }),
    }),
    [BladeburnerOperationName.Undercover]: new Operation({
      name: BladeburnerOperationName.Undercover,
      desc:
        "Conduct undercover operations to identify hidden and underground Synthoid communities and organizations.\n\n" +
        "Successful Undercover ops will increase the accuracy of your synthoid data.",
      baseDifficulty: 500,
      difficultyFac: 1.04,
      rewardFac: 1.09,
      rankGain: 4.4,
      rankLoss: 0.4,
      hpLoss: 2,
      weights: {
        hacking: 0.2,
        strength: 0.05,
        defense: 0.05,
        dexterity: 0.2,
        agility: 0.2,
        charisma: 0.2,
        intelligence: 0.1,
      },
      decays: {
        hacking: 0.8,
        strength: 0.9,
        defense: 0.9,
        dexterity: 0.9,
        agility: 0.9,
        charisma: 0.7,
        intelligence: 0.9,
      },
      isStealth: true,
      growthFunction: () => getRandomIntInclusive(10, 40) / 10,
      maxCount: 100,
      successEffect: new ActionEffect({
        popEstChangePercentage: () => 0.8,
      }),
      failureEffect: new ActionEffect({
        furtherEffect: (bladeburner, action, city) => {
          bladeburner.triggerPotentialMigration(city.name, 0.15);
        },
      }),
    }),
    [BladeburnerOperationName.Sting]: new Operation({
      name: BladeburnerOperationName.Sting,
      desc: "Conduct a sting operation to bait and capture particularly notorious Synthoid criminals.",
      baseDifficulty: 650,
      difficultyFac: 1.04,
      rewardFac: 1.095,
      rankGain: 5.5,
      rankLoss: 0.5,
      hpLoss: 2.5,
      weights: {
        hacking: 0.25,
        strength: 0.05,
        defense: 0.05,
        dexterity: 0.25,
        agility: 0.1,
        charisma: 0.2,
        intelligence: 0.1,
      },
      decays: {
        hacking: 0.8,
        strength: 0.85,
        defense: 0.85,
        dexterity: 0.85,
        agility: 0.85,
        charisma: 0.7,
        intelligence: 0.9,
      },
      isStealth: true,
      growthFunction: () => getRandomIntInclusive(3, 40) / 10,
      successEffect: new ActionEffect({
        popChangePercentage: () => {
          return { percent: -0.1, changeEqually: true, nonZero: true };
        },
      }),
      generalEffect: new ActionEffect({
        chaosAbsoluteChange: () => 0.1,
      }),
    }),
    [BladeburnerOperationName.Raid]: new Operation({
      name: BladeburnerOperationName.Raid,
      desc:
        "Lead an assault on a known Synthoid community. Note that there must be an existing Synthoid community in your " +
        "current city in order for this Operation to be successful.",
      baseDifficulty: 800,
      difficultyFac: 1.045,
      rewardFac: 1.1,
      rankGain: 55,
      rankLoss: 2.5,
      hpLoss: 50,
      weights: {
        hacking: 0.1,
        strength: 0.2,
        defense: 0.2,
        dexterity: 0.2,
        agility: 0.2,
        charisma: 0,
        intelligence: 0.1,
      },
      decays: {
        hacking: 0.7,
        strength: 0.8,
        defense: 0.8,
        dexterity: 0.8,
        agility: 0.8,
        charisma: 0,
        intelligence: 0.9,
      },
      isKill: true,
      growthFunction: () => getRandomIntInclusive(2, 40) / 10,
      getAvailability: function (bladeburner) {
        if (bladeburner.getCurrentCity().comms < 1) return { error: "No Synthoid communities in current city" };
        return LevelableActionClass.prototype.getAvailability.call(this, bladeburner);
      },
      successEffect: new ActionEffect({
        popChangePercentage: () => {
          return { percent: -1, changeEqually: true, nonZero: true };
        },
        furtherEffect: (bladeburner, action, city) => {
          city.comms--;
        },
      }),
      failureEffect: new ActionEffect({
        popChangePercentage: () => {
          return { percent: getRandomIntInclusive(-10, -5) / 10, changeEqually: true, nonZero: true };
        },
      }),
      generalEffect: new ActionEffect({
        chaosPercentageChange: () => getRandomIntInclusive(1, 5),
      }),
    }),
    [BladeburnerOperationName.StealthRetirement]: new Operation({
      name: BladeburnerOperationName.StealthRetirement,
      desc:
        "Lead a covert operation to retire Synthoids. The objective is to complete the task without drawing any " +
        "attention. Stealth and discretion are key.",
      baseDifficulty: 1000,
      difficultyFac: 1.05,
      rewardFac: 1.11,
      rankGain: 22,
      rankLoss: 2,
      hpLoss: 10,
      weights: {
        hacking: 0.1,
        strength: 0.1,
        defense: 0.1,
        dexterity: 0.3,
        agility: 0.3,
        charisma: 0,
        intelligence: 0.1,
      },
      decays: {
        hacking: 0.7,
        strength: 0.8,
        defense: 0.8,
        dexterity: 0.8,
        agility: 0.8,
        charisma: 0,
        intelligence: 0.9,
      },
      isStealth: true,
      isKill: true,
      growthFunction: () => getRandomIntInclusive(1, 20) / 10,
      successEffect: new ActionEffect({
        popChangePercentage: () => {
          return { percent: -0.5, changeEqually: true, nonZero: true };
        },
      }),
      generalEffect: new ActionEffect({
        chaosPercentageChange: () => getRandomIntInclusive(-3, -1),
      }),
    }),
    [BladeburnerOperationName.Assassination]: new Operation({
      name: BladeburnerOperationName.Assassination,
      desc:
        "Assassinate Synthoids that have been identified as important, high-profile social and political leaders in the " +
        "Synthoid communities.",
      baseDifficulty: 1500,
      difficultyFac: 1.06,
      rewardFac: 1.14,
      rankGain: 44,
      rankLoss: 4,
      hpLoss: 5,
      weights: {
        hacking: 0.1,
        strength: 0.1,
        defense: 0.1,
        dexterity: 0.3,
        agility: 0.3,
        charisma: 0,
        intelligence: 0.1,
      },
      decays: {
        hacking: 0.6,
        strength: 0.8,
        defense: 0.8,
        dexterity: 0.8,
        agility: 0.8,
        charisma: 0,
        intelligence: 0.8,
      },
      isStealth: true,
      isKill: true,
      growthFunction: () => getRandomIntInclusive(1, 20) / 10,
      successEffect: new ActionEffect({
        popChangeCount: () => -1,
      }),
      generalEffect: new ActionEffect({
        chaosPercentageChange: () => getRandomIntInclusive(-5, 5),
      }),
    }),
  };
}

export function loadOperationsData(data: unknown, operations: Record<BladeburnerOperationName, Operation>) {
  // loading data as "unknown" and typechecking it down is probably not necessary
  // but this will prevent crashes even with malformed savedata
  if (!data || typeof data !== "object") return;
  assertLoadingType<Record<BladeburnerOperationName, unknown>>(data);
  for (const operationName of Object.values(BladeburnerOperationName)) {
    const loadedOperation = data[operationName];
    if (!(loadedOperation instanceof Operation)) continue;
    operations[operationName].loadData(loadedOperation);
  }
}
