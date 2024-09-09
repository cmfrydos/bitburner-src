/**
 * React Subcomponent for displaying a location's UI, when that location is a university
 *
 * This subcomponent renders all of the buttons for studying/taking courses
 */
import * as React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore


import { Location } from "../Location";

import { Money } from "../../ui/React/Money";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Player } from "@player";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


import { ClassWork, Classes } from "../../Work/ClassWork";
import { calculateCost } from "../../Work/Formulas";
import { UniversityClassType } from "@enums";

interface IProps {
  loc: Location;
}

export function UniversityLocation(props: IProps): React.ReactElement {
  function take(classType: UniversityClassType): void {
    Player.startWork(
      new ClassWork({
        classType: classType,
        location: props.loc.name,
        singularity: false,
      }),
    );
    Player.startFocusing();
    Router.toPage(Page.Work);
  }

  const dataStructuresCost = calculateCost(Classes[UniversityClassType.dataStructures], props.loc);
  const networksCost = calculateCost(Classes[UniversityClassType.networks], props.loc);
  const algorithmsCost = calculateCost(Classes[UniversityClassType.algorithms], props.loc);
  const managementCost = calculateCost(Classes[UniversityClassType.management], props.loc);
  const leadershipCost = calculateCost(Classes[UniversityClassType.leadership], props.loc);

  const earnHackingExpTooltip = `Gain hacking experience!`;
  const earnCharismaExpTooltip = `Gain charisma experience!`;

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.computerScience)}>Study Computer Science (free)</Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.dataStructures)}>
          Take Data Structures course (
          <Money money={dataStructuresCost} forPurchase={true} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.networks)}>
          Take Networks course (
          <Money money={networksCost} forPurchase={true} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={() => take(UniversityClassType.algorithms)}>
          Take Algorithms course (
          <Money money={algorithmsCost} forPurchase={true} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnCharismaExpTooltip}>
        <Button onClick={() => take(UniversityClassType.management)}>
          Take Management course (
          <Money money={managementCost} forPurchase={true} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnCharismaExpTooltip}>
        <Button onClick={() => take(UniversityClassType.leadership)}>
          Take Leadership course (
          <Money money={leadershipCost} forPurchase={true} /> / sec)
        </Button>
      </Tooltip>
    </Box>
  );
}
