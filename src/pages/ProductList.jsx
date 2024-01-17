// ProductList.js
import React from 'react';
import Product from './Product';

const ProductList = ({ products, onEdit, onDelete, currentPage, productsPerPage }) => {
  const startIndex = (currentPage) * productsPerPage + 1;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <Product key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} index={startIndex + index} />
        ))}
      </tbody>
    </table>
  );
};

export default ProductList;
