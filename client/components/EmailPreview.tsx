import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";

interface EmailPreviewProps {
  userName: string;
  userEmail: string;
  provider: "email" | "google" | "facebook";
  isNewUser: boolean;
}

export function EmailPreview({
  userName,
  userEmail,
  provider,
  isNewUser,
}: EmailPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const providerName =
    provider === "google"
      ? "Google"
      : provider === "facebook"
        ? "Facebook"
        : "email";

  const actionText = isNewUser ? "signing up" : "logging in";
  const welcomeText = isNewUser ? "Welcome to" : "Welcome back to";

  return (
    <Dialog open={isOpen} onValueChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Mail className="h-4 w-4" />
          Preview Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Welcome Email Preview</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white rounded-t-lg">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                Dubai<span className="text-yellow-300">Visa</span>Directory
              </div>
              <h2 className="text-xl">
                {welcomeText} Dubai's Premier Immigration Directory!
              </h2>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-gray-50">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hello {userName}! 👋</h3>

              <p>
                Thank you for {actionText} with Dubai Visa Directory via{" "}
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {providerName}
                </span>
                !
              </p>

              {isNewUser ? (
                <div>
                  <p className="font-semibold">
                    🎉 Welcome to our community! You now have access to:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>✅ Browse verified immigration and visa services</li>
                    <li>✅ Read authentic customer reviews</li>
                    <li>✅ Write reviews for businesses you've used</li>
                    <li>✅ Get personalized recommendations</li>
                    <li>✅ Direct contact with service providers</li>
                  </ul>
                </div>
              ) : (
                <p>
                  🔄 <strong>Welcome back!</strong> Continue exploring our
                  trusted network of immigration professionals.
                </p>
              )}

              <p>
                With over 150+ verified businesses and 2,500+ authentic reviews,
                we're here to help you find the right immigration services in
                Dubai.
              </p>

              <div className="text-center py-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Exploring Services
                </Button>
              </div>

              <div className="bg-white p-4 border-l-4 border-blue-600 rounded">
                <h4 className="font-semibold">🛡️ Your Privacy & Security</h4>
                <p className="text-sm">
                  Your account is secured via {providerName} authentication. We
                  never store your social login passwords and only access basic
                  profile information with your consent.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">📞 Need Help?</h4>
                <p className="text-sm">
                  Our support team is here to assist you:
                </p>
                <ul className="text-sm list-disc list-inside ml-4">
                  <li>📧 Email: support@dubaiintegral.example.com</li>
                  <li>📱 WhatsApp: +971-50-XXX-XXXX</li>
                  <li>🕒 Business Hours: 9 AM - 6 PM GST</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center text-xs text-gray-600">
              <p>Dubai Visa Directory - Your Trusted Immigration Partner</p>
              <p>
                This email was sent to {userEmail} because you {actionText} on
                our platform.
              </p>
              <div className="flex justify-center gap-4 mt-2">
                <button className="text-gray-500 hover:underline">
                  Unsubscribe
                </button>
                <button className="text-gray-500 hover:underline">
                  Privacy Policy
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
