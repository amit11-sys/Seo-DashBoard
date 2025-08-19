"use client"
import React from "react"
import { Skeleton, Table } from "antd"

export function TableSkeleton({
  rows = 5,
  cols = 6,
}: {
  rows?: number
  cols?: number
}) {
  // Generate fake columns
  const columns = Array.from({ length: cols }).map((_, i) => ({
    title: (
      <Skeleton.Input
        style={{ width: 100, height: 16 }}
        active={true}
      />
    ),
    dataIndex: `col${i}`,
    key: `col${i}`,
    render: () => (
      <Skeleton.Input
        style={{ width: "100%", height: 16 }}
        active={true}
      />
    ),
  }))

  // Generate fake data
  const data = Array.from({ length: rows }).map((_, i) => {
    const row: Record<string, any> = { key: i }
    columns.forEach((_, j) => {
      row[`col${j}`] = i + "-" + j
    })
    return row
  })

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
    </div>
  )
}
