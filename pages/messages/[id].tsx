import axios from 'axios';
import { GetServerSideProps } from 'next';
import ReactAudioPlayer from 'react-audio-player';

interface Props {
  description: string;
  audioUrl: string;
  error: string;
}

const DescriptionAndAudio: React.FC<Props> = ({ description, audioUrl, error }) => {
  if (error) {
    return <p className="text-xl font-bold text-red-700">{error}</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <p className="text-xl font-bold text-gray-900 mb-4">{description}</p>
      <ReactAudioPlayer
        src={audioUrl}
        autoPlay
        controls
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let userId = '';

  if (context.params) {
    const { id } = context.params;
    userId = id as string;
  }
  try {
    // Make the server-side call to get the description and audio message
    const response = await axios.get(`https://christmasapi.herokuapp.com/api/v1/messages/${userId}`);
    const { description, recording: { url: audioUrl } } = response.data;

    // Pass the data to the component as props
    return {
      props: {
        description,
        audioUrl,
        error: '',
      },
    };
  } catch (error) {
    // If there is an error making the request or the response is empty, pass an error message to the component as a prop
    return {
      props: {
        description: '',
        audioUrl: '',
        error: 'An error occurred while fetching the data',
      },
    };
  }
}

export default DescriptionAndAudio;
