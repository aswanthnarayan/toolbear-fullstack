import React from 'react';
import {
    useGetTopSellingProductsQuery,
    useGetTopSellingCategoriesQuery,
    useGetTopSellingBrandsQuery,
} from '../../../App/features/rtkApis/adminApi';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

const TopSelling = () => {
    const { data: topProducts, isLoading: productsLoading } = useGetTopSellingProductsQuery();
    const { data: topCategories, isLoading: categoriesLoading } = useGetTopSellingCategoriesQuery();
    const { data: topBrands, isLoading: brandsLoading } = useGetTopSellingBrandsQuery();
    

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const renderTable = (data, type) => {
        if (!data?.data) return <div>No data available</div>;

        return (
            <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="bg-blue-gray-50">
                            <th className="p-4 border-b border-blue-gray-100">Rank</th>
                            <th className="p-4 border-b border-blue-gray-100">
                                {type === 'products' ? 'Product Name' : 
                                 type === 'categories' ? 'Category' : 'Brand'}
                            </th>
                            <th className="p-4 border-b border-blue-gray-100">Quantity Sold</th>
                            <th className="p-4 border-b border-blue-gray-100">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((item, index) => (
                            <tr key={item._id || index} className={index % 2 === 0 ? 'bg-blue-gray-50/50' : ''}>
                                <td className="p-4 border-b border-blue-gray-50">#{index + 1}</td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    {item.name || item.category || item.brand}
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    {item.totalQuantity}
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    {formatCurrency(item.totalRevenue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const tabsData = [
        {
            label: "Top Products",
            value: "products",
            loading: productsLoading,
            content: renderTable(topProducts, 'products')
        },
        {
            label: "Top Categories",
            value: "categories",
            loading: categoriesLoading,
            content: renderTable(topCategories, 'categories')
        },
        {
            label: "Top Brands",
            value: "brands",
            loading: brandsLoading,
            content: renderTable(topBrands, 'brands')
        }
    ];

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold mb-4">Top Selling Items</h2>
            <Tabs value="products">
                <TabsHeader>
                    {tabsData.map(({ label, value }) => (
                        <Tab key={value} value={value}>
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody>
                    {tabsData.map(({ value, content, loading }) => (
                        <TabPanel key={value} value={value}>
                            {loading ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                content
                            )}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    );
};

export default TopSelling;