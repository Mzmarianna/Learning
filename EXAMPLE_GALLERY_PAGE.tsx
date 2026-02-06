/**
 * Example Gallery Page
 * 
 * This page demonstrates various ways to add and style images
 * to make your website stunning!
 * 
 * TO USE THIS PAGE:
 * 1. Copy this file to src/pages/ExampleGalleryPage.tsx
 * 2. Add your own images to src/assets/
 * 3. Update the import paths below to match your image names
 * 4. Add a route in your router to view this page
 */

import { motion } from 'motion/react';
import { Star, Heart, Sparkles, Camera } from 'lucide-react';

// STEP 1: Import your images here
// Replace these with your actual image files
// import heroImage from '../assets/your-hero-image.jpg';
// import logo from '../assets/your-logo.png';
// import galleryImage1 from '../assets/gallery-1.jpg';
// import galleryImage2 from '../assets/gallery-2.jpg';
// import galleryImage3 from '../assets/gallery-3.jpg';

export default function ExampleGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      
      {/* EXAMPLE 1: Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Replace with your image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          // style={{ backgroundImage: `url(${heroImage})` }}
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        />
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-pink-900/70" />
        
        {/* Content on top */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mb-6"
          >
            Stunning Image Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl mb-8"
          >
            Learn how to add beautiful images to your site
          </motion.p>
        </div>
      </section>

      {/* EXAMPLE 2: Feature Cards with Images */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-900">
          Feature Cards
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
            {/* Card Image - Replace with your image */}
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              {/* <img src={galleryImage1} alt="Feature 1" className="w-full h-full object-cover" /> */}
              <Camera className="w-20 h-20 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">Feature One</h3>
              <p className="text-gray-600">
                Add your amazing image here to showcase your features beautifully.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
              {/* <img src={galleryImage2} alt="Feature 2" className="w-full h-full object-cover" /> */}
              <Heart className="w-20 h-20 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">Feature Two</h3>
              <p className="text-gray-600">
                Images make your content more engaging and memorable.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
              {/* <img src={galleryImage3} alt="Feature 3" className="w-full h-full object-cover" /> */}
              <Sparkles className="w-20 h-20 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">Feature Three</h3>
              <p className="text-gray-600">
                Use high-quality images that represent your brand well.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXAMPLE 3: Profile/Avatar Images */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-purple-900">
            Profile Pictures
          </h2>
          
          <div className="flex justify-center gap-8 flex-wrap">
            {/* Example Profile 1 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mx-auto mb-4 border-4 border-white shadow-2xl flex items-center justify-center">
                {/* <img src={profile1} alt="Team member" className="w-full h-full rounded-full object-cover" /> */}
                <span className="text-4xl">👨‍🏫</span>
              </div>
              <h4 className="font-bold text-lg text-purple-900">Team Member 1</h4>
              <p className="text-gray-600">Role</p>
            </motion.div>

            {/* Example Profile 2 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 mx-auto mb-4 border-4 border-white shadow-2xl flex items-center justify-center">
                <span className="text-4xl">👩‍🎓</span>
              </div>
              <h4 className="font-bold text-lg text-purple-900">Team Member 2</h4>
              <p className="text-gray-600">Role</p>
            </motion.div>

            {/* Example Profile 3 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 mx-auto mb-4 border-4 border-white shadow-2xl flex items-center justify-center">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h4 className="font-bold text-lg text-purple-900">Team Member 3</h4>
              <p className="text-gray-600">Role</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXAMPLE 4: Image Gallery Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-900">
          Image Gallery
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
            >
              {/* Replace with your gallery images */}
              <div className="w-full h-full bg-gradient-to-br from-purple-300 via-pink-300 to-cyan-300 flex items-center justify-center">
                {/* <img src={galleryImage} alt={`Gallery ${item}`} className="w-full h-full object-cover" /> */}
                <Star className="w-12 h-12 text-white" fill="white" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXAMPLE 5: Floating/Animated Images */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-purple-900">
            Animated Images
          </h2>
          
          <div className="flex justify-center gap-8 flex-wrap">
            {/* Floating Animation */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-2xl flex items-center justify-center"
            >
              {/* <img src={floatingImage} alt="Floating" className="w-full h-full rounded-2xl object-cover" /> */}
              <Sparkles className="w-16 h-16 text-white" />
            </motion.div>

            {/* Pulse Animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-2xl shadow-2xl flex items-center justify-center"
            >
              <Heart className="w-16 h-16 text-white" />
            </motion.div>

            {/* Spin Animation */}
            <motion.div
              animate={{ 
                rotate: 360
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-2xl flex items-center justify-center"
            >
              <Star className="w-16 h-16 text-white" fill="white" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="bg-purple-50 border-4 border-purple-200 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-purple-900">
            🎨 Quick Tips for Stunning Images
          </h2>
          
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span><strong>Optimize before uploading:</strong> Use TinyPNG.com to compress images</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span><strong>Use alt text:</strong> Always add descriptive alt attributes for accessibility</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span><strong>Choose the right format:</strong> JPG for photos, PNG for graphics with transparency, SVG for logos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span><strong>Make it responsive:</strong> Use Tailwind classes like w-full md:w-1/2 lg:w-1/3</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span><strong>Add shadows and effects:</strong> Use shadow-xl, rounded-2xl, and hover effects</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <span><strong>Animate with Framer Motion:</strong> Make images come alive with smooth animations</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12 text-center">
        <p className="text-lg">
          📖 See ADDING_GRAPHICS_AND_PICTURES.md for the complete guide
        </p>
        <p className="text-purple-300 mt-2">
          🚀 Now go make your site STUNNING!
        </p>
      </footer>
    </div>
  );
}
