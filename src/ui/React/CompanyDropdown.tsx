import type { CompanyName } from "../../Enums";

import React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Select\index.js
// @ts-ignore
import Select from "@mui\\material\\node\\Select\\Select.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\MenuItem\index.js
// @ts-ignore
import MenuItem from "@mui\\material\\node\\MenuItem\\MenuItem.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

import { Companies } from "../../Company/Companies";
import { getRecordKeys } from "../../Types/Record";

interface IProps {
  purchase: () => void;
  canPurchase: boolean;
  onChange: (event: SelectChangeEvent<CompanyName>) => void;
  value: CompanyName;
}

const sortedCompanies = getRecordKeys(Companies).sort((a, b) => a.localeCompare(b));

export function CompanyDropdown(props: IProps): React.ReactElement {
  const companies = [];
  for (const company of sortedCompanies) {
    companies.push(
      <MenuItem key={company} value={company}>
        {company}
      </MenuItem>,
    );
  }

  return (
    <Select
      startAdornment={
        <Button onClick={props.purchase} disabled={!props.canPurchase}>
          Buy
        </Button>
      }
      sx={{ mx: 1 }}
      value={props.value}
      onChange={props.onChange}
    >
      {companies}
    </Select>
  );
}
