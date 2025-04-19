import React from 'react';
import { TagIcon } from 'lucide-react';
interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  expiryDate: string;
  imageUrl: string;
}
const offers: Offer[] = [{
  id: '1',
  title: '50% OFF',
  description: 'On your first order',
  code: 'WELCOME50',
  expiryDate: '2024-12-31',
  imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
}, {
  id: '2',
  title: '30% OFF',
  description: 'Orders above $30',
  code: 'SAVE30',
  expiryDate: '2024-12-31',
  imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
}, {
  id: '3',
  title: 'Free Delivery',
  description: 'On orders above $50',
  code: 'FREEDEL',
  expiryDate: '2024-12-31',
  imageUrl: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
}];
const OffersSection: React.FC = () => {
  return <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <TagIcon size={24} className="text-black mr-2" />
          <h2 className="text-2xl font-bold text-black">Latest Offers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => <div key={offer.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <div className="relative h-40">
                <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">
                    {offer.title}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-2">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">
                    Use code: {offer.code}
                  </span>
                  <button className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-900 transition-colors">
                    Copy Code
                  </button>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default OffersSection;