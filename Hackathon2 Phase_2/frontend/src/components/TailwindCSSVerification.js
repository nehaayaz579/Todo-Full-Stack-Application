// Test component to verify Tailwind CSS is working
export default function TailwindCSSVerification() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Tailwind CSS Verification</h1>
        
        <div className="space-y-4">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            <p className="font-medium">This should have a red background (bg-red-500)</p>
          </div>
          
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <p className="font-medium">This should have a blue background (bg-blue-500)</p>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">This should be in a flex container (flex, items-center, justify-between)</span>
          </div>
          
          <div className="p-4 m-4 bg-green-100 border-2 border-green-500 rounded-lg">
            <p className="text-green-800">This has padding and margin (p-4, m-4) with borders (border-2)</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
            Hover Effect Button
          </button>
        </div>
      </div>
    </div>
  );
}