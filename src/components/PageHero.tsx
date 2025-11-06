import React from "react";

interface PageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
}

const PageHero = ({ title, description, backgroundImage = "/images/wall.png" }: PageHeroProps) => {
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
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageHero;