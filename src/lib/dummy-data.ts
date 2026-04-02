import { Category, QuestionPackage, Question, User, ExamResult, BankQuestion } from './types';

export const dummyUsers: User[] = [
  { id: 'admin-1', name: 'Admin CBT', email: 'admin@cbt.com', password: 'admin123', role: 'admin' },
  { id: 'user-1', name: 'Budi Santoso', email: 'budi@email.com', password: 'user123', role: 'user' },
  { id: 'user-2', name: 'Sari Dewi', email: 'sari@email.com', password: 'user123', role: 'user' },
];

export const dummyCategories: Category[] = [
  { id: 'cat-jlpt', name: 'JLPT', description: 'Japanese Language Proficiency Test — Ujian kemampuan bahasa Jepang standar internasional', icon: '🎌', parentId: null },
  { id: 'cat-jft', name: 'JFT', description: 'Japan Foundation Test — Tes dasar bahasa Jepang dari Japan Foundation', icon: '📝', parentId: null },
  { id: 'cat-ssw', name: 'SSW', description: 'Specified Skilled Worker — Ujian untuk pekerja terampil ke Jepang', icon: '🏗️', parentId: null },
  { id: 'cat-ssw-care', name: 'Perawatan Lansia', description: 'Ujian SSW bidang perawatan lansia (Kaigo)', icon: '🏥', parentId: 'cat-ssw' },
  { id: 'cat-ssw-food', name: 'Pengolahan Makanan', description: 'Ujian SSW bidang pengolahan makanan', icon: '🍱', parentId: 'cat-ssw' },
  { id: 'cat-ssw-agri', name: 'Pertanian', description: 'Ujian SSW bidang pertanian', icon: '🌾', parentId: 'cat-ssw' },
];

export const dummyPackages: QuestionPackage[] = [
  { id: 'pkg-1', name: 'JLPT N5 Latihan 1', description: 'Paket latihan dasar JLPT N5', categoryId: 'cat-jlpt', duration: 30, targetQuestions: 10, periodLabel: 'Januari - Februari 2026', isPublished: true, createdAt: '2026-01-01' },
  { id: 'pkg-2', name: 'JLPT N5 Latihan 2', description: 'Paket latihan JLPT N5 lanjutan', categoryId: 'cat-jlpt', duration: 30, targetQuestions: 10, isPublished: true, createdAt: '2026-02-01' },
  { id: 'pkg-3', name: 'JFT Basic A2', description: 'Paket soal JFT level A2', categoryId: 'cat-jft', duration: 25, periodLabel: 'JFT April 2026', isPublished: true, createdAt: '2026-01-15' },
  { id: 'pkg-4', name: 'SSW Kaigo Paket 1', description: 'Latihan soal SSW Perawatan Lansia', categoryId: 'cat-ssw-care', duration: 30, isPublished: true, createdAt: '2026-01-10' },
  { id: 'pkg-5', name: 'SSW Makanan Paket 1', description: 'Latihan soal SSW Pengolahan Makanan', categoryId: 'cat-ssw-food', duration: 30, isPublished: true, createdAt: '2026-01-10' },
  { id: 'pkg-6', name: 'SSW Pertanian Paket 1', description: 'Latihan soal SSW Pertanian', categoryId: 'cat-ssw-agri', duration: 30, isPublished: true, createdAt: '2026-02-01' },
  { id: 'pkg-7', name: 'JFT Draft Test', description: 'Paket draft belum dipublish', categoryId: 'cat-jft', duration: 20, isPublished: false, createdAt: '2026-03-01' },
];

