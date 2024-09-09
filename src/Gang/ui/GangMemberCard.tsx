import React from "react";
import { GangMember } from "../GangMember";
import { GangMemberCardContent } from "./GangMemberCardContent";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ListItemText\index.js
// @ts-ignore
import ListItemText from "@mui\\material\\node\\ListItemText\\ListItemText.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Paper\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore


interface IProps {
  member: GangMember;
}

/** React Component for a gang member on the management subpage. */
export function GangMemberCard(props: IProps): React.ReactElement {
  return (
    <Box component={Paper} sx={{ width: "auto" }}>
      <Box sx={{ m: 1 }}>
        <ListItemText primary={<b>{props.member.name}</b>} />
        <GangMemberCardContent member={props.member} />
      </Box>
    </Box>
  );
}
