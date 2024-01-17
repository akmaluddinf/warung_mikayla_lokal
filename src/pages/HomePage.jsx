import React from 'react'
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function HomePage() {
  return (
    <MainLayout>
      <div className='bg-light p-5 mt-4 rounded-3'>
        <h1>Selamat Datang di Warung Mikayla</h1>
        <p><b>Alamat:</b> Kp. Lebaksiuh No. 152, RT.05/RW.01, Ciburial, Kec. Cimenyan, Kabupaten Bandung, Jawa Barat 40198</p>
        <p><b>Telepon:</b> 0831-1253-7506</p>
        <Link to='/penjualan' className='btn btn-success' style={{marginBottom: "30px"}}>Klik Disini Untuk Menjual Barang</Link>

        <div><Link to='/masterData' className='btn btn-primary'>Klik Disini Untuk Menambahkan Data Barang</Link></div>
      </div>
    </MainLayout>
  )
}

export default HomePage