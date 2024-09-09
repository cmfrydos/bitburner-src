// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import FormControlLabel from "@mui\\material\\node\\FormControlLabel\\FormControlLabel.js";
// @ts-ignore
import Switch from "@mui\\material\\node\\Switch\\Switch.js";
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import React, { useState } from "react";

type OptionSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  onChange: (newValue: boolean, error?: string) => void;
  text: React.ReactNode;
  tooltip: React.ReactNode;
};

export function OptionSwitch({
  checked,
  disabled = false,
  onChange,
  text,
  tooltip,
}: OptionSwitchProps): React.ReactElement {
  const [value, setValue] = useState(checked);

  function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = event.target.checked;
    setValue(newValue);
    onChange(newValue);
  }

  return (
    <>
      <FormControlLabel
        disabled={disabled}
        control={<Switch checked={value} onChange={handleSwitchChange} />}
        label={
          <Tooltip title={<Typography component="div">{tooltip}</Typography>}>
            <Typography component="div">{text}</Typography>
          </Tooltip>
        }
      />
      <br />
    </>
  );
}
