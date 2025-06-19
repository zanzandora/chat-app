import {
  CancelCallButton,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
} from '@stream-io/video-react-sdk';

export const CustomCallControls = () => {
  return (
    <div className='flex items-center justify-center gap-4 p-4 bg-slate-800 rounded-full'>
      <SpeakingWhileMutedNotification>
        <ToggleAudioPublishingButton />
      </SpeakingWhileMutedNotification>
      <ToggleVideoPublishingButton />
      <CancelCallButton />
    </div>
  );
};
