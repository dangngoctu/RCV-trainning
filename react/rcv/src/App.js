import Home from './components/Home';
import Login from './components/Login';
import Product from './components/Product';
import Customer from './components/Customer';
import User from './components/User';
import { BrowserRouter as Router} from "react-router-dom";
import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';

function App() {
	return (
		<div className="App">
		<Router>
			<PublicRoutes exact path="/" component={Login} />
			<PrivateRoutes path="/home" component={Home} />
			<PrivateRoutes path="/product" component={Product} />
			<PrivateRoutes path="/customer" component={Customer} />
			<PrivateRoutes path="/user" component={User} />
		</Router>
		</div>
	);
}

export default App;
