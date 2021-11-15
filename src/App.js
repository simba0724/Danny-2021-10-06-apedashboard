import React, { useState } from 'react';
import './App.css';
import { Landing } from './layouts/Landing';
import { NavBar } from './layouts/NavBar';
import { Dashboard } from './layouts/Dashboard';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {

	return (
		<div className="App">
			<Router>
				<NavBar />
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/dashboard">
						<Dashboard />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
