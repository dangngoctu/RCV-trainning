import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <Link to="/home">
                    <a href="#" className="brand-link">
                        <img src="dist/img/sidebar.png" alt="RiverCrane Logo" />
                    </a>
                </Link>
                {/* Sidebar */}
                <div className="sidebar">
         
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <Link to="/product">
                                <li className="nav-item">
                                    <a href="pages/gallery.html" className="nav-link">
                                        <i className="nav-icon far fa-image" />
                                        <p>
                                            Sản phẩm
                                        </p>
                                    </a>
                                </li>
                            </Link>
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside>

        </div>
    )
}

export default Navbar
