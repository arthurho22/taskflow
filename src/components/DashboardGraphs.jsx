// components/DashboardGraphs.jsx
import React from "react";
import {
  Card,
  Title,
  LineChart,
  BarChart,
  Category,
  Metric
} from "@tremor/react";

const data = [
  { month: "Jan", sales: 50, users: 200 },
  { month: "Feb", sales: 80, users: 300 },
  { month: "Mar", sales: 45, users: 150 },
  { month: "Apr", sales: 70, users: 250 },
];

export default function DashboardGraphs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Gráfico de Vendas (Linha) */}
      <Card>
        <Title>Vendas Mensais</Title>
        <LineChart
          data={data}
          index="month"
          categories={["sales"]}
          colors={["blue"]}
          showLegend
          yAxisWidth={40}
        />
      </Card>

      {/* Gráfico de Usuários (Barras) */}
      <Card>
        <Title>Usuários Mensais</Title>
        <BarChart
          data={data}
          index="month"
          categories={["users"]}
          colors={["purple"]}
          yAxisWidth={40}
        />
      </Card>
    </div>
  );
}
