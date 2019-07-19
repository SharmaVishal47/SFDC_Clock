import React from 'react';

const Digital = (props)=> {

    return(

                <div >
            <h1>{props.hours}:{props.minutes}:{props.seconds} {props.ampm}</h1>

        </div>
    )
};


export default Digital;