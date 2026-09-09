import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  AppProviders,
  Button,
  LanguageSwitcher,
  useLocale,
} from '@store-builder/ui';
import {
  isLocale,
  locales,
  localizedPath,
  savedLocale,
} from '@store-builder/i18n';
import '../../../libs/ui/src/styles.css';

const segment = window.location.pathname.split('/')[1];
const locale = isLocale(segment) ? segment : savedLocale(document.cookie);
if (!isLocale(segment)) {
  window.history.replaceState(
    null,
    '',
    localizedPath(location.pathname, locale) + location.search + location.hash,
  );
}
document.documentElement.lang = locale;
document.documentElement.dir = locales[locale].direction;
document.title = locales[locale].messages.admin;
function Home() {
  const { messages } = useLocale();
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">{messages.admin}</h1>
      <p className="mt-4">{messages.adminDescription}</p>
      <p className="mt-6 rounded-md bg-muted p-4">{messages.pending}</p>
      <Button className="mt-6" disabled>
        {messages.soon}
      </Button>
    </main>
  );
}
function Panel() {
  const { messages } = useLocale();
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
        <nav aria-label={messages.navigation}>
          <Link to="/">{messages.admin}</Link>
        </nav>
        <LanguageSwitcher />
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="*"
          element={
            <main className="p-8">
              <h1>{messages.notFound}</h1>
              <Link to="/">{messages.back}</Link>
            </main>
          }
        />
      </Routes>
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders locale={locale}>
      <BrowserRouter basename={'/' + locale}>
        <Panel />
      </BrowserRouter>
    </AppProviders>
  </StrictMode>,
);
