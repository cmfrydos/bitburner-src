import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Link from "@mui\\material\\node\\Link\\Link.js";
// @ts-ignore


export function ThemeCollaborate(): React.ReactElement {
  return (
    <>
      <Typography sx={{ my: 1 }}>
        If you've created a theme that you believe should be added in game's theme browser, feel free to{" "}
        <Link href="https://github.com/bitburner-official/bitburner-src/tree/dev/src/Themes/README.md" target="_blank">
          create a pull request
        </Link>
        .
      </Typography>
      <Typography sx={{ my: 1 }}>
        Head over to the{" "}
        <Link href="https://discord.com/channels/415207508303544321/921991895230611466" target="_blank">
          theme-sharing
        </Link>{" "}
        discord channel for more.
      </Typography>
    </>
  );
}
