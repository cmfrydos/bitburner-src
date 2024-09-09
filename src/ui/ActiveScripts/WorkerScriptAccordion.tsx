/**
 * React Component for displaying a single WorkerScript's info as an
 * Accordion element
 */
import * as React from "react";

import { formatExp, formatThreads } from "../formatNumber";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Table\index.js
// @ts-ignore
import Table from "@mui\\material\\node\\Table\\Table.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableCell\index.js
// @ts-ignore
import TableCell from "@mui\\material\\node\\TableCell\\TableCell.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableRow\index.js
// @ts-ignore
import TableRow from "@mui\\material\\node\\TableRow\\TableRow.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableBody\index.js
// @ts-ignore
import TableBody from "@mui\\material\\node\\TableBody\\TableBody.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Paper\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\IconButton\index.js
// @ts-ignore
import IconButton from "@mui\\material\\node\\IconButton\\IconButton.js";
// @ts-ignore

import DeleteIcon from "@mui/icons-material/Delete";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ListItemButton\index.js
// @ts-ignore
import ListItemButton from "@mui\\material\\node\\ListItemButton\\ListItemButton.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ListItemText\index.js
// @ts-ignore
import ListItemText from "@mui\\material\\node\\ListItemText\\ListItemText.js";
// @ts-ignore

import { makeStyles } from "tss-react/mui";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Collapse\index.js
// @ts-ignore
import Collapse from "@mui\\material\\node\\Collapse\\Collapse.js";
// @ts-ignore

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { killWorkerScriptByPid } from "../../Netscript/killWorkerScript";
import { WorkerScript } from "../../Netscript/WorkerScript";

import { dialogBoxCreate } from "../React/DialogBox";
import { LogBoxEvents } from "../React/LogBoxManager";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { arrayToString } from "../../utils/helpers/ArrayHelpers";
import { Money } from "../React/Money";
import { MoneyRate } from "../React/MoneyRate";

const useStyles = makeStyles()({
  noborder: {
    borderBottom: "none",
  },
});

interface IProps {
  workerScript: WorkerScript;
}

export function WorkerScriptAccordion(props: IProps): React.ReactElement {
  const { classes } = useStyles();
  const [open, setOpen] = React.useState(false);
  const workerScript = props.workerScript;
  const scriptRef = workerScript.scriptRef;

  function logClickHandler(): void {
    LogBoxEvents.emit(scriptRef);
  }
  const killScript = killWorkerScriptByPid.bind(null, scriptRef.pid);

  function killScriptClickHandler(): void {
    if (killScript()) dialogBoxCreate("Killing script");
  }

  // Calculations for script stats
  const onlineMps = scriptRef.onlineMoneyMade / scriptRef.onlineRunningTime;
  const onlineEps = scriptRef.onlineExpGained / scriptRef.onlineRunningTime;

  return (
    <>
      <ListItemButton onClick={() => setOpen((old) => !old)} component={Paper}>
        <ListItemText
          primary={
            <Typography style={{ wordWrap: "break-word" }}>
              └ {props.workerScript.name} {JSON.stringify(props.workerScript.args)}
            </Typography>
          }
        />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={open} timeout={0} unmountOnExit>
        <Box mx={6}>
          <Table padding="none" size="small">
            <TableBody>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Threads:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>{formatThreads(props.workerScript.scriptRef.threads)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={2}>
                  <Typography>└ Args: {arrayToString(props.workerScript.args)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Online Time:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>{convertTimeMsToTimeElapsedString(scriptRef.onlineRunningTime * 1e3)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Offline Time:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>{convertTimeMsToTimeElapsedString(scriptRef.offlineRunningTime * 1e3)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Total online production:</Typography>
                </TableCell>
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    <Money money={scriptRef.onlineMoneyMade} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>&nbsp;{formatExp(scriptRef.onlineExpGained) + " hacking exp"}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Online production rate:</Typography>
                </TableCell>
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    <MoneyRate money={onlineMps} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>&nbsp;{formatExp(onlineEps) + " hacking exp / sec"}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Total offline production:</Typography>
                </TableCell>
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    <Money money={scriptRef.offlineMoneyMade} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>&nbsp;{formatExp(scriptRef.offlineExpGained) + " hacking exp"}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button onClick={logClickHandler}>LOG</Button>
          <IconButton onClick={killScriptClickHandler}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      </Collapse>
    </>
  );
}
