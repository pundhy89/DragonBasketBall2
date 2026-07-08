/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TutorialVideo } from '../types';

export const TUTORIALS: TutorialVideo[] = [
  {
    id: 'tut_dribble',
    title: 'Teknik Dribbling (Menggiring Bola Basket)',
    category: 'Dribbling',
    difficulty: 'Pemula',
    description: 'Menguasai bola dengan memantulkannya ke lantai menggunakan satu tangan secara dinamis. Dribbling adalah pondasi mutlak untuk membawa bola melewati lawan dan menginisiasi serangan.',
    duration: '04:15',
    videoPlaceholderId: 'dribble_video',
    steps: [
      'Posisikan kaki selebar bahu dengan lutut sedikit ditekuk (athletic stance) untuk menjaga keseimbangan dan kelincahan tubuh.',
      'Pantulkan bola menggunakan ujung jari-jari tangan, bukan menepuknya dengan telapak tangan. Jari-jari memberikan kontrol dan kelembutan pada bola.',
      'Pertahankan posisi tubuh tetap rendah dan condong ke depan untuk melindungi bola dari jangkauan pemain bertahan.',
      'Gunakan tangan yang tidak mendribble sebagai pelindung (arm bar) di depan tubuh.',
      'Jaga pandangan mata tetap ke depan (court vision) untuk melihat pergerakan kawan dan lawan, jangan menatap bola secara terus menerus.'
    ],
    drills: [
      'Pound Dribble (Statis): Lakukan dribble keras setinggi lutut sebanyak 50 kali kanan dan 50 kali kiri tanpa bergerak.',
      'Crossover Drill: Pantulkan bola berpindah dari tangan kanan ke kiri secara cepat dengan lintasan rendah di depan lutut.',
      'Figure-8 Dribble: Giring bola membentuk angka 8 melewati celah di antara kedua kaki dalam posisi statis.'
    ],
    tips: [
      'Latihlah tangan non-dominan (tangan lemah) Anda dua kali lebih sering agar memiliki kontrol bola yang seimbang.',
      'Kunci dari dribble yang hebat adalah "active fingertips" (ujung jari aktif) dan pergelangan tangan yang lentur.'
    ]
  },
  {
    id: 'tut_shooting',
    title: 'Teknik Shooting (Mekanisme Tembakan BEEF)',
    category: 'Shooting',
    difficulty: 'Menengah',
    description: 'Mekanisme menembak bola dengan akurasi tinggi menggunakan metode BEEF (Balance, Eyes, Elbow, Follow Through) untuk mencetak poin secara konsisten.',
    duration: '06:20',
    videoPlaceholderId: 'shooting_video',
    steps: [
      'B (Balance): Seimbangkan kaki sejajar bahu dengan kaki dominan sedikit lebih maju. Tekuk lutut untuk menghimpun tenaga dari lantai.',
      'E (Eyes): Pusatkan pandangan mata langsung ke target sasaran, yaitu bibir belakang ring basket atau bagian dalam net.',
      'E (Elbow): Posisikan siku tangan penembak tegak lurus (membentuk sudut 90 derajat) di bawah bola, mengarah langsung ke ring.',
      'F (Follow Through): Setelah mendorong bola ke atas dengan lentur, jentikkan pergelangan tangan (wrist flick) ke depan bawah seperti memasukkan tangan ke dalam stoples (cookie jar). Tahan posisi ini hingga bola masuk.'
    ],
    drills: [
      'Form Shooting: Berdiri hanya 1 meter di depan ring, lakukan tembakan satu tangan untuk menyempurnakan bentuk rilis bola tanpa bantuan papan.',
      'Around the Key: Lakukan 5 tembakan dari 5 titik berbeda di sekitar area free-throw lane secara berurutan.',
      'Free-Throw Routine: Kembangkan rutinitas psikologis yang konsisten (misal: dribble 3 kali, ambil napas dalam, lalu shoot).'
    ],
    tips: [
      'Sebagian besar tenaga tembakan berasal dari kaki Anda. Jangan hanya mengandalkan kekuatan otot lengan.',
      'Bola harus berputar ke belakang (backspin) secara mulus; ini membantu bola tetap masuk meskipun mengenai rim.'
    ]
  },
  {
    id: 'tut_passing',
    title: 'Teknik Passing (Chest, Bounce, & Overhead Pass)',
    category: 'Passing',
    difficulty: 'Pemula',
    description: 'Mengalirkan bola ke rekan satu tim dengan cepat dan tepat. Passing yang efisien memecah pertahanan lawan dan menciptakan peluang mencetak gol terbaik.',
    duration: '05:08',
    videoPlaceholderId: 'passing_video',
    steps: [
      'Chest Pass (Operan Dada): Pegang bola dengan kedua tangan di depan dada. Langkahkan satu kaki ke depan untuk daya dorong, dorong bola sekuat tenaga ke arah dada rekan setim dengan posisi ibu jari berakhir menghadap ke bawah.',
      'Bounce Pass (Operan Pantul): Lakukan gerakan yang mirip dengan chest pass, namun arahkan bola agar memantul di lantai sekitar 2/3 jarak di antara Anda dan penerima bola.',
      'Overhead Pass (Operan Atas Kepala): Pegang bola di atas kepala, langkahkan kaki, lalu ayunkan bola ke depan untuk melewati jangkauan tangan bek lawan yang tinggi.'
    ],
    drills: [
      'Wall Passing: Berdiri 3 meter dari tembok, lakukan chest pass dan bounce pass beruntun secepat mungkin untuk memperkuat otot tangan.',
      'Partner Passing on the Move: Berdua dengan rekan setim berlari sejajar sepanjang lapangan sambil saling mengoper bola tanpa dribble.',
      'Target Passing: Buat lingkaran target di dinding, latih ketepatan operan Anda agar selalu mengenai pusat lingkaran.'
    ],
    tips: [
      'Jangan pernah memandang langsung ke arah rekan setim sebelum mengoper ( telegraphing ). Gunakan pandangan periferi (no-look pass) untuk mengelabui lawan.',
      'Sambutlah bola operan dengan melangkah maju ke arah bola, jangan menunggu bola datang diam di tempat.'
    ]
  },
  {
    id: 'tut_defense',
    title: 'Teknik Defensive Stance & Lateral Sliding',
    category: 'Defense',
    difficulty: 'Mahir',
    description: 'Seni menghentikan laju penyerang lawan dan mencegah mereka mencetak skor. Pertahanan yang hebat memenangkan kejuaraan!',
    duration: '05:45',
    videoPlaceholderId: 'defense_video',
    steps: [
      'Buka kaki sangat lebar (lebih lebar dari bahu) dan turunkan pusat gravitasi tubuh Anda dengan menekuk lutut sedalam mungkin.',
      'Bentangkan kedua lengan ke samping luar untuk menghalangi jalur operan dan menutup pandangan penyerang lawan.',
      'Gunakan gerakan kaki menyamping (lateral slide). Dorong tubuh menggunakan kaki belakang dan meluncurlah, jangan sekali-kali menyilangkan kedua kaki Anda.',
      'Pertahankan jarak sepanjang satu rentangan lengan dari pembawa bola untuk mengantisipasi drive cepat maupun tembakan mendadak.',
      'Selalu aktif berkomunikasi dengan rekan tim untuk mengumumkan posisi bola, screen lawan, atau melakukan pertolongan defense (help defense).'
    ],
    drills: [
      'Zig-Zag Defensive Slide: Ikuti garis lapangan basket secara zig-zag dalam posisi defensive stance rendah secepat mungkin.',
      'Close-Out Drill: Lari kencang dari bawah ring ke arah penyerang di perimeter, lalu rem gerakan Anda dengan langkah-langkah kecil cepat (choppy steps) sambil mengangkat satu tangan.',
      'Mirror Drill: Berdiri berhadapan dengan rekan, ikuti gerakan geser menyamping rekan Anda kemana pun ia pergi seperti bayangan di cermin.'
    ],
    tips: [
      'Fokuskan pandangan mata Anda pada bagian pinggul/perut (midsection) penyerang, bukan pada gerakan bola atau bahu mereka. Pinggul tidak pernah berbohong.',
      'Defense bukanlah tentang kontak fisik kasar, melainkan tentang kecepatan kaki, antisipasi ruang, dan kegigihan mental.'
    ]
  }
];
export const TUTORIAL_CATEGORIES = ['Semua', 'Dribbling', 'Shooting', 'Passing', 'Defense'];
