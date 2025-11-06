import React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const PageHero = ({ title, description, backgroundImage = "/images/wall.png", breadcrumbs }: PageHeroProps) => {
  return (
    <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4">
        <div className="container mx-auto">
          <div className="text-white max-w-4xl">
            {breadcrumbs && (
              <Breadcrumb items={breadcrumbs} />
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-base md:text-lg lg:text-xl max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;