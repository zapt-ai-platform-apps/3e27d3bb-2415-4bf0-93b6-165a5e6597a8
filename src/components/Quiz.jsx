import { createSignal, createEffect, Show, For } from 'solid-js';
import { createEvent } from '../supabaseClient';

function Quiz() {
  const [questions, setQuestions] = createSignal([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [selectedOption, setSelectedOption] = createSignal(null);
  const [score, setScore] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const [quizFinished, setQuizFinished] = createSignal(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `Generate 5 multiple-choice questions on general knowledge for children aged 6-12 in JSON format with the following structure: 
          { "questions": [ 
            { 
              "question": "Question text", 
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"], 
              "answer": "Correct Option" 
            }, 
            ... 
          ] 
        }`,
        response_type: 'json'
      });
      setQuestions(result.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchQuestions();
  });

  const handleAnswer = () => {
    if (selectedOption() === questions()[currentQuestionIndex()].answer) {
      setScore(score() + 1);
    }
    if (currentQuestionIndex() < questions().length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex() + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div class="h-full flex flex-col items-center justify-center p-4">
      <h1 class="text-3xl font-bold text-purple-600 mb-6">Quiz Time!</h1>
      <Show when={!loading()} fallback={<p class="text-gray-700">Loading...</p>}>
        <Show when={!quizFinished()}>
          <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
            <p class="text-xl font-semibold text-green-600 mb-4">{questions()[currentQuestionIndex()].question}</p>
            <For each={questions()[currentQuestionIndex()].options}>
              {(option) => (
                <div class="mb-2">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption() === option}
                      onChange={() => setSelectedOption(option)}
                      class="form-radio text-purple-600 cursor-pointer"
                    />
                    <span class="ml-2 text-gray-700 cursor-pointer">{option}</span>
                  </label>
                </div>
              )}
            </For>
            <button
              class={`mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${
                !selectedOption() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={handleAnswer}
              disabled={!selectedOption()}
            >
              Submit
            </button>
          </div>
        </Show>
        <Show when={quizFinished()}>
          <div class="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-xl">
            <h2 class="text-2xl font-semibold text-green-600 mb-4">Quiz Finished!</h2>
            <p class="text-xl text-gray-700">Your Score: {score()} / {questions().length}</p>
            <button
              class="mt-4 w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setQuizFinished(false);
                fetchQuestions();
              }}
            >
              Play Again
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default Quiz;