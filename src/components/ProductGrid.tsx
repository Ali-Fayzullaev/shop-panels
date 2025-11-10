"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { formatPrice } from "@/data/types"
import type { Product } from "@/data/types"

interface ProductGridProps {
  products: Product[]
  categoryId: string
}

export function ProductGrid({ products, categoryId }: ProductGridProps) {
  // Проверяем, что products существует и является массивом
  const validProducts = Array.isArray(products) ? products : [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validProducts.map((product) => (
            <Link
              key={product.id}
              href={`/${categoryId}/${product.id}`}
              className="group block overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="relative overflow-hidden bg-gray-100 aspect-4/3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Бейдж акции */}
                  {product.saleInfo?.isOnSale && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white hover:bg-red-600">
                        {product.saleInfo.badge}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Информация о товаре */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      SKU: {product.sku}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.specifications.size}
                    </span>
                  </div>
                  
                  {/* Цена */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {product.unit}
                    </span>
                    
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {formatPrice(product.originalPrice, product.currency)}
                      </span>
                    )}
                  </div>
                  
                  {/* Доступные толщины */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.specifications?.thickness?.map((thickness, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {thickness}
                      </span>
                    )) || (
                      <span className="text-xs text-gray-500">
                        Толщина не указана
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {validProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              В данной категории товары временно отсутствуют
            </div>
            <Link 
              href="/catalog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Посмотреть другие категории
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}