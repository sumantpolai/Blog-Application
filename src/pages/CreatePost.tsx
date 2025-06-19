
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, PlusCircle, User, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface PostData {
  title: string;
  body: string;
  userId: number;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const CreatePostContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<PostData>({
    title: "",
    body: "",
    userId: user?.id || 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      userId: parseInt(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      console.log("Created post:", newPost);
      
      toast.success("Post created successfully!", {
        description: "Your post has been published and is now live.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button with animation */}
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-all duration-300 hover:scale-105 hover:translate-x-1 animate-slideInLeft"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Header with staggered animations */}
        <div className="text-center mb-8 animate-fadeInDown">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-float shadow-2xl">
              <PlusCircle className="w-8 h-8 text-white animate-bounce-gentle" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text-blue mb-2 animate-scaleIn stagger-1">
            Create New Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg animate-fadeInUp stagger-2">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form with glass effect and animations */}
        <Card className="glass border border-white/20 dark:border-gray-800/50 shadow-2xl hover-lift animate-slideInBottom card-hover">
          <CardHeader className="animate-fadeInUp stagger-3">
            <CardTitle className="text-2xl font-semibold gradient-text-blue flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Post Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field with icon and animation */}
              <div className="space-y-2 animate-fadeInUp stagger-4">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Title *
                </Label>
                <div className="relative group">
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter your post title..."
                    className="w-full input-focus bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
                    required
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Author Selection with animation */}
              <div className="space-y-2 animate-fadeInUp stagger-5">
                <Label htmlFor="userId" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  Author *
                </Label>
                <Select value={formData.userId.toString()} onValueChange={handleUserChange}>
                  <SelectTrigger className="w-full hover:shadow-md transition-all duration-300 hover:scale-[1.01] bg-white/80 dark:bg-gray-800/80">
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
                    {usersLoading ? (
                      <SelectItem value="1" disabled>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-rotate"></div>
                          Loading authors...
                        </div>
                      </SelectItem>
                    ) : (
                      <>
                        {user && (
                          <SelectItem value={user.id.toString()} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              {user.name} (You)
                            </div>
                          </SelectItem>
                        )}
                        {users?.filter(u => u.id !== user?.id).map((userOption) => (
                          <SelectItem 
                            key={userOption.id} 
                            value={userOption.id.toString()}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                          >
                            {userOption.name} (@{userOption.username})
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Body Field with animation */}
              <div className="space-y-2 animate-fadeInUp stagger-6">
                <Label htmlFor="body" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  Content *
                </Label>
                <div className="relative group">
                  <Textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    placeholder="Write your post content here..."
                    className="w-full min-h-[200px] resize-none input-focus bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md"
                    required
                  />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 animate-fadeInUp">
                  <span className={`transition-colors duration-300 ${formData.body.length > 0 ? 'text-blue-500' : ''}`}>
                    {formData.body.length} characters
                  </span>
                </p>
              </div>

              {/* Preview Section with animation */}
              {(formData.title || formData.body) && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 animate-slideInBottom">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    Preview
                  </Label>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-inner hover:shadow-lg transition-all duration-300 card-hover">
                    {formData.title && (
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 animate-fadeInUp">
                        {formData.title}
                      </h3>
                    )}
                    {formData.body && (
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed animate-fadeInUp stagger-1">
                        {formData.body}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Buttons with animations */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 animate-slideInBottom">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.body.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-rotate mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                      Publish Post
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1 sm:flex-none hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 hover:-translate-x-1" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CreatePost = () => {
  return (
    <ProtectedRoute>
      <CreatePostContent />
    </ProtectedRoute>
  );
};

export default CreatePost;
