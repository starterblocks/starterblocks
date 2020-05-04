import { Fab, Action } from 'react-tiny-fab';
import config from './config';
import './styles.scss';
export default function FabWrapper() {
    const { mainButtonStyles, actionButtonStyles, position, event, alwaysShowTitle } = config;
    
    return (
        <Fab
            mainButtonStyles={mainButtonStyles}
            position={position}
            icon="+"
            event={event}
            alwaysShowTitle={alwaysShowTitle}
          >
            <Action
              style={actionButtonStyles}
              text="Email"
              onClick={e => {
                alert('I printed the event to the console.');
                console.log(e);
              }}
            >
              @
            </Action>
            <Action
              style={actionButtonStyles}
              text="Notifications"
              onClick={() => alert('Here is your notification.')}
            >
              🔔
            </Action>
            <Action style={actionButtonStyles} text="Fullscreen" onClick={() => alert('What?')}>
              📄
            </Action>
            <Action style={actionButtonStyles} text="Search" onClick={() => alert('No search...')}>
              🔍
            </Action>
            <Action style={actionButtonStyles} text="Editor" onClick={e => console.log(e)}>
              🖊️
            </Action>
            <Action
              style={actionButtonStyles}
              text="Like it!"
              onClick={() => alert('This is fantastic!')}
            >
              👍
            </Action>
          </Fab>
    );
}