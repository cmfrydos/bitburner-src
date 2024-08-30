import { WorkStats } from "src/Work/WorkStats";

export interface Skills {
  hacking: number;
  strength: number;
  defense: number;
  dexterity: number;
  agility: number;
  charisma: number;
  intelligence: number;
}

export function SkillsToWorkStats(skills: Skills): WorkStats {
  return {
    reputation: 0,
    money: 0,
    hackExp: skills.hacking,
    strExp: skills.strength,
    defExp: skills.defense,
    dexExp: skills.dexterity,
    agiExp: skills.agility,
    chaExp: skills.charisma,
    intExp: skills.intelligence,
  };
}
