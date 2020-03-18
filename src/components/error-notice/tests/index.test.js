import { shallow } from 'enzyme';
import {ErrorNotice} from '../';

describe('Error Notice', () => {
    it('renders correctly', () => {
        const onButtonClickMock = jest.fn();
        const wrapper = shallow(<ErrorNotice errorMessages={['Some Error Message']} discardAllErrorMessages={onButtonClickMock} />);
        expect(wrapper).toMatchSnapshot();
        // On the first run of this test, Jest will generate a snapshot file automatically.
    });
});
