import { IoSearch } from 'react-icons/io5';

export default function Test() {
    return (
        <div>
            <div className="header">
                <div className="header-main-content">
                    <h4>Header</h4>
                </div>
                <div className="header-secondary">
                    <div className="header-buttons">
                        <button className="header-button">Button 1</button>
                        <button className="header-button">Button 2</button>
                        <button className="header-button">Button 3</button>
                        <button className="header-button">Button 4</button>
                    </div>
                    <div className="header-searchbar">
                        <input type="text" placeholder="Search anything..."/>
                        <button>
                            <IoSearch id="header-search-icon" />
                        </button>
                    </div>
                    <div className="header-account-dropdown">
                        <img src="https://picsum.photos/50/50" alt="Profile Image"/>
                        <ul>
                            <li><a href="#">Login</a></li>
                            <li><a href="#">Register</a></li>
                            <li><a href="#">Dashboard</a></li>
                            <li><a href="#">Submissions</a></li>
                            <li><a href="#">Drafts</a></li>
                            <li><a href="#">Problems</a></li>
                            <li><a href="#">Settings</a></li>
                            <li><a href="#">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
            <br/>
            <br/>
            <h1>Buttons</h1>
            <div>
                <button className="primary">Primary</button>
                <button className="positive">Positive</button>
                <button className="negative">Negative</button>
                <button className="disabled">Disabled</button>
                <button className="header-button">Header Button</button>
            </div>
        </div>
    )
}