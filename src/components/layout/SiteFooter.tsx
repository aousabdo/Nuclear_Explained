import { useAppStore } from '../../hooks/useAppStore'

export function SiteFooter() {
  const language = useAppStore((s) => s.language)

  return (
    <footer id="footer" className="relative z-10 border-t border-border py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className="text-2xl font-bold text-text-primary">
          {language === 'ar' ? 'المصادر والمراجع' : 'Sources & References'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-start">
          <div className="bg-bg-secondary rounded-lg p-4 border border-border space-y-2">
            <h3 className="font-semibold text-text-primary">
              {language === 'ar' ? 'المصادر الرئيسية' : 'Primary Sources'}
            </h3>
            <ul className="space-y-1 text-text-secondary text-xs">
              {language === 'ar' ? <>
                <li>غلاستون ودولان، "تأثيرات الأسلحة النووية" (1977) — وزارة الدفاع الأمريكية</li>
                <li>الكتاب النووي لـ FAS — اتحاد علماء أمريكا</li>
                <li>NUKEMAP بقلم أليكس ويلرشتاين — مدونة Nuclear Secrecy</li>
                <li>الأكاديمية الوطنية للعلوم — تقارير الأسلحة النووية</li>
              </> : <>
                <li>Glasstone & Dolan, "The Effects of Nuclear Weapons" (1977) — US DoD</li>
                <li>FAS Nuclear Notebook — Federation of American Scientists</li>
                <li>NUKEMAP by Alex Wellerstein — Nuclear Secrecy Blog</li>
                <li>National Academy of Sciences — Nuclear Weapons Reports</li>
              </>}
            </ul>
          </div>
          <div className="bg-bg-secondary rounded-lg p-4 border border-border space-y-2">
            <h3 className="font-semibold text-text-primary">
              {language === 'ar' ? 'المنهجية العلمية' : 'Methodology'}
            </h3>
            <ul className="space-y-1 text-text-secondary text-xs">
              {language === 'ar' ? <>
                <li>قياس الانفجار: r ∝ Y^(1/3) — قانون الجذر التكعيبي</li>
                <li>الحرارة: r ∝ Y^(0.41) مع الامتصاص الجوي</li>
                <li>التساقط: نموذج انتشار غاوسي مبسّط</li>
                <li>جميع البيانات من مصادر غير سرية ومتاحة للعموم</li>
              </> : <>
                <li>Blast scaling: r ∝ Y^(1/3) cube-root scaling law</li>
                <li>Thermal: r ∝ Y^(0.41) with atmospheric absorption</li>
                <li>Fallout: Simplified Gaussian plume dispersion model</li>
                <li>All data from publicly available, unclassified sources</li>
              </>}
            </ul>
          </div>
        </div>
        <p className="text-text-muted text-sm max-w-xl mx-auto">
          {language === 'ar'
            ? 'هذا مورد تعليمي. جميع البيانات من مصادر متاحة للعموم. هذه الحسابات نماذج مبسّطة — تعتمد التأثيرات الفعلية على عوامل عديدة منها التضاريس والطقس وتصميم السلاح.'
            : 'This is an educational resource. All data is from publicly available sources. These calculations are simplified models — actual weapon effects depend on many additional factors including terrain, weather, and weapon design.'
          }
        </p>
        <div className="space-y-2">
          <p className="text-text-muted text-xs">
            {language === 'ar' ? 'بناء بواسطة' : 'Built by'}{' '}
            <span className="text-text-secondary font-semibold">Dr. Aous Abdo</span>
            {' '}·{' '}
            <a
              href="https://analyticadss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-blast transition-colors underline underline-offset-2"
            >
              Analytica Data Science Solutions
            </a>
          </p>
          <p className="text-text-muted text-xs">
            {language === 'ar'
              ? 'دكتوراه، فيزياء الجسيمات الفلكية · ماجستير، الفيزياء النووية · عالم سابق — مختبر لوس ألاموس الوطني · ناسا · وزارة الدفاع الأمريكية'
              : 'Ph.D., Astroparticle Physics · M.S., Nuclear Physics · Former Scientist — Los Alamos National Laboratory · NASA · U.S. Department of Defense'
            }
          </p>
          <p className="text-text-muted text-xs">
            <span className="inline-flex items-center gap-1 bg-green-950/40 border border-green-900/30 text-green-400/70 px-2 py-0.5 rounded-full text-[10px]">
              ✓ {language === 'ar' ? 'البيانات محدّثة: يناير 2025' : 'Data verified: Jan 2025'}
            </span>
            <span className="mx-2 text-border">·</span>
            <a href="/privacy.html" className="hover:text-text-secondary transition-colors underline underline-offset-2">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
