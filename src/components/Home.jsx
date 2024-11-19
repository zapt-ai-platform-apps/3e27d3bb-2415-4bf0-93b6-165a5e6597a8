import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { createEvent } from '../supabaseClient';

function Home() {
  const [funFact, setFunFact] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const fetchFunFact = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Provide a fun fact about animals, space, or history suitable for children aged 6-12.',
        response_type: 'text'
      });
      setFunFact(result);
    } catch (error) {
      console.error('Error fetching fun fact:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchFunFact);

  return (
    <div class="h-full flex flex-col items-center justify-center p-4">
      <h1 class="text-4xl font-bold text-blue-600 mb-6">Welcome to LearnPlay - AI Learning Adventures!</h1>
      <div class="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-xl">
        <h2 class="text-2xl font-semibold text-green-600 mb-4">Fun Fact of the Day</h2>
        <Show when={!loading()} fallback={<p class="text-gray-700">Loading...</p>}>
          <p class="text-gray-700">{funFact()}</p>
        </Show>
      </div>
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button
          class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 rounded-lg shadow-md focus:outline-none cursor-pointer"
          onClick={() => navigate('/quiz')}
        >
          <img src="https://images.unsplash.com/photo-1577086664693-894d8405334a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxfHx0cmVhc3VyZSUyMG1hcCUyMHdpdGglMjBtYXRoJTIwc3ltYm9sc3xlbnwwfHx8fDE3MzIwMTc2OTZ8MA&ixlib=rb-4.0.3&q=80&w=1080"  alt="Quizzes" data-image-request="treasure map with math symbols" class="mx-auto mb-2 h-16" />
          Quizzes
        </button>
        <button
          class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg shadow-md focus:outline-none cursor-pointer"
          onClick={() => navigate('/games')}
        >
          <img src="https://images.unsplash.com/photo-1559906727-76b9259eb4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwyfHxjYXN0bGUlMjB3aXRoJTIwd2hpbXNpY2FsJTIwZWxlbWVudHN8ZW58MHx8fHwxNzMyMDE3Njk3fDA&ixlib=rb-4.0.3&q=80&w=1080"  alt="Games" data-image-request="castle with whimsical elements" class="mx-auto mb-2 h-16" />
          Games
        </button>
        <button
          class="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 rounded-lg shadow-md focus:outline-none cursor-pointer"
          onClick={() => navigate('/achievements')}
        >
          <img src="https://images.unsplash.com/photo-1708093191620-9725764e6885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw3fHxzdGFycyUyMGFuZCUyMGJhZGdlc3xlbnwwfHx8fDE3MzIwMTc2OTd8MA&ixlib=rb-4.0.3&q=80&w=1080"  alt="Achievements" data-image-request="stars and badges" class="mx-auto mb-2 h-16" />
          Achievements
        </button>
      </div>
    </div>
  );
}

export default Home;