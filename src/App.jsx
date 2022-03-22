
import Intro from "./components/intro/Intro"

import Topbar from "./components/topbar/Topbar"

import "./app.scss"



function App() {
  
  return (
    <div className="App">
      <Topbar/>
            <div className="section">
        <Intro/>
              </div>

    </div>
   
  );
}

export default App;
