import React, { useState } from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\MenuItem\index.js
// @ts-ignore
import MenuItem from "@mui\\material\\node\\MenuItem\\MenuItem.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Select\index.js
// @ts-ignore
import Select from "@mui\\material\\node\\Select\\Select.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { IndustriesData } from "../data/IndustryData";
import { IndustryType } from "@enums";
import { useCorporation } from "./Context";
import { createDivision } from "../Actions";

import { ButtonWithTooltip } from "../../ui/Components/ButtonWithTooltip";
import { KEY } from "../../utils/helpers/keyCodes";
import { IndustryDescription } from "./IndustryDescription";
interface IProps {
  setDivisionName: (name: string) => void;
}

export function NewDivisionTab(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const allIndustries = Object.values(IndustryType).sort();
  const [industry, setIndustry] = useState(allIndustries[0]);
  const [name, setName] = useState("");

  const data = IndustriesData[industry];
  if (!data) return <></>;

  const disabledText =
    corp.divisions.size >= corp.maxDivisions
      ? "Corporation already has the maximum number of divisions"
      : corp.funds < data.startingCost
      ? "Insufficient corporation funds"
      : "";

  function newDivision(): void {
    if (disabledText) return;
    try {
      createDivision(corp, industry, name);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    // Set routing to the new division so that the UI automatically switches to it
    props.setDivisionName(name);
  }

  function onNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    // [a-zA-Z0-9-_]
    setName(event.target.value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === KEY.ENTER) newDivision();
  }

  function onIndustryChange(event: SelectChangeEvent): void {
    setIndustry(event.target.value as IndustryType);
  }

  return (
    <>
      <Typography>
        {corp.name} has {corp.divisions.size} of {corp.maxDivisions} divisions.
      </Typography>
      <Typography>Create a new division to expand into a new industry:</Typography>
      <Select value={industry} onChange={onIndustryChange}>
        {allIndustries.map((industry) => (
          <MenuItem key={industry} value={industry}>
            {industry}
          </MenuItem>
        ))}
      </Select>
      <IndustryDescription industry={industry} corp={corp} />
      <br />
      <br />

      <Typography>Division name:</Typography>

      <Box display="flex" alignItems="center">
        <TextField autoFocus={true} value={name} onChange={onNameChange} onKeyDown={onKeyDown} type="text"></TextField>{" "}
        <ButtonWithTooltip disabledTooltip={disabledText} onClick={newDivision}>
          Expand
        </ButtonWithTooltip>
      </Box>
    </>
  );
}
