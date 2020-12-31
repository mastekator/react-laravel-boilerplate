// React
import React from 'react'

// Third-party
import {Switch, Redirect} from 'react-router'

// Typescript
import {IRoute} from '../../routes/IRoute'

// App
import RouteWithSubRoutes from './RouteWithSubRoutes'

interface IProps {
    routes: IRoute[];
}

const Router: React.FC<IProps> = ({routes}) => {
    return <Switch>
        {routes && routes.map((route: IRoute) => <RouteWithSubRoutes key={route.path} {...route} />)}
        <Redirect to='/'/>
    </Switch>
}

export default Router
