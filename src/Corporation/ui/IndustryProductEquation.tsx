import React from "react";
import { Division } from "../Division";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\better-react-mathjax\esm\index.js
// @ts-ignore
import MathJax from "better-react-mathjax\\MathJax\\MathJax.js";
// @ts-ignore

import { getRecordEntries } from "../../Types/Record";

interface IProps {
  division: Division;
}

export function IndustryProductEquation(props: IProps): React.ReactElement {
  const reqs = [];
  for (const [reqMat, reqAmt] of getRecordEntries(props.division.requiredMaterials)) {
    if (!reqAmt) continue;
    reqs.push(String.raw`${reqAmt}\;\textit{${reqMat}}`);
  }
  const prod = props.division.producedMaterials.map((p) => `1\\;\\textit{${p}}`);
  if (props.division.makesProducts) {
    prod.push("\\textit{Products}");
  }

  return <MathJax>{"\\(" + reqs.join("+") + `\\Rightarrow ` + prod.join("+") + "\\)"}</MathJax>;
}
