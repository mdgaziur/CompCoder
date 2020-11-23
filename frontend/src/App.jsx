import React from 'react';
import './style/main.scss';
import 'boxicons';

//Import all the components
import Sidebar from './components/sidebar/sidebar';
import Home from './components/home/home';
import PreLoader from './components/preloader/preloader';

function App() {
	let [isLoadingFinished, setIsLoadingFinished] = React.useState(false);

	// eslint-disable-next-line
	React.useEffect(() => {
		setIsLoadingFinished(true);
	});

	React.useEffect(() => {
		if(!isLoadingFinished) {
			document.body.style.overflow="hidden";
		} else {
			document.body.style.overflow="auto";
		}
	}, [isLoadingFinished]);
	return (
		<div className="App">
			{
				!isLoadingFinished &&
				<PreLoader />
			}
			<Sidebar />
			<div className="body-container">
				<Home />
			</div>
		</div>
	);
}

export default App;
