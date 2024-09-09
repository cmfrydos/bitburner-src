import type { GoScore } from "../Types";
import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { GoOpponent, GoColor } from "@enums";
import { Modal } from "../../ui/React/Modal";
import { boardStyles } from "../boardState/goStyles";
import { GoScorePowerSummary } from "./GoScorePowerSummary";
import { GoScoreSummaryTable } from "./GoScoreSummaryTable";

interface Props {
  open: boolean;
  onClose: () => void;
  finalScore: GoScore;
  newSubnet: () => void;
  showScoreExplanation: () => void;
  opponent: GoOpponent;
}

export const GoScoreModal = ({
  open,
  onClose,
  finalScore,
  newSubnet,
  showScoreExplanation,
  opponent,
}: Props): React.ReactElement => {
  const { classes } = boardStyles();

  const blackScore = finalScore[GoColor.black];
  const whiteScore = finalScore[GoColor.white];

  const playerWinsText = opponent === GoOpponent.none ? "Black wins!" : "You win!";
  const opponentWinsText = opponent === GoOpponent.none ? "White wins!" : `Winner: ${opponent}`;

  return (
    <Modal open={open} onClose={onClose}>
      <>
        <div className={classes.scoreModal}>
          <Typography variant="h5" className={classes.centeredText}>
            Game complete!
          </Typography>
          <GoScoreSummaryTable score={finalScore} opponent={opponent} />
          <br />
          <Typography variant="h5" className={classes.centeredText}>
            {blackScore.sum > whiteScore.sum ? playerWinsText : opponentWinsText}
          </Typography>
          <br />
          {opponent !== GoOpponent.none ? (
            <>
              <GoScorePowerSummary opponent={opponent} finalScore={finalScore} />
              <br />
              <br />
            </>
          ) : (
            ""
          )}
          <Box className={classes.inlineFlexBox}>
            <Button onClick={showScoreExplanation}>Score Explanation</Button>
            <Button onClick={newSubnet}>New Subnet</Button>
          </Box>
        </div>
      </>
    </Modal>
  );
};
