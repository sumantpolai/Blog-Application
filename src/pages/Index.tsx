import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Eye, User, Calendar, Filter, Heart, MessageCircle, Sparkles, Star, TrendingUp } from "lucide-react";
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
}

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");

  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (!posts) return;

    let filtered = [...posts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply user filter
    if (filterBy !== "all") {
      filtered = filtered.filter((post) => post.userId.toString() === filterBy);
    }

    // Apply sorting
    if (sortBy === "recent") {
      filtered.sort((a, b) => b.id - a.id);
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.id - b.id);
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, sortBy, filterBy]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post deleted successfully!");
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id));
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const getUserName = (userId: number) => {
    const user = users?.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const PostSkeleton = () => (
    <Card className="h-80 animate-pulse particle-effect">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-3/4 animate-shimmer" />
        <Skeleton className="h-4 w-1/2 animate-shimmer" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2 animate-shimmer" />
        <Skeleton className="h-4 w-full mb-2 animate-shimmer" />
        <Skeleton className="h-4 w-2/3 mb-4 animate-shimmer" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24 animate-shimmer" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 animate-shimmer" />
            <Skeleton className="h-8 w-8 animate-shimmer" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (postsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center animate-fadeInUp">
          <h2 className="text-2xl font-bold text-red-600 mb-4 animate-shake">Error Loading Posts</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Floating background elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float floating-element"></div>
      <div className="fixed top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float-reverse floating-element"></div>
      <div className="fixed bottom-40 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full blur-xl animate-float floating-element"></div>

      {/* Header with enhanced animations */}
      <div className="text-center mb-12 relative animate-fadeInDown"> 
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-gentle floating-element"></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full absolute top-4 left-8 animate-float floating-element"></div>
          <div className="w-1.5 h-1.5 bg-pink-400 rounded-full absolute top-2 right-8 animate-float-reverse floating-element"></div>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-bold gradient-text-blue mb-6 animate-fadeInDown hover:animate-neon-pulse transition-all duration-300 cursor-default">
          Welcome to BlogApp
        </h1>
        
        <div className="relative inline-block mb-8 ">
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fadeInUp stagger-2 relative overflow-hidden">
            <span className="inline-block animate-slideInLeft stagger-1 hover:animate-wiggle transition-all duration-300 cursor-default">
              Discover
            </span>
            {" "}
            <span className="inline-block animate-slideInBottom stagger-2 hover:animate-bounce-gentle transition-all duration-300 cursor-default bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              amazing
            </span>
            {" "}
            <span className="inline-block animate-slideInRight stagger-3 hover:animate-float transition-all duration-300 cursor-default">
              stories
            </span>
            {" "}
            <span className="inline-block animate-fadeInUp stagger-4 hover:animate-pulse-glow transition-all duration-300 cursor-default">
              and
            </span>
            {" "}
            <span className="inline-block animate-scaleIn stagger-5 hover:animate-neon-pulse transition-all duration-300 cursor-default bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              share
            </span>
            {" "}
            <span className="inline-block animate-slideInTop stagger-6 hover:animate-morphing transition-all duration-300 cursor-default">
              your
            </span>
            {" "}
            <span className="inline-block animate-fadeInDown stagger-7 hover:animate-rotate transition-all duration-300 cursor-default bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent font-semibold">
              thoughts
            </span>
            {" "}
            <span className="inline-block animate-slideInLeft stagger-8 hover:animate-shake transition-all duration-300 cursor-default">
              with
            </span>
            {" "}
            <span className="inline-block animate-slideInRight stagger-9 hover:animate-gradient-shift transition-all duration-300 cursor-default">
              the
            </span>
            {" "}
            <span className="inline-block animate-fadeInUp stagger-10 hover:animate-magnetic transition-all duration-300 cursor-default bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-2xl">
              world
            </span>
            
            {/* Animated underline effect */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform scale-x-0 animate-slideInLeft stagger-11 origin-left"></div>
            
            {/* Floating sparkles around the text */}
            <div className="absolute -top-2 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-bounce-gentle floating-element opacity-70"></div>
            <div className="absolute -top-1 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-float floating-element opacity-60"></div>
            <div className="absolute -bottom-2 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-float-reverse floating-element opacity-80"></div>
            <div className="absolute top-1 right-1/4 w-0.5 h-0.5 bg-blue-400 rounded-full animate-particle-float floating-element opacity-50"></div>
          </p>
        </div>
        
        <div className="relative ">
          <Link to="/create-post">
            <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-500 animate-scaleIn stagger-3 interactive-glow hover-magnetic particle-effect animate-gradient-shift">
              <Sparkles className="w-5 h-5 mr-2 animate-wiggle" />
              Create Your First Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search with animations */}
      <div className="mb-8 space-y-4 animate-slideInLeft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative group">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-64 glass hover-glow transition-all duration-300 input-focus particle-effect"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="md:w-48 glass hover-glow transition-all duration-300 hover-magnetic">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="md:w-48 glass hover-glow transition-all duration-300 hover-magnetic">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="all">All Authors</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Badge variant="secondary" className="text-sm px-4 py-2 glass hover-scale animate-fadeInRight">
            <Star className="w-4 h-4 mr-1 animate-wiggle" />
            {filteredPosts.length} posts found
          </Badge>
        </div>
      </div>

      {/* Posts Grid with enhanced animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {postsLoading || usersLoading
          ? Array(6).fill(0).map((_, index) => (
              <div key={index} className={`animate-fadeInUp stagger-${(index % 6) + 1}`}>
                <PostSkeleton />
              </div>
            ))
          : filteredPosts.map((post, index) => (
              <div key={post.id} className={`animate-fadeInUp stagger-${(index % 6) + 1}`}>
                <Card className="group relative overflow-hidden bg-white/80 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900 card-hover transition-all duration-700 border-0 shadow-xl hover:shadow-2xl particle-effect interactive-glow morphing-blob">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-gradient-shift" />
                  
                  {/* Floating particles on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-gentle"></div>
                  </div>
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-float"></div>
                  </div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 hover-scale transition-all duration-300">
                        #{post.id}
                      </Badge>
                      <div className="flex items-center space-x-1 text-gray-400 group-hover:text-red-500 transition-all duration-300">
                        <Heart className="w-4 h-4 hover-magnetic cursor-pointer hover:text-red-500 transition-all duration-300" />
                        <span className="text-sm animate-fadeInUp">{Math.floor(Math.random() * 50) + 1}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500 leading-tight hover:animate-shimmer cursor-default">
                      {post.title}
                    </CardTitle>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mt-3">
                      <div className="flex items-center space-x-1 hover-scale transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center hover-magnetic">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium hover:text-blue-600 transition-colors duration-300">
                          {getUserName(post.userId)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 hover-scale transition-all duration-300">
                        <Calendar className="w-4 h-4 hover-rotate" />
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300">
                      {post.body.length > 120 ? `${post.body.substring(0, 120)}...` : post.body}
                    </p>
                    
                    {/* Engagement stats with animations */}
                    <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1 hover-scale transition-all duration-300 cursor-pointer">
                        <MessageCircle className="w-4 h-4 hover-magnetic" />
                        <span className="hover:text-blue-600 transition-colors duration-300">
                          {Math.floor(Math.random() * 20) + 1} comments
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 hover-scale transition-all duration-300 cursor-pointer">
                        <Eye className="w-4 h-4 hover-magnetic" />
                        <span className="hover:text-purple-600 transition-colors duration-300">
                          {Math.floor(Math.random() * 500) + 100} views
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Link to={`/posts/${post.id}`}>
                        <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover-magnetic animate-gradient-shift">
                          <Eye className="w-4 h-4 mr-2 hover-rotate" />
                          Read More
                        </Button>
                      </Link>
                      
                      <div className="flex space-x-2">
                        <Link to={`/posts/${post.id}/edit`}>
                          <Button variant="outline" size="sm" className="p-2 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600 transition-all duration-300 hover-magnetic glass">
                            <Edit className="w-4 h-4 hover-rotate" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 hover-magnetic glass"
                        >
                          <Trash2 className="w-4 h-4 hover:animate-shake" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
      </div>

      {/* No posts found with enhanced animation */}
      {filteredPosts.length === 0 && !postsLoading && (
        <div className="text-center py-16 animate-fadeInUp">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center morphing-blob animate-pulse-glow">
              <Filter className="w-12 h-12 text-gray-400 dark:text-gray-500 animate-float" />
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce-gentle floating-element"></div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2 gradient-text-blue">
            No posts found
          </h3>
          <p className="text-gray-500 dark:text-gray-500 animate-fadeInUp stagger-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
