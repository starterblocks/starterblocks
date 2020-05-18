import config from './config';
export default {

    /**
     * Load timer ID.
     */
    loadId: function() {
        return localStorage.getItem( 'starterblocksChallengeTimerId' );
    },

    /**
     * Save timer ID.
     */
    saveId: function( id ) {
        localStorage.setItem( 'starterblocksChallengeTimerId', id );
    },


    /**
     * Clear all frontend saved timer data.
     */
    clear: function() {

        localStorage.removeItem( 'starterblocksChallengeSecondsLeft' );
        localStorage.removeItem( 'starterblocksChallengeTimerId' );
        localStorage.removeItem( 'starterblocksChallengeTimerStatus' );
    },

    /**
     * Get number of seconds left to complete the Challenge.
     */
    getSecondsLeft: function() {

        var secondsLeft = localStorage.getItem( 'starterblocksChallengeSecondsLeft' );

        secondsLeft = secondsLeft ? parseInt( secondsLeft, 10 ) : config.initialSecondsLeft;

        return secondsLeft;
    },

    /**
     * Get number of seconds spent completing the Challenge.
     */
    getSecondsSpent: function( secondsLeft ) {

        secondsLeft = secondsLeft || getSecondsLeft();

        return config.initialSecondsLeft - secondsLeft;
    },

    /**
     * Save number of seconds left to complete the Challenge.
     */
    saveSecondsLeft: function( secondsLeft ) {

        localStorage.setItem( 'starterblocksChallengeSecondsLeft', secondsLeft );
    },

    /**
     * Get 'minutes' part of timer display.
     */
    getMinutesFormatted: function( secondsLeft ) {

        secondsLeft = secondsLeft || this.getSecondsLeft();

        return Math.floor( secondsLeft / 60 );
    },

    /**
     * Get 'seconds' part of timer display.
     */
    getSecondsFormatted: function( secondsLeft ) {

        secondsLeft = secondsLeft || this.getSecondsLeft();

        return secondsLeft % 60;
    },

    /**
     * Get formatted timer for display.
     */
    getFormatted: function( secondsLeft ) {

        secondsLeft = secondsLeft || this.getSecondsLeft();

        var timerMinutes = this.getMinutesFormatted( secondsLeft );
        var timerSeconds = this.getSecondsFormatted( secondsLeft );

        return timerMinutes + ( 9 < timerSeconds ? ':' : ':0' ) + timerSeconds;
    },

    /**
     * Get last saved step.
     */
    loadStep: function() {

        var step = localStorage.getItem( 'starterblocksChallengeStep' );
        step = step ? parseInt( step, 10 ) : -1;

        return step;
    },

    /**
     * Save Challenge step.
     */
    saveStep: function( step ) {
        localStorage.setItem( 'starterblocksChallengeStep', step );
    },
};