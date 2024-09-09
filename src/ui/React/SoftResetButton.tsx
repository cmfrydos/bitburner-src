import React, { useState } from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

import { ConfirmationModal } from "./ConfirmationModal";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface IProps {
  color?: "primary" | "warning" | "error";
  noConfirmation?: boolean;
  onTriggered: () => void;
}

export function SoftResetButton({
  color = "primary",
  noConfirmation = false,
  onTriggered,
}: IProps): React.ReactElement {
  const [modalOpened, setModalOpened] = useState(false);

  function handleButtonClick(): void {
    if (noConfirmation) {
      onTriggered();
    } else {
      setModalOpened(true);
    }
  }

  const confirmationMessage = `Soft Reset will:

  - Reset basic stats and money
  - Accumulate Favor for companies and factions
  - Install Augmentations if you have any purchased
  - Reset servers, programs, recent scripts and terminal 
  - Scripts on your home server will stop, but aren't deleted
  - Stop some special mechanics like Bladeburner tasks
  - You will not lose overall progress or access to special mechanics

Are you sure? 
  `;

  return (
    <>
      <Tooltip title="Perform a Soft Reset - similar to installing Augmentations, even if you have none.">
        <Button startIcon={<RestartAltIcon />} color={color} onClick={handleButtonClick}>
          Soft Reset
        </Button>
      </Tooltip>
      <ConfirmationModal
        onConfirm={onTriggered}
        open={modalOpened}
        onClose={() => setModalOpened(false)}
        confirmationText={<span style={{ whiteSpace: "pre-wrap" }}>{confirmationMessage}</span>}
        additionalButton={<Button onClick={() => setModalOpened(false)}>Cancel</Button>}
      />
    </>
  );
}
