import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';
import Home from './pages/Home';
import Webhook from './pages/Webhook';
import JsonViewer from './pages/JsonViewer';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Box minH="100vh" position="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/webhook" element={<Webhook />} />
          <Route path="/jsonviewer" element={<JsonViewer />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
