import type { PromisePair } from "../Types/Promises";
import { BlackOperation, Contract, GeneralAction, Operation } from "./Actions";
import type { ActionIdentifier, Action, Attempt } from "./Types";
import type { Person } from "../PersonObjects/Person";
import { type Skills as PersonSkills } from "../PersonObjects/Skills";
import {
  AugmentationName,
  BladeburnerActionType,
  BladeburnerContractName,
  BladeburnerMultName,
  BladeburnerOperationName,
  BladeburnerSkillName,
  CityName,
  FactionName,
} from "@enums";
import { getKeyList } from "../utils/helpers/getKeyList";
import { constructorsForReviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { formatNumberNoSuffix } from "../ui/formatNumber";
import { Skills } from "./data/Skills";
import { City } from "./City";
import { Player } from "@player";
import { Router } from "../ui/GameRoot";
import { Page } from "../ui/Router";
import { ConsoleHelpText } from "./data/Help";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { getRandomIntInclusive } from "../utils/helpers/getRandomIntInclusive";
import { BladeburnerConstants } from "./data/Constants";
import { formatBigNumber } from "../ui/formatNumber";
import { currentNodeMults } from "../BitNode/BitNodeMultipliers";
import { Factions } from "../Faction/Factions";
import { calculateHospitalizationCost } from "../Hospital/Hospital";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Settings } from "../Settings/Settings";
import { formatTime } from "../utils/helpers/formatTime";
import { joinFaction } from "../Faction/FactionHelpers";
import { isSleeveInfiltrateWork } from "../PersonObjects/Sleeve/Work/SleeveInfiltrateWork";
import { WorkStats, multToWorkStats, multWorkStats, scaleWorkStats } from "../Work/WorkStats";
import { getEnumHelper } from "../utils/EnumHelper";
import { PartialRecord, createEnumKeyedRecord, getRecordEntries } from "../Types/Record";
import { createContracts, loadContractsData } from "./data/Contracts";
import { createOperations, loadOperationsData } from "./data/Operations";
import { clampInteger, clampNumber } from "../utils/helpers/clampNumber";
import { parseCommand } from "../Terminal/Parser";
import { BlackOperations } from "./data/BlackOperations";
import { GeneralActions } from "./data/GeneralActions";
import { PlayerObject } from "../PersonObjects/Player/PlayerObject";
import { Sleeve } from "../PersonObjects/Sleeve/Sleeve";
import { applySleeveGains } from "../PersonObjects/Sleeve/Work/Work";

export const BladeburnerPromise: PromisePair<number> = { promise: null, resolve: null };

export class Bladeburner {
  numHosp = 0;
  moneyLost = 0;
  rank = 0;
  maxRank = 0;

  skillPoints = 0;
  totalSkillPoints = 0;

  teamSize = 0;
  sleeveSize = 0;
  teamLost = 0;

  storedCycles = 0;

  randomEventCounter: number = getRandomIntInclusive(240, 600);

  actionTimeToComplete = 0;
  actionTimeCurrent = 0;
  actionTimeOverflow = 0;

  action: ActionIdentifier | null = null;

  cities = createEnumKeyedRecord(CityName, (name) => new City(name));
  city = CityName.Sector12;
  // Todo: better types for all these Record<string, etc> types. Will need custom types or enums for the named string categories (e.g. skills).
  skills: PartialRecord<BladeburnerSkillName, number> = {};
  skillMultipliers: PartialRecord<BladeburnerMultName, number> = {};
  staminaBonus = 0;
  maxStamina = 1;
  stamina = 1;
  // Contracts and operations are stored on the Bladeburner object even though they are global so that they can utilize save/load of the main bladeburner object
  contracts: Record<BladeburnerContractName, Contract>;
  operations: Record<BladeburnerOperationName, Operation>;
  numBlackOpsComplete = 0;
  logging = {
    general: true,
    contracts: true,
    ops: true,
    blackops: true,
    events: true,
  };
  automateEnabled = false;
  automateActionHigh: ActionIdentifier | null = null;
  automateThreshHigh = 0;
  automateActionLow: ActionIdentifier | null = null;
  automateThreshLow = 0;
  consoleHistory: string[] = [];
  consoleLogs: string[] = ["Bladeburner Console", "Type 'help' to see console commands"];

  constructor() {
    this.contracts = createContracts();
    this.operations = createOperations();
  }

  // Initialization code that is dependent on Player is here instead of in the constructor
  init() {
    this.calculateMaxStamina();
    this.stamina = this.maxStamina;
  }

  getCurrentCity(): City {
    return this.cities[this.city];
  }

  calculateStaminaPenalty(): number {
    return Math.min(1, this.stamina / (0.5 * this.maxStamina));
  }

  /** This function is for the player. Sleeves use their own functions to perform blade work.
   * Note that this function does not ensure the action is valid, that should be checked before starting */
  startAction(actionId: ActionIdentifier | null): Attempt<{ message: string }> {
    if (!actionId) {
      this.resetAction();
      return { success: true, message: "Stopped current Bladeburner action" };
    }
    if (!Player.hasAugmentation(AugmentationName.BladesSimulacrum, true)) Player.finishWork(true);
    const action = this.getActionObject(actionId);
    // This switch statement is just for handling error cases, it does not have to be exhaustive
    const availability = action.getAvailability(this);
    if (!availability.available) {
      return { message: `Could not start action ${action.name}: ${availability.error}` };
    }
    this.action = actionId;
    this.actionTimeCurrent = 0;
    this.actionTimeToComplete = action.getActionTotalSeconds(this, Player);
    return { success: true, message: `Started action ${action.name}` };
  }

