import React, { useState } from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Accordion\index.js
// @ts-ignore
import Accordion from "@mui\\material\\node\\Accordion\\Accordion.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionSummary\index.js
// @ts-ignore
import AccordionSummary from "@mui\\material\\node\\AccordionSummary\\AccordionSummary.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionDetails\index.js
// @ts-ignore
import AccordionDetails from "@mui\\material\\node\\AccordionDetails\\AccordionDetails.js";
// @ts-ignore

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ButtonGroup\index.js
// @ts-ignore
import ButtonGroup from "@mui\\material\\node\\ButtonGroup\\ButtonGroup.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import { Player } from "@player";
import { achievements } from "../../Achievements/Achievements";
import { Engine } from "../../engine";

export function AchievementsDev(): React.ReactElement {
  const [playerAchievement, setPlayerAchievements] = useState(Player.achievements.map((m) => m.ID));

  function grantAchievement(id: string): void {
    Player.giveAchievement(id);
    setPlayerAchievements(Player.achievements.map((m) => m.ID));
  }

  function grantAllAchievements(): void {
    Object.values(achievements).forEach((a) => Player.giveAchievement(a.ID));
    setPlayerAchievements(Player.achievements.map((m) => m.ID));
  }

  function removeAchievement(id: string): void {
    Player.achievements = Player.achievements.filter((a) => a.ID !== id);
    setPlayerAchievements(Player.achievements.map((m) => m.ID));
  }

  function clearAchievements(): void {
    Player.achievements = [];
    setPlayerAchievements(Player.achievements.map((m) => m.ID));
  }

  function disableEngine(): void {
    Engine.Counters.achievementsCounter = Number.MAX_VALUE;
  }

  function enableEngine(): void {
    Engine.Counters.achievementsCounter = 0;
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Achievements</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td></td>
              <td>
                <Typography>Achievements:</Typography>
              </td>
              <td>
                <ButtonGroup>
                  <Button onClick={grantAllAchievements}>Grant All</Button>
                  <Button onClick={clearAchievements}>Clear</Button>
                  <Button onClick={disableEngine}>Disable Engine</Button>
                  <Button onClick={enableEngine}>Enable Engine</Button>
                </ButtonGroup>
              </td>
            </tr>
            {Object.values(achievements).map((i) => {
              const achieved = playerAchievement.includes(i.ID);
              return (
                <tr key={"ach-" + i.ID}>
                  <td>
                    {achieved ? (
                      <Tooltip title="Achieved">
                        <LockOpenIcon color="primary" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Locked">
                        <LockIcon color="secondary" />
                      </Tooltip>
                    )}
                  </td>
                  <td>
                    <Tooltip
                      title={
                        <>
                          {i.ID}
                          <br />
                          {i.Description}
                        </>
                      }
                    >
                      <Typography color={achieved ? "primary" : "secondary"}>{i.Name}:</Typography>
                    </Tooltip>
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button onClick={() => grantAchievement(i.ID)}>Grant</Button>
                      <Button onClick={() => removeAchievement(i.ID)}>Clear</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
