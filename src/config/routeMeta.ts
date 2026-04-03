interface RouteMeta {
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
}

export const ROUTE_META: Record<string, RouteMeta> = {
  home: {
    titleEn: 'Nuclear Explained — Interactive Nuclear Weapons Physics',
    titleAr: 'النووي ببساطة — دليل تفاعلي للأسلحة النووية',
    descriptionEn: 'Interactive nuclear weapons physics simulator. Explore blast radii, fallout plumes, and scaling laws based on Glasstone & Dolan.',
    descriptionAr: 'محاكي تفاعلي للأسلحة النووية — احسب نطاق الانفجار والإشعاع والتساقط بناءً على قوانين جلاستون ودولان الفيزيائية',
  },
  blast: {
    titleEn: 'The Blast — Nuclear Explained',
    titleAr: 'الانفجار — النووي ببساطة',
    descriptionEn: 'What happens in the first seconds of a nuclear detonation. Explore the fireball, shockwave, and destruction zones.',
    descriptionAr: 'ماذا يحدث في الثواني الأولى من الانفجار النووي. استكشف الكرة النارية وموجة الصدمة ومناطق الدمار.',
  },
  consequences: {
    titleEn: 'Consequences — Nuclear Explained',
    titleAr: 'التداعيات — النووي ببساطة',
    descriptionEn: 'The human and environmental toll of nuclear weapons. Nuclear winter, survival, and long-term impact.',
    descriptionAr: 'الثمن البشري والبيئي للأسلحة النووية. الشتاء النووي والبقاء والتأثير طويل المدى.',
  },
  threat: {
    titleEn: 'The Threat — Nuclear Explained',
    titleAr: 'التهديد — النووي ببساطة',
    descriptionEn: 'The global nuclear threat today. Missile trajectories, arsenals, and near-miss incidents.',
    descriptionAr: 'التهديد النووي العالمي اليوم. مسارات الصواريخ والترسانات وحوادث الاقتراب.',
  },
  history: {
    titleEn: 'History — Nuclear Explained',
    titleAr: 'التاريخ — النووي ببساطة',
    descriptionEn: '2,056 nuclear tests across 9 nations. Explore the complete testing timeline and country profiles.',
    descriptionAr: '٢٠٥٦ اختباراً نووياً عبر ٩ دول. استكشف الجدول الزمني الكامل للاختبارات وملفات الدول.',
  },
  'your-risk': {
    titleEn: 'Your Risk — Nuclear Explained',
    titleAr: 'مخاطرك — النووي ببساطة',
    descriptionEn: 'How close are you to a nuclear target? Test your nuclear IQ with our interactive quiz.',
    descriptionAr: 'كم أنت قريب من هدف نووي؟ اختبر معلوماتك النووية مع اختبارنا التفاعلي.',
  },
  expert: {
    titleEn: 'Expert Deep Dive — Nuclear Explained',
    titleAr: 'الغوص المعمّق — النووي ببساطة',
    descriptionEn: 'The complete physics of nuclear weapons. Blast scaling, height of burst, fallout simulation, and the cube root law.',
    descriptionAr: 'الفيزياء الكاملة للأسلحة النووية. قياس الانفجار وارتفاع الانفجار ومحاكاة التساقط وقانون الجذر التكعيبي.',
  },
}
