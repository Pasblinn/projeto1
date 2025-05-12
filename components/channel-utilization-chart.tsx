"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { channel: "1", networks: 4 },
  { channel: "2", networks: 1 },
  { channel: "3", networks: 0 },
  { channel: "4", networks: 0 },
  { channel: "5", networks: 0 },
  { channel: "6", networks: 5 },
  { channel: "7", networks: 1 },
  { channel: "8", networks: 0 },
  { channel: "9", networks: 0 },
  { channel: "10", networks: 0 },
  { channel: "11", networks: 3 },
  { channel: "12", networks: 0 },
  { channel: "13", networks: 0 },
]

export function ChannelUtilizationChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="channel" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="networks" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
