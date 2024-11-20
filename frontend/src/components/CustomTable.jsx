import React, { useState } from 'react';
import { FaPencilAlt, FaTrash, FaEye } from 'react-icons/fa';
import gicon from '../assets/google.png';


const CustomTable = ({ thead, products }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [highlightedRow, setHighlightedRow] = useState(null);

    const toggleSelectProduct = (id) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((productId) => productId !== id)
                : [...prevSelected, id]
        );
    };

    const handleRowClick = (id) => {
        setHighlightedRow(id);
    };

    return (
        <div className="container mx-auto p-1 w-full">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search product..."
                    className="border border-gray-300 rounded px-4 py-2 w-1/3"
                />
                <div className="flex space-x-2">
                    <button className="border border-gray-300 rounded px-4 py-2">Filters</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            {thead.map((heading, index) => (
                                <th key={index} className="py-3 px-6 text-left">
                                   <div className='flex items-center justify-between'>
                                   <p> {heading}</p>
                                   <img src = {gicon} alt="" className='h-4' />
                                   </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="text-gray-600 text-sm font-light">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                onClick={() => handleRowClick(product.id)}
                                className={`border-b border-gray-200 hover:bg-gray-100 ${
                                    highlightedRow === product.id ? 'bg-gray-300' : ''
                                }`}
                            >
                                <td className="py-3 px-6 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => toggleSelectProduct(product.id)}
                                    />
                                </td>
                                <td className="py-3 px-6 text-left flex items-center">
                                    <img
                                        src="https://placehold.co/40x40"
                                        alt="Product image"
                                        className="w-10 h-10 rounded-full mr-2"
                                    />
                                    <span>{product.name}</span>
                                </td>
                                <td className="py-3 px-6 text-left text-blue-500">
                                    {product.sku}
                                </td>
                                <td className="py-3 px-6 text-left">{product.category}</td>
                                <td className="py-3 px-6 text-left">{product.brand}</td>
                                <td className="py-3 px-6 text-left">{product.stock}</td>
                                <td className="py-3 px-6 text-left">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            product.added === "LIST"
                                                ? "bg-red-500"
                                                : "bg-green-500"
                                        }`}
                                    >
                                        {product.added}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center space-x-2">
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <FaPencilAlt className="h-4 w-4" />
                                        </button>
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <FaEye className="h-4 w-4" />
                                        </button>
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <span>Showing 1-10 from 100</span>
                <div className="flex space-x-1">
                    <button className="px-3 py-1 border border-gray-300 rounded">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded">3</button>
                    <button className="px-3 py-1 border border-gray-300 rounded">4</button>
                    <button className="px-3 py-1 border border-gray-300 rounded">5</button>
                </div>
            </div>
        </div>
    );
};

export default CustomTable;
