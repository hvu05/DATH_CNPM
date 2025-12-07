import { message, type TablePaginationConfig } from 'antd';
import type { FilterValue, TableCurrentDataSource } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import {
    deleteProductByID,
    getAllCategoriesAPI,
    getAllProductsAPI,
    getBrandsAPI,
    getSeriesAPI,
    updateProductStatusAPI,
} from '@/services/admin/products/admin.product.api';
import type { IBrand, IProduct } from '@/types/admin/product';

/**
 * Hook for Warehouse page
 * - Load ALL products (both active and inactive)
 * - Handle publish/unpublish products
 */
export const useWarehouse = () => {
    const [dataTable, setDataTable] = useState<IProduct[]>([]);
    const [categoriesList, setCategoriesList] = useState<{ value: string; label: string }[]>([]);
    const [brandsList, setBrandsList] = useState<IBrand[]>([]);
    const [openAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [openEditModal, setIsOpenEditModal] = useState<boolean>(false);
    const [editingProductId, setEditingProductId] = useState<number | string | null>(null);
    const [series, setSeries] = useState<{ id: number; name: string; brand_id: number }[]>([]);
    const [publishLoading, setPublishLoading] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        sortBy: 'create_at',
        sortOrder: 'desc',
        search: '',
        category: '',
        is_active: [true, false],
    });
    const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);

    const loadProducts = async (params?: any) => {
        try {
            const queryParams = params || filters;
            // Load ALL products (no isActive filter)
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
    };

    const refreshProducts = async () => {
        await loadProducts();
    };

    const handleSearch = (value: string) => {
        const newFilters = { ...filters, search: value || '', page: 1 };
        setFilters(newFilters);
        loadProducts(newFilters);
    };

    const handleTableChange = async (
        pagination: TablePaginationConfig,
        tableFilters: Record<string, FilterValue | null>,
        sorter: any,
        extra: TableCurrentDataSource<IProduct>
    ) => {
        console.log('[Check] table filters: ', tableFilters);
        console.log('[Check] extra: ', extra);
        const { current, pageSize } = pagination;
        const newFilters = {
            ...filters,
            page: current,
            limit: pageSize,
            category: tableFilters['category'],
            is_active: tableFilters['is_active'],
        };

        if (sorter.field && sorter.order) {
            newFilters.sortBy = sorter.field;
            newFilters.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
        }

        await loadProducts(newFilters);
    };

    const handlePublishProduct = async (productId: string, isActive: boolean) => {
        setPublishLoading(productId);
        try {
            const result = await updateProductStatusAPI(productId, isActive);
            if (result.success) {
                await refreshProducts();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to update product status:', error);
            return false;
        } finally {
            setPublishLoading(null);
        }
    };

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

    // Refresh categories, brands, series options
    const refreshSelectOptions = () => {
        loadSelectOptions();
    };

    // Handle opening edit modal
    const handleOpenEditModal = (productId: number | string) => {
        setEditingProductId(productId);
        setIsOpenEditModal(true);
    };

    // Handle closing edit modal
    const handleCloseEditModal = () => {
        setEditingProductId(null);
        setIsOpenEditModal(false);
    };

    const handleDeleteProduct = async (productId: string | number) => {
        try {
            const result = await deleteProductByID(productId);
            if (result.data) {
                message.success('Xóa sản phẩm thành công');
                refreshProducts();
            }
        } catch (error: any) {
            console.error(error);
            message.error(`${error.response.data.error}`);
        }
    };

    return {
        dataTable,
        filters,
        handleSearch,
        refreshProducts,
        meta,
        handleTableChange,
        openAddModal,
        setIsOpenAddModal,
        openEditModal,
        setIsOpenEditModal,
        editingProductId,
        handleOpenEditModal,
        handleCloseEditModal,
        categoriesList,
        brandsList,
        series,
        handlePublishProduct,
        publishLoading,
        refreshSelectOptions,
        handleDeleteProduct,
    };
};
