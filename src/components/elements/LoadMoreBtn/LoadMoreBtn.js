import React from 'react';
import './LoadMoreBtn.css';

const LoadMoreBtn = (props) => {
    return (
        <div className="rmdb-loadmorebtn" onClick={props.onClick}>
           <p>Load More</p>
        </div>
    );
};

export default LoadMoreBtn;