  /** Directly sets a skill level, with no validation */
  setSkillLevel(skillName: BladeburnerSkillName, value: number) {
    this.skills[skillName] = clampInteger(value, 0, Number.MAX_VALUE);
    this.updateSkillMultipliers();
  }

  /** Attempts to perform a skill upgrade, gives a message on both success and failure */
  upgradeSkill(skillName: BladeburnerSkillName, count = 1): Attempt<{ message: string }> {
    const currentSkillLevel = this.skills[skillName] ?? 0;
    const actualCount = currentSkillLevel + count - currentSkillLevel;
    if (actualCount === 0) {
      return {
        message: `Cannot upgrade ${skillName}: Due to floating-point inaccuracy and the small value of specified "count", your skill cannot be upgraded.`,
      };
    }
    const availability = Skills[skillName].canUpgrade(this, actualCount);
    if (!availability.available) {
      return { message: `Cannot upgrade ${skillName}: ${availability.error}` };
    }
    this.skillPoints -= availability.cost;
    this.setSkillLevel(skillName, currentSkillLevel + actualCount);
    return {
      success: true,
      message: `Upgraded skill ${skillName} by ${actualCount} level${actualCount > 1 ? "s" : ""}`,
    };
  }

  executeConsoleCommands(commands: string): void {
    try {
      // Console History
      if (this.consoleHistory[this.consoleHistory.length - 1] != commands) {
        this.consoleHistory.push(commands);
        if (this.consoleHistory.length > 50) {
          this.consoleHistory.splice(0, 1);
        }
      }

      const arrayOfCommands = commands.split(";");
      for (let i = 0; i < arrayOfCommands.length; ++i) {
        this.executeConsoleCommand(arrayOfCommands[i]);
      }
    } catch (e: unknown) {
      exceptionAlert(e);
    }
  }

  postToConsole(input: string, saveToLogs = true): void {
    const MaxConsoleEntries = 100;
    if (saveToLogs) {
      this.consoleLogs.push(input);
      if (this.consoleLogs.length > MaxConsoleEntries) {
        this.consoleLogs.shift();
      }
    }
  }

  log(input: string): void {
    // Adds a timestamp and then just calls postToConsole
    this.postToConsole(
      `[${formatTime(Settings.TimestampsFormat !== "" ? Settings.TimestampsFormat : "yyyy-MM-dd HH:mm:ss")}] ${input}`,
    );
  }

  resetAction(): void {
    this.action = null;
    this.actionTimeCurrent = 0;
    this.actionTimeToComplete = 0;
  }

  clearConsole(): void {
    this.consoleLogs.length = 0;
  }

  prestigeAugmentation(): void {
    this.resetAction();
    // Attempt to join the faction, this will silently fail if we have insufficient rank
    this.joinFaction();
  }

  joinFaction(): Attempt<{ message: string }> {
    const faction = Factions[FactionName.Bladeburners];
    if (faction.isMember) return { success: true, message: `Already a member of ${FactionName.Bladeburners} faction` };
    if (this.rank >= BladeburnerConstants.RankNeededForFaction) {
      joinFaction(faction);
      return { success: true, message: `Joined ${FactionName.Bladeburners} faction` };
    }
    return { message: `Insufficient rank (${this.rank} / ${BladeburnerConstants.RankNeededForFaction})` };
  }

  storeCycles(numCycles = 0): void {
    this.storedCycles = clampInteger(this.storedCycles + numCycles, 0);
  }

  executeStartConsoleCommand(args: string[]): void {
    if (args.length !== 3) {
      this.postToConsole("Invalid usage of 'start' console command: start [type] [name]");
      this.postToConsole("Use 'help start' for more info");
      return;
    }
    const type = args[1];
    const name = args[2];
    const action = this.getActionFromTypeAndName(type, name);
    if (!action) {
      this.postToConsole(`Invalid action type / name specified: type: ${type}, name: ${name}`);
      return;
    }
    const attempt = this.startAction(action.id);
    this.postToConsole(attempt.message);
  }

  getSkillMultsDisplay(): string[] {
    const display: string[] = [];
    for (const [multName, mult] of getRecordEntries(this.skillMultipliers)) {
      display.push(`${multName}: x${formatBigNumber(mult)}`);
    }
    return display;
  }

