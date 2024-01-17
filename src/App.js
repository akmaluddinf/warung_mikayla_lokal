import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import POSPage from './pages/POSPage';
import MasterDataPage from './pages/MasterDataPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/penjualan' element={<POSPage/>}/>
          <Route path='/masterData' element={<MasterDataPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
