export default function Features() {
  const features = [
    {
      icon: "fas fa-language",
      title: "Tamamen Türkçe",
      description: "İngilizce bilmeye gerek kalmadan, tamamen Türkçe arayüz ve modellerle çalışın.",
      color: "bg-primary/20",
      textColor: "text-primary",
    },
    {
      icon: "fas fa-universal-access",
      title: "Herkes İçin Erişilebilir",
      description: "Her yaş ve teknik seviye için özelleştirilmiş, kolay kullanımlı arayüz.",
      color: "bg-indigo-500/20",
      textColor: "text-indigo-500",
    },
    {
      icon: "fas fa-piggy-bank",
      title: "Ücretsiz Kullanım",
      description: "En iyi yapay zeka modellerine ücretsiz olarak erişim sağlayın.",
      color: "bg-pink-500/20",
      textColor: "text-pink-500",
    },
    {
      icon: "fas fa-user-shield",
      title: "Güvenli ve Gizli",
      description: "Verileriniz güvende, gizliliğiniz bizim için önemli.",
      color: "bg-green-500/20",
      textColor: "text-green-500",
    },
    {
      icon: "fas fa-users",
      title: "Topluluk Desteği",
      description: "Sorularınız için destek ve topluluk yardımı.",
      color: "bg-blue-500/20",
      textColor: "text-blue-500",
    },
    {
      icon: "fas fa-book-reader",
      title: "Öğrenme Kaynakları",
      description: "Nasıl kullanılacağını öğrenmek için detaylı rehberler ve videolar.",
      color: "bg-yellow-500/20",
      textColor: "text-yellow-500",
    },
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Neden ZekiBot?</h2>
          <p className="text-xl text-gray-300">Herkes için Türkçe yapay zeka çözümleri sunuyoruz.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-xl border border-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 hover:border-primary/50 cursor-pointer">
              <div className={`w-14 h-14 rounded-full ${feature.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <i className={`${feature.icon} ${feature.textColor} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
