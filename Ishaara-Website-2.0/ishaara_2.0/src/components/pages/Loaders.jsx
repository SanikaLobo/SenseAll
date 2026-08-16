// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import LoadingScreen from '../Loadingscreen';

function Loaders() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    } else {
        return null; 
    }
}

export default Loaders;
