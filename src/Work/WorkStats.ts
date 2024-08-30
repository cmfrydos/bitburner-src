import type { MoneySource } from "../utils/MoneySourceTracker";

import { Person } from "../PersonObjects/Person";
import { Player } from "@player";
import { Multipliers } from "../PersonObjects/Multipliers";

export interface WorkStats {
  money: number;
  reputation: number;
  hackExp: number;
  strExp: number;
  defExp: number;
  dexExp: number;
  agiExp: number;
  chaExp: number;
  intExp: number;
}

export const newWorkStats = (params?: Partial<WorkStats>, def = 0): WorkStats => {
  return {
    money: params?.money ?? def,
    reputation: params?.reputation ?? def,
    hackExp: params?.hackExp ?? def,
    strExp: params?.strExp ?? def,
    defExp: params?.defExp ?? def,
    dexExp: params?.dexExp ?? def,
    agiExp: params?.agiExp ?? def,
    chaExp: params?.chaExp ?? def,
    intExp: params?.intExp ?? def,
  };
};

/** Add two workStats objects */
export const sumWorkStats = (w0: WorkStats, w1: WorkStats): WorkStats => {
  return {
    money: w0.money + w1.money,
    reputation: w0.reputation + w1.reputation,
    hackExp: w0.hackExp + w1.hackExp,
    strExp: w0.strExp + w1.strExp,
    defExp: w0.defExp + w1.defExp,
    dexExp: w0.dexExp + w1.dexExp,
    agiExp: w0.agiExp + w1.agiExp,
    chaExp: w0.chaExp + w1.chaExp,
    intExp: w0.intExp + w1.intExp,
  };
};

/** Scale all stats on a WorkStats object by a number. Money scaling optional but defaults to true. */
export const scaleWorkStats = (w: WorkStats, n: number, scaleMoney = true): WorkStats => {
  const m = scaleMoney ? n : 1;
  return {
    money: w.money * m,
    reputation: w.reputation * n,
    hackExp: w.hackExp * n,
    strExp: w.strExp * n,
    defExp: w.defExp * n,
    dexExp: w.dexExp * n,
    agiExp: w.agiExp * n,
    chaExp: w.chaExp * n,
    intExp: w.intExp * n,
  };
};

export const applyWorkStats = (
  target: Person,
  workStats: WorkStats,
  cycles: number,
  source: MoneySource,
): WorkStats => {
  const expStats = applyWorkStatsExp(target, workStats, cycles);
  const gains = {
    money: workStats.money * cycles,
    reputation: 0,
    hackExp: expStats.hackExp,
    strExp: expStats.strExp,
    defExp: expStats.defExp,
    dexExp: expStats.dexExp,
    agiExp: expStats.agiExp,
    chaExp: expStats.chaExp,
    intExp: expStats.intExp,
  };
  Player.gainMoney(gains.money, source);

  return gains;
};

export const applyWorkStatsExp = (target: Person, workStats: WorkStats, mult = 1): WorkStats => {
  const gains = scaleWorkStats(workStats, mult, false);
  gains.money = 0;
  gains.reputation = 0;
  target.gainHackingExp(gains.hackExp);
  target.gainStrengthExp(gains.strExp);
  target.gainDefenseExp(gains.defExp);
  target.gainDexterityExp(gains.dexExp);
  target.gainAgilityExp(gains.agiExp);
  target.gainCharismaExp(gains.chaExp);
  target.gainIntelligenceExp(gains.intExp);
  return gains;
};

export function multToWorkStats(mults: Multipliers, money = 1, rep = 1, int = 0): WorkStats {
  return {
    money: money,
    reputation: rep,
    hackExp: mults.hacking_exp,
    strExp: mults.strength_exp,
    defExp: mults.defense_exp,
    dexExp: mults.dexterity_exp,
    agiExp: mults.agility_exp,
    chaExp: mults.charisma_exp,
    intExp: int,
  };
}

export function multWorkStats(w1: Partial<WorkStats>, w2: Partial<WorkStats>): WorkStats {
  return {
    money: (w1.money ?? 0) * (w2.money ?? 0),
    reputation: (w1.reputation ?? 0) * (w2.reputation ?? 0),
    hackExp: (w1.hackExp ?? 0) * (w2.hackExp ?? 0),
    strExp: (w1.strExp ?? 0) * (w2.strExp ?? 0),
    defExp: (w1.defExp ?? 0) * (w2.defExp ?? 0),
    dexExp: (w1.dexExp ?? 0) * (w2.dexExp ?? 0),
    agiExp: (w1.agiExp ?? 0) * (w2.agiExp ?? 0),
    chaExp: (w1.chaExp ?? 0) * (w2.chaExp ?? 0),
    intExp: (w1.intExp ?? 0) * (w2.intExp ?? 0),
  };
}
