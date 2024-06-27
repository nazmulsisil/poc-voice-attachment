# POC Voice Attachment

### Implementing Voice Message Upload Feature

This POC demonstrates the functionality of the voice message attachment feature, showcasing potential capabilities like recording, uploading, and playing audio messages. This feature should be compatible with the platforms that we are targeting:

- Windows PC (Chrome, Firefox)
- Windows Tablet (Chrome, Firefox)
- Mac PC (Chrome, Firefox)
- iPad (Chrome, Firefox)

#### Features

1. **Recording Voice Messages**:

   - Users can record voice messages.
   - Recording will automatically stop to limit the length. It can be configured to a maximum limit, such as 300 seconds.

2. **Uploading Pre-recorded Audio Files**:

   - Users can upload existing audio files from their device.

3. **Audio Playback**:

   - Users can play back recorded or uploaded audio files.

#### Supported Audio Formats

To ensure compatibility across all specified platforms, we can support the following audio formats.

- **WebM**
- **MP3**
- **WAV**

#### Challenges and Difficulties

From the POC, we can conclude that the challenges and difficulties will be minimal. However, for recording from the user's device, the app will require permission from the user, which will be done through a popup where the user needs to click on the "Allow" button. You can experience this using the POC deployment link below. Regarding cross-browser compatibility, it should be okay with our target OS and browsers but will require real device testing.

#### POC Deployment

The POC has been deployed to Vercel and can be accessed at the following link: [poc-voice-attachment.vercel.app](https://poc-voice-attachment.vercel.app/)
