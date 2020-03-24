import { shallow, mount } from 'enzyme';
import { render } from '@testing-library/react'

import ButtonGroup from '../';
import {TemplateModalProvider} from '../../../contexts/TemplateModalContext';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';

const TestComponent = (props) => {
    const {spinner} = props;
    return (
        <TemplateModalProvider value={{spinner}}>
            <ButtonGroup/>
        </TemplateModalProvider>
    );
}

let realUseContext;
let useContextMock;
// Setup mock
beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
});
// Cleanup mock
afterEach(() => {
    React.useContext = realUseContext;
});

describe('Button Group', () => {

    // 1. Snapshot testing
    it('renders correctly', () => {
        const element = shallow(<TestComponent spinner={null} />);
        expect(element).toMatchSnapshot();
    });

    it('renders correctly with the classname with default status', () => {
        useContextMock.mockReturnValue({spinner: null});
        const element = new ShallowRenderer().render(<ButtonGroup />);
        expect(element.props.className).toBe('starterblocks-import-button-group');
    })


});
