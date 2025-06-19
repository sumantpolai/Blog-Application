import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"; // ✅ Added useLocation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2, User, Mail, MessageCircle, Calendar, Heart, Share2, Bookmark } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
  company: {
    name: string;
  };
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

const fetchPost = async (id: string): Promise<Post> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!response.ok) throw new Error("Failed to fetch post");
  return response.json();
};

const fetchUser = async (userId: number): Promise<User> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ useLocation moved inside component
  const updatedPost = location.state?.updatedPost; // ✅ read updated post from location

  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
  });

  const postData = updatedPost || post; // ✅ prefer updated post

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", postData?.userId],
    queryFn: () => fetchUser(postData!.userId),
    enabled: !!postData?.userId,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id!),
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post deleted successfully!");
        navigate("/");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  if (postError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fadeInUp glass rounded-2xl p-8 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce-gentle">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4 gradient-text-blue">Post Not Found</h2>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="animate-magnetic hover-glow">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="relative max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-all duration-300 hover-lift glass rounded-full px-4 py-2 animate-slideInLeft"
        >
          <ArrowLeft className="w-4 h-4 mr-2 animate-magnetic" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <Card className="mb-8 glass border-0 shadow-2xl hover-lift animate-fadeInUp overflow-hidden">
          <CardHeader className="relative pb-6 px-6 sm:px-8">
            {postLoading && !updatedPost ? (
              <div className="animate-pulse">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="animate-fadeInDown">
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-neon-pulse">
                  {postData?.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                  {userLoading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 glass rounded-full px-3 py-1">
                        <User className="w-4 h-4 text-blue-500" />
                        <Link to={`/profile/${user?.id}`} className="hover:text-blue-600 font-medium">
                          {user?.name}
                        </Link>
                      </div>
                      <div className="flex items-center space-x-2 glass rounded-full px-3 py-1">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 glass rounded-full px-3 py-1">
                        <Calendar className="w-4 h-4 text-pink-500" />
                        <span>Post #{postData?.id}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="relative pt-0 px-6 sm:px-8">
            {postLoading && !updatedPost ? (
              <div className="space-y-3 animate-pulse">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="animate-fadeInUp">
                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-8 font-medium">
                  {postData?.body}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to={`/posts/${id}/edit`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Post
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-rose-500 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostDetail;
