/**
 * WordPress dependencies
 */
import ChallengeCongrats from './congrats';

export default function ChallengeFinalTemplate({finalStatus}) {
    if (finalStatus === 'success') return <ChallengeCongrats />
    return null;
}
