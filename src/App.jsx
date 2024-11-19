import { createSignal, onMount, createEffect, Show, For } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate, Router, Routes, Route } from '@solidjs/router';
import { Line } from 'solid-chartjs';
import * as Sentry from "@sentry/browser";

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [age, setAge] = createSignal(6);
  const [points, setPoints] = createSignal(0);
  const [badges, setBadges] = createSignal([]);
  const [quizQuestion, setQuizQuestion] = createSignal(null);
  const [funFact, setFunFact] = createSignal('');
  const [selectedAnswer, setSelectedAnswer] = createSignal(null);
  const [feedback, setFeedback] = createSignal('');
  const [progressData, setProgressData] = createSignal([]);
  const navigate = useNavigate();

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('home');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('home');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
    navigate('/');
  };

  const generateQuizQuestion = async (subject) => {
    setLoading(true);
    try {
      const difficulty = Math.floor(age() / 2);
      const prompt = `Create a multiple-choice question on ${subject} suitable for a ${age()}-year-old child. Provide four options with one correct answer. Return JSON in the format: { "question": "...", "options": ["..."], "answer": "..." }`;
      const result = await createEvent('chatgpt_request', {
        prompt,
        response_type: 'json',
      });
      setQuizQuestion(result);
      setSelectedAnswer(null);
      setFeedback('');
    } catch (error) {
      console.error('Error generating quiz question:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (selectedAnswer() === quizQuestion().answer) {
      setFeedback('Correct! Great job!');
      setPoints(points() + 10);
    } else {
      setFeedback(`Oops! The correct answer was: ${quizQuestion().answer}`);
    }
    updateProgressData();
  };

  const updateProgressData = () => {
    setProgressData([...progressData(), {
      date: new Date().toLocaleDateString(),
      score: points(),
    }]);
  };

  const fetchFunFact = async () => {
    setLoading(true);
    try {
      const prompt = 'Provide a fun and interesting fact for kids about animals, space, or history.';
      const result = await createEvent('chatgpt_request', {
        prompt,
        response_type: 'text',
      });
      setFunFact(result);
    } catch (error) {
      console.error('Error fetching fun fact:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    if (user()) {
      fetchFunFact();
    }
  });

  return (
    <Router>
      <div class="min-h-screen h-full bg-gradient-to-br from-yellow-100 to-green-100 p-4">
        <Show
          when={currentPage() !== 'login'}
          fallback={
            <div class="flex items-center justify-center h-full">
              <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">Sign in with ZAPT</h2>
                <a
                  href="https://www.zapt.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-500 hover:underline mb-6 block text-center"
                >
                  Learn more about ZAPT
                </a>
                <Auth
                  supabaseClient={supabase}
                  appearance={{ theme: ThemeSupa }}
                  providers={['google', 'facebook', 'apple']}
                  magicLink={true}
                  view="magic_link"
                  showLinks={false}
                  authView="magic_link"
                />
              </div>
            </div>
          }
        >
          <div class="max-w-7xl mx-auto h-full flex flex-col">
            <header class="flex justify-between items-center mb-4">
              <h1 class="text-4xl font-bold text-purple-700">LearnPlay - AI Learning Adventures</h1>
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </header>

            <nav class="mb-6">
              <ul class="flex space-x-4">
                <li>
                  <a href="/" class="text-blue-600 hover:underline cursor-pointer">Home</a>
                </li>
                <li>
                  <a href="/quiz" class="text-blue-600 hover:underline cursor-pointer">Quizzes</a>
                </li>
                <li>
                  <a href="/games" class="text-blue-600 hover:underline cursor-pointer">Games</a>
                </li>
                <li>
                  <a href="/achievements" class="text-blue-600 hover:underline cursor-pointer">Achievements</a>
                </li>
                <li>
                  <a href="/parent-dashboard" class="text-blue-600 hover:underline cursor-pointer">Parental Dashboard</a>
                </li>
              </ul>
            </nav>

            <main class="flex-1">
              <Routes>
                <Route path="/" component={Home} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/parent-dashboard" element={<ParentDashboard />} />
              </Routes>
            </main>
          </div>
        </Show>
      </div>
    </Router>
  );

  function Home() {
    return (
      <div class="text-center">
        <h2 class="text-3xl font-bold text-green-700 mb-4">Welcome to LearnPlay!</h2>
        <p class="text-xl mb-6">Embark on AI Learning Adventures!</p>
        <Show when={funFact()}>
          <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 class="text-2xl font-bold text-purple-600 mb-2">Fun Fact of the Day</h3>
            <p class="text-gray-700">{funFact()}</p>
          </div>
        </Show>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-blue-200 p-4 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => navigate('/quiz')}
          >
            <h3 class="text-xl font-bold text-blue-700">Quizzes</h3>
            <img src="https://images.unsplash.com/photo-1578403881967-084f9885be74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw1fHxJY29uJTIwb2YlMjBhJTIwdHJlYXN1cmUlMjBtYXAlMjByZXByZXNlbnRpbmclMjBxdWl6emVzfGVufDB8fHx8MTczMjAxNzYyMXww&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="Quiz"
              data-image-request="Icon of a treasure map representing quizzes"
              class="w-full h-32 object-cover rounded-md mt-2"
            />
          </div>
          <div
            class="bg-yellow-200 p-4 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => navigate('/games')}
          >
            <h3 class="text-xl font-bold text-yellow-700">Games</h3>
            <img src="https://images.unsplash.com/photo-1596066190600-3af9aadaaea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw4fHxJY29uJTIwb2YlMjBwdXp6bGVzJTIwcmVwcmVzZW50aW5nJTIwZ2FtZXN8ZW58MHx8fHwxNzMyMDE3NjIxfDA&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="Games"
              data-image-request="Icon of puzzles representing games"
              class="w-full h-32 object-cover rounded-md mt-2"
            />
          </div>
          <div
            class="bg-green-200 p-4 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => navigate('/achievements')}
          >
            <h3 class="text-xl font-bold text-green-700">Achievements</h3>
            <img src="https://images.unsplash.com/photo-1620632523414-054c7bea12ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwyfHxJY29uJTIwb2YlMjBiYWRnZXMlMjByZXByZXNlbnRpbmclMjBhY2hpZXZlbWVudHN8ZW58MHx8fHwxNzMyMDE3NjIyfDA&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="Achievements"
              data-image-request="Icon of badges representing achievements"
              class="w-full h-32 object-cover rounded-md mt-2"
            />
          </div>
        </div>
      </div>
    );
  }

  function QuizPage() {
    return (
      <div>
        <h2 class="text-3xl font-bold text-blue-700 mb-4">Choose a Quiz Subject</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-purple-200 p-4 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => generateQuizQuestion('Math')}
          >
            <h3 class="text-xl font-bold text-purple-700">Math</h3>
            <img src="https://images.unsplash.com/photo-1605658782229-892fd044b24a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHw3fHxJY29uJTIwb2YlMjBudW1iZXJzJTIwcmVwcmVzZW50aW5nJTIwbWF0aHxlbnwwfHx8fDE3MzIwMTc2MjJ8MA&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="Math"
              data-image-request="Icon of numbers representing math"
              class="w-full h-32 object-cover rounded-md mt-2"
            />
          </div>
          <div
            class="bg-pink-200 p-4 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => generateQuizQuestion('Science')}
          >
            <h3 class="text-xl font-bold text-pink-700">Science</h3>
            <img src="https://images.unsplash.com/photo-1486825586573-7131f7991bdd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxfHxJY29uJTIwb2YlMjBwbGFuZXRzJTIwcmVwcmVzZW50aW5nJTIwc2NpZW5jZXxlbnwwfHx8fDE3MzIwMTc2MjJ8MA&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="Science"
              data-image-request="Icon of planets representing science"
              class="w-full h-32 object-cover rounded-md mt-2"
            />
          </div>
          <div
            class="bg-orange-200 p-4 rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => generateQuizQuestion('History')}
          >
            <h3 class="text-xl font-bold text-orange-700">History</h3>
            <img src="https://images.unsplash.com/photo-1541726156-b8aff4dcce65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NjQ4Nzh8MHwxfHNlYXJjaHwxfHxJY29uJTIwb2YlMjBhJTIwY2FzdGxlJTIwcmVwcmVzZW50aW5nJTIwaGlzdG9yeXxlbnwwfHx8fDE3MzIwMTc2MjN8MA&ixlib=rb-4.0.3&q=80&w=1080"
              
              alt="History"
              data-image-request="Icon of a castle representing history"
              class="w-full h-32 object-cover rounded-md mt-2"
            />
          </div>
        </div>

        <Show when={quizQuestion()}>
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-2xl font-bold text-purple-600 mb-4">{quizQuestion().question}</h3>
            <For each={quizQuestion().options}>
              {(option) => (
                <div class="mb-2">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="quizOption"
                      value={option}
                      checked={selectedAnswer() === option}
                      onChange={() => setSelectedAnswer(option)}
                      class="form-radio text-blue-600 h-5 w-5 cursor-pointer"
                    />
                    <span class="ml-2 text-gray-700">{option}</span>
                  </label>
                </div>
              )}
            </For>
            <button
              class={`mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out cursor-pointer ${
                loading() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={checkAnswer}
              disabled={loading()}
            >
              Submit Answer
            </button>
            <Show when={feedback()}>
              <p class="mt-4 text-lg font-semibold text-blue-700">{feedback()}</p>
            </Show>
          </div>
        </Show>
      </div>
    );
  }

  function GamesPage() {
    return (
      <div>
        <h2 class="text-3xl font-bold text-yellow-700 mb-4">Interactive Learning Games</h2>
        <p>Interactive games are coming soon!</p>
      </div>
    );
  }

  function AchievementsPage() {
    return (
      <div>
        <h2 class="text-3xl font-bold text-green-700 mb-4">Your Achievements</h2>
        <p class="text-xl mb-4">Points: {points()}</p>
        <div class="flex space-x-4">
          <For each={badges()}>
            {(badge) => (
              <div class="bg-white p-4 rounded-lg shadow-md">
                <p>{badge}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    );
  }

  function ParentDashboard() {
    return (
      <div>
        <h2 class="text-3xl font-bold text-red-700 mb-4">Parental Dashboard</h2>
        <p class="mb-4">Monitor your child's progress and set learning goals.</p>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-2xl font-bold text-purple-600 mb-2">Progress Over Time</h3>
          <Line
            data={{
              labels: progressData().map((data) => data.date),
              datasets: [
                {
                  label: 'Points',
                  data: progressData().map((data) => data.score),
                  borderColor: 'rgba(75,192,192,1)',
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
            width={500}
            height={300}
          />
        </div>
      </div>
    );
  }
}

export default App;