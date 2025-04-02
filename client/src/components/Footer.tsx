export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 text-center border-t border-gray-200 pt-6 pb-8">
      <div className="text-sm text-gray-500">
        Lawrence Blog © {currentYear}, All rights reserved.
      </div>
      <div className="mt-2 text-xs text-gray-400">
        <span>ICP License</span>
      </div>
    </footer>
  );
}
