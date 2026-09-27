export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-600">
          <p>
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>
            <p>
              Color Palette Generator is a free, client-side tool that runs entirely in your browser. This privacy policy explains how we handle data when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p>
              We do not collect any personal information. Our tool does not require:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Account creation</li>
              <li>Email addresses</li>
              <li>Personal details</li>
              <li>Payment information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Information You Store</h2>
            <p>
              When you save palettes, they are stored locally in your browser using localStorage. This data:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Stays only on your device</li>
              <li>Is never transmitted to our servers</li>
              <li>Can be cleared by clearing your browser data</li>
              <li>Is not accessible to us or any third party</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Shared Palette URLs</h2>
            <p>
              When you share a palette via URL, the color values are embedded directly in the URL. Anyone with the URL can view the colors. We do not store shared palettes on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h2>
            <p>
              Currently, we do not use analytics tools. If we add analytics in the future, we will update this privacy policy and disclose what data is collected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify users of significant changes by updating the "Last updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
