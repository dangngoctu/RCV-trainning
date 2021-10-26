import Home from './components/Home';
import Login from './components/Login';
import Product from './components/Product';
import Customer from './components/Customer';
import { BrowserRouter as Router} from "react-router-dom";
import PrivateRoutes from './utils/PrivateRoutes';
import PublicRoutes from './utils/PublicRoutes';

function App() {
	return (
		<div className="App">
		<Router>
			<PublicRoutes exact path="/" component={Login} />
			<PrivateRoutes path="/home" component={Home} />
			<PrivateRoutes path="/Product" component={Product} />
			<PrivateRoutes path="/Customer" component={Customer} />
		</Router>
		</div>
	);
}

export default App;
