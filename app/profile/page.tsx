import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">User Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-lg text-gray-900">{session.user?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="text-lg text-gray-900">{session.user.role || "User"}</p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Verification Info (JWT)</h2>
            <p className="text-sm text-gray-700 mb-4">
              Copy the Access Token below and paste it into <a href="https://jwt.io" target="_blank" className="text-blue-700 underline">jwt.io</a> to verify the claims.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Access Token</label>
                <textarea 
                  readOnly 
                  className="w-full h-32 p-2 mt-1 text-xs font-mono border border-gray-300 rounded bg-gray-50 text-gray-900"
                  value={session.accessToken || "No access token found"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Token</label>
                <textarea 
                  readOnly 
                  className="w-full h-32 p-2 mt-1 text-xs font-mono border border-gray-300 rounded bg-gray-50 text-gray-900"
                  value={session.idToken || "No ID token found"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
