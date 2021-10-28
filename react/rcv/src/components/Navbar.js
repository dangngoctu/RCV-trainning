import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <Link to="/home">
                    <span href="#" className="brand-link">
                        <img src="dist/img/sidebar.png" alt="RiverCrane Logo" />
                    </span>
                </Link>
                {/* Sidebar */}
                <div className="sidebar">
         
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <Link to="/product">
                                <li className="nav-item">
                                    <span href="pages/gallery.html" className="nav-link">
                                        <i className="fas fa-box"></i>
                                        <p>
                                            Sản phẩm
                                        </p>
                                    </span>
                                </li>
                            </Link>
                            <Link to="/customer">
                                <li className="nav-item">
                                    <span href="pages/gallery.html" className="nav-link">
                                        <i className="fas fa-user-tie"></i>
                                        <p>
                                            Khách hàng
                                        </p>
                                    </span>
                                </li>
                            </Link>
                            <Link to="/user">
                                <li className="nav-item">
                                    <span href="pages/gallery.html" className="nav-link">
                                        <i className="fas fa-user"></i>
                                        <p>
                                            User
                                        </p>
                                    </span>
                                </li>
                            </Link>
                            <Link to="/order">
                                <li className="nav-item">
                                    <span href="pages/gallery.html" className="nav-link">
                                        <i className="fas fa-boxes"></i>
                                        <p>
                                            Đơn hàng
                                        </p>
                                    </span>
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
