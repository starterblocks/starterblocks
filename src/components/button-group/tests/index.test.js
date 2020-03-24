import { shallow, mount } from 'enzyme';
import { render } from '@testing-library/react'
import {ButtonGroup} from '../';
import SingleItemContext from '../../contexts/SingleItemContext';
import TemplateModalContext from '../../contexts/TemplateModalContext';


const renderButtonGroupWithContext = () => {
    return render(
        <TemplateModalContext.provider value={{
            spinner: null
        }}>
            <ButtonGroup/>
        </TemplateModalContext.provider>
    );
}

describe('Button Group', () => {

    // 1. Snapshot testing
    it('renders correctly', () => {
        const wrapper = shallow(<TabHeader setSearchContext={setSearchContext} setActiveItemType={setActiveItemType} />);
        expect(wrapper).toMatchSnapshot();
    });


});
