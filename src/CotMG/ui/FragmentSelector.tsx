import React, { useState } from "react";
import { Fragments, Fragment, NoneFragment, DeleteFragment } from "../Fragment";
import { FragmentType, Effect } from "../FragmentType";
import { StaneksGift } from "../StaneksGift";
import { FragmentPreview } from "./FragmentPreview";
import { formatStaneksGiftPower } from "../../ui/formatNumber";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Select\index.js
// @ts-ignore
import Select from "@mui\\material\\node\\Select\\Select.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\MenuItem\index.js
// @ts-ignore
import MenuItem from "@mui\\material\\node\\MenuItem\\MenuItem.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


interface IOptionProps {
  gift: StaneksGift;
  fragment: Fragment;
  selectFragment: (fragment: Fragment) => void;
}

function FragmentOption(props: IOptionProps): React.ReactElement {
  const left = props.fragment.limit - props.gift.count(props.fragment);
  const remaining = props.fragment.limit !== Infinity ? <>{left} remaining</> : <></>;
  return (
    <Box display="flex">
      <Box sx={{ mx: 2 }}>
        <FragmentPreview
          width={props.fragment.width(0)}
          height={props.fragment.height(0)}
          colorAt={(x, y) => {
            if (!props.fragment.fullAt(x, y, 0)) return "";
            if (left === 0) return "grey";
            return props.fragment.type === FragmentType.Booster ? "blue" : "green";
          }}
        />
      </Box>
      <Typography>
        {props.fragment.type === FragmentType.Booster
          ? `${props.fragment.power}x adjacent fragment power`
          : Effect(props.fragment.type)}
        <br />
        power: {formatStaneksGiftPower(props.fragment.power)}
        <br />
        {remaining}
      </Typography>
    </Box>
  );
}

interface IProps {
  gift: StaneksGift;
  selectFragment: (fragment: Fragment) => void;
}

export function FragmentSelector(props: IProps): React.ReactElement {
  const [value, setValue] = useState<string | number>("None");
  function onChange(event: SelectChangeEvent<string | number>): void {
    const v = event.target.value;
    setValue(v);
    if (v === "None") {
      props.selectFragment(NoneFragment);
      return;
    } else if (v === "Delete") {
      props.selectFragment(DeleteFragment);
      return;
    }
    const fragment = Fragments.find((f) => f.id === v);
    if (fragment === undefined) throw new Error("Fragment selector selected an undefined fragment with id " + v);
    if (typeof v === "number") props.selectFragment(fragment);
  }
  return (
    <Select sx={{ width: "100%" }} onChange={onChange} value={value}>
      <MenuItem value="None">
        <Typography>None</Typography>
      </MenuItem>
      <MenuItem value="Delete">
        <Typography>Delete</Typography>
      </MenuItem>
      {Fragments.map((fragment) => (
        <MenuItem key={fragment.id} value={fragment.id}>
          <FragmentOption
            key={fragment.id}
            gift={props.gift}
            selectFragment={props.selectFragment}
            fragment={fragment}
          />
        </MenuItem>
      ))}
    </Select>
  );
}
