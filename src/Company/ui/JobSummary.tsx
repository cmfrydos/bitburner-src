import type { Company } from "../Company";
import type { CompanyPosition } from "../CompanyPosition";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { Player } from "@player";
import * as React from "react";
import { CONSTANTS } from "../../Constants";
import { calculateCompanyWorkStats } from "../../Work/Formulas";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { ReputationRate } from "../../ui/React/ReputationRate";
import { StatsTable } from "../../ui/React/StatsTable";

const CYCLES_PER_SEC = 1000 / CONSTANTS.MilliPerCycle;
interface JobSummaryProps {
  company: Company;
  position: CompanyPosition;
}

export function JobSummary({ company, position }: JobSummaryProps): React.ReactElement {
  const workStats = calculateCompanyWorkStats(Player, company, position, company.favor);
  return (
    <>
      <Typography>
        <u>{position.name}</u>
      </Typography>
      <StatsTable
        wide
        rows={[
          ["Wages:", <MoneyRate key="money" money={workStats.money * CYCLES_PER_SEC} />],
          ["Reputation:", <ReputationRate key="rep" reputation={workStats.reputation * CYCLES_PER_SEC} />],
        ]}
      />
    </>
  );
}
