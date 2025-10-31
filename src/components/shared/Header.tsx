"use client"
import { RootState } from '@/store/store';
import { useLocale } from 'next-intl';
import { useSelector } from 'react-redux';
import UserBadgeWithLocale from './UserProfileDropdown';

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const locale = useLocale()
  const ArabicLanguage = locale === "ar";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 py-10">
      <UserBadgeWithLocale firstName={ArabicLanguage ? user?.firstNameAr : user?.firstNameEn} familyName={ArabicLanguage ? user?.familyNameAr : user?.familyNameEn} role={user?.roles[0]} locale={locale} />
    </header>
  )
}

export default Header