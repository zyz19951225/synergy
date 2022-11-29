import React, {lazy} from 'react'
import SendMessage from "../pages/message";


const Login = lazy(() => import('../pages/login'))
const Test = lazy(() => import('../pages/test'))
const AuthRecord = lazy(() => import('../pages/authRecord'))
const HistoricalRoute = lazy(() => import('../pages/historicalRoute'))
const Header = lazy(() => import('../component/Header'))
const Authentication = lazy(() => import('../pages/currentUser'))


const getRoutes = () => {
    return [
        {
            path: '/',
            component: <Login/>
        },
        {
            path: '/test',
            component: <Test/>
        },
        {
            path: '/header',
            component: <Header/>
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
