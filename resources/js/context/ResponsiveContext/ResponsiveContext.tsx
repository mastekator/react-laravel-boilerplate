import React from 'react'

export interface ContextProps {
    isDesktop: boolean
    isTablet: boolean
    isMobile: boolean
}

const ResponsiveContext = React.createContext<Partial<ContextProps>>({})

export default ResponsiveContext
