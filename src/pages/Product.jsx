// Product.js
import React from 'react';

const Product = ({ product, onEdit, onDelete, index }) => {
  return (
    <tr>
      <td>{index}</td>
      <td>{product.name}</td>
      <td>{product.price}</td>
      <td>{product.stock}</td>
      <td>
        <img src={product.image} alt={product.name} style={{ maxWidth: '50px', maxHeight: '50px' }} />
      </td>
      <td>
        <button className="btn btn-primary btn-sm" onClick={() => onEdit(product.id)} style={{marginRight: "10px"}}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(product.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default Product;