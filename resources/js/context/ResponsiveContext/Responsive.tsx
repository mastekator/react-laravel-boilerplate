// React
import React from 'react'
import {useMediaQuery} from 'react-responsive'
import ResponsiveContext from './ResponsiveContext'

const Responsive: React.FC = (props) => {
    const {children} = props

    const isDesktop = useMediaQuery({minWidth: 992})
    const isTablet = useMediaQuery({minWidth: 768, maxWidth: 991})
    const isMobile = useMediaQuery({maxWidth: 767})

    return <ResponsiveContext.Provider
        value={{
            isDesktop,
            isTablet,
            isMobile
        }}
    >
        {children || null}
    </ResponsiveContext.Provider>
}

export default Responsive
