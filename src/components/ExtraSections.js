export function HowItWorks() {
  const steps = [
    { icon: '📝', title: 'Create Your Campaign', desc: 'Tell your story, set your funding goal, and launch your campaign to the world.' },
    { icon: '🚀', title: 'Share & Get Support', desc: 'Promote your campaign across social media and receive contributions from supporters.' },
    { icon: '💰', title: 'Withdraw Your Funds', desc: 'Once approved, withdraw your raised funds easily through multiple payment methods.' },
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">How It Works</h2>
        <p className="text-center text-gray-600 mb-12">Three simple steps to launch your campaign</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
              <span className="text-5xl block mb-4">{step.icon}</span>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Categories() {
  const cats = ['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment'];
  const icons = ['💻', '🎨', '🤝', '🏥', '📚', '🌿'];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Explore by Category</h2>
        <p className="text-center text-gray-600 mb-12">Find campaigns that match your interests</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((cat, i) => (
            <a key={cat} href={`/campaigns?category=${cat.toLowerCase()}`} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:shadow-md transition group">
              <span className="text-3xl block mb-2 group-hover:scale-110 transition">{icons[i]}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">{cat}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImpactStats() {
  const stats = [
    { number: '10,000+', label: 'Campaigns Launched' },
    { number: '50,000+', label: 'Active Supporters' },
    { number: '$5M+', label: 'Total Credits Raised' },
    { number: '150+', label: 'Countries Reached' },
  ];
  return (
    <section className="py-16 bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Platform Impact in Numbers</h2>
        <p className="text-center text-indigo-200 mb-12">Our community is growing every day</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold mb-2">{s.number}</div>
              <div className="text-indigo-200">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
