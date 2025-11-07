import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

type GrowthPoint = {
    period: string;
    users: number;
    orders: number;
};

export const GrowthChart = ({ data }: { data: GrowthPoint[] }) => {
    const option = useMemo(() => {
        const categories = data.map((point) => point.period);
        const usersSeries = data.map((point) => point.users);
        const ordersSeries = data.map((point) => point.orders);

        return {
            tooltip: { trigger: 'axis' },
            legend: {
                data: ['Người dùng', 'Đơn hàng'],
                icon: 'circle',
            },
            grid: { top: 40, right: 16, bottom: 36, left: 48 },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: { alignWithLabel: true },
                axisLine: { lineStyle: { color: '#d9d9d9' } },
                data: categories,
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#d9d9d9' } },
                splitLine: { lineStyle: { type: 'dashed', color: '#e6e6e6' } },
            },
            series: [
                {
                    name: 'Người dùng',
                    type: 'line',
                    smooth: true,
                    data: usersSeries,
                    showSymbol: false,
                    lineStyle: { width: 3, color: '#1677ff' },
                    itemStyle: { color: '#1677ff' },
                },
                {
                    name: 'Đơn hàng',
                    type: 'line',
                    smooth: true,
                    data: ordersSeries,
                    showSymbol: false,
                    lineStyle: { width: 3, color: '#52c41a' },
                    itemStyle: { color: '#52c41a' },
                },
            ],
        };
    }, [data]);

    return <ReactECharts option={option} style={{ height: '260px', width: 1500 }} />;
};