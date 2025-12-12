import { useEffect, useState } from 'react';
import { Card, Col, DatePicker, Row, Space, Statistic, Tag, Typography } from 'antd';
import { RiseOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import type { DatePickerProps } from 'antd/lib';
import { ChartRevenue } from '@/components/admin/chart/chart.revenue';
import { VNCurrencyFormatter } from '@/helpers/format.currency';

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Text } = Typography;
const { RangePicker } = DatePicker;

const fakeData = {
    labels: [
        new Date('2025-10-05T00:00:00.000Z'),
        new Date('2025-10-06T00:00:00.000Z'),
        new Date('2025-10-07T00:00:00.000Z'),
        new Date('2025-10-08T00:00:00.000Z'),
        new Date('2025-10-09T00:00:00.000Z'),
        new Date('2025-10-10T00:00:00.000Z'),
        new Date('2025-10-11T00:00:00.000Z'),
        new Date('2025-10-12T00:00:00.000Z'),
    ],
    series: [
        {
            name: 'Doanh thu',
            data: [
                12_000_000, 28_000_000, 9_500_000, 11_000_000, 14_000_000, 9_000_000, 15_000_000,
                13_200_000,
            ],
        },
        { name: 'Đơn hàng', data: [100, 80, 90, 120, 150, 110, 130, 140] },
    ],
};

export const RevenuePage = () => {
    const [range, setRange] = useState<[Dayjs, Dayjs] | null>(() => {
        const today = dayjs();
        const sevenDaysAgo = today.subtract(100, 'day');
        return [sevenDaysAgo, today];
    });

    const [data, setData] = useState<{
        labels: Date[];
        series: {
            name: string;
            data: number[];
        }[];
    }>(fakeData);

    const customFormat: DatePickerProps['format'] = value => {
        return `${value.format('DD/MM/YYYY')}`;
    };

    useEffect(() => {
        if (!range) {
            setData(fakeData);
            return;
        }

        const [startDate, endDate] = range;
        const filteredLabels = fakeData.labels.filter(date => {
            const dateTime = dayjs(date);
            return (
                dateTime.isSameOrAfter(startDate, 'day') && dateTime.isSameOrBefore(endDate, 'day')
            );
        });

        // lấy indices của labels đã filter
        const indices = filteredLabels.map(filteredLabel =>
            fakeData.labels.findIndex(label => dayjs(label).isSame(dayjs(filteredLabel), 'day'))
        );

        // filter series data theo indices
        const filteredSeries = fakeData.series.map(s => ({
            name: s.name,
            data: indices.map(i => s.data[i]),
        }));

        setData({
            labels: filteredLabels,
            series: filteredSeries,
        });
    }, [range]);

    return (
        <div className="space-y-6">
            {/* Header  */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <RiseOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lí doanh thu</h1>
                            <p className="text-gray-600 mt-1">
                                Tổng quan về doanh thu của cửa hàng
                            </p>
                        </div>
                    </div>
                    {/* <Space wrap>
                        <Button icon={<ReloadOutlined />} onClick={() => { }}>Reset filters</Button>
                        <Button type="primary" icon={<DownloadOutlined />} onClick={() => { }} disabled={true}>Export CSV</Button>
                    </Space> */}
                </div>
            </div>
            {/* Static card  */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card className="shadow-sm" title="Tổng doanh thu">
                        <Statistic
                            value={3_900_000_000}
                            formatter={value => VNCurrencyFormatter.format(Number(value))}
                        />
                        <div className="mt-3 flex items-center gap-2">
                            <Tag color={100 >= 0 ? 'green' : 'red'}>
                                {23 >= 0 ? '+' : ''}
                                {(23).toFixed(1)}%
                            </Tag>
                            <Text type="secondary">so với tuần trước</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card className="shadow-sm" title="Giá trị trung bình trên mỗi đơn hàng">
                        <Statistic
                            value={19_000_000}
                            precision={0}
                            formatter={value => VNCurrencyFormatter.format(Number(value))}
                        />
                        <div className="mt-3 flex items-center gap-2">
                            <Tag color={12 >= 0 ? 'blue' : 'orange'}>
                                {12 >= 0 ? '+' : ''}
                                {(800_000).toFixed(1)}
                            </Tag>
                            <Text type="secondary">So với tuần trước</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card className="shadow-sm" title="Tỉ lệ trả hàng">
                        <Statistic value={2} precision={2} suffix="%" />
                        <div className="mt-3 flex items-center gap-2">
                            <Tag color={-2 >= 0 ? 'blue' : 'orange'}>
                                {-2 >= 0 ? '+' : '-'}
                                {(3).toFixed(1)}%
                            </Tag>
                            <Text type="secondary">So với tuần trước</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm" styles={{ body: { padding: '20px 24px' } }}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <Space wrap>
                        <RangePicker
                            format={customFormat}
                            value={range ?? null}
                            onChange={values => {
                                setRange(values as [Dayjs, Dayjs] | null);
                            }}
                            allowClear
                        />
                    </Space>
                </div>

                <div className="mt-5">
                    <ChartRevenue data={data} />
                </div>
            </Card>
        </div>
    );
};
