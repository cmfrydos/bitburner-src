import * as React from "react";
import { Gang } from "../Gang";
import { CONSTANTS } from "../../Constants";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


interface IProps {
  gang: Gang;
}

/** React Component for displaying the bonus time remaining. */
export function BonusTime(props: IProps): React.ReactElement {
  const CyclerPerSecond = 1000 / CONSTANTS.MilliPerCycle;
  if ((props.gang.storedCycles / CyclerPerSecond) * 1000 <= 5000) return <></>;
  const bonusMillis = (props.gang.storedCycles / CyclerPerSecond) * 1000;
  return (
    <Box display="flex">
      <Tooltip
        title={
          <Typography>
            You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by the
            browser). Bonus time makes the Gang mechanic progress faster, up to 25x the normal speed.
          </Typography>
        }
      >
        <Typography>Bonus time: {convertTimeMsToTimeElapsedString(bonusMillis)}</Typography>
      </Tooltip>
    </Box>
  );
}
