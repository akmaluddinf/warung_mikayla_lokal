import React from 'react'
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainLayout({children}) {
  return (
    <div>
      <header>
        <nav style={{background: 'rgb(42, 82, 121)'}} className="navbar navbar-light">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand" style={{color: 'white'}}>Warung Mikayla</Link>
          </div>
        </nav>
      </header>
      <main>
        <div className='container mt-3'>
          {children}
        </div>
        <ToastContainer/>
      </main>
    </div>
  )
}

export default MainLayout