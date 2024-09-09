/**
 * React component for general information about the faction. This includes the
 * factions "motto", reputation, favor, and gameplay instructions
 */
import React from "react";

import { Faction } from "../Faction";
import { FactionInfo } from "../FactionInfo";

import { Reputation } from "../../ui/React/Reputation";
import { Favor } from "../../ui/React/Favor";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\better-react-mathjax\esm\index.js
// @ts-ignore
import MathJax from "better-react-mathjax\\MathJax\\MathJax.js";
// @ts-ignore


import { makeStyles } from "tss-react/mui";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

import { useCycleRerender } from "../../ui/React/hooks";
import { calculateFavorAfterResetting } from "../formulas/favor";

interface IProps {
  faction: Faction;
  factionInfo: FactionInfo;
}

const useStyles = makeStyles()({
  noformat: {
    whiteSpace: "pre-wrap",
    lineHeight: "1em",
  },
});

function DefaultAssignment(): React.ReactElement {
  return (
    <Typography>
      Perform work/carry out assignments for your faction to help further its cause! By doing so you will earn
      reputation for your faction. You will also gain reputation passively over time, although at a very slow rate.
      Earning reputation will allow you to purchase Augmentations through this faction, which are powerful upgrades that
      enhance your abilities.
    </Typography>
  );
}

export function Info(props: IProps): React.ReactElement {
  useCycleRerender();
  const { classes } = useStyles();

  const Assignment = props.factionInfo.assignment ?? DefaultAssignment;

  return (
    <>
      <Typography classes={{ root: classes.noformat }}>{props.factionInfo.infoText}</Typography>
      <Typography>-------------------------</Typography>
      <Box display="flex">
        <Tooltip
          title={
            <>
              <Typography>
                You will have{" "}
                <Favor favor={calculateFavorAfterResetting(props.faction.favor, props.faction.playerReputation)} />{" "}
                faction favor after installing an Augmentation.
              </Typography>
              <MathJax>{"\\(\\huge{r = \\text{total faction reputation}}\\)"}</MathJax>
              <MathJax>{"\\(\\huge{favor=\\log_{1.02}\\left(1+\\frac{r}{25000}\\right)}\\)"}</MathJax>
            </>
          }
        >
          <Typography>
            Reputation: <Reputation reputation={props.faction.playerReputation} />
          </Typography>
        </Tooltip>
      </Box>

      <Typography>-------------------------</Typography>

      <Box display="flex">
        <Tooltip
          title={
            <>
              <Typography>
                Faction favor increases the rate at which you earn reputation for this faction by 1% per favor. Faction
                favor is gained whenever you install an Augmentation. The amount of favor you gain depends on the total
                amount of reputation you earned with this faction across all resets.
              </Typography>

              <MathJax>{"\\(\\huge{r = reputation}\\)"}</MathJax>
              <MathJax>{"\\(\\huge{\\Delta r = \\Delta r \\times \\frac{100+favor}{100}}\\)"}</MathJax>
            </>
          }
        >
          <Typography>
            Faction Favor: <Favor favor={props.faction.favor} />
          </Typography>
        </Tooltip>
      </Box>

      <Typography>-------------------------</Typography>
      <Assignment />
    </>
  );
}
