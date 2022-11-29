import React from 'react'
import style from './index.module.css'
import logo from '../../asserts/logo.png'

const Title = () => {
    return (
        <div className={style['container']}>
            <img src={logo} className={style['logo']}/>
            <span className={style['title']}>天地协同</span>
        </div>
    )
}

export default Title
