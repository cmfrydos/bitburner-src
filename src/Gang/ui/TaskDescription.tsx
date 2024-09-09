/**
 * React Component for left side of the gang member accordion, contains the
 * description of the task that member is currently doing.
 */
import React from "react";
import { GangMemberTasks } from "../GangMemberTasks";
import { GangMember } from "../GangMember";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


interface IProps {
  member: GangMember;
}

export function TaskDescription(props: IProps): React.ReactElement {
  const task = GangMemberTasks[props.member.task];
  const desc = task ? task.desc : GangMemberTasks.Unassigned.desc;

  return <Typography dangerouslySetInnerHTML={{ __html: desc }} />;
}
