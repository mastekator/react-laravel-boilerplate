// React
import React, {Suspense, useContext, useEffect} from 'react'

// Third-party
import {ErrorBoundary} from 'react-error-boundary'
import {Redirect, Route, useHistory} from 'react-router-dom'

// Typescript
import {IRoute} from '../../routes/IRoute'

// App
import Error from '../../components/UI/Error'
import Layout from '../../layouts'
import {SanctumContext} from '../../context/Sanctum'

const RouteWithSubRoutes: React.FC<IRoute> = (route) => {
    // Authenticated flag
    const {authenticated, checkAuthentication} = useContext(SanctumContext)

    useEffect(() => {
        if (checkAuthentication) {
            checkAuthentication()
        }
    }, [checkAuthentication])

    const history = useHistory()
    history.location.state = route.title || route.name

    return <Layout layout={route.layout || 'default'}>
        <ErrorBoundary FallbackComponent={Error}>
            <Suspense fallback={route.fallback}>
                <Route
                    path={route.path}
                    render={(props) =>
                        route.redirect
                            ? <Redirect to={route.redirect}/>
                            : route.private
                            ? authenticated || authenticated === null
                                ? route.component && <route.component {...props} routes={route.routes}/>
                                : <Redirect to='/'/>
                            : route.component && <route.component {...props} routes={route.routes}/>}
                />
            </Suspense>
        </ErrorBoundary>
    </Layout>
}

export default RouteWithSubRoutes
