import React, { Component } from 'react';
import  FontAwesome from 'react-fontawesome';
import './SearchBar.css';

class SearchBar extends Component {
    state = {
        value: ''
    }

    timeout = null;

    doSearch = (event) => {
        this.setState({value: event.target.value});
        clearTimeout(this.timeout);

        this.timeout = setTimeout( () => {
        this.props.callback(this.state.value);
        }, 500);
        
    }

    render() {
        return (
            <div className="rmdb-searchbar">
                <div className="rmdb-searchbar-content">
                    <FontAwesome className="rmdb-fa-search" name="search" size="2x" />
                    <input 
                    type="value"
                    placeholder="Search"
                    className="rmdb-searchbar-input"
                    onChange={this.doSearch}
                    value={this.state.value}
                    />
                </div>
            </div>
        );
    }
}

export default SearchBar;