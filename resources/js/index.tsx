// React
import React from 'react'

// Third-party
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'

// App
import Router from './containers/Router/Router'
import {routes} from './routes/routes'

const Index: React.FC<RouteComponentProps> = () => {
    return <>
        <Router routes={routes}/>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover/>
    </>
}

export default withRouter(Index)
