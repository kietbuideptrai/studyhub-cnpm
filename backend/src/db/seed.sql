BEGIN;

INSERT INTO artifacts (id, slug, name, image_url, category, is_published)
VALUES
  (
    '00000000-0000-4000-8000-000000000001',
    'tank-843',
    'Xe tăng 843',
    'https://example.com/images/tank-843.jpg',
    'Phương tiện quân sự',
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'tank-390',
    'Xe tăng 390',
    'https://example.com/images/tank-390.jpg',
    'Phương tiện quân sự',
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'ho-chi-minh-campaign-map',
    'Bản đồ Chiến dịch Hồ Chí Minh',
    'https://example.com/images/ho-chi-minh-campaign-map.jpg',
    'Tài liệu lịch sử',
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'victory-flag',
    'Lá cờ ngày thống nhất',
    'https://example.com/images/victory-flag.jpg',
    'Hiện vật lịch sử',
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    'pilots-helmet',
    'Mũ phi công',
    'https://example.com/images/pilots-helmet.jpg',
    'Đồ dùng cá nhân',
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

INSERT INTO artifact_translations
  (artifact_id, language_code, title, summary, content)
VALUES
  (
    '00000000-0000-4000-8000-000000000001',
    'vi',
    'Xe tăng 843',
    'Chiếc xe tăng gắn với thời khắc lịch sử ngày 30 tháng 4 năm 1975.',
    'Xe tăng 843 thuộc Lữ đoàn xe tăng 203, Quân đoàn 2. Ngày 30 tháng 4 năm 1975, xe tiến vào Dinh Độc Lập trong chiến dịch giải phóng Sài Gòn. Hiện vật nhắc nhớ dấu mốc kết thúc chiến tranh và thống nhất đất nước.'
  ),
  (
    '00000000-0000-4000-8000-000000000001',
    'en',
    'Tank 843',
    'The tank associated with the historic events of April 30, 1975.',
    'Tank 843 served with the 203rd Tank Brigade of the 2nd Corps. On April 30, 1975, it entered the Independence Palace during the campaign to liberate Saigon. The vehicle recalls the end of the war and the reunification of Vietnam.'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'vi',
    'Xe tăng 390',
    'Một hiện vật tiêu biểu gắn với sự kiện tại Dinh Độc Lập năm 1975.',
    'Xe tăng 390 thuộc Lữ đoàn xe tăng 203, Quân đoàn 2. Ngày 30 tháng 4 năm 1975, xe tiến vào Dinh Độc Lập cùng các đơn vị tham gia chiến dịch. Câu chuyện về chiếc xe gắn với thời khắc kết thúc chiến tranh và thống nhất đất nước.'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'en',
    'Tank 390',
    'An artifact associated with the events at the Independence Palace in 1975.',
    'Tank 390 served with the 203rd Tank Brigade of the 2nd Corps. On April 30, 1975, it entered the Independence Palace with units taking part in the campaign. Its story is connected with the end of the war and the reunification of Vietnam.'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'vi',
    'Bản đồ Chiến dịch Hồ Chí Minh',
    'Bản đồ thể hiện các hướng tiến công trong chiến dịch mùa xuân năm 1975.',
    'Chiến dịch Hồ Chí Minh diễn ra từ ngày 26 đến ngày 30 tháng 4 năm 1975. Các cánh quân tiến vào Sài Gòn từ nhiều hướng theo kế hoạch tác chiến. Bản đồ giúp người xem hình dung quy mô và cách tổ chức của chiến dịch.'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'en',
    'Ho Chi Minh Campaign Map',
    'A map showing the directions of advance during the spring 1975 campaign.',
    'The Ho Chi Minh Campaign took place from April 26 to April 30, 1975. Forces advanced toward Saigon from several directions under an operational plan. The map helps visitors understand the scale and organization of the campaign.'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'vi',
    'Lá cờ ngày thống nhất',
    'Lá cờ gợi nhắc những hình ảnh tại Sài Gòn trong ngày 30 tháng 4 năm 1975.',
    'Ngày 30 tháng 4 năm 1975 đánh dấu sự kết thúc của chiến tranh tại Việt Nam. Hình ảnh lá cờ xuất hiện tại Dinh Độc Lập đã trở thành biểu tượng của thời khắc thống nhất. Hiện vật giúp kể lại ý nghĩa của ngày lịch sử này qua một dấu ấn dễ nhận biết.'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'en',
    'Reunification Day Flag',
    'A flag recalling scenes in Saigon on April 30, 1975.',
    'April 30, 1975 marked the end of the war in Vietnam. The image of a flag at the Independence Palace became a symbol of the moment of reunification. This artifact introduces the significance of that historic day through a recognizable emblem.'
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    'vi',
    'Mũ phi công',
    'Vật dụng cá nhân gắn với công việc và sinh hoạt của người phi công.',
    'Chiếc mũ bảo vệ đầu và hỗ trợ liên lạc trong khi bay. Thiết kế của mũ cho thấy những trang bị cần thiết trong môi trường buồng lái. Hiện vật gợi mở câu chuyện về con người phía sau những nhiệm vụ trên không.'
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    'en',
    'Pilot Helmet',
    'A personal item associated with a pilot’s work and daily life.',
    'The helmet protected the pilot’s head and supported communication during flight. Its design reflects equipment needed in the cockpit environment. The artifact offers a glimpse into the people behind aerial missions.'
  )
ON CONFLICT (artifact_id, language_code) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  updated_at = NOW();

COMMIT;
