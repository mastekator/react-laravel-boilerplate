// React
import React from 'react'

// Third-party
import {lazy} from '@loadable/component'
import pMinDelay from 'p-min-delay'

// Typescript
import {IRoute} from './IRoute'

// App
import Loader from '../components/UI/Loader'

export const routes: IRoute[] = [
    {
        name: 'Главная',
        path: '/',
        component: lazy(() => pMinDelay(import('../pages/MainPage'), 600)),
        hide: true,
        exact: true,
        private: false,
        fallback: <Loader/>
    }
]
