import renderer from 'react-test-renderer';
import {mount, shallow} from 'enzyme';
import DependentPlugins from '..';
import {SingleItemProvider} from '../../../contexts/SingleItemContext';

let singleMock = {
    data: {ID: 1, blocks: {}},
    showDependencyBlock: true
};

const WrappedDependentPlugins = (props) => {
    const {singleValue} = props;
    return (
        <SingleItemProvider value={{...singleMock, ...singleValue}}>
            <DependentPlugins />
        </SingleItemProvider>
    );
}

describe('Dependent Plugins part within Button Group component', () => {
    it('1. renders correctly: snapshot testing', () => {
        const component = renderer.create(
            <WrappedDependentPlugins />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe('2. Testing props', () => {
        it('renders nothing when showDependencyBlock of SingleItemProvider is false', () => {
            const component = shallow(
                <WrappedDependentPlugins singleValue={{showDependencyBlock: false}} />
            );
            expect(component.html()).toBeFalsy();
        });
    });

});
