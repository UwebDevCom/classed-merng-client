import {Popup} from "semantic-ui-react";
import react from 'react';

function MyPopus({content, children}){
    return <Popup inverted content={content} trigger={children} />
}

export default MyPopus;