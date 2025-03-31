import { Link } from "wouter";

const categories = [
  {
    id: "visual",
    name: "Görsel",
    description: "Resim oluştur",
    icon: "fas fa-image",
    color: "bg-primary/20",
    hoverColor: "bg-primary/30",
    textColor: "text-primary",
  },
  {
    id: "chat",
    name: "Sohbet",
    description: "AI ile konuş",
    icon: "fas fa-comments",
    color: "bg-indigo-500/20",
    hoverColor: "bg-indigo-500/30",
    textColor: "text-indigo-500",
  },
  {
    id: "math",
    name: "Hesap",
    description: "Matematik yardımı",
    icon: "fas fa-calculator",
    color: "bg-pink-500/20",
    hoverColor: "bg-pink-500/30",
    textColor: "text-pink-500",
  },
  {
    id: "game",
    name: "Oyun",
    description: "Eğlenceli oyunlar",
    icon: "fas fa-gamepad",
    color: "bg-green-500/20",
    hoverColor: "bg-green-500/30",
    textColor: "text-green-500",
  },
  {
    id: "code",
    name: "Kod",
    description: "Programlama desteği",
    icon: "fas fa-code",
    color: "bg-yellow-500/20",
    hoverColor: "bg-yellow-500/30",
    textColor: "text-yellow-500",
  },
];

export default function Categories() {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
          {categories.map((category) => (
            <Link key={category.id} href={`/models?category=${category.id}`}>
              <div className="p-4 bg-card hover:bg-muted rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 cursor-pointer group">
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:${category.hoverColor} group-hover:scale-110`}>
                  <i className={`${category.icon} ${category.textColor} text-xl`}></i>
                </div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
