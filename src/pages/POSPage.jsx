import React, { useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout'
import axios from 'axios';
import { toast } from 'react-toastify';
import { ComponentToPrint } from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';

function POSPage() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [uangBayar, setUangBayar] = useState('');

  const toastOptions = {
    autoClose: 1000,
    pauseOnHover: true,
    closeOnClick: true
  }

  //format rupiah
  const CurrencyFormatter = ({ value }) => {
    // Format nilai menjadi Rupiah
    const formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0, // Atur maksimal dua digit di belakang koma
    }).format(value);

    return <span>{formattedValue}</span>;
  };


  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await axios.get('https://json-server-vercel-sable.vercel.app/products');
    setProducts(await result.data);
    setIsLoading(false);
  }

  const addProductToCart = async (product) => {
    // console.log(product);
    //check if the adding product exist
    let findProductInCart = await cart.find(i => {
      return i.id === product.id
    })

    if (findProductInCart) {
      let newCart = [];
      let newItem;

      cart.forEach(cartItem => {
        if (cartItem.id === product.id && product.stock > 0) {
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: cartItem.price * (cartItem.quantity + 1)
          }
          newCart.push(newItem);
        } else {
          newCart.push(cartItem);
        }
      })

      setCart(newCart);

      if (product.stock > 0) {
        toast(`Menambahkan ${newItem.name} ke keranjang`, toastOptions)
      }

      // Update stock when a product is added to the cart
      const updatedStock = product.stock - 1;
      updateProductStock(product.id, updatedStock);

    } else {
      if (product.stock === 0) {
        toast.error(`Stok habis!!`, toastOptions);
      } else {
        let addingProduct = {
          ...product,
          'quantity': 1,
          'totalAmount': product.price,
        }
        setCart([...cart, addingProduct]);
        toast(`Menambahkan ${product.name} ke keranjang`, toastOptions)

        // Update stock when a new product is added to the cart
        const updatedStock = product.stock - 1;
        updateProductStock(product.id, updatedStock);
      }
    }

  }

  const updateProductStock = async (productId, newStock) => {
    // Pastikan stok tidak menjadi nilai negatif
    const updatedStock = Math.max(newStock, 0);

    await axios.patch(`https://json-server-vercel-sable.vercel.app/products/${productId}`, { stock: updatedStock });
    fetchProducts(); // Fetch updated products

    // Menampilkan toast jika stok habis
    if (updatedStock === 0) {
      toast.error(`Stok habis!!`, toastOptions);
    }
  };

  const removeProduct = async (product) => {

    console.log("Before remove - product:", product);
    // const updatedStock = product.stock + product.quantity;
    const updatedStock = product.stock + 0;
    console.log("Updated stock:", updatedStock);

    updateProductStock(product.id, updatedStock);

    const newCart = cart.filter(cartItem => cartItem.id !== product.id);
    setCart(newCart);
    setUangBayar('')
  }

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint();
  }

  const handleUangBayar = (event) => {
    console.log(event.target.value);
    setUangBayar(event.target.value);
  }

  useEffect(() => {
    fetchProducts()
  }, []);

  useEffect(() => {
    let newTotalAmount = 0
    cart.forEach(icart => {
      newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
    })
    setTotalAmount(newTotalAmount);
  }, [cart]);

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className='row'>
        <div className='col-lg-7' style={{ marginBottom: '30px' }}>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" id="searchBarang" placeholder="Cari Barang" onChange={(e) => setSearchQuery(e.target.value)} />
            <label htmlFor="searchBarang">Masukkan Nama Barang</label>
          </div>

          {isLoading ? 'Loading' : <div className='row' style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredProducts.map((product, key) =>
              <div key={key} className='col-lg-3 col-md-4 col-sm-6 mb-3' style={{ marginTop: '10px' }}>
                <div className='pos-item px-3 text-center border position-relative' onClick={() => addProductToCart(product)}>
                  {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {product.stock}
                  </span> */}
                  <p style={{height: "55px", fontSize: "14px"}}>{product.name}</p>
                  <img src={product.image} className='img-fluid' alt="" style={{ width: '70px', height: '100px' }} />
                  <p style={{ marginBottom: '0px' }}><CurrencyFormatter value={product.price} /></p>
                  {product.stock < 1 ? <span style={{ marginBottom: '5px' }} className="badge text-bg-danger">Stok: {product.stock}</span> : product.stock < 21 ? <span style={{ marginBottom: '5px' }} className="badge text-bg-warning">Stok: {product.stock}</span> : <span style={{ marginBottom: '5px' }} className="badge text-bg-success">Stok: {product.stock}</span>}
                </div>
              </div>
            )}
          </div>}
        </div>

        <div className='col-lg-5' style={{ marginBottom: '30px' }}>
          <div style={{ display: "none" }}>
            <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef} uangBayar={uangBayar} />
          </div>
          <div className='table-resvonsive bg-dark'>
            <table className='table table-resvonsive table-dark table-hover'>
              <thead>
                <tr>
                  <td>Kode Barang</td>
                  <td>Nama Barang</td>
                  <td>Harga</td>
                  <td>Banyaknya</td>
                  <td>Total</td>
                  <td>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {cart ? cart.map((cartProduct, key) => <tr key={key}>
                  <td>{cartProduct.id}</td>
                  <td>{cartProduct.name}</td>
                  <td><CurrencyFormatter value={cartProduct.price} /></td>
                  <td>{cartProduct.quantity}</td>
                  <td><CurrencyFormatter value={cartProduct.totalAmount} /></td>
                  <td>
                    <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct)}>Hapus</button>
                  </td>
                </tr>)

                  : 'Tidak ada barang di keranjang'}
              </tbody>
            </table>
            <h2 className='px-2 text-white'>Total Harga: <span style={{color: "red"}}><CurrencyFormatter value={totalAmount} /></span></h2>
          </div>

          <div className='mt-3' style={{textAlign: "center"}}>
            {
              totalAmount !== 0 ? <div>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="kembalian" placeholder="Cari Barang" onChange={handleUangBayar} />
                  <label htmlFor="kembalian">Masukkan Uang Bayar</label>
                </div>

                {/* {uangBayar > totalAmount ? <p>Kembalian: <CurrencyFormatter value={uangBayar - totalAmount} /></p> : <p>Kembalian: </p>} */}

                {/* {uangBayar > totalAmount ? <div className="badge bg-info" style={{ marginBottom: "20px"}}>Kembalian: <b><span style={{color: "green"}}><CurrencyFormatter value={uangBayar - totalAmount} /></span></b></div> : <div className="badge bg-info" style={{ marginBottom: "20px"}}>Kembalian: <b><span style={{color: "red"}}>Uang yang dibayarkan kurang!</span></b></div>} */}

                {uangBayar > totalAmount ? <div className="badge bg-info" style={{ marginBottom: "20px", width: "100%", height: "50px", fontSize: "xx-large"}}>Kembalian: <b><span style={{color: "green"}}><CurrencyFormatter value={uangBayar - totalAmount} /></span></b></div> : uangBayar !== "" ? <div className="badge bg-info" style={{ marginBottom: "20px", width: "100%", height: "50px", fontSize: "18px"}}>Kembalian: <b><span style={{color: "red"}}>Uang yang dibayarkan kurang!</span></b></div>: ""}

                <button style={{ width: '100%' }} className='btn btn-success' onClick={handlePrint}><b>BAYAR SEKARANG</b></button>
                <a href='/penjualan' style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }} className='btn btn-primary'><b>BELANJA LAGI</b></a>
              </div> : <div style={{ textAlign: "center" }}><img src="cart4.gif" alt="cart" style={{ width: "400px", height: "200px", backgroundColor: 'lightblue', borderRadius: "10px" }} /><div className="badge bg-danger" style={{ width: "300px", marginTop: "10px"}}>Silakan tambahkan barang kedalam keranjang!</div></div>
            }
          </div>


        </div>
      </div>
    </MainLayout>
  )
}

export default POSPage