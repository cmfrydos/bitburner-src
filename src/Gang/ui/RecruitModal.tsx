import React, { useState } from "react";
import { Modal } from "../../ui/React/Modal";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { useGang } from "./Context";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

import { KEY } from "../../utils/helpers/keyCodes";
import { RecruitmentResult } from "../Gang";

interface IRecruitPopupProps {
  open: boolean;
  onClose: () => void;
  onRecruit: () => void;
}

/** React Component for the popup used to recruit new gang members. */
export function RecruitModal(props: IRecruitPopupProps): React.ReactElement {
  const gang = useGang();
  const [name, setName] = useState("");

  const disabled = name === "" || gang.canRecruitMember() !== RecruitmentResult.Success;
  function recruit(): void {
    if (disabled) {
      return;
    }
    const result = gang.recruitMember(name);
    if (result !== RecruitmentResult.Success) {
      dialogBoxCreate(result);
      return;
    }

    props.onRecruit();
    setName("");
    props.onClose();
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === KEY.ENTER) recruit();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>Enter a name for your new Gang Member:</Typography>
      <br />
      <TextField
        autoFocus
        onKeyUp={onKeyUp}
        onChange={onChange}
        type="text"
        placeholder="unique name"
        spellCheck="false"
        InputProps={{
          endAdornment: (
            <Button disabled={disabled} onClick={recruit}>
              Recruit
            </Button>
          ),
        }}
      />
    </Modal>
  );
}
