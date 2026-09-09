export const fa = {
  language: 'زبان',
  navigation: 'ناوبری اصلی',
  store: 'فروشگاه',
  storeDescription: 'فروشگاه آنلاین شما',
  welcome: 'به فروشگاه خوش آمدید',
  storePending: 'فروشگاه در حال آماده‌سازی است.',
  footer: 'فروشگاه آنلاین',
  merchant: 'پنل فروشنده',
  merchantDescription: 'فروشگاه خود را بسازید و مدیریت کنید.',
  admin: 'مدیریت پلتفرم',
  adminDescription: 'مدیریت فروشگاه‌ها و عملیات پلتفرم.',
  pending: 'این بخش در حال آماده‌سازی است.',
  soon: 'به‌زودی',
  notFound: 'صفحه پیدا نشد',
  back: 'بازگشت',
  backToStore: 'بازگشت به فروشگاه',
};
export type Messages = { [Key in keyof typeof fa]: string };
