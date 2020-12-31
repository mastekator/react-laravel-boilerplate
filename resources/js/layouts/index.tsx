// React
import React from 'react'

// App
import DefaultLayout from './DefaultLayout'

type Props = {
    layout: string
}

const Layout: React.FC<Props> = (props) => {
    const {children} = props

    return <DefaultLayout>
        {children}
    </DefaultLayout>
}

export default Layout
