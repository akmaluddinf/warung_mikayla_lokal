import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import MainLayout from '../layouts/MainLayout';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MasterDataPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Menghitung jumlah halaman total
  const totalPages = Math.ceil(products.length / productsPerPage);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handleAddProduct = (newProduct) => {
    axios.post('http://localhost:5000/products', newProduct)
      .then((response) => {
        setProducts([...products, response.data]);
        setIsAdding(false); // Setelah menambah, kembali ke mode normal
        setEditingProduct(null);
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  const handleEditProduct = (editedProduct) => {
    axios.put(`http://localhost:5000/products/${editedProduct.id}`, editedProduct)
      .then(() => {
        setProducts(products.map((product) => (product.id === editedProduct.id ? editedProduct : product)));
        setEditingProduct(null);
        setIsAdding(false); // Setelah mengedit, kembali ke mode normal
      })
      .catch((error) => console.error('Error editing product:', error));
  };

  const handleDeleteProduct = (productId) => {
    axios.delete(`http://localhost:5000/products/${productId}`)
      .then(() => setProducts(products.filter((product) => product.id !== productId)))
      .catch((error) => console.error('Error deleting product:', error));
  };

  const handleEditButtonClick = (productId) => {
    // Panggil fungsi getProductById untuk mendapatkan data produk berdasarkan ID
    axios.get(`http://localhost:5000/products/${productId}`)
      .then((response) => {
        // setEditingProduct(response.data);
        setEditingProduct((prevEditingProduct) => (prevEditingProduct === productId ? null : productId));
        setIsAdding(false);
      })
      .catch((error) => console.error('Error fetching product by ID:', error));
  };

  const handleAddButtonClick = () => {
    setIsAdding(true);
    // setEditingProduct(null); 
    if (!isAdding && editingProduct === null) {
      setEditingProduct(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  });


  // Hitung indeks data yang akan ditampilkan di halaman saat ini setelah pencarian
  const indexOfLastProduct = (currentPage + 1) * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleProductsPerPageChange = (event) => {
    setProductsPerPage(Number(event.target.value));
    setCurrentPage(0); // Set halaman kembali ke halaman pertama ketika mengubah jumlah produk per halaman
  };

  return (
    <MainLayout>
      <div className="container mt-5">
        <h1 className="mb-4">Product CRUD App</h1>
        <div>
          <button className="btn btn-success mb-3" onClick={handleAddButtonClick}>
            Tambah Data
          </button>
        </div>
        {(isAdding || editingProduct) && (
          <ProductForm
            onSubmit={isAdding ? handleAddProduct : handleEditProduct}
            initialProduct={isAdding ? {} : (products.find(product => product.id === editingProduct) || {})}
          />
        )}

        <div className='row'>
          <div className='col'>
            <div className="mb-3">
              <label>Search:</label>
              <input
                type="text"
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='col' style={{display: "flex", alignItems: "center"}}>
            {searchTerm && (
              <FontAwesomeIcon icon={faTimes} onClick={() => setSearchTerm('')} style={{cursor: "pointer"}}/>
            )}
          </div>
        </div>

        <ProductList products={currentProducts} onEdit={handleEditButtonClick} onDelete={handleDeleteProduct} currentPage={currentPage} productsPerPage={productsPerPage} />

        <div className='row'>
          <div className='col'>Jumlah Data: {products.length}</div>
          <div className='col'>
            <div className="mb-3">
              <select
                className="form-select"
                value={productsPerPage}
                onChange={handleProductsPerPageChange}
              >
                <option value={5}>5 baris</option>
                <option value={10}>10 baris</option>
                <option value={25}>25 baris</option>
                <option value={50}>50 baris</option>
                <option value={100}>100 baris</option>
                <option value={500}>500 baris</option>
                <option value={1000}>1000 baris</option>
              </select>
            </div>
          </div>
          <div className='col'>
            <ReactPaginate
              forcePage={currentPage}
              pageCount={totalPages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="pagination justify-content-center" // Bootstrap class
              pageClassName="page-item" // Bootstrap class
              pageLinkClassName="page-link" // Bootstrap class
              previousClassName="page-item" // Bootstrap class
              nextClassName="page-item" // Bootstrap class
              previousLinkClassName="page-link" // Bootstrap class
              nextLinkClassName="page-link" // Bootstrap class
              breakClassName="page-item" // Bootstrap class
              breakLinkClassName="page-link" // Bootstrap class
              activeClassName="active"
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
            />
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default MasterDataPage;
