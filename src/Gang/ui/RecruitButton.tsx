import React, { useState } from "react";
import { RecruitModal } from "./RecruitModal";
import { formatRespect } from "../../ui/formatNumber";
import { useGang } from "./Context";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

import { RecruitmentResult } from "../Gang";

interface IProps {
  onRecruit: () => void;
}

/** React Component for the recruitment button and text on the gang main page. */
export function RecruitButton(props: IProps): React.ReactElement {
  const gang = useGang();
  const [open, setOpen] = useState(false);
  const recruitsAvailable = gang.getRecruitsAvailable();

  if (gang.canRecruitMember() !== RecruitmentResult.Success) {
    const respectNeeded = gang.respectForNextRecruit();
    return (
      <Box display="flex" alignItems="center" sx={{ mx: 1 }}>
        <Button disabled>Recruit Gang Member</Button>
        {respectNeeded === Infinity ? (
          <Typography sx={{ ml: 1 }}>Maximum gang members already recruited</Typography>
        ) : (
          <Typography sx={{ ml: 1 }}>{formatRespect(respectNeeded)} respect needed to recruit next member</Typography>
        )}
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" alignItems="center" sx={{ mx: 1 }}>
        <Button onClick={() => setOpen(true)}>Recruit Gang Member</Button>
        <Typography sx={{ ml: 1 }}>
          Can recruit {recruitsAvailable} more gang member{recruitsAvailable === 1 ? "" : "s"}
        </Typography>
      </Box>
      <RecruitModal open={open} onClose={() => setOpen(false)} onRecruit={props.onRecruit} />
    </>
  );
}
