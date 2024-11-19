import { createSignal, onMount } from 'solid-js';
import { createEvent } from '../supabaseClient';

function FunFact() {
  const [funFact, setFunFact] = createSignal('');
  const [loading, setLoading] = createSignal(false);

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
      <div class="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-xl">
        <h2 class="text-2xl font-semibold text-green-600 mb-4">Fun Fact</h2>
        <Show when={!loading()} fallback={<p class="text-gray-700">Loading...</p>}>
          <p class="text-gray-700">{funFact()}</p>
        </Show>
      </div>
    </div>
  );
}

export default FunFact;