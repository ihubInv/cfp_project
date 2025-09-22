"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import CustomTooltip from "./CustomTooltip"

const FundingChart = ({ data, height = 300, showLegend = true }) => {
    const formatCurrency = (amount) => {
        if (amount >= 1e9) {
            return `$${(amount / 1e9).toFixed(1)}B`
        } else if (amount >= 1e6) {
            return `$${(amount / 1e6).toFixed(1)}M`
        } else if (amount >= 1e3) {
            return `$${(amount / 1e3).toFixed(1)}K`
        }
        return `$${amount}`
    }

    const formatFullCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip formatter={formatFullCurrency} />} />
                {showLegend && <Legend />}
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default FundingChart
