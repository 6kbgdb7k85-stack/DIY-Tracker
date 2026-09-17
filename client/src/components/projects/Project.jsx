import React from 'react';
import { Outlet } from 'react-router';

function Project() {
	return (
		<div>
			<h2>Project</h2>
			<p>Project placeholder</p>
			<Outlet/>
		</div>
	);
}

export default Project;
