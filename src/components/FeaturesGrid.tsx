import React from "react";
import { 
  Lightbulb, 
  Zap, 
  Palette, 
  Settings, 
  Blend, 
  Sparkles 
} from "lucide-react";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    icon: <Lightbulb className="w-12 h-12 " style={{ color: '#333333' }} />,
    title: "Инновационный состав",
    description: "Новый, ранее не используемый в РФ, состав из бамбука и прочного 3D-нанопокрытия или плёнки. Панели Baijax не имеют аналогов в России."
  },
  {
    icon: <Zap className="w-12 h-12" style={{ color: '#333333' }} />,
    title: "Легкий и быстрый монтаж",
    description: "Установка панелей более быстрый процесс, чем традиционная отделка стен. Это позволяет сократить время ремонта и снизить затраты на рабочую силу."
  },
  {
    icon: <Palette className="w-12 h-12" style={{ color: '#333333' }} />,
    title: "Разнообразие дизайна",
    description: "Предлагаем множество вариантов оттенков, фактур и размеров панелей, что даёт возможность реализации различных дизайнерских решений."
  },
  {
    icon: <Settings className="w-12 h-12" style={{ color: '#333333' }} />,
    title: "Легкость в использовании",
    description: "Отсутствие стыковых швов позволяет создать единый облик стены, а высокая гибкость даёт возможность замены одной панели, вместо всего панельного ряда."
  },
  {
    icon: <Blend className="w-12 h-12" style={{ color: '#333333' }} />,
    title: "Гибкость материала",
    description: "Панели обладают повышенной гибкостью и могут быть легко установлены на любые поверхности, в том числе изогнутые и радиусные."
  },
  {
    icon: <Sparkles className="w-12 h-12" style={{ color: '#333333' }} />,
    title: "Удобство в уходе",
    description: "Панели легко чистить, что сильно облегчает обслуживание любого помещения. Помимо этого, они устойчивы к внешним воздействиям (влага, плесень)."
  }
];

export function FeaturesGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ПРАКТИЧНЫЙ ВАРИАНТ ОТДЕЛКИ СТЕН
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Преимущества наших декоративных панелей для современного интерьера
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 aspect-4/3 flex flex-col"
            >
              {/* Иконка */}
              <div className="mb-6 font-light">
                {feature.icon}
              </div>

              {/* Заголовок */}
              <h3 className="text-xl  mb-4" style={{ color: '#333333' }}>
                {feature.title}
              </h3>

              {/* Описание */}
              <p className="text-base leading-relaxed grow" style={{ color: '#989898' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}