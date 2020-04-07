import {Tooltip} from '@wordpress/components';
import * as Icons from '~starterblocks/icons'
import './style.scss'

export default function DependentPlugins (props) {
    const {data, showDependencyBlock} = props;
    const {ID} = data;

    const getDependentBlocks = (data) => {
        if ('blocks' in data) {
            return Object.keys(data.blocks).map((block) => {
                const pluginReference = starterblocks.supported_plugins[block];
                return {
                    name: pluginReference ? pluginReference.name : block,
                    slug: block,
                    missingDependency: pluginReference ? pluginReference.hasOwnProperty('version') === false : true
                };
            });
        }
    }

    if (showDependencyBlock)
        return (
            <div className="starterblocks-button-display-dependencies">
                {
                    data.blocks &&
                    getDependentBlocks(data).map(block => {
                        const {name, slug, missingDependency} = block;
                        const IconComponent = Icons[slug];

                        if (IconComponent)
                            return (
                                <Tooltip text={name} position="bottom" key={ID +slug}>
                                    <span className={missingDependency ? 'missing-dependency' : ''}>
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
