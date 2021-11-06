import logo from './logo.svg';
import './App.css';
import { Landing } from './layouts/Landing';
import { NavBar } from './layouts/NavBar';
import { Dashboard } from './layouts/Dashboard';
import { useWeb3React } from '@web3-react/core';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Router>
				<NavBar />
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/dashboard" component={Dashboard} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