export const dummyQuestions: Question[] = [
  // JLPT Pkg 1
  { id: 'q-jlpt-1', packageId: 'pkg-1', text: '「食べる」の丁寧形は何ですか？', options: ['食べます', '食べった', '食べるます', '食べです'], correctAnswer: 0, explanation: '「食べる」は一段動詞なので、「る」を取って「ます」をつけます。' },
  { id: 'q-jlpt-2', packageId: 'pkg-1', text: '「きょう」の漢字はどれですか？', options: ['今日', '昨日', '明日', '毎日'], correctAnswer: 0 },
  { id: 'q-jlpt-3', packageId: 'pkg-1', text: '「____に本を読みます。」正しい助詞はどれですか？', options: ['が', 'を', 'で', 'に'], correctAnswer: 2 },
  { id: 'q-jlpt-4', packageId: 'pkg-1', text: '「大きい」の反対語は？', options: ['小さい', '少ない', '短い', '低い'], correctAnswer: 0 },
  { id: 'q-jlpt-5', packageId: 'pkg-1', text: '「私は学生____。」空欄に入るのはどれですか？', options: ['だ', 'です', 'ます', 'する'], correctAnswer: 1 },
  // JLPT Pkg 2
  { id: 'q-jlpt-6', packageId: 'pkg-2', text: '「行く」のて形は何ですか？', options: ['行って', '行いて', '行きて', '行ぐて'], correctAnswer: 0 },
  { id: 'q-jlpt-7', packageId: 'pkg-2', text: '「すみません」の意味は？', options: ['ありがとう', 'すいません/ごめんなさい', 'おはよう', 'さようなら'], correctAnswer: 1 },
  { id: 'q-jlpt-8', packageId: 'pkg-2', text: '「映画」の読み方は？', options: ['えいが', 'えが', 'えいか', 'えか'], correctAnswer: 0 },
  { id: 'q-jlpt-9', packageId: 'pkg-2', text: '「先生____教えてくれました。」正しい助詞は？', options: ['は', 'が', 'を', 'に'], correctAnswer: 1 },
  { id: 'q-jlpt-10', packageId: 'pkg-2', text: '「飲む」の過去形は？', options: ['飲んだ', '飲みた', '飲った', '飲ぬだ'], correctAnswer: 0 },
  // JFT Pkg 3
  { id: 'q-jft-1', packageId: 'pkg-3', text: 'あいさつ：朝、人に会ったとき何と言いますか？', options: ['こんばんは', 'おはようございます', 'さようなら', 'おやすみなさい'], correctAnswer: 1 },
  { id: 'q-jft-2', packageId: 'pkg-3', text: '「すきです」は英語でどういう意味ですか？', options: ['I hate', 'I like', 'I go', 'I eat'], correctAnswer: 1 },
  { id: 'q-jft-3', packageId: 'pkg-3', text: '「3時」は何時ですか？', options: ['1:00', '2:00', '3:00', '4:00'], correctAnswer: 2 },
  { id: 'q-jft-4', packageId: 'pkg-3', text: '「りんご」は何ですか？', options: ['Orange', 'Apple', 'Banana', 'Grape'], correctAnswer: 1 },
  { id: 'q-jft-5', packageId: 'pkg-3', text: '「にほんご」の漢字は？', options: ['日本語', '二本語', '日本後', '日本五'], correctAnswer: 0 },
  // SSW Care Pkg 4
  { id: 'q-care-1', packageId: 'pkg-4', text: '介護（かいご）の意味は？', options: ['Pertanian', 'Perawatan/Pengasuhan', 'Memasak', 'Membangun'], correctAnswer: 1 },
  { id: 'q-care-2', packageId: 'pkg-4', text: '利用者（りようしゃ）が転倒したとき、最初に何をしますか？', options: ['写真を撮る', '安全を確認して声をかける', '無視する', '食事を出す'], correctAnswer: 1 },
  { id: 'q-care-3', packageId: 'pkg-4', text: '「入浴介助」とは何ですか？', options: ['食事の手伝い', 'お風呂の手伝い', '掃除', '買い物'], correctAnswer: 1 },
  { id: 'q-care-4', packageId: 'pkg-4', text: 'バイタルサインに含まれないものは？', options: ['体温', '血圧', '脈拍', '身長'], correctAnswer: 3 },
  { id: 'q-care-5', packageId: 'pkg-4', text: '認知症の方への対応で正しいのは？', options: ['大声で叱る', '否定しないで寄り添う', '無視する', '一人にする'], correctAnswer: 1 },
  // SSW Food Pkg 5
  { id: 'q-food-1', packageId: 'pkg-5', text: 'HACCP とは何の略ですか？', options: ['Hazard Analysis Critical Control Point', 'Health And Clean Cooking Plan', 'High Authority Food Program', 'Hygiene Assessment Control Plan'], correctAnswer: 0 },
  { id: 'q-food-2', packageId: 'pkg-5', text: '食品を保存する適切な温度は？', options: ['30°C以上', '10°C以下', '50°C', '常温'], correctAnswer: 1 },
  { id: 'q-food-3', packageId: 'pkg-5', text: '手洗いのタイミングとして正しいのは？', options: ['帰宅時のみ', 'トイレの後と調理前', '食後のみ', '週に一回'], correctAnswer: 1 },
  { id: 'q-food-4', packageId: 'pkg-5', text: '食中毒の原因になりやすいのは？', options: ['よく加熱した食品', '生の鶏肉', '缶詰', '冷凍食品'], correctAnswer: 1 },
  { id: 'q-food-5', packageId: 'pkg-5', text: '「消費期限」と「賞味期限」の違いは？', options: ['同じ意味', '消費期限は安全期限、賞味期限はおいしさの期限', '賞味期限の方が厳しい', '関係ない'], correctAnswer: 1 },
  // SSW Agri Pkg 6
  { id: 'q-agri-1', packageId: 'pkg-6', text: '田植え（たうえ）とは何ですか？', options: ['魚を釣る', '稲を植える', '木を切る', '花を飾る'], correctAnswer: 1 },
  { id: 'q-agri-2', packageId: 'pkg-6', text: '農薬を使うとき注意することは？', options: ['大量に使う', '使用量と使用方法を守る', '素手で触る', '風の強い日に撒く'], correctAnswer: 1 },
  { id: 'q-agri-3', packageId: 'pkg-6', text: '「収穫」の意味は？', options: ['種を蒔く', '作物を取り入れる', '土を耕す', '水をやる'], correctAnswer: 1 },
  { id: 'q-agri-4', packageId: 'pkg-6', text: 'ビニールハウスの利点は？', options: ['コストが安い', '温度管理ができる', '害虫が増える', '水が不要'], correctAnswer: 1 },
  { id: 'q-agri-5', packageId: 'pkg-6', text: '有機農業とは何ですか？', options: ['化学肥料を大量に使う農業', '農薬や化学肥料を使わない農業', '機械だけで行う農業', '水を使わない農業'], correctAnswer: 1 },
];

export const dummyResults: ExamResult[] = [
  { id: 'res-1', userId: 'user-1', packageId: 'pkg-1', categoryId: 'cat-jlpt', score: 80, totalQuestions: 5, correctAnswers: 4, answers: {}, date: '2026-01-15' },
  { id: 'res-2', userId: 'user-2', packageId: 'pkg-3', categoryId: 'cat-jft', score: 60, totalQuestions: 5, correctAnswers: 3, answers: {}, date: '2026-01-20' },
];
