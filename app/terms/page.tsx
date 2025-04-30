import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to Code Muse. By using our website and services, you agree to comply with and be bound by the
            following terms and conditions of use.
          </p>
          <h2 className="text-2xl font-semibold">Use of Service</h2>
          <p>
            You agree to use Code Muse for lawful purposes only and in a way that does not infringe the rights of,
            restrict or inhibit anyone else's use and enjoyment of the website.
          </p>
          <h2 className="text-2xl font-semibold">Intellectual Property</h2>
          <p>
            The content on Code Muse, including without limitation, the text, software, scripts, graphics, photos,
            sounds, music, videos, interactive features and the like and the trademarks, service marks and logos
            contained therein, are owned by or licensed to Code Muse.
          </p>
          <h2 className="text-2xl font-semibold">User-Generated Content</h2>
          <p>
            You retain ownership of any intellectual property rights that you hold in content you submit to Code Muse.
            By submitting content, you grant Code Muse a worldwide, royalty-free license to use, reproduce, distribute,
            and display such content.
          </p>
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p>
            Code Muse shall not be liable for any indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
          <h2 className="text-2xl font-semibold">Changes to These Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of Code Muse after any such
            changes constitutes your acceptance of the new Terms of Service.
          </p>
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us .</p>
        </CardContent>
      </Card>
    </div>
  )
}
