import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Form from './components/Form';
import Pages from './pages/Pages';
import Pricing from './pages/Pricing';
import Nav from './components/Nav';
import Sidebar from './pages/Sidebar';
import Steps from './pages/Steps';
import QuizApp from './QuizLogic/Quiz';
import ScorePage from './QuizLogic/ScorePage';

const App = () => {

   
    return (
        <Router>
          
            <Routes>
            
                <Route path="/signup" element={<Form />} />
                <Route path="/login" element={<Login />} />
               <Route path="/" element={<Pages/>} />
               <Route path="/pricing" element={<Pricing/>}/>
               <Route path="/profile" element={<Sidebar/>}/>
               <Route path="/Steps" element={<Steps/>}/>
               <Route path="/quiz" element={<QuizApp/>}/>
               <Route path="/score" element={<ScorePage/>}/>
               
            </Routes>
            
        </Router>

    );
};

export default App;