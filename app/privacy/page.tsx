import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            At Code Muse, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our website and services.
          </p>
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, use our services, or
            communicate with us. This may include your name, email address, and any code or data you input into our
            system.
          </p>
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to develop new features,
            and to protect Code Muse and our users.
          </p>
          <h2 className="text-2xl font-semibold">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal
            information. However, please note that no method of transmission over the Internet or method of electronic
            storage is 100% secure.
          </p>
          <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page.
          </p>
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us .</p>
        </CardContent>
      </Card>
    </div>
  )
}
