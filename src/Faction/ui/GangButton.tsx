// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import React, { useState } from "react";
import { GangConstants } from "../../Gang/data/Constants";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Player } from "@player";
import { Faction } from "../Faction";
import { CreateGangModal } from "./CreateGangModal";

interface IProps {
  faction: Faction;
}

export function GangButton({ faction }: IProps): React.ReactElement {
  const [gangOpen, setGangOpen] = useState(false);

  if (
    !GangConstants.Names.includes(faction.name) || // not even a gang
    !Player.isAwareOfGang() || // doesn't know about gang
    (Player.gang && Player.getGangName() !== faction.name) // already in another gang
  ) {
    return <></>;
  }

  let data = {
    enabled: false,
    title: "",
    tooltip: "" as string | React.ReactElement,
    description: "",
  };

  if (Player.gang) {
    data = {
      enabled: true,
      title: "Manage Gang",
      tooltip: "",
      description: "Manage a gang for this Faction. Gangs will earn you money and faction reputation",
    };
  } else {
    data = {
      enabled: Player.canAccessGang(),
      title: "Create Gang",
      tooltip: !Player.canAccessGang() ? (
        <Typography>Unlocked when reaching {GangConstants.GangKarmaRequirement} karma</Typography>
      ) : (
        ""
      ),
      description: "Create a gang for this Faction. Gangs will earn you money and faction reputation",
    };
  }

  const manageGang = (): void => {
    // If player already has a gang, just go to the gang UI
    if (Player.inGang()) {
      return Router.toPage(Page.Gang);
    }

    setGangOpen(true);
  };

  return (
    <>
      <Box>
        <Paper sx={{ my: 1, p: 1 }}>
          <Tooltip title={data.tooltip}>
            <span>
              <Button onClick={manageGang} disabled={!data.enabled}>
                {data.title}
              </Button>
            </span>
          </Tooltip>
          <Typography>{data.description}</Typography>
        </Paper>
      </Box>

      <CreateGangModal facName={faction.name} open={gangOpen} onClose={() => setGangOpen(false)} />
    </>
  );
}
