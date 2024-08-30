import { Person } from "../../PersonObjects/Person";
import { WorkStats, newWorkStats } from "../../Work/WorkStats";
import { Bladeburner } from "../Bladeburner";
import { City } from "../City";
import { Action } from "../Types";
import { Contract } from "./Contract";
import { Operation } from "./Operation";

export class ActionEffectLogParams {
  name: string = "";
  statChange: WorkStats = newWorkStats();
  maxStaminaChange: number = 0;
  rankChange: number = 0;
  chaosPercentChange: number = 0;
  previousHealth: number = 0;
  stamina: number = 0;
  hpChange: number = 0;
  staminaChange: number = 0;
  action: Action; // passed by constructor
  teamChange: number = 0;
  earnings: number = 0;
  person: Person; // passed by constructor

  constructor(action: Action, person: Person) {
    this.action = action;
    this.person = person;
  }
}

interface PopulationChange {
  percent: number;
  changeEqually: boolean;
  nonZero: boolean;
}
type anyFunction = (...args: any[]) => anyFunction;

export class ActionEffect {
  staminaChange: (maxStamina: number, action: Action, person: Person) => number = () => 0;
  statChange: (action: Action, expMultiplier: number) => WorkStats = () => newWorkStats();
  statChangeExtraMultsMultiply: boolean = false;
  statChangeTimeMultiply: boolean = false;
  maxStaminaChange: number = 0;
  rankGain: (action: Action) => number = () => 0;
  teamMemberGain: (action: Action, sleeveSize: number, teamSize: number) => number = () => 0;
  hpChange: (action: Action) => number = () => 0;
  applyChaosToAllCities: boolean = false;
  chaosPercentageChange: (person: Person) => number = () => 0;
  chaosAbsoluteChange: (chaos: number) => number = () => 0;
  contractCountChange: (contract: Contract) => number = () => 0;
  operationCountChange: (operation: Operation) => number = () => 0;
  popChangePercentage: () => PopulationChange = () => ({ percent: 0, changeEqually: false, nonZero: false });
  popChangeCount: () => number = () => 0;
  popEstChangePercentage: (person: Person) => number = () => 0;
  popEstChangeCount: () => number = () => 0;
  earnings: (action: Action) => number = () => 0;
  furtherEffect: (bladeburner: Bladeburner, action: Action, city: City) => void = () => {};
  log: (params: ActionEffectLogParams) => string = () => "";

  // Constructor with partial ActionEffects
  constructor(params: Partial<ActionEffect> = {}) {
    Object.assign(this, params);
  }

  static autoCombine<T>(val1: T, val2: T): T {
    if (typeof val1 !== typeof val2) {
      throw new Error(`Cannot autoCombine values of different types ${typeof val1} and ${typeof val2}`);
    }
    switch (typeof val1) {
      case "undefined":
        return undefined as T;
      case "number":
        return ((val1 as number) + (val2 as number)) as T;
      case "boolean":
        return ((val1 as boolean) || (val2 as boolean)) as T;
      case "string":
        return [val1, val2].filter((str) => str !== "").join("\n") as T;
      case "function":
        return function (...args: any[]) {
          const r1 = (val1 as anyFunction)(...args);
          const r2 = (val2 as anyFunction)(...args);
          return ActionEffect.autoCombine(r1, r2);
        } as T;
      case "object":
        if (val1 && val2 && !Array.isArray(val1) && !Array.isArray(val2)) {
          const combinedObject: any = {};
          // Iterate over the fields in val1 and val2
          const keys = new Set([...Object.keys(val1 as object), ...Object.keys(val2 as object)]);
          keys.forEach((key) => {
            // Combine each field recursively
            combinedObject[key] = ActionEffect.autoCombine(
              val1[key as keyof typeof val1],
              val2[key as keyof typeof val2],
            );
          });
          return combinedObject as T;
        }
    }
    throw new Error(`Cannot autoCombine values of type ${typeof val1} and ${typeof val2}`);
  }

  static AddEffects(effect1: ActionEffect, effect2: ActionEffect): ActionEffect {
    const combinedEffect: any = {};
    // Dynamically combine fields
    for (const key in effect1) {
      if (Object.prototype.hasOwnProperty.call(effect1, key) && Object.prototype.hasOwnProperty.call(effect2, key)) {
        combinedEffect[key] = ActionEffect.autoCombine(
          effect1[key as keyof ActionEffect],
          effect2[key as keyof ActionEffect],
        );
      }
    }
    // if you need more sophisticated combining, you can do it manually:
    // combinedEffect.chaosPercentageChange = (args: Person) => // your custom implementation
    //  ((effect1.chaosPercentageChange(args) / 100 + 1) * (effect2.chaosPercentageChange(args) / 100 + 1) - 1) * 100;
    return new ActionEffect(combinedEffect);
  }

  static AddEffectsArray(effects: ActionEffect[]): ActionEffect {
    if (effects.length === 0) {
      return new ActionEffect({});
    }
    let res = effects[0];
    for (let i = 1; i < effects.length; ++i) {
      res = ActionEffect.AddEffects(res, effects[i]);
    }
    return res;
  }
}
