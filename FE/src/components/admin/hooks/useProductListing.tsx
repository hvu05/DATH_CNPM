import { type TablePaginationConfig } from 'antd';
import type { FilterValue, TableCurrentDataSource } from 'antd/es/table/interface';
import { useCallback, useEffect, useState } from 'react';
import {
    getAllProductsAPI,
    updateProductStatusAPI,
} from '@/services/admin/products/admin.product.api';

/**
 * Hook for Product Listing page
 * - Load ONLY active products (is_active = true)
 * - Handle unpublish products
 */
export const useProductListing = () => {
    const [dataTable, setDataTable] = useState<IProduct[]>([]);
    const [unpublishLoading, setUnpublishLoading] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        sortBy: 'create_at',
        sortOrder: 'desc',
        search: '',
        isActive: [true], // Only active products
    });
    const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);

    const loadProducts = useCallback(
        async (params?: any) => {
            try {
                const queryParams = { ...filters, ...params, isActive: [true] };
                const result = await getAllProductsAPI(queryParams);
                if (result.data) {
                    setDataTable(result.data.results);
                    setMeta({
                        total: result.data.total,
                        page: result.data.page,
                        limit: result.data.limit,
                    });
                }
            } catch (error) {
                console.error('Failed to load products:', error);
            }
        },
        [filters]
    );

    const refreshProducts = useCallback(async () => {
        await loadProducts();
    }, [loadProducts]);

    const handleSearch = useCallback(
        (value: string) => {
            const newFilters = { ...filters, search: value || undefined, page: 1 };
            loadProducts(newFilters);
        },
        [filters, loadProducts]
    );

    const handleTableChange = useCallback(
        async (
            pagination: TablePaginationConfig,
            tableFilters: Record<string, FilterValue | null>,
            sorter: any,
            extra: TableCurrentDataSource<IProduct>
        ) => {
            const { current, pageSize } = pagination;
            const newFilters = {
                ...filters,
                page: current,
                limit: pageSize,
            };

            if (sorter.field && sorter.order) {
                newFilters.sortBy = sorter.field;
                newFilters.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
            }

            await loadProducts(newFilters);
        },
        [filters, loadProducts]
    );

    const handleUnpublishProduct = async (productId: string) => {
        setUnpublishLoading(productId);
        try {
            const result = await updateProductStatusAPI(productId, false);
            if (result.success) {
                await refreshProducts();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to unpublish product:', error);
            return false;
        } finally {
            setUnpublishLoading(null);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return {
        dataTable,
        filters,
        handleSearch,
        refreshProducts,
        meta,
        handleTableChange,
        handleUnpublishProduct,
        unpublishLoading,
    };
};
