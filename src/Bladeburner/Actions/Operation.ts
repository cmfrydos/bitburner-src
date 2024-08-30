import type { Person } from "../../PersonObjects/Person";
import type { BlackOperation } from "./BlackOperation";
import type { Bladeburner } from "../Bladeburner";
import type { Availability, ActionIdentifier, SuccessChanceParams } from "../Types";
import { BladeburnerActionType, BladeburnerMultName, BladeburnerOperationName } from "@enums";
import { BladeburnerConstants } from "../data/Constants";
import { ActionClass } from "./Action";
import { Generic_fromJSON, IReviverValue, constructorsForReviver } from "../../utils/JSONReviver";
import { LevelableActionClass, LevelableActionParams } from "./LevelableAction";
import { clampInteger } from "../../utils/helpers/clampNumber";
import { ContractOpsEffect, ContractOpsFailEffect, ContractOpsSuccessEffect } from "./Contract";
import { formatBigNumber } from "../../ui/formatNumber";
import { ActionEffect, ActionEffectLogParams } from "./ActionEffect";
import { getRandomIntInclusive } from "../../utils/helpers/getRandomIntInclusive";
import { isSleeveSupportWork } from "../../PersonObjects/Sleeve/Work/SleeveSupportWork";
import { Player } from "@player";
import { Sleeve } from "../../PersonObjects/Sleeve/Sleeve";
import { shuffleArray } from "../../utils/helpers/shuffleArray";

export function GetOpsTeamLoss(
  teamCount: number,
  sleeveSize: number,
  teamSize: number,
  lossFactor: number,
  minimumLoss: number,
) {
  if (teamCount < 1) return 0;
  const teamMaxLoss = Math.ceil(teamSize * lossFactor);
  const losses = getRandomIntInclusive(minimumLoss, teamMaxLoss);
  if (teamSize - losses >= sleeveSize) return losses;
  const nonSleeveTeam = teamSize - sleeveSize;
  const lostSleevesCount = losses - nonSleeveTeam;
  const sleeves = Player.sleeves.filter((x) => isSleeveSupportWork(x.currentWork));
  const lostSleeves = shuffleArray(sleeves).slice(0, lostSleevesCount);
  lostSleeves.forEach((s: Sleeve) => s.takeDamage(s.hp.max)); // deal lethal damage
  return losses - sleeveSize; // this is a known bug, it should be: return nonSleeveTeam
}

const OperationEffect = new ActionEffect({
  log: (params: ActionEffectLogParams) =>
    params.teamChange < 0
      ? `You lost ${formatBigNumber(-params.teamChange)} team members during ${params.action.name}.`
      : "",
});

const OperationSuccessEffect = new ActionEffect({
  teamMemberGain: (action, sleeveSize, teamSize) =>
    -GetOpsTeamLoss((action as Operation).teamCount, sleeveSize, teamSize, 0.5, 0),
  log: (params: ActionEffectLogParams) =>
    `${params.name}: ${params.action.name} successfully completed! Gained ${formatBigNumber(params.rankChange)} rank.`,
  furtherEffect: (_, act, __) => {
    const action = act as LevelableActionClass;
    action.successes++;
    action.setMaxLevel(BladeburnerConstants.OperationSuccessesPerLevel);
    action.level = action.autoLevel ? action.maxLevel : action.level;
  },
});

const OperationFailEffect = new ActionEffect({
  teamMemberGain: (action, sleeveSize, teamSize) =>
    -GetOpsTeamLoss((action as Operation).teamCount, sleeveSize, teamSize, 1, 0),
});

export interface OperationParams extends LevelableActionParams {
  name: BladeburnerOperationName;
  getAvailability?: (bladeburner: Bladeburner) => Availability;
}

export class Operation extends LevelableActionClass {
  type: BladeburnerActionType.Operation = BladeburnerActionType.Operation;
  name = BladeburnerOperationName.Investigation;
  teamCount = 0;
  get id(): ActionIdentifier {
    return { type: this.type, name: this.name };
  }

  constructor(params: OperationParams | null = null) {
    super(params);
    if (!params) return;
    this.name = params.name;
    if (params.getAvailability) this.getAvailability = params.getAvailability;

    this.generalEffect = ActionEffect.AddEffectsArray([
      new ActionEffect(params?.generalEffect),
      ContractOpsEffect,
      OperationEffect,
    ]);
    this.successEffect = ActionEffect.AddEffectsArray([
      new ActionEffect(params?.successEffect),
      ContractOpsSuccessEffect,
      OperationSuccessEffect,
    ]);
    this.failureEffect = ActionEffect.AddEffectsArray([
      new ActionEffect(params?.failureEffect),
      ContractOpsFailEffect,
      OperationFailEffect,
    ]);
    this.combinedSuccessEffect = ActionEffect.AddEffects(this.generalEffect, this.successEffect);
    this.combinedFailureEffect = ActionEffect.AddEffects(this.generalEffect, this.failureEffect);
  }

  // These functions are shared between operations and blackops, so they are defined outside of Operation
  getTeamSuccessBonus = operationTeamSuccessBonus;

  getActionTypeSkillSuccessBonus = operationSkillSuccessBonus;

  getChaosSuccessFactor(inst: Bladeburner /*, params: ISuccessChanceParams*/): number {
    const city = inst.getCurrentCity();
    if (city.chaos > BladeburnerConstants.ChaosThreshold) {
      const diff = 1 + (city.chaos - BladeburnerConstants.ChaosThreshold);
      const mult = Math.pow(diff, 0.5);
      return mult;
    }

    return 1;
  }
  getSuccessChance(inst: Bladeburner, person: Person, params: SuccessChanceParams) {
    if (this.name === BladeburnerOperationName.Raid && inst.getCurrentCity().comms <= 0) {
      return 0;
    }
    return ActionClass.prototype.getSuccessChance.call(this, inst, person, params);
  }

  reset() {
    LevelableActionClass.prototype.reset.call(this);
    this.teamCount = 0;
  }

  toJSON(): IReviverValue {
    return this.save("Operation", "teamCount");
  }

  loadData(loadedObject: Operation): void {
    this.teamCount = clampInteger(loadedObject.teamCount, 0);
    LevelableActionClass.prototype.loadData.call(this, loadedObject);
  }

  static fromJSON(value: IReviverValue): Operation {
    return Generic_fromJSON(Operation, value.data);
  }
}

constructorsForReviver.Operation = Operation;

// shared member functions for Operation and BlackOperation
export const operationSkillSuccessBonus = (inst: Bladeburner) => {
  return inst.getSkillMult(BladeburnerMultName.SuccessChanceOperation);
};

export function operationTeamSuccessBonus(this: Operation | BlackOperation, inst: Bladeburner) {
  if (this.teamCount && this.teamCount > 0) {
    this.teamCount = Math.min(this.teamCount, inst.teamSize);
    const teamMultiplier = Math.pow(this.teamCount, 0.05);
    return teamMultiplier;
  }

  return 1;
}
