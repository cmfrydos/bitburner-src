import React, { useState } from "react";
import * as corpConstants from "../data/Constants";
import { CityName } from "@enums";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { purchaseOffice } from "../Actions";
import { MoneyCost } from "./MoneyCost";
import { useCorporation, useDivision } from "./Context";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\MenuItem\index.js
// @ts-ignore
import MenuItem from "@mui\\material\\node\\MenuItem\\MenuItem.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Select\index.js
// @ts-ignore
import Select from "@mui\\material\\node\\Select\\Select.js";
// @ts-ignore

import { ButtonWithTooltip } from "../../ui/Components/ButtonWithTooltip";

interface IProps {
  cityStateSetter: (city: CityName | "Expand") => void;
}

export function ExpandNewCity(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const possibleCities = Object.values(CityName).filter((cityName) => !(cityName in division.offices));
  const [city, setCity] = useState(possibleCities[0]);

  const disabledText = corp.funds < corpConstants.officeInitialCost ? "Insufficient corporation funds" : "";

  function onCityChange(event: SelectChangeEvent): void {
    setCity(event.target.value as CityName);
  }

  function expand(): void {
    try {
      purchaseOffice(corp, division, city);
    } catch (err) {
      dialogBoxCreate(err + "");
      return;
    }

    dialogBoxCreate(`Opened a new office in ${city}!`);

    props.cityStateSetter(city);
  }
  return (
    <>
      <Typography>
        Would you like to expand into a new city by opening an office? This would cost{" "}
        <MoneyCost money={corpConstants.officeInitialCost} corp={corp} />
      </Typography>
      <Select value={city} onChange={onCityChange}>
        {possibleCities.map((cityName: string) => (
          <MenuItem key={cityName} value={cityName}>
            {cityName}
          </MenuItem>
        ))}
      </Select>
      <ButtonWithTooltip onClick={expand} disabledTooltip={disabledText}>
        Confirm
      </ButtonWithTooltip>
    </>
  );
}
