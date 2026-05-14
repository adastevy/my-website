import ProfileCard from '../components/profile/ProfileCard';
import LogoutButton from '../components/profile/LogoutButton';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileCard />
      <LogoutButton />
    </div>
  );
}
