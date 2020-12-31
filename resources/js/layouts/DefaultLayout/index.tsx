// React
import React from 'react'

// Styles
import classes from './styles.module.css'

const DefaultLayout: React.FC = (props) => {
    const {children} = props

    return <div className={classes.layout}>
        {children}
    </div>
}

export default DefaultLayout
