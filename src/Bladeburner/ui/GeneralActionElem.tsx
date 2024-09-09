import type { Bladeburner } from "../Bladeburner";
import type { GeneralAction } from "../Actions/GeneralAction";

import React from "react";
import { formatNumberNoSuffix } from "../../ui/formatNumber";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { Player } from "@player";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { useRerender } from "../../ui/React/hooks";
import { ActionHeader } from "./ActionHeader";

interface GeneralActionElemProps {
  bladeburner: Bladeburner;
  action: GeneralAction;
}

export function GeneralActionElem({ bladeburner, action }: GeneralActionElemProps): React.ReactElement {
  const rerender = useRerender();
  const actionTime = action.getActionTime(bladeburner, Player);
  const successChance =
    action.name === "Recruitment" ? Math.max(0, Math.min(bladeburner.getRecruitmentSuccessChance(Player), 1)) : -1;

  return (
    <Paper sx={{ my: 1, p: 1 }}>
      <ActionHeader bladeburner={bladeburner} action={action} rerender={rerender}></ActionHeader>
      <br />
      <Typography>{action.desc}</Typography>
      <br />
      <Typography>
        Time Required: {convertTimeMsToTimeElapsedString(actionTime * 1000)}
        {successChance !== -1 && (
          <>
            <br />
            Estimated success chance: {formatNumberNoSuffix(successChance * 100, 1)}%
          </>
        )}
      </Typography>
    </Paper>
  );
}
