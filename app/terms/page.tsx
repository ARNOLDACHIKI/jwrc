import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/signup">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign Up
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Last updated: January 21, 2026
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="mb-3">
                By accessing and using the Jesus Worship and Restoration Church website and services, 
                you accept and agree to be bound by the terms and provision of this agreement. If you 
                do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                2. Use of Services
              </h2>
              <p className="mb-3">
                Our services are provided for the purpose of spiritual growth, community engagement, 
                and church activities. You agree to use our services only for lawful purposes and in 
                a way that does not infringe upon the rights of others or restrict their use and 
                enjoyment of our services.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must be at least 13 years old to create an account</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You will not use the service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                3. User Account and Registration
              </h2>
              <p className="mb-3">
                To access certain features of our website, you may be required to create an account. 
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                4. Privacy and Data Protection
              </h2>
              <p className="mb-3">
                We are committed to protecting your privacy. Your personal information will be 
                collected, used, and protected in accordance with our Privacy Policy. By using our 
                services, you consent to the collection and use of information as outlined in our 
                Privacy Policy.
              </p>
              <p>
                We collect and process personal data including but not limited to: name, email 
                address, phone number, and location for the purposes of providing church services, 
                event management, and community engagement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                5. Donations and Financial Contributions
              </h2>
              <p className="mb-3">
                All donations and financial contributions made through our platform are voluntary. 
                Please note:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All donations are final and non-refundable unless required by law</li>
                <li>Donation receipts will be provided for tax purposes where applicable</li>
                <li>We use secure payment processing services to protect your financial information</li>
                <li>You are responsible for any fees charged by your financial institution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                6. Event Registration and Participation
              </h2>
              <p className="mb-3">
                When you register for church events through our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You agree to attend the event you registered for or notify us of cancellation</li>
                <li>Event details, dates, and times are subject to change</li>
                <li>The church reserves the right to cancel or modify events</li>
                <li>We may use photos or videos taken at events for promotional purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                7. Content and Intellectual Property
              </h2>
              <p className="mb-3">
                All content on this website, including but not limited to text, graphics, logos, 
                images, audio clips, video clips, sermons, and software, is the property of Jesus 
                Worship and Restoration Church and is protected by copyright laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative works from any 
                content without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                8. User-Generated Content
              </h2>
              <p className="mb-3">
                If you submit suggestions, testimonials, prayer requests, or other content to our 
                platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You grant us a non-exclusive right to use, reproduce, and display the content</li>
                <li>You warrant that your content does not violate any third-party rights</li>
                <li>You agree not to post offensive, defamatory, or inappropriate content</li>
                <li>We reserve the right to remove any content at our discretion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                9. Volunteer Services
              </h2>
              <p className="mb-3">
                If you apply to volunteer through our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You acknowledge that volunteer positions are unpaid</li>
                <li>You agree to comply with church policies and guidelines</li>
                <li>Background checks may be required for certain volunteer positions</li>
                <li>The church reserves the right to accept or decline volunteer applications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                10. Disclaimer of Warranties
              </h2>
              <p className="mb-3">
                Our services are provided "as is" without warranties of any kind, either express or 
                implied. We do not warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The service will be uninterrupted or error-free</li>
                <li>Defects will be corrected</li>
                <li>The service is free of viruses or harmful components</li>
                <li>The results obtained from using the service will be accurate or reliable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                11. Limitation of Liability
              </h2>
              <p className="mb-3">
                To the fullest extent permitted by law, Jesus Worship and Restoration Church shall 
                not be liable for any indirect, incidental, special, consequential, or punitive 
                damages resulting from your use or inability to use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                12. Modifications to Terms
              </h2>
              <p className="mb-3">
                We reserve the right to modify these terms at any time. We will notify users of 
                any significant changes by posting a notice on our website or sending an email to 
                registered users. Your continued use of our services after such modifications 
                constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                13. Termination
              </h2>
              <p className="mb-3">
                We reserve the right to terminate or suspend your account and access to our services 
                at our sole discretion, without notice, for conduct that we believe:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violates these Terms and Conditions</li>
                <li>Is harmful to other users, us, or third parties</li>
                <li>Is unlawful or fraudulent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                14. Governing Law
              </h2>
              <p className="mb-3">
                These Terms and Conditions shall be governed by and construed in accordance with 
                the laws of the jurisdiction in which Jesus Worship and Restoration Church operates, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
                15. Contact Information
              </h2>
              <p className="mb-3">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Jesus Worship and Restoration Church
                </p>
                <p>Email: jwrcjuja.1@gmail.com</p>
                <p>Phone: 0715377835</p>
                <p>Address: <a href="https://maps.app.goo.gl/4ATY5qcF53dtuS668?g_st=aw" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on Google Maps</a></p>
              </div>
            </section>

            <section className="border-t border-gray-300 dark:border-gray-700 pt-6 mt-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                By creating an account or using our services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
