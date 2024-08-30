import { BladeburnerGeneralActionName } from "@enums";
import { GeneralAction } from "../Actions/GeneralAction";
import { BladeburnerConstants } from "./Constants";
import { newWorkStats } from "../../Work/WorkStats";
import { formatBigNumber, formatExp, formatPercent } from "../../ui/formatNumber";
import { ActionEffect, ActionEffectLogParams } from "../Actions/ActionEffect";
import { Person } from "../../PersonObjects/Person";

function getDiplomacyPercentage(person: Person): number {
  // Returns a percentage by which the city's chaos level should be modified (e.g. 2 for 2%)
  const linFactor = 1000;
  const expFactor = 0.045;
  const cha = person.skills.charisma;
  return -Math.pow(cha, expFactor) + cha / linFactor;
}

export const GeneralActions: Record<BladeburnerGeneralActionName, GeneralAction> = {
  [BladeburnerGeneralActionName.Training]: new GeneralAction({
    name: BladeburnerGeneralActionName.Training,
    getActionTime: () => 30,
    generalEffect: new ActionEffect({
      staminaChange: () => 0.5 * BladeburnerConstants.BaseStaminaLoss,
      statChange: () => newWorkStats({ agiExp: 30, defExp: 30, dexExp: 30, strExp: 30 }),
      statChangeExtraMultsMultiply: true, // bug: should be false
      maxStaminaChange: 0.04,
      log: (params: ActionEffectLogParams) =>
        `${params.name}: Training completed. Gained: ${formatExp(params.statChange.strExp)} str exp, ${formatExp(
          params.statChange.defExp,
        )} def exp, ${formatExp(params.statChange.dexExp)} dex exp, ${formatExp(
          params.statChange.agiExp,
        )} agi exp, ${formatBigNumber(params.maxStaminaChange)} max stamina.`,
    }),
    desc:
      "Improve your abilities at the Bladeburner unit's specialized training center. Doing this gives experience for " +
      "all combat stats and also increases your max stamina.",
  }),
  [BladeburnerGeneralActionName.FieldAnalysis]: new GeneralAction({
    name: BladeburnerGeneralActionName.FieldAnalysis,
    getActionTime: () => 30,
    generalEffect: new ActionEffect({
      statChange: () => newWorkStats({ hackExp: 20, chaExp: 20, intExp: BladeburnerConstants.BaseIntGain }),
      statChangeExtraMultsMultiply: true, // bug: should be false
      rankGain: () => 0.1,
      log: (params: ActionEffectLogParams) =>
        `${name}: Field analysis completed. Gained: ${formatBigNumber(params.rankChange)} rank, ${formatExp(
          params.statChange.hackExp,
        )} hacking exp, ${formatExp(params.statChange.chaExp)} charisma exp.`,
    }),
    desc:
      "Mine and analyze Synthoid-related data. This improves the Bladeburner unit's intelligence on Synthoid locations " +
      "and activities. Completing this action will improve the accuracy of your Synthoid population estimated in the " +
      "current city.\n\n" +
      "Does NOT require stamina.",
  }),
  [BladeburnerGeneralActionName.Recruitment]: new GeneralAction({
    name: BladeburnerGeneralActionName.Recruitment,
    getActionTime: function (bladeburner, person) {
      const effCharisma = bladeburner.getEffectiveSkillLevel(person, "charisma");
      const charismaFactor = Math.pow(effCharisma, 0.81) + effCharisma / 90;
      return Math.max(10, Math.round(BladeburnerConstants.BaseRecruitmentTimeNeeded - charismaFactor));
    },
    getSuccessChance: function (bladeburner, person) {
      return Math.pow(person.skills.charisma, 0.45) / (bladeburner.teamSize - bladeburner.sleeveSize + 1);
    },
    successEffect: new ActionEffect({
      teamMemberGain: () => 1,
      statChangeTimeMultiply: true,
      statChange: () => newWorkStats({ chaExp: 2 * BladeburnerConstants.BaseStatGain }),
      popEstChangePercentage: (person) =>
        (0.04 * Math.pow(person.skills.hacking, 0.3) +
          0.04 * Math.pow(person.skills.intelligence, 0.9) +
          0.02 * Math.pow(person.skills.charisma, 0.3)) *
        person.mults.bladeburner_analysis,
      log: (params: ActionEffectLogParams) =>
        `${params.name}: Successfully recruited a team member! Gained ${params.statChange.chaExp} charisma exp.`,
    }),
    failureEffect: new ActionEffect({
      statChangeTimeMultiply: true,
      statChange: () => newWorkStats({ chaExp: BladeburnerConstants.BaseStatGain }),

      log: (params: ActionEffectLogParams) =>
        `${params.name}: Failed to recruit a team member. Gained ${params.statChange.chaExp} charisma exp.`,
    }),

    desc:
      "Attempt to recruit members for your Bladeburner team. These members can help you conduct operations.\n\n" +
      "Does NOT require stamina.",
  }),
  [BladeburnerGeneralActionName.Diplomacy]: new GeneralAction({
    name: BladeburnerGeneralActionName.Diplomacy,
    getActionTime: () => 60,
    generalEffect: new ActionEffect({
      chaosPercentageChange: (person) => getDiplomacyPercentage(person),
      log: (params: ActionEffectLogParams) =>
        `${params.name}: Diplomacy completed. Chaos levels in the current city fell by ${formatPercent(
          -params.chaosPercentChange / 100,
        )}.`,
    }),
    desc:
      "Improve diplomatic relations with the Synthoid population. Completing this action will reduce the Chaos level in " +
      "your current city.\n\n" +
      "Does NOT require stamina.",
  }),
  [BladeburnerGeneralActionName.HyperbolicRegen]: new GeneralAction({
    name: BladeburnerGeneralActionName.HyperbolicRegen,
    getActionTime: () => 60,
    generalEffect: new ActionEffect({
      hpChange: () => BladeburnerConstants.HrcHpGain,
      staminaChange: (maxStamina: number) => maxStamina * (BladeburnerConstants.HrcStaminaGain / 100),
      log: (params: ActionEffectLogParams) => {
        let extraLog = "";
        const effectiveHpGain = Math.min(params.hpChange, params.person!.hp.current - params.previousHealth);
        if (effectiveHpGain > 0) {
          extraLog += ` Restored ${formatBigNumber(effectiveHpGain)} HP. Current HP is ${formatBigNumber(
            params.person!.hp.current,
          )}.`;
        }
        if (params.staminaChange > 0) {
          extraLog += ` Restored ${formatPercent(params.staminaChange)} stamina. Current stamina is ${formatPercent(
            params.stamina,
          )}.`;
        }
        return `${name}: Rested in Hyperbolic Regeneration Chamber.${extraLog}`;
      },
    }),
    desc:
      "Enter cryogenic stasis using the Bladeburner division's hi-tech Regeneration Chamber. This will slowly heal your " +
      "wounds and slightly increase your stamina.",
  }),
  [BladeburnerGeneralActionName.InciteViolence]: new GeneralAction({
    name: BladeburnerGeneralActionName.InciteViolence,
    getActionTime: () => 60,
    generalEffect: new ActionEffect({
      contractCountChange: (contract) =>
        (60 * 3 * contract.growthFunction()) / BladeburnerConstants.ActionCountGrowthPeriod,
      operationCountChange: (operation) =>
        (60 * 3 * operation.growthFunction()) / BladeburnerConstants.ActionCountGrowthPeriod,
      applyChaosToAllCities: true,
      chaosAbsoluteChange: (chaos) => 10 + (chaos + 10) / Math.log10(chaos + 10),
      log: (params: ActionEffectLogParams) => `${params.name}: Incited violence in the synthoid communities.`,
    }),
    desc:
      "Purposefully stir trouble in the synthoid community in order to gain a political edge. This will generate " +
      "additional contracts and operations, at the cost of increased Chaos.",
  }),
};
