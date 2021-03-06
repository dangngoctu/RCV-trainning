import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getToken } from './Common';

const PrivateRoutes = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render = {props => {
                return getToken() ? <Component {...props} /> : <Redirect to ={{pathname: '/'}}/>
            }}
        />
    )
}

export default PrivateRoutes
