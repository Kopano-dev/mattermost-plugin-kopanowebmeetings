import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzym to use the react-16 adapter
Enzyme.configure({adapter: new Adapter()});

import VideoList from './VideoList.jsx';

describe('VideoList component', () => {
	test('snapshot tests', () => {
		// Empty component
		let component = renderer.create(
			<VideoList
				currentUserId={'test-user-1'}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();

		// One user (never happens in reality, but should not break)
		let callers = [{
			id: 'test-user-1',
			displayName: 'Test User One',
		}];
		component = renderer.create(
			<VideoList
				currentUserId={'test-user-1'}
				callers={callers}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();

		// Two users
		callers = [{
			id: 'test-user-1',
			displayName: 'Test User One',
		}, {
			id: 'test-user-2',
			displayName: 'Test User Two',
		}];
		component = renderer.create(
			<VideoList
				currentUserId={'test-user-1'}
				callers={callers}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();

		// Five users
		callers = [{
			id: 'test-user-1',
			displayName: 'Test User One',
		}, {
			id: 'test-user-2',
			displayName: 'Test User Two',
		}, {
			id: 'test-user-3',
			displayName: 'Test User Three',
		}, {
			id: 'test-user-4',
			displayName: 'Test User Four',
		}, {
			id: 'test-user-5',
			displayName: 'Test User Five',
		}];
		component = renderer.create(
			<VideoList
				currentUserId={'test-user-1'}
				callers={callers}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});

	describe('shouldComponentUpdate', () => {
		test('no changes', () => {
			const callers = [{
				id: 'test-user-1',
				displayName: 'Test User One',
			}, {
				id: 'test-user-2',
				displayName: 'Test User Two',
			}];
			const wrapper = shallow(
				<VideoList
					currentUserId={'test-user-1'}
					callers={callers}
				/>
			);

			// The first time the component should be updated
			// since it hasn't been rendered yet
			expect(wrapper.instance().shouldComponentUpdate({callers})).toBe(true);

			// The second time the component should not be updated
			// (because we didn't update the props)
			expect(wrapper.instance().shouldComponentUpdate({callers})).toBe(false);
		});

		test('removing a user', () => {
			const callers = [{
				id: 'test-user-1',
				displayName: 'Test User One',
			}, {
				id: 'test-user-2',
				displayName: 'Test User Two',
			}];
			const wrapper = shallow(
				<VideoList
					currentUserId={'test-user-1'}
					callers={callers}
				/>
			);

			// The first time the component should be updated
			// since it hasn't been rendered yet
			expect(wrapper.instance().shouldComponentUpdate({callers})).toBe(true);

			// Now remove a caller, so the component should be updated
			expect(wrapper.instance().shouldComponentUpdate({callers: callers.splice(1, 1)})).toBe(true);
		});

		test('adding a user', () => {
			const callers = [{
				id: 'test-user-1',
				displayName: 'Test User One',
			}, {
				id: 'test-user-2',
				displayName: 'Test User Two',
			}];
			const wrapper = shallow(
				<VideoList
					currentUserId={'test-user-1'}
					callers={callers}
				/>
			);

			// The first time the component should be updated
			// since it hasn't been rendered yet
			expect(wrapper.instance().shouldComponentUpdate({callers})).toBe(true);

			// Now add a caller, so the component should be updated
			expect(wrapper.instance().shouldComponentUpdate({callers: callers.concat({id: 'test-user-3', displayName: 'Test User Three'})})).toBe(true);
		});

		test('changing the focussed user', () => {
			const callers = [{
				id: 'test-user-1',
				displayName: 'Test User One',
			}, {
				id: 'test-user-2',
				displayName: 'Test User Two',
			}];
			const wrapper = shallow(
				<VideoList
					currentUserId={'test-user-1'}
					callers={callers}
				/>
			);

			// The first time the component should be updated
			// since it hasn't been rendered yet
			expect(wrapper.instance().shouldComponentUpdate({callers})).toBe(true);

			// Now focus the first caller, so the component should not be updated
			// (since without focus the first caller will be rendered first)
			callers[0].focus = true;
			expect(wrapper.instance().shouldComponentUpdate({callers})).toBe(false);

			// Now focus the second caller, so the component should be updated
			callers[0].focus = false;
			callers[1].focus = true;
			expect(wrapper.instance().shouldComponentUpdate({callers})).toBe(true);
		});
	});

	test('sortCallers', () => {
		const callers = [{
			id: 'test-user-1',
			displayName: 'Test User One',
		}, {
			id: 'test-user-2',
			displayName: 'Test User Two',
		}, {
			id: 'test-user-3',
			displayName: 'Test User Three',
		}];

		let sortedCallers = VideoList.sortCallers(callers);
		expect(sortedCallers).toEqual(callers);

		callers[1].focus = true;
		sortedCallers = VideoList.sortCallers(callers);
		expect(sortedCallers[0]).toBe(callers[1]);

		callers[1].focus = false;
		callers[2].focus = true;
		sortedCallers = VideoList.sortCallers(callers);
		expect(sortedCallers[0]).toBe(callers[2]);
	});

	test('hangup button', () => {
		const callers = [{
			id: 'test-user-1',
			displayName: 'Test User One',
		}, {
			id: 'test-user-2',
			displayName: 'Test User Two',
		}];
		let onHangUpCallCount = 0;
		const onHangUp = () => onHangUpCallCount++;
		const component = mount(
			<VideoList
				currentUserId={callers[0].id}
				callers={callers}
				onHangUp={onHangUp}
			/>
		);
		component.find('.kwm-reject').simulate('click');
		expect(onHangUpCallCount).toBe(1);
	});
});