"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ChannelUtilizationChart({ data }: { data: { channel: string, networks: number }[] }) {
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