  executeSkillConsoleCommand(args: string[]): void {
    switch (args.length) {
      case 1: {
        // Display Skill Help Command
        this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
        this.postToConsole("Use 'help skill' for more info");
        break;
      }
      case 2: {
        if (args[1].toLowerCase() === "list") {
          // List all skills and their level
          this.postToConsole("Skills: ");
          for (const skill of Object.values(Skills)) {
            const skillLevel = this.getSkillLevel(skill.name);
            this.postToConsole(`${skill.name}: Level ${formatNumberNoSuffix(skillLevel, 0)}\n\nEffects: `);
          }
          for (const logEntry of this.getSkillMultsDisplay()) this.postToConsole(logEntry);
        } else {
          this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
          this.postToConsole("Use 'help skill' for more info");
        }
        break;
      }
      case 3: {
        const skillName = args[2];
        if (!getEnumHelper("BladeburnerSkillName").isMember(skillName)) {
          this.postToConsole("Invalid skill name (Note that it is case-sensitive): " + skillName);
          return;
        }
        const level = this.getSkillLevel(skillName);
        if (args[1].toLowerCase() === "list") {
          this.postToConsole(skillName + ": Level " + formatNumberNoSuffix(level));
        } else if (args[1].toLowerCase() === "level") {
          const attempt = this.upgradeSkill(skillName);
          this.postToConsole(attempt.message);
        } else {
          this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
          this.postToConsole("Use 'help skill' for more info");
        }
        break;
      }
      default: {
        this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
        this.postToConsole("Use 'help skill' for more info");
        break;
      }
    }
  }

  executeLogConsoleCommand(args: string[]): void {
    if (args.length < 3) {
      this.postToConsole("Invalid usage of log command: log [enable/disable] [action/event]");
      this.postToConsole("Use 'help log' for more details and examples");
      return;
    }

    let flag = true;
    if (args[1].toLowerCase().includes("d")) {
      flag = false;
    } // d for disable

    switch (args[2].toLowerCase()) {
      case "general":
      case "gen":
        this.logging.general = flag;
        this.log("Logging " + (flag ? "enabled" : "disabled") + " for general actions");
        break;
      case "contract":
      case "contracts":
        this.logging.contracts = flag;
        this.log("Logging " + (flag ? "enabled" : "disabled") + " for Contracts");
        break;
      case "ops":
      case "op":
      case "operations":
      case "operation":
        this.logging.ops = flag;
        this.log("Logging " + (flag ? "enabled" : "disabled") + " for Operations");
        break;
      case "blackops":
      case "blackop":
      case "black operations":
      case "black operation":
        this.logging.blackops = flag;
        this.log("Logging " + (flag ? "enabled" : "disabled") + " for BlackOps");
        break;
      case "event":
      case "events":
        this.logging.events = flag;
        this.log("Logging " + (flag ? "enabled" : "disabled") + " for events");
        break;
      case "all":
        this.logging.general = flag;
        this.logging.contracts = flag;
        this.logging.ops = flag;
        this.logging.blackops = flag;
        this.logging.events = flag;
        this.log("Logging " + (flag ? "enabled" : "disabled") + " for everything");
        break;
      default:
        this.postToConsole("Invalid action/event type specified: " + args[2]);
        this.postToConsole(
          "Examples of valid action/event identifiers are: [general, contracts, ops, blackops, events]",
        );
        break;
    }
  }

  executeHelpConsoleCommand(args: string[]): void {
    if (args.length === 1) {
      for (const line of ConsoleHelpText.helpList) {
        this.postToConsole(line);
      }
    } else {
      for (let i = 1; i < args.length; ++i) {
        if (!(args[i] in ConsoleHelpText)) continue;
        const helpText = ConsoleHelpText[args[i]];
        for (const line of helpText) {
          this.postToConsole(line);
        }
      }
    }
  }

  executeAutomateConsoleCommand(args: string[]): void {
    if (args.length !== 2 && args.length !== 4) {
      this.postToConsole(
        "Invalid use of 'automate' command: automate [var] [val] [hi/low]. Use 'help automate' for more info",
      );
      return;
    }

    // Enable/Disable
    if (args.length === 2) {
      const flag = args[1];
      if (flag.toLowerCase() === "status") {
        this.postToConsole("Automation: " + (this.automateEnabled ? "enabled" : "disabled"));
        this.postToConsole(
          "When your stamina drops to " +
            formatNumberNoSuffix(this.automateThreshLow, 0) +
            ", you will automatically switch to " +
            (this.automateActionLow?.name ?? "Idle") +
            ". When your stamina recovers to " +
            formatNumberNoSuffix(this.automateThreshHigh, 0) +
            ", you will automatically " +
            "switch to " +
            (this.automateActionHigh?.name ?? "Idle") +
            ".",
        );
      } else if (flag.toLowerCase().includes("en")) {
        if (!this.automateActionLow || !this.automateActionHigh) {
          return this.log("Failed to enable automation. Actions were not set");
        }
        this.automateEnabled = true;
        this.log("Bladeburner automation enabled");
      } else if (flag.toLowerCase().includes("d")) {
        this.automateEnabled = false;
        this.log("Bladeburner automation disabled");
      } else {
        this.log("Invalid argument for 'automate' console command: " + args[1]);
      }
      return;
    }

    // Set variables
    if (args.length === 4) {
      const type = args[1].toLowerCase(); // allows Action Type to be with or without capitalization.
      const name = args[2];

      let highLow = false; // True for high, false for low
      if (args[3].toLowerCase().includes("hi")) {
        highLow = true;
      }

      let actionId: ActionIdentifier;
      switch (type) {
        case "stamina":
          // For stamina, the "name" variable is actually the stamina threshold
          if (isNaN(parseFloat(name))) {
            this.postToConsole("Invalid value specified for stamina threshold (must be numeric): " + name);
          } else {
            if (highLow) {
              this.automateThreshHigh = Number(name);
            } else {
              this.automateThreshLow = Number(name);
            }
            this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") stamina threshold set to " + name);
          }
          return;
        case "general":
        case "gen": {
          if (!getEnumHelper("BladeburnerGeneralActionName").isMember(name)) {
            this.postToConsole("Invalid General Action name specified: " + name);
            return;
          }
          actionId = { type: BladeburnerActionType.General, name };
          break;
        }
        case "contract":
        case "contracts": {
          if (!getEnumHelper("BladeburnerContractName").isMember(name)) {
            this.postToConsole("Invalid Contract name specified: " + name);
            return;
          }
          actionId = { type: BladeburnerActionType.Contract, name };
          break;
        }
        case "ops":
        case "op":
        case "operations":
        case "operation":
          if (!getEnumHelper("BladeburnerOperationName").isMember(name)) {
            this.postToConsole("Invalid Operation name specified: " + name);
            return;
          }
          actionId = { type: BladeburnerActionType.Operation, name };
          break;
        default:
          this.postToConsole("Invalid use of automate command.");
          return;
      }
      if (highLow) {
        this.automateActionHigh = actionId;
      } else {
        this.automateActionLow = actionId;
      }
      this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + name);

