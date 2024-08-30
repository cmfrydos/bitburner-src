import type { Bladeburner } from "../Bladeburner";
import type { Action, ActionIdentifier } from "../Types";
import { Generic_fromJSON, IReviverValue, constructorsForReviver } from "../../utils/JSONReviver";
import { BladeburnerActionType, BladeburnerContractName, BladeburnerMultName } from "../Enums";
import { LevelableActionClass, LevelableActionParams } from "./LevelableAction";
import { ActionEffect, ActionEffectLogParams } from "./ActionEffect";
import { Person } from "../../PersonObjects/Person";
import { PlayerObject } from "../../PersonObjects/Player/PlayerObject";
import { BladeburnerConstants } from "../data/Constants";
import { addOffset } from "../../utils/helpers/addOffset";
import { formatBigNumber, formatHp, formatMoney, formatNumberNoSuffix, formatSleeveShock } from "../../ui/formatNumber";
import { Sleeve } from "../../PersonObjects/Sleeve/Sleeve";
import { multWorkStats, newWorkStats, scaleWorkStats, WorkStats } from "../../Work/WorkStats";
import { SkillsToWorkStats } from "../../PersonObjects/Skills";

export function getActionStatChange(action: Action, multiplier: number = 1): WorkStats {
  const BaseStatGain = newWorkStats({}, BladeburnerConstants.BaseStatGain);
  const StatGain = newWorkStats({ ...BaseStatGain, intExp: BladeburnerConstants.BaseIntGain });
  const weightedGain = multWorkStats(StatGain, SkillsToWorkStats(action.weights));
  return scaleWorkStats(weightedGain, multiplier * action.getEffDifficulty());
}

function getExtraLogAfterTakingDamage(damage: number, currentHp: number, person: Person) {
  const logInfo = () => `${person.whoAmI()} was ${person instanceof PlayerObject ? "hospitalized" : "shocked"}.`;
  const shockInfo = () => (person instanceof Sleeve ? `Current shock is ${formatSleeveShock(person.shock)}. ` : "");
  return currentHp === person.hp.max
    ? `${logInfo()} ${shockInfo()}Current HP is ${formatHp(person.hp.current)}.`
    : ` HP reduced from ${formatHp(currentHp + damage)} to ${formatHp(currentHp)}.`;
}

export const ContractOpsEffect = new ActionEffect({
  staminaChange: (__: number, action: Action, person: Person) =>
    (person instanceof PlayerObject ? action.getEffDifficulty() : 0) * BladeburnerConstants.BaseStaminaLoss,
  furtherEffect: (_, act, __) => (act as LevelableActionClass).count--,
  statChangeTimeMultiply: true,
});

export const ContractOpsSuccessEffect = new ActionEffect({
  statChange: (action: Action, expMult) => getActionStatChange(action, expMult),
  rankGain: (act: Action) => {
    const action = act as LevelableActionClass;
    const rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
    return addOffset(action.rankGain * rewardMultiplier, 10);
  },
});

export const ContractOpsFailEffect = new ActionEffect({
  statChange: (action: Action, expMult) => getActionStatChange(action, 0.5 * expMult),
  rankGain: (act: Action) => {
    const action = act as LevelableActionClass;
    const rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
    return addOffset(action.rankLoss * rewardMultiplier, 10);
  },
  hpChange: (action: Action) => {
    const damage = action.hpLoss * action.getEffDifficulty();
    return -Math.ceil(addOffset(damage, 10));
  },
  furtherEffect: (_, action, __) => (action as LevelableActionClass).failures++,
  log: (params: ActionEffectLogParams) => {
    let logLossText = "";
    if (params.rankChange < 0) {
      logLossText += ` Lost ${formatNumberNoSuffix(-params.rankChange)} rank.`;
    }
    if (params.hpChange < 0) {
      const extraLog = getExtraLogAfterTakingDamage(-params.hpChange, params.previousHealth, params.person!);
      logLossText += ` Took ${formatNumberNoSuffix(-params.hpChange)} damage.${extraLog}`;
    }
    return `${params.name}: ${params.action.name} contract failed!${logLossText}`;
  },
});

const ContractSuccessEffect = new ActionEffect({
  earnings: (act: Action) => {
    const action = act as Contract;
    const rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
    return BladeburnerConstants.ContractBaseMoneyGain * rewardMultiplier;
  },
  log: (params: ActionEffectLogParams) =>
    `${params.name}: ${params.action.name} contract successfully completed! Gained ${formatBigNumber(
      params.rankChange,
    )} rank and ${formatMoney(params.earnings)}.`,

  furtherEffect: (_, act, __) => {
    const action = act as LevelableActionClass;
    action.successes++;
    action.setMaxLevel(BladeburnerConstants.ContractSuccessesPerLevel);
    action.level = action.autoLevel ? action.maxLevel : action.level;
  },
});

export class Contract extends LevelableActionClass {
  type: BladeburnerActionType.Contract = BladeburnerActionType.Contract;
  name: BladeburnerContractName = BladeburnerContractName.Tracking;
  get id(): ActionIdentifier {
    return { type: this.type, name: this.name };
  }

  constructor(params: (LevelableActionParams & { name: BladeburnerContractName }) | null = null) {
    super(params);
    if (params) this.name = params.name;

    this.generalEffect = ActionEffect.AddEffects(new ActionEffect(params?.generalEffect), ContractOpsEffect);
    this.successEffect = ActionEffect.AddEffectsArray([
      new ActionEffect(params?.successEffect),
      ContractOpsSuccessEffect,
      ContractSuccessEffect,
    ]);
    this.failureEffect = ActionEffect.AddEffects(new ActionEffect(params?.failureEffect), ContractOpsFailEffect);
    this.combinedSuccessEffect = ActionEffect.AddEffects(this.generalEffect, this.successEffect);
    this.combinedFailureEffect = ActionEffect.AddEffects(this.generalEffect, this.failureEffect);
  }

  getActionTypeSkillSuccessBonus(inst: Bladeburner): number {
    return inst.getSkillMult(BladeburnerMultName.SuccessChanceContract);
  }

  toJSON(): IReviverValue {
    return this.save("Contract");
  }

  static fromJSON(value: IReviverValue): Contract {
    return Generic_fromJSON(Contract, value.data);
  }
}

constructorsForReviver.Contract = Contract;
