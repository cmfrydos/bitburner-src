// TODO: Probably roll this into the ServerAccordion component, no real need for a separate component

import React, { useState } from "react";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { WorkerScriptAccordion } from "./WorkerScriptAccordion";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import IconButton from "@mui\\material\\node\\IconButton\\IconButton.js";
// @ts-ignore
import List from "@mui\\material\\node\\List\\List.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { Settings } from "../../Settings/Settings";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\icons-material\esm\index.js
// @ts-ignore
import FirstPage from "@mui\\icons-material\\FirstPage.js";
// @ts-ignore
import KeyboardArrowLeft from "@mui\\icons-material\\KeyboardArrowLeft.js";
// @ts-ignore
import KeyboardArrowRight from "@mui\\icons-material\\KeyboardArrowRight.js";
// @ts-ignore
import LastPage from "@mui\\icons-material\\LastPage.js";
// @ts-ignore


interface ServerActiveScriptsProps {
  scripts: WorkerScript[];
}

export function ServerAccordionContent({ scripts }: ServerActiveScriptsProps): React.ReactElement {
  const [page, setPage] = useState(0);
  if (scripts.length === 0) {
    console.error(`Attempted to display a server in active scripts when there were no matching scripts to show`);
    return <></>;
  }
  const scriptsPerPage = Settings.ActiveScriptsScriptPageSize;
  const lastPage = Math.ceil(scripts.length / scriptsPerPage) - 1;
  function changePage(n: number) {
    if (!Number.isInteger(n) || n > lastPage || n < 0) return;
    setPage(n);
  }
  if (page > lastPage) changePage(lastPage);

  const firstScriptNumber = page * scriptsPerPage + 1;
  const lastScriptNumber = Math.min((page + 1) * scriptsPerPage, scripts.length);

  return (
    <>
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Typography
          component="span"
          marginRight="auto"
        >{`Displaying scripts ${firstScriptNumber}-${lastScriptNumber} of ${scripts.length}`}</Typography>
        <IconButton onClick={() => changePage(0)} disabled={page === 0}>
          <FirstPage />
        </IconButton>
        <IconButton onClick={() => changePage(page - 1)} disabled={page === 0}>
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={() => changePage(page + 1)} disabled={page === lastPage}>
          <KeyboardArrowRight />
        </IconButton>
        <IconButton onClick={() => changePage(lastPage)} disabled={page === lastPage}>
          <LastPage />
        </IconButton>
      </div>
      <List dense disablePadding>
        {scripts.slice(page * scriptsPerPage, page * scriptsPerPage + scriptsPerPage).map((ws) => (
          <WorkerScriptAccordion key={ws.pid} workerScript={ws} />
        ))}
      </List>
    </>
  );
}
