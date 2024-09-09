import React, { useState } from "react";

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

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Select\index.js
// @ts-ignore
import Select from "@mui\\material\\node\\Select\\Select.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\MenuItem\index.js
// @ts-ignore
import MenuItem from "@mui\\material\\node\\MenuItem\\MenuItem.js";
// @ts-ignore

import { generateContract, generateRandomContract, generateRandomContractOnHome } from "../../CodingContractGenerator";
import { CodingContractTypes } from "../../CodingContracts";

export function CodingContractsDev(): React.ReactElement {
  const [codingcontract, setCodingcontract] = useState("Find Largest Prime Factor");
  function setCodingcontractDropdown(event: SelectChangeEvent): void {
    setCodingcontract(event.target.value);
  }

  function specificContract(): void {
    generateContract({
      problemType: codingcontract,
      server: "home",
    });
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Coding Contracts</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Button onClick={generateRandomContract}>Generate Random Contract</Button>
                <Button onClick={generateRandomContractOnHome}>Generate Random Contract on Home Comp</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Select onChange={setCodingcontractDropdown} value={codingcontract}>
                  {Object.values(CodingContractTypes).map((cc) => (
                    <MenuItem key={cc.name} value={cc.name}>
                      {cc.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button onClick={specificContract}>Generate Specified Contract Type on Home Comp</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
