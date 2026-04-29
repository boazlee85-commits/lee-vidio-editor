import * as React from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export const Chart = {
  Bar: ({
    data,
    dataKey,
    xAxisKey = "name",
    fill = "#3b82f6",
    width = "100%",
    height = 300,
  }) => (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={fill} />
      </BarChart>
    </ResponsiveContainer>
  ),

  Line: ({
    data,
    dataKey,
    xAxisKey = "name",
    stroke = "#3b82f6",
    width = "100%",
    height = 300,
  }) => (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} />
      </LineChart>
    </ResponsiveContainer>
  ),

  Pie: ({
    data,
    dataKey,
    nameKey = "name",
    width = "100%",
    height = 300,
    colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
  }) => (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ),
}

export default Chart
