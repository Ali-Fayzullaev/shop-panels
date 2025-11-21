import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import productsData from "@/data/products.json";
import { formatPrice, type Product, type Category } from "@/data/types";

interface ProductPageProps {
  params: Promise<{
    category: string;
    product: string;
  }>;
}

function getProduct(categoryId: string, productId: string): { product: Product; category: Category } | null {
  const category = productsData.categories[categoryId as keyof typeof productsData.categories] as Category;
  if (!category) return null;
  
  const product = category.products.find(p => p.id === productId);
  if (!product) return null;
  
  return { product, category };
}

export function generateStaticParams() {
  const params: { category: string; product: string }[] = [];
  
  Object.entries(productsData.categories).forEach(([categoryId, category]) => {
    category.products.forEach((product) => {
      params.push({
        category: categoryId,
        product: product.id
      });
    });
  });
  
  return params;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const result = getProduct(resolvedParams.category, resolvedParams.product);
  
  if (!result) {
    notFound();
  }
  
  const { product, category } = result;
  
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: category.name, href: `/${category.id}` },
    { label: product.name }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Хлебные крошки */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Изображения товара */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {product.saleInfo?.isOnSale && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white hover:bg-red-600">
                    {product.saleInfo.badge}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Дополнительные изображения */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((img, index) => (
                <div key={index} className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {product.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>SKU: <span className="font-medium text-gray-700">{product.sku}</span></span>
                <span>•</span>
                <span>В наличии</span>
              </div>
            </div>

            {/* Цена */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="text-lg text-gray-500">/ {product.unit}</span>
              </div>
              
              {product.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    Скидка {product.discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Характеристики */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Характеристики</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Размер</span>
                  <span className="font-medium text-gray-900">{product.specifications.size}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Материал</span>
                  <span className="font-medium text-gray-900">{product.specifications.material}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Покрытие</span>
                  <span className="font-medium text-gray-900">{product.specifications.finish}</span>
                </div>
                {product.specifications.length && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Длина</span>
                    <span className="font-medium text-gray-900">{product.specifications.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Доступные толщины */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Толщина</h3>
              <div className="flex flex-wrap gap-2">
                {product.specifications.thickness.map((thickness, index) => (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="thickness"
                      defaultChecked={index === 0}
                      className="sr-only peer"
                    />
                    <div className="px-4 py-2 border-2 border-gray-200 rounded-lg peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                      <span className="font-medium">{thickness}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="space-y-4 pt-6">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                Заказать консультацию
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Рассчитать стоимость
              </Button>
            </div>

            {/* Дополнительная информация */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <h4 className="font-semibold text-gray-900">Важная информация</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Профессиональный монтаж по всему Казахстану</li>
                <li>• Гарантия качества на все изделия</li>
                <li>• Доставка в день заказа по Астане</li>
                <li>• Индивидуальные размеры под заказ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Похожие товары */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Похожие товары</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.products
              .filter(p => p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/${category.id}/${relatedProduct.id}`}
                  className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-4/3 bg-gray-100">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(relatedProduct.price, relatedProduct.currency)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}