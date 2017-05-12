import React from 'react';

class MainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'MainContainer';
	}

	render(){
		return (
			<div className="main-container">
				Main Container
				{this.props.children}
			</div>
		)
	}
}

export default MainContainer;