export type SellerStatus = "active" | "inactive";
export type VerifyStatus = "pending" | "approved" | "rejected";
export type AccountStatus = "active" | "suspended";

export interface PendingSeller {
  id: string;
  name: string;
  store: string;
  category: string;
  storePhoto: string;
  ktpPhoto: string;
  selfiePhoto: string;
  agreementDoc: string;
  registeredAt: string;
  phone: string;
  email: string;
}

export interface VerifyHistory {
  id: string;
  name: string;
  store: string;
  status: VerifyStatus;
  verifiedAt: string;
}

export interface Seller {
  id: string;
  store: string;
  owner: string;
  status: SellerStatus;
  rating: number;
  totalOrder: number;
  revenue: number;
  category: string;
  joined: string;
  openTime: string;
  closeTime: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrder: number;
  status: AccountStatus;
  joined: string;
  lastActive: string;
}

export interface ActivityItem {
  id: string;
  type:
    | "login"
    | "approve"
    | "reject"
    | "delete_customer"
    | "open_store"
    | "close_store"
    | "delete_store";
  actor: string;
  description: string;
  time: string;
}

const stores = [
  "Warung Bu Tini", "Kopi Senja", "Nasi Goreng Pak Budi", "Ayam Geprek Mantul",
  "Es Teh Nusantara", "Bakso Beranak", "Sushi Kampus", "Roti Bakar 88",
  "Mie Ayam Jaya", "Dimsum Corner", "Salad Sehat", "Martabak Manis Legend",
];

const owners = [
  "Tini Suryani", "Andi Pratama", "Budi Santoso", "Maya Lestari",
  "Rizky Hidayat", "Dewi Anggraini", "Kenji Tanaka", "Putri Rahmawati",
  "Joko Widodo", "Siti Aisyah", "Bayu Aji", "Lukman Hakim",
];

const categories = ["Makanan Berat", "Minuman", "Snack", "Dessert", "Sehat"];

const img = (seed: string) =>
  `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=60&sig=${seed}`;

const ktpImg = (seed: string) =>
  `https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=60&sig=${seed}`;

const selfieImg = (seed: number) =>
  `https://i.pravatar.cc/300?img=${(seed % 60) + 1}`;

const hours: [string, string][] = [
  ["08:00", "17:00"], ["09:00", "21:00"], ["07:30", "16:00"],
  ["10:00", "22:00"], ["08:30", "20:00"], ["11:00", "23:00"],
];

export const pendingSellers: PendingSeller[] = Array.from({ length: 6 }, (_, i) => ({
  id: `PS-${1001 + i}`,
  name: owners[i],
  store: stores[i],
  category: categories[i % categories.length],
  storePhoto: img(String(i)),
  ktpPhoto: ktpImg(String(i)),
  selfiePhoto: selfieImg(i + 10),
  registeredAt: `2024-06-${String(10 + i).padStart(2, "0")}`,
  phone: `+62 812-3456-${1000 + i}`,
  email: `${owners[i].split(" ")[0].toLowerCase()}@mail.com`,
}));

export const verifyHistory: VerifyHistory[] = [
  { id: "VH-1", name: "Rina Wati", store: "Soto Lamongan", status: "approved", verifiedAt: "2024-06-09" },
  { id: "VH-2", name: "Hendra Gunawan", store: "Burger Station", status: "approved", verifiedAt: "2024-06-08" },
  { id: "VH-3", name: "Toni Saputra", store: "Cireng Crispy", status: "rejected", verifiedAt: "2024-06-07" },
  { id: "VH-4", name: "Wulan Sari", store: "Jus Buah Segar", status: "approved", verifiedAt: "2024-06-06" },
  { id: "VH-5", name: "Fajar Nugraha", store: "Pecel Madiun", status: "rejected", verifiedAt: "2024-06-05" },
  { id: "VH-6", name: "Citra Dewi", store: "Boba Time", status: "approved", verifiedAt: "2024-06-04" },
];

