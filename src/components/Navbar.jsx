import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function Navbar(props) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const toggleMenu = () => setMenuOpen(!menuOpen());

  return (
    <nav class="bg-blue-600 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img src="https://otebnzqfzytqyyjdfhzr.supabase.co/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512" alt="LearnPlay Logo" class="h-10 w-10 mr-2" />
            <span class="font-bold text-xl">LearnPlay</span>
          </div>
          <div class="hidden md:flex items-center space-x-4">
            <button class="hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer" onClick={() => navigate('/')}>Home</button>
            <button class="hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer" onClick={() => navigate('/quiz')}>Quizzes</button>
            <button class="hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer" onClick={() => navigate('/games')}>Games</button>
            <button class="hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer" onClick={() => navigate('/achievements')}>Achievements</button>
            <button class="hover:bg-blue-700 px-3 py-2 rounded-md cursor-pointer" onClick={() => navigate('/parental-dashboard')}>Parental Dashboard</button>
            <button class="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md cursor-pointer" onClick={props.onSignOut}>Sign Out</button>
          </div>
          <div class="md:hidden flex items-center">
            <button onClick={toggleMenu} class="outline-none mobile-menu-button">
              <svg class=" w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={menuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Show when={menuOpen()}>
        <div class="md:hidden">
          <button class="block px-4 py-2 text-sm hover:bg-blue-700 w-full text-left cursor-pointer" onClick={() => { navigate('/'); toggleMenu(); }}>Home</button>
          <button class="block px-4 py-2 text-sm hover:bg-blue-700 w-full text-left cursor-pointer" onClick={() => { navigate('/quiz'); toggleMenu(); }}>Quizzes</button>
          <button class="block px-4 py-2 text-sm hover:bg-blue-700 w-full text-left cursor-pointer" onClick={() => { navigate('/games'); toggleMenu(); }}>Games</button>
          <button class="block px-4 py-2 text-sm hover:bg-blue-700 w-full text-left cursor-pointer" onClick={() => { navigate('/achievements'); toggleMenu(); }}>Achievements</button>
          <button class="block px-4 py-2 text-sm hover:bg-blue-700 w-full text-left cursor-pointer" onClick={() => { navigate('/parental-dashboard'); toggleMenu(); }}>Parental Dashboard</button>
          <button class="block px-4 py-2 text-sm bg-red-500 hover:bg-red-600 w-full text-left cursor-pointer" onClick={() => { props.onSignOut(); toggleMenu(); }}>Sign Out</button>
        </div>
      </Show>
    </nav>
  );
}

export default Navbar;