# Potato Backend · UI Preview 0.1

واجهة أولية متجاوبة باللغة العربية، مصممة للهاتف أولاً.

## التشغيل
افتح `index.html` في المتصفح. لا تحتاج إلى تثبيت حزم.

## الموجود حالياً
- تنقل بين البيانات وأدوات العمل والإعدادات.
- مخطط تفاعلي لعناصر المشروع.
- صفحات أولية للأدوات الأربع.
- بحث عام في أقسام الواجهة.
- ثيم داكن وفاتح وثيم النظام مع حفظ الاختيار محلياً.
- محرر نصوص أولي مع تحديد/نسخ/قص/لصق/تراجع/إعادة/مسح وتنزيل الملف.

## غير المنفذ بعد
لا يوجد اتصال بـ Supabase أو Backend مستقل، ولا توجد عمليات SQL أو إدارة مفاتيح حقيقية. الحقول المعطلة مجرد أماكن مخصصة للمرحلة التالية. لا تضعي أسراراً حقيقية داخل ملفات الواجهة.


## SQL Table playground
The SQL Table tool currently provides a browser-local playground with sample tables, table creation, row insertion/deletion, search, CSV export, and a limited read-only SELECT query parser. Data is saved in localStorage on the current browser only. It is not connected to Supabase or a remote database, and the query console does not execute arbitrary SQL.
