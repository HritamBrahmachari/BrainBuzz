import * as Avatar from "@radix-ui/react-avatar";
import { useNavigate } from 'react-router-dom';

const Ava = () => {
  const navigate = useNavigate();

  return (
  <div className="flex items-center justify-center gap-x-10">
    {/* Avatar 1 */}
    <Avatar.Root className="flex items-center space-x-3">
      <Avatar.Image
        src="https://randomuser.me/api/portraits/women/79.jpg"
        className="w-12 h-12 rounded-full object-cover"
      />
      <Avatar.Fallback
        delayMs={600}
        className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-sm"
      >
        CT
      </Avatar.Fallback>
      <div>
        <span className="text-gray-700 text-sm font-medium ">
          Nikita Andrew
        </span>
        <button onClick={() => navigate("/profile")}
          className="block text-indigo-600 hover:text-indigo-500 text-xs"
        >
          View profile
        </button>
      </div>
    </Avatar.Root>
    {/* Avatar 2 */}
    
  </div>
)};

export default Ava;
