export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-600 border-l-4 border-palette-3">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-palette-3 mb-3">Acceptance of Terms</h2>
            <p>
              By using Color Palette Generator, you agree to these terms of service. If you do not agree, please do not use the tool.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-palette-4 mb-3">Use of the Tool</h2>
            <p>
              Color Palette Generator is provided for general creative and design use. The tool generates color combinations based on color theory principles and randomization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-palette-5 mb-3">No Warranty</h2>
            <p>
              The tool is provided "as is" without any warranties, expressed or implied. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Generated palettes are suitable for any specific brand or use case</li>
              <li>Colors meet all accessibility requirements in your context</li>
              <li>Generated palettes are unique or not already in use</li>
              <li>The tool will be available without interruptions</li>
              <li>Colors will appear identical on all devices and screens</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-palette-1 mb-3">User Responsibility</h2>
            <p>
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Testing color combinations in your actual design context</li>
              <li>Verifying accessibility compliance for your specific use case</li>
              <li>Ensuring your use of generated colors does not infringe on existing trademarks or intellectual property</li>
              <li>Backing up saved palettes if you wish to keep them long-term</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-palette-2 mb-3">Intellectual Property</h2>
            <p>
              Generated color palettes are not exclusive intellectual property. You are free to use them for personal, commercial, or any type of project without attribution or restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-palette-3 mb-3">Accessibility Disclaimer</h2>
            <p>
              The contrast guidance and accessibility labels provided by this tool are simplified estimates. They should not be considered a substitute for professional accessibility testing in your specific design context.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-palette-4 mb-3">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the tool after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
