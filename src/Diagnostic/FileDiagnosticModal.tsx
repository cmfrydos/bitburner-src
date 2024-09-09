import React from "react";
import { GetServer, GetAllServers } from "../Server/AllServers";
import { Modal } from "../ui/React/Modal";
import { formatBigNumber } from "../ui/formatNumber";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Table\index.js
// @ts-ignore
import Table from "@mui\\material\\node\\Table\\Table.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableBody\index.js
// @ts-ignore
import TableBody from "@mui\\material\\node\\TableBody\\TableBody.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableCell\index.js
// @ts-ignore
import TableCell from "@mui\\material\\node\\TableCell\\TableCell.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableContainer\index.js
// @ts-ignore
import TableContainer from "@mui\\material\\node\\TableContainer\\TableContainer.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableHead\index.js
// @ts-ignore
import TableHead from "@mui\\material\\node\\TableHead\\TableHead.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableRow\index.js
// @ts-ignore
import TableRow from "@mui\\material\\node\\TableRow\\TableRow.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Paper\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Accordion\index.js
// @ts-ignore
import Accordion from "@mui\\material\\node\\Accordion\\Accordion.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionSummary\index.js
// @ts-ignore
import AccordionSummary from "@mui\\material\\node\\AccordionSummary\\AccordionSummary.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionDetails\index.js
// @ts-ignore
import AccordionDetails from "@mui\\material\\node\\AccordionDetails\\AccordionDetails.js";
// @ts-ignore

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ServerName } from "../Types/strings";
import { allContentFiles } from "../Paths/ContentFile";

interface File {
  name: string;
  size: number;
}

function ServerAccordion(props: { hostname: ServerName }): React.ReactElement {
  const server = GetServer(props.hostname);
  if (server === null) throw new Error(`server '${props.hostname}' should not be null`);
  let totalSize = 0;
  const files: File[] = [];
  for (const [path, file] of allContentFiles(server)) {
    totalSize += file.content.length;
    files.push({ name: path, size: file.content.length });
  }

  if (totalSize === 0) return <></>;

  files.sort((a: File, b: File): number => b.size - a.size);

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {server.hostname} ({formatBigNumber(totalSize)}b)
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Filename</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>Size</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file: File) => (
                <TableRow key={file.name}>
                  <TableCell component="th" scope="row">
                    <Typography>{file.name}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{formatBigNumber(file.size)}b</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ul></ul>
      </AccordionDetails>
    </Accordion>
  );
}

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function FileDiagnosticModal(props: IProps): React.ReactElement {
  const keys: string[] = [];
  for (const key of GetAllServers()) {
    keys.push(key.hostname);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>
          Welcome to the file diagnostic! If your save file is really big it's likely because you have too many
          text/scripts. This tool can help you narrow down where they are.
        </Typography>
        {keys.map((hostname: string) => (
          <ServerAccordion key={hostname} hostname={hostname} />
        ))}
      </>
    </Modal>
  );
}
