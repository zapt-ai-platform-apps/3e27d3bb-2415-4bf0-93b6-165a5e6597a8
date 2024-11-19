import { createSignal } from 'solid-js';

function ParentalDashboard() {
  const [progress, setProgress] = createSignal([
    { subject: 'Math', score: 80 },
    { subject: 'Science', score: 70 },
    { subject: 'History', score: 90 },
  ]);

  return (
    <div class="h-full flex flex-col items-center justify-center p-4">
      <h1 class="text-3xl font-bold text-red-600 mb-6">Parental Dashboard</h1>
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <For each={progress()}>
          {(item) => (
            <div class="mb-4">
              <p class="text-lg font-semibold text-gray-700 mb-1">{item.subject}</p>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div
                  class="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <p class="text-sm text-gray-500 mt-1">{item.score}% Completed</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default ParentalDashboard;