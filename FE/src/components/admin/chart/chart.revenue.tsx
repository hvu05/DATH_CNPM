import { currencyFormatter, formatCurrencyCompactVN } from "@/helpers/format.currency";
import dayjs from "dayjs";
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useMemo } from "react";

export const ChartRevenue = ({ data }: {
    data: {
        labels: Date[];
        series: {
            name: string;
            data: number[];
        }[];
    }
}) => {
    //@ts-ignore
    const chartOptions: EChartsOption = useMemo(() => ({
        textStyle: {
            fontSize: 18,
        },
        backgroundColor: 'transparent',
        legend: {
            data: ['Đơn hàng', 'Doanh thu'],
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            formatter: (params: any) => {
                const lines = Array.isArray(params) ? params : [params];
                const header = `<strong>${lines[0]?.axisValue}  </strong>`;
                const body = lines
                    .map((item: any) => {
                        const { seriesName, value, marker } = item;
                        if (seriesName === 'Revenue') {
                            return `${marker} ${seriesName}: ${currencyFormatter.format(Number(value))}`;
                        }
                        return `${marker} ${seriesName}: ${Number(value).toLocaleString('en-US')}`;
                    })
                    .join('<br />');
                return `${header}<br />${body}`;
            },
        },
        grid: { left: 64, right: 64, top: 48, bottom: 60 },
        xAxis: {
            type: 'category',
            data: data.labels.map(item => dayjs(item).format('DD-MM-YYYY')),
            axisTick: { alignWithLabel: true },
            // axisLabel: {rotate: granularity === 'week' ? 45 : 0 },
        },
        yAxis: [
            {
                type: 'value',
                name: 'Doanh thu',
                axisLabel: {
                    formatter: (value: number) => formatCurrencyCompactVN(Number(value)),
                },
                splitLine: { lineStyle: { type: 'dashed' } },
            },
            {
                type: 'value',
                name: 'Đơn hàng',
                axisLabel: {
                    formatter: (value: number) => Math.round(Number(value)).toString(),
                },
                splitLine: { show: false },
            },
        ],
        series: [
            {
                name: 'Doanh thu',
                type: 'bar',
                data: data.series[0].data,
                itemStyle: { color: '#1677ff' },
                emphasis: { focus: 'series' },
                tooltip: { valueFormatter: (value: number) => currencyFormatter.format(Number(value)) },
            },
            {

                name: 'Đơn hàng',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                symbolSize: 8,
                lineStyle: { width: 3, color: '#52c41a' },
                itemStyle: { color: '#52c41a' },
                data: data.series[1].data,
                tooltip: { valueFormatter: (value: number) => Number(value).toLocaleString('en-US') },
            },
        ],
    }), [data]);

    return (
        <>
            <ReactECharts option={chartOptions} style={{ height: 360, width: 1600 }} notMerge lazyUpdate />
        </>
    )
}