const {withSelect, select} = wp.data;
import {Tooltip} from '@wordpress/components';
import * as Icons from '~starterblocks/icons'
import './style.scss'

function DependentPlugins (props) {
    const {data, showDependencyBlock} = props;
    const {plugins} = props;
    const {id} = data;

    const isMissingPlugin = (plugin) => {
        return ((data.proDependencies && data.proDependencies.indexOf(plugin) >=0)
            || (data.installDependencies && data.installDependencies.indexOf(plugin) >=0))
    }

    if (showDependencyBlock)
        return (
            <div className="starterblocks-button-display-dependencies">
                {
                    data.dependencies.map(plugin => {
                        const IconComponent = Icons[plugin];
                        const pluginInstance = plugins[plugin];
                        if (IconComponent && pluginInstance)
                            return (
                                <Tooltip text={pluginInstance.name} position="bottom" key={id + plugin}>
                                    <span className={isMissingPlugin(plugin) ? 'missing-dependency' : ''}>
                                        <IconComponent/>
                                    </span>
                                </Tooltip>
                            );
                    })
                }
            </div>
        );
    return null;
}

export default withSelect((select, props) => {
    const {getPlugins} = select('starterblocks/sectionslist');
    return {
        plugins: getPlugins()
    };
})(DependentPlugins);
