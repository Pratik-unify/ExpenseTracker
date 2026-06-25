import { useContext } from "react";
import { DashboardContext } from "./useDashboard";

export default function DonutChart() {
  const { expenses, stats } = useContext(DashboardContext);
  const {
    foodSpent,
    billsSpent,
    travelSpent,
    otherSpent,
    foodPct,
    billsPct,
    travelPct,
    otherPct
  } = stats || {};

  // the radius is chosen so that the total circumference is 100 
  // we take 1% of the circumference for each % of spending
  // the offset is used to rotate the chart so that the first slice starts at the top
  if (expenses.length === 0) {
    return (
      <circle cx="19" cy="19" r="15.91549430918954" fill="transparent" stroke="#efece4" strokeWidth="5" />
    );
  }

  let accumulatedPct = 0;
  const slices = [];

  if (foodSpent > 0) {
    slices.push({ color: "#2f6f4f", pct: foodPct, offset: 25 - accumulatedPct });
    accumulatedPct += foodPct;
  }
  if (billsSpent > 0) {
    slices.push({ color: "#5fa37e", pct: billsPct, offset: 25 - accumulatedPct });
    accumulatedPct += billsPct;
  }
  if (travelSpent > 0) {
    slices.push({ color: "#9bc7b0", pct: travelPct, offset: 25 - accumulatedPct });
    accumulatedPct += travelPct;
  }
  if (otherSpent > 0) {
    slices.push({ color: "#7a766c", pct: otherPct, offset: 25 - accumulatedPct });
    accumulatedPct += otherPct;
  }

  return slices.map((slice, index) => (
    <circle
      key={index}
      cx="19"
      cy="19"
      r="15.91549430918954"
      fill="transparent"
      stroke={slice.color}
      strokeWidth="5"
      strokeDasharray={`${slice.pct} ${100 - slice.pct}`}
      strokeDashoffset={slice.offset}
    />
  ));
}

