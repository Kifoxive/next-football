import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import { useTranslations } from "next-intl";

interface GoalsAreaChartProps {
  chartDataForMUI: {
    xAxisData: string[];
    allGoalsData: number[];
    myGoalsData: number[];
  };
}

export default function GoalsAreaChart({
  chartDataForMUI,
}: GoalsAreaChartProps) {
  const t = useTranslations();

  // Ensure we have data before rendering
  if (!chartDataForMUI.xAxisData || chartDataForMUI.xAxisData.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: "100%", height: 320 }}>
      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: chartDataForMUI.xAxisData,
            label: t("games.stats.goalsOverTime.minutes"),
            tickLabelStyle: {
              fontSize: 12,
              fill: "#aaa",
            },
          },
        ]}
        yAxis={[{ width: 40, label: t("games.stats.goalsOverTime.goals") }]}
        series={[
          {
            id: "allGoals",
            label: t("games.stats.goalsOverTime.allGoals"),
            data: chartDataForMUI.allGoalsData,
            color: "#8884d8",
            area: true,
            showMark: true,
          },
          {
            id: "myGoals",
            label: t("games.stats.goalsOverTime.myGoalsLine"),
            data: chartDataForMUI.myGoalsData,
            color: "#82ca9d",
            area: true,
            showMark: true,
          },
        ]}
        sx={{
          [`& .${lineElementClasses.root}`]: {
            strokeWidth: 2,
          },
        }}
      />
    </Box>
  );
}
