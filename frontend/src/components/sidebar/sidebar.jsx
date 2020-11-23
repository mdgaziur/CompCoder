import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
    return (
        <div className="sidebar">
            <a className="cb sidebar-logo-container" href="/">
                <img className="sidebar-logo" alt="cb-logo" src="logo-min.png"></img>
                <h1 className="sidebar-logo-text">CodeBuddy</h1>
            </a>
            <ul className="sidebar-buttons-container">
                {/* eslint-disable */}
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <box-icon
                        name='user'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span className="sidebar-button-text">
                        Account
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="`j`avascript:void()">
                        <box-icon
                        name='checkbox-checked'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span className="sidebar-button-text">
                        Problem
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <box-icon
                        name='list-ul'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span className="sidebar-button-text">
                        Problem Categories
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <box-icon
                        name='trophy'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span className="sidebar-button-text">
                        Contests
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <box-icon
                        name='comment-detail'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span className="sidebar-button-text">
                        Community
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <box-icon
                        name='stats'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span className="sidebar-button-text">
                        Stats and Leaderboard
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <box-icon
                        type='logo'
                        name='blogger'
                        size='2rem'
                        color='white'
                        />
                    </a>
                    <span className="sidebar-button-text">
                        Blog
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <FontAwesomeIcon
                            icon={faSignInAlt}
                            style={{
                                fontSize: "1.5rem"
                            }}
                        />
                    </a>
                    <span className="sidebar-button-text">
                       Sign In
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <FontAwesomeIcon
                            icon={faUserPlus}
                            style={{
                                fontSize: "1.5rem"
                            }}
                        />
                    </a>
                    <span className="sidebar-button-text">
                       Sign Up
                    </span>
                </li>
                <li className="sidebar-button">
                    <a className="cb" href="javascript:void()">
                        <FontAwesomeIcon
                            icon={faSignOutAlt}
                            style={{
                                fontSize: "1.5rem"
                            }}
                        />
                    </a>
                    <span className="sidebar-button-text">
                       Log out
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar;