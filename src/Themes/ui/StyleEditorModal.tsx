import React, { useState } from "react";
import { Modal } from "../../ui/React/Modal";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\ButtonGroup\index.js
// @ts-ignore
import ButtonGroup from "@mui\\material\\node\\ButtonGroup\\ButtonGroup.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Paper\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore

import ReplyIcon from "@mui/icons-material/Reply";
import SaveIcon from "@mui/icons-material/Save";

import { ThemeEvents } from "./Theme";
import { Settings } from "../../Settings/Settings";
import { defaultStyles } from "../Styles";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

import { IStyleSettings } from "@nsdefs";

interface IProps {
  open: boolean;
  onClose: () => void;
}

interface FontFamilyProps {
  value: React.CSSProperties["fontFamily"];
  onChange: (newValue: React.CSSProperties["fontFamily"], error?: string) => void;
}

function FontFamilyField({ value, onChange }: FontFamilyProps): React.ReactElement {
  const [errorText, setErrorText] = useState<string | undefined>();
  const [fontFamily, setFontFamily] = useState<React.CSSProperties["fontFamily"]>(value);

  const update = (newValue: React.CSSProperties["fontFamily"]) => {
    const errorText = newValue ? "" : "Must have a value";
    setFontFamily(newValue);
    setErrorText(errorText);
    onChange(newValue, errorText);
  };

  return (
    <TextField
      sx={{ my: 1 }}
      label={"Font-Family"}
      error={!!errorText}
      value={fontFamily}
      helperText={errorText}
      onChange={(event) => update(event.target.value)}
      fullWidth
    />
  );
}

interface LineHeightProps {
  value: React.CSSProperties["lineHeight"];
  onChange: (newValue: React.CSSProperties["lineHeight"], error?: string) => void;
}

function LineHeightField({ value, onChange }: LineHeightProps): React.ReactElement {
  const [errorText, setErrorText] = useState<string | undefined>();
  const [lineHeight, setLineHeight] = useState<React.CSSProperties["lineHeight"]>(value);

  const update = (newValue: React.CSSProperties["lineHeight"]) => {
    const errorText = !newValue ? "Must have a value" : isNaN(Number(newValue)) ? "Must be a number" : "";

    setLineHeight(newValue);
    setErrorText(errorText);
    onChange(newValue, errorText);
  };

  return (
    <TextField
      sx={{ my: 1 }}
      label={"Line Height"}
      error={!!errorText}
      value={lineHeight}
      helperText={errorText}
      onChange={(event) => update(event.target.value)}
    />
  );
}

export function StyleEditorModal(props: IProps): React.ReactElement {
  const [error, setError] = useState<string | undefined>();
  const [customStyle, setCustomStyle] = useState<IStyleSettings>({
    ...Settings.styles,
  });

  function persistToSettings(styles: IStyleSettings): void {
    Object.assign(Settings.styles, styles);
    ThemeEvents.emit();
  }

  function saveStyles(): void {
    persistToSettings(customStyle);
  }

  function setDefaults(): void {
    const styles = { ...defaultStyles };
    setCustomStyle(styles);
    persistToSettings(styles);
  }

  function update(styles: IStyleSettings, errorMessage?: string): void {
    setError(errorMessage);
    if (!errorMessage) {
      setCustomStyle(styles);
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant="h6">Styles Editor</Typography>
      <Typography>
        WARNING: Changing styles <strong>may mess up</strong> the interface. Drastic changes are{" "}
        <strong>NOT recommended</strong>.
      </Typography>
      <Paper sx={{ p: 2, my: 2 }}>
        <FontFamilyField
          value={customStyle.fontFamily}
          onChange={(value, error) => update({ ...customStyle, fontFamily: value ?? "" }, error)}
        />
        <br />
        <LineHeightField
          value={customStyle.lineHeight}
          onChange={(value, error) => update({ ...customStyle, lineHeight: Number(value) ?? 0 }, error)}
        />
        <br />
        <ButtonGroup sx={{ my: 1 }}>
          <Button onClick={setDefaults} startIcon={<ReplyIcon />} color="secondary" variant="outlined">
            Revert to Defaults
          </Button>
          <Tooltip title={"Save styles to settings"}>
            <Button onClick={saveStyles} endIcon={<SaveIcon />} color={error ? "error" : "primary"} disabled={!!error}>
              Save Modifications
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Paper>
    </Modal>
  );
}
