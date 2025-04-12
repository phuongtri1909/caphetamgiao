"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/ProjectCard";
import { useCategories } from "@/hooks/useAPI";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { truncateHTML } from "@/lib/utils";

const Projects = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({});
  const [currentCategory, setCurrentCategory] = useState("all products");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories from API
        const categoriesData = await getCategories();
        
        // Create mapping between name and slug
        const mapping = {};
        mapping["all products"] = "all products";
        
        categoriesData.forEach(cat => {
          mapping[cat.name] = cat.slug;
        });
        
        setCategoryMapping(mapping);
        
        // Set categories with display names (including "all products")
        setCategories(["all products", ...categoriesData.map(cat => cat.name)]);
        
        // Fetch all products initially
        const productsData = await getProducts();
        setProducts(productsData || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch filtered products when category changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        
        if (currentCategory === "all products") {
          const productsData = await getProducts();
          setProducts(productsData || []);
        } else {
          // Get the slug from our mapping
          const categorySlug = categoryMapping[currentCategory];
          console.log("Fetching products for category slug:", categorySlug);
          
          const productsData = await getProducts({ category: categorySlug });
          setProducts(productsData || []);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    // Only fetch if we've already loaded categories initially
    if (categories.length > 0) {
      fetchFilteredProducts();
    }
  }, [currentCategory, categoryMapping]);

  if (error) {
    return (
      <section className="min-h-screen pt-12">
        <div className="container mx-auto text-center">
          <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
            Sản Phẩm
          </h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-12">
      <div className="container mx-auto">
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
          Sản Phẩm
        </h2>
        {/* Tabs */}
        <Tabs defaultValue={currentCategory} className="mb-24 xl:mb-48">
          {/* Danh mục trượt ngang trên mobile */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-4 mb-12 mx-auto md:border dark:border-none px-4">
              {loading && categories.length === 0 ? (
                <div className="text-center w-full py-4">Đang tải danh mục...</div>
              ) : (
                categories.map((cat, index) => (
                  <TabsTrigger
                    key={index}
                    value={cat}
                    onClick={() => setCurrentCategory(cat)}
                    className="capitalize px-4 py-2 md:w-auto whitespace-nowrap"
                  >
                    {cat}
                  </TabsTrigger>
                ))
              )}
            </TabsList>
          </div>
          {/* Tabs Content */}
          <div className="text-lg xl:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8">Đang tải sản phẩm...</div>
            ) : products.length === 0 ? (
              <div className="col-span-3 text-center py-8">Không có sản phẩm nào trong danh mục này</div>
            ) : (
              products.map((product, index) => (
                <TabsContent key={index} value={currentCategory}>
                  <ProjectCard project={{
                    image: product.image,
                    category: product.category?.name || "Không phân loại",
                    name: product.name,
                    description: truncateHTML(product.description, 150),
                    slug: product.slug,
                    price: product.min_discounted_price ? `${product.min_discounted_price.toLocaleString('vi-VN')} đ` : "Liên hệ",
                  }} />
                </TabsContent>
              ))
            )}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;