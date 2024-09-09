import React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { MoneyCost } from "./MoneyCost";
import { Corporation } from "../Corporation";
import { IndustryType } from "@enums";
import { IndustriesData } from "../data/IndustryData";

interface IProps {
  industry: IndustryType;
  corp: Corporation;
}

export const IndustryDescription = ({ industry, corp }: IProps) => {
  const data = IndustriesData[industry];
  return (
    <Typography>
      {data.description}
      <br />
      <br />
      Required Materials: {Object.keys(data.requiredMaterials).toString().replace(/,/gi, ", ")}
      <br />
      Produces Materials: {data.producedMaterials ? data.producedMaterials.toString().replace(/,/gi, ", ") : "NONE"}
      <br />
      Produces products: {data.product ? "YES" : "NO"}
      <br />
      <br />
      Starting cost: <MoneyCost money={data.startingCost} corp={corp} />
      <br />
      Recommended starting Industry: {data.recommendStarting ? "YES" : "NO"}
    </Typography>
  );
};
