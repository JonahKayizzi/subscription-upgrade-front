import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SubscribersTable from './components/SubscribersTable';
import SubscriptionForm from './components/SubscriptionForm';
// import AddSubscriptionPage from './components/AddSubscriptionPage';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

function App() {
  const token = useSelector(state => state.auth.token);

  if (!token) {
    // Show only the login page if not authenticated
    return <Login />;
  }

  // Show the main app if authenticated
  return (
    <div className="App">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscribers" element={<SubscribersTable />} />
          <Route path="/subscriber/:id/add-subscription" element={<SubscriptionForm />} />
          <Route path="/subscriber/:id/edit-subscription/:subscriptionId" element={<SubscriptionForm />} />
          {/* <Route path="/add-subscription" element={<AddSubscriptionPage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
