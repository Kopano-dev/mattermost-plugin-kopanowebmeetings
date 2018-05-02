import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzym to use the react-16 adapter
Enzyme.configure({adapter: new Adapter()});

import CallNotification from './CallNotification.jsx';

describe('CallNotification component', () => {
	test('snapshot tests', () => {
		let component = renderer.create(
			<CallNotification
				open={true}
				userName='Ted Bundy'
				onAccept={() => {}}
				onReject={() => {}}
			/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Test a component that is not open (=hidden)
		component = renderer.create(
			<CallNotification
				open={false}
				userName='Ted Bundy'
				onAccept={() => {}}
				onReject={() => {}}
			/>
		);

		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Test a component with a title
		component = renderer.create(
			<CallNotification
				open={true}
				title='Calling someone called Ted'
				userName='Ted Bundy'
				onAccept={() => {}}
				onReject={() => {}}
			/>
		);

		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Test a component with an avatar
		component = renderer.create(
			<CallNotification
				open={true}
				imgUrl='https://www.gravatar.com/avatar/3e1b65a10672e6fdf6f376c15a034e87'
				userName='Ted Bundy'
				onAccept={() => {}}
				onReject={() => {}}
			/>
		);

		tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('accept and reject button', () => {
		let onAcceptCallCount = 0;
		const onAccept = () => onAcceptCallCount++;
		let onRejectCallCount = 0;
		const onReject = () => onRejectCallCount++;
		const component = mount(
			<CallNotification
				open={true}
				userName='Ted Bundy'
				onAccept={onAccept}
				onReject={onReject}
			/>
		);

		component.find('.kwm-accept').simulate('click');
		expect(onAcceptCallCount).toBe(1);

		component.find('.kwm-reject').simulate('click');
		expect(onRejectCallCount).toBe(1);
	});
});