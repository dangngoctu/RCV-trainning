import Home from './components/Home';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import PrivateRoutes from './utils/PrivateRoutes';

function App() {
	return (
		<Router>
			<div className="App">
				<Route exact path="/" component={Login} />
				<Route path="/home" component={Home} />
			</div>
		</Router>
	);
}

export default App;
