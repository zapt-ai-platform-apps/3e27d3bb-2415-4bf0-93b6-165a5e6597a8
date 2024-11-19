import { createSignal } from 'solid-js';

function Achievements() {
  const [achievements, setAchievements] = createSignal([
    { title: 'First Quiz Completed', earned: true },
    { title: 'Score 5 Points', earned: false },
    { title: 'Play a Game', earned: false },
  ]);

  return (
    <div class="h-full flex flex-col items-center justify-center p-4">
      <h1 class="text-3xl font-bold text-teal-600 mb-6">Achievements</h1>
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <For each={achievements()}>
          {(achievement) => (
            <div class="flex items-center mb-4">
              <div
                class={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                  achievement.earned ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                {achievement.earned ? '🏆' : '🔒'}
              </div>
              <p class="text-lg text-gray-700">{achievement.title}</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default Achievements;