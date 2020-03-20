import { shallow, mount } from 'enzyme';
import {ErrorNotice} from '../';

describe('Error Notice', () => {
    // Snapshot testing
    it('renders correctly', () => {
        const onButtonClickMock = jest.fn();
        const wrapper = shallow(<ErrorNotice errorMessages={['Some Error Message']} discardAllErrorMessages={onButtonClickMock} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('has always one p tag', () => {
        const props = {
                errorMessages: [],
                discardAllErrorMessages: jest.fn()
            },
            ErrorNoticeComponent = mount(<ErrorNotice {...props} />);
        expect(ErrorNoticeComponent.find('p').length).toBe(1);
    });

    // prop data type testing
    it('check the type of props', () => {
        const props = {
                errorMessages: [],
                discardAllErrorMessages: jest.fn()
            },
            ErrorNoticeComponent = mount(<ErrorNotice {...props} />);
        expect(Array.isArray(ErrorNoticeComponent.prop('errorMessages'))).toBe(true);
        expect(typeof ErrorNoticeComponent.prop('discardAllErrorMessages')).toBe('function');
    });
});
