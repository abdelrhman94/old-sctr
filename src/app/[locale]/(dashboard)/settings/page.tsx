'use client'
import { useTranslations } from 'next-intl';

const SettingsPage = () => {
  const t = useTranslations('SettingsPage');


  return (
    <section className='p-4'>
      <h2 className='text-[#202020] font-semibold text-3xl my-1'>{t('title')}</h2>

    </section>
  )
}

export default SettingsPage