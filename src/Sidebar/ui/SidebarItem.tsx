import React, { memo } from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Badge\index.js
// @ts-ignore
import Badge from "@mui\\material\\node\\Badge\\Badge.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ListItem\index.js
// @ts-ignore
import ListItem from "@mui\\material\\node\\ListItem\\ListItem.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ListItemIcon\index.js
// @ts-ignore
import ListItemIcon from "@mui\\material\\node\\ListItemIcon\\ListItemIcon.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ListItemText\index.js
// @ts-ignore
import ListItemText from "@mui\\material\\node\\ListItemText\\ListItemText.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import type { Page } from "../../ui/Router";

export interface ICreateProps {
  key_: Page;
  icon: React.ReactElement["type"];
  count?: number;
  active?: boolean;
}

export interface SidebarItemProps extends ICreateProps {
  clickFn: () => void;
  flash: boolean;
  classes: any;
  sidebarOpen: boolean;
}

export const SidebarItem = memo(function SidebarItem(props: SidebarItemProps): React.ReactElement {
  const color = props.flash ? "error" : props.active ? "primary" : "secondary";
  return (
    <ListItem
      classes={{ root: props.classes.listitem }}
      button
      key={props.key_}
      className={props.active ? props.classes.active : ""}
      onClick={props.clickFn}
    >
      <ListItemIcon>
        <Badge badgeContent={(props.count ?? 0) > 0 ? props.count : undefined} color="error">
          <Tooltip title={!props.sidebarOpen ? props.key_ : ""}>
            <props.icon color={color} />
          </Tooltip>
        </Badge>
      </ListItemIcon>
      <ListItemText>
        <Typography color={color}>{props.key_}</Typography>
      </ListItemText>
    </ListItem>
  );
});
