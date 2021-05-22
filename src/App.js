
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import MonitoringTable from './components/MonitoringTable/MonitoringTable'

function App() {
  return (
    <div className="App">
      <header className="container-fluid mt-4">
        <MonitoringTable/>
      </header>
    </div>
  );
}

export default App;
