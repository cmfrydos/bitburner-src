import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\IconButton\index.js
// @ts-ignore
import IconButton from "@mui\\material\\node\\IconButton\\IconButton.js";
// @ts-ignore

import ClearIcon from "@mui/icons-material/Clear";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore


interface IProps {
  label: string;
  placeholder: string;
  add: (x: number) => void;
  subtract: (x: number) => void;
  tons: () => void;
  reset: () => void;
}

export function Adjuster(props: IProps): React.ReactElement {
  const [value, setValue] = useState<number | string>("");

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setValue("");
    else setValue(parseFloat(event.target.value));
  }

  const { label, placeholder, add, subtract, reset, tons } = props;
  return (
    <>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="number"
        InputProps={{
          startAdornment: (
            <>
              <Tooltip title="Add a lot">
                <IconButton onClick={tons} size="large">
                  <DoubleArrowIcon style={{ transform: "rotate(-90deg)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add">
                <IconButton onClick={() => add(typeof value !== "string" ? value : 0)} size="large">
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </>
          ),
          endAdornment: (
            <>
              <Tooltip title="Remove">
                <IconButton onClick={() => subtract(typeof value !== "string" ? value : 0)} size="large">
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset">
                <IconButton onClick={reset} size="large">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </>
          ),
        }}
      />
    </>
  );
}
