import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialProduct }) => {
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name:</label>
        <input type="text" className="form-control" name="name" value={product.name} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Price:</label>
        <input type="number" className="form-control" name="price" value={product.price} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Stock:</label>
        <input type="number" className="form-control" name="stock" value={product.stock} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Image URL:</label>
        <input type="text" className="form-control" name="image" value={product.image} onChange={handleChange} />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default ProductForm;
