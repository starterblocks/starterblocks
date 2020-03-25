import { shallow, mount } from 'enzyme';
import { render } from '@testing-library/react'

import ButtonGroup from '../';
import {TemplateModalProvider} from '../../../contexts/TemplateModalContext';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';

// To be used fro snapshot
const TestComponent = (props) => {
    const {spinner} = props;
    return (
        <TemplateModalProvider value={{spinner}}>
            <ButtonGroup/>
        </TemplateModalProvider>
    );
}

jest.mock('../../preview-import', () => () => 'PreviewImport');
jest.mock('../../dependent-plugins', () => () => 'DependentPlugins');


let realUseContext, useContextMock;
let useEffect;

describe('Button Group', () => {
    const mockUseEffect = () => {
        useEffect.mockImplementationOnce(f => f());
    };

    beforeEach(() => {
        useEffect = jest.spyOn(React, 'useEffect');
    });

    afterEach(() => {

    });

    // 1. Snapshot testing
    it('renders correctly', () => {
        // const element = shallow(<TestComponent spinner={null} />);
        const component = renderer.create(<TestComponent spinner={null} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        // expect(element).toMatchSnapshot();
    });

    // 2. Testing Props: default Prop
    it('renders the default classname with spinner null', () => {
        realUseContext = React.useContext;
        useContextMock = React.useContext = jest.fn();
        useContextMock.mockReturnValue({spinner: null});
        const renderer = new ShallowRenderer();
        const element = renderer.render(<ButtonGroup />);
        expect(element.props.className).toBe('starterblocks-import-button-group');
        React.useContext = realUseContext;
    })

    it('renders disabled status with spinner not null', () => {
        realUseContext = React.useContext;
        useContextMock = React.useContext = jest.fn();
        mockUseEffect();
        useContextMock.mockReturnValue({spinner: 1});
        const element = new ShallowRenderer().render(<ButtonGroup />);
        expect(element.props.className).toBe('starterblocks-import-button-group disabled');
        React.useContext = realUseContext;
    })

    // 3. Data types:

});
