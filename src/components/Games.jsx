import { createSignal } from 'solid-js';

function Games() {
  const [loading, setLoading] = createSignal(false);
  const [gameContent, setGameContent] = createSignal('');

  const loadGame = async () => {
    setLoading(true);
    // Placeholder for game loading logic
    setTimeout(() => {
      setGameContent('Interactive game content will be here.');
      setLoading(false);
    }, 1000);
  };

  return (
    <div class="h-full flex flex-col items-center justify-center p-4">
      <h1 class="text-3xl font-bold text-yellow-600 mb-6">Games</h1>
      <div class="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-xl">
        <Show when={!loading()} fallback={<p class="text-gray-700">Loading games...</p>}>
          <p class="text-gray-700">{gameContent()}</p>
          <button
            class="mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={loadGame}
          >
            Load Game
          </button>
        </Show>
      </div>
    </div>
  );
}

export default Games;