import React from 'react'
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom'
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast'
import { DashboardLayout } from './components/layout/DashboardLayout';
import { store } from './store';
import { MessageInbox } from './components/messages/MessageInbox';
import { PrivateRoute } from './components/auth/PrivateRoute';
import {LandingPage} from './components/pages/LandingPage'
import { LogoutSuccess } from './components/pages/LogoutSuccess';


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/inbox"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <MessageInbox />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route path="/logout" element={<LogoutSuccess />} />
        </Routes>
      </Router>
    </Provider>
  );
}
// const App = () => {
//   return (
//     <Router>
//       <Toaster/>
//       <LandingPage/>
//     </Router>
//   )
// }

export default App