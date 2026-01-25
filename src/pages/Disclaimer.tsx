import { AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
const Disclaimer = () => {
  return <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-primary py-12">
          <div className="container-main">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Disclaimer
            </h1>
            <p className="text-primary-foreground/70 mt-2">
              Pemberitahuan Penting untuk Pengguna
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-main max-w-4xl">
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 mb-8 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-foreground">Harap baca disclaimer ini dengan seksama sebelum menggunakan layanan Mypropertyku. Dengan menggunakan Platform, Anda menyatakan telah memahami dan menyetujui semua ketentuan dalam disclaimer ini.</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Status Platform</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Mypropertyku adalah platform marketplace yang menghubungkan penjual dan pembeli properti. <strong className="text-foreground">Mypropertyku bukan pemilik, 
                    agen, atau broker properti yang terdaftar di Platform.</strong>
                  </p>
                  <p>Mypropertyku tidak terlibat langsung dalam transaksi jual-beli atau sewa-menyewa properti antara Pengguna.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Informasi Properti</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Semua informasi properti yang ditampilkan di Platform berasal dari pihak ketiga (Penjual). Meskipun Mypropertyku berupaya memverifikasi informasi, kami tidak dapat menjamin keakuratan, kelengkapan, atau keterkinian semua informasi.<strong className="text-foreground">kami tidak dapat menjamin 
                    keakuratan, kelengkapan, atau keterkinian semua informasi.</strong>
                  </p>
                  <p>
                    Informasi seperti harga, luas, spesifikasi, dan foto dapat berubah 
                    sewaktu-waktu tanpa pemberitahuan.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Proses Verifikasi</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Verifikasi yang dilakukan Mypropertyku mencakup pengecekan dokumen sertifikat dan status sengketa berdasarkan data yang tersedia pada saat verifikasi.</p>
                  <p className="font-medium text-foreground">Verifikasi Mypropertyku TIDAK mencakup:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Jaminan bahwa properti bebas dari masalah di masa depan</li>
                    <li>Penilaian kondisi fisik atau struktural bangunan</li>
                    <li>Verifikasi harga pasar yang wajar</li>
                    <li>Pemeriksaan aspek lingkungan atau zonasi terkini</li>
                    <li>Due diligence hukum yang komprehensif</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Risiko Transaksi</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Semua transaksi properti mengandung risiko. Pengguna bertanggung jawab 
                    penuh atas keputusan untuk membeli, menjual, atau menyewa properti.
                  </p>
                  <p>Mypropertyku menyarankan setiap pembeli untuk:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Melakukan survei fisik properti secara langsung</li>
                    <li>Menyewa jasa notaris/PPAT untuk pengecekan legal</li>
                    <li>Memverifikasi sertifikat ke BPN (Badan Pertanahan Nasional)</li>
                    <li>Mengecek riwayat kepemilikan properti</li>
                    <li>Memahami semua dokumen sebelum menandatangani</li>
                    <li>Menggunakan rekening escrow untuk transaksi besar</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Batasan Tanggung Jawab</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Sejauh diizinkan oleh hukum, Mypropertyku tidak bertanggung jawab atas:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Kerugian finansial akibat transaksi yang dilakukan melalui Platform</li>
                    <li>Kerugian akibat informasi yang tidak akurat atau menyesatkan dari Penjual</li>
                    <li>Sengketa properti yang terjadi setelah transaksi</li>
                    <li>Penipuan yang dilakukan oleh Pengguna lain</li>
                    <li>Gangguan layanan atau keamanan Platform</li>
                    <li>Kehilangan data atau akses akun</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Konten Pihak Ketiga</h2>
                <p className="text-muted-foreground">Platform mungkin berisi tautan ke website pihak ketiga atau konten yang tidak dikendalikan oleh Mypropertyku. Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik website pihak ketiga tersebut.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Perubahan Layanan</h2>
                <p className="text-muted-foreground">Mypropertyku berhak untuk mengubah, menangguhkan, atau menghentikan layanan atau fitur tertentu kapan saja tanpa pemberitahuan sebelumnya.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Nasihat Profesional</h2>
                <div className="bg-muted/50 rounded-xl p-6">
                  <p className="text-foreground font-medium mb-2">Rekomendasi Kami</p>
                  <p className="text-muted-foreground">
                    Untuk transaksi properti, kami sangat menyarankan untuk berkonsultasi 
                    dengan profesional yang berkualifikasi seperti notaris, pengacara properti, 
                    surveyor tanah, atau konsultan keuangan sebelum mengambil keputusan.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Kontak</h2>
                <p className="text-muted-foreground mb-4">
                  Jika Anda memiliki pertanyaan tentang disclaimer ini, silakan hubungi:
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground font-medium">Mypropertyku</p>
                  <p className="text-muted-foreground">Email: support@mypropertyku.id</p>
                  <p className="text-muted-foreground">Telepon: (021) 1234-5678</p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Disclaimer;