export const sellers: Seller[] = stores.map((store, i) => ({
  id: `S-${2001 + i}`,
  store,
  owner: owners[i],
  status: i % 4 === 0 ? "inactive" : "active",
  rating: Math.round((3.8 + (i % 5) * 0.25) * 10) / 10,
  totalOrder: 320 + i * 87,
  revenue: 4_500_000 + i * 1_250_000,
  category: categories[i % categories.length],
  joined: `2023-${String((i % 12) + 1).padStart(2, "0")}-12`,
  openTime: hours[i % hours.length][0],
  closeTime: hours[i % hours.length][1],
}));

const custNames = [
  "Adi Nugroho", "Bella Safira", "Cahyo Pratomo", "Dina Marlina", "Eko Saputra",
  "Fina Oktaviani", "Galih Permana", "Hana Yulianti", "Irfan Maulana", "Jihan Aulia",
  "Krisna Bayu", "Lia Permatasari",
];

export const customers: Customer[] = custNames.map((name, i) => ({
  id: `C-${3001 + i}`,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@kampus.ac.id`,
  phone: `+62 813-7788-${2000 + i}`,
  totalOrder: 5 + i * 11,
  status: i % 5 === 0 ? "suspended" : "active",
  joined: `2024-0${(i % 9) + 1}-15`,
  lastActive: `${i + 1} jam lalu`,
}));

export const activities: ActivityItem[] = [
  { id: "A1", type: "login", actor: "Admin Rama", description: "Login ke panel admin", time: "Hari ini, 09:12" },
  { id: "A2", type: "approve", actor: "Admin Rama", description: "Menyetujui penjual Warung Bu Tini", time: "Hari ini, 09:30" },
  { id: "A3", type: "delete_customer", actor: "Admin Sari", description: "Menghapus akun customer Adi Nugroho", time: "Hari ini, 10:05" },
  { id: "A4", type: "reject", actor: "Admin Rama", description: "Menolak penjual Cireng Crispy", time: "Kemarin, 16:40" },
  { id: "A5", type: "open_store", actor: "Admin Sari", description: "Membuka toko Kopi Senja", time: "Kemarin, 14:22" },
  { id: "A6", type: "close_store", actor: "Admin Rama", description: "Menutup toko Mie Ayam Jaya", time: "Kemarin, 11:18" },
  { id: "A7", type: "delete_store", actor: "Admin Rama", description: "Menghapus toko Cireng Crispy", time: "2 hari lalu, 13:00" },
  { id: "A8", type: "login", actor: "Admin Sari", description: "Login ke panel admin", time: "2 hari lalu, 08:50" },
  { id: "A9", type: "approve", actor: "Admin Sari", description: "Menyetujui penjual Boba Time", time: "2 hari lalu, 09:15" },
];

export const dailySales = [
  { day: "Sen", value: 42 }, { day: "Sel", value: 58 }, { day: "Rab", value: 51 },
  { day: "Kam", value: 73 }, { day: "Jum", value: 91 }, { day: "Sab", value: 110 },
  { day: "Min", value: 84 },
];

export const monthlySales = [
  { month: "Jan", value: 1200 }, { month: "Feb", value: 1480 }, { month: "Mar", value: 1320 },
  { month: "Apr", value: 1760 }, { month: "Mei", value: 2010 }, { month: "Jun", value: 2380 },
  { month: "Jul", value: 2210 }, { month: "Agu", value: 2640 }, { month: "Sep", value: 2890 },
];

export const topMenus = [
  { name: "Ayam Geprek Sambal Matah", store: "Ayam Geprek Mantul", sold: 1240 },
  { name: "Es Teh Manis Jumbo", store: "Es Teh Nusantara", sold: 1180 },
  { name: "Nasi Goreng Spesial", store: "Nasi Goreng Pak Budi", sold: 960 },
  { name: "Bakso Beranak Komplit", store: "Bakso Beranak", sold: 870 },
  { name: "Kopi Susu Gula Aren", store: "Kopi Senja", sold: 820 },
];

export const peakHours = [
  { hour: "08", value: 20 }, { hour: "10", value: 35 }, { hour: "12", value: 95 },
  { hour: "14", value: 60 }, { hour: "16", value: 45 }, { hour: "18", value: 78 },
  { hour: "20", value: 40 },
];

export const sellerMenu = [
  { name: "Menu Andalan A", sold: 540 },
  { name: "Menu Andalan B", sold: 410 },
  { name: "Menu Andalan C", sold: 320 },
];

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
