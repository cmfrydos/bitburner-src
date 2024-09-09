// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

import { CityName } from "@enums";
import { DivisionOffice } from "./DivisionOffice";
import { DivisionOverview } from "./DivisionOverview";
import { DivisionWarehouse } from "./DivisionWarehouse";
import { Warehouse } from "../Warehouse";
import { OfficeSpace } from "../OfficeSpace";
import { useCorporation, useDivision } from "./Context";

interface IProps {
  city: CityName;
  warehouse?: Warehouse;
  office: OfficeSpace;
  rerender: () => void;
}

export function Division(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  return (
    <Box display="flex">
      <Box sx={{ width: "50%" }}>
        <DivisionOverview rerender={props.rerender} />
        <DivisionOffice rerender={props.rerender} office={props.office} />
      </Box>
      <Box sx={{ width: "50%" }}>
        <DivisionWarehouse
          rerender={props.rerender}
          corp={corp}
          currentCity={props.city}
          division={division}
          warehouse={props.warehouse}
        />
      </Box>
    </Box>
  );
}
