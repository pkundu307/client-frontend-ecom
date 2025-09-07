import { ShoppingCart } from 'lucide-react'
import React from 'react'

const Demand = () => {
  return (
    <div>
      <section className="bg-royal-green/55 py-12 px-6 min-h-screen">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-royal-gold mb-4 relative inline-block">
        Hot Demand
        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-royal-gold/30 w-3/4 mx-auto"></span>
      </h2>
      <p className="text-white/80 mt-4">Curated Royal Choices for Discerning Tastes</p>
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((item) => (
        <div key={item} className="group relative bg-royal-green rounded-xl border-2 border-royal-gold/20 hover:border-royal-gold/40 transition-all duration-300 hover:scale-[1.02] shadow-xl">
          {/* Product Image Container */}
          <div className="h-64 bg-royal-green/80 rounded-t-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-royal-green via-transparent to-transparent z-10"/>
            {/* Replace with actual image */}
            <div className="w-full h-full animate-pulse bg-royal-gold/10"/>
          </div>

          {/* Product Info */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-royal-gold mb-2">Royal Heritage Box</h3>
            <p className="text-white/80 text-sm mb-4">Handcrafted luxury with 24k gold detailing</p>
            
            {/* Price & CTA */}
            <div className="flex justify-between items-center">
              <span className="text-royal-gold font-bold text-lg">₹29,999</span>
              <button className="bg-royal-gold text-royal-green px-4 py-2 rounded-lg hover:bg-royal-green hover:text-royal-gold transition-colors flex items-center gap-2">
                <ShoppingCart className="w-5 h-5"/>
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Demand Badge */}
          <div className="absolute top-4 right-4 bg-royal-gold text-royal-green px-3 py-1 rounded-full text-sm font-bold">
            98% Sold
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
    </div>
  )
}

export default Demand
