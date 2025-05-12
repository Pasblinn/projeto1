"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", signal: 65, interference: 15, clients: 2 },
  { time: "02:00", signal: 68, interference: 12, clients: 1 },
  { time: "04:00", signal: 70, interference: 10, clients: 1 },
  { time: "06:00", signal: 72, interference: 8, clients: 3 },
  { time: "08:00", signal: 60, interference: 25, clients: 12 },
  { time: "10:00", signal: 55, interference: 30, clients: 18 },
  { time: "12:00", signal: 50, interference: 35, clients: 20 },
  { time: "14:00", signal: 52, interference: 32, clients: 22 },
  { time: "16:00", signal: 58, interference: 28, clients: 15 },
  { time: "18:00", signal: 62, interference: 20, clients: 10 },
  { time: "20:00", signal: 65, interference: 18, clients: 5 },
  { time: "22:00", signal: 68, interference: 15, clients: 3 },
]

export function NetworkStatusChart() {
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
