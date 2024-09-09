import { AlertEvents } from "./AlertManager";

import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


export function dialogBoxCreate(txt: string | JSX.Element, html = false): void {
  AlertEvents.emit(
    typeof txt !== "string" ? (
      txt
    ) : html ? (
      <div dangerouslySetInnerHTML={{ __html: txt }}></div>
    ) : (
      <Typography component="span" style={{ whiteSpace: "pre-wrap" }}>
        {txt}
      </Typography>
    ),
  );
}
