import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {MainContainer, HomeContainer} from 'containers';

const router = (
    <div id={'main'}>
        <MainContainer />
    	<Switch>
    		<Route component={HomeContainer} />
    	</Switch>
    </div>
	);

export default router;