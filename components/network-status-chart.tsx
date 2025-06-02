"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function NetworkStatusChart({ data }: { data: { time: string, signal: number, interference: number, clients: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="signal" stroke="#10b981" name="Força do Sinal (%)" />
        <Line type="monotone" dataKey="interference" stroke="#ef4444" name="Interferência (%)" />
        <Line type="monotone" dataKey="clients" stroke="#3b82f6" name="Clientes Conectados" />
      </LineChart>
    </ResponsiveContainer>
  )
}
