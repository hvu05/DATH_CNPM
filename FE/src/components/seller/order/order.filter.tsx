import type { OrderStatus } from '@/services/seller/seller.service';
import { Button, Card, DatePicker, InputNumber, Select, Space, Typography } from 'antd';
import type dayjs from 'dayjs';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface FilterState {
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
    search?: string;
}

interface IProps {
    filters: FilterState;
    setFilters: (v: FilterState) => void;
    applyFilters: () => void;
    resetFilters: () => void;
}

export const OrderFilter = (props: IProps) => {
    const { filters, setFilters, applyFilters, resetFilters } = props;
    return (
        <>
            <Card title="Bộ lọc" size="small" style={{ height: 'fit-content' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Status Filter */}
                    <div>
                        <Text strong>Trạng thái</Text>
                        <Select
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Chọn trạng thái"
                            allowClear
                            value={filters.status}
                            onChange={value => setFilters({ ...filters, status: value as string })}
                            onKeyDown={e => {
                                if (e.code === 'Enter') {
                                    applyFilters();
                                }
                            }}
                            options={
                                [
                                    { value: 'PENDING', label: 'Chờ thanh toán' },
                                    // { value: 'REFUNDED', label: 'Đã hoàn tiền' },
                                    { value: 'PROCESSING', label: 'Đang xử lý' },
                                    { value: 'DELIVERING', label: 'Đang giao' },
                                    { value: 'COMPLETED', label: 'Giao hàng thành công' },
                                    { value: 'RETURN_REQUEST', label: 'Yêu cầu trả hàng' },
                                    { value: 'RETURNED', label: 'Đã trả hàng' },
                                    { value: 'CANCELLED', label: 'Đã hủy' },
                                ] as { value: OrderStatus; label: string }[]
                            }
                        />
                    </div>

                    {/* Price Range */}
                    <div>
                        <Text strong>Khoảng giá</Text>
                        <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                            <InputNumber
                                placeholder="Giá tối thiểu"
                                style={{ width: '100%' }}
                                formatter={value =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                onChange={value =>
                                    setFilters({
                                        ...filters,
                                        minPrice: (value as number) || undefined,
                                    })
                                }
                                onPressEnter={applyFilters}
                            />
                            <InputNumber
                                placeholder="Giá tối đa"
                                style={{ width: '100%' }}
                                formatter={value =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                onChange={value =>
                                    setFilters({
                                        ...filters,
                                        maxPrice: (value as number) || undefined,
                                    })
                                }
                                onPressEnter={applyFilters}
                            />
                        </Space>
                    </div>

                    {/* Date Range */}
                    <div>
                        <Text strong>Khoảng thời gian</Text>
                        <RangePicker
                            style={{ width: '100%', marginTop: 8 }}
                            onChange={dates => setFilters({ ...filters, dateRange: dates as any })}
                            format={'DD-MM-YYYY'}
                        />
                    </div>

                    {/* Action Buttons */}
                    <Space>
                        <Button type="primary" onClick={applyFilters}>
                            Lọc
                        </Button>
                        <Button onClick={resetFilters}>Đặt lại</Button>
                    </Space>
                </Space>
            </Card>
        </>
    );
};
