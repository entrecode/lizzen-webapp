import Mixer from './Mixer';
import PlayerActions from './PlayerActions';
import Progressbar from './Progressbar';
import TrackInfoHeader from './TrackInfoHeader';
import Box from './Box';

function Player() {
  return (
    <Box>
      <TrackInfoHeader />
      <Progressbar />
      <PlayerActions />
      <Mixer />
    </Box>
  );
}

export default Player;
