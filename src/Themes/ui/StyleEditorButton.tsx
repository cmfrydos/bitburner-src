import React, { useState } from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

import TextFormatIcon from "@mui/icons-material/TextFormat";
import { StyleEditorModal } from "./StyleEditorModal";

export function StyleEditorButton(): React.ReactElement {
  const [styleEditorOpen, setStyleEditorOpen] = useState(false);
  return (
    <>
      <Tooltip title="The style editor allows you to modify certain CSS rules used by the game.">
        <Button startIcon={<TextFormatIcon />} onClick={() => setStyleEditorOpen(true)}>
          Style Editor
        </Button>
      </Tooltip>
      <StyleEditorModal open={styleEditorOpen} onClose={() => setStyleEditorOpen(false)} />
    </>
  );
}
