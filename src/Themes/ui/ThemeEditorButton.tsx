import React, { useState } from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

import { ThemeEditorModal } from "./ThemeEditorModal";
import ColorizeIcon from "@mui/icons-material/Colorize";

export function ThemeEditorButton(): React.ReactElement {
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  return (
    <>
      <Tooltip title="The theme editor allows you to modify the colors the game uses.">
        <Button id="bb-theme-editor-button" startIcon={<ColorizeIcon />} onClick={() => setThemeEditorOpen(true)}>
          Theme Editor
        </Button>
      </Tooltip>
      <ThemeEditorModal open={themeEditorOpen} onClose={() => setThemeEditorOpen(false)} />
    </>
  );
}
