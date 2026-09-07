import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProviders, Button } from '@store-builder/ui';
import '../../../..//libs/ui/src/styles.css';
function Home() { return <><header className="border-b px-6 py-4"><nav aria-label="ناوبری اصلی"><Link to="/">مدیریت پلتفرم</Link></nav></header><main className="mx-auto max-w-4xl px-6 py-16"><h1 className="text-3xl font-bold">مدیریت پلتفرم</h1><p className="mt-4">مدیریت فروشگاه‌ها و عملیات پلتفرم.</p><p className="mt-6 rounded-md bg-muted p-4">این بخش در حال آماده‌سازی است.</p><Button className="mt-6" disabled>به‌زودی</Button></main></>; }
createRoot(document.getElementById('root')!).render(<StrictMode><AppProviders><BrowserRouter><Routes><Route path="/" element={<Home/>}/><Route path="*" element={<main className="p-8"><h1>صفحه پیدا نشد</h1><Link to="/">بازگشت</Link></main>}/></Routes></BrowserRouter></AppProviders></StrictMode>);

