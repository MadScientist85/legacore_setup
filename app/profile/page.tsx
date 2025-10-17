import { UserProfile } from "@/components/user/user-profile"

export const metadata = {
  title: "Profile | LEGACORE",
  description: "Manage your profile settings",
}

export default function ProfilePage() {
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <UserProfile />
    </div>
  )
}
