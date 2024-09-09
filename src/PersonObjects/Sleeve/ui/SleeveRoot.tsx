import React, { useState } from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore
import Container from "@mui\\material\\node\\Container\\Container.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { Player } from "@player";

import { SleeveElem } from "./SleeveElem";
import { FAQModal } from "./FAQModal";
import { useCycleRerender } from "../../../ui/React/hooks";

export function SleeveRoot(): React.ReactElement {
  const [FAQOpen, setFAQOpen] = useState(false);
  const rerender = useCycleRerender();

  return (
    <>
      <Container disableGutters maxWidth="md" sx={{ mx: 0 }}>
        <Typography variant="h4">Sleeves</Typography>
        <Typography>
          Duplicate Sleeves are MK-V Synthoids (synthetic androids) into which your consciousness has been copied. In
          other words, these Synthoids contain a perfect duplicate of your mind.
          <br />
          <br />
          Sleeves can be used to perform different tasks simultaneously.
          <br />
          <br />
        </Typography>
      </Container>

      <Button onClick={() => setFAQOpen(true)}>FAQ</Button>
      <Box display="grid" sx={{ gridTemplateColumns: "repeat(2, 1fr)", mt: 1 }}>
        {Player.sleeves.map((sleeve, i) => (
          <SleeveElem key={i} rerender={rerender} sleeve={sleeve} />
        ))}
      </Box>
      <FAQModal open={FAQOpen} onClose={() => setFAQOpen(false)} />
    </>
  );
}