      return;
    }
  }

  executeConsoleCommand(command: string): void {
    command = command.trim();
    command = command.replace(/\s\s+/g, " "); // Replace all whitespace w/ a single space

    const args = parseCommand(command).map(String);
    if (args.length <= 0) return; // Log an error?

    switch (args[0].toLowerCase()) {
      case "automate":
        this.executeAutomateConsoleCommand(args);
        break;
      case "clear":
      case "cls":
        this.clearConsole();
        break;
      case "help":
        this.executeHelpConsoleCommand(args);
        break;
      case "log":
        this.executeLogConsoleCommand(args);
        break;
      case "skill":
        this.executeSkillConsoleCommand(args);
        break;
      case "start":
        this.executeStartConsoleCommand(args);
        break;
      case "stop":
        this.resetAction();
        break;
      default:
        this.postToConsole("Invalid console command");
        break;
    }
  }

  triggerMigration(sourceCityName: CityName): void {
    const cityHelper = getEnumHelper("CityName");
    let destCityName = cityHelper.random();
    while (destCityName === sourceCityName) destCityName = cityHelper.random();

    const destCity = this.cities[destCityName];
    const sourceCity = this.cities[sourceCityName];

    const rand = Math.random();
    let percentage = getRandomIntInclusive(3, 15) / 100;

    if (rand < 0.05 && sourceCity.comms > 0) {
      // 5% chance for community migration
      percentage *= getRandomIntInclusive(2, 4); // Migration increases population change
      --sourceCity.comms;
      ++destCity.comms;
    }
    const count = Math.round(sourceCity.pop * percentage);
    sourceCity.pop -= count;
    destCity.pop += count;
    if (destCity.pop < BladeburnerConstants.PopGrowthCeiling) {
      destCity.pop += BladeburnerConstants.BasePopGrowth;
    }
  }

  triggerPotentialMigration(sourceCityName: CityName, chance: number): void {
    if (chance == null || isNaN(chance)) {
      console.error("Invalid 'chance' parameter passed into Bladeburner.triggerPotentialMigration()");
    }
    if (chance > 1) {
      chance /= 100;
    }
    if (Math.random() < chance) {
      this.triggerMigration(sourceCityName);
    }
  }

  randomEvent(): void {
    const chance = Math.random();
    const cityHelper = getEnumHelper("CityName");

    // Choose random source/destination city for events
    const sourceCityName = cityHelper.random();
    const sourceCity = this.cities[sourceCityName];

    let destCityName = cityHelper.random();
    while (destCityName === sourceCityName) destCityName = cityHelper.random();
    const destCity = this.cities[destCityName];

    if (chance <= 0.05) {
      // New Synthoid Community, 5%
      ++sourceCity.comms;
      const percentage = getRandomIntInclusive(10, 20) / 100;
      const count = Math.round(sourceCity.pop * percentage);
      sourceCity.pop += count;
      if (sourceCity.pop < BladeburnerConstants.PopGrowthCeiling) {
        sourceCity.pop += BladeburnerConstants.BasePopGrowth;
      }
      if (this.logging.events) {
        this.log("Intelligence indicates that a new Synthoid community was formed in a city");
      }
    } else if (chance <= 0.1) {
      // Synthoid Community Migration, 5%
      if (sourceCity.comms <= 0) {
        // If no comms in source city, then instead trigger a new Synthoid community event
        ++sourceCity.comms;
        const percentage = getRandomIntInclusive(10, 20) / 100;
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (sourceCity.pop < BladeburnerConstants.PopGrowthCeiling) {
          sourceCity.pop += BladeburnerConstants.BasePopGrowth;
        }
        if (this.logging.events) {
          this.log("Intelligence indicates that a new Synthoid community was formed in a city");
        }
      } else {
        --sourceCity.comms;
        ++destCity.comms;

        // Change pop
        const percentage = getRandomIntInclusive(10, 20) / 100;
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop -= count;
        destCity.pop += count;
        if (destCity.pop < BladeburnerConstants.PopGrowthCeiling) {
          destCity.pop += BladeburnerConstants.BasePopGrowth;
        }
        if (this.logging.events) {
          this.log(
            "Intelligence indicates that a Synthoid community migrated from " + sourceCityName + " to some other city",
          );
        }
      }
    } else if (chance <= 0.3) {
      // New Synthoids (non community), 20%
      const percentage = getRandomIntInclusive(8, 24) / 100;
      const count = Math.round(sourceCity.pop * percentage);
      sourceCity.pop += count;
      if (sourceCity.pop < BladeburnerConstants.PopGrowthCeiling) {
        sourceCity.pop += BladeburnerConstants.BasePopGrowth;
      }
      if (this.logging.events) {
        this.log(
          "Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly",
        );
      }
    } else if (chance <= 0.5) {
      // Synthoid migration (non community) 20%
      this.triggerMigration(sourceCityName);
      if (this.logging.events) {
        this.log(
          "Intelligence indicates that a large number of Synthoids migrated from " +
            sourceCityName +
            " to some other city",
        );
      }
    } else if (chance <= 0.7) {
      // Synthoid Riots (+chaos), 20%
      sourceCity.changeChaosByCount(1);
      sourceCity.changeChaosByPercentage(getRandomIntInclusive(5, 20));
      if (this.logging.events) {
        this.log("Tensions between Synthoids and humans lead to riots in " + sourceCityName + "! Chaos increased");
      }
    } else if (chance <= 0.9) {
      // Less Synthoids, 20%
      const percentage = getRandomIntInclusive(8, 20) / 100;
      const count = Math.round(sourceCity.pop * percentage);
      sourceCity.pop -= count;
      if (this.logging.events) {
        this.log(
          "Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly",
        );
      }
    }
    // 10% chance of nothing happening
  }

  getRecruitmentSuccessChance(person: Person): number {
    return Math.pow(person.skills.charisma, 0.45) / (this.teamSize - this.sleeveSize + 1);
  }

  sleeveSupport(joining: boolean): void {
    if (joining) {
      this.sleeveSize += 1;
      this.teamSize += 1;
    } else {
      this.sleeveSize -= 1;
      this.teamSize -= 1;
    }
  }

  getSkillMult(name: BladeburnerMultName): number {
    return this.skillMultipliers[name] ?? 1;
  }

  getEffectiveSkillLevel(person: Person, name: keyof PersonSkills): number {
    switch (name) {
      case "strength":
        return person.skills.strength * this.getSkillMult(BladeburnerMultName.EffStr);
      case "defense":
        return person.skills.defense * this.getSkillMult(BladeburnerMultName.EffDef);
      case "dexterity":
        return person.skills.dexterity * this.getSkillMult(BladeburnerMultName.EffDex);
      case "agility":
        return person.skills.agility * this.getSkillMult(BladeburnerMultName.EffAgi);
      case "charisma":
        return person.skills.charisma * this.getSkillMult(BladeburnerMultName.EffCha);
      default:
        return person.skills[name];
    }
  }

  updateSkillMultipliers(): void {
    this.skillMultipliers = {};
    for (const skill of Object.values(Skills)) {
      const level = this.getSkillLevel(skill.name);
      if (!level) continue;
      for (const [name, baseMult] of getRecordEntries(skill.mults)) {
        const mult = 1 + (baseMult * level) / 100;
        this.skillMultipliers[name] = clampNumber(this.getSkillMult(name) * mult, 0);
      }
    }
  }

  completeAction(person: Person, actionIdent: ActionIdentifier) {
    const loggingConstants = {
      General: this.logging.general,
      "Black Operations": this.logging.blackops,
      Operations: this.logging.ops,
      Contracts: this.logging.contracts,
    };

    const action = this.getActionObject(actionIdent);
    try {
      const success = action.attempt(this, person);
      const effect = success ? action.combinedSuccessEffect : action.combinedFailureEffect;

      // Money gain
      const earnings = effect.earnings(action) * this.getSkillMult(BladeburnerMultName.Money);
      Player.gainMoney(earnings, person instanceof PlayerObject ? "bladeburner" : "sleeves");
      // Stamina change
      const previousStamina = this.stamina;
      this.stamina = clampNumber(
        0,
        this.stamina + effect.staminaChange(this.maxStamina, action, person),
        this.maxStamina,
      );
      // Stats change
      let statChange = effect.statChange(action, this.getSkillMult(BladeburnerMultName.ExpGain));
      // this if shouldn't exist, since it is a bug #1607 (duplicate application of exp mults)
      if (effect.statChangeExtraMultsMultiply) {
        statChange = multWorkStats(statChange, multToWorkStats(person.mults));
      }
      if (effect.statChangeTimeMultiply) {
        let actionTotalSeconds = action.getActionTotalSeconds(this, person);
        // This line shouldn't exist, since it reintroduced bug #295 again
        actionTotalSeconds *= 1000;
        statChange = scaleWorkStats(statChange, actionTotalSeconds);
      }
      const personStatChange = (stat: WorkStats) =>
        person instanceof PlayerObject
          ? multWorkStats(stat, multToWorkStats(Player.mults)) // player apply exp mults
          : scaleWorkStats(stat, (person as Sleeve).shockBonus()); // sleeve apply shock mult
      const gainStats = (stat: WorkStats) =>
        person instanceof PlayerObject ? person.gainStats(stat) : applySleeveGains(person as Sleeve, stat); // note: this actually applies some stat gains to ALL Sleeves + the Player

      const oldStatChange = statChange;
      statChange = personStatChange(statChange);
      gainStats(statChange);
      // this line shouldn't exist, since it is a bug #1607 (Logging part)
      statChange = oldStatChange;

      // Max Stamina change
      let maxStaminaChange = effect.maxStaminaChange;
      //this line shouldn't exist #1607 (Multiple application of stamina mults), look into getEffectiveMaxStaminaTrainingBonus
      maxStaminaChange *= this.getSkillMult(BladeburnerMultName.Stamina);
      this.staminaBonus += maxStaminaChange;

      let maxStaminaChangeLog = this.getEffectiveMaxStaminaTrainingBonus(maxStaminaChange);
      maxStaminaChangeLog = maxStaminaChange; // this line shouldn't exist, since it is a bug #1607 (Logging part)

      // Rank change, also changes Skill Points and Faction Reputation
      let rankChange = effect.rankGain(action);
      if (rankChange > 0) {
        rankChange *= currentNodeMults.BladeburnerRank;
      }
      this.changeRank(person, rankChange);
      // Team size change
      const teamChange = effect.teamMemberGain(action, this.sleeveSize, this.teamSize);
      this.teamSize += teamChange;
      if (teamChange < 0) {
        this.teamLost -= teamChange;
      }
      // Chaos change
      let chaosPercentChange = 0; // used for logging
      const cities = effect.applyChaosToAllCities ? Object.values(this.cities) : [this.getCurrentCity()];
      for (const city of cities) {
        chaosPercentChange = effect.chaosPercentageChange(person);
        city.changeChaosByPercentage(chaosPercentChange);
        city.changeChaosByCount(effect.chaosAbsoluteChange(city.chaos));
      }
      // Health change
      const previousHealth = person.hp.current;
      const healthChange = effect.hpChange(action);
      if (healthChange < 0) {
        const cost = calculateHospitalizationCost(-healthChange);
        if (person.takeDamage(-healthChange)) {
          ++this.numHosp;
          this.moneyLost += cost;
        }
      } else {
        person.regenerateHp(healthChange);
      }
      // Contract and Operation count change
      for (const contract of Object.values(this.contracts)) {
        contract.count += effect.contractCountChange(contract);
      }
      for (const operation of Object.values(this.operations)) {
        operation.count += effect.operationCountChange(operation);
      }
      // Population absolute change
      const absPopChange = effect.popChangeCount();
      const relPopChange = effect.popChangePercentage();
      const city = this.getCurrentCity();
      city.changePopulationByCount(absPopChange, { estChange: absPopChange, estOffset: 0 });
      city.changePopulationByPercentage(relPopChange.percent, {
        changeEstEqually: relPopChange.changeEqually,
        nonZero: relPopChange.nonZero,
      });

      // Population Estimate change
      const abs = effect.popEstChangeCount() * this.getSkillMult(BladeburnerMultName.SuccessChanceEstimate);
      const pct = effect.popEstChangePercentage(person) * this.getSkillMult(BladeburnerMultName.SuccessChanceEstimate);
      if (isNaN(pct) || pct < 0) {
        throw new Error("Population change calculated to be NaN or negative");
      }
      this.getCurrentCity().improvePopulationEstimateByCount(abs);
      this.getCurrentCity().improvePopulationEstimateByPercentage(pct);

      // Any other effects, like leveling up contracts/operations, counting BlackOps, or trigger migration
      effect.furtherEffect(this, action, this.getCurrentCity());
      // Logging
      const logging = loggingConstants[action.type];
      if (logging) {
        const log = effect.log({
          name: person.whoAmI(),
          statChange: statChange,
          staminaChange: this.stamina - previousStamina,
          rankChange: rankChange,
          chaosPercentChange: chaosPercentChange,
          previousHealth: previousHealth,
          stamina: this.stamina,
          hpChange: healthChange,
          maxStaminaChange: maxStaminaChangeLog,
          action: action,
          teamChange: teamChange,
          earnings: earnings,
          person: person,
        });
        if (log != "") {
          this.log(log);
        }
      }
      //this.resetAction(); // this was previously only needed for blackops
    } catch (e: unknown) {
      exceptionAlert(e);
    }
  }

  infiltrateSynthoidCommunities(): void {
    const infilSleeves = Player.sleeves.filter((s) => isSleeveInfiltrateWork(s.currentWork)).length;
    const amt = Math.pow(infilSleeves, -0.5) / 2;
    for (const contract of Object.values(BladeburnerContractName)) {
      this.contracts[contract].count += amt;
    }
    for (const operation of Object.values(BladeburnerOperationName)) {
      this.operations[operation].count += amt;
    }
    if (this.logging.general) {
      this.log(`Sleeve: Infiltrate the synthoid communities.`);
    }
  }

  changeRank(person: Person, change: number): void {
    if (isNaN(change)) {
      throw new Error("NaN passed into Bladeburner.changeRank()");
    }
    this.rank += change;
    if (this.rank < 0) {
      this.rank = 0;
    }
    this.maxRank = Math.max(this.rank, this.maxRank);

    const bladeburnersFactionName = FactionName.Bladeburners;
    const bladeburnerFac = Factions[bladeburnersFactionName];
    if (bladeburnerFac.isMember) {
      const favorBonus = 1 + bladeburnerFac.favor / 100;
      bladeburnerFac.playerReputation +=
        BladeburnerConstants.RankToFactionRepFactor * change * person.mults.faction_rep * favorBonus;
    }

    // Gain skill points
    const rankNeededForSp = (this.totalSkillPoints + 1) * BladeburnerConstants.RanksPerSkillPoint;
    if (this.maxRank >= rankNeededForSp) {
      // Calculate how many skill points to gain
      const gainedSkillPoints = Math.floor(
        (this.maxRank - rankNeededForSp) / BladeburnerConstants.RanksPerSkillPoint + 1,
      );
      this.skillPoints += gainedSkillPoints;
      this.totalSkillPoints += gainedSkillPoints;
    }
  }

  processAction(seconds: number): void {
    // Store action to avoid losing reference to it is action is reset during this function
    if (!this.action) return; // Idle
    const action = this.getActionObject(this.action);
    // If the action is no longer valid, discontinue the action
    if (!action.getAvailability(this).available) return this.resetAction();

    // If the previous action went past its completion time, add to the next action
    // This is not added immediately in case the automation changes the action
    this.actionTimeCurrent += seconds + this.actionTimeOverflow;
    this.actionTimeOverflow = 0;
    // Complete the task if it's complete
    if (this.actionTimeCurrent >= this.actionTimeToComplete) {
      this.actionTimeOverflow = this.actionTimeCurrent - this.actionTimeToComplete;
      this.completeAction(Player, action.id);
      if (action.type != BladeburnerActionType.BlackOp) {
        this.startAction(action.id); // Attempt to repeat action
      }
    }
  }

  calculateStaminaGainPerSecond(): number {
    const effAgility = this.getEffectiveSkillLevel(Player, "agility");
    const maxStaminaBonus = this.maxStamina / BladeburnerConstants.MaxStaminaToGainFactor;
    const gain = (BladeburnerConstants.StaminaGainPerSecond + maxStaminaBonus) * Math.pow(effAgility, 0.17);
    return clampNumber(
      gain * (this.getSkillMult(BladeburnerMultName.Stamina) * Player.mults.bladeburner_stamina_gain),
      0,
    );
  }

  getEffectiveMaxStaminaTrainingBonus(staminaBonus?: number): number {
    const mult = this.getSkillMult(BladeburnerMultName.Stamina) * Player.mults.bladeburner_max_stamina;
    return (staminaBonus ?? this.staminaBonus) * mult;
  }

  calculateMaxStamina(): void {
    const baseStamina = Math.pow(this.getEffectiveSkillLevel(Player, "agility"), 0.8);
    // Min value of maxStamina is an arbitrarily small positive value. It must not be 0 to avoid NaN stamina penalty.
    const mult = this.getSkillMult(BladeburnerMultName.Stamina) * Player.mults.bladeburner_max_stamina;
    const maxStamina = Math.max(baseStamina * mult + this.getEffectiveMaxStaminaTrainingBonus(), 1e-9);
    // this.staminaBonus is a relict from the old system, it should be removed in 3.0
    if (this.maxStamina === maxStamina) {
      return;
    }
    // If max stamina changed, adjust stamina accordingly
    const oldMax = this.maxStamina;
    this.maxStamina = maxStamina;
    this.stamina = clampNumber((this.maxStamina * this.stamina) / oldMax, 0, maxStamina);
  }

  getSkillLevel(skillName: BladeburnerSkillName): number {
    return this.skills[skillName] ?? 0;
  }

  process(): void {
    // Edge race condition when the engine checks the processing counters and attempts to route before the router is initialized.
    if (Router.page() === Page.LoadingScreen) return;

    // If the Player starts doing some other actions, set action to idle and alert
    if (!Player.hasAugmentation(AugmentationName.BladesSimulacrum, true) && Player.currentWork) {
      if (this.action) {
        let msg = "Your Bladeburner action was cancelled because you started doing something else.";
        if (this.automateEnabled) {
          msg += `\n\nYour automation was disabled as well. You will have to re-enable it through the Bladeburner console`;
          this.automateEnabled = false;
        }
        if (!Settings.SuppressBladeburnerPopup) {
          dialogBoxCreate(msg);
        }
      }
      this.resetAction();
    }

    // If the Player has no Stamina, set action to idle
    if (this.stamina <= 0) {
      this.log("Your Bladeburner action was cancelled because your stamina hit 0");
      this.resetAction();
    }

    // A 'tick' for this mechanic is one second (= 5 game cycles)
    if (this.storedCycles >= BladeburnerConstants.CyclesPerSecond) {
      let seconds = Math.floor(this.storedCycles / BladeburnerConstants.CyclesPerSecond);
      seconds = Math.min(seconds, 5); // Max of 5 'ticks'
      this.storedCycles -= seconds * BladeburnerConstants.CyclesPerSecond;

      // Stamina
      this.calculateMaxStamina();
      this.stamina += this.calculateStaminaGainPerSecond() * seconds;
      this.stamina = Math.min(this.maxStamina, this.stamina);

      // Count increase for contracts/operations
      for (const contract of Object.values(this.contracts)) {
        contract.count += (seconds * contract.growthFunction()) / BladeburnerConstants.ActionCountGrowthPeriod;
      }
      for (const op of Object.values(this.operations)) {
        op.count += (seconds * op.growthFunction()) / BladeburnerConstants.ActionCountGrowthPeriod;
      }

      // Chaos goes down very slowly
      for (const cityName of Object.values(CityName)) {
        const city = this.cities[cityName];
        if (!city) throw new Error("Invalid city when processing passive chaos reduction in Bladeburner.process");
        city.chaos -= 0.0001 * seconds;
        city.chaos = Math.max(0, city.chaos);
      }

      // Random Events
      this.randomEventCounter -= seconds;
      if (this.randomEventCounter <= 0) {
        this.randomEvent();
        // Add instead of setting because we might have gone over the required time for the event
        this.randomEventCounter += getRandomIntInclusive(240, 600);
      }

      this.processAction(seconds);

      // Automation
      if (this.automateEnabled) {
        // Note: Do NOT set this.action = this.automateActionHigh/Low since it creates a reference
        if (this.stamina <= this.automateThreshLow && this.action?.name !== this.automateActionLow?.name) {
          this.startAction(this.automateActionLow);
        } else if (this.stamina >= this.automateThreshHigh && this.action?.name !== this.automateActionHigh?.name) {
          this.startAction(this.automateActionHigh);
        }
      }

      // Handle "nextUpdate" resolver after this update
      if (BladeburnerPromise.resolve) {
        BladeburnerPromise.resolve(seconds * 1000);
        BladeburnerPromise.resolve = null;
        BladeburnerPromise.promise = null;
      }
    }
  }

  /** Return the action based on an ActionIdentifier, discriminating types when possible */
  getActionObject(actionId: ActionIdentifier & { type: BladeburnerActionType.BlackOp }): BlackOperation;
  getActionObject(actionId: ActionIdentifier & { type: BladeburnerActionType.Operation }): Operation;
  getActionObject(actionId: ActionIdentifier & { type: BladeburnerActionType.Contract }): Contract;
  getActionObject(actionId: ActionIdentifier & { type: BladeburnerActionType.General }): GeneralAction;
  getActionObject(actionId: ActionIdentifier): Action;
  getActionObject(actionId: ActionIdentifier): Action {
    switch (actionId.type) {
      case BladeburnerActionType.Contract:
        return this.contracts[actionId.name];
      case BladeburnerActionType.Operation:
        return this.operations[actionId.name];
      case BladeburnerActionType.BlackOp:
        return BlackOperations[actionId.name];
      case BladeburnerActionType.General:
        return GeneralActions[actionId.name];
    }
  }

  /** Fuzzy matching for action identifiers. Should be removed in 3.0 */
  getActionFromTypeAndName(type: string, name: string): Action | null {
    if (!type || !name) return null;
    const convertedType = type.toLowerCase().trim();
    switch (convertedType) {
      case "contract":
      case "contracts":
      case "contr":
        if (!getEnumHelper("BladeburnerContractName").isMember(name)) return null;
        return this.contracts[name];
      case "operation":
      case "operations":
      case "op":
      case "ops":
        if (!getEnumHelper("BladeburnerOperationName").isMember(name)) return null;
        return this.operations[name];
      case "blackoperation":
      case "black operation":
      case "black operations":
      case "black op":
      case "black ops":
      case "blackop":
      case "blackops":
        if (!getEnumHelper("BladeburnerBlackOpName").isMember(name)) return null;
        return BlackOperations[name];
      case "general":
      case "general action":
      case "gen": {
        if (!getEnumHelper("BladeburnerGeneralActionName").isMember(name)) return null;
        return GeneralActions[name];
      }
    }
    return null;
  }

  static keysToSave = getKeyList(Bladeburner, { removedKeys: ["skillMultipliers"] });
  // Don't load contracts or operations because of the special loading method they use, see fromJSON
  static keysToLoad = getKeyList(Bladeburner, { removedKeys: ["skillMultipliers", "contracts", "operations"] });

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("Bladeburner", this, Bladeburner.keysToSave);
  }

  /** Initializes a Bladeburner object from a JSON save state. */
  static fromJSON(value: IReviverValue): Bladeburner {
    // operations and contracts are not loaded directly from the save, we load them in using a different method
    const contractsData = value.data?.contracts;
    const operationsData = value.data?.operations;
    const bladeburner = Generic_fromJSON(Bladeburner, value.data, Bladeburner.keysToLoad);
    // Loading this way allows better typesafety and also allows faithfully reconstructing contracts/operations
    // even from save data that is missing a lot of static info about the objects.
    loadContractsData(contractsData, bladeburner.contracts);
    loadOperationsData(operationsData, bladeburner.operations);
    // Regenerate skill multiplier data, which is not included in savedata
    bladeburner.updateSkillMultipliers();
    // If stamina or maxStamina is invalid, we set both of them to 1 and recalculate them.
    if (
      !Number.isFinite(bladeburner.stamina) ||
      !Number.isFinite(bladeburner.maxStamina) ||
      bladeburner.maxStamina === 0
    ) {
      bladeburner.stamina = 1;
      bladeburner.maxStamina = 1;
      bladeburner.calculateMaxStamina();
    }
    return bladeburner;
  }
}

constructorsForReviver.Bladeburner = Bladeburner;
