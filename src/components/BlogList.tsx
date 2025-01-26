import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
};

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/road-to-zenith/bloglist.json");
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data: BlogPost[] = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const isNew = (date: string) => {
    const postDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className="space-y-16">
      {posts.map((post) => (
        <article key={post.id} className="max-w-prose">
          <Link to={`/blog/${post.slug}`} className="block group">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                <b>{post.title}</b>
              </h2>
              {isNew(post.date) && (
                <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white animate-pulse">
                  New
                </span>
              )}
            </div>
            <time className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default BlogList;