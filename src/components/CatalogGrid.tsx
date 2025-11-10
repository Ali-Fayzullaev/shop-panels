"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { getAllCategories, type Category } from "@/data/types"
import productsData from "@/data/products.json"

interface CatalogItem {
  id: string
  title: string
  description: string
  image: string
  href: string
  isSpecial?: boolean
  productsCount?: number
}

// Получаем категории из JSON файла
const getCategories = (): Category[] => {
  return Object.values(productsData.categories as any)
}

const catalogItems: CatalogItem[] = getCategories().map(category => ({
  id: category.id,
  title: category.name,
  description: category.description,
  image: category.image,
  href: `/${category.id}`,
  isSpecial: category.isSpecial || false,
  productsCount: category.products.length
}))

export function CatalogGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            КАТАЛОГ ПРОДУКЦИИ
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Широкий ассортимент декоративных стеновых панелей для любых интерьерных решений
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group block overflow-hidden bg-white transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                item.isSpecial ? "md:col-span-full lg:col-span-full" : ""
              }`}
            >
              <div className="relative">
                <div className={`relative overflow-hidden bg-gray-100 ${
                  item.isSpecial ? "aspect-3/1" : "aspect-4/3"
                }`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Оверлей с названием */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-100 transition-opacity">
                    <h3 className="text-white text-xl md:text-2xl font-bold text-center px-4 mb-2">
                      {item.title}
                    </h3>
                    {item.productsCount && (
                      <div className="text-white text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {item.productsCount} товар{item.productsCount > 1 && item.productsCount < 5 ? 'а' : item.productsCount === 1 ? '' : 'ов'}
                      </div>
                    )}
                  </div>

                  {/* Бейджи скидок для sale */}
                  {item.isSpecial && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-red-500 text-white hover:bg-red-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.898-.088L9.75 13.9 6.5 15a1 1 0 01-.416-1.962L9.25 12.1 8.069 8.456a1 1 0 011.898-.088L11.146 7.2 14.5 5.266a1 1 0 010-1.732L11.146 1.8 12.067 2.744A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                        СКИДКА
                      </Badge>
                      <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                        ДО 50%
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}