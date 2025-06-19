
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
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

  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => fetchUser(post!.userId),
    enabled: !!post?.userId,
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
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-float morphing-blob"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full animate-float-reverse morphing-blob"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-200/20 rounded-full animate-particle-float morphing-blob"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Enhanced Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-all duration-300 hover-lift glass rounded-full px-4 py-2 animate-slideInLeft"
        >
          <ArrowLeft className="w-4 h-4 mr-2 animate-magnetic" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Enhanced Post Content */}
        <Card className="mb-8 glass border-0 shadow-2xl hover-lift animate-fadeInUp overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
          <CardHeader className="relative pb-6 px-6 sm:px-8">
            {postLoading ? (
              <div className="animate-pulse">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="animate-fadeInDown">
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-neon-pulse">
                  {post?.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                  {userLoading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 glass rounded-full px-3 py-1 animate-scaleIn stagger-1">
                        <User className="w-4 h-4 text-blue-500" />
                        <Link 
                          to={`/profile/${user?.id}`} 
                          className="hover:text-blue-600 transition-colors font-medium hover-magnetic"
                        >
                          {user?.name}
                        </Link>
                      </div>
                      <div className="flex items-center space-x-2 glass rounded-full px-3 py-1 animate-scaleIn stagger-2">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span className="truncate">{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 glass rounded-full px-3 py-1 animate-scaleIn stagger-3">
                        <Calendar className="w-4 h-4 text-pink-500" />
                        <span>Post #{post?.id}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="relative pt-0 px-6 sm:px-8">
            {postLoading ? (
              <div className="space-y-3 animate-pulse">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <div className="animate-fadeInUp">
                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-8 font-medium">
                  {post?.body}
                </p>
                
                {/* Enhanced Engagement Section */}
                <div className="flex items-center justify-between p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl mb-6 hover-lift border border-white/30 dark:border-gray-700/30 shadow-lg">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 hover-magnetic hover:scale-110 group">
                      <Heart className="w-5 h-5 group-hover:animate-pulse" />
                      <span className="font-semibold text-sm">24</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover-magnetic hover:scale-110 group">
                      <Share2 className="w-5 h-5 group-hover:animate-bounce" />
                      <span className="font-semibold text-sm">Share</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all duration-300 hover-magnetic hover:scale-110 group">
                      <Bookmark className="w-5 h-5 group-hover:animate-wiggle" />
                      <span className="font-semibold text-sm">Save</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/50 rounded-full px-3 py-1">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">{comments?.length || 0} comments</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link to={`/posts/${id}/edit`} className="flex-1 sm:flex-none">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 animate-slideInLeft stagger-1"
                    >
                      <Edit className="w-4 h-4 mr-2 animate-wiggle" />
                      Edit Post
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleDelete}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 hover:from-red-600 hover:to-rose-600 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 animate-slideInLeft stagger-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2 animate-shake" />
                    Delete Post
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Author Info */}
        {user && !userLoading && (
          <Card className="mb-8 glass border-0 shadow-xl hover-lift animate-fadeInUp stagger-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
            <CardHeader className="relative">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-glow"></div>
                <span>About the Author</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg gradient-text-blue">{user.name}</h4>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">@{user.username}</p>
                  <p className="text-gray-700 dark:text-gray-300 break-all">{user.email}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Company:</span> {user.company.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Website:</span> {user.website}
                  </p>
                </div>
              </div>
              <Link to={`/profile/${user.id}`} className="inline-block mt-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 hover-magnetic interactive-glow group"
                >
                  <User className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  View Full Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Comments Section */}
        <Card className="glass border-0 shadow-xl animate-fadeInUp stagger-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-pulse-glow">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="gradient-text-blue">Comments ({comments?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {commentsLoading ? (
              <div className="space-y-6">
                {Array(3).fill(0).map((_, index) => (
                  <div key={index} className="glass rounded-xl p-4 animate-pulse">
                    <Skeleton className="h-4 w-1/3 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : comments?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center animate-bounce-gentle">
                  <MessageCircle className="w-10 h-10 text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments?.map((comment, index) => (
                  <div 
                    key={comment.id} 
                    className={`glass rounded-xl p-6 hover-lift transition-all duration-300 animate-fadeInUp border border-white/20 ${
                      index % 2 === 0 ? 'animate-slideInLeft' : 'animate-slideInRight'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg gradient-text">{comment.name}</h4>
                      <Badge variant="secondary" className="glass text-xs self-start sm:self-center hover-magnetic">
                        {comment.email}
                      </Badge>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base font-medium">{comment.body}</p>
                    
                    {/* Comment engagement */}
                    <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 hover-magnetic text-sm group">
                        <Heart className="w-4 h-4 group-hover:animate-pulse" />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover-magnetic text-sm group">
                        <MessageCircle className="w-4 h-4 group-hover:animate-bounce" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostDetail;
