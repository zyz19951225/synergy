import React, {lazy} from 'react'
import SendMessage from "../pages/message";


const Login = lazy(() => import('../pages/login'))
const AuthRecord = lazy(() => import('../pages/authRecord'))
const HistoricalRoute = lazy(() => import('../pages/historicalRoute'))
const Authentication = lazy(() => import('../pages/currentUser'))


const getRoutes = () => {
    return [
        {
            path: '/',
            component: <Login/>
        },
        {
            path: '/sendMessage',
            component: <SendMessage/>
        },
        {
            path: '/authInfo',
            component: <Authentication/>
        },{
            path: '/authRecord',
            component: <AuthRecord/>
        },{
            path: '/history',
            component: <HistoricalRoute/>
        },
    ]
}

export default getRoutes
