// React
import React from 'react'
import {render} from 'react-dom'

// Third-party
import {Router} from 'react-router'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunk, {ThunkMiddleware} from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {createBrowserHistory} from 'history'
import {Sanctum} from 'react-with-sanctum'

// App
import Index from './index'
import rootReducer from './store/reducers/rootReducer'
import Responsive from './context/ResponsiveContext/Responsive'

const middleware = thunk as ThunkMiddleware

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(middleware)))

export const history = createBrowserHistory()

const sanctumConfig = {
    apiUrl: process.env.MIX_API_URL || '',
    csrfCookieRoute: process.env.MIX_CSRF_COOKIE_ROUTE || '',
    signInRoute: process.env.MIX_SIGNIN_ROUTE || '',
    signUpRoute: process.env.MIX_SIGNUP_ROUTE || '',
    signOutRoute: process.env.MIX_SIGNOUT_ROUTE || '',
    forgotPasswordRoute: process.env.MIX_FORGOT_PASSWORD_ROUTE || '',
    resetPasswordRoute: process.env.MIX_RESET_PASSWORD_ROUTE || '',
    userObjectRoute: process.env.MIX_USER_OBJECT_ROUTE || ''
}

const application =
    <Sanctum checkOnInit={false} config={sanctumConfig}>
        <Responsive>
            <Provider store={store}>
                <Router history={history}>
                    <Index/>
                </Router>
            </Provider>
        </Responsive>
    </Sanctum>

render(application, document.getElementById('root'))
