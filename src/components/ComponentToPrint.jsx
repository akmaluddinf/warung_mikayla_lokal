import React from 'react'

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { cart, totalAmount, uangBayar } = props;

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

  return (
    <div ref={ref} className='p-5'>
      <div className='row' style={{ textAlign: "center"}}>
        <div className='col'><b><h4>Warung Mikayla</h4></b></div>
        {/* <div className='col'><b><h4>Warung Mikayla</h4></b></div>
        <div className='col'><b><h4>Warung Mikayla</h4></b></div> */}
      </div>
      <hr />
      <table className='table'>
        <thead>
          <tr>
            <td><b>Kode Barang</b></td>
            <td><b>Nama Barang</b></td>
            <td><b>Harga</b></td>
            <td><b>Banyaknya</b></td>
            <td><b>Total</b></td>
          </tr>
        </thead>
        <tbody>
          {cart ? cart.map((cartProduct, key) => <tr key={key}>
            <td>{cartProduct.id}</td>
            <td>{cartProduct.name}</td>
            <td><CurrencyFormatter value={cartProduct.price} /></td>
            <td>{cartProduct.quantity}</td>
            <td><CurrencyFormatter value={cartProduct.totalAmount} /></td>
          </tr>)

            : ''}
        </tbody>
      </table>

      <div className='row'>
        <div className='col-md-6'>
          <p></p>
        </div>
        <div className='col-md-6'>
          <div className='row' style={{marginBottom: "-15px"}}>
            <div className='col-md-6'><p style={{ textAlign: 'right' }}>Total Harga: </p></div>
            <div className='col-md-6'><p style={{ textAlign: 'right', color: "red" }}><b><CurrencyFormatter value={totalAmount} /></b></p></div>
          </div>
          <div className='row' style={{marginBottom: "-15px"}}>
            <div className='col-md-6'><p style={{ textAlign: 'right' }}>Dibayar: </p></div>
            <div className='col-md-6'><p style={{ textAlign: 'right' }}><b><CurrencyFormatter value={uangBayar} /></b></p></div>
          </div>
          <div className='row' style={{marginBottom: "-15px"}}>
            <div className='col-md-6'><p style={{ textAlign: 'right' }}>Kembalian: </p></div>
            <div className='col-md-6'><p style={{ textAlign: 'right', color: "green" }}><b><CurrencyFormatter value={uangBayar - totalAmount} /></b></p></div>
          </div>
        </div>
      </div>

    </div>
  );
});