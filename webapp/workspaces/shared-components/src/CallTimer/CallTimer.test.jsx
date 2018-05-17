import React from 'react';
import renderer from 'react-test-renderer';

import CallTimer from './CallTimer.jsx';

describe('CallTimer component', () => {
	test('snapshot tests', () => {
		let component = renderer.create(
			<CallTimer
				startTime={new Date().getTime()}
				color='red'
			/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();

		// Test a component with another color
		component = renderer.create(
			<CallTimer
				startTime={new Date().getTime()}
				color='#000000'
			/>
		);

		tree = component.toJSON();
		expect(tree).toMatchSnapshot();

	});

	test('getTimerText', () => {
		expect(CallTimer.getTimerText(5 * 1000)).toBe('00:05');
		expect(CallTimer.getTimerText(15 * 1000)).toBe('00:15');
		expect(CallTimer.getTimerText(60 * 1000)).toBe('01:00');
		expect(CallTimer.getTimerText(15 * 60 * 1000)).toBe('15:00');
		expect(CallTimer.getTimerText(60 * 60 * 1000)).toBe('1:00:00');
		expect(CallTimer.getTimerText((60 * 60 + 5) * 1000)).toBe('1:00:05');
		expect(CallTimer.getTimerText((60 * 60 + 15) * 1000)).toBe('1:00:15');
		expect(CallTimer.getTimerText((60 * 60 + 60)* 1000)).toBe('1:01:00');
		expect(CallTimer.getTimerText((5 * 60 * 60 + 5) * 1000)).toBe('5:00:05');
		expect(CallTimer.getTimerText((5 * 60 * 60 + 15) * 1000)).toBe('5:00:15');
		expect(CallTimer.getTimerText((5 * 60 * 60 + 60) * 1000)).toBe('5:01:00');
		expect(CallTimer.getTimerText((5 * 60 * 60 + 60 + 5) * 1000)).toBe('5:01:05');
		expect(CallTimer.getTimerText((5 * 60 * 60 + 60 + 15) * 1000)).toBe('5:01:15');
		expect(CallTimer.getTimerText((5 * 60 * 60 + 15 * 60 + 15) * 1000)).toBe('5:15:15');
	});
});