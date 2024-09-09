// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore
import Slider from "@mui\\material\\node\\Slider\\Slider.js";
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import React, { useState } from "react";

interface IProps {
  initialValue: number;
  callback: (event: Event | React.SyntheticEvent, newValue: number | number[]) => void;
  step: number;
  min: number;
  max: number;
  tooltip: React.ReactElement;
  label: string;
  marks?: boolean;
}

export const OptionsSlider = (props: IProps): React.ReactElement => {
  const [value, setValue] = useState(props.initialValue);

  const onChange = (_evt: Event, newValue: number | number[]): void => {
    if (typeof newValue === "number") setValue(newValue);
  };

  return (
    <Box>
      <Tooltip title={<Typography>{props.tooltip}</Typography>}>
        <Typography>{props.label}</Typography>
      </Tooltip>
      <Slider
        value={value}
        onChange={onChange}
        onChangeCommitted={props.callback}
        step={props.step}
        min={props.min}
        max={props.max}
        valueLabelDisplay="auto"
        sx={{
          "& .MuiSlider-thumb": {
            height: "12px",
            width: "12px",
          },
        }}
        marks={props.marks}
      />
    </Box>
  );
};
