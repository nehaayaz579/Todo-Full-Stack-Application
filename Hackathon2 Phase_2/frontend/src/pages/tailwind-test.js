import Head from 'next/head';

export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Tailwind CSS Test</title>
        <meta name="description" content="Test page to verify Tailwind CSS is working" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Tailwind CSS Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Test 1: Background Color */}
          <div className="bg-red-500 p-6 rounded-lg text-white text-center">
            <h2 className="text-xl font-semibold mb-2">Red Background</h2>
            <p>This should have a red background</p>
          </div>
          
          {/* Test 2: Flexbox */}
          <div className="flex items-center justify-center h-24 bg-blue-100 rounded-lg">
            <span className="text-blue-800 font-medium">Flex Centered Content</span>
          </div>
          
          {/* Test 3: Padding/Margin */}
          <div className="p-4 m-4 bg-green-100 border-2 border-green-500 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800">Padding & Margin</h2>
            <p className="text-green-600">This has padding and margin applied</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">More Tailwind Classes Test</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                Button 1
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                Button 2
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-700">Yellow bordered box</p>
              </div>
              <div className="bg-pink-100 border-t-4 border-pink-500 p-4 rounded">
                <p className="text-pink-700">Pink top-bordered box</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}