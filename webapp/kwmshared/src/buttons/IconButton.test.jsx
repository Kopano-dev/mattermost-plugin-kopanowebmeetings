import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzym to use the react-16 adapter
Enzyme.configure({adapter: new Adapter()});

import createIconButton from './IconButton.jsx';
import {cameraOutlined} from '../icons';

describe('IconButton component', () => {
	const Button = createIconButton(cameraOutlined(), 'mybutton');

	test('snapshot tests', () => {
		const component = renderer.create(
			<Button />
		);
		expect(component.toJSON()).toMatchSnapshot();
	});

	test('onClick handler', () => {
		let onClickCallCount = 0;
		const onClick = () => onClickCallCount++;

		const component = shallow(
			<Button
				onClick={onClick}
			/>
		);
		component.find('button').simulate('click');
		expect(onClickCallCount).toBe(1);
	});

	describe('classNames', () => {
		test('string with single className', () => {
			const className = 'my-first-class-class';
			const component = shallow(
				<Button
					className={className}
				/>
			);
			expect(component.find('button').hasClass(className)).toBe(true);
		});

		test('string with multiple classNames', () => {
			const className = 'my-first-class-class my-second-class my-third-class';
			const component = shallow(
				<Button
					className={className}
				/>
			);
			expect(component.find('button').hasClass('my-first-class-class')).toBe(true);
			expect(component.find('button').hasClass('my-second-class')).toBe(true);
			expect(component.find('button').hasClass('my-third-class')).toBe(true);
		});
	});

	test('array with className strings', () => {
		const className = [
			'my-first-class-class',
			'my-second-class',
			'my-third-class',
		];
		const component = shallow(
			<Button
				className={className}
			/>
		);
		expect(component.find('button').hasClass(className[0])).toBe(true);
	});
});