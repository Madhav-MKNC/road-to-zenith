import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogPost as BlogPostType } from "@/components/BlogList";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin } from "lucide-react";
import { marked } from "marked";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [post, setPost] = useState<BlogPostType | undefined>();
  const [nextPost, setNextPost] = useState<BlogPostType | undefined>();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/road-to-zenith/bloglist.json");
      const data: BlogPostType[] = await res.json();
      setPosts(data);

      const currentPost = data.find((p) => p.slug === slug);
      setPost(currentPost);
      setNextPost(data.find((p) => Number(p.id) === Number(currentPost?.id) + 1));

      if (currentPost) {
        const markdownRes = await fetch(`/road-to-zenith/posts/${currentPost.slug}.md`);
        const markdown = await markdownRes.text();
        setContent(markdown);
      }
    };

    fetchPosts();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = post.title;
    }
  }, [post]);  

  const shareOnTwitter = () => {
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        post?.title || ""
      )}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank"
    );
  };

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p>Post not found.</p>
        <Link
          to="/"
          className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6">
      <div className="py-8">
        <Link
          to="/"
          className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
        >
          ← Homepage
        </Link>
      </div>

      <article className="max-w-prose">
        <h1 className="text-3xl mb-4">{post.title}</h1>
        <time className="text-sm text-gray-500 dark:text-gray-400 mb-8 block">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <div
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
        />
      </article>

      <div className="mt-16 mb-8 flex gap-4">
        <Button onClick={shareOnTwitter} variant="outline" size="sm">
          <Twitter className="mr-2 h-4 w-4" />
          Share on Twitter
        </Button>
        <Button onClick={shareOnLinkedIn} variant="outline" size="sm">
          <Linkedin className="mr-2 h-4 w-4" />
          Share on LinkedIn
        </Button>
      </div>

      {nextPost && (
        <div className="mt-8 mb-16">
          <Link
            to={`/blog/${nextPost.slug}`}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
          >
            Read Next: {nextPost.title} →
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogPost;