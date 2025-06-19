
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Mail, Globe, Building, MapPin, Phone, Eye } from "lucide-react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user posts");
  return response.json();
};

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => fetchUserPosts(id!),
    enabled: !!id,
  });

  if (userError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user profile you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              {userLoading ? (
                <>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    {user?.name}
                  </CardTitle>
                  <p className="text-gray-600">@{user?.username}</p>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {userLoading ? (
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{user?.website}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {user?.address.city}, {user?.address.zipcode}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{user?.company.name}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Company</h4>
                    <p className="text-sm text-gray-600 mb-1">{user?.company.catchPhrase}</p>
                    <p className="text-xs text-gray-500">{user?.company.bs}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Badge variant="secondary" className="w-full justify-center">
                      {posts?.length || 0} Posts Published
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Posts */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {userLoading ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  `Posts by ${user?.name}`
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="space-y-6">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <Skeleton className="h-5 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : posts?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts published yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts?.map((post) => (
                    <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.body.length > 150 ? `${post.body.substring(0, 150)}...` : post.body}
                      </p>
                      <Link to={`/posts/${post.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300">
                          <Eye className="w-4 h-4" />
                          <span>Read More</span>
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
