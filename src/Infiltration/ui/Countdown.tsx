// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import React, { useEffect, useState } from "react";

interface IProps {
  onFinish: () => void;
}

export function Countdown({ onFinish }: IProps): React.ReactElement {
  const [x, setX] = useState(3);

  useEffect(() => {
    if (x === 0) {
      onFinish();
    }
  }, [x, onFinish]);

  useEffect(() => {
    const id = setInterval(() => {
      setX((previousValue) => previousValue - 1);
    }, 300);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <Paper sx={{ p: 1, textAlign: "center" }}>
      <Typography variant="h4">Get Ready!</Typography>
      <Typography variant="h4">{x}</Typography>
    </Paper>
  );
}
