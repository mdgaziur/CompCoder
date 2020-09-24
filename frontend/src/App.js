import React from 'react';
import './style/main.scss';
import 'boxicons';

//Import all the components
import Sidebar from './components/sidebar';
import Home from './components/home';

function App() {
	return (
		<div className="App">
			<Sidebar />
			<div className="body-container">
				<Home />
			</div>
		</div>
	);
}

export default App;
