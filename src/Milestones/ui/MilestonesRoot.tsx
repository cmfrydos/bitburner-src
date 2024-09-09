import { Milestones } from "../Milestones";
import { Milestone } from "../Milestone";
import * as React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


function highestMilestone(milestones: Milestone[]): number {
  let n = -1;
  for (let i = 0; i < milestones.length; i++) {
    if (milestones[i].fulfilled()) n = i;
  }

  return n;
}

export function MilestonesRoot(): JSX.Element {
  const n = highestMilestone(Milestones);
  const milestones = Milestones.map((milestone: Milestone, i: number) => {
    if (i <= n + 1) {
      return (
        <Typography key={i}>
          [{milestone.fulfilled() ? "x" : " "}] {milestone.title}
        </Typography>
      );
    }
  });
  return (
    <>
      <Typography variant="h4">Milestones</Typography>
      <Box mx={2}>
        <Typography>
          Milestones don't reward you for completing them. They are here to guide you if you're lost. They will reset
          when you install Augmentations.
        </Typography>
        <br />

        <Typography>Completing fl1ght.exe</Typography>
        {milestones}
      </Box>
    </>
  );
}
