import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

import PaletteSharpIcon from "@mui/icons-material/PaletteSharp";
import { Settings } from "../../Settings/Settings";
import { IPredefinedTheme } from "../Themes";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore
import Card from "@mui\\material\\node\\Card\\Card.js";
// @ts-ignore
import CardContent from "@mui\\material\\node\\CardContent\\CardContent.js";
// @ts-ignore
import CardHeader from "@mui\\material\\node\\CardHeader\\CardHeader.js";
// @ts-ignore
import CardMedia from "@mui\\material\\node\\CardMedia\\CardMedia.js";
// @ts-ignore
import Link from "@mui\\material\\node\\Link\\Link.js";
// @ts-ignore


interface IProps {
  theme: IPredefinedTheme;
  onActivated: () => void;
  onImageClick: (src: string) => void;
}

export function ThemeEntry({ theme, onActivated, onImageClick }: IProps): React.ReactElement {
  if (!theme) return <></>;
  return (
    <Card key={theme.screenshot} sx={{ width: 400, mr: 1, mb: 1 }}>
      <CardHeader
        action={
          <Tooltip title="Use this theme">
            <Button startIcon={<PaletteSharpIcon />} onClick={onActivated} variant="outlined">
              Use
            </Button>
          </Tooltip>
        }
        title={theme.name}
        subheader={
          <>
            by {theme.credit}{" "}
            {theme.reference && (
              <>
                (
                <Link href={theme.reference} target="_blank">
                  ref
                </Link>
                )
              </>
            )}
          </>
        }
        sx={{
          color: Settings.theme.primary,
          "& .MuiCardHeader-subheader": {
            color: Settings.theme.secondarydark,
          },
          "& .MuiButton-outlined": {
            backgroundColor: "transparent",
          },
        }}
      />
      <CardMedia
        component="img"
        width="400"
        image={theme.screenshot}
        alt={`Theme Screenshot of "${theme.name}"`}
        sx={{
          borderTop: `1px solid ${Settings.theme.welllight}`,
          borderBottom: `1px solid ${Settings.theme.welllight}`,
          cursor: "zoom-in",
        }}
        onClick={() => onImageClick(theme.screenshot)}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            color: Settings.theme.primarydark,
          }}
        >
          {theme.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
