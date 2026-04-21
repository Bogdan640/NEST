import { useState } from "react";
import { Send, Image as ImageIcon, Home } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { PostCard } from "../components/PostCard";
import { PageHeader } from "../components/PageHeader";

export function Feed() {
  const { posts, setPosts, currentUser } = useAppContext();
  const [newPost, setNewPost] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !currentUser) return;

    const post = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: newPost,
      timestamp: new Date().toISOString(),
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full">
      <PageHeader 
        title="Community Feed" 
        subtitle="What's happening in your block today?" 
        emoji="🐦" 
        Icon={Home} 
        bgColor="bg-emerald-100" 
        shadowColor="shadow-emerald-200/50"
        rightContent={
          <div className="bg-emerald-100/50 px-5 py-3 rounded-2xl border border-emerald-200 text-sm font-bold text-emerald-700 shadow-sm">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </div>
        }
      />

      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handlePost}
        className="bg-white rounded-[2rem] p-6 mb-10 shadow-lg shadow-emerald-100/50 border border-emerald-50 focus-within:ring-4 focus-within:ring-emerald-400/20 transition-all"
      >
        <div className="flex gap-4">
          <img
            src={currentUser?.avatar}
            alt="Your avatar"
            className="w-12 h-12 rounded-full border-2 border-emerald-100 object-cover flex-shrink-0"
          />
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write a message to your neighbors..."
            className="w-full bg-transparent resize-none border-none focus:ring-0 text-emerald-900 placeholder-emerald-300 font-medium py-2 min-h-[60px]"
          />
        </div>
        <div className="flex justify-between items-center mt-4 border-t border-emerald-50 pt-4">
          <button
            type="button"
            className="text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 p-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-sm font-bold">Add Photo</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newPost.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-md shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Post</span>
          </motion.button>
        </div>
      </motion.form>

      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}