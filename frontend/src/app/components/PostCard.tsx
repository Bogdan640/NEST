import { formatDistanceToNow } from "date-fns";
import { Trash2, MessageCircle } from "lucide-react";
import { Post } from "../context/AppContext";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { currentUser } = useAppContext();
  const canDelete = currentUser?.role === "admin" || currentUser?.id === post.authorId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-emerald-50 mb-6 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-12 h-12 rounded-full border-2 border-emerald-100 object-cover"
          />
          <div>
            <h3 className="font-bold text-emerald-900 leading-tight">{post.authorName}</h3>
            <p className="text-xs font-medium text-emerald-500 mt-0.5">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {canDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-emerald-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
            aria-label="Delete post"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mt-5">
        <p className="text-emerald-800 leading-relaxed font-medium">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post attachment"
            className="mt-4 rounded-[1.5rem] w-full max-h-80 object-cover border border-emerald-100"
          />
        )}
      </div>

      <div className="mt-6 flex items-center gap-6 border-t border-emerald-50 pt-4">
        <button className="flex items-center gap-2 text-emerald-500 hover:text-emerald-700 transition-colors font-medium text-sm">
          <MessageCircle className="w-5 h-5" />
          <span>Reply</span>
        </button>
      </div>
    </motion.div>
  );
}