import React, { useState } from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore


interface IProps {
  value: string;
  color?: string;
  variant?:
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "overline"
    | "inherit"
    | undefined;
}

export function CopyableText(props: IProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  function copy(): void {
    const copyText = document.createElement("textarea");
    copyText.value = props.value;
    document.body.appendChild(copyText);
    copyText.select();
    copyText.setSelectionRange(0, 1e10);
    document.execCommand("copy");
    document.body.removeChild(copyText);
    setOpen(true);
    setTimeout(() => setOpen(false), 1000);
  }

  return (
    <Tooltip open={open} title={<Typography>Copied!</Typography>}>
      <Typography variant={props.variant} color={props.color} onClick={copy}>
        {props.value}
      </Typography>
    </Tooltip>
  );
}
