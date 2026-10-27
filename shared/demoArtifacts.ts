import type {
  ArtifactDetail,
  ArtifactListItem,
  Language,
  Translation,
} from "./types";

interface DemoArtifact {
  slug: string;
  image_url: string;
  translations: Record<Language, Translation>;
}

export const demoArtifacts: DemoArtifact[] = [
  {
    slug: "uh-1-huey",
    image_url: "/images/artifacts/uh-1-huey.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Máy bay trực thăng UH-1 Huey",
        summary: "Trực thăng đa dụng gắn với nhiều hoạt động quân sự trong thế kỷ 20.",
        content:
          "UH-1, thường được gọi là Huey, là dòng trực thăng đa dụng do Hoa Kỳ phát triển. Trong chiến tranh Việt Nam, loại máy bay này được sử dụng cho nhiều nhiệm vụ như vận chuyển người và hàng hóa, tải thương và hỗ trợ trên không. Hiện vật gợi mở câu chuyện về vai trò của trực thăng trong chiến tranh hiện đại.",
      },
      en: {
        language_code: "en",
        title: "UH-1 Huey helicopter",
        summary: "A utility helicopter associated with many 20th-century military operations.",
        content:
          "The UH-1, commonly known as the Huey, is a utility helicopter developed in the United States. During the Vietnam War, it served in a range of roles, including transporting people and supplies, medical evacuation, and air support. This artifact introduces the role of helicopters in modern warfare.",
      },
      zh: {
        language_code: "zh",
        title: "UH-1“休伊”直升机",
        summary: "这款多用途直升机参与了二十世纪的多种军事行动。",
        content:
          "UH-1通常被称为“休伊”，是美国研制的一种多用途直升机。在越南战争期间，它承担了运输人员和物资、医疗后送以及空中支援等多种任务。这件展品展现了直升机在现代战争中的作用。",
      },
      ja: {
        language_code: "ja",
        title: "UH-1「ヒューイ」ヘリコプター",
        summary: "20世紀のさまざまな軍事活動に関わった多用途ヘリコプターです。",
        content:
          "UH-1は、一般に「ヒューイ」と呼ばれる米国開発の多用途ヘリコプターです。ベトナム戦争では、人員や物資の輸送、負傷者の後送、航空支援など幅広い任務に使われました。この展示品から、近代戦におけるヘリコプターの役割を知ることができます。",
      },
      ko: {
        language_code: "ko",
        title: "UH-1 휴이 헬리콥터",
        summary: "20세기의 여러 군사 작전에 사용된 다목적 헬리콥터입니다.",
        content:
          "UH-1은 흔히 ‘휴이’라고 불리는 미국 개발 다목적 헬리콥터입니다. 베트남 전쟁에서 인원과 물자 수송, 부상자 후송, 공중 지원 등 다양한 임무에 사용되었습니다. 이 전시품은 현대전에서 헬리콥터가 맡았던 역할을 보여 줍니다.",
      },
    },
  },
  {
    slug: "f-5a-fighter",
    image_url: "/images/artifacts/f-5a-fighter.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Máy bay chiến đấu F-5A",
        summary: "Máy bay phản lực hạng nhẹ được phát triển cho nhiệm vụ chiến đấu.",
        content:
          "F-5A là phiên bản đầu của dòng máy bay chiến đấu phản lực F-5 do Hoa Kỳ phát triển. Thiết kế nhỏ gọn và khả năng hoạt động ở tốc độ cao khiến dòng máy bay này được nhiều quốc gia sử dụng. Hiện vật giúp người xem tìm hiểu về sự phát triển của không quân trong thời kỳ máy bay phản lực.",
      },
      en: {
        language_code: "en",
        title: "F-5A fighter aircraft",
        summary: "A lightweight jet aircraft developed for combat missions.",
        content:
          "The F-5A is an early version of the F-5 jet fighter family developed in the United States. Its compact design and high-speed performance led to its use by many countries. This artifact offers a starting point for exploring the development of air forces in the jet age.",
      },
      zh: {
        language_code: "zh",
        title: "F-5A战斗机",
        summary: "为作战任务研制的轻型喷气式飞机。",
        content:
          "F-5A是美国研制的F-5喷气式战斗机系列的早期型号。其机身紧凑、速度较快，因此曾被多个国家使用。这件展品可以帮助观众了解喷气式飞机时代空军的发展。",
      },
      ja: {
        language_code: "ja",
        title: "F-5A戦闘機",
        summary: "戦闘任務向けに開発された軽量ジェット機です。",
        content:
          "F-5Aは、米国で開発されたF-5ジェット戦闘機シリーズの初期型です。小型で高速という特徴があり、多くの国で使用されました。この展示品を通して、ジェット機時代の空軍の発展をたどることができます。",
      },
      ko: {
        language_code: "ko",
        title: "F-5A 전투기",
        summary: "전투 임무를 위해 개발된 경량 제트 항공기입니다.",
        content:
          "F-5A는 미국에서 개발된 F-5 제트 전투기 계열의 초기형입니다. 작고 빠른 기체라는 특징으로 여러 나라에서 운용되었습니다. 이 전시품을 통해 제트기 시대 공군의 발전을 살펴볼 수 있습니다.",
      },
    },
  },
  {
    slug: "m48-patton",
    image_url: "/images/artifacts/m48-patton.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Xe tăng M48 Patton",
        summary: "Xe tăng chiến đấu chủ lực được sử dụng trong thời kỳ Chiến tranh Lạnh.",
        content:
          "M48 Patton là dòng xe tăng chiến đấu chủ lực do Hoa Kỳ phát triển sau Chiến tranh thế giới thứ hai. Xe được trang bị pháo lớn và giáp bảo vệ, đồng thời được nhiều lực lượng sử dụng trong thời kỳ Chiến tranh Lạnh. Hiện vật cho thấy quy mô và công nghệ của chiến tranh cơ giới.",
      },
      en: {
        language_code: "en",
        title: "M48 Patton tank",
        summary: "A main battle tank used during the Cold War era.",
        content:
          "The M48 Patton is a main battle tank developed in the United States after the Second World War. It combined a large-caliber gun with armored protection and was used by many forces during the Cold War. This artifact illustrates the scale and technology of mechanized warfare.",
      },
      zh: {
        language_code: "zh",
        title: "M48“巴顿”坦克",
        summary: "一款在冷战时期服役的主战坦克。",
        content:
          "M48“巴顿”是美国在第二次世界大战后研制的主战坦克。它配备大口径火炮和装甲防护，冷战时期曾被多支部队使用。这件展品展现了机械化战争的规模与技术。",
      },
      ja: {
        language_code: "ja",
        title: "M48パットン戦車",
        summary: "冷戦期に運用された主力戦車です。",
        content:
          "M48パットンは、第二次世界大戦後に米国で開発された主力戦車です。大口径砲と装甲を備え、冷戦期に多くの部隊で使用されました。この展示品から、機械化された戦争の規模と技術を知ることができます。",
      },
      ko: {
        language_code: "ko",
        title: "M48 패튼 전차",
        summary: "냉전 시기에 운용된 주력 전차입니다.",
        content:
          "M48 패튼은 제2차 세계대전 이후 미국에서 개발된 주력 전차입니다. 대구경 포와 장갑을 갖추었으며 냉전기에 여러 군대에서 운용되었습니다. 이 전시품은 기계화 전쟁의 규모와 기술을 보여 줍니다.",
      },
    },
  },
  {
    slug: "a-1-skyraider",
    image_url: "/images/artifacts/a-1-skyraider.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Máy bay cường kích A-1 Skyraider",
        summary: "Máy bay cánh quạt được thiết kế để hỗ trợ và tấn công mặt đất.",
        content:
          "A-1 Skyraider là máy bay cường kích một động cơ cánh quạt do Hoa Kỳ phát triển sau Chiến tranh thế giới thứ hai. Máy bay có thời gian hoạt động dài và khả năng mang nhiều loại vũ khí. Hiện vật gợi nhắc giai đoạn chuyển tiếp, khi máy bay cánh quạt vẫn đảm nhiệm vai trò trong các lực lượng không quân.",
      },
      en: {
        language_code: "en",
        title: "A-1 Skyraider attack aircraft",
        summary: "A propeller-driven aircraft designed for close support and ground attack.",
        content:
          "The A-1 Skyraider is a single-engine, propeller-driven attack aircraft developed in the United States after the Second World War. It was known for long operating time and the ability to carry a variety of weapons. This artifact recalls a period when propeller aircraft still played a role in air forces.",
      },
      zh: {
        language_code: "zh",
        title: "A-1“天袭者”攻击机",
        summary: "一款为近距支援和对地攻击设计的螺旋桨飞机。",
        content:
          "A-1“天袭者”是美国在第二次世界大战后研制的单发螺旋桨攻击机。它具有较长的留空时间，并能携带多种武器。这件展品让人回想起螺旋桨飞机仍在空军中发挥作用的时期。",
      },
      ja: {
        language_code: "ja",
        title: "A-1スカイレイダー攻撃機",
        summary: "近接航空支援と対地攻撃のために設計されたプロペラ機です。",
        content:
          "A-1スカイレイダーは、第二次世界大戦後に米国で開発された単発のプロペラ攻撃機です。長時間の飛行が可能で、さまざまな兵器を搭載できました。この展示品は、プロペラ機が空軍で役割を担っていた時代を伝えます。",
      },
      ko: {
        language_code: "ko",
        title: "A-1 스카이레이더 공격기",
        summary: "근접 항공 지원과 지상 공격을 위해 설계된 프로펠러 항공기입니다.",
        content:
          "A-1 스카이레이더는 제2차 세계대전 이후 미국에서 개발된 단발 프로펠러 공격기입니다. 긴 체공 시간과 다양한 무장을 탑재할 수 있는 능력으로 알려졌습니다. 이 전시품은 프로펠러 항공기가 공군에서 역할을 맡았던 시기를 보여 줍니다.",
      },
    },
  },
  {
    slug: "guillotine",
    image_url: "/images/artifacts/guillotine.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Máy chém thời Pháp thuộc và chính quyền Ngô Đình Diệm",
        summary: "Hiện vật gợi nhắc lịch sử trừng phạt và đàn áp trong các giai đoạn khác nhau.",
        content:
          "Máy chém là một hiện vật gắn với lịch sử nhà tù và các hình thức trừng phạt trong thời kỳ thuộc địa cũng như dưới chính quyền Ngô Đình Diệm. Sự hiện diện của hiện vật đặt ra những câu hỏi về quyền con người, bạo lực và ký ức lịch sử. Nội dung trưng bày nên được đối chiếu với tư liệu của bảo tàng.",
      },
      en: {
        language_code: "en",
        title: "Guillotine from the French colonial period and the Ngô Đình Diệm government",
        summary: "An artifact recalling punishment and repression in different historical periods.",
        content:
          "The guillotine is associated with the history of prisons and punishment during the French colonial period and under the Ngô Đình Diệm government. Its presence raises questions about human rights, violence, and historical memory. The museum’s own records should be consulted for the specific history of this exhibit.",
      },
      zh: {
        language_code: "zh",
        title: "法国殖民时期及吴廷琰政权时期的断头台",
        summary: "这件展品让人回想不同时期的惩罚与压迫历史。",
        content:
          "这座断头台与法国殖民时期及吴廷琰政权时期的监狱和惩罚历史有关。它引发了人们对人权、暴力和历史记忆的思考。关于这件展品的具体历史，应以博物馆档案为准。",
      },
      ja: {
        language_code: "ja",
        title: "フランス植民地期およびゴ・ディン・ジエム政権期のギロチン",
        summary: "異なる時代の処罰と抑圧の歴史を想起させる展示品です。",
        content:
          "このギロチンは、フランス植民地期およびゴ・ディン・ジエム政権期の刑務所や処罰の歴史と関わる展示品です。人権、暴力、歴史の記憶について考えるきっかけとなります。展示品の具体的な来歴は、博物館の資料で確認してください。",
      },
      ko: {
        language_code: "ko",
        title: "프랑스 식민지기와 응오딘지엠 정부 시기의 단두대",
        summary: "서로 다른 역사적 시기의 처벌과 억압을 떠올리게 하는 전시품입니다.",
        content:
          "이 단두대는 프랑스 식민지기와 응오딘지엠 정부 시기의 감옥 및 처벌 역사와 관련된 전시품입니다. 인권, 폭력, 역사적 기억에 대해 생각하게 합니다. 전시품의 구체적인 내력은 박물관 자료를 통해 확인해야 합니다.",
      },
    },
  },
  {
    slug: "con-dao-tiger-cage",
    image_url: "/images/artifacts/con-dao-tiger-cage.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Mô hình chuồng cọp Côn Đảo",
        summary: "Mô hình tái hiện một hình thức giam giữ tù nhân tại nhà tù Côn Đảo.",
        content:
          "Chuồng cọp là tên gọi phổ biến của khu biệt giam tại nhà tù Côn Đảo, nơi tù nhân bị giam trong những không gian chật hẹp và điều kiện khắc nghiệt. Mô hình giúp người xem hình dung một phần lịch sử nhà tù và những trải nghiệm của người bị giam giữ. Các chi tiết cụ thể nên được đối chiếu với thuyết minh chính thức của bảo tàng.",
      },
      en: {
        language_code: "en",
        title: "Con Dao tiger cage model",
        summary: "A model depicting a form of imprisonment at Con Dao Prison.",
        content:
          "“Tiger cages” is a widely used name for an isolation area at Con Dao Prison, where prisoners were held in cramped and harsh conditions. The model helps visitors picture part of the prison’s history and the experiences of those detained there. Specific details should be checked against the museum’s official interpretation.",
      },
      zh: {
        language_code: "zh",
        title: "昆岛“虎笼”监狱模型",
        summary: "这座模型展示了昆岛监狱的一种囚禁方式。",
        content:
          "“虎笼”是昆岛监狱一处隔离监禁区域的常用名称，囚犯曾被关押在狭小且条件严酷的空间中。这座模型帮助观众了解监狱历史的一部分，以及被囚禁者的经历。具体细节应以博物馆的正式说明为准。",
      },
      ja: {
        language_code: "ja",
        title: "コンダオ刑務所の「虎の檻」模型",
        summary: "コンダオ刑務所で行われた拘禁の一形態を再現した模型です。",
        content:
          "「虎の檻」は、コンダオ刑務所の隔離区域を指す一般的な呼び名です。囚人は狭く過酷な環境に収容されていました。この模型は、刑務所の歴史の一端と、収容された人々の経験を伝えます。具体的な説明は博物館の公式資料で確認してください。",
      },
      ko: {
        language_code: "ko",
        title: "꼰다오 ‘호랑이 우리’ 감옥 모형",
        summary: "꼰다오 감옥의 한 수감 형태를 재현한 모형입니다.",
        content:
          "‘호랑이 우리’는 꼰다오 감옥의 독방 구역을 가리키는 널리 쓰이는 이름입니다. 수감자들은 좁고 열악한 공간에 갇혀 있었습니다. 이 모형은 감옥 역사의 일부와 수감자들의 경험을 이해하는 데 도움을 줍니다. 구체적인 내용은 박물관의 공식 자료로 확인해야 합니다.",
      },
    },
  },
  {
    slug: "blu-82-bomb",
    image_url: "/images/artifacts/blu-82-bomb.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Bom BLU-82 (bom 7 tấn)",
        summary: "Loại bom cỡ lớn thường được gọi theo khối lượng xấp xỉ 7 tấn.",
        content:
          "BLU-82 là loại bom hàng không cỡ lớn của Hoa Kỳ, có khối lượng khoảng 6,8 tấn và thường được gọi là bom 7 tấn. Loại bom này được thiết kế để tạo khoảng trống trên mặt đất bằng sức nổ lớn. Hiện vật nhắc người xem về sức tàn phá của vũ khí và hậu quả lâu dài của chiến tranh.",
      },
      en: {
        language_code: "en",
        title: "BLU-82 bomb (the 7-ton bomb)",
        summary: "A large bomb commonly described by its approximate weight of seven tons.",
        content:
          "The BLU-82 is a large United States aerial bomb weighing about 6.8 metric tonnes, often referred to as the “7-ton bomb.” It was designed to clear areas on the ground through a large blast. The artifact prompts reflection on the destructive power of weapons and the lasting consequences of war.",
      },
      zh: {
        language_code: "zh",
        title: "BLU-82炸弹（“七吨炸弹”）",
        summary: "一种大型炸弹，常以约七吨的重量称呼。",
        content:
          "BLU-82是美国研制的大型航空炸弹，重量约为6.8公吨，因此常被称为“七吨炸弹”。它旨在利用强大爆炸清理地面区域。这件展品提醒人们思考武器的破坏力以及战争带来的长期影响。",
      },
      ja: {
        language_code: "ja",
        title: "BLU-82爆弾（「7トン爆弾」）",
        summary: "およそ7トンの重量で知られる大型爆弾です。",
        content:
          "BLU-82は米国の大型航空爆弾で、重量は約6.8トンあり、「7トン爆弾」とも呼ばれます。大きな爆発によって地上に空間を作る目的で設計されました。この展示品は、兵器の破壊力と戦争が残す長期的な影響を考えるきっかけとなります。",
      },
      ko: {
        language_code: "ko",
        title: "BLU-82 폭탄(‘7톤 폭탄’)",
        summary: "약 7톤의 무게로 알려진 대형 폭탄입니다.",
        content:
          "BLU-82는 미국의 대형 항공 폭탄으로 무게가 약 6.8톤이며, 흔히 ‘7톤 폭탄’이라고 불립니다. 큰 폭발로 지상의 공간을 확보하도록 설계되었습니다. 이 전시품은 무기의 파괴력과 전쟁이 남기는 장기적인 영향을 생각하게 합니다.",
      },
    },
  },
  {
    slug: "155mm-artillery",
    image_url: "/images/artifacts/artillery-155mm.png",
    translations: {
      vi: {
        language_code: "vi",
        title: "Pháo 155 mm",
        summary: "Khẩu pháo cỡ nòng 155 mm, một loại pháo thường thấy trong pháo binh hiện đại.",
        content:
          "Pháo 155 mm là một loại pháo dã chiến cỡ nòng lớn được sử dụng rộng rãi trong thế kỷ 20 và đến nay. Tùy từng mẫu, pháo có thể được kéo hoặc lắp trên phương tiện cơ giới. Hiện vật giúp người xem tìm hiểu về pháo binh và vai trò của hỏa lực trong chiến tranh.",
      },
      en: {
        language_code: "en",
        title: "155 mm artillery gun",
        summary: "A 155 mm field gun, a common type of modern artillery.",
        content:
          "A 155 mm gun is a large-caliber field artillery piece widely used during the 20th century and beyond. Depending on the model, it may be towed or mounted on a vehicle. This artifact introduces field artillery and the role of firepower in warfare.",
      },
      zh: {
        language_code: "zh",
        title: "155毫米火炮",
        summary: "一种口径为155毫米的野战炮，是现代炮兵常见装备。",
        content:
          "155毫米火炮是一种大口径野战火炮，在20世纪及之后被广泛使用。根据型号不同，它可以由车辆牵引，也可以安装在机动平台上。这件展品介绍了野战炮兵及火力在战争中的作用。",
      },
      ja: {
        language_code: "ja",
        title: "155 mm砲",
        summary: "現代の砲兵で広く用いられる口径155 mmの野戦砲です。",
        content:
          "155 mm砲は、20世紀以降広く使用されている大口径の野戦砲です。型式によって、牽引式や車両搭載式があります。この展示品から、野戦砲兵と戦争における火力の役割を知ることができます。",
      },
      ko: {
        language_code: "ko",
        title: "155mm 야포",
        summary: "현대 포병에서 널리 쓰이는 155mm 구경의 야포입니다.",
        content:
          "155mm 포는 20세기 이후 널리 사용된 대구경 야포입니다. 모델에 따라 차량에 견인되거나 차량에 장착될 수 있습니다. 이 전시품은 야전 포병과 전쟁에서 화력이 맡는 역할을 소개합니다.",
      },
    },
  },
];

export function getDemoArtifacts(
  language: Language,
  query = "",
): ArtifactListItem[] {
  const normalizedQuery = query.trim().toLocaleLowerCase(language);

  return demoArtifacts.flatMap((artifact) => {
    const translation = artifact.translations[language];
    if (!translation) {
      return [];
    }

    if (
      normalizedQuery &&
      !translation.title.toLocaleLowerCase(language).includes(normalizedQuery)
    ) {
      return [];
    }

    return [{
      slug: artifact.slug,
      image_url: artifact.image_url,
      title: translation.title,
      summary: translation.summary,
    }];
  });
}

export function getDemoArtifact(
  slug: string,
  language: Language,
): ArtifactDetail | null {
  const artifact = demoArtifacts.find((item) => item.slug === slug);
  if (!artifact) {
    return null;
  }

  return {
    slug: artifact.slug,
    image_url: artifact.image_url,
    translation: artifact.translations[language] ?? null,
    available_languages: Object.keys(artifact.translations) as Language[],
  };
}
