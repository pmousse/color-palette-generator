import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
              Color Palette Generator
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              Create beautiful, accessible color palettes for websites, brands, apps, and creative
              projects in seconds.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Runs in your browser. No signup required.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
              Coming Soon
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              Pro exports and brand kits with advanced accessibility checks, team sharing, and PDF
              brand guidelines.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Color Palette Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
