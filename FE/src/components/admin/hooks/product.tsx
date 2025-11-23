import { type TablePaginationConfig } from 'antd';
import type { FilterValue, TableCurrentDataSource } from 'antd/es/table/interface';
import type { IProduct, IProductStatics } from '@/pages/admin/admin.products';
import { useCallback, useEffect, useState } from 'react';
import {
    getAllCategoriesAPI,
    getAllProductsAPI,
    getBrandsAPI,
    getSeriesAPI,
    type IBrand,
} from '@/services/admin/products/admin.product.api';

export const useProductsPage = () => {
    const [dataTable, setDataTable] = useState<IProduct[]>([]);
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
    const [categoriesList, setCategoriesList] = useState<{ value: string; label: string }[]>([]);
    const [brandsList, setBrandsList] = useState<IBrand[]>([]);
    const [openAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [series, setSeries] = useState<{ id: number; name: string; brand_id: number }[]>([]);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        sortBy: 'create_at',
        sortOrder: 'desc',
        search: '',
    });
    const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);
    const [statistics, setStatistics] = useState<IProductStatics>({
        totalProducts: 0,
        activeProducts: 0,
        totalSold: 0,
        totalRevenue: 0,
    });

    const handleEditProduct = (record: IProduct) => {
        setCurrentProduct(record);
        // setIsOpenUpdateModal(true); // Uncomment when you have a modal
    };

    const loadProducts = useCallback(
        async (params?: any) => {
            try {
                // Simulate API call with fake data
                const queryParams = params || filters;
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
            // setFilters(newFilters);
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
                category: tableFilters.category as string[] | null,
                status: tableFilters.status as string[] | null,
                page: current,
                limit: pageSize,
            };

            if (sorter.field && sorter.order) {
                newFilters.sortBy = sorter.field;
                newFilters.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
            }

            // setFilters(newFilters);
            await loadProducts(newFilters);
        },
        [filters, loadProducts]
    );

    const loadSelectOptions = async () => {
        try {
            const [categories, brands, _series] = await Promise.all([
                getAllCategoriesAPI(),
                getBrandsAPI(),
                getSeriesAPI(),
            ]);

            if (categories.data) {
                setCategoriesList(
                    categories.data.results.map(item => ({
                        value: item.id.toString(),
                        label: item.name,
                    }))
                );
            }

            if (brands.data) {
                setBrandsList(brands.data.results);
            }

            if (_series.data) {
                setSeries(_series.data.results);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadProducts();
        loadSelectOptions();
    }, []);

    return {
        dataTable,
        currentProduct,
        filters,
        handleEditProduct,
        setCurrentProduct,
        handleSearch,
        refreshProducts,
        statistics,
        meta,
        handleTableChange,
        openAddModal,
        setIsOpenAddModal,
        categoriesList,
        brandsList,
        series,
    };
};
