import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

class DropDown extends Component {
    constructor({ title, children }) {
        super();
        this.children = children;
        this.title = title;
    }
    toggleDropDown(e) {
        let el = e.target;
        let dropdown = el.parentNode;
        let dropdown_body = dropdown.childNodes[1];

        el.classList.toggle("visible");
        dropdown_body.classList.toggle("visible");
    }
    render() {
        return (
            <div className="dropdown-el">
                <div className="dropdown-title" onClick={e => this.toggleDropDown(e)}>
                    <h2 className="cb">{ this.title }</h2>
                    <FontAwesomeIcon
                        className="dropdown-icon"
                        icon={faAngleDown}
                    />
                </div>
                <div className="cb dropdown-body">
                    { this.children }
                </div>
            </div>
        );
    }
}

export default DropDown;