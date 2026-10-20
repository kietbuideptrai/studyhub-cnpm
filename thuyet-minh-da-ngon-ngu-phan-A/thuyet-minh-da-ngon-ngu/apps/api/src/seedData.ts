import type { Db } from "./db.js";

type Tr = { title: string; summary: string; narration: string };

export const languages = [
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", ttsLocale: "vi-VN", sortOrder: 1 },
  { code: "en", name: "English", nativeName: "English", ttsLocale: "en-US", sortOrder: 2 },
  { code: "ja", name: "Japanese", nativeName: "日本語", ttsLocale: "ja-JP", sortOrder: 3 },
  { code: "ko", name: "Korean", nativeName: "한국어", ttsLocale: "ko-KR", sortOrder: 4 },
];

// Noi dung dich san mot lan (khong goi API dich luc chay). Ma QR: TM-001 ... TM-006
export const spots: {
  slug: string;
  qrCode: string;
  latitude: number;
  longitude: number;
  tr: Record<"vi" | "en" | "ja" | "ko", Tr>;
}[] = [
  {
    slug: "dinh-doc-lap",
    qrCode: "TM-001",
    latitude: 10.777,
    longitude: 106.6955,
    tr: {
      vi: {
        title: "Dinh Độc Lập",
        summary: "Công trình kiến trúc gắn liền với sự kiện thống nhất đất nước năm 1975.",
        narration:
          "Dinh Độc Lập do kiến trúc sư Ngô Viết Thụ thiết kế và hoàn thành năm 1966. Sáng ngày 30 tháng 4 năm 1975, xe tăng tiến vào dinh, đánh dấu thời khắc kết thúc chiến tranh và thống nhất đất nước. Ngày nay, nơi đây là di tích quốc gia đặc biệt, mở cửa cho du khách tham quan phòng họp, phòng làm việc và hầm chỉ huy.",
      },
      en: {
        title: "Independence Palace",
        summary: "An architectural landmark tied to the reunification of Vietnam in 1975.",
        narration:
          "Independence Palace was designed by architect Ngo Viet Thu and completed in 1966. On the morning of April 30, 1975, tanks entered the grounds, marking the end of the war and the reunification of the country. Today it is a special national monument where visitors can see the meeting rooms, offices and the command bunker.",
      },
      ja: {
        title: "独立宮殿",
        summary: "1975年の南北統一を象徴する歴史的建築です。",
        narration:
          "独立宮殿は建築家ゴ・ヴィエット・トゥが設計し、1966年に完成しました。1975年4月30日の朝、戦車が敷地内に進入し、戦争の終結と国の統一を告げました。現在は特別国家遺跡として、会議室や執務室、地下の司令部などを見学できます。",
      },
      ko: {
        title: "독립궁",
        summary: "1975년 통일을 상징하는 역사적 건축물입니다.",
        narration:
          "독립궁은 건축가 응오비엣투가 설계하여 1966년에 완공되었습니다. 1975년 4월 30일 아침 탱크가 궁 안으로 진입하면서 전쟁이 끝나고 나라가 통일되었습니다. 오늘날에는 특별 국가 유적으로 지정되어 회의실, 집무실, 지하 지휘 벙커를 관람할 수 있습니다.",
      },
    },
  },
  {
    slug: "nha-tho-duc-ba",
    qrCode: "TM-002",
    latitude: 10.7798,
    longitude: 106.699,
    tr: {
      vi: {
        title: "Nhà thờ Đức Bà Sài Gòn",
        summary: "Nhà thờ gạch đỏ với hai tháp chuông nổi tiếng giữa trung tâm thành phố.",
        narration:
          "Nhà thờ Đức Bà được xây dựng từ năm 1863 đến năm 1880 theo phong cách Roman kết hợp Gothic. Toàn bộ gạch đỏ bên ngoài được nhập từ Marseille, Pháp. Hai tháp chuông cao khoảng 58 mét, là một trong những biểu tượng quen thuộc nhất của thành phố.",
      },
      en: {
        title: "Saigon Notre-Dame Cathedral",
        summary: "A red-brick cathedral with two famous bell towers in the heart of the city.",
        narration:
          "The cathedral was built between 1863 and 1880 in a Romanesque style with Gothic touches. Its red bricks were imported from Marseille in France. The two bell towers rise about 58 meters and are among the best-known symbols of the city.",
      },
      ja: {
        title: "サイゴン大教会",
        summary: "市の中心にそびえる、赤レンガと二つの鐘楼で知られる教会です。",
        narration:
          "この教会は1863年から1880年にかけて、ロマネスク様式にゴシックの要素を加えて建てられました。外壁の赤レンガはフランスのマルセイユから運ばれたものです。高さ約58メートルの二つの鐘楼は、市を代表するシンボルの一つです。",
      },
      ko: {
        title: "사이공 노트르담 대성당",
        summary: "도심에 자리한 붉은 벽돌 성당으로 두 개의 종탑으로 유명합니다.",
        narration:
          "이 성당은 1863년부터 1880년까지 로마네스크 양식에 고딕 요소를 더해 지어졌습니다. 외벽의 붉은 벽돌은 프랑스 마르세유에서 들여왔습니다. 높이 약 58미터의 두 종탑은 도시를 대표하는 상징 중 하나입니다.",
      },
    },
  },
  {
    slug: "buu-dien-thanh-pho",
    qrCode: "TM-003",
    latitude: 10.7799,
    longitude: 106.6999,
    tr: {
      vi: {
        title: "Bưu điện Trung tâm Sài Gòn",
        summary: "Bưu điện mang kiến trúc Pháp cổ điển, vẫn đang hoạt động đến ngày nay.",
        narration:
          "Bưu điện Trung tâm Sài Gòn được xây dựng từ năm 1886 đến năm 1891, mang phong cách kiến trúc Pháp với mái vòm cao và những ô cửa sổ lớn. Bên trong vẫn còn những tấm bản đồ cổ vẽ tay. Đây vừa là nơi gửi thư, vừa là điểm tham quan quen thuộc của du khách.",
      },
      en: {
        title: "Saigon Central Post Office",
        summary: "A classic French-style building that still operates as a working post office.",
        narration:
          "The Saigon Central Post Office was built between 1886 and 1891 in French architectural style, with a high vaulted hall and large arched windows. Inside you can still see old hand-drawn maps. It is both a working post office and a popular stop for visitors.",
      },
      ja: {
        title: "サイゴン中央郵便局",
        summary: "フランス様式の古典的な建物で、今も郵便局として営業しています。",
        narration:
          "サイゴン中央郵便局は1886年から1891年にかけて、フランス様式で建てられました。高いアーチ型の天井と大きなアーチ窓が特徴です。館内には古い手描きの地図が今も残っています。現在も郵便局として使われており、観光客にも人気のスポットです。",
      },
      ko: {
        title: "사이공 중앙우체국",
        summary: "프랑스풍 고전 건축물로 지금도 우체국으로 운영되고 있습니다.",
        narration:
          "사이공 중앙우체국은 1886년부터 1891년까지 프랑스 양식으로 지어졌으며, 높은 아치형 천장과 큰 아치 창이 특징입니다. 내부에는 옛 손그림 지도가 아직 남아 있습니다. 지금도 우체국으로 사용되고 있으며 관광객에게도 인기 있는 명소입니다.",
      },
    },
  },
  {
    slug: "cho-ben-thanh",
    qrCode: "TM-004",
    latitude: 10.7725,
    longitude: 106.698,
    tr: {
      vi: {
        title: "Chợ Bến Thành",
        summary: "Khu chợ biểu tượng của Sài Gòn với tháp đồng hồ ở cổng chính.",
        narration:
          "Chợ Bến Thành khánh thành năm 1914, nằm ở trung tâm thành phố. Tháp đồng hồ phía trên cổng nam đã trở thành hình ảnh quen thuộc của Sài Gòn. Trong chợ có đồ lưu niệm, vải vóc, cà phê và ẩm thực địa phương; buổi tối, các con đường xung quanh còn có chợ đêm.",
      },
      en: {
        title: "Ben Thanh Market",
        summary: "An iconic Saigon market with a clock tower over its main gate.",
        narration:
          "Ben Thanh Market was inaugurated in 1914 and stands in the center of the city. The clock tower above its south gate has become a familiar image of Saigon. Inside you can find souvenirs, fabrics, coffee and local food, and a night market opens in the surrounding streets in the evening.",
      },
      ja: {
        title: "ベンタイン市場",
        summary: "正門の時計塔で知られる、サイゴンを代表する市場です。",
        narration:
          "ベンタイン市場は1914年に開場し、市の中心部にあります。南門の上にある時計塔は、サイゴンを象徴する風景として親しまれています。館内ではお土産、布地、コーヒー、地元料理などが売られており、夕方には周辺の通りにナイトマーケットも開かれます。",
      },
      ko: {
        title: "벤탄 시장",
        summary: "정문의 시계탑으로 유명한 사이공의 대표적인 시장입니다.",
        narration:
          "벤탄 시장은 1914년에 개장했으며 시내 중심에 있습니다. 남문 위의 시계탑은 사이공을 상징하는 친숙한 풍경이 되었습니다. 시장 안에서는 기념품, 직물, 커피, 현지 음식을 살 수 있고 저녁에는 주변 거리에 야시장도 열립니다.",
      },
    },
  },
  {
    slug: "bao-tang-chung-tich-chien-tranh",
    qrCode: "TM-005",
    latitude: 10.7794,
    longitude: 106.6922,
    tr: {
      vi: {
        title: "Bảo tàng Chứng tích Chiến tranh",
        summary: "Nơi lưu giữ hiện vật và hình ảnh về chiến tranh Việt Nam.",
        narration:
          "Bảo tàng Chứng tích Chiến tranh được thành lập năm 1975, trưng bày hiện vật, tư liệu và hình ảnh về cuộc chiến tranh ở Việt Nam và hậu quả của nó. Một số khu trưng bày có hình ảnh gây xúc động mạnh, vì vậy du khách nên cân nhắc khi đưa trẻ nhỏ đi cùng. Đây là nơi giúp người xem hiểu hơn về giá trị của hòa bình.",
      },
      en: {
        title: "War Remnants Museum",
        summary: "A museum of artifacts and photographs about the Vietnam War.",
        narration:
          "The War Remnants Museum was founded in 1975. It displays artifacts, documents and photographs about the war in Vietnam and its consequences. Some exhibits contain powerful images, so visitors may want to think twice before bringing young children. The museum helps visitors reflect on the value of peace.",
      },
      ja: {
        title: "戦争証跡博物館",
        summary: "ベトナム戦争に関する資料や写真を展示する博物館です。",
        narration:
          "戦争証跡博物館は1975年に設立され、ベトナムでの戦争とその影響に関する資料や写真を展示しています。衝撃の強い写真も多いため、小さなお子様連れの場合はご注意ください。平和の大切さを考えるきっかけとなる場所です。",
      },
      ko: {
        title: "전쟁 증적 박물관",
        summary: "베트남 전쟁에 관한 유물과 사진을 전시하는 박물관입니다.",
        narration:
          "전쟁 증적 박물관은 1975년에 설립되었으며 베트남 전쟁과 그 영향에 관한 유물, 자료, 사진을 전시합니다. 충격적인 사진이 많아 어린이와 함께 방문할 때는 주의가 필요합니다. 평화의 가치를 되새기게 하는 공간입니다.",
      },
    },
  },
  {
    slug: "dia-dao-cu-chi",
    qrCode: "TM-006",
    latitude: 11.143,
    longitude: 106.462,
    tr: {
      vi: {
        title: "Địa đạo Củ Chi",
        summary: "Hệ thống đường hầm dưới lòng đất nổi tiếng thời kháng chiến.",
        narration:
          "Địa đạo Củ Chi cách trung tâm thành phố khoảng 70 km. Mạng lưới đường hầm này dài khoảng 200 km, gồm nhiều tầng với nơi ở, bếp, bệnh xá và hầm chỉ huy. Du khách có thể thử chui vào một đoạn hầm đã được mở rộng và tìm hiểu cách người dân sinh sống, chiến đấu dưới lòng đất.",
      },
      en: {
        title: "Cu Chi Tunnels",
        summary: "A famous underground tunnel network from the wartime era.",
        narration:
          "The Cu Chi Tunnels lie about 70 kilometers from the city center. The network is roughly 200 kilometers long and has several levels with living quarters, kitchens, clinics and command rooms. Visitors can try crawling through a widened section and learn how people lived and fought underground.",
      },
      ja: {
        title: "クチトンネル",
        summary: "戦時中に造られた、有名な地下トンネル網です。",
        narration:
          "クチトンネルは市の中心部から約70キロの場所にあります。トンネル網は全長約200キロに及び、居住スペースや台所、診療所、司令部などを備えた複数の階層で構成されています。広げられた一部の区間に入ってみて、人々が地下でどのように暮らし、戦ったのかを知ることができます。",
      },
      ko: {
        title: "구찌 터널",
        summary: "전쟁 시기에 만들어진 유명한 지하 터널망입니다.",
        narration:
          "구찌 터널은 시내 중심에서 약 70킬로미터 떨어져 있습니다. 터널망은 길이가 약 200킬로미터에 이르며, 생활 공간, 부엌, 병원, 지휘실 등을 갖춘 여러 층으로 이루어져 있습니다. 넓혀 놓은 구간에 직접 들어가 보며 사람들이 땅속에서 어떻게 생활하고 싸웠는지 알아볼 수 있습니다.",
      },
    },
  },
];

/** Idempotent: chay nhieu lan (moi lan deploy) khong tao ban ghi trung. */
export async function seedDatabase(prisma: Db): Promise<{ languages: number; spots: number }> {
  for (const l of languages) {
    await prisma.language.upsert({ where: { code: l.code }, update: l, create: l });
  }
  for (const s of spots) {
    const spot = await prisma.spot.upsert({
      where: { slug: s.slug },
      update: { qrCode: s.qrCode, latitude: s.latitude, longitude: s.longitude },
      create: { slug: s.slug, qrCode: s.qrCode, latitude: s.latitude, longitude: s.longitude },
    });
    for (const [code, tr] of Object.entries(s.tr)) {
      await prisma.spotTranslation.upsert({
        where: { spotId_languageCode: { spotId: spot.id, languageCode: code } },
        update: tr,
        create: { spotId: spot.id, languageCode: code, ...tr },
      });
    }
  }
  return { languages: languages.length, spots: spots.length };
}
