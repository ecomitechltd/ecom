import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Star, Shield, Truck, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  requires_prescription: boolean;
  in_stock: number;
  manufacturer: string;
  dosage: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products_2025_10_27_11_08')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories_2025_10_27_11_08')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    toast.success('Added to cart!');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = product.name.charAt(0).toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
  });

  const cartItemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Rx</span>
                </div>
                <span className="text-xl font-bold text-blue-600">FutureRx</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Medications</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">FAQ</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="relative text-gray-600 hover:text-blue-600">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Prescriptions</h1>
            <h2 className="text-5xl font-bold text-blue-600 mb-6">Delivered to You</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Order your prescriptions online and get them delivered to your doorstep. Fast, secure, and convenient healthcare at your fingertips.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for your medication (e.g. Lipitor, Metformin)"
                className="pl-12 pr-32 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50M+</div>
              <div className="text-gray-600">Prescriptions Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Online Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">Same Day</div>
              <div className="text-gray-600">Delivery Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Medications Section */}
      <section id="medications-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Medications</h2>
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              View all
            </Button>
          </div>
          
          {/* Alphabet Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {alphabet.map((letter) => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? "default" : "outline"}
                className={`w-10 h-10 p-0 rounded-md ${
                  selectedLetter === letter 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "border-gray-300 hover:border-blue-600 hover:text-blue-600"
                }`}
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Medications starting with "{selectedLetter}"
          </h3>
          
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-4">
              Click on any medication to view pricing, drug pricing and ordering info.
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.slice(0, 3).map((product) => (
                  <Card key={product.id} className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{product.name}</h4>
                          <p className="text-gray-600 text-sm">{product.manufacturer}</p>
                          <p className="text-blue-600 text-xs font-medium mt-1">{product.description}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Up to 64%
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${(product.price * 2.8).toFixed(2)}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => addToCart(product.id)}
                        >
                          Order
                        </Button>
                      </div>
                      
                      <div className="flex items-center mt-3">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                          <Star className="w-3 h-3 text-gray-300" />
                        </div>
                        <span className="text-xs text-gray-600 ml-2">4.5 (3421)</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Medications Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-600">Shop our most trusted medications with guaranteed quality and fast delivery</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Atorvastatin", "Metformin HCl", "Lisinopril"].map((name, index) => (
              <Card key={name} className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">Rx</span>
                    </div>
                    <Badge className="text-green-600 border-green-600 bg-green-50">
                      Up to {85 + index * 2}%
                    </Badge>
                  </div>
                  <CardTitle className="tracking-tight text-lg font-semibold text-gray-900">
                    {name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {name === "Atorvastatin" ? "Lipitor" : name === "Metformin HCl" ? "Metformin" : "Lisinopril"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          ${(24.99 + index * 12).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${(159.99 - index * 26).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-600 ml-2">4.7 (2847)</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Pharmacy</h2>
            <p className="text-gray-600">Experience the convenience of modern pharmacy services with the trust and safety you deserve</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">FDA Approved Medications</h3>
              <p className="text-gray-600">All medications are sourced from licensed manufacturers and FDA-approved facilities</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free shipping on all orders over $35. Same-day delivery available in select areas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Same-Day Service</h3>
              <p className="text-gray-600">Quick prescription processing and same-day delivery for urgent medication needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Get your prescriptions delivered in just 4 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Prescription</h3>
              <p className="text-gray-600 text-sm">Upload a photo of your prescription or have your doctor send it directly</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review & Pay</h3>
              <p className="text-gray-600 text-sm">Review your order, apply insurance, and complete secure payment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Your medications are prepared and shipped with secure packaging</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Healthy</h3>
              <p className="text-gray-600 text-sm">Receive your medications and stay on track with your health goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of satisfied customers who trust us with their healthcare needs</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Your Order
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
              View FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Rx</span>
                </div>
                <span className="text-xl font-bold text-white">FutureRx</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Your trusted online pharmacy delivering safe, affordable medications to your doorstep. 
                Licensed, regulated, and committed to your health and safety.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-white" href="#">About Us</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">Contact Us</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">Order Tracking</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Legal & Policies</h3>
              <ul className="space-y-2">
                <li><a className="text-gray-300 hover:text-white" href="#">Privacy Policy</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">Terms of Use</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">Refund Policy</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">Medical Disclaimer</a></li>
                <li><a className="text-gray-300 hover:text-white" href="#">Patient Agreement</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 FutureRx. All rights reserved. Licensed Pharmacy - DEA Registration: BF1234567
              </div>
              <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-400">
                <span>FDA Registered</span>
                <span>HIPAA Compliant</span>
                <span>NABP Verified</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;