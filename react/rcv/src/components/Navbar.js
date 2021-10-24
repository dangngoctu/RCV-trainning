import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <Link to="/home">
                    <a className="brand-link">
                        <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                        <span className="brand-text font-weight-light">Training</span>
                    </a>
                </Link>
                {/* Sidebar */}
                <div className="sidebar">
         
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <a href="pages/gallery.html" className="nav-link">
                                    <i className="nav-icon far fa-image" />
                                    <p>
                                        Gallery
                                    </p>
                                </a>
                            </li>
                            <Link to="/product">
                                <li className="nav-item">
                                    <a className="nav-link">
                                        <i className="nav-icon fas fa-columns" />
                                        <p>
                                            Kanban Board
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
