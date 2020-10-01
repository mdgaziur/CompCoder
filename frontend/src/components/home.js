import React, { useState } from 'react';

function Home() {
    //Random values for reaction bars for testing
    const [reactionBarStyle, nothing] = useState({
        c1: {
            width: "96%"
        },
        c2: {
            width: "4%"
        }
    });
    return (
        <div className="container">
            <h1 className="cb title">Your current status</h1>
            <div className="h-container">
                <div className="h-card">
                    <h3 className="cb">You solved</h3>
                    <h1 className="cb">0 Problems</h1>
                </div>
                <div className="h-card">
                    <h3 className="cb">You participated in</h3>
                    <h1 className="cb">0 Contests</h1>
                </div>
                <div className="h-card">
                    <h3 className="cb">Your rating is</h3>
                    <h1 className="cb">0D</h1>
                </div>
                <div className="h-card">
                    <h3 className="cb">You made</h3>
                    <h1 className="cb">0 Submissions</h1>
                </div>
                <div className="h-card">
                    <h3 className="cb">Your contribution points</h3>
                    <h1 className="cb">0</h1>
                </div>
            </div>
            <h1 class="cb title">Problems you may try</h1>
            <div className="v-container">
                <div className="problem">
                    <div className="problem-name">
                        <h1 className="cb title">
                            Hello World
                        </h1>
                    </div>
                    <div className="problem-tags">
                        <span className="problem-tag">
                            Easy
                        </span>
                        <span className="problem-tag">
                            Beginner
                        </span>
                    </div>
                    <div className="problem-reaction">
                        <button className="problem-reaction-button">
                            <box-icon
                                name='like'
                                color='white'
                                size='2rem'
                            />
                        </button>
                        <button className="problem-reaction-button">
                            <box-icon
                                name='dislike'
                                color='white'
                                size='2rem'
                            />
                        </button>
                        <div className="problem-reaction-bar">
                            <div className="problem-reaction-bar-child-1" style={ reactionBarStyle.c1 }></div>
                            <div className="problem-reaction-bar-child-2" style={ reactionBarStyle.c2 }></div>
                        </div>
                        <span className="cb ml-1">600/12</span>
                    </div>
                </div>
            </div>
            <h1 class="cb title">Languages you've used</h1>
            <h1 class="cb title">Problems you've solved</h1>
        </div>
    )
}

export default Home;