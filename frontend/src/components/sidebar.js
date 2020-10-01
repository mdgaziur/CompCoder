import React from 'react';

function Sidebar() {
    return (
        <div className="sidebar">
            <a className="cb sidebar-logo-container" href="/">
                <img className="sidebar-logo" alt="cb-logo" src="logo-min.png"></img>
                <h1 className="sidebar-logo-text">CODEBUDDY</h1>
            </a>
            <ul className="sidebar-buttons-container">
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        name='user'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                        Account
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        name='checkbox-checked'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                        Problem
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        name='list-ul'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                        Problem Categories
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        name='trophy'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                        Contests
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        name='comment-detail'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                        Community
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        name='stats'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                        Stats and Leaderboard
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        type='logo'
                        name='blogger'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                        Blog
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="#">
                        <box-icon
                        name='exit'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span class="sidebar-button-text">
                       Logout
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar;