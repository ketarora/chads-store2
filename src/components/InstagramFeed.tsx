
import React from 'react';
import { cn } from '@/lib/utils';

interface InstaPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
}

const instaPosts: InstaPost[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    caption: 'Summer vibes with our new collection! 🌊 #VibeThreadz',
    likes: 243
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    caption: 'Comfort meets style. New drop coming soon! #StayTuned',
    likes: 419
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    caption: 'When the squad is wearing VibeThreadz 🔥 #SquadGoals',
    likes: 873
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    caption: 'Limited edition designs dropping this week! 👀 #StayTuned',
    likes: 512
  }
];

const InstagramFeed: React.FC = () => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 rounded-full flex items-center justify-center p-0.5">
          <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
            <span className="text-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text text-sm font-bold">
              @
            </span>
          </div>
        </div>
        <span className="font-bold text-lg">@chadscomments</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {instaPosts.map((post, index) => (
          <div 
            key={post.id} 
            className={cn(
              "relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer",
              index === 0 ? "md:col-span-2 md:row-span-2" : ""
            )}
          >
            <img 
              src={post.image} 
              alt={post.caption} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
              <p className="text-white text-xs md:text-sm line-clamp-2">{post.caption}</p>
              <div className="flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-xs ml-1">{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <a 
          href="https://www.instagram.com/chadscomments/?igsh=MW12cHZ4amtvbXo5bg%3D%3D" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-secondary inline-flex items-center"
        >
          Follow Us on Instagram
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default InstagramFeed;
